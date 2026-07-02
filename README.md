# Sudoku Game

This is a simple yet engaging web-based Sudoku game designed to provide a classic puzzle experience with modern web technologies. It features two distinct difficulty levels: "Expert Mode" for seasoned players and "Beginner Mode" for those new to Sudoku or looking for a more forgiving experience.

## Features

-   **Two Difficulty Levels:**
    -   **Expert Mode:** Offers a challenging experience with Undo/Redo functionality.
    -   **Beginner Mode:** Provides a more guided experience with mistake tracking and limited hints.
-   **Interactive Gameplay:** Intuitive click-to-select and number-entry mechanics.
-   **Dynamic Highlighting:** Visual cues for selected cells, related rows, columns, and 3x3 boxes, and valid number options.
-   **Dark Mode Toggle:** A user-friendly switch to alternate between light and dark themes for comfortable gameplay in various lighting conditions.
-   **Game Controls:**
    -   **Solve:** Instantly reveals the complete solution to the current puzzle.
    -   **Hint:** Provides assistance by filling in one correct number (limited in Beginner Mode).
    -   **Reset:** Clears all user entries and reverts the puzzle to its initial state.
    -   **New Game:** Generates a fresh Sudoku puzzle.
    -   **Undo/Redo (Expert Mode Only):** Allows players to reverse or reapply their moves, offering flexibility and encouraging experimentation.

## Architecture and Design

This Sudoku game follows a client-side architecture, implemented entirely using front-end web technologies (HTML, CSS, and JavaScript). The design prioritizes a clean, responsive user interface and a clear separation of concerns between structure (HTML), presentation (CSS), and logic (JavaScript).

-   **HTML:** Provides the semantic structure of the game, including the Sudoku grid, number options, and control buttons.
-   **CSS:** Styles the application, ensuring a visually appealing and consistent user experience across different modes and themes. It handles layout, typography, colors, and responsiveness.
-   **JavaScript:** Contains the core game logic, Sudoku generation and solving algorithms, user interaction handling, and dynamic UI updates.

## Core Logic and Algorithms

At the heart of this Sudoku game is a robust **backtracking algorithm** implemented in JavaScript. This algorithm is responsible for:

1.  **Puzzle Generation:** While the puzzles are pre-defined in this version, the underlying `solveSudoku` function is capable of generating valid Sudoku solutions, which are then used to create the solvable puzzles.
2.  **Solution Verification:** The `isValid` function is crucial for ensuring that any number placed on the board adheres to Sudoku rules (no repetition in row, column, or 3x3 box).
3.  **Hint System:** The `giveHint` function leverages the pre-calculated solution to provide correct numbers to the player.
4.  **Solve Functionality:** The `showSolution` function directly displays the complete, solved grid.

## Key JavaScript Functions

The game's functionality is driven by a set of well-defined JavaScript functions, categorized by their primary responsibilities:

### Initialization and Setup

-   `initializeGame()`: The entry point for game setup, calling functions to create UI elements and start a new game.
-   `createOptions()`: Dynamically generates the number selection buttons (1-9) below the Sudoku board.
-   `createGrid()`: Constructs the 9x9 Sudoku game board as a grid of interactive tiles.
-   `createSolutionGrid()`: Builds a hidden 9x9 grid used internally to display the solved puzzle.

### Game Flow and State Management

-   `startNewGame()`: Resets game state, selects a new puzzle from `questions`, populates `game.grid` and `game.solution`, and renders the initial board.
-   `fillGrid()`: Renders the current state of `game.grid` onto the HTML board, updating tile inner text and removing hint highlights.
-   `resetGame()`: Resets the current puzzle to its initial problem state, clearing user entries and game statistics.

### User Interaction Handlers

-   `handleOptionClick(event)`: Triggered when a user clicks a number option. In Expert Mode, it updates the selected tile and manages undo/redo stacks. In Beginner Mode, it also checks for correctness and updates mistake count.
-   `handleTileClick(event)`: Activated when a user clicks a Sudoku tile. It manages tile selection, applies highlighting, and determines if the tile is editable.

### Game Mechanics and Assistance

-   `giveHint()`: Fills a random empty cell with its correct solution value, increments `hintsUsed`, and applies a `hint-tile` class. (Limited to 3 hints in Beginner Mode).
-   `showSolution()`: Makes the `solutionBoard` visible and populates it with the solved puzzle from `game.solution`.

### UI Updates and Visual Feedback

-   `highlightSameNumbers(tile)`: Adds a `highlight` class to all tiles containing the same number as the clicked tile.
-   `highlightRowColBox(tile)`: Highlights the entire row, column, and 3x3 box associated with the selected tile.
-   `highlightRequiredOptions(tile)`: (Potentially) Highlights number options that are valid for the currently selected tile based on Sudoku rules.
-   `clearHighlights()`: Removes all `highlight` and `highlightCurCell` classes from the board.
-   `checkCompletion()`: Iterates through the `game.grid` to determine if the puzzle is fully solved and alerts the user upon completion.

### Sudoku Solver (Backtracking Algorithm)

-   `solveSudoku(board)`: The core recursive backtracking function that attempts to fill the Sudoku board. It finds an empty spot, tries numbers 1-9, and recursively calls itself. If a number leads to a solution, it returns true; otherwise, it backtracks.
-   `findEmptySpot(board)`: A helper function for `solveSudoku` that returns the `[row, col]` of the next empty cell (containing 0) on the board.
-   `isValid(board, row, col, num)`: A crucial helper function that checks if placing `num` at `[row, col]` is valid according to Sudoku rules (row, column, and 3x3 box constraints).

### Expert Mode Specific Functions (`good.js`)

-   `game.undoStack`, `game.redoStack`: Arrays used to store previous game states for undo/redo functionality.
-   `undo()`: Pops the last move from `undoStack`, applies the previous value to the tile, and pushes the current state to `redoStack`.
-   `redo()`: Pops the last undone move from `redoStack`, applies the value, and pushes the current state to `undoStack`.
-   `updateUndoRedoButtons()`: Manages the `disabled` state of the Undo and Redo buttons based on the contents of their respective stacks.

### Beginner Mode Specific Functions (`new.js`)

-   `game.mistakes`: A counter that tracks the number of incorrect entries made by the player.
-   `updateMistakesDisplay()`: Updates the `Mistakes: X/3` text on the UI.
-   `handleGameOver()`: Triggered when the player exceeds 3 mistakes, prompting them to either continue the current game or start a new one.

## Technologies Used

This Sudoku game is primarily built using standard web technologies:

-   **HTML5:** For structuring the content and defining the game layout.
-   **CSS3:** For styling the game, including responsive design and dark mode.
-   **JavaScript (ES6+):** For all interactive logic, game mechanics, and the Sudoku solving algorithm.

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Sudoku
    ```
3.  **Open `index.html`:** Simply open the `index.html` file in your preferred web browser. No server setup is required.

Enjoy playing Sudoku!
