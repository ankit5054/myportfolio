import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import todo from "../assets/portfolio/todo.jpg";
import netflixgpt from "../assets/portfolio/netflixgpt.png";

function Portfolio() {
  const projects = [
    {
      id: 1,
      img: netflixgpt,
      title: "Netflix GPT",
      description: "Frontend Netflix clone with AI-powered movie recommendations using OpenAI integration",
      tech: ["React", "Redux", "OpenAI API", "Firebase", "Tailwind CSS"],
      code: "https://github.com/ankit5054/netflixGPT",
      demo: "https://netflixai.iamankit.in/",
      featured: true
    },
    {
      id: 2,
      img: todo,
      title: "React Todo App",
      description: "Modern task management application with local storage",
      tech: ["React", "JavaScript", "CSS3", "Local Storage"],
      code: "https://github.com/ankit5054/Todo_with_react",
      demo: "https://ankit5054.github.io/Todo_with_react/",
      featured: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div name="Portfolio" className="py-20 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Showcasing my passion for creating innovative, user-centric applications
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                project.featured 
                  ? 'border-blue-500 shadow-blue-500/20' 
                  : 'border-gray-700 hover:border-blue-500/50'
              }`}
            >
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Featured
                  </div>
                </div>
              )}
              
              <div className="relative overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                  <a 
                    href={project.code} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">More Projects Coming Soon!</h3>
            <p className="text-gray-400 mb-6">
              I'm constantly working on new projects and exploring cutting-edge technologies. 
              Stay tuned for more exciting developments!
            </p>
            <a 
              href="https://github.com/ankit5054" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300"
            >
              <Github className="w-5 h-5 mr-2" />
              View All on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Portfolio;