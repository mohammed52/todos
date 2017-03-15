const backgroundColor = (state = [], action) => {
  switch (action.type) {

    case "BACKGROUND_COLOR_CHANGE":
      {
          return action.newColor;
      }
      
    default:
      {
        return state
      }
  }

}

export default backgroundColor