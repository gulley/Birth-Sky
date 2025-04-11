// Use the astronomy library
(function() {
    // Function to initialize the application
    function init() {
        // Check if the astronomy library is loaded
        if (typeof exports === 'undefined') {
            console.error('Astronomy library not loaded. Make sure astronomy.min.js is included before bundle.js');
            return;
        }
        
        // Access the Astronomy object from the global scope
        const Astronomy = exports;
        
        // Canvas variables
        let canvas, ctx, centerX, centerY, maxRadius;
        
        // Function to initialize the canvas
        function initCanvas() {
            canvas = document.getElementById('planet-chart');
            if (!canvas) return false;
            
            ctx = canvas.getContext('2d');
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            maxRadius = Math.min(centerX, centerY) - 50;
            return true;
        }
        
        // Function to calculate RA and Dec for celestial objects
        function calculateCelestialCoordinates(date = new Date()) {
            // Create an observer at the center of the Earth (geocentric view)
            const observer = new Astronomy.Observer(0, 0, 0);
            
            // Convert the date to Astronomy.Time object
            const time = Astronomy.MakeTime(date);
            
            // List of celestial objects to calculate
            const celestialObjects = [
                { name: 'Sun', body: Astronomy.Body.Sun },
                { name: 'Moon', body: Astronomy.Body.Moon },
                { name: 'Mercury', body: Astronomy.Body.Mercury },
                { name: 'Venus', body: Astronomy.Body.Venus },
                { name: 'Mars', body: Astronomy.Body.Mars },
                { name: 'Jupiter', body: Astronomy.Body.Jupiter },
                { name: 'Saturn', body: Astronomy.Body.Saturn }
            ];
            
            // Calculate coordinates for each object
            const results = celestialObjects.map(object => {
                // Use GeoVector to get the position vector
                const vector = Astronomy.GeoVector(object.body, time, true);
                
                // Convert to equatorial coordinates
                const equatorial = Astronomy.Equator(object.body, time, observer, true, true);
                
                // Convert to ecliptic coordinates
                const ecliptic = Astronomy.Ecliptic(vector);
                
                return {
                    name: object.name,
                    rightAscension: equatorial.ra,
                    declination: equatorial.dec,
                    distance: equatorial.dist,
                    eclipticLongitude: ecliptic.elon,
                    eclipticLatitude: ecliptic.elat,
                    vector: {
                        x: vector.x,
                        y: vector.y,
                        z: vector.z
                    }
                };
            });
            
            return results;
        }

        // Function to format RA in hours:minutes:seconds
        function formatRA(ra) {
            const hours = Math.floor(ra);
            const minutes = Math.floor((ra - hours) * 60);
            const seconds = Math.round(((ra - hours) * 60 - minutes) * 60);
            return `${hours}h ${minutes}m ${seconds}s`;
        }

        // Function to format Dec in degrees:arcminutes:arcseconds
        function formatDec(dec) {
            const sign = dec < 0 ? '-' : '+';
            const absDec = Math.abs(dec);
            const degrees = Math.floor(absDec);
            const arcminutes = Math.floor((absDec - degrees) * 60);
            const arcseconds = Math.round(((absDec - degrees) * 60 - arcminutes) * 60);
            return `${sign}${degrees}° ${arcminutes}' ${arcseconds}"`;
        }
        
        // Function to format ecliptic coordinates in degrees
        function formatEcliptic(degrees) {
            const sign = degrees < 0 ? '-' : '+';
            const absDegrees = Math.abs(degrees);
            const wholeDegrees = Math.floor(absDegrees);
            const arcminutes = Math.floor((absDegrees - wholeDegrees) * 60);
            const arcseconds = Math.round(((absDegrees - wholeDegrees) * 60 - arcminutes) * 60);
            return `${sign}${wholeDegrees}° ${arcminutes}' ${arcseconds}"`;
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

        // Zodiac signs configuration based on IAU Constellation Boundary Crossings
        // Ophiuchus removed and its space assigned to Scorpius
        const ZODIAC_SIGNS = [
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

        // Function to determine which zodiac sign a celestial object is in
        function getZodiacSign(longitude) {
            // Special case for Pisces which crosses the 0° boundary
            const pisces = ZODIAC_SIGNS[11]; // Pisces is the last sign in our array (index 11 now that Ophiuchus is removed)
            if ((longitude >= pisces.start && longitude < 360) || (longitude >= 0 && longitude < pisces.end)) {
                return pisces;
            }
            
            // For all other signs
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
            if (!ctx) return;
            
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
            
            // Draw zodiac regions
            drawZodiacRegions();
            
            // Draw orbit circles for each planet
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)'; // Low-contrast gray
            
            // Draw orbit circles at different radii, evenly spaced from 60 (Sun) to 220 (Saturn)
            const orbitRadii = {
                'Sun': 60,
                'Moon': 86.67,
                'Mercury': 113.33,
                'Venus': 140,
                'Mars': 166.67,
                'Jupiter': 193.33,
                'Saturn': 220
            };
            
            for (const [name, radius] of Object.entries(orbitRadii)) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            
            // Degree labels removed as requested
        }
        
        // Draw zodiac regions around the circle
        function drawZodiacRegions() {
            const zodiacRadius = maxRadius + 30; // Position just outside the main circle
            
            // Draw zodiac regions and symbols
            for (const sign of ZODIAC_SIGNS) {
                // Draw region boundaries
                // Adjust angle: 0° at 3 o'clock, going counterclockwise
                const startRadians = sign.start * Math.PI / 180;
                const endRadians = sign.end * Math.PI / 180;
                
                // Draw boundary lines
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + maxRadius * Math.cos(startRadians),
                    centerY - maxRadius * Math.sin(startRadians)
                );
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Calculate middle angle for symbol placement
                let middleAngle;
                
                // Special case for Pisces which crosses the 0° boundary
                if (sign.name === 'Pisces') {
                    // Calculate the middle angle correctly for Pisces
                    const adjustedEnd = sign.end + 360; // Add 360 to end angle to handle the boundary crossing
                    middleAngle = ((sign.start + adjustedEnd) / 2) % 360 * Math.PI / 180;
                } else {
                    // For all other signs, calculate the middle angle normally
                    middleAngle = ((sign.start + sign.end) / 2) * Math.PI / 180;
                }
                
                // Calculate position for symbol
                const x = centerX + zodiacRadius * Math.cos(middleAngle);
                const y = centerY - zodiacRadius * Math.sin(middleAngle);
                
                // Draw the zodiac symbol
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(sign.symbol, x, y);
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
        function drawCelestialMedallion(object, radius) {
            // Convert longitude to radians for positioning
            // Adjust angle: 0° at 3 o'clock, going counterclockwise
            const radians = (object.eclipticLongitude) * Math.PI / 180;
            
            // Calculate x and y coordinates
            const x = centerX + radius * Math.cos(radians);
            const y = centerY - radius * Math.sin(radians);
            
            // Draw medallion glow
            const glowRadius = 25;
            const glowGradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, glowRadius * 1.5
            );
            const color = getSymbolColor(object.name);
            glowGradient.addColorStop(0, `rgba(${colorToRgb(color)}, 0.8)`);
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
            
            if (object.name === 'Sun') {
                // Special case for the sun - make it brighter
                medalGradient.addColorStop(0, '#fff7d0');
                medalGradient.addColorStop(0.7, '#ffd700');
                medalGradient.addColorStop(1, '#d4af37');
            } else if (object.name === 'Moon') {
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
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Draw celestial object symbol
            ctx.fillStyle = object.name === 'Sun' || object.name === 'Moon' ? '#000000' : '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(getSymbol(object.name), x, y);
        }
        
        // Draw stalk from center to medallion
        function drawCelestialStalk(object, radius) {
            // Convert longitude to radians for positioning
            // Adjust angle: 0° at 3 o'clock, going counterclockwise
            const radians = (object.eclipticLongitude) * Math.PI / 180;
            
            // Calculate x and y coordinates
            const x = centerX + radius * Math.cos(radians);
            const y = centerY - radius * Math.sin(radians);
            
            // Draw stalk from center to medallion
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            const color = getSymbolColor(object.name);
            ctx.strokeStyle = `rgba(${colorToRgb(color)}, 0.7)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Function to update the UI with calculated coordinates
        function updateCelestialDisplay(date = new Date()) {
            const coordinates = calculateCelestialCoordinates(date);
            
            // Initialize canvas if not already done
            if (!canvas && !initCanvas()) {
                console.error('Could not initialize canvas');
            }
            
            // Draw the celestial chart
            if (canvas) {
                // Draw the base chart
                drawCelestialChart();
                
                // Define orbit radii for each planet, evenly spaced from 60 (Sun) to 220 (Saturn)
                const orbitRadii = {
                    'Sun': 60,
                    'Moon': 86.67,
                    'Mercury': 113.33,
                    'Venus': 140,
                    'Mars': 166.67,
                    'Jupiter': 193.33,
                    'Saturn': 220
                };
                
                // First, draw all stalks
                coordinates.forEach(object => {
                    const radius = orbitRadii[object.name];
                    if (radius) {
                        drawCelestialStalk(object, radius);
                    }
                });
                
                // Draw Earth medallion
                drawEarthMedallion();
                
                // Then, draw all medallions
                coordinates.forEach(object => {
                    const radius = orbitRadii[object.name];
                    if (radius) {
                        drawCelestialMedallion(object, radius);
                    }
                });
            }
            
            // Get the planet data container
            const planetDataContainer = document.getElementById('planet-data');
            if (!planetDataContainer) return;
            
            // Clear existing content
            planetDataContainer.innerHTML = '';
            
            // Add each celestial object's data
            coordinates.forEach(object => {
                const planetInfo = document.createElement('div');
                planetInfo.className = 'planet-info';
                planetInfo.style.backgroundColor = getBackgroundColor(object.name);
                planetInfo.style.borderColor = getBorderColor(object.name);
                
                // Get the zodiac sign for this celestial object
                const zodiacSign = getZodiacSign(object.eclipticLongitude);
                
                planetInfo.innerHTML = `
                    <span class="planet-symbol" style="color: ${getSymbolColor(object.name)}">${getSymbol(object.name)}</span>
                    <strong>${object.name}</strong>
                    <br>
                    <small>
                        RA: ${formatRA(object.rightAscension)}
                        <br>
                        Dec: ${formatDec(object.declination)}
                        <br>
                        Ecl Lon: ${formatEcliptic(object.eclipticLongitude)}
                        <br>
                        Ecl Lat: ${formatEcliptic(object.eclipticLatitude)}
                        <br>
                        Dist: ${object.distance.toFixed(6)} AU
                        <br>
                        Sign: ${zodiacSign.symbol} ${zodiacSign.name}
                    </small>
                `;
                
                planetDataContainer.appendChild(planetInfo);
            });
            
            // Update the current time display
            const currentTimeElement = document.getElementById('current-time');
            if (currentTimeElement) {
                currentTimeElement.textContent = date.toUTCString();
            }
        }

        // Helper functions for styling
        function getSymbol(name) {
            const symbols = {
                'Sun': '☉',
                'Moon': '☽',
                'Mercury': '☿',
                'Venus': '♀',
                'Mars': '♂',
                'Jupiter': '♃',
                'Saturn': '♄'
            };
            return symbols[name] || '';
        }

        function getSymbolColor(name) {
            const colors = {
                'Sun': '#ffdd44',
                'Moon': '#d1d1d1',
                'Mercury': '#8c8c8c',
                'Venus': '#e39e54',
                'Mars': '#c1440e',
                'Jupiter': '#d8ca9d',
                'Saturn': '#e0bb95'
            };
            return colors[name] || '#ffffff';
        }

        function getBackgroundColor(name) {
            const colors = {
                'Sun': '#554400',
                'Moon': '#444444',
                'Mercury': '#333333',
                'Venus': '#553311',
                'Mars': '#441100',
                'Jupiter': '#443322',
                'Saturn': '#443322'
            };
            return colors[name] || '#054154';
        }

        function getBorderColor(name) {
            const colors = {
                'Sun': '#ffdd44',
                'Moon': '#d1d1d1',
                'Mercury': '#8c8c8c',
                'Venus': '#e39e54',
                'Mars': '#c1440e',
                'Jupiter': '#d8ca9d',
                'Saturn': '#e0bb95'
            };
            return colors[name] || '#0596be';
        }

        // Initialize the application when the DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize date picker with current date and time
            const now = new Date();
            const dateString = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
            const datePicker = document.getElementById('date-picker');
            if (datePicker) {
                datePicker.value = dateString;
            }

            // Update button - use selected date
            const updateBtn = document.getElementById('update-btn');
            if (updateBtn) {
                updateBtn.addEventListener('click', function() {
                    const dateInput = document.getElementById('date-picker').value;
                    if (dateInput) {
                        const selectedDate = new Date(dateInput);
                        updateCelestialDisplay(selectedDate);
                    } else {
                        updateCelestialDisplay();
                    }
                });
            }

            // Current time button - use current time
            const currentTimeBtn = document.getElementById('current-time-btn');
            if (currentTimeBtn) {
                currentTimeBtn.addEventListener('click', function() {
                    const now = new Date();
                    const dateString = now.toISOString().slice(0, 16);
                    const datePicker = document.getElementById('date-picker');
                    if (datePicker) {
                        datePicker.value = dateString;
                    }
                    updateCelestialDisplay(now);
                });
            }

            // Initial display on page load
            updateCelestialDisplay(now);
        });

        // Expose functions to global scope
        window.calculateCelestialCoordinates = calculateCelestialCoordinates;
        window.formatRA = formatRA;
        window.formatDec = formatDec;
        window.updateCelestialDisplay = updateCelestialDisplay;
    }
    
    // Call the init function when the script loads
    init();
})();
