# Birth Sky - Celestial Object Position Calculator

This application calculates and displays the Right Ascension (RA), Declination (Dec), and Ecliptic coordinates (longitude and latitude) for 7 celestial objects: Sun, Moon, Mercury, Venus, Mars, Jupiter, and Saturn.

## Features

- Calculates precise RA, Dec, and ecliptic coordinates using the astronomy-engine library
- Displays celestial object positions in a user-friendly interface
- Visualizes celestial objects on a circular chart based on their ecliptic longitude
- Shows zodiac signs and their boundaries based on IAU constellation boundaries
- Allows selection of any date and time for calculations
- Shows additional information like distance from Earth and zodiac sign position

## Implementation Details

The application uses:

- **astronomy-engine**: A high-precision astronomy calculation library
- **GeoVector**: Used to calculate the position vectors of celestial objects
- **Equator**: Used to convert position vectors to equatorial coordinates (RA and Dec)
- **Ecliptic**: Used to convert position vectors to ecliptic coordinates (longitude and latitude)

## How to Use

1. Open `index.html` in a web browser
2. The current positions of celestial objects will be displayed automatically
3. Use the date/time picker to select a different date and time
4. Click "Update" to recalculate positions for the selected date/time
5. Click "Use Current Time" to return to the current date and time

## Technical Notes

- RA is displayed in hours:minutes:seconds format (traditional astronomical notation)
- Dec is displayed in degrees:arcminutes:arcseconds format
- Ecliptic longitude and latitude are displayed in degrees:arcminutes:arcseconds format
- The visual chart displays celestial objects positioned by their ecliptic longitude, with 0° (vernal equinox) at the 3 o'clock position and 90° (summer solstice) at the 12 o'clock position
- Zodiac signs are displayed around the chart with their traditional symbols
- Zodiac boundaries are based on IAU constellation boundaries (with Scorpius covering the Ophiuchus region)
- All calculations are performed using the geocentric reference frame (as viewed from Earth's center)
- The application uses the J2000 epoch for coordinate calculations

## Development

The project uses:

- JavaScript ES6+ features
- Webpack and Babel for module bundling and transpilation
- Custom styling for a space-themed interface

## Credits

- Astronomy calculations powered by the [astronomy-engine](https://github.com/cosinekitty/astronomy) library
