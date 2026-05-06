/**
 * Shuffle Engine Module
 * Handles randomization of flashcard order
 */

/**
 * Shuffle Engine class
 * Manages flashcard shuffling logic
 */
export class ShuffleEngine {
    constructor() {
        this.shuffled = false;
    }

    /**
     * Shuffle an array of flashcards using Fisher-Yates algorithm
     * @param {Array<Flashcard>} flashcards - Flashcards to shuffle
     * @returns {Array<Flashcard>} - Shuffled flashcards (new array)
     */
    shuffle(flashcards) {
        // Create a copy to avoid modifying original array
        const shuffled = [...flashcards];
        
        // Fisher-Yates shuffle algorithm
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        this.shuffled = true;
        return shuffled;
    }

    /**
     * Get current shuffle state
     * @returns {boolean} - Whether shuffle is active
     */
    isShuffled() {
        return this.shuffled;
    }

    /**
     * Reset shuffle state
     */
    resetShuffle() {
        this.shuffled = false;
    }
}

// Export singleton instance
export const shuffleEngine = new ShuffleEngine();
