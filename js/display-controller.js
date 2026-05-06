/**
 * Display Controller Module
 * Handles flashcard rendering, deduplication, and flip interactions
 */

import { flashcardManager } from './flashcard-manager.js';
import { ViewContext, ViewContextType } from './flashcard-model.js';

/**
 * Display Controller class
 * Manages flashcard display logic and rendering
 */
export class DisplayController {
    constructor() {
        this.currentFlashcards = [];
        this.originalFlashcards = []; // Store original flashcards before filtering
        this.currentIndex = 0;
        this.currentContext = null;
    }

    /**
     * Get flashcards for a specific chapter within a source
     * No deduplication - shows flashcard for each chapter it appears in
     * @param {string} source - Source name
     * @param {number} chapter - Chapter number
     * @returns {Array<Flashcard>} - Flashcards for that chapter
     */
    getFlashcardsForChapter(source, chapter) {
        return flashcardManager.getFlashcardsByChapter(source, chapter);
    }

    /**
     * Get flashcards for all chapters across all sources (deduplicated)
     * Deduplicates by Hiragana/Katakana field value
     * Merges chapter numbers for duplicate flashcards
     * @returns {Array<Flashcard>} - Deduplicated flashcards
     */
    getFlashcardsForAllSources() {
        const allFlashcards = flashcardManager.getAllFlashcards();
        return this.deduplicateFlashcards(allFlashcards);
    }

    /**
     * Get flashcards for a specific source (deduplicated)
     * Deduplicates by Hiragana/Katakana field value within the source
     * Merges chapter numbers for duplicate flashcards
     * @param {string} source - Source name
     * @returns {Array<Flashcard>} - Deduplicated flashcards for that source
     */
    getFlashcardsForSource(source) {
        const sourceFlashcards = flashcardManager.getFlashcardsBySource(source);
        return this.deduplicateFlashcards(sourceFlashcards);
    }

    /**
     * Deduplicate flashcards by Hiragana/Katakana field
     * Merges chapters and sources from duplicate flashcards
     * @param {Array<Flashcard>} flashcards - Flashcards to deduplicate
     * @returns {Array<Flashcard>} - Deduplicated flashcards
     */
    deduplicateFlashcards(flashcards) {
        const uniqueMap = new Map();

        for (const flashcard of flashcards) {
            const key = flashcard.hiragana; // Use Hiragana/Katakana as unique identifier

            if (!uniqueMap.has(key)) {
                // Create a copy to avoid modifying original
                const copy = { ...flashcard.toJSON() };
                // Store sources as array for deduplication
                copy.sources = [flashcard.source];
                uniqueMap.set(key, copy);
            } else {
                // Merge chapters and sources from duplicate flashcards
                const existing = uniqueMap.get(key);
                const mergedChapters = [...new Set([...existing.chapters, ...flashcard.chapters])];
                existing.chapters = mergedChapters.sort((a, b) => a - b);
                
                // Merge sources (deduplicate)
                if (!existing.sources.includes(flashcard.source)) {
                    existing.sources.push(flashcard.source);
                }
                
                // Update memory status if any instance is remembered
                if (flashcard.memoryStatus) {
                    existing.memoryStatus = true;
                }
            }
        }

        return Array.from(uniqueMap.values());
    }

