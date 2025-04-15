/**
 * Zodiac transition animation functionality
 */

import { TRUE_ZODIAC_SIGNS, TRADITIONAL_ZODIAC_SIGNS, setZodiacSigns } from '../config/zodiac-config.js';

// Animation variables
let isAnimating = false;
let animationStartTime = 0;
let animationDuration = 1000; // 1 second animation
let fromZodiacSigns = null;
let toZodiacSigns = null;
let animationFrame = null;
let updateCallback = null;

/**
 * Start zodiac transition animation
 * @param {boolean} useTrueZodiac - Whether to use true zodiac signs
 * @param {Array} currentZodiacSigns - The current zodiac signs array
 * @param {Function} onUpdate - Callback function to update the display
 */
export function startZodiacTransition(useTrueZodiac, currentZodiacSigns, onUpdate) {
    // Cancel any ongoing animation
    if (isAnimating && animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    // Set up animation parameters
    fromZodiacSigns = [...currentZodiacSigns]; // Clone current zodiac signs
    updateCallback = onUpdate;
    
    // Toggle between true and traditional zodiac signs
    if (useTrueZodiac) {
        toZodiacSigns = TRUE_ZODIAC_SIGNS;
    } else {
        toZodiacSigns = TRADITIONAL_ZODIAC_SIGNS;
    }
    
    // Start animation
    isAnimating = true;
    animationStartTime = performance.now();
    animateZodiacTransition();
}

/**
 * Animate transition between zodiac configurations
 */
function animateZodiacTransition() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - animationStartTime;
    const progress = Math.min(elapsedTime / animationDuration, 1);
    
    // Easing function (ease-in-out)
    const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Create interpolated zodiac signs
    const interpolatedSigns = fromZodiacSigns.map((fromSign, index) => {
        const toSign = toZodiacSigns[index];
        
        // Interpolate start and end values
        let startInterpolated, endInterpolated;
        
        // Special case for Pisces which crosses the 0° boundary
        if (fromSign.name === 'Pisces' || toSign.name === 'Pisces') {
            // Handle Pisces specially to ensure it only rotates through ~30 degrees
            
            // For Pisces in TRUE_ZODIAC_SIGNS: start=351.5, end=29.0
            // For Pisces in TRADITIONAL_ZODIAC_SIGNS: start=330, end=360
            
            // Calculate the shortest path for start value
            let startDiff = toSign.start - fromSign.start;
            if (Math.abs(startDiff) > 180) {
                // Take the shorter path around the circle
                startDiff = startDiff > 0 ? startDiff - 360 : startDiff + 360;
            }
            startInterpolated = (fromSign.start + startDiff * easedProgress + 360) % 360;
            
            // Calculate the shortest path for end value
            let endDiff = toSign.end - fromSign.end;
            if (Math.abs(endDiff) > 180) {
                // Take the shorter path around the circle
                endDiff = endDiff > 0 ? endDiff - 360 : endDiff + 360;
            }
            endInterpolated = (fromSign.end + endDiff * easedProgress + 360) % 360;
            
            // Ensure Pisces always crosses the 0° boundary correctly
            if (toSign.name === 'Pisces' && toSign.start > toSign.end) {
                if (startInterpolated < endInterpolated) {
                    // Ensure start is greater than end for Pisces when it should cross boundary
                    startInterpolated += 360;
                }
            } else if (fromSign.name === 'Pisces' && fromSign.start > fromSign.end) {
                if (startInterpolated < endInterpolated && easedProgress < 0.5) {
                    // Keep the boundary crossing during the first half of animation
                    startInterpolated += 360;
                }
            }
        } else {
            // Normal case - no boundary crossing
            startInterpolated = fromSign.start + (toSign.start - fromSign.start) * easedProgress;
            endInterpolated = fromSign.end + (toSign.end - fromSign.end) * easedProgress;
        }
        
        // Return interpolated sign
        return {
            symbol: toSign.symbol, // Use the target symbol
            name: toSign.name,     // Use the target name
            start: startInterpolated,
            end: endInterpolated
        };
    });
    
    // Update current zodiac signs
    setZodiacSigns(interpolatedSigns);
    
    // Update the display with the callback
    if (updateCallback) {
        updateCallback(interpolatedSigns);
    }
    
    // Continue animation if not complete
    if (progress < 1) {
        animationFrame = requestAnimationFrame(animateZodiacTransition);
    } else {
        // Animation complete
        isAnimating = false;
        setZodiacSigns(toZodiacSigns); // Ensure we end with the exact target values
        
        // Final update with the exact target values
        if (updateCallback) {
            updateCallback(toZodiacSigns);
        }
    }
}

/**
 * Check if zodiac transition is currently animating
 * @returns {boolean} Whether animation is in progress
 */
export function isZodiacAnimating() {
    return isAnimating;
}

/**
 * Cancel any ongoing zodiac transition animation
 */
export function cancelZodiacTransition() {
    if (isAnimating && animationFrame) {
        cancelAnimationFrame(animationFrame);
        isAnimating = false;
    }
}
