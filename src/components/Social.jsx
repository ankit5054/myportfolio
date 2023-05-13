import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import {GoFilePdf} from 'react-icons/go'

const Social = () => {
  const links = [
    {
      id: 1,
      child: (
        <>
          LinkedIn <FaLinkedin size={30} />
        </>
      ),
      href: "https://www.linkedin.com/in/ankit5054/",
    },
    {
      id: 2,
      child: (
        <>
          GitHub <FaGithub size={30} />
        </>
      ),
      href: "https://www.github.com/ankit5054/",
    },
    {
      id: 3,
      child: (
        <>
          Mail <HiOutlineMail size={30} />
        </>
      ),
      href: "mailto:ankit.mishra9780@gmail.com",
    },
    {
      id: 4,
      child: (
        <>
          Resume <GoFilePdf size={30} />
        </>
      ),
      href: "/resume.pdf",
      // download: true,
    },
  ];

  return (
    <div className=" flex flex-col top-[30%] left-0 fixed">
      <ul>
        {links.map((link) => (
          <li
            key={link.id}
            className="flex justify-between items-center w-40 h-14  px-4 bg-gray-500 ml-[-100px] hover:rounded-md hover:ml-[-10px] duration-300"
          >
            <a
              rel="noreferrer"
              target="_blank"
              href={link.href}
              download={link.download}
              className="flex justify-between items-center w-full text-white"
            >
              {link.child}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Social;
