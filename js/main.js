/**
 * Main Application Module
 * Integrates all components and manages the application state
 */

import { flashcardManager } from './flashcard-manager.js';
import { displayController } from './display-controller.js';
import { filterEngine, FilterType } from './filter-engine.js';
import { shuffleEngine } from './shuffle-engine.js';
import { progressTracker } from './progress-tracker.js';
import { searchEngine } from './search-engine.js';
import { themeController } from './theme-controller.js';
import { VALID_SOURCES, ViewContext, ViewContextType } from './flashcard-model.js';

/**
 * Application class
 * Main application controller
 */
class App {
    constructor() {
        this.currentView = 'main';
        this.currentSource = null;
        this.currentChapter = null;
        this.searchTimeout = null; // For debouncing search
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Initialize theme
        themeController.initializeToggleButton();
        
        // Load dummy data if no flashcards exist
        this.loadDummyDataIfNeeded();
        
        // Render main view
        this.renderMainView();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Listen for memory status changes
        window.addEventListener('memoryStatusChanged', () => {
            this.renderMainView();
        });
    }

    /**
     * Load dummy data if no flashcards exist
     */
    loadDummyDataIfNeeded() {
        // Dummy data loading removed - users should add their own flashcards
        return;
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Add flashcard button (mobile FAB)
        const addButton = document.getElementById('add-flashcard-btn');
        if (addButton) {
            addButton.addEventListener('click', () => this.showAddFlashcardForm());
        }
        
        // Add flashcard button (desktop)
        const addButtonDesktop = document.getElementById('add-flashcard-btn-desktop');
        if (addButtonDesktop) {
            addButtonDesktop.addEventListener('click', () => this.showAddFlashcardForm());
        }
    }

    /**
     * Render main view with source sections and overall progress
     */
    renderMainView() {
        const mainView = document.getElementById('main-view');
        if (!mainView) return;

        // Clear all content first to ensure fresh render
        mainView.innerHTML = '';

        // Force reload flashcards from storage to ensure we have latest data
        flashcardManager.loadFlashcards();

        // Header with add button and search
        const header = this.createHeader();
        mainView.appendChild(header);

        // Overall progress
        const overallProgress = this.createOverallProgress();
        mainView.appendChild(overallProgress);

        // Source sections
        const sourcesContainer = document.createElement('div');
        sourcesContainer.className = 'space-y-6';

        VALID_SOURCES.forEach(source => {
            const sourceSection = this.createSourceSection(source);
            sourcesContainer.appendChild(sourceSection);
        });

        mainView.appendChild(sourcesContainer);
    }

    /**
     * Create header with search only
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'mb-6';

        // Search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'w-full';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search-input';
        searchInput.placeholder = 'Cari kosakata...';
        searchInput.className = 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-base focus:border-blue-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200';
        
        searchInput.addEventListener('input', (e) => {
            // Clear previous timeout
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            // Set new timeout for debouncing (300ms delay)
            this.searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        searchContainer.appendChild(searchInput);
        header.appendChild(searchContainer);

        return header;
    }

    /**
     * Create overall progress display
     */
    createOverallProgress() {
        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6 transition-all duration-300 hover:shadow-md';

        const title = document.createElement('h2');
        title.className = 'text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white';
        title.textContent = '📊 Progress Keseluruhan';

        const progress = progressTracker.getOverallProgress();
        const overallContext = { type: ViewContextType.ALL };

        const statsContainer = document.createElement('div');
        statsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4';

        // Hiragana/Katakana progress
        const hiraganaStats = this.createProgressCard(
            'Kosakata Hiragana/Katakana',
            progress.hiragana,
            overallContext
        );

        // Kanji progress
        const kanjiStats = this.createProgressCard(
            'Kosakata Kanji',
            progress.kanji,
            overallContext
        );

        statsContainer.appendChild(hiraganaStats);
        statsContainer.appendChild(kanjiStats);

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex flex-wrap gap-2';

        // View all flashcards button
        const viewAllButton = document.createElement('button');
        viewAllButton.className = 'bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200';
        viewAllButton.textContent = '📚 Lihat Semua';
        viewAllButton.addEventListener('click', () => this.showAllFlashcards());

        // Guessing game button
        const guessingButton = document.createElement('button');
        guessingButton.className = 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200';
        guessingButton.textContent = '🎮 Permainan';
        guessingButton.addEventListener('click', () => this.showGuessingGame(null, null));

        buttonsContainer.appendChild(viewAllButton);
        buttonsContainer.appendChild(guessingButton);

        container.appendChild(title);
        container.appendChild(statsContainer);
        container.appendChild(buttonsContainer);

        return container;
    }

    /**
     * Create progress card with remembered vocabulary list
     */
    createProgressCard(title, stats, context = null) {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-blue-200 dark:border-slate-600 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg';

        const titleEl = document.createElement('h3');
        titleEl.className = 'text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300';
        titleEl.textContent = title;

        const statsEl = document.createElement('div');
        statsEl.className = 'text-2xl font-bold text-indigo-500 dark:text-indigo-300 mb-3';
        statsEl.textContent = stats.getDisplayText();

        card.appendChild(titleEl);
        card.appendChild(statsEl);

        // Add remembered vocabulary list if available
        if (stats.rememberedList && stats.rememberedList.length > 0) {
            // View details button
            const viewDetailsBtn = document.createElement('button');
            viewDetailsBtn.className = 'inline-flex items-center gap-2 text-sm text-indigo-500 dark:text-indigo-300 font-semibold cursor-pointer transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-200 hover:translate-x-1 mt-2';
            viewDetailsBtn.innerHTML = '<span>Lihat Detail</span> <span class="inline-block text-xs">→</span>';
            
            // Click handler to open full view
            viewDetailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showRememberedVocabularyView(title, stats.rememberedList, context);
            });

