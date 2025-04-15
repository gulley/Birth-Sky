/**
 * Celestial objects configuration
 */

import { getPlanetSymbol } from '../../planet-symbols.js';

// Celestial objects configuration with improved orbital elements
export const CELESTIAL_OBJECTS = {
    'moon': { 
        symbol: '☽',  // Unicode fallback
        customSymbol: getPlanetSymbol('moon'),
        name: 'Moon', 
        color: '#d1d1d1',
        radius: 120
    },
    'sun': { 
        symbol: '☉',  // Unicode fallback
        customSymbol: getPlanetSymbol('sun'),
        name: 'Sun', 
        color: '#ffdd44',
        radius: 140
    },
    'mercury': { 
        symbol: '☿',  // Unicode fallback
        customSymbol: getPlanetSymbol('mercury'),
        name: 'Mercury', 
        color: '#8c8c8c',
        radius: 160
    },
    'venus': { 
        symbol: '♀',  // Unicode fallback
        customSymbol: getPlanetSymbol('venus'),
        name: 'Venus', 
        color: '#e39e54',
        radius: 180
    },
    'mars': { 
        symbol: '♂',  // Unicode fallback
        customSymbol: getPlanetSymbol('mars'),
        name: 'Mars', 
        color: '#c1440e',
        radius: 200
    },
    'jupiter': { 
        symbol: '♃',  // Unicode fallback
        customSymbol: getPlanetSymbol('jupiter'),
        name: 'Jupiter', 
        color: '#d8ca9d',
        radius: 220
    },
    'saturn': { 
        symbol: '♄',  // Unicode fallback
        customSymbol: getPlanetSymbol('saturn'),
        name: 'Saturn', 
        color: '#e0bb95',
        radius: 240
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
