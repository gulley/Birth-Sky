/**
 * Planetary symbols mapping
 */

// Mapping for planetary symbols in the Astronomicon font
export const PLANET_SYMBOL_MAP = {
    // Character mappings for Astronomicon.ttf
    'sun': 'Q',      // The Sun
    'moon': 'R',     // The Moon
    'mercury': 'S',  // Mercury
    'venus': 'T',    // Venus
    'earth': '>',    // Earth symbol
    'mars': 'U',     // Mars
    'jupiter': 'V',  // Jupiter
    'saturn': 'W',   // Saturn
    'uranus': 'X',   // Placeholder - not specified in the mapping
    'neptune': 'Y',  // Placeholder - not specified in the mapping
    'pluto': 'Z'     // Placeholder - not specified in the mapping
};

// Mapping for zodiac symbols in the Astronomicon font
export const ZODIAC_SYMBOL_MAP = {
    'Aries': 'A',        // Aries
    'Taurus': 'B',       // Taurus
    'Gemini': 'C',       // Gemini
    'Cancer': 'D',       // Cancer
    'Leo': 'E',          // Leo
    'Virgo': 'F',        // Virgo
    'Libra': 'G',        // Libra
    'Scorpius': 'H',     // Scorpius (not Scorpio)
    'Sagittarius': 'I',  // Sagittarius
    'Capricornus': '\\', // Capricornus (not Capricorn)
    'Aquarius': 'K',     // Aquarius
    'Pisces': 'L'        // Pisces
};

/**
 * Get the custom font symbol for a planet
 * @param {string} planetName - The name of the planet
 * @returns {string} The symbol for the planet
 */
export function getPlanetSymbol(planetName) {
    return PLANET_SYMBOL_MAP[planetName.toLowerCase()] || '?';
}
