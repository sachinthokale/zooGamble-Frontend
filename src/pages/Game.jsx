import { useEffect, useMemo, useRef, useState } from "react";
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

const Game = () => {
  const animalIcons = useMemo(
    () => [
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
    ],
    []
  );
  const [betAmount, setBetAmount] = useState(Number(1));
  const [betAmountButton, setBetAmountButton] = useState(1);
  const [coins, setCoins] = useState();
  const [timer, setTimer] = useState(0);
  const socketRef = useRef(null);
  const [totalBet, setTotalBet] = useState(0);
  const [message, setMessage] = useState("");
  const [betClosed, setBetClosed] = useState();
  const [placedBet, setPlacedBet] = useState({});
  const [result, setResult] = useState();
  const [last10bet, setLast10Bet] = useState([]);

  const [animalCounts, setAnimalCounts] = useState(
    animalIcons.reduce((acc, animal) => {
      acc[animal.name] = 0;
      return acc;
    }, {})
  );

  const getLast10BetResultIcon = (last10Bets) => {
    const last10BetsIcons = last10Bets.map((animalName) => {
      const animal = animalIcons.find((animal) => animal.name === animalName);

      return animal ? animal.icon : null;
    });

    return last10BetsIcons;
  };
  const handleBetPlaced = (animalName) => {
    if (timer <= 10) {
      return;
    }

    if (coins < betAmount) {
      return;
    }
    if (betClosed) {
      return;
    }
    const socket = socketRef.current;
    socket.emit("total-bet", betAmount);
    setTotalBet((prev) => prev + betAmount);
    setAnimalCounts((prevBet) => ({
      ...prevBet,
      [animalName]: prevBet[animalName] + betAmount,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    const socket = io("http://192.168.199.92:3000", {
      auth: {
        token: token,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join");
    });
    socket.on("newRound", () => {
      setMessage("New Round");
      setBetClosed(false);
    });
    socket.on("betclosed", () => {
      setBetClosed(true);
    });
    socket.on("timer", (newTimer) => {
      setTimer(newTimer);
    });
    socket.on("bet-data", (betData) => {
      console.log(betData);
      setPlacedBet(betData);
    });

    socket.on("init", ({ coins, last10BetResults }) => {
      setCoins(coins);
      const last10BetsIcons = getLast10BetResultIcon(last10BetResults);
      setLast10Bet(last10BetsIcons);
      setResult(last10BetResults[0]);
    });

    socket.on("last10Bets", (last10Bets) => {
      const last10BetsIcons = getLast10BetResultIcon(last10Bets);
      setLast10Bet(last10BetsIcons);
    });

    socket.on("total-bet-response", ({ success, coins }) => {
      if (success == true) {
        setCoins(coins);
      }
    });

    socket.on("particular-bet-cancled", (coins) => {
      setCoins(coins);
    });
    socket.on("result", (result) => {
      setMessage(result);
      setResult(result);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      console.log(`Connection failed: ${err.message}`);
    });
    socket.on("refresh", () => {
      socket.emit("refresh-coins");
      setMessage("");
      setTotalBet(0);
      setAnimalCounts(
        animalIcons.reduce((acc, animal) => {
          acc[animal.name] = 0;
          return acc;
        }, {})
      );
      setPlacedBet({});
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleBetAmmountChange = (amount) => {
    setBetAmountButton(amount);

    setBetAmount(amount);
  };

  const submitBet = () => {
    if (timer <= 10) {
      return;
    }
    const socket = socketRef.current;
    socket.emit("bet", animalCounts);
  };
  const handleParticularBet = (animal) => {
    const previousAmountOnThatAnimal = animalCounts[animal];
    const socket = socketRef.current;
    socket.emit("cancle-particularBet", previousAmountOnThatAnimal);
    setTotalBet((prev) => prev - previousAmountOnThatAnimal);
    console.log(previousAmountOnThatAnimal);
    setAnimalCounts((prev) => ({
      ...prev,
      [animal]: 0,
    }));
  };

  const handleCancleBet = () => {
    const socket = socketRef.current;
    socket.emit("refresh-coins");
    setAnimalCounts(
      animalIcons.reduce((acc, animal) => {
        acc[animal.name] = 0;
        return acc;
      }, {})
    );
  };

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
                  onClick={() => handleBetAmmountChange(val)}
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
              onClick={handleCancleBet}
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
          {[...last10bet].reverse().map((bet, index) => {
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
