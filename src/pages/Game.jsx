import { useEffect, useReducer, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHippo,
  faDog,
  faCrow,
  faCat,
  faFrog,
  faFish,
  faHorse,
  faSpider,
  faRodSnake,
  faCow,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import CancelIcon from "@mui/icons-material/Cancel";
import Slider from "../components/Slider";
import { reducer } from "../components/reducer";

const useSocket = (url, token, eventHandlers) => {
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = io(url, {
      auth: {
        token: token,
      },
    });
    socketRef.current = socket;

    Object.keys(eventHandlers).forEach((event) => {
      socket.on(event, eventHandlers[event]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return socketRef;
};

const Game = () => {
  const initialState = {
    betAmount: 1,
    betAmountButton: 1,
    coins: 0,
    timer: 0,
    totalBet: 0,
    message: "",
    betClosed: false,
    placedBet: {},
    result: null,
    last10bet: [],
    animalCounts: {
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
    },
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const animalIcons = [
    { icon: faCat, name: "Cat" },
    { icon: faCrow, name: "Crow" },
    { icon: faDog, name: "Dog" },
    { icon: faFish, name: "Fish" },
    { icon: faFrog, name: "Frog" },
    { icon: faHippo, name: "Hippo" },
    { icon: faHorse, name: "Horse" },
    { icon: faSpider, name: "Spider" },
    { icon: faRodSnake, name: "Snake" },
    { icon: faCow, name: "Cow" },
  ];

  const token = localStorage.getItem("token");
  const eventHandlers = {
    connect: () => {
      socketRef.current.emit("join");
    },
    newRound: () => {
      dispatch({ type: "SET_MESSAGE", payload: "New Round" });
      dispatch({ type: "SET_BET_CLOSED", payload: false });
    },
    betclosed: () => {
      dispatch({ type: "SET_BET_CLOSED", payload: true });
    },
    timer: (newTimer) => {
      dispatch({ type: "SET_TIMER", payload: newTimer });
    },
    "bet-data": (betData) => {
      dispatch({ type: "SET_PLACED_BET", payload: betData });
    },
    init: ({ coins, last10BetResults }) => {
      dispatch({ type: "SET_COINS", payload: coins });
      dispatch({
        type: "SET_LAST_10_BET",
        payload: getLast10BetResultIcon(last10BetResults),
      });
      dispatch({ type: "SET_RESULT", payload: last10BetResults[0] });
    },
    last10Bets: (last10Bets) => {
      dispatch({
        type: "SET_LAST_10_BET",
        payload: getLast10BetResultIcon(last10Bets),
      });
    },
    "total-bet-response": ({ success, coins }) => {
      if (success) {
        dispatch({ type: "SET_COINS", payload: coins });
      }
    },
    particularBetCancled: (coins) => {
      console.log("ale na bhai vapas");
      dispatch({ type: "SET_COINS", payload: coins });
    },
    result: (result) => {
      dispatch({ type: "SET_MESSAGE", payload: result });
      dispatch({ type: "SET_RESULT", payload: result });
    },
    disconnect: () => {
      console.log("Disconnected from server");
    },
    connect_error: (err) => {
      console.log(`Connection failed: ${err.message}`);
    },
    refresh: () => {
      socketRef.current.emit("refresh-coins");
      dispatch({ type: "SET_MESSAGE", payload: "" });
      dispatch({ type: "RESET_BETS" });
    },
  };

  const socketRef = useSocket(
    "http://192.168.199.92:3000",
    token,
    eventHandlers
  );

  const handleBetPlaced = (animalName) => {
    if (state.timer <= 10 || state.coins < state.betAmount || state.betClosed) {
      return;
    }
    socketRef.current.emit("total-bet", state.betAmount);
    dispatch({ type: "SET_TOTAL_BET", payload: state.betAmount });
    dispatch({
      type: "SET_ANIMAL_COUNTS",
      payload: {
        ...state.animalCounts,
        [animalName]: state.animalCounts[animalName] + state.betAmount,
      },
    });
  };

  const handleBetAmountChange = (amount) => {
    dispatch({ type: "SET_BET_AMOUNT", payload: amount });
  };

  const submitBet = () => {
    if (state.timer <= 10) {
      return;
    }
    socketRef.current.emit("bet", state.animalCounts);
  };

  const handleParticularBet = (animal) => {
    const previousAmountOnThatAnimal = state.animalCounts[animal];
    socketRef.current.emit("cancleParticularBet", previousAmountOnThatAnimal);

    dispatch({ type: "SET_TOTAL_BET", payload: -previousAmountOnThatAnimal });
    dispatch({
      type: "SET_ANIMAL_COUNTS",
      payload: { ...state.animalCounts, [animal]: 0 },
    });
  };

  const handleCancelBet = () => {
    socketRef.current.emit("refresh-coins");
    dispatch({
      type: "SET_ANIMAL_COUNTS",
      payload: animalIcons.reduce((acc, animal) => {
        acc[animal.name] = 0;
        return acc;
      }, {}),
    });
  };

  const getLast10BetResultIcon = (last10Bets) => {
    return last10Bets.map((animalName) => {
      const animal = animalIcons.find((animal) => animal.name === animalName);
      console.log("anim", animal);
      return animal ? animal.icon : null;
    });
  };
  const {
    betAmountButton,
    coins,
    timer,
    totalBet,
    message,
    betClosed,
    placedBet,
    result,
    last10bet,
    animalCounts,
  } = state;

  return (
    <div className="flex flex-col w-screen h-screen text-white bg-gradient-to-b md:bg-gradient-to-r from-black via-gray-600  to-gray-400 p-2 md:gap-10">
      <div className=" rounded-md w-full h-14 md:h-16 flex gap-2 p-1">
        <div className=" w-1/2 border border-green-500 flex flex-col justify-center rounded-lg  px-2">
          <p className=" text-[8px] md:text-xs">Your Coins</p>
          <div className=" md:text-xl">{coins}</div>
        </div>
        <button className=" w-1/2 border border-red-500 rounded-lg px-2">
          LOGOUT
        </button>
      </div>

      <div className="  rounded-lg w-full h-5/6 md:h-3/4 p-2 flex flex-col md:flex-row md:justify-between ">
        <div className="  w-full flex  md:w-1/5 md:flex-col items-center h-32 md:h-full  py-2 gap-[2px] md:gap-2">
          <div className=" border border-purple-500 rounded-xl w-1/2 h-full p-2  md:w-full md:h-2/5  flex flex-col items-center gap-1">
            <div className=" w-full h-2/3 flex justify-evenly items-center">
              <h1 className=" text-2xl text-purple-500 md:text-6xl">{timer}</h1>

              <Slider result={result} timer={timer} />
            </div>
            <p className=" text-purple-500">{message}</p>
          </div>

          <div className=" gap-2 w-full h-full flex items-center justify-center flex-col p-2">
            <div className="border border-gray-600 w-full px-2 py-1 text-[10px] md:text-lg  md:p-2 rounded-lg">
              <p>
                Total bet : <span className="text-yellow-500">{totalBet}</span>
              </p>
            </div>
            <div className="border border-gray-600 w-full px-2 py-1 md:p-2 rounded-lg">
              <p className=" text-[10px] md:text-lg">
                Your placed coins are :{" "}
              </p>
              <div className="flex flex-wrap gap-[2px] md:gap-1 ">
                {Object.keys(placedBet).map((key) => {
                  return (
                    <p
                      key={key}
                      className=" text-[10px] md:text-base border-gray-400 p-[2px] md;p-1 text-yellow-500"
                    >
                      {key} : {placedBet[key]}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className=" flex w-full h-2/3 md:h-full md:w-2/5 flex-wrap gap-x-10  ">
          {animalIcons.map((animal) => (
            <div
              key={animal.name}
              className=" border border-[yellow] rounded-xl shadow-lg min-w-24 md:min-w-28 h-24 md:h-28 p-1 flex flex-col gap-2 items-center  justify-center overflow-hidden text-4xl md:text-5xl"
            >
              <div className=" border-gray-500  rounded-lg p-[3px] md:p-1 flex items-center justify-center w-[90%] gap-2">
                <p className=" text-xs md:text-sm  text-white">
                  {animalCounts[animal.name]}
                </p>
                <CancelIcon
                  onClick={() => handleParticularBet(animal.name)}
                  sx={{}}
                />
              </div>
              <FontAwesomeIcon
                onClick={() => handleBetPlaced(animal.name)}
                icon={animal.icon}
                color="yellow"
              />
            </div>
          ))}
        </div>
        <div className=" w-full md:w-1/3 flex md:flex-col md:gap-10">
          <div className="w-1/2 md:w-3/4  flex flex-col items-center">
            <div>
              <p className=" text-sm md:text-xl font-bold">
                Select Bet Ammount
              </p>
            </div>
            <div className=" flex flex-wrap justify-center md:justify-normal">
              {[1, 5, 10, 50, 100, 500].map((val, index) => (
                <button
                  key={index}
                  onClick={() => handleBetAmountChange(val)}
                  className={`border rounded p-2 m-1 min-w-12 md:min-w-20 md:min-h-20 text-xl md:text-2xl ${
                    betAmountButton == val
                      ? "bg-yellow-500 border-none shadow-md"
                      : ""
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          <div className="w-1/2 md:w-3/4 flex flex-col justify-end p-2 md:p-0  items-center md:mt-4 gap-2">
            <button
              onClick={submitBet}
              className={` ${
                betClosed == true ? " bg-gray-500" : "bg-green-500"
              } p-2 md:p-4 w-full md:text-2xl rounded-lg`}
              disabled={betClosed}
            >
              PLACE BET
            </button>
            <button
              onClick={handleCancelBet}
              className={` ${
                betClosed == true ? " bg-gray-500" : "bg-red-500"
              } p-2 md:p-4 w-full md:text-2xl rounded-lg`}
              disabled={betClosed}
            >
              CANCLE BET
            </button>
          </div>
        </div>
      </div>
      <div className="border border-gray-400 rounded-xl w-2/3 md:w-fit h-fit absolute top-[535px] md:top-[480px]  right-2 md:right-[550px] p-1 flex flex-col justify-center">
        <p className="text-xs">Last 10 winning animals :</p>

        <div className=" flex w-full">
          {last10bet &&
            [...last10bet].reverse().map((bet, index) => {
              return (
                <FontAwesomeIcon
                  key={index}
                  icon={bet}
                  color="orange"
                  className=" text-xl p-[2px]"
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Game;
