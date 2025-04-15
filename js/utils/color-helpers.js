/**
 * Color utility functions
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - The hex color code
 * @returns {string} The RGB color as a string (e.g. "255, 255, 255")
 */
export function colorToRgb(hex) {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Parse the RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}

/**
 * Darken or lighten a color
 * @param {string} hex - The hex color code
 * @param {number} percent - The percentage to adjust by (positive to lighten, negative to darken)
 * @returns {string} The adjusted hex color
 */
export function adjustColor(hex, percent) {
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
