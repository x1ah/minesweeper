export enum CellState {
  HIDDEN,
  REVEALED,
  FLAGGED,
  QUESTION
}

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  state: CellState;
  neighborMines: number;
}

export enum GameStatus {
  IDLE,
  PLAYING,
  WON,
  LOST
}

export enum DifficultyLevel {
  BEGINNER = '初级',
  INTERMEDIATE = '中级',
  EXPERT = '高级',
  CUSTOM = '自定义' // Reserved for future
}

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface GameRecord {
  id: string;
  result: '胜利' | '失败';
  time: number;
  difficulty: string;
  date: string;
}

export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  [DifficultyLevel.BEGINNER]: { rows: 9, cols: 9, mines: 10 },
  [DifficultyLevel.INTERMEDIATE]: { rows: 16, cols: 16, mines: 40 },
  [DifficultyLevel.EXPERT]: { rows: 16, cols: 30, mines: 99 },
  [DifficultyLevel.CUSTOM]: { rows: 9, cols: 9, mines: 10 },
};