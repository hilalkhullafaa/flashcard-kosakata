/**
 * Filter Engine Module
 * Handles filtering flashcards by script type
 */

/**
 * Filter types
 */
export const FilterType = {
    ALL: 'all',
    HIRAGANA_ONLY: 'hiragana',
    KANJI: 'kanji'
};

/**
 * Filter Engine class
 * Manages flashcard filtering logic
 */
export class FilterEngine {
    constructor() {
        this.currentFilter = FilterType.ALL;
    }

    /**
     * Filter flashcards by script type
     * @param {Array<Flashcard>} flashcards - Flashcards to filter
     * @param {string} scriptType - Filter type ('all', 'hiragana', or 'kanji')
     * @returns {Array<Flashcard>} - Filtered flashcards
     */
    filterByScriptType(flashcards, scriptType = this.currentFilter) {
        switch (scriptType) {
            case FilterType.HIRAGANA_ONLY:
                // Return only flashcards with empty Kanji field
                return flashcards.filter(fc => !fc.kanji || fc.kanji.trim() === '');
            
            case FilterType.KANJI:
                // Return only flashcards with non-empty Kanji field
                return flashcards.filter(fc => fc.kanji && fc.kanji.trim() !== '');
            
            case FilterType.ALL:
            default:
                // Return all flashcards
                return flashcards;
        }
    }

    /**
     * Get current filter state
     * @returns {string} - Current filter type
     */
    getCurrentFilter() {
        return this.currentFilter;
    }

    /**
     * Set filter state
     * @param {string} scriptType - Filter type to set
     */
    setFilter(scriptType) {
        if (Object.values(FilterType).includes(scriptType)) {
            this.currentFilter = scriptType;
        }
    }

    /**
     * Clear filter (set to ALL)
     */
    clearFilter() {
        this.currentFilter = FilterType.ALL;
    }

    /**
     * Get filter display name
     * @param {string} filterType - Filter type
     * @returns {string} - Display name
     */
    getFilterDisplayName(filterType) {
        switch (filterType) {
            case FilterType.HIRAGANA_ONLY:
                return 'Hirakana Only';
            case FilterType.KANJI:
                return 'Kanji Only';
            case FilterType.ALL:
            default:
                return 'All';
        }
    }
}

// Export singleton instance
export const filterEngine = new FilterEngine();
