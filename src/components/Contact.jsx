import React from "react";

function Contact() {
  return (
    <div
      name="Contact"
      className="pl-20 pb-32 pt-16 relative bg-gradient-to-b from-black via-black to-gray-500 w-full text-white h-auto"
    >
      <div>
        <div className="mx-auto flex flex-col w-full h-full">
          <div className="pb-4">
            <p className="text-3xl border-b-4 border-gray-400  inline text-white">
              Contact
            </p>
            <p className="py-6">Submit the form below get in touch with me!</p>
          </div>
          <div className="flex justify-center items-center">
            <form action="https://getform.io/f/b9f45ecd-a569-42d4-8768-d1d16b4f92fd" method="POST" className="flex flex-col w-10/12 ">
                <input type="text" autocomplete="off" placeholder="Enter your name" name="name" className="bg-transparent p-2 border-2 rounded-md text-white focus:outline-none" />
                <input type="text" autocomplete="off" placeholder="Enter your email" name="email" className="p-2 my-2 border-2 bg-transparent rounded-md text-white focus:outline-none" />
                <textarea type="text" autocomplete="off" rows={10} placeholder="Enter your message" name="message" className="p-2 border-2 bg-transparent rounded-md text-white focus:outline-none" />
                <button className="text-white bg-gradient-to-b from-cyan-500 to-blue-500 px-6 py-3 my-8 mx-auto flex items-center rounded-md hover:scale-110 duration-300" >Connect</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
