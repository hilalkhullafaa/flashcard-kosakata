/**
 * Storage Manager Module
 * Handles all localStorage operations for the Japanese Flashcard Application
 */

// Storage keys constants
export const STORAGE_KEYS = {
    FLASHCARDS: 'japanese-flashcards',
    THEME: 'japanese-flashcards-theme'
};

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
    constructor(message, operation) {
        super(message);
        this.name = 'StorageError';
        this.operation = operation;
    }
}

/**
 * Storage Manager class
 * Provides abstraction layer for localStorage operations
 */
export class StorageManager {
    /**
     * Save flashcards to localStorage
     * @param {Array} flashcards - Array of flashcard objects
     * @returns {boolean} - Success status
     * @throws {StorageError} - If storage operation fails
     */
    saveFlashcards(flashcards) {
        try {
            const serialized = JSON.stringify(flashcards);
            localStorage.setItem(STORAGE_KEYS.FLASHCARDS, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                throw new StorageError(
                    'Storage limit reached. Please delete some flashcards to free up space.',
                    'saveFlashcards'
                );
            }
            throw new StorageError(
                'Failed to save flashcards. Please try again.',
                'saveFlashcards'
            );
        }
    }

    /**
     * Load flashcards from localStorage
     * @returns {Array} - Array of flashcard objects (empty array if none exist)
     */
    loadFlashcards() {
        try {
            const serialized = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
            
            if (!serialized) {
                return [];
            }
            
            const flashcards = JSON.parse(serialized);
            
            // Validate that the loaded data is an array
            if (!Array.isArray(flashcards)) {
                console.warn('Corrupted flashcard data detected. Returning empty array.');
                return [];
            }
            
            return flashcards;
        } catch (error) {
            console.error('Error loading flashcards:', error);
            console.warn('Corrupted flashcard data detected. Returning empty array.');
            return [];
        }
    }

    /**
     * Save theme preference to localStorage
     * @param {string} theme - Theme preference ('light' or 'dark')
     * @returns {boolean} - Success status
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
            return true;
        } catch (error) {
            console.error('Error saving theme preference:', error);
            return false;
        }
    }

    /**
     * Load theme preference from localStorage
     * @returns {string} - Theme preference ('light' or 'dark', defaults to 'light')
     */
    loadTheme() {
        try {
            const theme = localStorage.getItem(STORAGE_KEYS.THEME);
            return theme || 'light';
        } catch (error) {
            console.error('Error loading theme preference:', error);
            return 'light';
        }
    }

    /**
     * Clear all data from localStorage
     * @returns {boolean} - Success status
     */
    clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
            localStorage.removeItem(STORAGE_KEYS.THEME);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} - True if localStorage is available
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Export singleton instance
export const storageManager = new StorageManager();
