import {
  BOMB,
  EASY_BOMB_AMOUNT,
  EASY_FIELDS_WIDTH,
  FLAG,
  GameOverStatus,
  HARD_BOMB_AMOUNT,
  HARD_FIELDS_WIDTH,
  Level,
  MEDIUM_BOMB_AMOUNT,
  MEDIUM_FIELDS_WIDTH,
} from './constants'
import { randomId, randomNumber } from './utils'

type Field = {
  id: string
  index: number
  value: string
  dangerLevel?: number
  opened?: boolean
  flagged?: boolean
}

const levelBombAmountMap: Record<Level, number> = {
  [Level.EASY]: EASY_BOMB_AMOUNT,
  [Level.MEDIUM]: MEDIUM_BOMB_AMOUNT,
  [Level.HARD]: HARD_BOMB_AMOUNT,
}

const levelFieldsWidthMap: Record<Level, number> = {
  [Level.EASY]: EASY_FIELDS_WIDTH,
  [Level.MEDIUM]: MEDIUM_FIELDS_WIDTH,
  [Level.HARD]: HARD_FIELDS_WIDTH,
}

const gameOverStatusMap: Record<GameOverStatus, string> = {
  [GameOverStatus.NONE]: '',
  [GameOverStatus.WIN]: 'You Win!',
  [GameOverStatus.LOSE]: 'You Lose!',
}

const getAroundFieldsIndexes = (
  fieldIndex: number,
  fieldsWidth: number = EASY_FIELDS_WIDTH,
): number[] => {
  let aroundFieldsIndexes: number[]

  const fieldsAmount = fieldsWidth * fieldsWidth
  const isLeftCorner = fieldIndex % fieldsWidth === 0
  const isRightCorner = fieldIndex % fieldsWidth === fieldsWidth - 1
  const isAtFirstLine = fieldIndex < fieldsWidth - 1
  const isAtLastLine = fieldIndex >= fieldsAmount - fieldsWidth
  const nextFieldIndex = fieldIndex + 1
  const previousFieldIndex = fieldIndex - 1

  if (isAtFirstLine && isLeftCorner) {
    aroundFieldsIndexes = [
      fieldIndex + fieldsWidth,
      fieldIndex + fieldsWidth + 1,
      nextFieldIndex,
    ]
  } else if (isAtFirstLine && isRightCorner) {
    aroundFieldsIndexes = [
      previousFieldIndex,
      previousFieldIndex + fieldsWidth,
      fieldIndex + fieldsWidth,
    ]
  } else if (isAtLastLine && isLeftCorner) {
    aroundFieldsIndexes = [
      nextFieldIndex,
      nextFieldIndex - fieldsWidth,
      fieldIndex - fieldsWidth,
    ]
  } else if (isAtLastLine && isRightCorner) {
    aroundFieldsIndexes = [
      previousFieldIndex,
      previousFieldIndex - fieldsWidth,
      fieldIndex - fieldsWidth,
    ]
  } else if (isLeftCorner) {
    aroundFieldsIndexes = [
      fieldIndex - fieldsWidth,
      nextFieldIndex - fieldsWidth,
      nextFieldIndex,
      nextFieldIndex + fieldsWidth,
      fieldIndex + fieldsWidth,
    ]
  } else if (isRightCorner) {
    aroundFieldsIndexes = [
      fieldIndex - fieldsWidth,
      previousFieldIndex - fieldsWidth,
      previousFieldIndex,
      previousFieldIndex + fieldsWidth,
      fieldIndex + fieldsWidth,
    ]
  } else {
    aroundFieldsIndexes = [
      fieldIndex - fieldsWidth,
      nextFieldIndex - fieldsWidth,
      nextFieldIndex,
      nextFieldIndex + fieldsWidth,
      fieldIndex + fieldsWidth,
      previousFieldIndex + fieldsWidth,
      previousFieldIndex,
      previousFieldIndex - fieldsWidth,
    ]
  }

  return aroundFieldsIndexes.filter((i) => i >= 0 && i < fieldsAmount)
}

const createFieldsArray = (
  bombAmount: number = EASY_BOMB_AMOUNT,
  fieldsWidth: number = EASY_FIELDS_WIDTH,
): Field[] => {
  const fieldsAmount = fieldsWidth * fieldsWidth
  const fieldsArray = Array(fieldsAmount)
    .fill('')
    .map<Field>((_, index) => ({
      id: randomId(),
      index,
      value: '',
    }))

  const bombsIndexes = new Set<number>()
  while (bombsIndexes.size !== bombAmount) {
    bombsIndexes.add(randomNumber(fieldsAmount - 1))
  }

  bombsIndexes.forEach((index) => {
    fieldsArray[index].value = BOMB
  })

  let nearBombsCount = 0
  for (let i = 0; i < fieldsArray.length; i++) {
    if (fieldsArray[i].value === BOMB) continue

    getAroundFieldsIndexes(i, fieldsWidth).forEach((aroundIndex) => {
      if (fieldsArray[aroundIndex].value === BOMB) {
        nearBombsCount++
      }
    })
    fieldsArray[i].dangerLevel = Number(nearBombsCount)
    nearBombsCount = 0
  }

  return fieldsArray
}

