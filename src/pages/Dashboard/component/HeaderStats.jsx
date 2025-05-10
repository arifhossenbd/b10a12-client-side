import { motion } from "framer-motion";

const StatItem = ({ label, value }) => (
  <motion.div 
    className="text-center"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold">{value}</p>
  </motion.div>
);

const HeaderStats = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="hidden md:flex items-center gap-4">
      {stats.map((stat, index) => (
        <StatItem key={index} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

export default HeaderStats;