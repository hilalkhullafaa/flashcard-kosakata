# Requirements Document

## Introduction

This document specifies the requirements for a Japanese vocabulary flashcard application designed to help users learn Japanese vocabulary from IRADORI textbook series. The application enables users to create, manage, study, and track their progress with Japanese vocabulary flashcards organized by source materials and chapters. The application provides interactive study features including flashcard flipping, filtering, shuffling, memory tracking, and self-testing capabilities.

## Glossary

- **Flashcard**: A digital card containing Japanese vocabulary information with a front side (Kanji and Hiragana/Katakana) and back side (Meaning, Romaji, Source, Chapter)
- **Kanji**: Japanese logographic characters used in the Japanese writing system
- **Hiragana**: Japanese syllabic script used for native Japanese words
- **Katakana**: Japanese syllabic script used primarily for foreign words
- **Romaji**: Romanized representation of Japanese pronunciation
- **Source**: The IRADORI textbook level from which the vocabulary originates
- **Chapter**: The chapter number within a source textbook
- **Memory_Status**: A boolean indicator showing whether a user has marked a flashcard as remembered or not remembered
- **Script_Type**: Classification of vocabulary as either Hiragana-only or Kanji-containing
- **Application**: The Japanese vocabulary flashcard application system
- **User**: A person using the application to study Japanese vocabulary
- **Flashcard_Manager**: The component responsible for creating, reading, updating, and deleting flashcards
- **Display_Controller**: The component responsible for rendering flashcards and handling flip interactions
- **Filter_Engine**: The component responsible for filtering flashcards by script type
- **Shuffle_Engine**: The component responsible for randomizing flashcard order
- **Progress_Tracker**: The component responsible for calculating and displaying vocabulary progress statistics
- **Search_Engine**: The component responsible for finding flashcards based on user queries
- **Theme_Controller**: The component responsible for managing light mode and dark mode display

## Requirements

### Requirement 1: Flashcard CRUD Operations

**User Story:** As a user, I want to create, edit, and delete flashcards, so that I can manage my Japanese vocabulary collection.

#### Acceptance Criteria

1. WHEN the User clicks the add button, THE Flashcard_Manager SHALL display a form with fields for Kanji, Hiragana/Katakana, Meaning, Romaji, Source, and Chapter
2. WHEN the User submits a completed flashcard form, THE Flashcard_Manager SHALL save the flashcard to the selected Source and Chapter
3. WHEN the User selects an existing flashcard for editing, THE Flashcard_Manager SHALL display the form pre-filled with the flashcard data
4. WHEN the User saves edited flashcard data, THE Flashcard_Manager SHALL update the flashcard and preserve its Source and Chapter assignment
5. WHEN the User deletes a flashcard, THE Flashcard_Manager SHALL remove the flashcard from storage and update all related displays

### Requirement 2: Flashcard Data Structure

**User Story:** As a user, I want flashcards to contain all necessary vocabulary information, so that I can study effectively.

#### Acceptance Criteria

1. THE Flashcard_Manager SHALL store Kanji field data for each flashcard
2. THE Flashcard_Manager SHALL store Hiragana/Katakana field data for each flashcard
3. THE Flashcard_Manager SHALL store Meaning field data for each flashcard
4. THE Flashcard_Manager SHALL store Romaji field data for each flashcard
5. THE Flashcard_Manager SHALL store Source field data with options limited to "IRADORI Beginner Level (A1)", "IRADORI Basic Level 1 (A1)", or "IRADORI Basic Level 1 (A2)"
6. THE Flashcard_Manager SHALL store Chapter field data for each flashcard that can contain multiple chapter numbers
7. WHEN a flashcard appears in multiple chapters, THE Flashcard_Manager SHALL store all chapter numbers where the flashcard appears

### Requirement 3: Flashcard Display and Flip Interaction

**User Story:** As a user, I want to see the front of a flashcard and flip it to reveal the answer, so that I can test my knowledge.

#### Acceptance Criteria

