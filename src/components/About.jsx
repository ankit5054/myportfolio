import React from "react";

function About() {
  return (
    <div name="About" className=" md:px-20 md:py-8 p-4 w-full">
      <h1 className="text-3xl border-b-4 border-gray-400 pt-10 inline text-white">
        About
      </h1>
      <div className="pt-8 md:pl-4 md:text-xl text-gray-400">
        <p className="">
          A backend engineer with 4 years of experience in designing and
          developing scalable systems, RESTful APIs, and data-driven
          architectures. Skilled in Node.js, NestJS, PostgreSQL, and AWS, with
          hands-on experience in microservices, caching, and performance
          optimization. Passionate about writing clean, maintainable code and
          solving complex technical challenges that enhance efficiency,
          reliability, and scalability. Enthusiastic about React and modern
          frontend frameworks, continuously learning to strengthen full-stack
          development capabilities and deliver seamless end-to-end solutions.
        </p>
        <p className="mt-4">
          Currently working at Tata Consultancy Services, where I’ve deepened my
          expertise in system architecture, database design, API performance
          tuning, and cloud deployments. I’ve also contributed to building
          high-performance enterprise applications, reducing latency through
          query optimization, and implementing caching and CI/CD best practices.
          My journey has helped me grow into a developer who values
          collaboration, innovation, and engineering excellence, aiming to
          create impactful, production-ready software that scales with business
          needs.
        </p>
      </div>
    </div>
  );
}

export default About;
