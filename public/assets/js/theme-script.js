/**
 * Theme Script - Handles theme mode switching
 * This script initializes and manages the theme mode (light/dark)
 */

(function() {
    'use strict';
    
    // Check for saved theme preference or use default
    function getThemePreference() {
        return localStorage.getItem('theme') || 'light';
    }
    
    // Apply theme class to html element
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle buttons state
        updateToggleButtons(theme);
    }
    
    // Update toggle buttons based on current theme
    function updateToggleButtons(theme) {
        if (document.getElementById('dark-mode-toggle') && document.getElementById('light-mode-toggle')) {
            if (theme === 'dark') {
                document.getElementById('dark-mode-toggle').classList.remove('activate');
                document.getElementById('light-mode-toggle').classList.add('activate');
            } else {
                document.getElementById('dark-mode-toggle').classList.add('activate');
                document.getElementById('light-mode-toggle').classList.remove('activate');
            }
        }
    }
    
    // Initialize theme
    document.addEventListener('DOMContentLoaded', function() {
        // Apply saved theme on page load
        const savedTheme = getThemePreference();
        applyTheme(savedTheme);
        
        // Set up event listeners for theme toggle buttons
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const lightModeToggle = document.getElementById('light-mode-toggle');
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                applyTheme('dark');
            });
        }
        
        if (lightModeToggle) {
            lightModeToggle.addEventListener('click', function() {
                applyTheme('light');
            });
        }
    });
})();