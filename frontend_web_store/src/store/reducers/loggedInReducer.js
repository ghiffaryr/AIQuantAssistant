const loggedInReducer = (state = false, action) => {
  switch (action.type) {
    case "loggedIn":
      return true;
      break;
    case "loggedOff":
      return false;
      break;
    default:
      return state;
      break;
  }
};

export default loggedInReducer;
