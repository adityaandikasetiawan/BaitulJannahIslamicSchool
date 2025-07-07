/**
 * Theme Settings JS
 * This script handles theme settings panel and customization options
 */

(function($) {
    'use strict';
    
    // Theme Settings Variables
    const themeSettingsPanel = $('.theme-settings-panel');
    const themeSettingsToggle = $('.theme-settings-toggle');
    const colorOptions = $('.theme-color-option');
    const fontOptions = $('.theme-font-option');
    const layoutOptions = $('.theme-layout-option');
    
    // Initialize Theme Settings
    function initThemeSettings() {
        // Load saved settings from localStorage
        loadSavedSettings();
        
        // Toggle settings panel
        themeSettingsToggle.on('click', function(e) {
            e.preventDefault();
            themeSettingsPanel.toggleClass('show-settings');
        });
        
        // Close settings when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.theme-settings-panel, .theme-settings-toggle').length) {
                themeSettingsPanel.removeClass('show-settings');
            }
        });
        
        // Color scheme selection
        colorOptions.on('click', function() {
            const colorScheme = $(this).data('color');
            setColorScheme(colorScheme);
            colorOptions.removeClass('active');
            $(this).addClass('active');
        });
        
        // Font selection
        fontOptions.on('click', function() {
            const fontFamily = $(this).data('font');
            setFontFamily(fontFamily);
            fontOptions.removeClass('active');
            $(this).addClass('active');
        });
        
        // Layout selection
        layoutOptions.on('click', function() {
            const layout = $(this).data('layout');
            setLayout(layout);
            layoutOptions.removeClass('active');
            $(this).addClass('active');
        });
        
        // Reset settings
        $('.reset-theme-settings').on('click', function(e) {
            e.preventDefault();
            resetSettings();
        });
    }
    
    // Load saved settings from localStorage
    function loadSavedSettings() {
        // Color scheme
        const savedColor = localStorage.getItem('themeColor') || 'default';
        setColorScheme(savedColor);
        $(`.theme-color-option[data-color="${savedColor}"]`).addClass('active');
        
        // Font family
        const savedFont = localStorage.getItem('themeFont') || 'default';
        setFontFamily(savedFont);
        $(`.theme-font-option[data-font="${savedFont}"]`).addClass('active');
        
        // Layout
        const savedLayout = localStorage.getItem('themeLayout') || 'default';
        setLayout(savedLayout);
        $(`.theme-layout-option[data-layout="${savedLayout}"]`).addClass('active');
    }
    
    // Set color scheme
    function setColorScheme(colorScheme) {
        // Remove existing color scheme classes
        $('body').removeClass(function(index, className) {
            return (className.match(/(^|\s)color-scheme-\S+/g) || []).join(' ');
        });
        
        // Add new color scheme class if not default
        if (colorScheme !== 'default') {
            $('body').addClass(`color-scheme-${colorScheme}`);
        }
        
        // Save to localStorage
        localStorage.setItem('themeColor', colorScheme);
    }
    
    // Set font family
    function setFontFamily(fontFamily) {
        // Remove existing font family classes
        $('body').removeClass(function(index, className) {
            return (className.match(/(^|\s)font-family-\S+/g) || []).join(' ');
        });
        
        // Add new font family class if not default
        if (fontFamily !== 'default') {
            $('body').addClass(`font-family-${fontFamily}`);
        }
        
        // Save to localStorage
        localStorage.setItem('themeFont', fontFamily);
    }
    
    // Set layout
    function setLayout(layout) {
        // Remove existing layout classes
        $('body').removeClass(function(index, className) {
            return (className.match(/(^|\s)layout-\S+/g) || []).join(' ');
        });
        
        // Add new layout class if not default
        if (layout !== 'default') {
            $('body').addClass(`layout-${layout}`);
        }
        
        // Save to localStorage
        localStorage.setItem('themeLayout', layout);
    }
    
    // Reset all settings to default
    function resetSettings() {
        // Reset color scheme
        setColorScheme('default');
        colorOptions.removeClass('active');
        $('.theme-color-option[data-color="default"]').addClass('active');
        
        // Reset font family
        setFontFamily('default');
        fontOptions.removeClass('active');
        $('.theme-font-option[data-font="default"]').addClass('active');
        
        // Reset layout
        setLayout('default');
        layoutOptions.removeClass('active');
        $('.theme-layout-option[data-layout="default"]').addClass('active');
    }
    
    // Initialize when document is ready
    $(document).ready(function() {
        // Only initialize if theme settings panel exists
        if (themeSettingsPanel.length) {
            initThemeSettings();
        }
        
        // Dark/Light mode toggle functionality is handled in theme-script.js
    });
    
})(jQuery);