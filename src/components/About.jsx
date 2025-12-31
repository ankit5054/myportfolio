import React from "react";
import { motion } from "framer-motion";
import { Award, Target, Coffee } from "lucide-react";

function About() {
  const highlights = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "4+ Years Experience",
      description: "Building scalable backend systems"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Performance Expert",
      description: "Optimizing APIs and databases"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Problem Solver",
      description: "Turning complex challenges into elegant solutions"
    }
  ];

  return (
    <div name="About" className="py-16 sm:py-20 px-2 sm:px-4 min-h-screen flex items-center overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 break-words">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-2">
            Passionate backend engineer crafting robust, scalable solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left px-2 lg:px-0"
          >
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                I'm a backend engineer with <span className="text-blue-400 font-semibold">4+ years of experience</span> specializing in 
                building high-performance, scalable systems. My expertise spans from designing RESTful APIs to 
                optimizing database queries that handle millions of requests.
              </p>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                At <span className="text-purple-400 font-semibold">Tata Consultancy Services</span>, I've architected 
                microservices, implemented caching strategies, and reduced API response times by up to 60%. 
                I'm passionate about clean code, system design, and exploring modern technologies.
              </p>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                Currently expanding my full-stack capabilities with React, aiming to deliver 
                <span className="text-green-400 font-semibold"> complete end-to-end solutions</span> that create 
                real business impact.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-blue-400 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;