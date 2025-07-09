import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ title, value, icon, color = "primary", trend, className }) => {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "from-accent to-green-500";
      case "warning":
        return "from-warning to-yellow-500";
      case "danger":
        return "from-red-500 to-red-600";
      case "info":
        return "from-info to-blue-500";
      default:
        return "from-primary to-secondary";
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? "text-green-600" : "text-red-600"}`}>
              <ApperIcon 
                name={trend.positive ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className="inline mr-1"
              />
              {trend.value}
            </p>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClasses()} flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;