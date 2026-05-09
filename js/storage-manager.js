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

    /**
     * Export flashcards to JSON file
     * Downloads flashcards as a JSON file
     * @returns {boolean} - Success status
     */
    exportFlashcards() {
        try {
            const flashcards = this.loadFlashcards();
            
            if (flashcards.length === 0) {
                throw new StorageError(
                    'No flashcards to export. Please add some flashcards first.',
                    'exportFlashcards'
                );
            }

            // Create export data with metadata
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                totalFlashcards: flashcards.length,
                flashcards: flashcards
            };

            // Convert to JSON string with pretty formatting
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Create blob and download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `flashcards-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            if (error instanceof StorageError) {
                throw error;
            }
            throw new StorageError(
                'Failed to export flashcards. Please try again.',
                'exportFlashcards'
            );
        }
    }

    /**
     * Import flashcards from JSON file
     * @param {File} file - JSON file containing flashcards
     * @param {boolean} merge - If true, merge with existing data. If false, replace existing data.
     * @returns {Promise<Object>} - Import result with statistics
     */
    async importFlashcards(file, merge = false) {
        try {
            // Validate file type
            if (!file.name.endsWith('.json')) {
                throw new StorageError(
                    'Invalid file type. Please select a JSON file.',
                    'importFlashcards'
                );
            }

            // Read file content
            const fileContent = await this.readFileAsText(file);
            
            // Parse JSON
            let importData;
            try {
                importData = JSON.parse(fileContent);
            } catch (error) {
                throw new StorageError(
                    'Invalid JSON file. Please check the file format.',
                    'importFlashcards'
                );
            }

            // Validate import data structure
            const flashcards = importData.flashcards || importData;
            
            if (!Array.isArray(flashcards)) {
                throw new StorageError(
                    'Invalid flashcard data format. Expected an array of flashcards.',
                    'importFlashcards'
                );
            }

            if (flashcards.length === 0) {
                throw new StorageError(
                    'No flashcards found in the file.',
                    'importFlashcards'
                );
            }

            // Validate flashcard structure
            const isValid = flashcards.every(fc => 
                fc.hiragana && fc.meaning && fc.romaji && fc.source && Array.isArray(fc.chapters)
            );

            if (!isValid) {
                throw new StorageError(
                    'Invalid flashcard structure. Some required fields are missing.',
                    'importFlashcards'
                );
            }

            // Get existing flashcards if merging
            let finalFlashcards = flashcards;
            let addedCount = flashcards.length;
            let skippedCount = 0;

            if (merge) {
                const existingFlashcards = this.loadFlashcards();
                const existingIds = new Set(existingFlashcards.map(fc => fc.id));
                
                // Filter out duplicates (by ID)
                const newFlashcards = flashcards.filter(fc => {
                    if (existingIds.has(fc.id)) {
                        skippedCount++;
                        return false;
                    }
                    return true;
                });

                addedCount = newFlashcards.length;
                finalFlashcards = [...existingFlashcards, ...newFlashcards];
            }

            // Save to localStorage
            this.saveFlashcards(finalFlashcards);

            return {
                success: true,
                total: flashcards.length,
                added: addedCount,
                skipped: skippedCount,
                mode: merge ? 'merge' : 'replace'
            };

        } catch (error) {
            if (error instanceof StorageError) {
                throw error;
            }
            throw new StorageError(
                'Failed to import flashcards. Please check the file and try again.',
                'importFlashcards'
            );
        }
    }

    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} - File content as text
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
}

// Export singleton instance
export const storageManager = new StorageManager();
