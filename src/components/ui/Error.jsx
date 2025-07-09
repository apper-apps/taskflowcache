import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, type = "general" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "ListTodo",
          title: "Failed to load tasks",
          description: "We couldn't fetch your tasks. Please try again."
        };
      case "categories":
        return {
          icon: "FolderOpen",
          title: "Failed to load categories",
          description: "We couldn't fetch your categories. Please try again."
        };
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Please check your internet connection and try again."
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Something went wrong",
          description: message || "An unexpected error occurred. Please try again."
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-red-600" 
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display text-xl font-semibold text-gray-900 mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-6 max-w-md"
      >
        {description}
      </motion.p>

      {onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;