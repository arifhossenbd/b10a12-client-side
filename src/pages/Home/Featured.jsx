import {
  FaHandHoldingHeart,
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Featured = () => {
  const donationStats = [
    {
      value: "17",
      label: "Avg minutes per donation",
      icon: <FaClock className="text-red-500" />,
    },
    {
      value: "1M+",
      label: "Lives saved annually",
      icon: <FaUsers className="text-red-500" />,
    },
    {
      value: "48hr",
      label: "Blood shelf life",
      icon: <FaHandHoldingHeart className="text-red-500" />,
    },
  ];

  const donationProcess = [
    {
      step: "1",
      title: "Quick Registration",
      description: "Complete our 5-minute health screening",
      color: "bg-red-100 text-red-800",
    },
    {
      step: "2",
      title: "Painless Donation",
      description: "Takes less than 10 minutes with our experts",
      color: "bg-amber-100 text-amber-800",
    },
    {
      step: "3",
      title: "Save Lives",
      description: "Your donation helps up to 3 patients",
      color: "bg-green-100 text-green-800",
    },
  ];

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      {/* Main Header */}
      <header className="text-center mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
        >
          <span className="text-red-600">Blood Donation</span> Saves Lives
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
        >
          Discover how your donation makes an immediate impact and helps sustain
          critical blood supplies
        </motion.p>
      </header>

      {/* Urgent Alert */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-8 md:mb-12 rounded-r-lg max-w-xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex-shrink-0">
            <FaHandHoldingHeart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-red-800">
              Critical Shortage Alert
            </h3>
            <p className="text-red-600 text-sm sm:text-base mt-2">
              Type O- supplies dropped below 2 days stock.
              <span className="font-semibold animate-pulse"> Donate today.</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <FaMapMarkerAlt className="mr-1" /> Nearest center: 2.4 miles
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-red-800 border border-red-300">
                Next appointment: Today 3:00 PM
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Statistics */}
      <div className="mb-12 md:mb-16">
        <header className="text-center mb-6">
          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
          >
            Your <span className="text-red-600">Impact</span> By Numbers
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Every donation creates a ripple effect of lifesaving benefits
          </motion.p>
        </header>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6">
          {donationStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-red-50 mb-3">
                {stat.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Donation Process */}
      <div className="mb-12 md:mb-16">
        <header className="text-center mb-8">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
          >
            The <span className="text-red-600">Simple 3-Step</span> Process
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
          >
            From registration to saving lives - here's what to expect
          </motion.p>
        </header>
        <div className="relative">
          <div className="hidden sm:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-3/4 bg-gray-200 rounded-full"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {donationProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 text-center z-10"
              >
                <span
                  className={`absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full ${step.color} font-bold text-sm sm:text-base`}
                >
                  {step.step}
                </span>
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900"
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-sm sm:text-base text-gray-600"
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Donor Stories */}
      <div>
        <header className="text-center mb-8">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
          >
            Stories from <span className="text-red-600">Our Donors</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Hear from people who make a difference through regular donations
          </motion.p>
        </header>
        <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center mb-3"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold mr-3 sm:mr-4">
                  WM
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Waeskuruni Mia
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    25 donations since 2018
                  </p>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base text-gray-700 italic mb-3"
              >
                "Knowing my rare AB- blood helps cancer patients keeps me coming
                back every 8 weeks."
              </motion.blockquote>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-1 sm:gap-2"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Plasma Donor
                </span>
              </motion.div>
            </div>
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center mb-3"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 sm:mr-4">
                  PKS
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Partho Kumar Sarker
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    First-time donor
                  </p>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base text-gray-700 italic mb-3"
              >
                "The staff made my first donation so easy! I'll definitely
                return."
              </motion.blockquote>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-1 sm:gap-2"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  O+ Donor
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
