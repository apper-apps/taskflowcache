import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "tasks", onAction, actionText = "Add Task" }) => {
  const getEmptyContent = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "ListTodo",
          title: "No tasks yet",
          description: "Start organizing your day by adding your first task.",
          gradient: "from-primary to-secondary"
        };
      case "completed":
        return {
          icon: "CheckCircle",
          title: "No completed tasks",
          description: "Complete some tasks to see them here.",
          gradient: "from-accent to-green-500"
        };
      case "category":
        return {
          icon: "FolderOpen",
          title: "No tasks in this category",
          description: "Add tasks to this category to see them here.",
          gradient: "from-secondary to-primary"
        };
      case "search":
        return {
          icon: "Search",
          title: "No matching tasks",
          description: "Try adjusting your search terms or filters.",
          gradient: "from-info to-blue-500"
        };
      case "overdue":
        return {
          icon: "Clock",
          title: "No overdue tasks",
          description: "Great! You're staying on top of your schedule.",
          gradient: "from-accent to-green-500"
        };
      default:
        return {
          icon: "Smile",
          title: "Nothing here",
          description: "This area is empty right now.",
          gradient: "from-gray-400 to-gray-500"
        };
    }
  };

  const { icon, title, description, gradient } = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}
      >
        <ApperIcon 
          name={icon} 
          size={36} 
          className="text-white" 
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 max-w-md text-lg"
      >
        {description}
      </motion.p>

      {onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-semibold text-lg`}
        >
          <ApperIcon name="Plus" size={20} />
          {actionText}
        </motion.button>
      )}

      {type === "search" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-wrap gap-2 justify-center"
        >
          <span className="text-sm text-gray-500">Try searching for:</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">meeting</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">project</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">urgent</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;