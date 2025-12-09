import { CellData, CellState, DifficultyConfig } from '../types';

// Directions for neighbor checking (N, NE, E, SE, S, SW, W, NW)
const DIRECTIONS = [
  [-1, 0], [-1, 1], [0, 1], [1, 1],
  [1, 0], [1, -1], [0, -1], [-1, -1]
];

export const createEmptyBoard = (rows: number, cols: number): CellData[][] => {
  const board: CellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        state: CellState.HIDDEN,
        neighborMines: 0,
      });
    }
    board.push(row);
  }
  return board;
};

export const initializeBoard = (
  rows: number,
  cols: number,
  mines: number,
  firstClickRow: number,
  firstClickCol: number
): CellData[][] => {
  const board = createEmptyBoard(rows, cols);
  let minesPlaced = 0;

  // Create a pool of available coordinates, excluding the first click and its neighbors
  // This guarantees the first click is always a "0" (safe opening)
  const safeZone = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = firstClickRow + dr;
      const c = firstClickCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`);
      }
    }
  }

  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const key = `${r},${c}`;

    if (!board[r][c].isMine && !safeZone.has(key)) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        DIRECTIONS.forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
            count++;
          }
        });
        board[r][c].neighborMines = count;
      }
    }
  }

  return board;
};

export const revealCell = (board: CellData[][], row: number, col: number): { newBoard: CellData[][], exploded: boolean } => {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const cell = newBoard[row][col];

  if (cell.state !== CellState.HIDDEN && cell.state !== CellState.QUESTION) {
    return { newBoard, exploded: false };
  }

  if (cell.isMine) {
    cell.state = CellState.REVEALED;
    return { newBoard, exploded: true };
  }

  // Flood fill
  const stack = [[row, col]];
  
  while (stack.length > 0) {
    const [currR, currC] = stack.pop()!;
    const currCell = newBoard[currR][currC];

    if (currCell.state === CellState.REVEALED || currCell.state === CellState.FLAGGED) {
      continue;
    }

    currCell.state = CellState.REVEALED;

    if (currCell.neighborMines === 0) {
      DIRECTIONS.forEach(([dr, dc]) => {
        const nr = currR + dr;
        const nc = currC + dc;
        if (nr >= 0 && nr < newBoard.length && nc >= 0 && nc < newBoard[0].length) {
          const neighbor = newBoard[nr][nc];
          if (neighbor.state === CellState.HIDDEN) {
             stack.push([nr, nc]);
          }
        }
      });
    }
  }

  return { newBoard, exploded: false };
};

export const toggleFlag = (board: CellData[][], row: number, col: number): CellData[][] => {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const cell = newBoard[row][col];

  if (cell.state === CellState.HIDDEN) {
    cell.state = CellState.FLAGGED;
  } else if (cell.state === CellState.FLAGGED) {
    cell.state = CellState.HIDDEN; // Optionally toggle to QUESTION, but usually straight back to HIDDEN is standard
  }

  return newBoard;
};

// Reveal all mines on game over
export const revealAllMines = (board: CellData[][]): CellData[][] => {
  return board.map(row => row.map(cell => {
    if (cell.isMine) {
      return { ...cell, state: CellState.REVEALED };
    }
    return cell;
  }));
};

// Check for win
export const checkWin = (board: CellData[][]): boolean => {
  for (const row of board) {
    for (const cell of row) {
      // If a non-mine cell is still hidden or flagged, game not won
      if (!cell.isMine && cell.state !== CellState.REVEALED) {
        return false;
      }
    }
  }
  return true;
};