    /**
     * Render flashcard front side
     * @param {Object} flashcard - Flashcard to render
     * @param {ViewContext} context - View context
     * @returns {HTMLElement} - Rendered front side element
     */
    renderFront(flashcard, context) {
        const frontDiv = document.createElement('div');
        frontDiv.className = 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 border-blue-500 dark:border-blue-400 p-6 md:p-8 relative';

        // Checklist indicator for remembered flashcards
        if (flashcard.memoryStatus) {
            const checklistBadge = document.createElement('div');
            checklistBadge.className = 'absolute top-4 right-4 bg-yellow-500 dark:bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg';
            checklistBadge.textContent = '✓';
            frontDiv.appendChild(checklistBadge);
        }

        // Kanji display (if exists)
        if (flashcard.kanji && flashcard.kanji.trim() !== '') {
            const kanjiDiv = document.createElement('div');
            kanjiDiv.className = 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 break-words leading-tight';
            kanjiDiv.style.maxHeight = '6rem'; // Limit to ~2 lines
            kanjiDiv.style.overflow = 'hidden';
            kanjiDiv.style.display = '-webkit-box';
            kanjiDiv.style.webkitLineClamp = '2';
            kanjiDiv.style.webkitBoxOrient = 'vertical';
            kanjiDiv.textContent = flashcard.kanji;
            frontDiv.appendChild(kanjiDiv);
        }

        // Hiragana/Katakana display
        const hiraganaDiv = document.createElement('div');
        hiraganaDiv.className = flashcard.kanji 
            ? 'text-2xl sm:text-3xl md:text-4xl font-medium text-gray-700 dark:text-white break-words leading-tight' 
            : 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 dark:text-white break-words leading-tight';
        hiraganaDiv.style.maxHeight = flashcard.kanji ? '4rem' : '6rem'; // Limit to ~2 lines
        hiraganaDiv.style.overflow = 'hidden';
        hiraganaDiv.style.display = '-webkit-box';
        hiraganaDiv.style.webkitLineClamp = '2';
        hiraganaDiv.style.webkitBoxOrient = 'vertical';
        hiraganaDiv.textContent = flashcard.hiragana;
        frontDiv.appendChild(hiraganaDiv);

        // Tap to flip hint
        const hintDiv = document.createElement('div');
        hintDiv.className = 'mt-6 md:mt-8 text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium';
        hintDiv.textContent = '👆 Klik untuk melihat arti';
        frontDiv.appendChild(hintDiv);

        return frontDiv;
    }