1. WHEN a flashcard is displayed, THE Display_Controller SHALL show Kanji and Hiragana/Katakana on the front side
2. WHEN the User presses a displayed flashcard, THE Display_Controller SHALL flip the flashcard to show the back side
3. WHEN the flashcard back side is displayed, THE Display_Controller SHALL show Meaning, Romaji, Source, and Chapter
4. WHEN a flashcard appears in multiple chapters, THE Display_Controller SHALL show all chapter numbers in the Chapter field
5. WHEN the User presses the flipped flashcard, THE Display_Controller SHALL flip the flashcard back to the front side

### Requirement 4: Source-Based Organization

**User Story:** As a user, I want flashcards organized by source textbook, so that I can study vocabulary from specific materials.

#### Acceptance Criteria

1. THE Application SHALL organize flashcards into three source sections: "IRADORI Beginner Level (A1) Vocabulary", "IRADORI Basic Level 1 (A1) Vocabulary", and "IRADORI Basic Level 1 (A2) Vocabulary"
2. WHEN a flashcard is created with a specific Source value, THE Flashcard_Manager SHALL assign the flashcard to the corresponding source section
3. WHEN the User views a source section, THE Display_Controller SHALL display only flashcards assigned to that source
4. THE Application SHALL organize flashcards within each source section by Chapter

### Requirement 5: Script Type Filtering

**User Story:** As a user, I want to filter vocabulary by script type, so that I can focus on Hiragana-only or Kanji-containing words.

#### Acceptance Criteria

1. WHEN the User selects Hiragana-only filter within a source and chapter, THE Filter_Engine SHALL display only flashcards where the Kanji field is empty
2. WHEN the User selects Kanji filter within a source and chapter, THE Filter_Engine SHALL display only flashcards where the Kanji field contains data
3. WHEN the User clears the filter, THE Filter_Engine SHALL display all flashcards in the selected source and chapter

### Requirement 6: Flashcard Shuffling

**User Story:** As a user, I want to randomize flashcard order, so that I can avoid memorizing sequences instead of content.

#### Acceptance Criteria

1. WHEN the User activates shuffle within a source and chapter, THE Shuffle_Engine SHALL randomize the display order of flashcards
2. WHEN the User activates shuffle again, THE Shuffle_Engine SHALL generate a new random order
3. THE Shuffle_Engine SHALL maintain the shuffled order until the User activates shuffle again or navigates away

### Requirement 7: Memory Status Tracking

**User Story:** As a user, I want to mark flashcards as remembered or not remembered, so that I can track which vocabulary I have learned.

#### Acceptance Criteria

1. THE Flashcard_Manager SHALL store Memory_Status for each flashcard with values of "remembered" or "not remembered yet"
2. WHEN the User marks a flashcard as remembered, THE Flashcard_Manager SHALL update the Memory_Status to "remembered"
3. WHEN the User marks a flashcard as not remembered, THE Flashcard_Manager SHALL update the Memory_Status to "not remembered yet"
4. WHEN a flashcard is displayed, THE Display_Controller SHALL indicate the current Memory_Status

### Requirement 8: Self-Testing Feature

**User Story:** As a user, I want to type my own answer to guess the flashcard meaning, so that I can actively test my recall.

#### Acceptance Criteria

1. WHEN the User views a flashcard in a source section, THE Application SHALL provide an input field for typing an answer
2. WHEN the User types an answer and submits it, THE Application SHALL display the correct meaning from the flashcard
3. THE Application SHALL allow the User to compare their typed answer with the correct meaning

### Requirement 9: Progress Tracking for Hiragana/Katakana Vocabulary

**User Story:** As a user, I want to track my progress on Hiragana/Katakana vocabulary, so that I can see how many unique words I have learned.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL count total unique vocabulary using Hiragana/Katakana field value as the unique identifier
2. THE Progress_Tracker SHALL count remembered unique vocabulary using Hiragana/Katakana field value as the unique identifier and Memory_Status equals "remembered"
3. WHEN the User navigates into a specific source section, THE Progress_Tracker SHALL display total count and remembered count for Hiragana/Katakana vocabulary per chapter within that source
4. WHEN the User views the main screen, THE Progress_Tracker SHALL display total count and remembered count for unique Hiragana/Katakana vocabulary across all sources and chapters
5. IF multiple flashcards have identical Hiragana/Katakana field values, THEN THE Progress_Tracker SHALL count them as one unique vocabulary item

