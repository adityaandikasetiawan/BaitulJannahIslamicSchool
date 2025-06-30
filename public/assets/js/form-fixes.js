/**
 * Form Fixes JavaScript
 * This script adds missing attributes and fixes form-related issues
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix for missing autocomplete attributes
    const formElements = document.querySelectorAll('input, textarea, select');
    
    formElements.forEach(function(element) {
        // Add autocomplete attribute if missing
        if (!element.hasAttribute('autocomplete')) {
            // Set appropriate autocomplete value based on input type
            if (element.type === 'password') {
                element.setAttribute('autocomplete', 'new-password');
            } else if (element.type === 'email') {
                element.setAttribute('autocomplete', 'email');
            } else if (element.type === 'tel') {
                element.setAttribute('autocomplete', 'tel');
            } else if (element.type === 'search') {
                element.setAttribute('autocomplete', 'off');
            } else if (element.name.toLowerCase().includes('name')) {
                element.setAttribute('autocomplete', 'name');
            } else {
                element.setAttribute('autocomplete', 'off');
            }
        }
    });
    
    // Fix for inline styles - add classes instead
    const elementsWithInlineStyles = document.querySelectorAll('[style]');
    
    elementsWithInlineStyles.forEach(function(element) {
        const style = element.getAttribute('style');
        
        // Extract common inline styles and replace with classes
        if (style.includes('display: flex')) {
            element.classList.add('d-flex');
        }
        
        if (style.includes('justify-content: center')) {
            element.classList.add('justify-content-center');
        }
        
        if (style.includes('align-items: center')) {
            element.classList.add('flex-center');
        }
        
        if (style.includes('border-radius')) {
            element.classList.add('rounded-custom');
        }
        
        if (style.includes('box-shadow')) {
            element.classList.add('shadow-custom');
        }
        
        if (style.includes('transition')) {
            element.classList.add('transition-all');
        }
    });
});