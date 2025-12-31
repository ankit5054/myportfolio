import React from "react";
import { motion } from "framer-motion";
import { Server, Database, Cloud, Code, TestTube, Settings } from "lucide-react";

export default function Skills() {
  const skillCategories = [
    {
      icon: <Server className="w-8 h-8" />,
      title: "Backend Development",
      skills: ["Node.js", "NestJS", "Express", "TypeScript", "GraphQL", "Redis"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Database & Storage",
      skills: ["PostgreSQL", "TypeORM", "Query Optimization", "Data Modeling"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud & DevOps",
      skills: ["AWS EC2", "Aurora", "Lambda", "S3", "CloudFront", "CI/CD"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend (Secondary)",
      skills: ["React", "JavaScript", "Redux Toolkit", "Tailwind CSS"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <TestTube className="w-8 h-8" />,
      title: "Testing & Quality",
      skills: ["Jest", "React Testing Library", "API Testing", "Performance Testing"],
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Tools & Workflow",
      skills: ["Git", "Jira", "Postman", "Dynatrace", "Concourse", "ArgoCD"],
      color: "from-indigo-500 to-purple-500"
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

  return (
    <div name="Skills" className="py-20 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Technical <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            4+ years of hands-on experience in backend engineering, system architecture, 
            and performance optimization — building scalable, reliable solutions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 sm:gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} p-3 mb-4`}>
                  <div className="text-white">{category.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
              </div>
              
              <div className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="bg-gray-700/50 px-3 py-2 rounded-lg text-gray-300 text-sm hover:bg-gray-600/50 transition-colors"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Core Expertise</h3>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <span className="text-blue-400 font-semibold">System Architecture</span> • 
              <span className="text-green-400 font-semibold"> Performance Optimization</span> • 
              <span className="text-purple-400 font-semibold"> API Design</span> • 
              <span className="text-orange-400 font-semibold"> Database Tuning</span> • 
              <span className="text-pink-400 font-semibold"> Microservices</span> • 
              <span className="text-cyan-400 font-semibold"> Caching Strategies</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}