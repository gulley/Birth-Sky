/**
 * Main application entry point
 */

import { ZODIAC_SIGNS, getZodiacSign } from './config/zodiac-config.js';
import { CELESTIAL_OBJECTS, getCelestialObject } from './config/celestial-config.js';
import { calculateCelestialCoordinates, calculateMarsGeoVector, calculatePlanetPositions } from './utils/astronomy-calc.js';
import { adjustColor } from './utils/color-helpers.js';
import { generatePlanetInfoCard } from './utils/ui-templates.js';
import { loadCustomFont } from './utils/font-loader.js';
import { initializeCanvas, drawCelestialChart, drawOrbitCircles, drawZodiacSigns, getCanvasContext } from './drawing/chart-base.js';
import { drawEarthMedallion, drawCelestialMedallion, drawCelestialStalk } from './drawing/medallions.js';
import { startZodiacTransition, isZodiacAnimating, cancelZodiacTransition } from './animation/zodiac-transition.js';
import { ZODIAC_SYMBOL_MAP } from '../planet-symbols.js';

// Canvas context and dimensions
let canvas, ctx, centerX, centerY, maxRadius;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas
    canvas = document.getElementById('planet-chart');
    const canvasContext = initializeCanvas(canvas);
    ctx = canvasContext.ctx;
    centerX = canvasContext.centerX;
    centerY = canvasContext.centerY;
    maxRadius = canvasContext.maxRadius;

    // Initialize date picker with current local date
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`; // Format: YYYY-MM-DD in local time
    document.getElementById('date-picker').value = dateString;
    
    // Load the custom font before rendering
    loadCustomFont(function() {
        // Initial draw on page load
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        updateCelestialPositions(midnight);
    });

    // Update immediately when date picker changes
    const datePicker = document.getElementById('date-picker');
    datePicker.addEventListener('change', function() {
        const dateInput = this.value;
        if (dateInput) {
            // Parse as date only (local time, no time component)
            const [year, month, day] = dateInput.split('-');
            const selectedDate = new Date(year, month - 1, day);
            updateCelestialPositions(selectedDate);
        } else {
            updateCelestialPositions();
        }
    });

    // Enable continuous date increment/decrement with arrow keys
    datePicker.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const dateInput = this.value;
            if (!dateInput) return;
            let [year, month, day] = dateInput.split('-').map(Number);
            // JS Date: month is 0-based
            let dateObj = new Date(year, month - 1, day);
            if (e.key === 'ArrowRight') {
                dateObj.setDate(dateObj.getDate() + 1);
            } else {
                dateObj.setDate(dateObj.getDate() - 1);
            }
            // Format YYYY-MM-DD with leading zeros
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const newDateStr = `${yyyy}-${mm}-${dd}`;
            this.value = newDateStr;
            updateCelestialPositions(dateObj);
        }
    });

    // Current date button - use current date and time
    document.getElementById('current-time-btn').addEventListener('click', function() {
        // Use the actual current date and time
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        
        // Format the date for the date picker (date only)
        const dateString = `${yyyy}-${mm}-${dd}`;
        document.getElementById('date-picker').value = dateString;
        
        // Use the actual current time for the celestial calculations
        updateCelestialPositions(now);
    });
    
    // True zodiac toggle
    document.getElementById('true-zodiac-toggle').addEventListener('change', function() {
        // Get the current reference date before starting animation
        const dateInput = document.getElementById('date-picker').value;
        let referenceDate;
        
        if (dateInput) {
            // Always use midnight for the selected date to ensure consistency
            const [year, month, day] = dateInput.split('-');
            referenceDate = new Date(year, month - 1, day);
        } else {
            // Fallback to today at midnight
            const now = new Date();
            referenceDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        
        // Animate zodiac transition and always redraw the full chart
        startZodiacTransition(
            !this.checked, // true when unchecked (true zodiac), false when checked (traditional)
            ZODIAC_SIGNS,
            function(interpolatedSigns) {
                // Always use the same reference date throughout the animation
                updateCelestialPositions(referenceDate, interpolatedSigns);
            }
        );
    });
});

/**
 * Update celestial object positions in the UI
 * @param {Date} date - The date to calculate for (optional, defaults to current date)
 */
function updateCelestialPositions(date, zodiacSignsOverride) {
    // Use provided date or current time
    const displayDate = date instanceof Date && !isNaN(date) ? date : new Date();
    
    // Calculate celestial object positions and update the data display
    let objectDataHTML = '';
    const objectData = [];
    
    // First, calculate all positions
    for (const [objectName, objectInfo] of Object.entries(CELESTIAL_OBJECTS)) {
        try {
            // Try to use the astronomy library first
            const equatorial = calculateCelestialCoordinates(objectInfo, displayDate);
            
            // Convert right ascension to ecliptic longitude (simplified)
            // This is a simplification - in reality, the conversion is more complex
            const longitude = (equatorial.ra * 15) % 360; // RA is in hours, convert to degrees
            
            // Store the data for later use
            objectData.push({
                name: objectName,
                info: objectInfo,
                longitude: longitude,
                rightAscension: equatorial.ra,
                declination: equatorial.dec
            });
            
            // Get the zodiac sign for this celestial object
            const zodiacSign = getZodiacSign(longitude);
            
            // Format coordinates with 2 decimal places
            const formattedLongitude = longitude.toFixed(2);
            const formattedRA = equatorial.ra.toFixed(2);
            const formattedDec = equatorial.dec.toFixed(2);
            
            // Get custom zodiac symbol if available
            const customZodiacSymbol = ZODIAC_SYMBOL_MAP[zodiacSign.name];
            
            // Update data display HTML using the shared template function
            objectDataHTML += generatePlanetInfoCard(objectInfo, zodiacSign);
        } catch (error) {
            console.error(`Error calculating position for ${objectName}:`, error);
            
            // Use a default position for the object (0 degrees)
            const defaultLongitude = 0;
            
            // Store the data with default values
            objectData.push({
                name: objectName,
                info: objectInfo,
                longitude: defaultLongitude,
                rightAscension: 0,
                declination: 0
            });
            
            // Get the zodiac sign for this default position
            const zodiacSign = getZodiacSign(defaultLongitude);
            
            // Get custom zodiac symbol if available
            const customZodiacSymbol = ZODIAC_SYMBOL_MAP[zodiacSign.name];
            
            // Update data display HTML with error indication
            objectDataHTML += `
                <div class="planet-info" style="background-color: ${adjustColor(objectInfo.color, -40)}; border: 1px solid ${adjustColor(objectInfo.color, 20)}">
                    <span class="planet-symbol" style="color: ${objectInfo.color}">
                        ${objectInfo.customSymbol || objectInfo.symbol}
                    </span>
                    <strong>${objectInfo.name}</strong>
                    <br>
                    <span class="${customZodiacSymbol ? 'planet-symbol' : ''}" style="font-size: 18px;">
                        ${customZodiacSymbol || zodiacSign.symbol}
                    </span> 
                    ${zodiacSign.name}
                    <br>
                    <small>(Calculation error)</small>
                </div>
            `;
        }
    }
    
    // Draw the base chart with stalks
    const zodiacToUse = zodiacSignsOverride || ZODIAC_SIGNS;
    drawCelestialChart(zodiacToUse, objectData);
    
    // Draw orbit circles
    drawOrbitCircles(CELESTIAL_OBJECTS);
    
    // Draw zodiac ring
    drawZodiacSigns(zodiacToUse);

    // Prepare fixed stars: Antares, Regulus, Spica (draw AFTER zodiac ring and masking circle)
    const fixedStars = [
        {
            name: 'Antares',
            longitude: 247.35, // RA (16h 29m 24s) in degrees
            declination: -26.43,
            symbol: '%'
        },
        {
            name: 'Regulus',
            longitude: 152.09, // RA (10h 08m 22s) in degrees
            declination: 11.97,
            symbol: '%'
        },
        {
            name: 'Spica',
            longitude: 201.29, // RA (13h 25m 11s) in degrees
            declination: -11.16,
            symbol: '%'
        }
    ];
    const moonColor = CELESTIAL_OBJECTS['moon'].color;
    // Use maxRadius from the canvas context so the stars are always visible
    const { maxRadius } = ctx ? getCanvasContext() : { maxRadius: 300 };
    const starRadius = maxRadius - 30;
    const fixedStarMedallions = fixedStars.map(star => ({
        ...star,
        color: moonColor,
        radius: starRadius,
        isFixedStar: true
    }));
    for (const star of fixedStarMedallions) {
        drawCelestialMedallion(
            star.name,
            {
                symbol: star.symbol,
                customSymbol: star.symbol, // Astronomicon "%"
                name: star.name,
                color: star.color,
                radius: star.radius,
                isFixedStar: true
            },
            star.longitude,
            star.radius
        );
    }
    
    // Then, draw Earth medallion and all planet medallions on top of stalks
    drawEarthMedallion();
    
    // Draw all other medallions in reverse radial order (inner on top)
    const sortedObjectData = [...objectData].sort((a, b) => b.info.radius - a.info.radius);
    for (const object of sortedObjectData) {
        drawCelestialMedallion(object.name, object.info, object.longitude, object.info.radius);
    }
    
    // Draw evening sky arc on the outermost ring AFTER all medallions are drawn
    // Find the sun's longitude from objectData
    const sunData = objectData.find(obj => obj.name === 'sun');
    if (sunData) {
        drawEveningSkyArc(sunData.longitude, 45, starRadius);
    }

    
    // --- Tooltip hover logic ---
    // Store positions for hit testing
    const hoverObjects = [...objectData.map(obj => ({
        name: obj.name,
        info: {
            ...obj.info,
            rightAscension: obj.rightAscension,
            declination: obj.declination
        },
        longitude: obj.longitude,
        radius: obj.info.radius
    }))];
    // Add fixed stars to hover targets
    for (const star of fixedStarMedallions) {
        hoverObjects.push({
            name: star.name,
            info: {
                ...star,
                rightAscension: star.rightAscension !== undefined ? star.rightAscension : (star.longitude / 15),
                declination: star.declination !== undefined ? star.declination : 0
            },
            longitude: star.longitude,
            radius: star.radius
        });
    }
    // Mouse move event for tooltip
    const canvasElem = document.getElementById('planet-chart');
    const tooltip = document.getElementById('planet-tooltip');
    canvasElem.onmousemove = function(e) {
        const rect = canvasElem.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Find closest object within threshold
        let found = null;
        let minDist = 30; // px threshold
        for (const obj of hoverObjects) {
            // Convert longitude/radius to canvas coordinates
            const radians = (90 - obj.longitude) * Math.PI / 180;
            const x = centerX + obj.radius * Math.cos(radians);
            const y = centerY - obj.radius * Math.sin(radians);
            const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
            if (dist < minDist) {
                found = {obj, x, y};
                minDist = dist;
            }
        }
        if (found) {
            // Show tooltip
            tooltip.style.display = 'block';
            tooltip.style.left = (found.x + rect.left + 20) + 'px';
            tooltip.style.top = (found.y + rect.top - 10) + 'px';
            // Get the zodiac sign for this celestial object
            const zodiacSign = getZodiacSign(found.obj.longitude);
            
            // Use the shared template function for consistent UI
            const html = generatePlanetInfoCard(found.obj.info, zodiacSign, true);
            tooltip.innerHTML = html;
        } else {
            tooltip.style.display = 'none';
        }
    };
    canvasElem.onmouseleave = function() { tooltip.style.display = 'none'; };
    // --- End tooltip hover logic ---
    
    // Calculate planet positions
    const planetPositions = calculatePlanetPositions(displayDate);
    let planetPositionsHTML = '';
    planetPositions.forEach(planet => {
        planetPositionsHTML += `<div>${planet.name}: ${planet.position.x.toFixed(2)}, ${planet.position.y.toFixed(2)}, ${planet.position.z.toFixed(2)}</div>`;
    });
    document.getElementById('planet-positions').innerHTML = planetPositionsHTML;
}
