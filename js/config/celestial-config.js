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
        // Lunar orbital elements (simplified)
        period: 27.321582, 
        phaseOffset: 134.9, 
        eccentricity: 0.0549,
        inclination: 5.145,
        color: '#d1d1d1',
        radius: 60
    },
    'sun': { 
        symbol: '☉',  // Unicode fallback
        customSymbol: getPlanetSymbol('sun'),
        name: 'Sun', 
        // Earth's orbital elements (for Sun's apparent motion)
        period: 365.256363, 
        phaseOffset: 280.46, 
        eccentricity: 0.01671022,
        inclination: 0,
        color: '#ffdd44',
        radius: 90
    },
    'mercury': { 
        symbol: '☿',  // Unicode fallback
        customSymbol: getPlanetSymbol('mercury'),
        name: 'Mercury', 
        // Mercury's orbital elements
        period: 87.9691, 
        phaseOffset: 174.796, 
        eccentricity: 0.20563069,
        inclination: 7.00487,
        color: '#8c8c8c',
        radius: 120
    },
    'venus': { 
        symbol: '♀',  // Unicode fallback
        customSymbol: getPlanetSymbol('venus'),
        name: 'Venus', 
        // Venus's orbital elements
        period: 224.7008, 
        phaseOffset: 50.115, 
        eccentricity: 0.00677323,
        inclination: 3.39471,
        color: '#e39e54',
        radius: 150
    },
    'mars': { 
        symbol: '♂',  // Unicode fallback
        customSymbol: getPlanetSymbol('mars'),
        name: 'Mars', 
        // Mars's orbital elements
        period: 686.9796, 
        phaseOffset: 19.3730, 
        eccentricity: 0.09341233,
        inclination: 1.85061,
        color: '#c1440e',
        radius: 180
    },
    'jupiter': { 
        symbol: '♃',  // Unicode fallback
        customSymbol: getPlanetSymbol('jupiter'),
        name: 'Jupiter', 
        // Jupiter's orbital elements
        period: 4332.59, 
        phaseOffset: 18.818, 
        eccentricity: 0.04839266,
        inclination: 1.30530,
        color: '#d8ca9d',
        radius: 210
    },
    'saturn': { 
        symbol: '♄',  // Unicode fallback
        customSymbol: getPlanetSymbol('saturn'),
        name: 'Saturn', 
        // Saturn's orbital elements
        period: 10759.22, 
        phaseOffset: 320.346, 
        eccentricity: 0.05415060,
        inclination: 2.48446,
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
