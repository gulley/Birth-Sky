/**
 * UI template utility functions
 */

import { ZODIAC_SYMBOL_MAP } from '../../planet-symbols.js';
import { adjustColor } from './color-helpers.js';

/**
 * Generate HTML for a planet info card
 * @param {Object} objectInfo - The celestial object info
 * @param {Object} zodiacSign - The zodiac sign the object is in
 * @param {boolean} isTooltip - Whether this is for a tooltip (adds padding)
 * @returns {string} HTML for the planet info card
 */
export function generatePlanetInfoCard(objectInfo, zodiacSign, isTooltip = false) {
    // Get custom zodiac symbol if available
    const customZodiacSymbol = ZODIAC_SYMBOL_MAP[zodiacSign.name];
    
    // Additional styling for tooltips
    const tooltipStyle = isTooltip ? 'padding: 8px; border-radius: 8px; min-width: 120px;' : '';
    
    return `
        <div class="planet-info" style="background-color: ${adjustColor(objectInfo.color, -40)}; border: 1px solid ${adjustColor(objectInfo.color, 20)}; ${tooltipStyle}">
            <span class="planet-symbol" style="color: ${objectInfo.color}">${objectInfo.customSymbol || objectInfo.symbol}</span>
            <strong>${objectInfo.name}</strong>
            <span class="${customZodiacSymbol ? 'planet-symbol' : ''}" style="font-size: 18px;">${customZodiacSymbol || zodiacSign.symbol}</span>
            ${zodiacSign.name}
        </div>
    `;
}
