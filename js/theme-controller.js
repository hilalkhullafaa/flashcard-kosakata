/**
 * Theme Controller Module
 * Handles light/dark mode theme switching
 */

import { storageManager } from './storage-manager.js';

/**
 * Theme types
 */
export const Theme = {
    LIGHT: 'light',
    DARK: 'dark'
};

/**
 * Theme Controller class
 * Manages theme switching and persistence
 */
export class ThemeController {
    constructor() {
        this.currentTheme = Theme.LIGHT;
        this.loadThemePreference();
    }

    /**
     * Toggle between light and dark mode
     */
    toggleTheme() {
        const newTheme = this.currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
        this.setTheme(newTheme);
    }

    /**
     * Get current theme
     * @returns {string} - 'light' or 'dark'
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set theme
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
        if (theme !== Theme.LIGHT && theme !== Theme.DARK) {
            console.warn(`Invalid theme: ${theme}. Using light theme.`);
            theme = Theme.LIGHT;
        }

        this.currentTheme = theme;
        this.applyTheme();
        this.saveThemePreference();
    }

    /**
     * Apply theme to document
     */
    applyTheme() {
        const html = document.documentElement;
        
        if (this.currentTheme === Theme.DARK) {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
    }

    /**
     * Load theme preference from storage
     */
    loadThemePreference() {
        try {
            const savedTheme = storageManager.loadTheme();
            this.currentTheme = savedTheme;
            this.applyTheme();
        } catch (error) {
            console.error('Error loading theme preference:', error);
            this.currentTheme = Theme.LIGHT;
            this.applyTheme();
        }
    }

    /**
     * Save theme preference to storage
     */
    saveThemePreference() {
        try {
            storageManager.saveTheme(this.currentTheme);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    }

    /**
     * Initialize theme toggle button
     * @param {string} buttonId - ID of the theme toggle button
     */
    initializeToggleButton(buttonId = 'theme-toggle') {
        const button = document.getElementById(buttonId);
        
        if (button) {
            button.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
}

// Export singleton instance
export const themeController = new ThemeController();
