import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-scroll";
const NavBar = ({ prop }) => {
  const links = [
    {
      id: 1,
      link: "Home",
    },
    {
      id: 2,
      link: "About",
    },
    {
      id: 3,
      link: "Skills",
    },
    {
      id: 4,
      link: "Portfolio",
    },
    {
      id: 5,
      link: "Experience",
    },
    {
      id: 6,
      link: "Contact",
    },
  ];

  return (
    <div className="flex px-4 justify-between items-center w-full h-20 bg-black text-white sticky">
      <div>
        <h1 className="text-5xl font-signature capitalize ml-3 mt-3">ankit</h1>
      </div>
      <ul className="hidden md:flex">
        {links.map((e) => {
          return (
            <li
              key={e.id}
              className="px-4 font-medium cursor-pointer capitalize hover:text-white hover:scale-110 duration-200 text-gray-400"
            >
              <Link to={e.link} smooth duration={500}>
                {e.link}
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        onClick={() => {
          prop.setNav(!prop.nav);
        }}
        className="md:hidden cursor-pointer m-3 z-10 text-gray-400"
      >
        {prop.nav ? (
          <FaTimes size={30} className="hover:rotate-180 duration-200  " />
        ) : (
          <FaBars className="hover:rotate-180 duration-200" size={30} />
        )}
      </div>
      {prop.nav && (
        <ul className="flex flex-col shadow-md shadow-white rounded-md justify-center items-center absolute top-16 pr-1 right-0 w-1/2  duration-300 bg-gradient-to-b from-black to-blue-950 text-gray-400">
          {links.map((e) => {
            return (
              <Link to={e.link} smooth duration={700} className="py-4 text-center rounded-md mb-2 hover:shadow-sm hover:shadow-gray-400 w-10/12 cursor-pointer capitalize text-md">
                <li
                  key={e.id}
                  // className="py-4 text-center rounded-md mb-2 hover:shadow-sm hover:shadow-gray-400 w-10/12 cursor-pointer capitalize text-md"
                  onClick={()=>(prop.setNav(!prop.nav))}
                >
                  {e.link}
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NavBar;
