import React from "react";

import html from "../assets/html.png";
import css from "../assets/css.png";
import javascript from "../assets/javascript.png";
import reactImage from "../assets/react.png";
// import nextjs from "../assets/nextjs.jpg";
import graphql from "../assets/graphql.png";
import github from "../assets/github.png";
import tailwind from "../assets/tailwind.png";
import node from "../assets/node.png";

function Experience() {
  let temp = [
    {
      id: 1,
      img: html,
      style: "shadow-red-500",
      title: "HTML",
    },
    {
      id: 2,
      img: css,
      style: "shadow-blue-500",
      title: "CSS",
    },
    {
      id: 3,
      img: javascript,
      style: "shadow-yellow-300",
      title: "JavaScript",
    },
    {
      id: 4,
      img: reactImage,
      style: "shadow-blue-600",
      title: "React",
    },
    // {
    //   id: 5,
    //   img: nextjs,
    //   style: "shadow-red-500",
    //   title: "NextJs",
    // },
    {
      id: 6,
      img: graphql,
      style: "shadow-pink-500",
      title: "GraphQL",
    },
    {
      id: 7,
      img: github,
      style: "shadow-gray-400",
      title: "Github",
    },
    {
      id: 8,
      img: tailwind,
      style: "shadow-sky-300",
      title: "Tailwind CSS",
    },
    {
      id: 9,
      img: node,
      style: "shadow-green-400",
      title: "NodeJS",
    },
  ];
  return (
    <div
      name="Experience"
      className="pl-20 pb-32 pt-16 relative bg-gradient-to-b from-blue-950 to-black w-full text-white h-auto"
    >
      <div>
        <div className="mx-auto flex flex-col w-full h-full">
          <div className="pb-4">
            <p className="text-3xl border-b-4 border-gray-400  inline text-white">
              Experience
            </p>
            <p className="py-6">
              Technologies that I've worked with
            </p>
          </div>
          {/* <div> */}
        </div>{" "}
        <div className="flex flex-row flex-wrap justify-evenly">
          {temp.map((i) => (
            <div
              key={i.id}
              className={`mt-12 flex flex-col border-white shadow-lg rounded-md p-2 items-center hover:scale-110 duration-200 ${i.style}`}
            >
              <img src={i.img} alt="" className="w-1/3" />
              <p className="pt-3">{i.title}</p>
            </div>
          ))}
          {/* </div> */}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default Experience;
