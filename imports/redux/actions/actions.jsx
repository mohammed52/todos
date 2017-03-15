export const changeBackgroundColor = (newColor) => {
  return {
    type: 'BACKGROUND_COLOR_CHANGE',
    newColor: newColor
  }
}