const revealNearestFields = (
  fieldIndex: number,
  fieldsWidth: number = EASY_FIELDS_WIDTH,
  fields: Field[],
) => {
  const aroundFieldsIndexes = getAroundFieldsIndexes(fieldIndex, fieldsWidth)

  aroundFieldsIndexes.forEach((aroundIndex) => {
    setTimeout(() => {
      document.getElementById(fields[aroundIndex].id)?.click()
    }, 10)
  })
}

const game = () => ({
  init() {
    this.startEasyLevelGame()
  },
  level: Level.EASY,
  bombAmount: EASY_BOMB_AMOUNT,
  gameOverStatus: GameOverStatus.NONE,
  fields: [] as Field[],
  flaggedFields: [] as Field[],
  secondsPlayed: 0,
  counterInterval: 0,
  get gameOver() {
    return this.gameOverStatus !== GameOverStatus.NONE
  },
  get gameOverStatusText() {
    return gameOverStatusMap[this.gameOverStatus]
  },
  get flagsLeft() {
    return this.bombAmount - this.flaggedFields.length
  },
  get timeElapsed() {
    const seconds = this.secondsPlayed % 60
    const minutes = Math.floor(this.secondsPlayed / 60)
    const secondsString = seconds.toString().padStart(2, '0')
    const minutesString = minutes.toString().padStart(2, '0')

    return `${minutesString}:${secondsString}`
  },
  fieldText(field: Field) {
    if (this.gameOver && field.value === BOMB) return field.value

    if (field.flagged) return FLAG

    return field.opened ? field.dangerLevel || '' : ''
  },
  startEasyLevelGame() {
    this.startNewGame(Level.EASY)
  },
  startMediumLevelGame() {
    this.startNewGame(Level.MEDIUM)
  },
  startHardLevelGame() {
    this.startNewGame(Level.HARD)
  },
  startNewGame(level: Level) {
    const bombAmount = levelBombAmountMap[level]
    const fieldsWidth = levelFieldsWidthMap[level]

    this.stopTimer()
    this.secondsPlayed = 0
    this.level = level
    this.bombAmount = bombAmount
    this.gameOverStatus = GameOverStatus.NONE
    this.flaggedFields = []
    this.fields = createFieldsArray(bombAmount, fieldsWidth)
  },
  handleFieldClick(field: Field) {
    if (this.gameOver || field.opened || field.flagged) return

    if (!this.counterInterval) {
      this.initTimer()
    }

    if (field.value === BOMB) {
      this.gameOverStatus = GameOverStatus.LOSE
      this.stopTimer()
      return
    }
    field.opened = true

    if (!field.dangerLevel) {
      revealNearestFields(
        field.index,
        levelFieldsWidthMap[this.level],
        this.fields,
      )
    }
  },
  handleFieldLeftClick(field: Field) {
    if (this.gameOver || field.opened) return

    if (!this.counterInterval) {
      this.initTimer()
    }

    if (field.flagged || (!field.flagged && this.flagsLeft > 0)) {
      field.flagged = !field.flagged
      if (field.flagged) {
        this.flaggedFields.push(field)
        this.checkForWin()
      } else {
        this.flaggedFields = this.flaggedFields.filter((f) => f.id !== field.id)
      }
    }
  },
  checkForWin() {
    const matchesCount = this.fields.filter(
      (field: Field) => field.flagged && field.value === BOMB,
    ).length

    if (matchesCount === this.bombAmount) {
      this.gameOverStatus = GameOverStatus.WIN
      this.stopTimer()
      this.openLeftFields()
    }
  },
  openLeftFields() {
    const closedFields: Field[] = this.fields.filter(
      (field: Field) => !field.opened && !field.flagged && !field.value,
    )

    closedFields.forEach((field) => {
      field.opened = !field.opened
    })
  },
  initTimer() {
    this.counterInterval = setInterval(() => {
      this.secondsPlayed++
    }, 1000)
  },
  stopTimer() {
    clearInterval(this.counterInterval)
    this.counterInterval = 0
  },
})

export default game
