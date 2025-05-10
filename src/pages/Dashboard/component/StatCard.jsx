import {motion} from "framer-motion"
const StatCard = ({ title, value, icon: Icon, color, borderColor }) => {
  return (
    <motion.div
      className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border"
      style={{
        backgroundColor: `${color}1a`,
        color: color,
        borderColor: borderColor
      }}
      whileHover={{ y: -5 }}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div 
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;