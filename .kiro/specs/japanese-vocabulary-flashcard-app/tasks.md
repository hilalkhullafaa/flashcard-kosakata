# Implementation Plan: Japanese Vocabulary Flashcard Application

## Overview

This implementation plan breaks down the Japanese Vocabulary Flashcard Application into discrete, testable coding tasks. The application will be built using native JavaScript, Tailwind CSS, and localStorage for data persistence. The implementation follows a component-based architecture with clear separation between data management, business logic, and presentation layers.

The implementation order prioritizes foundational components first (project setup, data layer), then core business logic, followed by additional features, and finally UI integration and testing.

## Tasks

- [x] 1. Project setup and HTML structure
  - Create `index.html` with semantic HTML5 structure
  - Include Tailwind CSS via CDN
  - Set up basic page layout with header, main content area, and footer
  - Add copyright footer with "HILKA" text
  - Create directory structure: `js/` for JavaScript modules, `css/` for custom styles if needed
  - _Requirements: 12.1, 12.2, 14.1, 14.2_

- [x] 2. Implement data layer components
  - [x] 2.1 Create Storage Manager module
    - Implement `StorageManager` class with methods: `saveFlashcards()`, `loadFlashcards()`, `saveTheme()`, `loadTheme()`, `clearAll()`
    - Define storage keys constants: `FLASHCARDS` and `THEME`
    - Implement JSON serialization/deserialization
    - Add error handling for `QuotaExceededError` and corrupted data
    - _Requirements: 1.2, 13.4_

  - [ ]* 2.2 Write unit tests for Storage Manager
    - Test save and load operations
    - Test error handling for quota exceeded
    - Test handling of corrupted data
    - _Requirements: 1.2, 13.4_

  - [x] 2.3 Create Flashcard data model
    - Define `Flashcard` class with properties: `id`, `kanji`, `hiragana`, `meaning`, `romaji`, `source`, `chapters`, `memoryStatus`, `createdAt`, `updatedAt`
    - Define `FlashcardData` input schema
    - Define valid source constants: "IRADORI Beginner Level (A1)", "IRADORI Basic Level 1 (A1)", "IRADORI Basic Level 1 (A2)"
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 3. Implement Flashcard Manager
  - [x] 3.1 Create Flashcard Manager module
    - Implement `FlashcardManager` class with CRUD methods: `createFlashcard()`, `updateFlashcard()`, `deleteFlashcard()`, `getFlashcard()`, `getAllFlashcards()`
    - Implement `updateMemoryStatus()` method
    - Generate unique IDs using UUID or timestamp-based approach
    - Integrate with Storage Manager for persistence
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.2, 7.3_

  - [x] 3.2 Implement validation logic
    - Create `validateFlashcardData()` function
    - Validate required fields: `hiragana`, `meaning`, `romaji`, `source`, `chapters`
    - Validate source is one of three valid IRADORI levels
    - Validate chapters is non-empty array
    - Return validation errors with field names
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 3.3 Write unit tests for Flashcard Manager
    - Test creating flashcards with valid data
    - Test updating flashcards preserves ID and timestamps
    - Test deleting flashcards removes from storage
    - Test validation rejects invalid data
    - Test memory status updates correctly
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.2, 7.3_

- [x] 4. Implement Display Controller
  - [x] 4.1 Create Display Controller module
    - Implement `DisplayController` class with methods: `getFlashcardsForChapter()`, `getFlashcardsForAllSources()`, `renderFront()`, `renderBack()`, `handleFlip()`
    - Implement deduplication logic for all-sources view using Hiragana/Katakana as unique identifier
    - Implement chapter merging for deduplicated flashcards
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 15.2, 15.3, 15.4, 17.2, 17.3_

  - [x] 4.2 Implement flashcard rendering logic
    - Create `renderFront()` to display Kanji and Hiragana/Katakana
    - Create `renderBack()` to display Meaning, Romaji, Source, and Chapter
    - Implement context-aware chapter display: single chapter for per-chapter view, all chapters for all-sources view
    - Add memory status indicator to flashcard display
    - _Requirements: 3.1, 3.3, 7.4, 15.5, 15.6, 15.7, 17.4, 17.5, 17.6_

  - [x] 4.3 Implement flip interaction
    - Create `handleFlip()` method with CSS animation
    - Toggle between front and back sides on click/tap
    - _Requirements: 3.2, 3.5_

  - [ ]* 4.4 Write unit tests for Display Controller
    - Test deduplication logic for all-sources view
    - Test chapter filtering for per-chapter view
    - Test front side shows Kanji and Hiragana/Katakana
    - Test back side shows Meaning, Romaji, Source, and Chapter(s)
    - Test chapter field shows single chapter in per-chapter view
    - Test chapter field shows all chapters in all-sources view
    - _Requirements: 3.1, 3.3, 15.7, 17.6_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Filter Engine
  - [x] 6.1 Create Filter Engine module
    - Implement `FilterEngine` class with methods: `filterByScriptType()`, `getCurrentFilter()`, `setFilter()`
    - Implement Hiragana-only filter (empty Kanji field)
    - Implement Kanji filter (non-empty Kanji field)
    - Implement clear filter (return all flashcards)
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 6.2 Write unit tests for Filter Engine
    - Test Hiragana-only filter returns only flashcards with empty Kanji field
    - Test Kanji filter returns only flashcards with non-empty Kanji field
    - Test clear filter returns all flashcards
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 7. Implement Shuffle Engine
  - [x] 7.1 Create Shuffle Engine module
    - Implement `ShuffleEngine` class with methods: `shuffle()`, `isShuffled()`, `resetShuffle()`
    - Implement Fisher-Yates shuffle algorithm
    - Maintain shuffle state during session
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 7.2 Write unit tests for Shuffle Engine
    - Test shuffle produces different order than original
    - Test shuffle maintains all flashcards (no loss)
    - Test re-shuffle produces new order
    - _Requirements: 6.1, 6.2_

