/**
 * Base chart drawing functionality
 */

import { ZODIAC_SYMBOL_MAP } from '../../planet-symbols.js';

// Canvas context and dimensions
let canvas, ctx, centerX, centerY, maxRadius;

/**
 * Initialize the canvas
 * @param {HTMLCanvasElement} canvasElement - The canvas element
 * @returns {Object} The canvas context and dimensions
 */
export function initializeCanvas(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    maxRadius = Math.min(centerX, centerY) - 50;
    
    return { canvas, ctx, centerX, centerY, maxRadius };
}

/**
 * Get the canvas context and dimensions
 * @returns {Object} The canvas context and dimensions
 */
export function getCanvasContext() {
    return { canvas, ctx, centerX, centerY, maxRadius };
}

/**
 * Draw the base celestial chart
 * @param {Array} zodiacSigns - The zodiac signs array to use
 */
export function drawCelestialChart(zodiacSigns) {
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
    
    // Draw zodiac signs around the outside circle
    drawZodiacSigns(zodiacSigns);
}

/**
 * Draw zodiac signs around the outside circle
 * @param {Array} zodiacSigns - The zodiac signs array to use
 */
export function drawZodiacSigns(zodiacSigns) {
    const zodiacRadius = maxRadius + 30; // Position just outside the main circle
    
    // Draw zodiac symbols
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (const sign of zodiacSigns) {
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

/**
 * Draw orbit circles for celestial objects
 * @param {Object} celestialObjects - The celestial objects configuration
 */
export function drawOrbitCircles(celestialObjects) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)'; // Low-contrast gray
    
    for (const [objectName, objectInfo] of Object.entries(celestialObjects)) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, objectInfo.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
