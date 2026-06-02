import prompt from "prompt";

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// X = AI
// O = Human

function renderBoard() {
  console.clear();

  let cellNumber = 1;

  for (let i = 0; i < 3; i++) {
    let row = "";

    for (let j = 0; j < 3; j++) {
      row += board[i][j] || " ";

      if (j < 2) {
        row += " | ";
      }

      cellNumber++;
    }

    console.log(row);

    if (i < 2) {
      console.log("---------");
    }
  }

  console.log();
}

function checkWinner(board) {
  // Rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return board[i][0];
    }
  }

  // Columns
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] &&
      board[0][j] === board[1][j] &&
      board[1][j] === board[2][j]
    ) {
      return board[0][j];
    }
  }

  // Main diagonal
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }

  // Anti-diagonal
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }

  return null;
}

function isBoardFull(board) {
  for (let row of board) {
    for (let cell of row) {
      if (cell === "") {
        return false;
      }
    }
  }

  return true;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);

  if (winner === "X") return 10 - depth;
  if (winner === "O") return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = "X";

          const score = minimax(board, depth + 1, false);

          board[i][j] = "";

          bestScore = Math.max(bestScore, score);
        }
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        board[i][j] = "O";

        const score = minimax(board, depth + 1, true);

        board[i][j] = "";

        bestScore = Math.min(bestScore, score);
      }
    }
  }

  return bestScore;
}

async function startGame() {
  prompt.start();

  renderBoard();

  while (true) {
    const { move } = await prompt.get(["move"]);

    const position = Number(move);

    if (position < 1 || position > 9 || Number.isNaN(position)) {
      console.log("Choose a number between 1 and 9");
      continue;
    }

    const row = Math.floor((position - 1) / 3);
    const col = (position - 1) % 3;

    if (board[row][col] !== "") {
      console.log("Cell already occupied");
      continue;
    }

    // Human move
    board[row][col] = "O";

    renderBoard();

    if (checkWinner(board) === "O") {
      console.log("You win!");
      return;
    }

    if (isBoardFull(board)) {
      console.log("Draw!");
      return;
    }

    // AI move
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = "X";

          const score = minimax(board, 0, false);

          board[i][j] = "";

          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }

    board[bestMove.row][bestMove.col] = "X";

    renderBoard();

    if (checkWinner(board) === "X") {
      console.log("AI wins!");
      return;
    }

    if (isBoardFull(board)) {
      console.log("Draw!");
      return;
    }
  }
}

startGame();
