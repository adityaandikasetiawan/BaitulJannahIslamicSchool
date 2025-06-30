/**
 * Cache Busting JavaScript
 * This script adds version query parameters to resource URLs for cache busting
 */

document.addEventListener('DOMContentLoaded', function() {
    // Version to use for cache busting
    const version = '1.0.0';
    
    // Add version to CSS links that don't already have a version parameter
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href && !href.includes('?v=') && !href.includes('?ver=')) {
            link.setAttribute('href', addVersionToUrl(href, version));
        }
    });
    
    // Add version to script sources that don't already have a version parameter
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(function(script) {
        const src = script.getAttribute('src');
        if (src && !src.includes('?v=') && !src.includes('?ver=')) {
            script.setAttribute('src', addVersionToUrl(src, version));
        }
    });
    
    // Add version to image sources that don't already have a version parameter
    const images = document.querySelectorAll('img[src]');
    images.forEach(function(img) {
        const src = img.getAttribute('src');
        if (src && !src.includes('?v=') && !src.includes('?ver=')) {
            img.setAttribute('src', addVersionToUrl(src, version));
        }
    });
    
    // Helper function to add version to URL
    function addVersionToUrl(url, version) {
        // Only add version to local resources (not external URLs)
        if (url.startsWith('http') && !url.includes(window.location.hostname)) {
            return url;
        }
        
        // Only add version to static resources
        if (url.match(/\.(css|js|jpg|jpeg|png|gif|svg|webp)$/i)) {
            // Check if URL already has query parameters
            if (url.includes('?')) {
                return url + '&v=' + version;
            } else {
                return url + '?v=' + version;
            }
        }
        
        return url;
    }
});