import React from "react";

function About() {
  return (
    <div
      name="About"
      className="h-screen md:p-20 p-4 w-full bg-gradient-to-b from-blue-950  to-black"
    >
      <h1 className="text-3xl border-b-4 border-gray-400 pt-10 inline text-white">
        About
      </h1>
      <div className="pt-14 md:pl-4 md:text-xl text-gray-400">
        <p className="mt-4">
          &nbsp; Hi, I am Ankit Mishra from Ghaziabad, India. I am currently
          working as a full stack developer at Tata Consultancy Services since
          October, 2021. I have completed my graduation in Computer Science and
          Engineering from IMS Engineering in July,2021. I have done an
          intership at Rklick Solution LLC in 2020 for 3 months there I leraned
          about Machine Learning technologies for NLP and imaging. My task there
          was to test and tune the model, also to provide support for frontend
          tasks,
        </p>
        <p className="mt-4">
          &nbsp; Currently my role in company is to develop and handle all the
          backend stuff related to the client's website and also to provide
          frontend support at few ocassions which is built in react, which
          helped me to learn and understand react usage in industry area.
        </p>
      </div>
    </div>
  );
}

export default About;
