/**
 * Search Engine Module
 * Handles multi-field search across flashcards
 */

import { flashcardManager } from './flashcard-manager.js';

/**
 * Search Engine class
 * Manages flashcard search logic
 */
export class SearchEngine {
    /**
     * Search flashcards across multiple fields
     * @param {string} query - Search query
     * @returns {Array<Flashcard>} - Matching flashcards
     */
    search(query) {
        // Return all flashcards if query is empty
        if (!query || query.trim() === '') {
            return flashcardManager.getAllFlashcards();
        }

        const allFlashcards = flashcardManager.getAllFlashcards();
        const normalizedQuery = query.toLowerCase().trim();

        return allFlashcards.filter(flashcard => 
            this.matches(flashcard, normalizedQuery)
        );
    }

    /**
     * Check if a flashcard matches the query
     * Searches across Kanji, Hiragana/Katakana, Meaning, and Romaji fields
     * @param {Flashcard} flashcard - Flashcard to check
     * @param {string} query - Search query (should be normalized/lowercase)
     * @returns {boolean} - Whether flashcard matches
     */
    matches(flashcard, query) {
        // Search in Kanji field
        if (flashcard.kanji && flashcard.kanji.toLowerCase().includes(query)) {
            return true;
        }

        // Search in Hiragana/Katakana field
        if (flashcard.hiragana && flashcard.hiragana.toLowerCase().includes(query)) {
            return true;
        }

        // Search in Meaning field
        if (flashcard.meaning && flashcard.meaning.toLowerCase().includes(query)) {
            return true;
        }

        // Search in Romaji field
        if (flashcard.romaji && flashcard.romaji.toLowerCase().includes(query)) {
            return true;
        }

        return false;
    }

    /**
     * Search with filter by source
     * @param {string} query - Search query
     * @param {string} source - Source to filter by
     * @returns {Array<Flashcard>} - Matching flashcards from the specified source
     */
    searchBySource(query, source) {
        const results = this.search(query);
        return results.filter(fc => fc.source === source);
    }

    /**
     * Search with filter by chapter
     * @param {string} query - Search query
     * @param {string} source - Source to filter by
     * @param {number} chapter - Chapter to filter by
     * @returns {Array<Flashcard>} - Matching flashcards from the specified chapter
     */
    searchByChapter(query, source, chapter) {
        const results = this.search(query);
        return results.filter(fc => 
            fc.source === source && fc.chapters.includes(chapter)
        );
    }
}

// Export singleton instance
export const searchEngine = new SearchEngine();
