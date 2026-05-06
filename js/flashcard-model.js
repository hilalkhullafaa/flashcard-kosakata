/**
 * Flashcard Data Model Module
 * Defines the Flashcard class and related data structures
 */

// Valid source constants
export const VALID_SOURCES = [
    'IRODORI Beginner Level (A1)',
    'IRODORI Basic Level 1 (A1)',
    'IRODORI Basic Level 1 (A2)'
];

/**
 * Flashcard class
 * Represents a single Japanese vocabulary flashcard
 */
export class Flashcard {
    /**
     * Create a new Flashcard
     * @param {Object} data - Flashcard data
     * @param {string} data.id - Unique identifier (optional, will be generated if not provided)
     * @param {string} data.kanji - Kanji characters (optional, can be empty for Hiragana-only words)
     * @param {string} data.hiragana - Hiragana/Katakana reading (required)
     * @param {string} data.meaning - English/Indonesian meaning (required)
     * @param {string} data.romaji - Romanized pronunciation (required)
     * @param {string} data.source - Source textbook (required)
     * @param {Array<number>} data.chapters - Array of chapter numbers (required)
     * @param {boolean} data.memoryStatus - Memory status (optional, defaults to false)
     * @param {number} data.createdAt - Creation timestamp (optional, will be generated if not provided)
     * @param {number} data.updatedAt - Last update timestamp (optional, will be generated if not provided)
     */
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.kanji = data.kanji || '';
        this.hiragana = data.hiragana || '';
        this.meaning = data.meaning || '';
        this.romaji = data.romaji || '';
        this.source = data.source || '';
        this.chapters = Array.isArray(data.chapters) ? data.chapters : [];
        this.memoryStatus = data.memoryStatus || false;
        this.createdAt = data.createdAt || Date.now();
        this.updatedAt = data.updatedAt || Date.now();
    }

    /**
     * Generate a unique ID for the flashcard
     * Uses timestamp + random string for uniqueness
     * @returns {string} - Unique identifier
     */
    generateId() {
        return `fc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Update the flashcard with new data
     * @param {Object} data - Updated flashcard data
     * @returns {Flashcard} - Updated flashcard instance
     */
    update(data) {
        if (data.kanji !== undefined) this.kanji = data.kanji;
        if (data.hiragana !== undefined) this.hiragana = data.hiragana;
        if (data.meaning !== undefined) this.meaning = data.meaning;
        if (data.romaji !== undefined) this.romaji = data.romaji;
        if (data.source !== undefined) this.source = data.source;
        if (data.chapters !== undefined) this.chapters = data.chapters;
        if (data.memoryStatus !== undefined) this.memoryStatus = data.memoryStatus;
        
        this.updatedAt = Date.now();
        return this;
    }

    /**
     * Convert flashcard to plain object for serialization
     * @returns {Object} - Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            kanji: this.kanji,
            hiragana: this.hiragana,
            meaning: this.meaning,
            romaji: this.romaji,
            source: this.source,
            chapters: this.chapters,
            memoryStatus: this.memoryStatus,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create a Flashcard instance from a plain object
     * @param {Object} obj - Plain object with flashcard data
     * @returns {Flashcard} - Flashcard instance
     */
    static fromJSON(obj) {
        return new Flashcard(obj);
    }

    /**
     * Check if the flashcard has Kanji
     * @returns {boolean} - True if Kanji field is not empty
     */
    hasKanji() {
        return this.kanji && this.kanji.trim() !== '';
    }

    /**
     * Check if the flashcard is Hiragana-only
     * @returns {boolean} - True if Kanji field is empty
     */
    isHiraganaOnly() {
        return !this.hasKanji();
    }

    /**
     * Get display text for chapters
     * @returns {string} - Comma-separated chapter numbers
     */
    getChaptersDisplay() {
        return this.chapters.sort((a, b) => a - b).join(', ');
    }
}

/**
 * FlashcardData schema for input validation
 * This is not a class, just a reference schema
 */
export const FlashcardDataSchema = {
    kanji: 'string (optional)',
    hiragana: 'string (required)',
    meaning: 'string (required)',
    romaji: 'string (required)',
    source: 'string (required, must be one of VALID_SOURCES)',
    chapters: 'array of numbers (required, must not be empty)'
};

/**
 * View Context types
 */
export const ViewContextType = {
    CHAPTER: 'chapter',
    SOURCE: 'source',
    ALL: 'all'
};

/**
 * View Context class
 * Defines the scope for displaying flashcards
 */
export class ViewContext {
    /**
     * Create a new ViewContext
     * @param {string} type - Context type ('chapter', 'source', or 'all')
     * @param {string} source - Source name (optional, for chapter and source contexts)
     * @param {number} chapter - Chapter number (optional, for chapter context only)
     */
    constructor(type, source = null, chapter = null) {
        this.type = type;
        this.source = source;
        this.chapter = chapter;
    }

    /**
     * Check if this is a chapter context
     * @returns {boolean}
     */
    isChapterContext() {
        return this.type === ViewContextType.CHAPTER;
    }

    /**
     * Check if this is a source context
     * @returns {boolean}
     */
    isSourceContext() {
        return this.type === ViewContextType.SOURCE;
    }

    /**
     * Check if this is an all-sources context
     * @returns {boolean}
     */
    isAllSourcesContext() {
        return this.type === ViewContextType.ALL;
    }
}

/**
 * Progress Stats class
 * Represents vocabulary learning progress
 */
export class ProgressStats {
    /**
     * Create a new ProgressStats
     * @param {number} total - Total unique vocabulary count
     * @param {number} remembered - Remembered unique vocabulary count
     */
    constructor(total = 0, remembered = 0) {
        this.total = total;
        this.remembered = remembered;
        this.percentage = total > 0 ? Math.round((remembered / total) * 100) : 0;
    }

    /**
     * Get display text for progress
     * @returns {string} - Progress display text
     */
    getDisplayText() {
        return `${this.remembered} / ${this.total} (${this.percentage}%)`;
    }
}
