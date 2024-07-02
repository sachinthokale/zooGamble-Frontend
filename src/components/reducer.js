const animalCounts = {
  Cat: 0,
  Crow: 0,
  Dog: 0,
  Fish: 0,
  Frog: 0,
  Hippo: 0,
  Horse: 0,
  Spider: 0,
  Snake: 0,
  Cow: 0,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BET_AMOUNT":
      return {
        ...state,
        betAmount: action.payload,
        betAmountButton: action.payload,
      };
    case "SET_COINS":
      return { ...state, coins: action.payload };
    case "SET_TIMER":
      return { ...state, timer: action.payload };
    case "SET_TOTAL_BET":
      return { ...state, totalBet: state.totalBet + action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_BET_CLOSED":
      return { ...state, betClosed: action.payload };
    case "SET_PLACED_BET":
      return { ...state, placedBet: action.payload };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "SET_LAST_10_BET":
      return { ...state, last10bet: action.payload };
    case "SET_ANIMAL_COUNTS":
      return { ...state, animalCounts: action.payload };
    case "RESET_BETS":
      return {
        ...state,
        totalBet: 0,
        animalCounts: animalCounts,
        placedBet: {},
      };
    default:
      return state;
  }
};
