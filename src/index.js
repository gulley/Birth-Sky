// Import the astronomy library
import * as Astronomy from './astronomy.min.js';

// Function to calculate RA and Dec for celestial objects
function calculateCelestialCoordinates(date = new Date()) {
  // Create an observer at the center of the Earth (geocentric view)
  const observer = new Astronomy.Observer(0, 0, 0);
  
  // Convert the date to Astronomy.Time object
  const time = Astronomy.MakeTime(date);
  
  // List of celestial objects to calculate
  const celestialObjects = [
    { name: 'Sun', body: Astronomy.Body.Sun },
    { name: 'Moon', body: Astronomy.Body.Moon },
    { name: 'Mercury', body: Astronomy.Body.Mercury },
    { name: 'Venus', body: Astronomy.Body.Venus },
    { name: 'Mars', body: Astronomy.Body.Mars },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', body: Astronomy.Body.Saturn }
  ];
  
  // Calculate coordinates for each object
  const results = celestialObjects.map(object => {
    // Use GeoVector to get the position vector
    const vector = Astronomy.GeoVector(object.body, time, true);
    
    // Convert to equatorial coordinates
    const equatorial = Astronomy.Equator(object.body, time, observer, true, true);
    
    return {
      name: object.name,
      rightAscension: equatorial.ra,
      declination: equatorial.dec,
      distance: equatorial.dist,
      vector: {
        x: vector.x,
        y: vector.y,
        z: vector.z
      }
    };
  });
  
  return results;
}

// Function to format RA in hours:minutes:seconds
function formatRA(ra) {
  const hours = Math.floor(ra);
  const minutes = Math.floor((ra - hours) * 60);
  const seconds = Math.round(((ra - hours) * 60 - minutes) * 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

// Function to format Dec in degrees:arcminutes:arcseconds
function formatDec(dec) {
  const sign = dec < 0 ? '-' : '+';
  const absDec = Math.abs(dec);
  const degrees = Math.floor(absDec);
  const arcminutes = Math.floor((absDec - degrees) * 60);
  const arcseconds = Math.round(((absDec - degrees) * 60 - arcminutes) * 60);
  return `${sign}${degrees}° ${arcminutes}' ${arcseconds}"`;
}

// Function to update the UI with calculated coordinates
function updateCelestialDisplay(date = new Date()) {
  const coordinates = calculateCelestialCoordinates(date);
  
  // Get the planet data container
  const planetDataContainer = document.getElementById('planet-data');
  if (!planetDataContainer) return;
  
  // Clear existing content
  planetDataContainer.innerHTML = '';
  
  // Add each celestial object's data
  coordinates.forEach(object => {
    const planetInfo = document.createElement('div');
    planetInfo.className = 'planet-info';
    planetInfo.style.backgroundColor = getBackgroundColor(object.name);
    planetInfo.style.borderColor = getBorderColor(object.name);
    
    planetInfo.innerHTML = `
      <span class="planet-symbol" style="color: ${getSymbolColor(object.name)}">${getSymbol(object.name)}</span>
      <strong>${object.name}</strong>
      <br>
      <small>
        RA: ${formatRA(object.rightAscension)}
        <br>
        Dec: ${formatDec(object.declination)}
        <br>
        Dist: ${object.distance.toFixed(6)} AU
      </small>
    `;
    
    planetDataContainer.appendChild(planetInfo);
  });
  
  // Update the current time display
  const currentTimeElement = document.getElementById('current-time');
  if (currentTimeElement) {
    currentTimeElement.textContent = date.toUTCString();
  }
}

// Helper functions for styling
function getSymbol(name) {
  const symbols = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄'
  };
  return symbols[name] || '';
}

function getSymbolColor(name) {
  const colors = {
    'Sun': '#ffdd44',
    'Moon': '#d1d1d1',
    'Mercury': '#8c8c8c',
    'Venus': '#e39e54',
    'Mars': '#c1440e',
    'Jupiter': '#d8ca9d',
    'Saturn': '#e0bb95'
  };
  return colors[name] || '#ffffff';
}

function getBackgroundColor(name) {
  const colors = {
    'Sun': '#554400',
    'Moon': '#444444',
    'Mercury': '#333333',
    'Venus': '#553311',
    'Mars': '#441100',
    'Jupiter': '#443322',
    'Saturn': '#443322'
  };
  return colors[name] || '#054154';
}

function getBorderColor(name) {
  const colors = {
    'Sun': '#ffdd44',
    'Moon': '#d1d1d1',
    'Mercury': '#8c8c8c',
    'Venus': '#e39e54',
    'Mars': '#c1440e',
    'Jupiter': '#d8ca9d',
    'Saturn': '#e0bb95'
  };
  return colors[name] || '#0596be';
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize date picker with current date and time
  const now = new Date();
  const dateString = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  const datePicker = document.getElementById('date-picker');
  if (datePicker) {
    datePicker.value = dateString;
  }

  // Update button - use selected date
  const updateBtn = document.getElementById('update-btn');
  if (updateBtn) {
    updateBtn.addEventListener('click', function() {
      const dateInput = document.getElementById('date-picker').value;
      if (dateInput) {
        const selectedDate = new Date(dateInput);
        updateCelestialDisplay(selectedDate);
      } else {
        updateCelestialDisplay();
      }
    });
  }

  // Current time button - use current time
  const currentTimeBtn = document.getElementById('current-time-btn');
  if (currentTimeBtn) {
    currentTimeBtn.addEventListener('click', function() {
      const now = new Date();
      const dateString = now.toISOString().slice(0, 16);
      const datePicker = document.getElementById('date-picker');
      if (datePicker) {
        datePicker.value = dateString;
      }
      updateCelestialDisplay(now);
    });
  }

  // Initial display on page load
  updateCelestialDisplay(now);
});

// Export the functions for external use
export {
  calculateCelestialCoordinates,
  formatRA,
  formatDec,
  updateCelestialDisplay
};