    /**
     * Render flashcard back side
     * @param {Object} flashcard - Flashcard to render
     * @param {ViewContext} context - View context
     * @param {Function} onMemoryStatusChange - Callback when memory status changes
     * @returns {HTMLElement} - Rendered back side element
     */
    renderBack(flashcard, context, onMemoryStatusChange = null) {
        const backDiv = document.createElement('div');
        backDiv.className = 'bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-2xl shadow-2xl flex flex-col justify-between text-white p-6 md:p-8';

        // Top content
        const topContent = document.createElement('div');
        topContent.className = 'flex-1 flex flex-col justify-center';

        // Meaning
        const meaningDiv = document.createElement('div');
        meaningDiv.className = 'text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 break-words leading-snug';
        meaningDiv.textContent = flashcard.meaning;
        topContent.appendChild(meaningDiv);

        // Romaji
        const romajiDiv = document.createElement('div');
        romajiDiv.className = 'text-base sm:text-lg md:text-xl mb-4 md:mb-8 opacity-90 font-medium break-words leading-snug';
        romajiDiv.textContent = flashcard.romaji;
        topContent.appendChild(romajiDiv);

        // Info container
        const infoContainer = document.createElement('div');
        infoContainer.className = 'space-y-2 text-sm sm:text-base';

        // Source(s)
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'opacity-80';
        
        // Check if flashcard has multiple sources (from deduplication)
        if (flashcard.sources && Array.isArray(flashcard.sources) && flashcard.sources.length > 1) {
            // Multiple sources - show all
            sourceDiv.textContent = `📚 ${flashcard.sources.join(' | ')}`;
        } else if (flashcard.sources && Array.isArray(flashcard.sources)) {
            // Single source from array
            sourceDiv.textContent = `📚 ${flashcard.sources[0]}`;
        } else {
            // Regular source field
            sourceDiv.textContent = `📚 ${flashcard.source}`;
        }
        infoContainer.appendChild(sourceDiv);

        // Chapter(s)
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'opacity-80';
        
        // Context-aware chapter display
        if (context && context.isChapterContext()) {
            chapterDiv.textContent = `📖 Bab ${context.chapter}`;
        } else {
            const chapters = Array.isArray(flashcard.chapters) 
                ? flashcard.chapters.sort((a, b) => a - b).join(', ')
                : flashcard.chapters;
            chapterDiv.textContent = `📖 Bab ${chapters}`;
        }
        infoContainer.appendChild(chapterDiv);

        topContent.appendChild(infoContainer);
        backDiv.appendChild(topContent);

        // Memory status buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex gap-2 sm:gap-3 mt-4';
        buttonsContainer.onclick = (e) => e.stopPropagation(); // Prevent flip when clicking buttons

        const rememberedButton = document.createElement('button');
        rememberedButton.className = (flashcard.memoryStatus 
            ? 'memory-button flex-1 bg-yellow-500 dark:bg-yellow-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base shadow-lg'
            : 'memory-button flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base border-2 border-white border-opacity-50') + ' transition-all duration-300';
        rememberedButton.textContent = flashcard.memoryStatus ? '✅ Sudah Ingat' : '✓ Sudah Ingat';
        rememberedButton.onclick = (e) => {
            e.stopPropagation();
            
            // Change button color/background with animation
            rememberedButton.style.transition = 'all 0.2s ease';
            rememberedButton.style.transform = 'scale(1.1)';
            
            // Check if dark mode is active
            const isDarkMode = document.documentElement.classList.contains('dark');
            rememberedButton.style.backgroundColor = isDarkMode ? '#CA8A04' : '#EAB308'; // yellow-600 for dark, yellow-500 for light
            rememberedButton.style.boxShadow = isDarkMode 
                ? '0 10px 25px rgba(202, 138, 4, 0.5)' 
                : '0 10px 25px rgba(234, 179, 8, 0.5)';
            
            // Update memory status
            this.toggleMemoryStatus(flashcard, true);
            
            // Wait for animation then trigger callback
            setTimeout(() => {
                rememberedButton.style.transform = 'scale(1)';
                if (onMemoryStatusChange) {
                    onMemoryStatusChange('remembered');
                }
            }, 200);
        };

        const notRememberedButton = document.createElement('button');
        notRememberedButton.className = (!flashcard.memoryStatus 
            ? 'memory-button flex-1 bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base shadow-lg'
            : 'memory-button flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base border-2 border-white border-opacity-50') + ' transition-all duration-300';
        notRememberedButton.textContent = !flashcard.memoryStatus ? '❌ Belum Ingat' : '✗ Belum Ingat';
        notRememberedButton.onclick = (e) => {
            e.stopPropagation();
            
            // If flashcard was remembered, show animation
            if (flashcard.memoryStatus) {
                notRememberedButton.style.transition = 'all 0.2s ease';
                notRememberedButton.style.transform = 'scale(1.1)';
                notRememberedButton.style.backgroundColor = '#ef4444'; // red-500
                notRememberedButton.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.5)';
                
                // Update memory status
                this.toggleMemoryStatus(flashcard, false);
                
                // Wait for animation then trigger callback
                setTimeout(() => {
                    notRememberedButton.style.transform = 'scale(1)';
                    if (onMemoryStatusChange) {
                        onMemoryStatusChange('not-remembered');
                    }
                }, 200);
            } else {
                // If not remembered yet, just go to next immediately
                this.toggleMemoryStatus(flashcard, false);
                if (onMemoryStatusChange) {
                    onMemoryStatusChange('not-remembered');
                }
            }
        };

        buttonsContainer.appendChild(rememberedButton);
        buttonsContainer.appendChild(notRememberedButton);
        backDiv.appendChild(buttonsContainer);

