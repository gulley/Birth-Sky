/**
 * Main application entry point
 */

import { ZODIAC_SIGNS, getZodiacSign } from './config/zodiac-config.js';
import { CELESTIAL_OBJECTS, getCelestialObject } from './config/celestial-config.js';
import { calculateCelestialCoordinates, calculateMarsGeoVector, calculatePlanetPositions } from './utils/astronomy-calc.js';
import { adjustColor } from './utils/color-helpers.js';
import { loadCustomFont } from './utils/font-loader.js';
import { initializeCanvas, drawCelestialChart, drawOrbitCircles, drawZodiacSigns } from './drawing/chart-base.js';
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

    // Initialize date picker with current date and time
    const now = new Date();
    const dateString = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
    document.getElementById('date-picker').value = dateString;
    
    // Load the custom font before rendering
    loadCustomFont(function() {
        // Initial draw on page load
        updateCelestialPositions();
    });

    // Update immediately when date picker changes
    document.getElementById('date-picker').addEventListener('change', function() {
        const dateInput = this.value;
        if (dateInput) {
            const selectedDate = new Date(dateInput);
            updateCelestialPositions(selectedDate);
        } else {
            updateCelestialPositions();
        }
    });

    // Current time button - use current time
    document.getElementById('current-time-btn').addEventListener('click', function() {
        const now = new Date();
        const dateString = now.toISOString().slice(0, 16);
        document.getElementById('date-picker').value = dateString;
        updateCelestialPositions(now);
    });
    
    // True zodiac toggle
    document.getElementById('true-zodiac-toggle').addEventListener('change', function() {
        // Polarity reversed: checked = traditional, unchecked = true zodiac
        startZodiacTransition(
            !this.checked, // true when unchecked (true zodiac), false when checked (traditional)
            ZODIAC_SIGNS,
            function() {
                // Get the current date from the date picker
                const dateInput = document.getElementById('date-picker').value;
                if (dateInput) {
                    updateCelestialPositions(new Date(dateInput));
                } else {
                    updateCelestialPositions();
                }
            }
        );
    });
});

/**
 * Update celestial object positions in the UI
 * @param {Date} date - The date to calculate for (optional, defaults to current date)
 */
function updateCelestialPositions(date) {
    // Use provided date or current time
    const displayDate = date || new Date();
    
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
            
            // Update data display HTML
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
                    <small>RA: ${formattedRA}h, Dec: ${formattedDec}°</small>
                </div>
            `;
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
    drawCelestialChart(ZODIAC_SIGNS, objectData);
    
    // Draw orbit circles
    drawOrbitCircles(CELESTIAL_OBJECTS);
    
    // Draw zodiac ring
    drawZodiacSigns(ZODIAC_SIGNS);

    // Then, draw Earth medallion and all planet medallions on top of stalks
    drawEarthMedallion();
    
    // Draw all other medallions in reverse radial order (inner on top)
    const sortedObjectData = [...objectData].sort((a, b) => b.info.radius - a.info.radius);
    for (const object of sortedObjectData) {
        drawCelestialMedallion(object.name, object.info, object.longitude, object.info.radius);
    }
    
    // Update celestial object data display
    document.getElementById('planet-data').innerHTML = objectDataHTML;
    
    // Calculate planet positions
    const planetPositions = calculatePlanetPositions(displayDate);
    let planetPositionsHTML = '';
    planetPositions.forEach(planet => {
        planetPositionsHTML += `<div>${planet.name}: ${planet.position.x.toFixed(2)}, ${planet.position.y.toFixed(2)}, ${planet.position.z.toFixed(2)}</div>`;
    });
    document.getElementById('planet-positions').innerHTML = planetPositionsHTML;
}
