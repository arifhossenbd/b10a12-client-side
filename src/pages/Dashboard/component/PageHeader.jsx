import { motion } from "framer-motion";
import { format } from 'date-fns';

const PageHeader = ({ title, roleData, quickAction }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {title}
            <motion.span 
              className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ["0 1px 2px rgba(0,0,0,0.1)", "0 2px 4px rgba(0,0,0,0.15)", "0 1px 2px rgba(0,0,0,0.1)"]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {roleData.badge} Mode
            </motion.span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        
        {quickAction && (
          <motion.button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={quickAction.onClick}
          >
            {quickAction.icon && <quickAction.icon className="text-sm" />}
            {quickAction.label}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;