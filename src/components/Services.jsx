import React from 'react';
import { FaCode, FaServer, FaLaptopCode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Services = () => {

  const services = [
    {
      id: 1,
      title: "Personal Web Portfolio",
      price: 10,
      originalPrice: null,
      duration: "20 mins consultation",
      icon: <FaLaptopCode className="text-4xl text-purple-400" />,
      features: ["Requirement Discussion", "Project Scope Analysis", "Timeline Planning", "Cost Estimation"],
      popular: true,
      discount: "Token Amount - First Session (Non-refundable)"
    },
    {
      id: 2,
      title: "Product Design Sessions",
      price: 10,
      originalPrice: null,
      duration: "20 mins consultation",
      icon: <FaCode className="text-4xl text-green-400" />,
      features: ["Requirement Analysis", "Design Strategy", "Architecture Discussion", "Next Steps Planning"],
      popular: false,
      discount: "Token Amount - First Session (Non-refundable)"
    },
    {
      id: 3,
      title: "Idea to Product Consultation",
      price: 10,
      originalPrice: null,
      duration: "20 mins consultation",
      icon: <FaServer className="text-4xl text-blue-400" />,
      features: ["Idea Validation", "Technical Feasibility", "Market Analysis", "Implementation Roadmap"],
      discount: "Token Amount - First Session (Non-refundable)"
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
    <div name="Services" className="py-16 sm:py-20 px-2 sm:px-4 min-h-screen flex items-center overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-2 break-words">
            Professional <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-2">
            Expert development consultation tailored to your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0"
        >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl w-full max-w-full ${
                  service.popular 
                    ? 'border-blue-500 shadow-blue-500/20' 
                    : 'border-gray-700 hover:border-blue-500/50'
                }`}
              >
                {service.discount && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold max-w-full truncate">
                      {service.discount}
                    </span>
                  </div>
                )}
                {service.popular && !service.discount && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 break-words">{service.title}</h3>
                  <p className="text-gray-400">{service.duration}</p>
                </div>
                
                <div className="text-center mb-8">
                  {service.originalPrice && (
                    <div className="mb-2">
                      <span className="text-lg text-gray-400 line-through">${service.originalPrice}</span>
                    </div>
                  )}
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">${service.price}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    const serviceData = {
                      id: service.id,
                      title: service.title,
                      price: service.price,
                      originalPrice: service.originalPrice,
                      duration: service.duration,
                      features: service.features,
                      popular: service.popular,
                      discount: service.discount
                    };
                    localStorage.setItem('bookingService', JSON.stringify(serviceData));
                    window.open(`/book/${service.id}`, '_blank');
                  }}
                  className="w-full py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Book Now
                </button>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;