- [x] 8. Implement Progress Tracker
  - [x] 8.1 Create Progress Tracker module
    - Implement `ProgressTracker` class with methods: `getHiraganaProgress()`, `getKanjiProgress()`, `getUniqueIdentifiers()`
    - Implement unique vocabulary counting using Hiragana/Katakana identifier
    - Implement unique vocabulary counting using Kanji identifier (exclude empty Kanji fields)
    - Calculate total and remembered counts with percentage
    - Support per-chapter, per-source, and all-sources contexts
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 8.2 Write unit tests for Progress Tracker
    - Test unique vocabulary counting using Hiragana/Katakana identifier
    - Test unique vocabulary counting using Kanji identifier
    - Test duplicate flashcards counted as one unique vocabulary
    - Test remembered count only includes flashcards with memoryStatus = true
    - Test empty Kanji fields excluded from Kanji progress
    - Test per-chapter, per-source, and all-sources contexts produce correct counts
    - _Requirements: 9.1, 9.2, 9.5, 10.1, 10.2, 10.5_

- [x] 9. Implement Search Engine
  - [x] 9.1 Create Search Engine module
    - Implement `SearchEngine` class with methods: `search()`, `matches()`
    - Implement multi-field search across Kanji, Hiragana/Katakana, Meaning, and Romaji
    - Implement case-insensitive matching
    - Return all flashcards when query is empty
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 9.2 Write unit tests for Search Engine
    - Test search matches Kanji field
    - Test search matches Hiragana/Katakana field
    - Test search matches Meaning field
    - Test search matches Romaji field
    - Test search is case-insensitive
    - Test empty query returns all flashcards
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 10. Implement Theme Controller
  - [x] 10.1 Create Theme Controller module
    - Implement `ThemeController` class with methods: `toggleTheme()`, `getCurrentTheme()`, `setTheme()`, `loadThemePreference()`, `saveThemePreference()`
    - Implement light mode theme
    - Implement dark mode theme
    - Apply theme by toggling CSS classes on document root
    - Integrate with Storage Manager for theme persistence
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 10.2 Write unit tests for Theme Controller
    - Test toggle switches between light and dark
    - Test theme preference persists to localStorage
    - Test theme preference loads on initialization
    - _Requirements: 13.3, 13.4_

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement UI components and forms
  - [x] 12.1 Create flashcard form UI
    - Build add/edit flashcard form with fields: Kanji, Hiragana/Katakana, Meaning, Romaji, Source (dropdown), Chapters (multi-select or comma-separated input)
    - Add form validation with user-friendly error messages
    - Wire form submission to Flashcard Manager
    - Display validation errors inline
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 12.2 Create flashcard display UI
    - Build flashcard card component with front/back sides
    - Add flip animation using CSS transforms
    - Display memory status indicator (remembered/not remembered)
    - Add buttons for marking as remembered/not remembered
    - Wire memory status buttons to Flashcard Manager
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.2, 7.3, 7.4_

  - [x] 12.3 Create navigation and source organization UI
    - Build main screen with three source sections
    - Create chapter navigation within each source section
    - Add "View All Flashcards" and "Guessing Game" buttons for each chapter
    - Add "View All Flashcards" and "Guessing Game" buttons on main screen for all-sources view
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 15.1, 15.2, 16.1, 16.2, 17.1, 17.2, 18.1, 18.2_

  - [x] 12.4 Create filter and shuffle controls UI
    - Build filter dropdown/buttons for Hiragana-only, Kanji, and All
    - Build shuffle button
    - Wire filter controls to Filter Engine
    - Wire shuffle button to Shuffle Engine
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2_

  - [x] 12.5 Create search UI
    - Build search input field
    - Implement real-time search as user types
    - Wire search input to Search Engine
    - Display search results
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 12.6 Create progress display UI
    - Build progress statistics display for Hiragana/Katakana vocabulary
    - Build progress statistics display for Kanji vocabulary
    - Show total count, remembered count, and percentage
    - Display per-chapter progress in source sections
    - Display all-sources progress on main screen
    - _Requirements: 9.3, 9.4, 10.3, 10.4_

  - [x] 12.7 Create theme toggle UI
    - Build theme toggle button/switch
    - Add icon or label indicating current theme
    - Wire toggle to Theme Controller
    - _Requirements: 13.3_

