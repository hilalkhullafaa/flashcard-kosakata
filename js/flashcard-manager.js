/**
 * Flashcard Manager Module
 * Handles CRUD operations for flashcards
 */

import { Flashcard, VALID_SOURCES } from './flashcard-model.js';
import { storageManager, StorageError } from './storage-manager.js';

/**
 * Validation Error class
 */
export class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

/**
 * Validate flashcard data
 * @param {Object} data - Flashcard data to validate
 * @returns {Array<ValidationError>} - Array of validation errors (empty if valid)
 */
export function validateFlashcardData(data) {
    const errors = [];

    // Validate hiragana (required)
    if (!data.hiragana || data.hiragana.trim() === '') {
        errors.push(new ValidationError('Hiragana/Katakana is required', 'hiragana'));
    }

    // Validate meaning (required)
    if (!data.meaning || data.meaning.trim() === '') {
        errors.push(new ValidationError('Meaning is required', 'meaning'));
    }

    // Validate romaji (required)
    if (!data.romaji || data.romaji.trim() === '') {
        errors.push(new ValidationError('Romaji is required', 'romaji'));
    }

    // Validate source (required and must be valid)
    if (!data.source || !VALID_SOURCES.includes(data.source)) {
        errors.push(new ValidationError('Valid source is required', 'source'));
    }

    // Validate chapters (required and must be non-empty array)
    if (!Array.isArray(data.chapters) || data.chapters.length === 0) {
        errors.push(new ValidationError('At least one chapter is required', 'chapters'));
    }

    return errors;
}

/**
 * Flashcard Manager class
 * Manages flashcard CRUD operations and persistence
 */
export class FlashcardManager {
    constructor() {
        this.flashcards = [];
        this.loadFlashcards();
    }

    /**
     * Load flashcards from storage
     */
    loadFlashcards() {
        try {
            const data = storageManager.loadFlashcards();
            this.flashcards = data.map(item => Flashcard.fromJSON(item));
        } catch (error) {
            console.error('Error loading flashcards:', error);
            this.flashcards = [];
        }
    }

    /**
     * Save flashcards to storage
     * @throws {StorageError} - If storage operation fails
     */
    saveFlashcards() {
        const data = this.flashcards.map(fc => fc.toJSON());
        storageManager.saveFlashcards(data);
    }

    /**
     * Create a new flashcard
     * @param {Object} data - Flashcard data
     * @returns {Object} - Result object with success status and flashcard or errors
     */
    createFlashcard(data) {
        // Validate data
        const errors = validateFlashcardData(data);
        if (errors.length > 0) {
            return {
                success: false,
                errors: errors
            };
        }

        try {
            // Check if there's an existing flashcard with the same Hiragana/Katakana that is already remembered
            const existingRemembered = this.flashcards.find(fc => 
                fc.hiragana === data.hiragana && fc.memoryStatus === true
            );
            
            // Create new flashcard
            const flashcard = new Flashcard(data);
            
            // If an existing flashcard with same Hiragana/Katakana is already remembered,
            // automatically set this new flashcard as remembered too
            if (existingRemembered) {
                flashcard.memoryStatus = true;
            }
            
            // Add to collection
            this.flashcards.push(flashcard);
            
            // Save to storage
            this.saveFlashcards();
            
            return {
                success: true,
                flashcard: flashcard,
                autoRemembered: !!existingRemembered
            };
        } catch (error) {
            console.error('Error creating flashcard:', error);
            return {
                success: false,
                errors: [new Error('Failed to create flashcard. Please try again.')]
            };
        }
    }

    /**
     * Update an existing flashcard
     * @param {string} id - Flashcard ID
     * @param {Object} data - Updated flashcard data
     * @returns {Object} - Result object with success status and flashcard or errors
     */
    updateFlashcard(id, data) {
        // Validate data
        const errors = validateFlashcardData(data);
        if (errors.length > 0) {
            return {
                success: false,
                errors: errors
            };
        }

        try {
            // Find flashcard
            const flashcard = this.flashcards.find(fc => fc.id === id);
            
            if (!flashcard) {
                return {
                    success: false,
                    errors: [new Error('Flashcard not found. It may have been deleted.')]
                };
            }
            
            // Update flashcard
            flashcard.update(data);
            
            // Save to storage
            this.saveFlashcards();
            
            return {
                success: true,
                flashcard: flashcard
            };
        } catch (error) {
            console.error('Error updating flashcard:', error);
            return {
                success: false,
                errors: [new Error('Failed to update flashcard. Please try again.')]
            };
        }
    }

    /**
     * Delete a flashcard
     * @param {string} id - Flashcard ID
     * @returns {Object} - Result object with success status
     */
    deleteFlashcard(id) {
        try {
            // Find index
            const index = this.flashcards.findIndex(fc => fc.id === id);
            
            if (index === -1) {
                return {
                    success: false,
                    errors: [new Error('Flashcard not found. It may have been deleted.')]
                };
            }
            
            // Remove from collection
            this.flashcards.splice(index, 1);
            
            // Save to storage
            this.saveFlashcards();
            
            return {
                success: true
            };
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            return {
                success: false,
                errors: [new Error('Failed to delete flashcard. Please try again.')]
            };
        }
    }

