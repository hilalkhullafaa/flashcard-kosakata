/**
 * Progress Tracker Module
 * Handles vocabulary learning progress tracking with deduplication
 */

import { flashcardManager } from './flashcard-manager.js';
import { ProgressStats, ViewContextType } from './flashcard-model.js';

/**
 * Progress Tracker class
 * Calculates and tracks vocabulary learning progress
 */
export class ProgressTracker {
    /**
     * Calculate progress for Hiragana/Katakana vocabulary
     * Uses Hiragana/Katakana field as unique identifier
     * @param {Object} context - View context {type, source, chapter}
     * @returns {ProgressStats} - Progress statistics
     */
    getHiraganaProgress(context) {
        const flashcards = this.getFlashcardsForContext(context);
        return this.calculateProgress(flashcards, 'hiragana');
    }

    /**
     * Calculate progress for Kanji vocabulary
     * Uses Kanji field as unique identifier (excludes empty Kanji fields)
     * @param {Object} context - View context {type, source, chapter}
     * @returns {ProgressStats} - Progress statistics
     */
    getKanjiProgress(context) {
        const flashcards = this.getFlashcardsForContext(context);
        return this.calculateProgress(flashcards, 'kanji');
    }

    /**
     * Get flashcards for a specific context
     * @param {Object} context - View context {type, source, chapter}
     * @returns {Array<Flashcard>} - Flashcards for the context
     */
    getFlashcardsForContext(context) {
        if (!context) {
            return flashcardManager.getAllFlashcards();
        }

        switch (context.type) {
            case ViewContextType.CHAPTER:
                // Per-chapter context
                return flashcardManager.getFlashcardsByChapter(context.source, context.chapter);
            
            case ViewContextType.SOURCE:
                // Per-source context
                return flashcardManager.getFlashcardsBySource(context.source);
            
            case ViewContextType.ALL:
            default:
                // All-sources context
                return flashcardManager.getAllFlashcards();
        }
    }

    /**
     * Calculate unique vocabulary progress
     * @param {Array<Flashcard>} flashcards - Flashcards to analyze
     * @param {string} identifierField - Field to use as identifier ('hiragana' or 'kanji')
     * @returns {Object} - Progress statistics with remembered list
     */
    calculateProgress(flashcards, identifierField) {
        const uniqueVocab = new Set();
        const rememberedVocab = new Set();
        const vocabChaptersMap = new Map(); // Map to track chapters for each vocabulary
        const vocabSourcesMap = new Map(); // Map to track sources for each vocabulary
        const vocabDataMap = new Map(); // Map to store flashcard data (meaning, kanji, hiragana)

        // First pass: collect all data for each vocabulary
        for (const flashcard of flashcards) {
            const identifier = flashcard[identifierField];

            // Skip empty identifiers (e.g., empty Kanji field for Hiragana-only words)
            if (!identifier || identifier.trim() === '') {
                continue;
            }

            uniqueVocab.add(identifier);

            // Track chapters for this vocabulary
            if (!vocabChaptersMap.has(identifier)) {
                vocabChaptersMap.set(identifier, new Set());
            }
            // Add all chapters from this flashcard
            flashcard.chapters.forEach(ch => vocabChaptersMap.get(identifier).add(ch));

            // Track sources for this vocabulary
            if (!vocabSourcesMap.has(identifier)) {
                vocabSourcesMap.set(identifier, new Set());
            }
            vocabSourcesMap.get(identifier).add(flashcard.source);

            // Store flashcard data (use first occurrence)
            if (!vocabDataMap.has(identifier)) {
                vocabDataMap.set(identifier, {
                    meaning: flashcard.meaning,
                    kanji: flashcard.kanji,
                    hiragana: flashcard.hiragana
                });
            }

            // Track if this vocabulary is remembered
            if (flashcard.memoryStatus === true) {
                rememberedVocab.add(identifier);
            }
        }

        // Second pass: build rememberedList with complete data
        const rememberedList = [];
        for (const identifier of rememberedVocab) {
            const vocabData = vocabDataMap.get(identifier);
            const allChapters = Array.from(vocabChaptersMap.get(identifier)).sort((a, b) => a - b);
            const allSources = Array.from(vocabSourcesMap.get(identifier));
            
            rememberedList.push({
                identifier: identifier,
                meaning: vocabData.meaning,
                kanji: vocabData.kanji,
                hiragana: vocabData.hiragana,
                chapters: allChapters, // Include all chapters
                sources: allSources // Include all sources
            });
        }

        const stats = new ProgressStats(uniqueVocab.size, rememberedVocab.size);
        stats.rememberedList = rememberedList;
        return stats;
    }

    /**
     * Get unique vocabulary identifiers
     * @param {Array<Flashcard>} flashcards - Flashcards to analyze
     * @param {string} fieldName - Field to use as identifier ('hiragana' or 'kanji')
     * @returns {Set<string>} - Set of unique identifiers
     */
    getUniqueIdentifiers(flashcards, fieldName) {
        const identifiers = new Set();

        for (const flashcard of flashcards) {
            const identifier = flashcard[fieldName];

            // Skip empty identifiers
            if (identifier && identifier.trim() !== '') {
                identifiers.add(identifier);
            }
        }

        return identifiers;
    }

    /**
     * Get progress for all chapters in a source
     * @param {string} source - Source name
     * @returns {Object} - Progress by chapter {chapter: {hiragana: ProgressStats, kanji: ProgressStats}}
     */
    getProgressByChapter(source) {
        const chapters = flashcardManager.getChaptersForSource(source);
        const progressByChapter = {};

        for (const chapter of chapters) {
            const context = {
                type: ViewContextType.CHAPTER,
                source: source,
                chapter: chapter
            };

            progressByChapter[chapter] = {
                hiragana: this.getHiraganaProgress(context),
                kanji: this.getKanjiProgress(context)
            };
        }

        return progressByChapter;
    }

    /**
     * Get overall progress across all sources
     * @returns {Object} - Overall progress {hiragana: ProgressStats, kanji: ProgressStats}
     */
    getOverallProgress() {
        const context = {
            type: ViewContextType.ALL
        };

        return {
            hiragana: this.getHiraganaProgress(context),
            kanji: this.getKanjiProgress(context)
        };
    }
}

// Export singleton instance
export const progressTracker = new ProgressTracker();
