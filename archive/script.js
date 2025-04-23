// The astronomy-engine library is loaded from CDN and available as a global variable
// No import needed

// --- Configuration ---
// Zodiac signs configuration based on IAU Constellation Boundary Crossings (true astronomical positions)
const TRUE_ZODIAC_SIGNS = [
    { symbol: '♈', name: 'Aries', start: 29.0, end: 53.4 },
    { symbol: '♉', name: 'Taurus', start: 53.4, end: 90.4 },
    { symbol: '♊', name: 'Gemini', start: 90.4, end: 118.2 },
    { symbol: '♋', name: 'Cancer', start: 118.2, end: 138.1 },
    { symbol: '♌', name: 'Leo', start: 138.1, end: 174.1 },
    { symbol: '♍', name: 'Virgo', start: 174.1, end: 217.8 },
    { symbol: '♎', name: 'Libra', start: 217.8, end: 241.1 },
    { symbol: '♏', name: 'Scorpius', start: 241.1, end: 266.5 },
    { symbol: '♐', name: 'Sagittarius', start: 266.5, end: 299.7 },
    { symbol: '♑', name: 'Capricornus', start: 299.7, end: 327.8 },
    { symbol: '♒', name: 'Aquarius', start: 327.8, end: 351.5 },
    { symbol: '♓', name: 'Pisces', start: 351.5, end: 29.0 }
];

// Traditional zodiac signs with equal 30° divisions
const TRADITIONAL_ZODIAC_SIGNS = [
    { symbol: '♈', name: 'Aries', start: 0, end: 30 },
    { symbol: '♉', name: 'Taurus', start: 30, end: 60 },
    { symbol: '♊', name: 'Gemini', start: 60, end: 90 },
    { symbol: '♋', name: 'Cancer', start: 90, end: 120 },
    { symbol: '♌', name: 'Leo', start: 120, end: 150 },
    { symbol: '♍', name: 'Virgo', start: 150, end: 180 },
    { symbol: '♎', name: 'Libra', start: 180, end: 210 },
    { symbol: '♏', name: 'Scorpius', start: 210, end: 240 },
    { symbol: '♐', name: 'Sagittarius', start: 240, end: 270 },
    { symbol: '♑', name: 'Capricornus', start: 270, end: 300 },
    { symbol: '♒', name: 'Aquarius', start: 300, end: 330 },
    { symbol: '♓', name: 'Pisces', start: 330, end: 360 }
];

// Default to true zodiac signs
let ZODIAC_SIGNS = TRUE_ZODIAC_SIGNS;

// Celestial objects configuration with improved orbital elements
const CELESTIAL_OBJECTS = {
    'moon': { 
        symbol: '☽',  // Unicode fallback
        customSymbol: getPlanetSymbol('moon'),
        name: 'Moon', 
        // Lunar orbital elements (simplified)
        period: 27.321582, 
        phaseOffset: 134.9, 
        eccentricity: 0.0549,
        inclination: 5.145,
        color: '#d1d1d1',
        radius: 60
    },
    'sun': { 
        symbol: '☉',  // Unicode fallback
        customSymbol: getPlanetSymbol('sun'),
        name: 'Sun', 
        // Earth's orbital elements (for Sun's apparent motion)
        period: 365.256363, 
        phaseOffset: 280.46, 
        eccentricity: 0.01671022,
        inclination: 0,
        color: '#ffdd44',
        radius: 90
    },
    'mercury': { 
        symbol: '☿',  // Unicode fallback
        customSymbol: getPlanetSymbol('mercury'),
        name: 'Mercury', 
        // Mercury's orbital elements
        period: 87.9691, 
        phaseOffset: 174.796, 
        eccentricity: 0.20563069,
        inclination: 7.00487,
        color: '#8c8c8c',
        radius: 120
    },
    'venus': { 
        symbol: '♀',  // Unicode fallback
        customSymbol: getPlanetSymbol('venus'),
        name: 'Venus', 
        // Venus's orbital elements
        period: 224.7008, 
        phaseOffset: 50.115, 
        eccentricity: 0.00677323,
        inclination: 3.39471,
        color: '#e39e54',
        radius: 150
    },
    'mars': { 
        symbol: '♂',  // Unicode fallback
        customSymbol: getPlanetSymbol('mars'),
        name: 'Mars', 
        // Mars's orbital elements
        period: 686.9796, 
        phaseOffset: 19.3730, 
        eccentricity: 0.09341233,
        inclination: 1.85061,
        color: '#c1440e',
        radius: 180
    },
    'jupiter': { 
        symbol: '♃',  // Unicode fallback
        customSymbol: getPlanetSymbol('jupiter'),
        name: 'Jupiter', 
        // Jupiter's orbital elements
        period: 4332.59, 
        phaseOffset: 18.818, 
        eccentricity: 0.04839266,
        inclination: 1.30530,
        color: '#d8ca9d',
        radius: 210
    },
    'saturn': { 
        symbol: '♄',  // Unicode fallback
        customSymbol: getPlanetSymbol('saturn'),
        name: 'Saturn', 
        // Saturn's orbital elements
        period: 10759.22, 
        phaseOffset: 320.346, 
        eccentricity: 0.05415060,
        inclination: 2.48446,
        color: '#e0bb95',
        radius: 240
    }
};