    /**
     * Get flashcard by ID
     * @param {string} id - Flashcard ID
     * @returns {Flashcard|null} - Flashcard object or null if not found
     */
    getFlashcard(id) {
        return this.flashcards.find(fc => fc.id === id) || null;
    }

    /**
     * Get all flashcards
     * @returns {Array<Flashcard>} - Array of all flashcards
     */
    getAllFlashcards() {
        return [...this.flashcards];
    }

    /**
     * Update memory status for a flashcard
     * @param {string} id - Flashcard ID
     * @param {boolean} remembered - Memory status (true = remembered, false = not remembered)
     * @returns {Object} - Result object with success status
     */
    updateMemoryStatus(id, remembered) {
        try {
            const flashcard = this.flashcards.find(fc => fc.id === id);
            
            if (!flashcard) {
                return {
                    success: false,
                    errors: [new Error('Flashcard not found. It may have been deleted.')]
                };
            }
            
            flashcard.memoryStatus = remembered;
            flashcard.updatedAt = Date.now();
            
            // Save to storage
            this.saveFlashcards();
            
            return {
                success: true,
                flashcard: flashcard
            };
        } catch (error) {
            console.error('Error updating memory status:', error);
            return {
                success: false,
                errors: [new Error('Failed to update memory status. Please try again.')]
            };
        }
    }

    /**
     * Update memory status for ALL flashcards with the same Hiragana/Katakana
     * This ensures memory status is synced across all instances of the same vocabulary
     * @param {string} hiragana - Hiragana/Katakana value to match
     * @param {boolean} remembered - Memory status (true = remembered, false = not remembered)
     * @returns {Object} - Result object with success status and count of updated flashcards
     */
    updateMemoryStatusByHiragana(hiragana, remembered) {
        try {
            let updatedCount = 0;
            const now = Date.now();
            
            // Find and update ALL flashcards with matching Hiragana/Katakana
            this.flashcards.forEach(flashcard => {
                if (flashcard.hiragana === hiragana) {
                    flashcard.memoryStatus = remembered;
                    flashcard.updatedAt = now;
                    updatedCount++;
                }
            });
            
            if (updatedCount === 0) {
                return {
                    success: false,
                    errors: [new Error('No flashcards found with that Hiragana/Katakana.')]
                };
            }
            
            // Save to storage
            this.saveFlashcards();
            
            return {
                success: true,
                updatedCount: updatedCount,
                message: `Updated ${updatedCount} flashcard(s) with Hiragana/Katakana: ${hiragana}`
            };
        } catch (error) {
            console.error('Error updating memory status by Hiragana:', error);
            return {
                success: false,
                errors: [new Error('Failed to update memory status. Please try again.')]
            };
        }
    }

    /**
     * Get flashcards by source
     * @param {string} source - Source name
     * @returns {Array<Flashcard>} - Array of flashcards from the specified source
     */
    getFlashcardsBySource(source) {
        return this.flashcards.filter(fc => fc.source === source);
    }

    /**
     * Get flashcards by source and chapter
     * @param {string} source - Source name
     * @param {number} chapter - Chapter number
     * @returns {Array<Flashcard>} - Array of flashcards from the specified source and chapter
     */
    getFlashcardsByChapter(source, chapter) {
        return this.flashcards.filter(fc => 
            fc.source === source && fc.chapters.includes(chapter)
        );
    }

    /**
     * Get unique chapters for a source
     * @param {string} source - Source name
     * @returns {Array<number>} - Sorted array of unique chapter numbers
     */
    getChaptersForSource(source) {
        const chapters = new Set();
        this.flashcards
            .filter(fc => fc.source === source)
            .forEach(fc => {
                fc.chapters.forEach(ch => chapters.add(ch));
            });
        return Array.from(chapters).sort((a, b) => a - b);
    }

    /**
     * Export flashcards to JSON file
     * @returns {Object} - Result object with success status
     */
    exportFlashcards() {
        try {
            storageManager.exportFlashcards();
            return {
                success: true,
                message: 'Flashcards exported successfully!'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to export flashcards'
            };
        }
    }

    /**
     * Import flashcards from JSON file
     * @param {File} file - JSON file containing flashcards
     * @param {boolean} merge - If true, merge with existing data. If false, replace existing data.
     * @returns {Promise<Object>} - Result object with success status and statistics
     */
    async importFlashcards(file, merge = false) {
        try {
            const result = await storageManager.importFlashcards(file, merge);
            
            // Reload flashcards from storage
            this.loadFlashcards();
            
            return {
                success: true,
                ...result,
                message: merge 
                    ? `Successfully imported ${result.added} flashcards (${result.skipped} duplicates skipped)`
                    : `Successfully imported ${result.added} flashcards`
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to import flashcards'
            };
        }
    }
}

// Export singleton instance
export const flashcardManager = new FlashcardManager();
