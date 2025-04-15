/**
 * Medallion drawing functionality
 */

import { colorToRgb } from '../utils/color-helpers.js';
import { getCanvasContext } from './chart-base.js';
import { getPlanetSymbol } from '../../planet-symbols.js';

/**
 * Draw Earth medallion at the center
 */
export function drawEarthMedallion() {
    const { ctx, centerX, centerY } = getCanvasContext();
    
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

/**
 * Draw celestial object medallion
 * @param {string} objectName - The name of the celestial object
 * @param {Object} objectInfo - The celestial object info
 * @param {number} longitude - The longitude in degrees
 * @param {number} radius - The radius from center
 */
export function drawCelestialMedallion(objectName, objectInfo, longitude, radius) {
    const { ctx, centerX, centerY } = getCanvasContext();
    
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

/**
 * Draw just the stalk for a celestial object
 * @param {string} objectName - The name of the celestial object
 * @param {number} longitude - The longitude in degrees
 * @param {number} radius - The radius from center
 * @param {string} color - The color of the object
 */
export function drawCelestialStalk(objectName, longitude, radius, color) {
    const { ctx, centerX, centerY } = getCanvasContext();
    
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
