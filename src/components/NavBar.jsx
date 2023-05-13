import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const links = [
    {
      id: 1,
      link: "Home",
    },
    {
      id: 2,
      link: "about",
    },
    {
      id: 3,
      link: "portfolio",
    },
    {
      id: 4,
      link: "experience",
    },
    {
      id: 5,
      link: "contact",
    },
  ];

  return (
    <div className="flex px-4 justify-between items-center w-full h-20 bg-black text-white fixed">
      <div>
        <h1 className="text-5xl font-signature capitalize ml-3 mt-3">ankit</h1>
      </div>
      <ul className="hidden md:flex">
        {links.map((e) => {
          return (
            <li
              key={e.id}
              className="px-4 font-medium cursor-pointer capitalize hover:scale-110 duration-200 text-gray-400"
            >
              {e.link}
            </li>
          );
        })}
      </ul>

      <div
        onClick={() => {
          setNav(!nav);
        }}
        className="md:hidden cursor-pointer m-3 z-10 text-gray-400"
      >
        {nav ? <FaTimes size={30} className="duration-200 "/> : <FaBars className="duration-200 " size={30} />}
      </div>
      {nav && (
        <ul className="flex flex-col rounded-md justify-center items-center absolute top-16 pr-1 right-0 w-1/2  duration-300 bg-black text-gray-400">
          {links.map((e) => {
            return (
              <li key={e.id} className="py-4 cursor-pointer capitalize text-2xl">
                {e.link}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NavBar;
