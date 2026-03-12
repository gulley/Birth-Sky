/**
 * Astronomy calculation utilities
 */

// The astronomy-engine library is loaded from CDN and available as a global variable 'exports'

/**
 * Calculate celestial coordinates using the astronomy-engine library
 * @param {Object} celestialObject - The celestial object
 * @param {Date} date - The date to calculate for
 * @returns {Object} The equatorial coordinates
 */
export function calculateCelestialCoordinates(celestialObject, date) {
    let observer = new exports.Observer(0, 0, 0); // Observer at the center of the Earth
    let time = exports.MakeTime(date);

    switch (celestialObject.name.toLowerCase()) {
        case 'moon':
            return exports.Equator(exports.Body.Moon, time, observer, true, true);
        case 'sun':
            return exports.Equator(exports.Body.Sun, time, observer, true, true);
        case 'mercury':
            return exports.Equator(exports.Body.Mercury, time, observer, true, true);
        case 'venus':
            return exports.Equator(exports.Body.Venus, time, observer, true, true);
        case 'mars':
            return exports.Equator(exports.Body.Mars, time, observer, true, true);
        case 'jupiter':
            return exports.Equator(exports.Body.Jupiter, time, observer, true, true);
        case 'saturn':
            return exports.Equator(exports.Body.Saturn, time, observer, true, true);
        default:
            throw new Error('Unknown celestial object: ' + celestialObject.name);
    }
}

