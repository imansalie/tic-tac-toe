// Gameboard Module (IIFE)
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return {
        getBoard,
        setMark,
        resetBoard
    };
})();

// Player Factory Function
const Player = (name, mark) => {
    return { name, mark };
};

// Game Controller
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name, "X"),
            Player(player2Name, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.updateStatus(`${players[0].name}'s turn`);
    };

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const playRound = (index) => {
        if (gameOver || !Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
            return;
        }

        // Play sound effect
        playSound("click");

        DisplayController.renderBoard();
        if (checkWin()) {
            gameOver = true;
            DisplayController.updateStatus(`${players[currentPlayerIndex].name} wins!`);
            highlightWinningCells();
            playSound("win");
        } else if (checkTie()) {
            gameOver = true;
            DisplayController.updateStatus("It's a tie!");
        } else {
            switchPlayer();
            DisplayController.updateStatus(`${players[currentPlayerIndex].name}'s turn`);
        }
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] !== "" && board[a] === board[b] && board[a] === board[c];
        });
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    const highlightWinningCells = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (board[a] === board[b] && board[a] === board[c] && board[a] !== "") {
                const cells = document.querySelectorAll('.game-board div');
                cells[a].style.backgroundColor = "#ff00ff";
                cells[b].style.backgroundColor = "#ff00ff";
                cells[c].style.backgroundColor = "#ff00ff";
            }
        });
    };

    const playSound = (type) => {
        let sound;
        if (type === "click") {
            sound = new Audio('sounds/click.mp3');
        } else if (type === "win") {
            sound = new Audio('sounds/win.mp3');
        }
        sound.play();
    };

    return {
        startGame,
        playRound
    };
})();

// Display Controller
const DisplayController = (() => {
    const gameBoardDiv = document.getElementById("gameBoard");
    const gameStatusDiv = document.getElementById("gameStatus");

    const renderBoard = () => {
        gameBoardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.textContent = mark;
            cell.classList.add("cell");
            cell.addEventListener("click", () => {
                GameController.playRound(index);
                cell.classList.add("glow");
            });
            gameBoardDiv.appendChild(cell);
        });
    };

    const updateStatus = (message) => {
        gameStatusDiv.textContent = message;
    };

    return {
        renderBoard,
        updateStatus
    };
})();

// Event listeners for the start and reset buttons
document.getElementById("start-btn").addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value || "Player 1";
    const player2Name = document.getElementById("player2").value || "Player 2";
    GameController.startGame(player1Name, player2Name);
});

document.getElementById("reset-btn").addEventListener("click", () => {
    GameController.startGame("Player 1", "Player 2");
});
