/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
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

const Slider = ({ result }) => {
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

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    console.log("working");
    const index = animalIcons.findIndex((animal) => animal.name === result);

    if (index !== -1) {
      setOffset(index * 50);
    }
  }, [result]);

  return (
    <div className=" overflow-hidden relative h-[50px]">
      <div
        className="flex flex-col transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${offset}px)` }}
      >
        {animalIcons.map((animal) => (
          <div
            key={animal.name}
            className="flex flex-col justify-center items-center h-[50px]"
          >
            <FontAwesomeIcon icon={animal.icon} size="2x" color="orange" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
