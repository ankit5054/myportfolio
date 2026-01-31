import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "ankit.mishra9780@gmail.com",
      link: "mailto:ankit.mishra9780@gmail.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "India",
      link: null
    }
  ];

  return (
    <div name="Contact" className="py-16 sm:py-20 px-4 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Let's <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Ready to collaborate? Let's build something amazing together.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
        >
          {contactInfo.map((info, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-800/30 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-4">
                {info.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{info.title}</h3>
              {info.link ? (
                <a href={info.link} className="text-gray-400 hover:text-blue-400 transition-colors">
                  {info.value}
                </a>
              ) : (
                <p className="text-gray-400">{info.value}</p>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;