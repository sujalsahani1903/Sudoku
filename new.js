// =================================================================================
// Sudoku Game (Beginner Mode)
// =================================================================================

// ---------------------------------------------------------------------------------
// DOM Elements
// ---------------------------------------------------------------------------------
const optionsContainer = document.getElementById("options");
const board = document.getElementById("board");
const solutionBoard = document.getElementById("solution-board");
const mistakesDisplay = document.getElementById("chances");
const resetButton = document.getElementById("reset");
const newGameButton = document.getElementById("newGame");
const hintButton = document.getElementById("hint");
const solveButton = document.getElementById("solve");

// ---------------------------------------------------------------------------------
// Game State
// ---------------------------------------------------------------------------------
let game = {
    grid: [],
    problem: "",
    solution: [],
    mistakes: 0,
    selectedTile: null,
    hintsUsed: 0,
    hintedTiles: [],
};

// ---------------------------------------------------------------------------------
// Sudoku Puzzles
// ---------------------------------------------------------------------------------
const questions = [
    "  3 2 6  9  3 5  1  18 64    81 29  7       8  67 82    26 95  8  2 3  9  5 1 3  ",
    "2   8 3   6  7  84 3 5  2 9   1 54 8         4 27 6   3 1  7 4 72  4  6   4 1   3",
    "      9 7   42 18    7 5 261  9 4    5     4    5 7  992 1 8    34 59   5 7      ",
    " 3  5  4   8 1 5  46     12 7 5 2 8    6 3    4 1 9 3 25     98  1 2 6   8  6  2 ",
    " 2 81 74 7    31   9   28 5  9 4  874  2 8  316  3 2  3 27   6   56    8 76 51 9 ",
    "1  92    524 1           7  5   81 2         4 27   9  6           3 945    71  6",
    " 43 8 25 6             1 949    4 7    6 8    1 2    382 5             5 34 9 71 ",
    "48   69 2  2  8  19  37  6 84  1 2    37 41    1 6  49 2  85  77  9  6  6 92   18",
    "   9    2 5 1234   3    16 9 8       7     9       2 5 91    5   7439 2 4    7   ",
    "  19    39  7  16  3   5  7 5      9  43 26  2      7 6  1   3  42  7  65    68  ",
    "   1254    84     42 8      3     95 6 9 2 1 51     6      3 49     72    1298   ",
    " 6234 75 1    56  57     4     948  4       6  583     3     91  64    7 59 8326 ",
    "3          5  9   2  5 4    2    7  16     587 431 6     89 1      67 8      5437",
    "63          5    8  5674       2      34 1 2       345     7  4 8 3  9 29471   8 ",
    "    2  4   8 35       7 6 2 31 4697 2           5 12 3 49   73        1 8    4   ",
    "361 259   8 96  1 4      57  8   471   6 3   259   8  74      5 2  18 6   547 329",
    " 5 8 7 2 6   1  9 7 254   6 7  2 3 15 4   9 81 3 8  7 9   762 5 6  9   3 8 1 3 4 ",
    " 8   5        3457    7 8 9 6 4  9 3  7 1 5  4 8  7 2 9 1 2    8423        1   8 ",
    "  35 29      4    1 6   3 59  251  8 7 4 8 3 8  763  13 8   1 4    2      51 48  ",
    "           98 51   519 742 29 4 1 65         14 5 8 93 267 958   51 36           ",
    " 2  3  9    9 7   9  2 8  5  48 65  6 7   2 8  31 29  8  6 5  7   3 9    3  2  5 ",
    "  5     6 7   9 2    5  1 78 415       8 3       928 59 7  6    3 4   1 2     6  ",
    " 4     5   19436    9   3  6   5   21 3   5 68   2   7  5   2    24367   3     4 ",
    "  4          3   239 7   8 4    9  12 98 13 76  2    8 1   8 539   4          8  ",
    "36  2  89   361            8 3   6 24  6 3  76 7   1 8            418   97  3  14"
];

// =================================================================================
// Initialization
// =================================================================================

function initializeGame() {
    createOptions();
    createGrid();
    createSolutionGrid();
    startNewGame();
}

function createOptions() {
    for (let i = 0; i < 9; i++) {
        let element = document.createElement("div");
        element.classList.add("option");
        element.innerText = i + 1;
        element.addEventListener("click", handleOptionClick);
        optionsContainer.append(element);
    }
}

function createGrid() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.createElement("div");
            tile.id = `${i}-${j}`;
            tile.classList.add("tile");
            if ((j + 1) % 3 === 0 && j < 8) tile.classList.add("border-right");
            if ((i + 1) % 3 === 0 && i < 8) tile.classList.add("border-bottom");
            tile.addEventListener("click", handleTileClick);
            board.append(tile);
        }
    }
}

function createSolutionGrid() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.createElement("div");
            tile.id = `sol-${i}-${j}`;
            tile.classList.add("tile");
            if ((j + 1) % 3 === 0 && j < 8) tile.classList.add("border-right");
            if ((i + 1) % 3 === 0 && i < 8) tile.classList.add("border-bottom");
            solutionBoard.append(tile);
        }
    }
}

// =================================================================================
// Game Flow
// =================================================================================

