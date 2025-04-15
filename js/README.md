# Birth Sky JavaScript Modules

This directory contains the modularized JavaScript code for the Birth Sky application. The original monolithic `script.js` has been refactored into multiple modules with related functionality.

## Directory Structure

```
js/
├── config/             # Configuration modules
│   ├── zodiac-config.js    # Zodiac sign configurations
│   └── celestial-config.js # Celestial objects configuration
├── utils/              # Utility modules
│   ├── astronomy-calc.js   # Astronomy calculation utilities
│   ├── color-helpers.js    # Color utility functions
│   └── font-loader.js      # Font loading utilities
├── drawing/            # Drawing modules
│   ├── chart-base.js       # Base chart drawing functionality
│   └── medallions.js       # Medallion drawing functionality
├── animation/          # Animation modules
│   └── zodiac-transition.js # Zodiac transition animation
└── main.js             # Main application entry point
```

## Module Descriptions

### Config Modules

- **zodiac-config.js**: Contains zodiac sign configurations for both true astronomical positions and traditional 30° divisions. Exports functions for determining which zodiac sign a celestial object is in.

- **celestial-config.js**: Contains celestial objects configuration with orbital elements, symbols, colors, and other properties.

### Utility Modules

- **astronomy-calc.js**: Contains functions for calculating celestial coordinates using the astronomy-engine library, as well as fallback methods for simple position calculations.

- **color-helpers.js**: Contains utility functions for color manipulation, such as converting hex to RGB and adjusting colors.

- **font-loader.js**: Contains functionality for loading custom fonts before rendering.

### Drawing Modules

- **chart-base.js**: Contains functionality for initializing the canvas and drawing the base celestial chart, including zodiac signs and orbit circles.

- **medallions.js**: Contains functionality for drawing Earth medallion, celestial object medallions, and stalks.

### Animation Modules

- **zodiac-transition.js**: Contains functionality for animating transitions between zodiac configurations.

### Main Module

- **main.js**: The main entry point that ties everything together. Initializes the application, sets up event listeners, and coordinates the drawing and updating of celestial positions.

## Usage

The application is loaded via the `main.js` module, which is included in the HTML as a module script:

```html
<script type="module" src="js/main.js"></script>
```

## Dependencies

- **planet-symbols.js**: Contains mappings for planetary and zodiac symbols in the Astronomicon font.
- **astronomy-wrapper.js**: Defines the exports object for astronomy.min.js.
- **astronomy.min.js**: The astronomy engine library for celestial calculations.
