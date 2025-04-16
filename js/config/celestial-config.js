/**
 * Celestial objects configuration
 */

import { getPlanetSymbol } from '../../planet-symbols.js';

// Celestial objects configuration with improved orbital elements
export const CELESTIAL_OBJECTS = {
    'sun': { 
        symbol: '☉',  // Unicode fallback
        customSymbol: getPlanetSymbol('sun'),
        name: 'Sun', 
        color: '#ffdd44',
        radius: 120
    },
    'moon': { 
        symbol: '☽',  // Unicode fallback
        customSymbol: getPlanetSymbol('moon'),
        name: 'Moon', 
        color: '#d1d1d1',
        radius: 145
    },
    'mercury': { 
        symbol: '☿',  // Unicode fallback
        customSymbol: getPlanetSymbol('mercury'),
        name: 'Mercury', 
        color: '#8c8c8c',
        radius: 170
    },
    'venus': { 
        symbol: '♀',  // Unicode fallback
        customSymbol: getPlanetSymbol('venus'),
        name: 'Venus', 
        color: '#e39e54',
        radius: 195
    },
    'mars': { 
        symbol: '♂',  // Unicode fallback
        customSymbol: getPlanetSymbol('mars'),
        name: 'Mars', 
        color: '#c1440e',
        radius: 220
    },
    'jupiter': { 
        symbol: '♃',  // Unicode fallback
        customSymbol: getPlanetSymbol('jupiter'),
        name: 'Jupiter', 
        color: '#d8ca9d',
        radius: 245
    },
    'saturn': { 
        symbol: '♄',  // Unicode fallback
        customSymbol: getPlanetSymbol('saturn'),
        name: 'Saturn', 
        color: '#e0bb95',
        radius: 270
    }
};

/**
 * Get a celestial object by name
 * @param {string} name - The name of the celestial object
 * @returns {Object} The celestial object
 */
export function getCelestialObject(name) {
    const objectName = name.toLowerCase();
    if (CELESTIAL_OBJECTS[objectName]) {
        return CELESTIAL_OBJECTS[objectName];
    }
    throw new Error(`Unknown celestial object: ${name}`);
}