            card.appendChild(viewDetailsBtn);
        } else if (stats.remembered === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-xs text-gray-500 dark:text-gray-400 italic mt-2';
            emptyMessage.textContent = 'Belum ada kosakata yang dihapal';
            card.appendChild(emptyMessage);
        }

        return card;
    }

    /**
     * Create source section with expand/collapse and progress tracker
     */
    createSourceSection(source) {
        const section = document.createElement('div');
        section.className = 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-md';

        const header = document.createElement('div');
        header.className = 'p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1';

        const titleAndBadge = document.createElement('div');
        titleAndBadge.className = 'flex items-center gap-2';

        const title = document.createElement('h2');
        title.className = 'text-base sm:text-lg font-bold text-gray-900 dark:text-white';
        title.textContent = `📖 ${source}`;

        const chapters = flashcardManager.getChaptersForSource(source);
        
        const badge = document.createElement('span');
        badge.className = 'bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-indigo-300 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap';
        badge.textContent = `${chapters.length} bab`;

        titleAndBadge.appendChild(title);
        titleAndBadge.appendChild(badge);

        // Get progress for this source
        const sourceContext = { type: ViewContextType.SOURCE, source: source };
        const hiraganaProgress = progressTracker.getHiraganaProgress(sourceContext);
        const kanjiProgress = progressTracker.getKanjiProgress(sourceContext);

        const progressInfo = document.createElement('div');
        progressInfo.className = 'flex items-center gap-2 sm:gap-3 text-xs';

        const hiraganaInfo = document.createElement('div');
        hiraganaInfo.className = 'text-gray-600 dark:text-gray-400';
        hiraganaInfo.textContent = `Hiragana: ${hiraganaProgress.remembered}/${hiraganaProgress.total}`;

        const kanjiInfo = document.createElement('div');
        kanjiInfo.className = 'text-gray-600 dark:text-gray-400';
        kanjiInfo.textContent = `Kanji: ${kanjiProgress.remembered}/${kanjiProgress.total}`;

        progressInfo.appendChild(hiraganaInfo);
        progressInfo.appendChild(kanjiInfo);

        titleContainer.appendChild(titleAndBadge);
        titleContainer.appendChild(progressInfo);

        const expandIcon = document.createElement('span');
        expandIcon.className = 'hidden sm:inline text-xl text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform duration-300';
        expandIcon.textContent = '▼';
        expandIcon.id = `expand-icon-${source}`;

        header.appendChild(titleContainer);
        header.appendChild(expandIcon);

        const chaptersContainer = document.createElement('div');
        chaptersContainer.id = `chapters-${source}`;
        chaptersContainer.className = 'px-4 overflow-hidden transition-all duration-250';
        chaptersContainer.style.maxHeight = '0px';
        chaptersContainer.style.transitionProperty = 'max-height, padding';
        chaptersContainer.style.transitionDuration = '0.25s';
        chaptersContainer.style.transitionTimingFunction = 'ease-out';

        if (chapters.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'text-gray-500 dark:text-gray-400 py-4 text-sm';
            emptyMessage.textContent = 'Belum ada flashcard. Tambahkan flashcard untuk memulai!';
            chaptersContainer.appendChild(emptyMessage);
        } else {
            // Progress tracker per source (detailed)
            const sourceProgressContainer = document.createElement('div');
            sourceProgressContainer.className = 'mb-4 grid grid-cols-1 md:grid-cols-2 gap-3';

            const hiraganaCard = this.createProgressCard('Hiragana/Katakana', hiraganaProgress, sourceContext);
            const kanjiCard = this.createProgressCard('Kanji', kanjiProgress, sourceContext);

            sourceProgressContainer.appendChild(hiraganaCard);
            sourceProgressContainer.appendChild(kanjiCard);

            chaptersContainer.appendChild(sourceProgressContainer);

            // Chapters grid
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4';

            chapters.forEach(chapter => {
                const chapterCard = this.createChapterCard(source, chapter);
                grid.appendChild(chapterCard);
            });

            // Add "View All" and "Guessing Game" buttons for this source
            const sourceButtons = document.createElement('div');
            sourceButtons.className = 'flex flex-wrap gap-2';

            const viewAllButton = document.createElement('button');
            viewAllButton.className = 'bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200';
            viewAllButton.textContent = '📚 Lihat Semua';
            viewAllButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSourceFlashcards(source);
            });

            const manageButton = document.createElement('button');
            manageButton.className = 'bg-gray-600 hover:bg-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200';
            manageButton.textContent = '⚙️ Kelola';
            manageButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showManageFlashcards(source, null);
            });

            const gameButton = document.createElement('button');
            gameButton.className = 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200';
            gameButton.textContent = '🎮 Permainan';
            gameButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showGuessingGame(source, null);
            });

            sourceButtons.appendChild(viewAllButton);
            sourceButtons.appendChild(manageButton);
            sourceButtons.appendChild(gameButton);

            chaptersContainer.appendChild(grid);
            chaptersContainer.appendChild(sourceButtons);
        }

        // Toggle expand/collapse
        header.addEventListener('click', () => {
            const isExpanded = chaptersContainer.style.maxHeight && chaptersContainer.style.maxHeight !== '0px';
            if (isExpanded) {
                chaptersContainer.style.maxHeight = '0px';
                chaptersContainer.style.paddingTop = '0px';
                chaptersContainer.style.paddingBottom = '0px';
                expandIcon.style.transform = 'rotate(0deg)';
            } else {
                chaptersContainer.style.maxHeight = '3000px';
                chaptersContainer.style.paddingTop = '1.5rem';
                chaptersContainer.style.paddingBottom = '1.5rem';
                expandIcon.style.transform = 'rotate(180deg)';
            }
        });

        section.appendChild(header);
        section.appendChild(chaptersContainer);

        return section;
    }

    /**
     * Create chapter card with elegant design
     */
    createChapterCard(source, chapter) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 transition-all duration-300 cursor-pointer hover:translate-y-[-4px] hover:shadow-xl';

        const chapterNumber = document.createElement('div');
        chapterNumber.className = 'text-2xl font-bold text-blue-600 dark:text-indigo-400 mb-1';
        chapterNumber.textContent = `Bab ${chapter}`;

        const flashcards = flashcardManager.getFlashcardsByChapter(source, chapter);
        const count = document.createElement('p');
        count.className = 'text-xs text-gray-600 dark:text-gray-400 mb-3';
        count.textContent = `${flashcards.length} kosakata`;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex flex-col gap-2';

        const viewButton = document.createElement('button');
        viewButton.className = 'bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200';
        viewButton.textContent = '👁️ Lihat';
        viewButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showChapterFlashcards(source, chapter);
        });

        const manageButton = document.createElement('button');
        manageButton.className = 'bg-gray-600 hover:bg-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200';
        manageButton.textContent = '⚙️ Kelola';
        manageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showManageFlashcards(source, chapter);
        });

        const gameButton = document.createElement('button');
        gameButton.className = 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200';
        gameButton.textContent = '🎮 Main';
        gameButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showGuessingGame(source, chapter);
        });

        buttonsContainer.appendChild(viewButton);
        buttonsContainer.appendChild(manageButton);
        buttonsContainer.appendChild(gameButton);

        card.appendChild(chapterNumber);
        card.appendChild(count);
        card.appendChild(buttonsContainer);

        return card;
    }

    /**
     * Show add flashcard form
     */
    showAddFlashcardForm() {
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;

        modal.innerHTML = '';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';

        const form = this.createFlashcardForm();
        modal.appendChild(form);

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');

        overlay.addEventListener('click', () => this.closeModal());
    }

    /**
     * Create flashcard form
     */
    createFlashcardForm(flashcard = null) {
        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold mb-6 text-gray-900 dark:text-white';
        title.textContent = flashcard ? 'Edit Flashcard' : 'Add New Flashcard';

        const form = document.createElement('form');
        form.className = 'space-y-4';

        // Kanji field
        const kanjiGroup = this.createFormGroup('Kanji (Optional)', 'kanji', 'text', flashcard?.kanji || '');
        
        // Hiragana field
        const hiraganaGroup = this.createFormGroup('Hiragana/Katakana *', 'hiragana', 'text', flashcard?.hiragana || '', true);
        
        // Meaning field
        const meaningGroup = this.createFormGroup('Meaning *', 'meaning', 'text', flashcard?.meaning || '', true);
        
        // Romaji field
        const romajiGroup = this.createFormGroup('Romaji *', 'romaji', 'text', flashcard?.romaji || '', true);
        
        // Source dropdown
        const sourceGroup = this.createSourceDropdown(flashcard?.source || '');
        
        // Chapters input
        const chaptersGroup = this.createFormGroup('Chapters * (comma-separated, e.g., 1,2,3)', 'chapters', 'text', flashcard?.chapters?.join(',') || '', true);

        form.appendChild(kanjiGroup);
        form.appendChild(hiraganaGroup);
        form.appendChild(meaningGroup);
        form.appendChild(romajiGroup);
        form.appendChild(sourceGroup);
        form.appendChild(chaptersGroup);

        // Error message container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'form-errors';
        errorContainer.className = 'hidden bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded';

        // Buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex gap-4 mt-6';

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200';
        submitButton.textContent = flashcard ? 'Update' : 'Add';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => this.closeModal());

        buttonsContainer.appendChild(submitButton);
        buttonsContainer.appendChild(cancelButton);

        form.appendChild(errorContainer);
        form.appendChild(buttonsContainer);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, flashcard);
        });

        container.appendChild(title);
        container.appendChild(form);

        return container;
    }

    /**
     * Create form group
     */
    createFormGroup(label, name, type, value = '', required = false) {
        const group = document.createElement('div');

        const labelEl = document.createElement('label');
        labelEl.className = 'block text-sm font-semibold mb-2 text-gray-900 dark:text-white';
        labelEl.textContent = label;

        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.value = value;
        input.required = required;
        input.className = 'w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-indigo-500 focus:outline-none transition-colors duration-200';

        group.appendChild(labelEl);
        group.appendChild(input);

        return group;
    }

    /**
     * Create source dropdown
     */
    createSourceDropdown(selectedValue = '') {
        const group = document.createElement('div');

        const label = document.createElement('label');
        label.className = 'block text-sm font-semibold mb-2 text-gray-900 dark:text-white';
        label.textContent = 'Source *';

        const select = document.createElement('select');
        select.name = 'source';
        select.required = true;
        select.className = 'w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-indigo-500 focus:outline-none transition-colors duration-200';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a source...';
        select.appendChild(defaultOption);

        VALID_SOURCES.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            if (source === selectedValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        group.appendChild(label);
        group.appendChild(select);

        return group;
    }

    /**
     * Handle form submit
     */
    handleFormSubmit(form, existingFlashcard = null) {
        const formData = new FormData(form);
        
        const data = {
            kanji: formData.get('kanji'),
            hiragana: formData.get('hiragana'),
            meaning: formData.get('meaning'),
            romaji: formData.get('romaji'),
            source: formData.get('source'),
            chapters: formData.get('chapters').split(',').map(ch => parseInt(ch.trim())).filter(ch => !isNaN(ch))
        };

        let result;
        if (existingFlashcard) {
            result = flashcardManager.updateFlashcard(existingFlashcard.id, data);
        } else {
            result = flashcardManager.createFlashcard(data);
        }

        if (result.success) {
            this.closeModal();
            this.renderMainView();
        } else {
            this.showFormErrors(result.errors);
        }
    }

    /**
     * Show form errors
     */
    showFormErrors(errors) {
        const errorContainer = document.getElementById('form-errors');
        if (!errorContainer) return;

        errorContainer.innerHTML = '';
        errorContainer.classList.remove('hidden');

        const ul = document.createElement('ul');
        ul.className = 'list-disc list-inside';

        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error.message || error.toString();
            ul.appendChild(li);
        });

        errorContainer.appendChild(ul);
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        // Simple alert for now
        alert(message);
    }

    /**
     * Show manage flashcards view with edit/delete options
     */
    showManageFlashcards(source, chapter) {
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;

        let flashcards;
        let title;

        if (source && chapter) {
            flashcards = flashcardManager.getFlashcardsByChapter(source, chapter);
            title = `Kelola Flashcard: ${source} - Bab ${chapter}`;
        } else if (source) {
            flashcards = flashcardManager.getFlashcardsBySource(source);
            title = `Kelola Flashcard: ${source}`;
        } else {
            flashcards = flashcardManager.getAllFlashcards();
            title = 'Kelola Semua Flashcard';
        }

        modal.innerHTML = '';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';

        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto';

        // Header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-6';

        const titleEl = document.createElement('h2');
        titleEl.className = 'text-2xl font-bold text-gray-900 dark:text-white';
        titleEl.textContent = title;

        const closeButton = document.createElement('button');
        closeButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold transition-colors duration-200';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.closeModal());

        header.appendChild(titleEl);
        header.appendChild(closeButton);

        // Flashcard list
        const listContainer = document.createElement('div');
        listContainer.className = 'space-y-2';

        if (flashcards.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'text-center text-gray-500 dark:text-gray-400 py-8';
            emptyMessage.textContent = 'Belum ada flashcard.';
            listContainer.appendChild(emptyMessage);
        } else {
            flashcards.forEach(flashcard => {
                const item = this.createFlashcardListItem(flashcard);
                listContainer.appendChild(item);
            });
        }

        container.appendChild(header);
        container.appendChild(listContainer);
        modal.appendChild(container);

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }

    /**
     * Create flashcard list item with edit/delete buttons
     */
    createFlashcardListItem(flashcard) {
        const item = document.createElement('div');
        item.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg gap-3 transition-all duration-200 hover:bg-blue-50 hover:bg-opacity-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10';

        const infoContainer = document.createElement('div');
        infoContainer.className = 'flex-1';

        const mainText = document.createElement('div');
        mainText.className = 'flex flex-wrap items-center gap-2 sm:gap-3 mb-1';

        if (flashcard.kanji && flashcard.kanji.trim() !== '') {
            const kanjiSpan = document.createElement('span');
            kanjiSpan.className = 'text-lg sm:text-xl font-bold text-gray-900 dark:text-white';
            kanjiSpan.textContent = flashcard.kanji;
            mainText.appendChild(kanjiSpan);
        }

        const hiraganaSpan = document.createElement('span');
        hiraganaSpan.className = 'text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400';
        hiraganaSpan.textContent = flashcard.hiragana;
        mainText.appendChild(hiraganaSpan);

        const meaningSpan = document.createElement('span');
        meaningSpan.className = 'text-sm sm:text-base text-gray-700 dark:text-gray-300';
        meaningSpan.textContent = `- ${flashcard.meaning}`;
        mainText.appendChild(meaningSpan);

        const metaText = document.createElement('div');
        metaText.className = 'text-xs text-gray-500 dark:text-gray-400';
        metaText.textContent = `${flashcard.source} - Bab ${flashcard.chapters.join(', ')} | Romaji: ${flashcard.romaji}`;

        infoContainer.appendChild(mainText);
        infoContainer.appendChild(metaText);

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'flex items-center gap-2 sm:flex-shrink-0';

        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'action-btn flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200';
        editButton.textContent = '✏️ Edit';
        editButton.addEventListener('click', () => {
            this.closeModal();
            setTimeout(() => this.showEditFlashcardForm(flashcard), 100);
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-btn flex-1 sm:flex-none bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200';
        deleteButton.textContent = '🗑️ Hapus';
        deleteButton.addEventListener('click', () => {
            const result = flashcardManager.deleteFlashcard(flashcard.id);
            if (result.success) {
                // Add delete animation
                item.style.transition = 'all 0.2s ease-out';
                item.style.transform = 'translateX(100%)';
                item.style.opacity = '0';
                
                // Remove item after animation
                setTimeout(() => {
                    item.remove();
                    
                    // Check if list is empty
                    const listContainer = item.parentElement;
                    if (listContainer && listContainer.children.length === 0) {
                        const emptyMessage = document.createElement('p');
                        emptyMessage.className = 'text-center text-gray-500 dark:text-gray-400 py-8';
                        emptyMessage.textContent = 'Belum ada flashcard.';
                        listContainer.appendChild(emptyMessage);
                    }
                }, 200);
                
                // Refresh main view in background
                setTimeout(() => {
                    this.renderMainView();
                }, 250);
            } else {
                alert('Gagal menghapus flashcard.');
            }
        });

        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);

        item.appendChild(infoContainer);
        item.appendChild(actionsContainer);

        return item;
    }

    /**
     * Show edit flashcard form
     */
    showEditFlashcardForm(flashcard) {
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;

        modal.innerHTML = '';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';

        const form = this.createFlashcardForm(flashcard);
        modal.appendChild(form);

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');

        overlay.addEventListener('click', () => this.closeModal());
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
    }

    /**
     * Show chapter flashcards
     */
    showChapterFlashcards(source, chapter) {
        const flashcards = flashcardManager.getFlashcardsByChapter(source, chapter);
        const context = new ViewContext(ViewContextType.CHAPTER, source, chapter);
        this.showFlashcardsView(flashcards, context, `${source} - Chapter ${chapter}`);
    }

    /**
     * Show source flashcards (deduplicated by Hiragana/Katakana)
     */
    showSourceFlashcards(source) {
        const flashcards = displayController.getFlashcardsForSource(source);
        const context = new ViewContext(ViewContextType.SOURCE, source);
        this.showFlashcardsView(flashcards, context, `${source} - All Chapters`);
    }

    /**
     * Show all flashcards
     */
    showAllFlashcards() {
        const flashcards = displayController.getFlashcardsForAllSources();
        const context = new ViewContext(ViewContextType.ALL);
        this.showFlashcardsView(flashcards, context, 'All Flashcards');
    }

    /**
     * Show remembered vocabulary view
     * Displays all remembered vocabulary in a full-screen list view
     */
    showRememberedVocabularyView(title, rememberedList, context = null) {
        // Debug: Log the rememberedList to verify data structure
        console.log('[showRememberedVocabularyView] Called with:', {
            title,
            listLength: rememberedList?.length,
            context,
            sampleItem: rememberedList?.[0]
        });
        
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;

        modal.innerHTML = '';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';

        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col';

        // Header
        const header = document.createElement('div');
        header.className = 'p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center';

        const headerTitle = document.createElement('h2');
        headerTitle.className = 'text-xl sm:text-2xl font-bold text-gray-900 dark:text-white';
        headerTitle.textContent = `✅ ${title} - Sudah Dihapal`;

        const closeButton = document.createElement('button');
        closeButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold transition-colors duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.closeModal());

        header.appendChild(headerTitle);
        header.appendChild(closeButton);

        // Count info
        const countInfo = document.createElement('div');
        countInfo.className = 'px-4 sm:px-6 py-3 bg-blue-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600';
        countInfo.innerHTML = `<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Total: <span class="text-blue-600 dark:text-indigo-400">${rememberedList.length}</span> kosakata</span>`;

        // Content - scrollable list
        const content = document.createElement('div');
        content.className = 'flex-1 overflow-y-auto p-4 sm:p-6';

        const list = document.createElement('div');
        list.className = 'space-y-3';

        rememberedList.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-blue-200 dark:border-slate-600 transition-all duration-200 hover:shadow-md';

            // Number badge
            const numberBadge = document.createElement('div');
            numberBadge.className = 'inline-block bg-blue-500 dark:bg-slate-700 text-white dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-full mb-2';
            numberBadge.textContent = `#${index + 1}`;

            // Vocabulary row
            const vocabRow = document.createElement('div');
            vocabRow.className = 'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2';

            const vocabText = document.createElement('div');
            vocabText.className = 'flex flex-col gap-1';

            // Main vocabulary (Hiragana or Kanji)
            const mainVocab = document.createElement('div');
            mainVocab.className = 'text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white';
            mainVocab.textContent = item.identifier;

            // Secondary vocabulary (show both if available)
            if (item.kanji && item.hiragana && item.identifier !== item.hiragana) {
                const secondaryVocab = document.createElement('div');
                secondaryVocab.className = 'text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-medium';
                secondaryVocab.textContent = item.hiragana;
                vocabText.appendChild(mainVocab);
                vocabText.appendChild(secondaryVocab);
            } else {
                vocabText.appendChild(mainVocab);
            }

            const meaning = document.createElement('div');
            meaning.className = 'text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 sm:text-right';
            meaning.textContent = item.meaning;

            vocabRow.appendChild(vocabText);
            vocabRow.appendChild(meaning);

            // Chapters info
            if (item.chapters && item.chapters.length > 0) {
                const metaInfo = document.createElement('div');
                metaInfo.className = 'space-y-1';
                
                // Debug log to verify item data
                console.log(`[Display] Rendering vocabulary: ${item.identifier}`, {
                    sources: item.sources,
                    chapters: item.chapters,
                    hasSources: !!(item.sources && item.sources.length > 0)
                });
                
                // Sources info
                if (item.sources && item.sources.length > 0) {
                    const sourcesInfo = document.createElement('div');
                    sourcesInfo.className = 'text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2';
                    sourcesInfo.innerHTML = `<span class="font-medium">📚 Sumber:</span> <span class="font-semibold text-gray-700 dark:text-gray-300">${item.sources.join(' | ')}</span>`;
                    metaInfo.appendChild(sourcesInfo);
                } else {
                    console.warn(`[Display] No sources found for vocabulary: ${item.identifier}`);
                }
                
                // Chapters info
                const chaptersInfo = document.createElement('div');
                chaptersInfo.className = 'text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2';
                chaptersInfo.innerHTML = `<span class="font-medium">📖 Bab:</span> <span class="font-semibold text-blue-600 dark:text-indigo-400">${item.chapters.join(', ')}</span>`;
                metaInfo.appendChild(chaptersInfo);
                
                itemCard.appendChild(numberBadge);
                itemCard.appendChild(vocabRow);
                itemCard.appendChild(metaInfo);
            } else {
                console.warn(`[Display] No chapters found for vocabulary: ${item.identifier}`);
                itemCard.appendChild(numberBadge);
                itemCard.appendChild(vocabRow);
            }

            list.appendChild(itemCard);
        });

        content.appendChild(list);

        // Footer with close button
        const footer = document.createElement('div');
        footer.className = 'p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end';

        const closeFooterButton = document.createElement('button');
        closeFooterButton.className = 'bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200';
        closeFooterButton.textContent = 'Tutup';
        closeFooterButton.addEventListener('click', () => this.closeModal());

        footer.appendChild(closeFooterButton);

        container.appendChild(header);
        container.appendChild(countInfo);
        container.appendChild(content);
        container.appendChild(footer);

        modal.appendChild(container);

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }

    /**
     * Show flashcards view
     */
    showFlashcardsView(flashcards, context, title) {
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;

        // Reset filter to ALL when opening flashcard view
        filterEngine.clearFilter();

        displayController.setCurrentFlashcards(flashcards, context);

        modal.innerHTML = '';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-0 overflow-hidden';

        const container = document.createElement('div');
        container.className = 'bg-gradient-to-br from-blue-600 to-purple-700 dark:from-slate-900 dark:to-indigo-950 w-full h-full flex flex-col overflow-hidden';

        // Header with close button
        const header = document.createElement('div');
        header.className = 'w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0';

        const titleEl = document.createElement('h2');
        titleEl.className = 'text-xl sm:text-2xl md:text-3xl font-bold text-white';
        titleEl.textContent = title;

        const closeButton = document.createElement('button');
        closeButton.className = 'text-white hover:text-gray-200 text-3xl sm:text-4xl font-bold transition-colors duration-200 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 flex-shrink-0';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.closeModal());

        header.appendChild(titleEl);
        header.appendChild(closeButton);

        // Flashcard display (centered, no scroll)
        const flashcardContainer = document.createElement('div');
        flashcardContainer.id = 'flashcard-display';
        flashcardContainer.className = 'w-full flex-1 flex items-center justify-center px-4 sm:px-6 overflow-hidden';

        // Navigation with counter
        const navigation = this.createFlashcardNavigation();

        // Filter and shuffle controls (compact)
        const controls = this.createFlashcardControls();

        container.appendChild(header);
        container.appendChild(flashcardContainer);
        container.appendChild(navigation);
        container.appendChild(controls);

        modal.appendChild(container);

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');

        this.renderCurrentFlashcard();
    }

    /**
     * Create flashcard controls (compact version)
     */
    createFlashcardControls() {
        const controls = document.createElement('div');
        controls.className = 'w-full flex gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 justify-center flex-wrap flex-shrink-0';

        // Filter dropdown
        const filterSelect = document.createElement('select');
        filterSelect.className = 'px-3 sm:px-4 py-2 rounded-lg border-2 border-white border-opacity-30 bg-white bg-opacity-20 text-white font-medium backdrop-blur-sm text-sm sm:text-base';
        
        Object.values(FilterType).forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = filterEngine.getFilterDisplayName(type);
            option.className = 'text-gray-900';
            // Set selected based on current filter
            if (type === filterEngine.getCurrentFilter()) {
                option.selected = true;
            }
            filterSelect.appendChild(option);
        });

        filterSelect.addEventListener('change', (e) => {
            filterEngine.setFilter(e.target.value);
            this.applyFilterAndShuffle();
        });

        // Shuffle button
        const shuffleButton = document.createElement('button');
        shuffleButton.className = 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 backdrop-blur-sm border-2 border-white border-opacity-30';
        shuffleButton.textContent = '🔀 Acak';
        shuffleButton.addEventListener('click', () => {
            this.applyFilterAndShuffle(true);
        });

        controls.appendChild(filterSelect);
        controls.appendChild(shuffleButton);

        return controls;
    }

    /**
     * Apply filter and shuffle
     */
    applyFilterAndShuffle(shuffle = false) {
        // Start with original flashcards (before any filtering)
        let flashcards = displayController.originalFlashcards;
        
        // Apply filter
        flashcards = filterEngine.filterByScriptType(flashcards);
        
        // Apply shuffle if requested
        if (shuffle) {
            flashcards = shuffleEngine.shuffle(flashcards);
        }
        
        // Update current flashcards (don't update original)
        displayController.currentFlashcards = flashcards;
        displayController.currentIndex = 0;
        this.renderCurrentFlashcard();
    }

    /**
     * Create flashcard navigation
     */
    createFlashcardNavigation() {
        const nav = document.createElement('div');
        nav.className = 'w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-4 flex-shrink-0';

        const prevButton = document.createElement('button');
        prevButton.id = 'prev-flashcard';
        prevButton.className = 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm border-2 border-white border-opacity-30';
        prevButton.innerHTML = '<span class="hidden sm:inline">← Sebelumnya</span><span class="sm:hidden">←</span>';
        prevButton.addEventListener('click', () => this.previousFlashcard());

        const info = document.createElement('div');
        info.id = 'flashcard-info';
        info.className = 'text-white font-bold text-base sm:text-xl';

        const nextButton = document.createElement('button');
        nextButton.id = 'next-flashcard';
        nextButton.className = 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm border-2 border-white border-opacity-30';
        nextButton.innerHTML = '<span class="hidden sm:inline">Selanjutnya →</span><span class="sm:hidden">→</span>';
        nextButton.addEventListener('click', () => this.nextFlashcard());

        nav.appendChild(prevButton);
        nav.appendChild(info);
        nav.appendChild(nextButton);

        return nav;
    }

    /**
     * Render current flashcard
     */
    renderCurrentFlashcard() {
        const container = document.getElementById('flashcard-display');
        if (!container) return;

        const flashcard = displayController.getCurrentFlashcard();
        if (!flashcard) {
            container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No flashcards to display</p>';
            return;
        }

        container.innerHTML = '';
        
        // Create flashcard with callback for memory status change
        const flashcardEl = displayController.createFlashcardElement(
            flashcard, 
            displayController.currentContext,
            (action) => {
                // Auto-navigate to next flashcard after memory status change
                setTimeout(() => {
                    this.nextFlashcard();
                }, 250); // Wait a bit after animation
            }
        );
        
        container.appendChild(flashcardEl);

        // Update navigation
        this.updateNavigation();
    }

    /**
     * Update navigation buttons
     */
    updateNavigation() {
        const info = displayController.getNavigationInfo();
        
        const infoEl = document.getElementById('flashcard-info');
        if (infoEl) {
            infoEl.textContent = `${info.current} / ${info.total}`;
        }

        const prevButton = document.getElementById('prev-flashcard');
        if (prevButton) {
            prevButton.disabled = !info.hasPrevious;
        }

        const nextButton = document.getElementById('next-flashcard');
        if (nextButton) {
            nextButton.disabled = !info.hasNext;
        }
    }

    /**
     * Navigate to next flashcard
     */
    nextFlashcard() {
        if (displayController.nextFlashcard()) {
            this.renderCurrentFlashcard();
        }
    }

    /**
     * Navigate to previous flashcard
     */
    previousFlashcard() {
        if (displayController.previousFlashcard()) {
            this.renderCurrentFlashcard();
        }
    }

    /**
     * Show guessing game
     */
    showGuessingGame(source, chapter) {
        let flashcards;
        let title;
        let context;

        if (source && chapter) {
            // Per-chapter guessing game
            flashcards = flashcardManager.getFlashcardsByChapter(source, chapter);
            title = `Guessing Game: ${source} - Chapter ${chapter}`;
            context = new ViewContext(ViewContextType.CHAPTER, source, chapter);
        } else if (source && !chapter) {
            // Per-source guessing game (deduplicated)
            flashcards = displayController.getFlashcardsForSource(source);
            title = `Guessing Game: ${source}`;
            context = new ViewContext(ViewContextType.SOURCE, source);
        } else {
            // All-sources guessing game (deduplicated)
            flashcards = displayController.getFlashcardsForAllSources();
            title = 'Guessing Game: All Sources';
            context = new ViewContext(ViewContextType.ALL);
        }

        if (flashcards.length === 0) {
            alert('No flashcards available for this selection!');
            return;
        }

        // ✅ Automatically shuffle flashcards every time guessing game is opened
        flashcards = shuffleEngine.shuffle(flashcards);

        displayController.setCurrentFlashcards(flashcards, context);

        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;

        modal.innerHTML = '';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-0 overflow-hidden';

        const container = document.createElement('div');
        container.className = 'bg-white dark:bg-slate-800 w-full h-full sm:rounded-lg sm:shadow-xl sm:max-w-4xl sm:h-[90vh] flex flex-col overflow-hidden';

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0 border-b border-gray-200 dark:border-slate-700';

        const titleEl = document.createElement('h2');
        titleEl.className = 'text-lg sm:text-2xl font-bold text-gray-900 dark:text-white';
        titleEl.textContent = title;

        const closeButton = document.createElement('button');
        closeButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold transition-colors duration-200 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.closeModal());

        header.appendChild(titleEl);
        header.appendChild(closeButton);

        // Game container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'guessing-game-container';
        gameContainer.className = 'flex-1 flex flex-col overflow-hidden px-4 sm:px-6 py-4';

        container.appendChild(header);
        container.appendChild(gameContainer);

        modal.appendChild(container);

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');

        this.renderGuessingGameCard();
    }

    /**
     * Render guessing game card
     */
    renderGuessingGameCard() {
        const container = document.getElementById('guessing-game-container');
        if (!container) return;

        const flashcard = displayController.getCurrentFlashcard();
        if (!flashcard) {
            container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No flashcards to display</p>';
            return;
        }

        container.innerHTML = '';

        // Progress info
        const info = displayController.getNavigationInfo();
        const progressBar = document.createElement('div');
        progressBar.className = 'mb-3 sm:mb-4';
        
        const progressText = document.createElement('div');
        progressText.className = 'text-center text-gray-900 dark:text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base';
        progressText.textContent = `Card ${info.current} of ${info.total}`;
        
        const progressBarBg = document.createElement('div');
        progressBarBg.className = 'w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2 sm:h-3';
        
        const progressBarFill = document.createElement('div');
        progressBarFill.className = 'bg-blue-500 dark:bg-indigo-600 h-2 sm:h-3 rounded-full transition-all duration-300';
        progressBarFill.style.width = `${(info.current / info.total) * 100}%`;
        
        progressBarBg.appendChild(progressBarFill);
        progressBar.appendChild(progressText);
        progressBar.appendChild(progressBarBg);

        // Flashcard front (question)
        const questionCard = document.createElement('div');
        questionCard.className = 'bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 sm:p-8 mb-3 sm:mb-6 min-h-[120px] sm:min-h-[200px] flex flex-col items-center justify-center border border-gray-200 dark:border-slate-700';

        const kanjiText = document.createElement('div');
        kanjiText.className = 'text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center break-words leading-tight';
        kanjiText.style.maxHeight = '4rem';
        kanjiText.style.overflow = 'hidden';
        kanjiText.style.display = '-webkit-box';
        kanjiText.style.webkitLineClamp = '2';
        kanjiText.style.webkitBoxOrient = 'vertical';
        kanjiText.textContent = flashcard.kanji || flashcard.hiragana;

        const hiraganaText = document.createElement('div');
        hiraganaText.className = 'text-lg sm:text-2xl md:text-3xl text-gray-700 dark:text-white text-center break-words leading-tight';
        hiraganaText.style.maxHeight = '3rem';
        hiraganaText.style.overflow = 'hidden';
        hiraganaText.style.display = '-webkit-box';
        hiraganaText.style.webkitLineClamp = '2';
        hiraganaText.style.webkitBoxOrient = 'vertical';
        hiraganaText.textContent = flashcard.hiragana;

        questionCard.appendChild(kanjiText);
        if (flashcard.kanji) {
            questionCard.appendChild(hiraganaText);
        }

        // Answer input section
        const answerSection = document.createElement('div');
        answerSection.id = 'answer-section';
        answerSection.className = 'space-y-2 sm:space-y-4';

        const inputGroup = document.createElement('div');
        inputGroup.className = 'flex flex-col gap-2 sm:gap-3';

        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.id = 'guess-input';
        answerInput.placeholder = 'Type your answer...';
        answerInput.className = 'w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-base sm:text-lg focus:border-blue-500 dark:focus:border-indigo-500 focus:outline-none transition-colors duration-200';
        
        const showAnswerButton = document.createElement('button');
        showAnswerButton.id = 'show-answer';
        showAnswerButton.className = 'w-full bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200';
        showAnswerButton.textContent = 'Show Answer';
        
        const submitButton = document.createElement('button');
        submitButton.id = 'submit-guess';
        submitButton.className = 'w-full bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105';
        submitButton.textContent = 'Submit';

        inputGroup.appendChild(answerInput);
        inputGroup.appendChild(showAnswerButton);
        inputGroup.appendChild(submitButton);

        answerSection.appendChild(inputGroup);

        // Result section (hidden initially)
        const resultSection = document.createElement('div');
        resultSection.id = 'result-section';
        resultSection.className = 'hidden space-y-2 sm:space-y-4';

        const userAnswerDiv = document.createElement('div');
        userAnswerDiv.id = 'user-answer';
        userAnswerDiv.className = 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-3 sm:p-4';

        const correctAnswerDiv = document.createElement('div');
        correctAnswerDiv.className = 'bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-lg p-3 sm:p-6';

        const correctLabel = document.createElement('div');
        correctLabel.className = 'text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2';
        correctLabel.textContent = 'Correct Answer:';

        const meaningText = document.createElement('div');
        meaningText.className = 'text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-2 sm:mb-3 break-words leading-snug';
        meaningText.textContent = flashcard.meaning;

        const romajiText = document.createElement('div');
        romajiText.className = 'text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 break-words';
        romajiText.textContent = `Romaji: ${flashcard.romaji}`;

        const sourceText = document.createElement('div');
        sourceText.className = 'text-xs sm:text-sm text-gray-600 dark:text-gray-400';
        
        // Show chapter(s) based on context
        const chapterDisplay = displayController.currentContext.type === ViewContextType.CHAPTER 
            ? displayController.currentContext.chapter 
            : flashcard.chapters.join(', ');
        sourceText.textContent = `Source: ${flashcard.source} - Chapter ${chapterDisplay}`;

        correctAnswerDiv.appendChild(correctLabel);
        correctAnswerDiv.appendChild(meaningText);
        correctAnswerDiv.appendChild(romajiText);
        correctAnswerDiv.appendChild(sourceText);

        resultSection.appendChild(userAnswerDiv);
        resultSection.appendChild(correctAnswerDiv);

        // Navigation buttons
        const navigation = document.createElement('div');
        navigation.className = 'flex justify-between items-center mt-3 sm:mt-6 gap-2';

        const prevButton = document.createElement('button');
        prevButton.className = 'bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105';
        prevButton.textContent = '← Previous';
        prevButton.disabled = !info.hasPrevious;
        prevButton.addEventListener('click', () => {
            if (displayController.previousFlashcard()) {
                this.renderGuessingGameCard();
            }
        });

        const nextButton = document.createElement('button');
        nextButton.id = 'next-guess-card';
        nextButton.className = 'bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105';
        nextButton.textContent = 'Next →';
        nextButton.disabled = !info.hasNext;
        nextButton.addEventListener('click', () => {
            if (displayController.nextFlashcard()) {
                this.renderGuessingGameCard();
            }
        });

        navigation.appendChild(prevButton);
        navigation.appendChild(nextButton);

        // Assemble the card
        container.appendChild(progressBar);
        container.appendChild(questionCard);
        container.appendChild(answerSection);
        container.appendChild(resultSection);
        container.appendChild(navigation);

        // Event listeners
        submitButton.addEventListener('click', () => this.submitGuess());
        showAnswerButton.addEventListener('click', () => this.showAnswer());
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitGuess();
            }
        });

        // Focus on input
        answerInput.focus();
    }

    /**
     * Submit guess
     */
    submitGuess() {
        const input = document.getElementById('guess-input');
        const userAnswer = input ? input.value.trim() : '';

        if (!userAnswer) {
            alert('Please enter an answer!');
            return;
        }

        this.showAnswer(userAnswer);
    }

    /**
     * Show answer
     */
    showAnswer(userAnswer = null) {
        const answerSection = document.getElementById('answer-section');
        const resultSection = document.getElementById('result-section');
        const userAnswerDiv = document.getElementById('user-answer');

        if (answerSection) answerSection.classList.add('hidden');
        if (resultSection) resultSection.classList.remove('hidden');

        if (userAnswer && userAnswerDiv) {
            userAnswerDiv.innerHTML = `
                <div class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Your Answer:</div>
                <div class="text-base sm:text-xl font-bold text-blue-700 dark:text-blue-300 break-words">${userAnswer}</div>
            `;
        } else if (userAnswerDiv) {
            userAnswerDiv.innerHTML = `
                <div class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">You chose to reveal the answer</div>
            `;
        }
    }

    /**
     * Handle search
     */
    handleSearch(query) {
        if (!query || query.trim() === '') {
            this.renderMainView();
            return;
        }

        const results = searchEngine.search(query);
        this.showSearchResults(results, query);
    }

    /**
     * Show search results
     */
    showSearchResults(results, query) {
        const mainView = document.getElementById('main-view');
        if (!mainView) return;

        // Save cursor position before clearing
        const searchInput = document.getElementById('search-input');
        const cursorPosition = searchInput ? searchInput.selectionStart : 0;

        mainView.innerHTML = '';

        // Keep search input
        const header = this.createHeader();
        mainView.appendChild(header);
        
        // Restore search input value and cursor position
        const newSearchInput = document.getElementById('search-input');
        if (newSearchInput) {
            newSearchInput.value = query;
            // Restore cursor position after a short delay to ensure DOM is ready
            setTimeout(() => {
                newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
                newSearchInput.focus();
            }, 0);
        }

        const title = document.createElement('h2');
        title.className = 'text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white';
        title.textContent = `Hasil Pencarian "${query}" (${results.length} ditemukan)`;

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

        if (results.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'col-span-full text-center text-gray-500 dark:text-gray-400 py-8';
            emptyMessage.textContent = 'Tidak ada hasil yang ditemukan.';
            resultsContainer.appendChild(emptyMessage);
        } else {
            results.forEach(flashcard => {
                const card = this.createSearchResultCard(flashcard);
                resultsContainer.appendChild(card);
            });
        }

        mainView.appendChild(title);
        mainView.appendChild(resultsContainer);
    }

    /**
     * Create search result card
     */
    createSearchResultCard(flashcard) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200';

        const mainInfo = document.createElement('div');
        mainInfo.className = 'mb-3';

        const kanjiDiv = document.createElement('div');
        kanjiDiv.className = 'text-2xl font-bold text-gray-900 dark:text-white mb-1';
        kanjiDiv.textContent = flashcard.kanji || flashcard.hiragana;

        const hiraganaDiv = document.createElement('div');
        hiraganaDiv.className = 'text-lg text-blue-600 dark:text-blue-400 mb-1';
        hiraganaDiv.textContent = flashcard.hiragana;

        const meaningDiv = document.createElement('div');
        meaningDiv.className = 'text-base text-gray-700 dark:text-gray-300 mb-2';
        meaningDiv.textContent = flashcard.meaning;

        mainInfo.appendChild(kanjiDiv);
        mainInfo.appendChild(hiraganaDiv);
        mainInfo.appendChild(meaningDiv);

        const metaInfo = document.createElement('div');
        metaInfo.className = 'text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2';
        metaInfo.textContent = `${flashcard.source} - Bab ${flashcard.chapters.join(', ')}`;

        card.appendChild(mainInfo);
        card.appendChild(metaInfo);

        return card;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

