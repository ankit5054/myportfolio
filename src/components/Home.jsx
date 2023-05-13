import React from "react";
import mypic from "../assets/Mypic.jpeg";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Home = () => {
  return (
    <div
      name="Home"
      className="md:h-screen p-4 sm:h-auto pb-20 w-full bg-gradient-to-b from-black via-gray-900 to-blue-950"
    >
      <div className="max-w-screen-lg mx-auto flex flex-col items-center md:justify-between  h-full px-4 md:flex-row">
        <div className="flex flex-col justify-center h-full mx-10">
          <h2 className="text-4xl sm:text-8xl pt-10 flex text-white">
            I'm a full Stack Developer
          </h2>
          <p className="text-gray-400 py-4 max-w-md text-lg">
            I have 2 years of experience in building and designing software.
            Currently, I have to work on web application using technologies like
            ReactJS, Tailwind, NestJS, Kafka, Postgres, MongoDB, NodeJS, RestAPI's ,GraphQL, AWS.
          </p>
          <div className="py-6">
            <button className=" group text-white w-fit px-6 py-3 my-2 flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:scale-105 duration-200 text-lg cursor-pointer">
              Portfolio
              <span>
                <MdOutlineKeyboardArrowRight
                  size={30}
                  className="items-center group-hover:rotate-90 duration-300"
                />
              </span>
            </button>
          </div>
        </div>
        <div className="">
          <img
            src={mypic}
            alt="myPic"
            className="rounded-2xl w-9/12 md:w-10/12 md:h-1/3 m-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
