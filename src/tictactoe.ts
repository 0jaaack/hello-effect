import "./style.css";

type Player = "O" | "X";
type Cell = Player | null;
type Coordinate = [number, number];
type GameState = {
  players: Player[];
  currentPlayer: Player;
  turn: number;
  board: Cell[][];
};

function startGame() {
  const initialState: GameState = {
    players: ["O", "X"],
    currentPlayer: "O",
    turn: 0,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  nextTurn(initialState);
}

function nextTurn(state: GameState, cleanUp?: () => void) {
  cleanUp?.();
  syncWithState(state);

  const winner = checkWinner(state);

  if (winner != null) {
    endGame(winner);
    return;
  }

  const $board = document.querySelector(".board");

  if ($board == null) {
    return;
  }

  $board.addEventListener("click", function handler(event) {
    if (event.target === event.currentTarget) {
      return;
    }

    const $cell = event.target;

    if (!($cell instanceof HTMLElement)) {
      return;
    }

    const cell = $cell.dataset.cell;

    if (cell == null) {
      return;
    }

    const coordinate = cell.split(",").map(Number) as [number, number];
    const isCellMarked = checkIsCellMarked(state, coordinate);

    if (isCellMarked) {
      return;
    }

    const newState: GameState = {
      ...state,
      turn: state.turn + 1,
      currentPlayer: getNextPlayer(state),
      board: markBoard(state.board, coordinate, state.currentPlayer),
    };

    nextTurn(newState, () => {
      $board.removeEventListener("click", handler);
    });
  });
}

function endGame(winner: Player): void {
  alert(`Game Over, ${winner} wins!`);
}

function checkWinner(state: GameState): Player | null {
  const { board } = state;

  // Check rows
  for (const row of board) {
    if (row.every((cell) => cell === "O")) {
      return "O";
    }

    if (row.every((cell) => cell === "X")) {
      return "X";
    }
  }

  // Check columns
  for (let i = 0; i < board.length; i++) {
    const column = board.map((row) => row[i]);

    if (column.every((cell) => cell === "O")) {
      return "O";
    }

    if (column.every((cell) => cell === "X")) {
      return "X";
    }
  }

  // Check diagonals
  const diagonal1 = [board[0][0], board[1][1], board[2][2]];
  const diagonal2 = [board[0][2], board[1][1], board[2][0]];

  if (diagonal1.every((cell) => cell === "O")) {
    return "O";
  }

  if (diagonal1.every((cell) => cell === "X")) {
    return "X";
  }

  if (diagonal2.every((cell) => cell === "O")) {
    return "O";
  }

  if (diagonal2.every((cell) => cell === "X")) {
    return "X";
  }

  return null;
}

function getNextPlayer(state: GameState): Player {
  const currentPlayerIndex = (state.turn + 1) % state.players.length;
  return state.players[currentPlayerIndex];
}

function checkIsCellMarked(state: GameState, coordinate: Coordinate): boolean {
  return state.board[coordinate[0]][coordinate[1]] != null;
}

function markBoard(
  board: GameState["board"],
  coordinate: Coordinate,
  currentPlayer: Player
): GameState["board"] {
  const [x, y] = coordinate;

  return board.map((row, rowIndex) => {
    if (rowIndex !== x) {
      return row;
    }

    return row.map((cell, cellIndex) => {
      if (cellIndex !== y) {
        return cell;
      }

      return currentPlayer;
    });
  });
}

function syncWithState(state: GameState) {
  const $players = document.querySelectorAll("[data-player]");

  for (const $player of $players) {
    if (!($player instanceof HTMLElement)) {
      continue;
    }

    if ($player.dataset.player === state.currentPlayer) {
      $player.setAttribute("data-current-player", "");
    } else {
      $player.removeAttribute("data-current-player");
    }
  }

  const $cells = document.querySelectorAll("[data-cell]");

  for (const $cell of $cells) {
    if (!($cell instanceof HTMLElement)) {
      continue;
    }

    const coordinate = $cell.dataset.cell;

    if (coordinate == null) {
      continue;
    }

    console.log(coordinate);

    const [x, y] = coordinate.split(",").map(Number) as [number, number];
    const cell = state.board[x][y];

    if (cell == null) {
      continue;
    }

    $cell.dataset.marked = cell;
  }
}

startGame();
