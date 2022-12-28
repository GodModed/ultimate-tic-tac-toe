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
            // set the correct miniboard to active
            game.board.content[tileIndex].active = true;
            console.log(game);
            miniBoard.active = false;
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
export default game;
