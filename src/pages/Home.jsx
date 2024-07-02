import { Link } from "react-router-dom";
import home_logo from "../assets/home_logo.png";

const Home = () => {
  return (
    <>
      <div className=" flex flex-col md:flex-row  w-screen h-screen  text-white bg-gradient-to-b  md:bg-gradient-to-r from-black via-gray-600 to-white ">
        <div className=" w-fit h-fit md:w-1/2 md:h-full flex justify-center items-center mt-24 md:mt-0">
          <img
            className=" object-cover w-full  h-full   "
            src={home_logo}
            alt=""
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-4">
          <h1 className=" text-7xl font-serif font-extrabold text-center text-yellow-500 drop-shadow-lg">
            ZOO GAMBLE
          </h1>
          <Link
            to={"/game"}
            className=" bg-yellow-500 p-5 w-3/4 md:w-1/2 text-2xl text-center font-extrabold rounded-lg shadow-md hover:shadow-xl "
          >
            PLAY NOW
          </Link>
        </div>
      </div>
      {/* <div className=" w-full h-2/3 md:h-full md:w-full rounded-[999px] absolute bottom-0 -z-10  md:top-0 right-0   blur-3xl bg-opacity-60 bg-gradient-to-t  md:bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300"></div> */}
    </>
  );
};

export default Home;
