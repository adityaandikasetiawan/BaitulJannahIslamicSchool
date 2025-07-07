/**
 * Iconsax JS
 * This script initializes and manages Iconsax icons
 */

(function() {
    'use strict';
    
    // Initialize Iconsax icons
    document.addEventListener('DOMContentLoaded', function() {
        // Replace icon placeholders with SVG
        const iconElements = document.querySelectorAll('.isax');
        
        iconElements.forEach(function(element) {
            // Get icon name from classes
            const classes = element.className.split(' ');
            let iconName = '';
            
            for (let i = 0; i < classes.length; i++) {
                if (classes[i].startsWith('isax-')) {
                    iconName = classes[i].replace('isax-', '');
                    break;
                }
            }
            
            if (iconName) {
                // Set default icon properties
                const size = element.getAttribute('data-size') || '24';
                const color = element.getAttribute('data-color') || 'currentColor';
                const stroke = element.getAttribute('data-stroke') || '1.5';
                
                // Create SVG element based on icon name
                createSvgIcon(element, iconName, size, color, stroke);
            }
        });
    });
    
    // Create SVG icon based on icon name
    function createSvgIcon(element, iconName, size, color, stroke) {
        // Common SVG attributes
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        
        // Map of icon paths (simplified for common icons used in the template)
        const iconPaths = {
            'menu': {
                paths: [
                    { d: 'M3 7h18', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round' },
                    { d: 'M3 12h18', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round' },
                    { d: 'M3 17h18', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round' }
                ]
            },
            'search-normal': {
                paths: [
                    { d: 'M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M21 21L17 17', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'sun-15': {
                paths: [
                    { d: 'M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'moon': {
                paths: [
                    { d: 'M2.03 12.42C2.23 17.57 6.4 21.76 11.56 21.99C15.24 22.15 18.47 20.43 20.36 17.72C21.26 16.61 20.86 15.87 19.54 16.12C18.86 16.24 18.16 16.29 17.43 16.26C12.98 16.06 9.42 12.5 9.22 8.05C9.16 6.91 9.33 5.83 9.67 4.81C10.03 3.73 9.24 3.06 8.15 3.76C4.5 6.15 1.88 9.79 2.03 12.42Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'security-user': {
                paths: [
                    { d: 'M10.49 2.23L5.5 4.11C4.35 4.54 3.41 5.9 3.41 7.12V14.55C3.41 15.73 4.19 17.28 5.14 17.99L9.44 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12C20.61 5.89 19.67 4.53 18.52 4.1L13.53 2.23C12.68 1.92 11.32 1.92 10.49 2.23Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M12 10.92C13.7397 10.92 15.15 9.50973 15.15 7.77C15.15 6.03027 13.7397 4.62 12 4.62C10.2603 4.62 8.85 6.03027 8.85 7.77C8.85 9.50973 10.2603 10.92 12 10.92Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M16 16.92C16 15.07 14.21 13.57 12 13.57C9.79 13.57 8 15.07 8 16.92', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'setting-2': {
                paths: [
                    { d: 'M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M15.57 18.5V14.6', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M15.57 7.45V5.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M15.57 12.65C17.0059 12.65 18.17 11.4859 18.17 10.05C18.17 8.61401 17.0059 7.45 15.57 7.45C14.134 7.45 12.97 8.61401 12.97 10.05C12.97 11.4859 14.134 12.65 15.57 12.65Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M8.43 18.5V16.55', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M8.43 9.4V5.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M8.43 16.55C9.90589 16.55 11.07 15.386 11.07 13.91C11.07 12.4341 9.90589 11.27 8.43 11.27C6.95401 11.27 5.79 12.4341 5.79 13.91C5.79 15.386 6.95401 16.55 8.43 16.55Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'logout': {
                paths: [
                    { d: 'M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M15 12H3.62', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M5.85 8.65L2.5 12L5.85 15.35', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'element-3': {
                paths: [
                    { d: 'M22 8.27V4.23C22 2.64 21.36 2 19.77 2H15.73C14.14 2 13.5 2.64 13.5 4.23V8.27C13.5 9.86 14.14 10.5 15.73 10.5H19.77C21.36 10.5 22 9.86 22 8.27Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M14.5 17.5H20.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round' },
                    { d: 'M17.5 20.5V14.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round' }
                ]
            },
            'home': {
                paths: [
                    { d: 'M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M12 17.99V14.99', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'book-1': {
                paths: [
                    { d: 'M22 16.74V4.67C22 3.47 21.02 2.58 19.83 2.68H19.77C17.67 2.86 14.48 3.93 12.7 5.05L12.53 5.16C12.24 5.34 11.76 5.34 11.47 5.16L11.22 5.01C9.44 3.9 6.26 2.84 4.16 2.67C2.97 2.57 2 3.47 2 4.66V16.74C2 17.7 2.78 18.6 3.74 18.72L4.03 18.76C6.2 19.05 9.55 20.15 11.47 21.2L11.51 21.22C11.78 21.37 12.21 21.37 12.47 21.22C14.39 20.16 17.75 19.05 19.93 18.76L20.26 18.72C21.22 18.6 22 17.7 22 16.74Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M12 5.49V20.49', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M7.75 8.49H5.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M8.5 11.49H5.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'info-circle': {
                paths: [
                    { d: 'M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M12 8V13', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M11.9945 16H12.0035', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'calendar-1': {
                paths: [
                    { d: 'M8 2V5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M16 2V5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M3.5 9.09H20.5', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M15.6947 13.7H15.7037', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M15.6947 16.7H15.7037', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M11.9955 13.7H12.0045', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M11.9955 16.7H12.0045', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M8.29431 13.7H8.30329', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M8.29431 16.7H8.30329', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'profile-2user': {
                paths: [
                    { d: 'M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'user-add': {
                paths: [
                    { d: 'M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M3.41 22C3.41 18.13 7.26 15 12 15C12.96 15 13.89 15.13 14.76 15.37', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M22 18C22 18.32 21.96 18.63 21.88 18.93C21.79 19.33 21.63 19.72 21.42 20.06C20.73 21.22 19.46 22 18 22C16.97 22 16.04 21.61 15.34 20.97C15.04 20.71 14.78 20.4 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.92 14.43 15.93 15.13 15.21C15.86 14.46 16.88 14 18 14C19.18 14 20.25 14.51 20.97 15.33C21.61 16.04 22 16.98 22 18Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M19.49 17.98H16.51', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M18 16.52V19.51', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            },
            'gallery': {
                paths: [
                    { d: 'M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    { d: 'M2.67 18.95L7.6 15.64C8.39 15.11 9.53 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9', stroke, 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
                ]
            }
        };
        
        // Create SVG path elements
        if (iconPaths[iconName]) {
            iconPaths[iconName].paths.forEach(function(pathData) {
                const path = document.createElementNS(svgNS, 'path');
                
                // Set path attributes
                for (const attr in pathData) {
                    if (attr !== 'd') {
                        path.setAttribute(attr, pathData[attr]);
                    }
                }
                
                path.setAttribute('d', pathData.d);
                path.setAttribute('stroke', color);
                
                svg.appendChild(path);
            });
            
            // Replace the original element with SVG
            element.parentNode.replaceChild(svg, element);
        }
    }
})();