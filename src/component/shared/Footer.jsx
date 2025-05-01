import { motion } from "framer-motion";
import {
  FaChevronRight,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaDroplet, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Find Donors", path: "/donors" },
        { name: "Donate Blood", path: "/donate" },
        { name: "Blood Banks", path: "/blood-banks" },
        { name: "Campaigns", path: "/campaigns" },
      ],
    },
    {
      title: "Information",
      links: [
        { name: "About Us", path: "/about" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "FAQs", path: "/faqs" },
        { name: "Blog", path: "/blog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <footer className="bg-gradient-to-b from-red-50 to-white border-t border-red-200">
      <div className="px-4 lg:w-11/12 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="footer py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {/* Logo and Description */}
          <motion.div custom={0} variants={itemVariants} className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <FaDroplet className="text-red-600 text-2xl lg:text-3xl" />
              <span className="text-2xl font-bold text-gray-800">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </Link>
            <p className="text-gray-600">
              Connecting donors with those in need since 2023. Every drop counts
              in saving lives.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaXTwitter, FaInstagram, FaLinkedin].map(
                (Icon, i) => (
                  <motion.a
                    key={i}
                    custom={i + 1}
                    variants={itemVariants}
                    path="#"
                    className="text-red-600 hover:text-red-700 text-xl cursor-pointer"
                    whileHover={{ y: -3 }}
                  >
                    <Icon />
                  </motion.a>
                )
              )}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, i) => (
            <motion.nav
              key={section.title}
              custom={i + 1}
              variants={itemVariants}
              aria-label={section.title}
            >
              <h3 className="text-lg font-semibold text-red-600 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <motion.li
                    key={link.name}
                    custom={j}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={link.path}
                      className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <FaChevronRight className="text-xs text-red-400" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-red-200 py-6 text-center text-gray-500"
        >
          <div className="text-xs md:text-sm flex items-center flex-wrap justify-center gap-2 text-stone-400">
            © {new Date().getFullYear()}{" "}
            <Link to="/" className="font-medium">
              Blood<span className="text-red-600">Connect.</span>
            </Link>{" "}
            All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
