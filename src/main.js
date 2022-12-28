import JSConfetti from 'js-confetti';
import { cloneDeep } from "lodash";
const confetti = new JSConfetti();
;
;
;
const game = {
    board: {
        content: [],
    },
    turn: "X",
    turnCount: 0,
};
// clone the template and append it to the board
const cloneTemplate = (template, parent) => {
    const clone = template.content.cloneNode(true);
    parent.appendChild(clone);
    return clone;
};
for (let i = 0; i < 9; i++) {
    cloneTemplate(document.querySelector("template"), document.querySelector("#board"));
}
// fill game board
const fillBoard = () => {
    const miniBoard = {
        content: [],
        winner: "",
        active: false,
    };
    const tile = {
        content: "",
    };
    // this creates a 9x9 board
    // make it create a 3x3 board
    for (let i = 0; i < 9; i++) {
        // add to miniBoard
        miniBoard.content = [...miniBoard.content, cloneDeep(tile)];
    }
    for (let i = 0; i < 9; i++) {
        // add to board
        game.board.content = [...game.board.content, cloneDeep(miniBoard)];
    }
};
fillBoard();
// add click events to each tile
const tiles = document.querySelectorAll(".item");
tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => {
        // get the miniboard its in
        const miniBoardIndex = Math.floor(index / 9);
        const miniBoard = game.board.content[miniBoardIndex];
        // get the tile its in
        const tileIndex = index % 9;
        const tileContent = miniBoard.content[tileIndex];
        // check if the tile is empty
        if (!(game.turnCount == 0 || miniBoard.active))
            return console.log("not active");
        if (tileContent.content === "") {
            console.log("turn: " + game.turn);
            tileContent.content = game.turn;
            tile.innerHTML = game.turn;
            game.turnCount++;
            game.turn = game.turn === "X" ? "O" : "X";
            document.querySelector("#turn").innerHTML = game.turn + " turn";
            // set the correct miniboard to active
            const miniBoardElement = document.querySelectorAll(".miniboard")[miniBoardIndex];
            // set all boards active state to false
            game.board.content.forEach((board, index) => {
                board.active = false;
                // remove active class from all miniboards
                document.querySelectorAll(".miniboard")[index].classList.remove("active");
            });
            miniBoardElement.classList.remove("active");
            game.board.content[tileIndex].active = true;
            if (game.board.content[tileIndex].winner) {
                // set all boards to active
                game.board.content.forEach((board, index) => {
                    board.active = true;
                    // add active class to all miniboards
                    document.querySelectorAll(".miniboard")[index].classList.add("active");
                });
            }
            document.querySelectorAll(".miniboard")[tileIndex].classList.add("active");
            checkMiniBoardWinner(miniBoard, miniBoardElement, miniBoardIndex);
            if (checkMiniBoardDraw(miniBoard)) {
                miniBoardElement.classList.add("fade-out");
                setTimeout(() => {
                    // clear the miniboard
                    miniBoardElement.innerHTML = "";
                    // add the tiles back
                    for (let i = 0; i < 9; i++) {
                        const tile = document.createElement("div");
                        tile.classList.add("tile");
                        miniBoardElement.appendChild(tile);
                    }
                    // clear the tiles in the miniboard
                    miniBoard.content = [];
                    for (let i = 0; i < 9; i++) {
                        miniBoard.content = [...miniBoard.content, cloneDeep({ content: "" })];
                    }
                    miniBoardElement.classList.remove("fade-out");
                }, 1000);
            }
            // check if the miniboard has a winner
        }
    });
});
/*
    0 1 2
    3 4 5
    6 7 8
*/
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const checkMiniBoardWinner = (miniBoard, miniBoardElement, index) => {
    let winner = "";
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        const tileA = miniBoard.content[a];
        const tileB = miniBoard.content[b];
        const tileC = miniBoard.content[c];
        if (tileA.content !== "" && tileA.content === tileB.content && tileA.content === tileC.content) {
            winner = tileA.content;
        }
    }
    if (winner !== "") {
        game.board.content[index].winner = winner;
        // check if the minigrid is selected
        if (miniBoard.active) {
            // set all boards to active
            game.board.content.forEach((board, index) => {
                board.active = true;
                // add active class to all miniboards
                document.querySelectorAll(".miniboard")[index].classList.add("active");
            });
        }
        document.querySelector("#turn").innerHTML = winner + " wins board # " + (index + 1) + "!";
        setTimeout(() => {
            document.querySelector("#turn").innerHTML = game.turn + " turn";
        }, 500);
        if (checkBoardWinner(game.board) !== "") {
            // add confetti
            confetti.addConfetti();
            setTimeout(() => {
                document.querySelector("#turn").innerHTML = winner + " wins the game!";
            }, 600);
            setTimeout(() => {
                window.location.reload();
            }, 10000);
        }
        confetti.addConfetti();
        // fade out the miniboard
        miniBoardElement.classList.add("fade-out");
        setTimeout(() => {
            miniBoardElement.innerHTML = winner;
            miniBoardElement.classList.remove("fade-out");
            miniBoardElement.classList.add("center-text");
        }, 1000);
        return winner;
    }
    return "";
};
function checkMiniBoardDraw(miniBoard) {
    return miniBoard.content.every(tile => tile.content !== "");
}
function checkBoardWinner(board) {
    let winner = "";
    let newArray = [];
    for (let i = 0; i < 9; i++) {
        newArray = [...newArray, board.content[i].winner];
    }
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        const tileA = newArray[a];
        const tileB = newArray[b];
        const tileC = newArray[c];
        if (tileA !== "" && tileA === tileB && tileA === tileC) {
            winner = tileA;
        }
    }
    console.log(newArray);
    return winner;
}
export default game;
