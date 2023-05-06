const placeholderReducer = (state = false, action) => {
  switch (action.type) {
    case 1:
      return true;
      break;
    case 0:
      return false;
      break;
    default:
      return state;
      break;
  }
};

export default placeholderReducer;