// --- Canvas Setup ---
let canvas, ctx, centerX, centerY, maxRadius;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('planet-chart');
    ctx = canvas.getContext('2d');
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    maxRadius = Math.min(centerX, centerY) - 50;

    // Initialize date picker with current date and time
    const now = new Date();
    const dateString = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
    document.getElementById('date-picker').value = dateString;
    
    // Load the custom font before rendering
    loadCustomFont();

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

    // Animation variables
    let isAnimating = false;
    let animationStartTime = 0;
    let animationDuration = 1000; // 1 second animation
    let fromZodiacSigns = null;
    let toZodiacSigns = null;
    let animationFrame = null;
    
    // True zodiac toggle
    document.getElementById('true-zodiac-toggle').addEventListener('change', function() {
        // Cancel any ongoing animation
        if (isAnimating && animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        // Set up animation parameters
        fromZodiacSigns = [...ZODIAC_SIGNS]; // Clone current zodiac signs
        
        // Toggle between true and traditional zodiac signs
        if (this.checked) {
            toZodiacSigns = TRUE_ZODIAC_SIGNS;
        } else {
            toZodiacSigns = TRADITIONAL_ZODIAC_SIGNS;
        }
        
        // Start animation
        isAnimating = true;
        animationStartTime = performance.now();
        animateZodiacTransition();
    });
    
    // Function to animate transition between zodiac configurations
    function animateZodiacTransition() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - animationStartTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
        
        // Easing function (ease-in-out)
        const easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Create interpolated zodiac signs
        const interpolatedSigns = fromZodiacSigns.map((fromSign, index) => {
            const toSign = toZodiacSigns[index];
            
            // Interpolate start and end values
            let startInterpolated, endInterpolated;
            
            // Special case for Pisces which crosses the 0° boundary
            if (fromSign.name === 'Pisces' || toSign.name === 'Pisces') {
                // Handle Pisces specially to ensure it only rotates through ~30 degrees
                
                // For Pisces in TRUE_ZODIAC_SIGNS: start=351.5, end=29.0
                // For Pisces in TRADITIONAL_ZODIAC_SIGNS: start=330, end=360
                
                // Calculate the shortest path for start value
                let startDiff = toSign.start - fromSign.start;
                if (Math.abs(startDiff) > 180) {
                    // Take the shorter path around the circle
                    startDiff = startDiff > 0 ? startDiff - 360 : startDiff + 360;
                }
                startInterpolated = (fromSign.start + startDiff * easedProgress + 360) % 360;
                
                // Calculate the shortest path for end value
                let endDiff = toSign.end - fromSign.end;
                if (Math.abs(endDiff) > 180) {
                    // Take the shorter path around the circle
                    endDiff = endDiff > 0 ? endDiff - 360 : endDiff + 360;
                }
                endInterpolated = (fromSign.end + endDiff * easedProgress + 360) % 360;
                
                // Ensure Pisces always crosses the 0° boundary correctly
                if (toSign.name === 'Pisces' && toSign.start > toSign.end) {
                    if (startInterpolated < endInterpolated) {
                        // Ensure start is greater than end for Pisces when it should cross boundary
                        startInterpolated += 360;
                    }
                } else if (fromSign.name === 'Pisces' && fromSign.start > fromSign.end) {
                    if (startInterpolated < endInterpolated && easedProgress < 0.5) {
                        // Keep the boundary crossing during the first half of animation
                        startInterpolated += 360;
                    }
                }
            } else {
                // Normal case - no boundary crossing
                startInterpolated = fromSign.start + (toSign.start - fromSign.start) * easedProgress;
                endInterpolated = fromSign.end + (toSign.end - fromSign.end) * easedProgress;
            }
            
            // Return interpolated sign
            return {
                symbol: toSign.symbol, // Use the target symbol
                name: toSign.name,     // Use the target name
                start: startInterpolated,
                end: endInterpolated
            };
        });
        
        // Update current zodiac signs
        ZODIAC_SIGNS = interpolatedSigns;
        
        // Update the display with the current date
        const dateInput = document.getElementById('date-picker').value;
        if (dateInput) {
            updateCelestialPositions(new Date(dateInput));
        } else {
            updateCelestialPositions();
        }
        
        // Continue animation if not complete
        if (progress < 1) {
            animationFrame = requestAnimationFrame(animateZodiacTransition);
        } else {
            // Animation complete
            isAnimating = false;
            ZODIAC_SIGNS = toZodiacSigns; // Ensure we end with the exact target values
            
            // Final update with the exact target values
            if (dateInput) {
                updateCelestialPositions(new Date(dateInput));
            } else {
                updateCelestialPositions();
            }
        }
    }

    // Initial draw on page load
    updateCelestialPositions();
});

