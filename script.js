// The astronomy-engine library is loaded from CDN and available as a global variable
// No import needed

// --- Configuration ---
// Zodiac signs configuration
const ZODIAC_SIGNS = [
    { symbol: '♈', name: 'Aries', start: 0, end: 30 },
    { symbol: '♉', name: 'Taurus', start: 30, end: 60 },
    { symbol: '♊', name: 'Gemini', start: 60, end: 90 },
    { symbol: '♋', name: 'Cancer', start: 90, end: 120 },
    { symbol: '♌', name: 'Leo', start: 120, end: 150 },
    { symbol: '♍', name: 'Virgo', start: 150, end: 180 },
    { symbol: '♎', name: 'Libra', start: 180, end: 210 },
    { symbol: '♏', name: 'Scorpio', start: 210, end: 240 },
    { symbol: '♐', name: 'Sagittarius', start: 240, end: 270 },
    { symbol: '♑', name: 'Capricorn', start: 270, end: 300 },
    { symbol: '♒', name: 'Aquarius', start: 300, end: 330 },
    { symbol: '♓', name: 'Pisces', start: 330, end: 360 }
];

// Celestial objects configuration with improved orbital elements
const CELESTIAL_OBJECTS = {
    'moon': { 
        symbol: '☽', 
        name: 'Moon', 
        // Lunar orbital elements (simplified)
        period: 27.321582, 
        phaseOffset: 134.9, 
        eccentricity: 0.0549,
        inclination: 5.145,
        color: '#d1d1d1',
        radius: 50
    },
    'sun': { 
        symbol: '☉', 
        name: 'Sun', 
        // Earth's orbital elements (for Sun's apparent motion)
        period: 365.256363, 
        phaseOffset: 280.46, 
        eccentricity: 0.01671022,
        inclination: 0,
        color: '#ffdd44',
        radius: 100
    },
    'mercury': { 
        symbol: '☿', 
        name: 'Mercury', 
        // Mercury's orbital elements
        period: 87.9691, 
        phaseOffset: 174.796, 
        eccentricity: 0.20563069,
        inclination: 7.00487,
        color: '#8c8c8c',
        radius: 150
    },
    'venus': { 
        symbol: '♀', 
        name: 'Venus', 
        // Venus's orbital elements
        period: 224.7008, 
        phaseOffset: 50.115, 
        eccentricity: 0.00677323,
        inclination: 3.39471,
        color: '#e39e54',
        radius: 170
    },
    'mars': { 
        symbol: '♂', 
        name: 'Mars', 
        // Mars's orbital elements
        period: 686.9796, 
        phaseOffset: 19.3730, 
        eccentricity: 0.09341233,
        inclination: 1.85061,
        color: '#c1440e',
        radius: 190
    },
    'jupiter': { 
        symbol: '♃', 
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
        symbol: '♄', 
        name: 'Saturn', 
        // Saturn's orbital elements
        period: 10759.22, 
        phaseOffset: 320.346, 
        eccentricity: 0.05415060,
        inclination: 2.48446,
        color: '#e0bb95',
        radius: 230
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

    // Update button - use selected date
    document.getElementById('update-btn').addEventListener('click', function() {
        const dateInput = document.getElementById('date-picker').value;
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

    // Initial draw on page load
    updateCelestialPositions();
});

// Function to calculate ecliptic longitude using the astronomy-engine library
function calculateEclipticLongitude(celestialObject, date) {
    try {
        // Map our celestial object names to astronomy-engine body names
        const bodyMap = {
            'sun': Astronomy.Body.Sun,
            'moon': Astronomy.Body.Moon,
            'mercury': Astronomy.Body.Mercury,
            'venus': Astronomy.Body.Venus,
            'mars': Astronomy.Body.Mars,
            'jupiter': Astronomy.Body.Jupiter,
            'saturn': Astronomy.Body.Saturn
        };
        
        // Get the astronomy-engine body
        const body = bodyMap[celestialObject];
        
        if (!body) {
            console.error(`Unknown celestial object: ${celestialObject}`);
            return 0;
        }
        
        // Convert JavaScript Date to Astronomy.Time
        const time = new Astronomy.Time(date);
        
        // Calculate the ecliptic longitude
        // We use equatorial coordinates and convert to ecliptic
        const equ = Astronomy.Equator(body, time, false, false);
        const ecl = Astronomy.Ecliptic(equ);
        
        // Return the longitude in degrees (0-360)
        return (ecl.elon * 180 / Math.PI + 360) % 360;
    } catch (error) {
        console.error(`Error calculating position for ${celestialObject}:`, error);
        
        // Fallback to a simple calculation based on orbital elements
        // This is less accurate but will work without the astronomy-engine
        return calculateSimplePosition(celestialObject, date);
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
    for (const sign of ZODIAC_SIGNS) {
        if (longitude >= sign.start && longitude < sign.end) {
            return sign;
        }
    }
    // This should never happen, but just in case
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
    ctx.lineWidth = 2;
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
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (const sign of ZODIAC_SIGNS) {
        // Calculate the middle angle of the sign's range
        const middleAngle = ((sign.start + sign.end) / 2) * Math.PI / 180;
        
        // Calculate position
        const x = centerX + zodiacRadius * Math.cos(middleAngle);
        const y = centerY + zodiacRadius * Math.sin(middleAngle);
        
        // Draw the zodiac symbol
        ctx.fillText(sign.symbol, x, y);
        
        // Draw division lines between signs
        const startAngle = sign.start * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + maxRadius * Math.cos(startAngle),
            centerY + maxRadius * Math.sin(startAngle)
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
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⊕', centerX, centerY);
}

// Draw celestial object medallion
function drawCelestialMedallion(objectName, longitude, radius) {
    const objectInfo = CELESTIAL_OBJECTS[objectName];
    
    // Convert longitude to radians for positioning
    const radians = longitude * Math.PI / 180;
    
    // Calculate x and y coordinates
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    
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
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw celestial object symbol
    ctx.fillStyle = objectName === 'sun' || objectName === 'moon' ? '#000000' : '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(objectInfo.symbol, x, y);
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
    const utcString = displayDate.toUTCString();
    document.getElementById('current-time').textContent = utcString;
    
    // Draw the base chart (without Earth)
    drawCelestialChart();
    
    // Calculate celestial object positions and update the data display
    let objectDataHTML = '';
    const objectData = [];
    
    // First, calculate all positions
    for (const [objectName, objectInfo] of Object.entries(CELESTIAL_OBJECTS)) {
        try {
            // Get ecliptic longitude using the astronomy-engine library
            const longitude = calculateEclipticLongitude(objectName, displayDate);
            
            // Store the data for later use
            objectData.push({
                name: objectName,
                info: objectInfo,
                longitude: longitude
            });
            
            // Get the zodiac sign for this celestial object
            const zodiacSign = getZodiacSign(longitude);
            
            // Update data display HTML
            objectDataHTML += `
                <div class="planet-info" style="background-color: ${adjustColor(objectInfo.color, -40)}; border: 1px solid ${adjustColor(objectInfo.color, 20)}">
                    <span class="planet-symbol" style="color: ${objectInfo.color}">${objectInfo.symbol}</span>
                    <strong>${objectInfo.name}</strong>
                    <br>
                    Sign: ${zodiacSign.symbol} ${zodiacSign.name}
                </div>
            `;
        } catch (error) {
            console.error(`Error calculating position for ${objectName}:`, error);
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
}

// Draw just the stalk for a celestial object
function drawCelestialStalk(objectName, longitude, radius, color) {
    // Convert longitude to radians for positioning
    const radians = longitude * Math.PI / 180;
    
    // Calculate x and y coordinates
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    
    // Draw stalk from center to medallion
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = `rgba(${colorToRgb(color)}, 0.7)`;
    ctx.lineWidth = 2;
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