function startNewGame() {
    clearHighlights();
    game.mistakes = 0;
    game.hintsUsed = 0;
    game.hintedTiles = [];
    updateMistakesDisplay();
    hintButton.disabled = false;
    solutionBoard.classList.add("hidden");

    let randomIndex = Math.floor(questions.length * Math.random());
    game.problem = questions[randomIndex];
    game.grid = [];
    game.solution = [];

    for (let i = 0; i < 9; i++) {
        game.grid.push([]);
        game.solution.push([]);
        for (let j = 0; j < 9; j++) {
            const char = game.problem[i * 9 + j];
            const value = (char === ' ') ? 0 : parseInt(char);
            game.grid[i][j] = value;
            game.solution[i][j] = value;
        }
    }

    solveSudoku(game.solution);
    fillGrid();
}

function fillGrid() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const tile = document.getElementById(`${i}-${j}`);
            if (tile) {
                tile.classList.remove("hint-tile");
                const value = game.grid[i][j];
                tile.innerText = (value === 0) ? "" : value;
            }
        }
    }
}

function resetGame() {
    clearHighlights();
    game.mistakes = 0;
    game.hintsUsed = 0;
    game.hintedTiles = [];
    updateMistakesDisplay();
    hintButton.disabled = false;
    solutionBoard.classList.add("hidden");

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const char = game.problem[i * 9 + j];
            const value = (char === ' ') ? 0 : parseInt(char);
            game.grid[i][j] = value;
        }
    }
    fillGrid();
}

// =================================================================================
// Event Handlers
// =================================================================================

function handleOptionClick(event) {
    if (!game.selectedTile) return;

    const selectedNumber = parseInt(event.target.innerText);
    const [row, col] = game.selectedTile.id.split('-').map(Number);

    if (selectedNumber === game.solution[row][col]) {
        game.selectedTile.innerText = selectedNumber;
        game.grid[row][col] = selectedNumber;
        checkCompletion();
    } else {
        game.mistakes++;
        updateMistakesDisplay();
        if (game.mistakes >= 4) {
            handleGameOver();
        }
    }
}

function handleTileClick(event) {
    clearHighlights();
    const clickedTile = event.target;
    const [row, col] = clickedTile.id.split('-').map(Number);

    if (clickedTile.innerText !== "") {
        highlightSameNumbers(clickedTile);
    }

    if (game.problem[row * 9 + col] !== ' ' || game.hintedTiles.some(h => h.row === row && h.col === col)) {
        game.selectedTile = null;
        return;
    }

    game.selectedTile = clickedTile;
    clickedTile.classList.add("highlightCurCell");
    highlightRowColBox(clickedTile);
    highlightRequiredOptions(clickedTile);
}

// =================================================================================
// Hint and Solve Logic
// =================================================================================

function giveHint() {
    if (game.hintsUsed >= 3) return;

    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (game.grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const solutionValue = game.solution[row][col];

    const tile = document.getElementById(`${row}-${col}`);
    tile.innerText = solutionValue;
    tile.classList.add("hint-tile");

    game.grid[row][col] = solutionValue;
    game.hintedTiles.push({ row, col });
    game.hintsUsed++;

    if (game.hintsUsed >= 3) {
        hintButton.disabled = true;
    }

    checkCompletion();
}

function showSolution() {
    solutionBoard.classList.remove("hidden");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const tile = document.getElementById(`sol-${i}-${j}`);
            tile.innerText = game.solution[i][j];
        }
    }
}

// =================================================================================
// UI Updates
// =================================================================================

function updateMistakesDisplay() {
    mistakesDisplay.innerText = `Mistakes: ${game.mistakes}/3`;
}

function highlightSameNumbers(tile) {
    const tiles = document.getElementsByClassName("tile");
    for (let t of tiles) {
        if (t.innerText === tile.innerText && t.innerText !== "") {
            t.classList.add("highlight");
        }
    }
}

function highlightRowColBox(tile) {
    const [row, col] = tile.id.split('-').map(Number);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 9; i++) {
        document.getElementById(`${i}-${col}`).classList.add("highlight");
        document.getElementById(`${row}-${i}`).classList.add("highlight");
        const boxTile = document.getElementById(`${startRow + Math.floor(i / 3)}-${startCol + (i % 3)}`);
        boxTile.classList.add("highlight");
    }
}

function highlightRequiredOptions(tile) {
    const [row, col] = tile.id.split('-').map(Number);
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < 9; i++) {
        if (isValid(game.grid, row, col, i + 1)) {
            options[i].classList.add("highlight");
        }
    }
}

function clearHighlights() {
    const elements = document.querySelectorAll(".highlight, .highlightCurCell");
    elements.forEach(el => el.classList.remove("highlight", "highlightCurCell"));
}

// =================================================================================
// Game Logic
// =================================================================================

function checkCompletion() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (game.grid[i][j] === 0) return;
        }
    }
    alert("Congratulations! You have completed the game.\nPlease click on New Game to play again.");
}

function handleGameOver() {
    const choice = prompt("You have made 4 mistakes. Press '1' to continue the same game or '2' for a new game.");
    if (choice === '1') {
        resetGame();
    } else {
        startNewGame();
    }
}

// =================================================================================
// Sudoku Solver (Backtracking Algorithm)
// =================================================================================

function solveSudoku(board) {
    const emptySpot = findEmptySpot(board);
    if (!emptySpot) return true;
    const [row, col] = emptySpot;
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function findEmptySpot(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) return [row, col];
        }
    }
    return null;
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

// =================================================================================
// Event Listeners
// =================================================================================

resetButton.addEventListener("click", resetGame);
newGameButton.addEventListener("click", startNewGame);
hintButton.addEventListener("click", giveHint);
solveButton.addEventListener("click", showSolution);

// =================================================================================
// Start the Game
// =================================================================================

initializeGame();
