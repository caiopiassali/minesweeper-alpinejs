export const randomId = () => Math.random().toString(36).slice(2, 7)

export const randomNumber = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1) + min)
