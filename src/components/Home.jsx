import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { Code, Database, Server } from "lucide-react";

const Home = () => {
  const techStack = [
    { icon: <Server className="w-6 h-6" />, name: "Node.js" },
    { icon: <Database className="w-6 h-6" />, name: "PostgreSQL" },
    { icon: <Code className="w-6 h-6" />, name: "React" },
  ];

  return (
    <div name="Home" className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-16 sm:py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 lg:space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium"
            >
              👋 Hello, I'm Ankit
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight break-words"
            >
              Fullstack
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Developer</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2"
            >
              Building complete web solutions with 4+ years of experience. 
              Specialized in backend systems, React frontends, and end-to-end development.
            </motion.p>
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 sm:gap-4 justify-center"
          >
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors">
                <span className="text-blue-400">{tech.icon}</span>
                <span className="text-gray-300 font-medium text-sm sm:text-base">{tech.name}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="Portfolio" smooth duration={900}>
              <button className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 w-full sm:w-auto">
                View Portfolio
                <MdOutlineKeyboardArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <Link to="Contact" smooth duration={900}>
              <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-blue-500/10 w-full sm:w-auto">
                Get In Touch
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