// Corrected function to calculate celestial coordinates using the astronomy-engine library
function calculateCelestialCoordinates(celestialObject, date) {
    let observer = new exports.Observer(0, 0, 0); // Observer at the center of the Earth
    let time = exports.MakeTime(date);

    switch (celestialObject.name.toLowerCase()) {
        case 'moon':
            return exports.Equator(exports.Body.Moon, time, observer, true, true);
        case 'sun':
            return exports.Equator(exports.Body.Sun, time, observer, true, true);
        case 'mercury':
            return exports.Equator(exports.Body.Mercury, time, observer, true, true);
        case 'venus':
            return exports.Equator(exports.Body.Venus, time, observer, true, true);
        case 'mars':
            return exports.Equator(exports.Body.Mars, time, observer, true, true);
        case 'jupiter':
            return exports.Equator(exports.Body.Jupiter, time, observer, true, true);
        case 'saturn':
            return exports.Equator(exports.Body.Saturn, time, observer, true, true);
        default:
            throw new Error('Unknown celestial object: ' + celestialObject.name);
    }
}

// Fallback function to calculate approximate positions based on orbital elements
function calculateSimplePosition(celestialObject, date) {
    const objectInfo = CELESTIAL_OBJECTS[celestialObject];
    
    // Convert date to days since J2000.0 (January 1, 2000, 12:00 UTC)
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const daysSinceJ2000 = (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate mean anomaly based on orbital period
    const meanMotion = 360 / objectInfo.period; // degrees per day
    const meanAnomaly = (meanMotion * daysSinceJ2000 + objectInfo.phaseOffset) % 360;
    
    // Simple approximation of the equation of center (accounting for orbital eccentricity)
    const equationOfCenter = 2 * objectInfo.eccentricity * Math.sin(meanAnomaly * Math.PI / 180);
    
    // True anomaly is mean anomaly plus equation of center
    const trueAnomaly = meanAnomaly + equationOfCenter;
    
    // For simplicity, we'll use the true anomaly as the ecliptic longitude
    // This is a simplification but should give reasonable results
    return (trueAnomaly + 360) % 360;
}

// Function to determine which zodiac sign a celestial object is in
function getZodiacSign(longitude) {
    // Special case for Pisces in TRUE_ZODIAC_SIGNS which crosses the 0° boundary
    if (ZODIAC_SIGNS === TRUE_ZODIAC_SIGNS) {
        const pisces = ZODIAC_SIGNS[11]; // Pisces is the last sign in our array
        if ((longitude >= pisces.start && longitude < 360) || (longitude >= 0 && longitude < pisces.end)) {
            return pisces;
        }
    }
    
    // For all other signs or when using traditional zodiac
    for (const sign of ZODIAC_SIGNS) {
        if (longitude >= sign.start && longitude < sign.end) {
            return sign;
        }
    }
    
    // This should never happen, but just in case
    console.error(`Could not determine zodiac sign for longitude: ${longitude}`);
    return ZODIAC_SIGNS[0];
}

// Draw the base celestial chart
function drawCelestialChart() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer dark blue ring
    const outerRingWidth = 15;
    ctx.fillStyle = '#021019';
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius + outerRingWidth, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw main celestial ring
    ctx.strokeStyle = '#0596be';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw orbit circles for each planet
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)'; // Low-contrast gray
    
    for (const [objectName, objectInfo] of Object.entries(CELESTIAL_OBJECTS)) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, objectInfo.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw zodiac signs around the outside circle
    drawZodiacSigns();
}