        return backDiv;
    }

    /**
     * Toggle memory status of a flashcard
     * Syncs memory status across all flashcards with the same Hiragana/Katakana
     * @param {Object} flashcard - Flashcard to update
     * @param {boolean} remembered - New memory status
     */
    toggleMemoryStatus(flashcard, remembered) {
        // Import flashcardManager dynamically to avoid circular dependency
        import('./flashcard-manager.js').then(module => {
            // Update memory status for ALL flashcards with the same Hiragana/Katakana
            const result = module.flashcardManager.updateMemoryStatusByHiragana(flashcard.hiragana, remembered);
            if (result.success) {
                // Update local flashcard object
                flashcard.memoryStatus = remembered;
                
                // Trigger a custom event to notify the app to refresh progress
                window.dispatchEvent(new CustomEvent('memoryStatusChanged'));
            }
        });
    }

    /**
     * Handle flip interaction
     * Toggles the 'flipped' class on the flashcard element
     * @param {HTMLElement} flashcardElement - Flashcard DOM element
     */
    handleFlip(flashcardElement) {
        if (flashcardElement && flashcardElement.classList.contains('flip-card')) {
            flashcardElement.classList.toggle('flipped');
        }
    }

    /**
     * Create a complete flashcard element with front and back sides
     * @param {Object} flashcard - Flashcard data
     * @param {ViewContext} context - View context
     * @param {Function} onMemoryStatusChange - Callback when memory status changes
     * @returns {HTMLElement} - Complete flashcard element
     */
    createFlashcardElement(flashcard, context, onMemoryStatusChange = null) {
        // Main container
        const container = document.createElement('div');
        container.className = 'w-full max-w-2xl mx-auto cursor-pointer';
        container.style.perspective = '1000px';
        container.style.minHeight = '400px';
        container.dataset.flashcardId = flashcard.id;

        // Inner container for 3D flip
        const inner = document.createElement('div');
        inner.className = 'relative w-full';
        inner.style.width = '100%';
        inner.style.height = '100%';
        inner.style.minHeight = '400px';
        inner.style.transition = 'transform 0.4s';
        inner.style.transformStyle = 'preserve-3d';

        // Render front and back
        const front = this.renderFront(flashcard, context);
        const back = this.renderBack(flashcard, context, onMemoryStatusChange);

        // Add backface visibility styles
        front.style.position = 'absolute';
        front.style.width = '100%';
        front.style.height = '100%';
        front.style.minHeight = '400px';
        front.style.backfaceVisibility = 'hidden';
        front.style.WebkitBackfaceVisibility = 'hidden';

        back.style.position = 'absolute';
        back.style.width = '100%';
        back.style.height = '100%';
        back.style.minHeight = '400px';
        back.style.backfaceVisibility = 'hidden';
        back.style.WebkitBackfaceVisibility = 'hidden';
        back.style.transform = 'rotateY(180deg)';

        inner.appendChild(front);
        inner.appendChild(back);
        container.appendChild(inner);

        // Add click handler for flip
        let isFlipped = false;
        container.addEventListener('click', () => {
            isFlipped = !isFlipped;
            inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        });

        return container;
    }

    /**
     * Set current flashcards and context for navigation
     * @param {Array<Flashcard>} flashcards - Flashcards to display
     * @param {ViewContext} context - View context
     */
    setCurrentFlashcards(flashcards, context) {
        this.originalFlashcards = flashcards; // Store original before any filtering
        this.currentFlashcards = flashcards;
        this.currentContext = context;
        this.currentIndex = 0;
    }

    /**
     * Get current flashcard
     * @returns {Object|null} - Current flashcard or null
     */
    getCurrentFlashcard() {
        if (this.currentFlashcards.length === 0) {
            return null;
        }
        return this.currentFlashcards[this.currentIndex];
    }

    /**
     * Navigate to next flashcard
     * @returns {boolean} - True if navigation was successful
     */
    nextFlashcard() {
        if (this.currentIndex < this.currentFlashcards.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    /**
     * Navigate to previous flashcard
     * @returns {boolean} - True if navigation was successful
     */
    previousFlashcard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false;
    }

    /**
     * Get navigation info
     * @returns {Object} - Navigation info (current, total, hasNext, hasPrevious)
     */
    getNavigationInfo() {
        return {
            current: this.currentIndex + 1,
            total: this.currentFlashcards.length,
            hasNext: this.currentIndex < this.currentFlashcards.length - 1,
            hasPrevious: this.currentIndex > 0
        };
    }
}

// Export singleton instance
export const displayController = new DisplayController();