### Requirement 10: Progress Tracking for Kanji Vocabulary

**User Story:** As a user, I want to track my progress on Kanji vocabulary, so that I can see how many unique Kanji words I have learned.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL count total unique Kanji vocabulary using Kanji field value as the unique identifier where Kanji field is not empty
2. THE Progress_Tracker SHALL count remembered unique Kanji vocabulary using Kanji field value as the unique identifier where Memory_Status equals "remembered" and Kanji field is not empty
3. WHEN the User navigates into a specific source section, THE Progress_Tracker SHALL display total count and remembered count for Kanji vocabulary per chapter within that source
4. WHEN the User views the main screen, THE Progress_Tracker SHALL display total count and remembered count for unique Kanji vocabulary across all sources and chapters
5. IF multiple flashcards have identical Kanji field values, THEN THE Progress_Tracker SHALL count them as one unique vocabulary item

### Requirement 11: Vocabulary Search

**User Story:** As a user, I want to search for vocabulary, so that I can quickly find specific flashcards.

#### Acceptance Criteria

1. WHEN the User enters a search query, THE Search_Engine SHALL search across Kanji, Hiragana/Katakana, Meaning, and Romaji fields
2. WHEN the User submits a search query, THE Search_Engine SHALL display all flashcards containing the query text in any searchable field
3. WHEN the search query is empty, THE Search_Engine SHALL display all flashcards

### Requirement 12: User Interface Styling

**User Story:** As a user, I want a friendly and easy-to-use interface, so that I can focus on learning without technical difficulties.

#### Acceptance Criteria

1. THE Application SHALL use Tailwind CSS for all styling
2. THE Application SHALL use native JavaScript for structure and logic
3. THE Application SHALL provide a friendly and casual visual design
4. THE Application SHALL provide intuitive navigation and controls

### Requirement 13: Theme Switching

**User Story:** As a user, I want to switch between light mode and dark mode, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Theme_Controller SHALL provide a light mode theme
2. THE Theme_Controller SHALL provide a dark mode theme
3. WHEN the User activates the theme switch, THE Theme_Controller SHALL toggle between light mode and dark mode
4. THE Theme_Controller SHALL persist the User theme preference across sessions

### Requirement 14: Application Footer

**User Story:** As a user, I want to see copyright information, so that I know who created the application.

#### Acceptance Criteria

1. THE Application SHALL display a footer on all pages
2. THE Application SHALL display copyright text "HILKA" in the footer

### Requirement 15: Flashcard View for All Vocabulary per Chapter in Source Section

**User Story:** As a user, I want to view flashcards from all vocabulary in each chapter within a source section, so that I can study all vocabulary from that chapter in one session.

#### Acceptance Criteria

1. WHEN the User navigates into a specific source section, THE Display_Controller SHALL provide access to flashcard view for each chapter within that source
2. WHEN the User selects flashcard view for a specific chapter within a source section, THE Display_Controller SHALL display all flashcards assigned to that chapter
3. WHEN a vocabulary word appears in multiple chapters and the User views a specific chapter, THE Display_Controller SHALL display the flashcard for that chapter only
4. WHEN the User views different chapters containing the same vocabulary word, THE Display_Controller SHALL display the flashcard separately in each chapter view
5. WHEN a flashcard is displayed in chapter view, THE Display_Controller SHALL show Kanji and Hiragana/Katakana on the front side
6. WHEN the User presses a displayed flashcard in chapter view, THE Display_Controller SHALL flip the flashcard to show Meaning, Romaji, Source, and Chapter on the back side
7. WHEN a flashcard is displayed in a specific chapter view, THE Display_Controller SHALL show only that chapter number in the Chapter field on the back side
8. THE Display_Controller SHALL allow the User to navigate between flashcards within the chapter view

