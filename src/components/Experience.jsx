import React from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import html from "../assets/html.png";
import css from "../assets/css.png";
import javascript from "../assets/javascript.png";
import reactImage from "../assets/react.png";
import graphql from "../assets/graphql.png";
import github from "../assets/github.png";
import tailwind from "../assets/tailwind.png";
import node from "../assets/node.png";

function Experience() {
  const technologies = [
    {
      id: 1,
      img: node,
      title: "Node.js",
      category: "Backend",
      level: "Expert",
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      img: javascript,
      title: "JavaScript",
      category: "Language",
      level: "Expert",
      color: "from-yellow-400 to-yellow-500"
    },
    {
      id: 3,
      img: reactImage,
      title: "React",
      category: "Frontend",
      level: "Advanced",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 4,
      img: graphql,
      title: "GraphQL",
      category: "API",
      level: "Advanced",
      color: "from-pink-500 to-purple-600"
    },
    {
      id: 5,
      img: html,
      title: "HTML5",
      category: "Frontend",
      level: "Expert",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 6,
      img: css,
      title: "CSS3",
      category: "Styling",
      level: "Advanced",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 7,
      img: tailwind,
      title: "Tailwind CSS",
      category: "Framework",
      level: "Advanced",
      color: "from-cyan-400 to-blue-500"
    },
    {
      id: 8,
      img: github,
      title: "GitHub",
      category: "DevOps",
      level: "Expert",
      color: "from-gray-600 to-gray-800"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert": return "text-green-400";
      case "Advanced": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div name="Experience" className="py-20 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Technologies <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">I Work With</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks I use to build exceptional solutions
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-16"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.id}
              variants={cardVariants}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <img 
                      src={tech.img} 
                      alt={tech.title}
                      className="w-12 h-12 mx-auto object-contain"
                    />
                  </div>
                </div>
                
                <h3 className="text-white font-semibold mb-2">{tech.title}</h3>
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">{tech.category}</p>
                  <p className={`text-sm font-medium ${getLevelColor(tech.level)}`}>
                    {tech.level}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Resume Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Want to Know More?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Download my resume for complete details about my experience, projects, and technical expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://drive.google.com/file/d/1EAuoyDHwrjMyEww_0B8qh0Z0evxl5CLk/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </a>
              
              <a
                href="https://drive.google.com/file/d/1EAuoyDHwrjMyEww_0B8qh0Z0evxl5CLk/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Online
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Experience;