/**
 * Zodiac sign configurations
 */

// Zodiac signs configuration based on IAU Constellation Boundary Crossings (true astronomical positions)
export const TRUE_ZODIAC_SIGNS = [
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
export const TRADITIONAL_ZODIAC_SIGNS = [
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

// Default zodiac signs export
export let ZODIAC_SIGNS = TRUE_ZODIAC_SIGNS;

/**
 * Function to determine which zodiac sign a celestial object is in
 * @param {number} longitude - The longitude in degrees
 * @param {Array} zodiacSigns - The zodiac signs array to use
 * @returns {Object} The zodiac sign object
 */
export function getZodiacSign(longitude, zodiacSigns = ZODIAC_SIGNS) {
    // Special case for Pisces in TRUE_ZODIAC_SIGNS which crosses the 0° boundary
    if (zodiacSigns === TRUE_ZODIAC_SIGNS) {
        const pisces = zodiacSigns[11]; // Pisces is the last sign in our array
        if ((longitude >= pisces.start && longitude < 360) || (longitude >= 0 && longitude < pisces.end)) {
            return pisces;
        }
    }
    
    // For all other signs or when using traditional zodiac
    for (const sign of zodiacSigns) {
        if (longitude >= sign.start && longitude < sign.end) {
            return sign;
        }
    }
    
    // If we couldn't find a sign, it might be due to floating point precision issues
    // during animation. Find the closest sign.
    console.warn(`Could not determine exact zodiac sign for longitude: ${longitude}, finding closest`);
    
    // Default to Aries for traditional zodiac
    if (zodiacSigns === TRADITIONAL_ZODIAC_SIGNS) {
        return zodiacSigns[0]; // Aries
    }
    
    // For true zodiac, check if it's close to Pisces boundary
    if (longitude < 30) {
        return zodiacSigns[11]; // Pisces
    } else {
        // Find the closest sign
        for (const sign of zodiacSigns) {
            if (Math.abs(longitude - sign.start) < 1 || Math.abs(longitude - sign.end) < 1) {
                return sign;
            }
        }
        // If all else fails, return Aries
        return zodiacSigns[0];
    }
}

/**
 * Set the current zodiac signs configuration
 * @param {Array} signs - The zodiac signs array to use
 */
export function setZodiacSigns(signs) {
    ZODIAC_SIGNS = signs;
}
