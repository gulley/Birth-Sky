/**
 * Font loading utilities
 */

/**
 * Load the custom font before rendering
 * @param {Function} callback - Function to call when font is loaded
 */
export function loadCustomFont(callback) {
    // Create a font loading promise
    const fontPromise = new Promise((resolve, reject) => {
        // Create a test span to check if the font is loaded
        const testSpan = document.createElement('span');
        testSpan.style.fontFamily = 'PlanetarySymbols, Arial';
        testSpan.style.fontSize = '24px';
        testSpan.style.visibility = 'hidden';
        testSpan.textContent = 'Q'; // Use a character from the font
        
        document.body.appendChild(testSpan);
        
        // Use FontFaceObserver if available, otherwise use a timeout approach
        if (typeof FontFaceObserver !== 'undefined') {
            const observer = new FontFaceObserver('PlanetarySymbols');
            observer.load().then(() => {
                document.body.removeChild(testSpan);
                resolve();
            }).catch(err => {
                console.warn('Font loading failed, using fallback:', err);
                document.body.removeChild(testSpan);
                resolve(); // Resolve anyway to continue with fallback
            });
        } else {
            // Fallback: check if the font is loaded after a short delay
            setTimeout(() => {
                document.body.removeChild(testSpan);
                resolve();
            }, 500); // Wait 500ms for the font to load
        }
    });
    
    // Wait for the font to load, then call the callback
    fontPromise.then(() => {
        if (callback && typeof callback === 'function') {
            callback();
        }
    }).catch(err => {
        console.error('Error loading font:', err);
        // Call callback anyway with fallback fonts
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}