// Draw zodiac signs around the outside circle
function drawZodiacSigns() {
    const zodiacRadius = maxRadius + 30; // Position just outside the main circle
    
    // Draw zodiac symbols
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (const sign of ZODIAC_SIGNS) {
        let middleAngle;
        
        // Special case for Pisces which crosses the 0° boundary in TRUE_ZODIAC_SIGNS
        if (sign.name === 'Pisces' && sign.start > sign.end) {
            // Calculate the middle angle correctly for Pisces when it crosses the boundary
            // For Pisces in TRUE_ZODIAC_SIGNS (351.5° to 29.0°), the middle is around 10.25°
            const adjustedEnd = sign.end + 360; // Add 360 to end angle to handle the boundary crossing
            middleAngle = (90 - ((sign.start + adjustedEnd) / 2) % 360) * Math.PI / 180;
        } else {
            // For all other signs, calculate the middle angle normally
            middleAngle = (90 - ((sign.start + sign.end) / 2)) * Math.PI / 180;
        }
        
        // Calculate position
        const x = centerX + zodiacRadius * Math.cos(middleAngle);
        const y = centerY - zodiacRadius * Math.sin(middleAngle);
        
        // Get custom zodiac symbol if available
        const customSymbol = ZODIAC_SYMBOL_MAP[sign.name];
        
        // Draw the zodiac symbol
        if (customSymbol) {
            ctx.font = '24px PlanetarySymbols, Arial';
            ctx.fillText(customSymbol, x, y);
        } else {
            ctx.font = '24px Arial';
            ctx.fillText(sign.symbol, x, y);
        }
        
        // Draw division lines between signs
        // Adjust angle: 0° at top, going clockwise
        const startAngle = (90 - sign.start) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + maxRadius * Math.cos(startAngle),
            centerY - maxRadius * Math.sin(startAngle)
        );
        ctx.strokeStyle = 'rgba(5, 150, 190, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Draw Earth medallion at the center
function drawEarthMedallion() {
    // Create a blue-green gradient for Earth
    const earthGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 25
    );
    earthGradient.addColorStop(0, '#88ccff');
    earthGradient.addColorStop(0.5, '#44aadd');
    earthGradient.addColorStop(1, '#0066aa');
    
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add Earth symbol at the center
    ctx.fillStyle = '#ffffff';
    
    // Use custom font if available, otherwise fallback to Unicode symbol
    const earthSymbol = getPlanetSymbol('earth') || '⊕';
    if (getPlanetSymbol('earth')) {
        ctx.font = '24px PlanetarySymbols, Arial';
    } else {
        ctx.font = '24px Arial';
    }
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(earthSymbol, centerX, centerY);
}