### Requirement 16: Guessing Game for All Vocabulary per Chapter in Source Section

**User Story:** As a user, I want to play a guessing game with all vocabulary from each chapter within a source section, so that I can actively test my recall for that chapter.

#### Acceptance Criteria

1. WHEN the User navigates into a specific source section, THE Application SHALL provide access to guessing game for each chapter within that source
2. WHEN the User selects guessing game for a specific chapter within a source section, THE Application SHALL display flashcards from that chapter with an input field for typing answers
3. WHEN a vocabulary word appears in multiple chapters and the User plays the guessing game for a specific chapter, THE Application SHALL display the flashcard for that chapter only
4. WHEN the User plays the guessing game for different chapters containing the same vocabulary word, THE Application SHALL display the flashcard separately in each chapter game
5. WHEN a flashcard is displayed in guessing game mode, THE Display_Controller SHALL show Kanji and Hiragana/Katakana on the front side
6. WHEN the User types an answer in the input field and submits it, THE Application SHALL display the correct Meaning from the flashcard
7. WHEN a flashcard is displayed in a specific chapter guessing game, THE Application SHALL show only that chapter number in the Chapter field when displaying the answer
8. THE Application SHALL allow the User to compare their typed answer with the correct Meaning
9. THE Application SHALL allow the User to navigate to the next flashcard within the chapter

### Requirement 17: Flashcard View for All Vocabulary from All Sources on Main Screen

**User Story:** As a user, I want to view flashcards from all vocabulary across all sources on the main screen, so that I can study vocabulary from all IRADORI textbooks in one session.

#### Acceptance Criteria

1. WHEN the User is on the main screen, THE Display_Controller SHALL provide access to flashcard view for all vocabulary across all sources
2. WHEN the User selects flashcard view on the main screen, THE Display_Controller SHALL display flashcards from all three IRADORI sources: "IRADORI Beginner Level (A1)", "IRADORI Basic Level 1 (A1)", and "IRADORI Basic Level 1 (A2)"
3. WHEN a vocabulary word appears in multiple chapters across sources, THE Display_Controller SHALL deduplicate and display the flashcard only once
4. WHEN a flashcard is displayed in all-sources view, THE Display_Controller SHALL show Kanji and Hiragana/Katakana on the front side
5. WHEN the User presses a displayed flashcard in all-sources view, THE Display_Controller SHALL flip the flashcard to show Meaning, Romaji, Source, and Chapter on the back side
6. WHEN a deduplicated flashcard appears in multiple chapters, THE Display_Controller SHALL show all chapter numbers in the Chapter field on the back side
7. THE Display_Controller SHALL allow the User to navigate between flashcards across all sources

### Requirement 18: Guessing Game for All Vocabulary from All Sources on Main Screen

**User Story:** As a user, I want to play a guessing game with all vocabulary from all sources on the main screen, so that I can actively test my recall across all IRADORI textbooks.

#### Acceptance Criteria

1. WHEN the User is on the main screen, THE Application SHALL provide access to guessing game for all vocabulary across all sources
2. WHEN the User selects guessing game on the main screen, THE Application SHALL display flashcards from all three IRADORI sources with an input field for typing answers
3. WHEN a vocabulary word appears in multiple chapters across sources, THE Application SHALL deduplicate and display the flashcard only once
4. WHEN a flashcard is displayed in all-sources guessing game mode, THE Display_Controller SHALL show Kanji and Hiragana/Katakana on the front side
5. WHEN the User types an answer in the input field and submits it, THE Application SHALL display the correct Meaning from the flashcard
6. WHEN a deduplicated flashcard appears in multiple chapters, THE Application SHALL show all chapter numbers in the Chapter field when displaying the answer
7. THE Application SHALL allow the User to compare their typed answer with the correct Meaning
8. THE Application SHALL allow the User to navigate to the next flashcard across all sources
