export const BOMB = '💣'
export const FLAG = '🚩'

export const EASY_FIELDS_WIDTH = 8
export const EASY_BOMB_AMOUNT = 10

export const MEDIUM_FIELDS_WIDTH = 12
export const MEDIUM_BOMB_AMOUNT = 40

export const HARD_FIELDS_WIDTH = 20
export const HARD_BOMB_AMOUNT = 60

export enum Level {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum GameOverStatus {
  NONE = 'none',
  WIN = 'win',
  LOSE = 'lose',
}