// Draw celestial object medallion
function drawCelestialMedallion(objectName, longitude, radius) {
    const objectInfo = CELESTIAL_OBJECTS[objectName];
    
    // Convert longitude to radians for positioning
    // Adjust angle: 0° at top, going clockwise
    const radians = (90 - longitude) * Math.PI / 180;
    
    // Calculate x and y coordinates
    const x = centerX + radius * Math.cos(radians);
    const y = centerY - radius * Math.sin(radians);
    
    // Draw medallion glow
    const glowRadius = 25;
    const glowGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, glowRadius * 1.5
    );
    glowGradient.addColorStop(0, `rgba(${colorToRgb(objectInfo.color)}, 0.8)`);
    glowGradient.addColorStop(1, 'rgba(0, 50, 70, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius * 1.5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw medallion background
    const medalGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, glowRadius
    );
    
    if (objectName === 'sun') {
        // Special case for the sun - make it brighter
        medalGradient.addColorStop(0, '#fff7d0');
        medalGradient.addColorStop(0.7, '#ffd700');
        medalGradient.addColorStop(1, '#d4af37');
    } else if (objectName === 'moon') {
        // Special case for the moon - make it silver/gray
        medalGradient.addColorStop(0, '#ffffff');
        medalGradient.addColorStop(0.7, '#d1d1d1');
        medalGradient.addColorStop(1, '#a0a0a0');
    } else {
        // Default gradient for planets
        medalGradient.addColorStop(0, '#0a6b89');
        medalGradient.addColorStop(1, '#043b4e');
    }
    
    ctx.fillStyle = medalGradient;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw medallion rim
    ctx.strokeStyle = objectInfo.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw celestial object symbol
    ctx.fillStyle = objectName === 'sun' || objectName === 'moon' ? '#000000' : '#ffffff';
    
    // Use custom font if available, otherwise fallback to Unicode symbol
    if (objectInfo.customSymbol) {
        ctx.font = '24px PlanetarySymbols, Arial';
        ctx.fillText(objectInfo.customSymbol, x, y);
    } else {
        ctx.font = '24px Arial';
        ctx.fillText(objectInfo.symbol, x, y);
    }
}

// Helper function to convert hex color to RGB
function colorToRgb(hex) {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Parse the RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}

