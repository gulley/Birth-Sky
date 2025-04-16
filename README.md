# Birth Sky - Celestial Object Position Calculator

This application calculates and displays the positions of 7 celestial objects (Sun, Moon, Mercury, Venus, Mars, Jupiter, and Saturn) in a visually appealing zodiac chart. It shows their Right Ascension (RA), Declination (Dec), and zodiac sign positions.

## Run This Now
[Birth Sky](https://gulley.github.io/Birth-Sky/)

## To Do

- Radial zodiac grid lines should go over the opaque zodiac circle and out to edges of the sky circle.
- Switch checkbox polarity so it says "Use Traditional Zodiac" and is off by default.
- Sun should be in innermost planet ring
- Even out the medallion spacing
- Add a "label mode" that shows
    - Evening and morning sky
    - Planet info cards
    - Seasons (with square)
    - Quarter Days (solstices and equinoxes)
    - Cross-Quarter Days (May Day, Lammas, Halloween, Groundhog Day)

## Features

- Calculates precise RA, Dec, and ecliptic coordinates using the astronomy-engine library
- Displays celestial object positions in a user-friendly interface
- Visualizes celestial objects on a circular chart based on their ecliptic longitude
- Shows zodiac signs and their boundaries with custom astronomical symbols
- Allows selection of any date and time for calculations with instant updates
- Toggle between true astronomical zodiac boundaries and traditional 30° divisions
- Smooth animations when switching between zodiac systems
- Uses the Astronomicon font for authentic astronomical symbols

## Implementation Details

The application uses:

- **astronomy-engine**: A high-precision astronomy calculation library
- **Astronomicon font**: Professional astronomical symbol font
- **FontFaceObserver**: For reliable font loading
- **Canvas API**: For drawing the celestial chart
- **Smooth animations**: Using requestAnimationFrame for zodiac transitions

## How to Use

1. Open `index.html` in a web browser
2. The current positions of celestial objects will be displayed automatically
3. Use the date/time picker to select a different date and time (updates instantly)
4. Click "Use Current Time" to return to the current date and time
5. Toggle the "Use true zodiac" checkbox to switch between astronomical and traditional zodiac boundaries

## Technical Notes

- RA is displayed in hours format (traditional astronomical notation)
- Dec is displayed in degrees format
- The visual chart displays celestial objects positioned by their ecliptic longitude, with 0° at the top position and proceeding clockwise
- Zodiac signs are displayed around the chart with symbols from the Astronomicon font
- Two zodiac systems are available:
  - True zodiac: Based on IAU constellation boundaries
  - Traditional zodiac: Equal 30° divisions starting from 0° Aries
- All calculations are performed using the geocentric reference frame (as viewed from Earth's center)
- The application uses the J2000 epoch for coordinate calculations
- Planetary symbols use the Astronomicon font (https://astronomicon.co/en/astronomicon-fonts/)
- Smooth animations with easing functions provide a seamless transition between zodiac systems

## Development

The project uses:

- JavaScript ES6+ features
- Canvas API for drawing the celestial chart
- CSS Grid and Flexbox for responsive layout
- FontFaceObserver for reliable font loading
- Custom styling for a space-themed interface

## Credits

- Astronomy calculations powered by the [astronomy-engine](https://github.com/cosinekitty/astronomy) library
- Astronomical symbols from the [Astronomicon](https://astronomicon.co/en/astronomicon-fonts/) font