- [x] 13. Implement guessing game feature
  - [x] 13.1 Create guessing game UI
    - Build guessing game view with flashcard front side display
    - Add input field for user answer
    - Add submit button
    - Add "Show Answer" functionality to reveal back side
    - Add "Next" button to navigate to next flashcard
    - _Requirements: 8.1, 8.2, 8.3, 16.5, 16.6, 16.8, 16.9, 18.4, 18.5, 18.7, 18.8_

  - [x] 13.2 Implement guessing game logic
    - Capture user input answer
    - Display correct meaning on submit
    - Allow comparison between user answer and correct answer
    - Navigate to next flashcard
    - Support per-chapter guessing game (show single chapter number)
    - Support all-sources guessing game (show all chapter numbers for deduplicated flashcards)
    - _Requirements: 8.1, 8.2, 8.3, 16.3, 16.4, 16.7, 18.3, 18.6_

  - [ ]* 13.3 Write integration tests for guessing game
    - Test guessing game displays flashcard front side
    - Test user can type and submit answer
    - Test correct meaning is displayed after submit
    - Test navigation to next flashcard works
    - Test per-chapter game shows single chapter number
    - Test all-sources game shows all chapter numbers
    - _Requirements: 8.1, 8.2, 8.3, 16.7, 18.6_

- [x] 14. Implement responsive design and styling
  - [x] 14.1 Apply Tailwind CSS styling
    - Style all UI components with Tailwind utility classes
    - Implement mobile-first responsive design
    - Add spacing, typography, and color schemes
    - Style forms with proper input styling and validation states
    - _Requirements: 12.1, 12.3_

  - [x] 14.2 Implement light and dark mode styles
    - Define light mode color palette using Tailwind classes
    - Define dark mode color palette using Tailwind dark: variants
    - Apply theme-aware styles to all components
    - Ensure text readability in both themes
    - _Requirements: 13.1, 13.2_

  - [x] 14.3 Add animations and transitions
    - Implement smooth flip animation for flashcards
    - Add hover effects for interactive elements
    - Add transition effects for theme switching
    - _Requirements: 3.2, 3.5, 12.3_

- [x] 15. Integration and wiring
  - [x] 15.1 Wire all components together
    - Initialize all managers and controllers on page load
    - Connect UI event handlers to business logic components
    - Implement navigation flow between views
    - Load initial data from localStorage
    - Apply saved theme preference on load
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 13.4_

  - [x] 15.2 Implement error handling and user feedback
    - Add user-facing error messages for storage quota exceeded
    - Add user-facing error messages for validation errors
    - Add user-facing error messages for flashcard not found
    - Display success messages for CRUD operations
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [ ]* 15.3 Write integration tests
    - Test flashcard lifecycle: Create → Display → Edit → Update → Delete
    - Test memory status flow: Mark as remembered → Progress updates → Display reflects status
    - Test filter + shuffle: Apply filter → Shuffle → Verify filtered results are shuffled
    - Test search + display: Search → Display results → Flip flashcards
    - Test theme + display: Toggle theme → Verify all components reflect theme change
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.2, 7.3, 13.3_

- [x] 16. Final checkpoint and testing
  - [x] 16.1 Verify all requirements are implemented
    - Test all CRUD operations work correctly
    - Test flashcard display and flip interaction
    - Test source-based organization
    - Test script type filtering
    - Test flashcard shuffling
    - Test memory status tracking
    - Test self-testing feature
    - Test progress tracking for Hiragana/Katakana vocabulary
    - Test progress tracking for Kanji vocabulary
    - Test vocabulary search
    - Test theme switching
    - Test per-chapter flashcard view and guessing game
    - Test all-sources flashcard view and guessing game
    - _Requirements: All_

  - [ ]* 16.2 Perform end-to-end testing
    - Test study session workflow: Navigate to chapter → View flashcards → Flip cards → Mark as remembered → Check progress
    - Test guessing game workflow: Navigate to chapter → Start guessing game → Type answer → Submit → Compare → Next card
    - Test flashcard management workflow: Add flashcard → Assign to multiple chapters → View in different chapters → Edit → Delete
    - Test cross-source study workflow: View all-sources flashcards → Verify deduplication → Check chapter field shows all chapters
    - Test search workflow: Enter search query → View results → Clear search → View all flashcards
    - _Requirements: All_

  - [x] 16.3 Final checkpoint - Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The design document does not include a "Correctness Properties" section, so property-based tests are not included
- Unit tests and integration tests validate specific examples, edge cases, and component interactions
- Manual testing is required for UI/UX, responsive design, and theme switching
- All code should use native JavaScript (ES6+) without frameworks
- Tailwind CSS should be included via CDN for rapid development
- localStorage is used for all data persistence (flashcards and theme preference)