// Update celestial object positions in the UI
function updateCelestialPositions(date) {
    // Use provided date or current time
    const displayDate = date || new Date();
    
    // Draw the base chart (without Earth)
    drawCelestialChart();
    
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
            
            // Calculate GeoVector for Mars
            let geoVectorHTML = '';
            if (objectName === 'mars') {
                const geoVector = calculateMarsGeoVector(displayDate);
                geoVectorHTML = `
                    <br>
                    <small>
                        GeoVector:<br>
                        x: ${geoVector.x.toFixed(4)}<br>
                        y: ${geoVector.y.toFixed(4)}<br>
                        z: ${geoVector.z.toFixed(4)}
                    </small>
                `;
            }
            
            // Get custom zodiac symbol if available
            const customZodiacSymbol = ZODIAC_SYMBOL_MAP[zodiacSign.name];
            
            // Update data display HTML
            objectDataHTML += `
                <div class="planet-info" style="background-color: ${adjustColor(objectInfo.color, -40)}; border: 1px solid ${adjustColor(objectInfo.color, 20)}">
                    <span class="planet-symbol" style="color: ${objectInfo.color}">${objectInfo.customSymbol || objectInfo.symbol}</span>
                    <strong>${objectInfo.name}</strong>
                    <span class="${customZodiacSymbol ? 'planet-symbol' : ''}" style="font-size: 18px;">${customZodiacSymbol || zodiacSign.symbol}</span>
                    ${zodiacSign.name}

                </div>
            `;
        } catch (error) {
            console.error(`Error calculating position for ${objectName}:`, error);
            
            // Fallback to simple position calculation
            try {
                const longitude = calculateSimplePosition(objectName, displayDate);
                
                // Store the data for later use
                objectData.push({
                    name: objectName,
                    info: objectInfo,
                    longitude: longitude,
                    rightAscension: 0, // Placeholder
                    declination: 0     // Placeholder
                });
                
                // Get the zodiac sign for this celestial object
                const zodiacSign = getZodiacSign(longitude);
                
                // Format coordinates with 2 decimal places
                const formattedLongitude = longitude.toFixed(2);
                
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
                        <small>(Using simplified calculation)</small>
                    </div>
                `;
            } catch (fallbackError) {
                console.error(`Fallback calculation also failed for ${objectName}:`, fallbackError);
            }
        }
    }
    
    // First, draw all stalks
    for (const object of objectData) {
        drawCelestialStalk(object.name, object.longitude, object.info.radius, object.info.color);
    }
    
    // Then, draw Earth medallion and all planet medallions on top of stalks
    drawEarthMedallion();
    
    // Draw all other medallions
    for (const object of objectData) {
        drawCelestialMedallion(object.name, object.longitude, object.info.radius);
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

// Function to calculate heliocentric positions of planets
function calculatePlanetPositions(date) {
    // Return placeholder positions for planets
    const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return planets.map(planet => {
        return {
            name: planet,
            position: { x: 0, y: 0, z: 0 }, // Placeholder position vector
            velocity: { x: 0, y: 0, z: 0 }  // Placeholder velocity vector
        };
    });
}

// Draw just the stalk for a celestial object
function drawCelestialStalk(objectName, longitude, radius, color) {
    // Convert longitude to radians for positioning
    // Adjust angle: 0° at top, going clockwise
    const radians = (90 - longitude) * Math.PI / 180;
    
    // Calculate x and y coordinates
    const x = centerX + radius * Math.cos(radians);
    const y = centerY - radius * Math.sin(radians);
    
    // Draw stalk from center to medallion
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.7)'; // Medium gray color for all stalks
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Helper function to darken or lighten a color
function adjustColor(hex, percent) {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Parse the RGB components
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust each component
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to load the custom font before rendering
function loadCustomFont() {
    // Create a font loading promise
    const fontPromise = new Promise((resolve, reject) => {
        // Create a test span to check if the font is loaded
        const testSpan = document.createElement('span');
        testSpan.style.fontFamily = 'PlanetarySymbols, Arial';
        testSpan.style.fontSize = '24px';
        testSpan.style.visibility = 'hidden';
        testSpan.textContent = 'Q'; // Use a character from the font
        
        document.body.appendChild(testSpan);
        
        // Use FontFaceObserver if available, otherwise use a timeout approach
        if (typeof FontFaceObserver !== 'undefined') {
            const observer = new FontFaceObserver('PlanetarySymbols');
            observer.load().then(() => {
                document.body.removeChild(testSpan);
                resolve();
            }).catch(err => {
                console.warn('Font loading failed, using fallback:', err);
                document.body.removeChild(testSpan);
                resolve(); // Resolve anyway to continue with fallback
            });
        } else {
            // Fallback: check if the font is loaded after a short delay
            setTimeout(() => {
                document.body.removeChild(testSpan);
                resolve();
            }, 500); // Wait 500ms for the font to load
        }
    });
    
    // Wait for the font to load, then render
    fontPromise.then(() => {
        // Initial draw after font is loaded
        updateCelestialPositions();
    }).catch(err => {
        console.error('Error loading font:', err);
        // Render anyway with fallback fonts
        updateCelestialPositions();
    });
}

// Function to calculate Mars GeoVector (simplified placeholder)
function calculateMarsGeoVector(date) {
    // This is a simplified placeholder function that returns a mock GeoVector
    // In a real implementation, this would use the astronomy library to calculate
    // the actual geocentric vector for Mars
    
    // Convert date to days since J2000.0 (January 1, 2000, 12:00 UTC)
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const daysSinceJ2000 = (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);
    
    // Use a simple sine/cosine function to generate varying values based on the date
    // This is just for demonstration purposes
    const angle = (daysSinceJ2000 / 687) * 2 * Math.PI; // Mars orbital period ~687 days
    
    return {
        x: Math.sin(angle) * 1.5,
        y: Math.cos(angle) * 1.5,
        z: Math.sin(angle + Math.PI/4) * 0.5
    };
}
