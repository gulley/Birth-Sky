// --- Configuration ---
const CELESTIAL_OBJECTS = {
    'moon': { 
        symbol: '☽', 
        name: 'Moon', 
        period: 27.3, 
        phaseOffset: 15, 
        eccentricity: 0.0549, 
        color: '#d1d1d1',
        radius: 80
    },
    'sun': { 
        symbol: '☉', 
        name: 'Sun', 
        period: 365.25, 
        phaseOffset: 0, 
        eccentricity: 0.0167, 
        color: '#ffdd44',
        radius: 110
    },
    'mercury': { 
        symbol: '☿', 
        name: 'Mercury', 
        period: 87.97, 
        phaseOffset: 25, 
        eccentricity: 0.21, 
        color: '#8c8c8c',
        radius: 140
    },
    'venus': { 
        symbol: '♀', 
        name: 'Venus', 
        period: 224.7, 
        phaseOffset: 180, 
        eccentricity: 0.01, 
        color: '#e39e54',
        radius: 170
    },
    'mars': { 
        symbol: '♂', 
        name: 'Mars', 
        period: 686.98, 
        phaseOffset: 120, 
        eccentricity: 0.09, 
        color: '#c1440e',
        radius: 200
    },
    'jupiter': { 
        symbol: '♃', 
        name: 'Jupiter', 
        period: 4332.59, 
        phaseOffset: 65, 
        eccentricity: 0.05, 
        color: '#d8ca9d',
        radius: 230
    },
    'saturn': { 
        symbol: '♄', 
        name: 'Saturn', 
        period: 10759.22, 
        phaseOffset: 210, 
        eccentricity: 0.06, 
        color: '#e0bb95',
        radius: 260
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

    // Update button
    document.getElementById('update-btn').addEventListener('click', updateCelestialPositions);

    // Initial draw on page load
    updateCelestialPositions();
});

// Epoch for calculations (J2000.0)
const J2000 = new Date('2000-01-01T12:00:00Z');

// Function to calculate number of days since J2000
function daysSinceJ2000(date) {
    const millisPerDay = 24 * 60 * 60 * 1000;
    return (date - J2000) / millisPerDay;
}

// Function to calculate approximate ecliptic longitude based on orbital parameters
function calculateEclipticLongitude(celestialObject, date) {
    const days = daysSinceJ2000(date);
    const period = CELESTIAL_OBJECTS[celestialObject].period;
    const phaseOffset = CELESTIAL_OBJECTS[celestialObject].phaseOffset;
    const eccentricity = CELESTIAL_OBJECTS[celestialObject].eccentricity;
    
    // Calculate mean anomaly (simple circular approximation)
    const meanMotion = 360 / period; // degrees per day
    let meanAnomaly = (meanMotion * days + phaseOffset) % 360;
    
    // Simple approximation of the equation of center (effect of eccentricity)
    const equationOfCenter = 2 * eccentricity * Math.sin(meanAnomaly * Math.PI / 180) * 180 / Math.PI;
    
    // True anomaly is the mean anomaly plus the equation of center
    const trueAnomaly = meanAnomaly + equationOfCenter;
    
    return (trueAnomaly + 360) % 360;
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
    
    // Draw inner concentric rings (subtler)
    ctx.strokeStyle = 'rgba(5, 150, 190, 0.3)';
    ctx.lineWidth = 1;
    for (let r = 100; r < maxRadius; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw zodiac division lines (12 sections)
    ctx.strokeStyle = 'rgba(5, 150, 190, 0.5)';
    ctx.lineWidth = 1;
    for (let angle = 0; angle < 360; angle += 30) {
        const radians = angle * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + maxRadius * Math.cos(radians),
            centerY + maxRadius * Math.sin(radians)
        );
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
function updateCelestialPositions() {
    // Get current time
    const now = new Date();
    const utcString = now.toUTCString();
    document.getElementById('current-time').textContent = utcString;
    
    // Draw the base chart (without Earth)
    drawCelestialChart();
    
    // Calculate celestial object positions and update the data display
    const objectPositions = {};
    let objectDataHTML = '';
    const objectData = [];
    
    // First, calculate all positions
    for (const [objectName, objectInfo] of Object.entries(CELESTIAL_OBJECTS)) {
        // Get ecliptic longitude
        const longitude = calculateEclipticLongitude(objectName, now);
        
        // Store the data for later use
        objectData.push({
            name: objectName,
            info: objectInfo,
            longitude: longitude
        });
        
        // Update data display HTML
        objectDataHTML += `
            <div class="planet-info" style="background-color: ${adjustColor(objectInfo.color, -40)}; border: 1px solid ${adjustColor(objectInfo.color, 20)}">
                <span class="planet-symbol" style="color: ${objectInfo.color}">${objectInfo.symbol}</span>
                <strong>${objectInfo.name}</strong>
                <br>
                Position: ${longitude.toFixed(1)}°
            </div>
        `;
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
