import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import CategoryItem from "@/components/molecules/CategoryItem";
import Loading from "@/components/ui/Loading";

const Sidebar = ({ categories, loading, onAddCategory }) => {
  const navigationItems = [
    { 
      to: "/", 
      icon: "Home", 
      label: "All Tasks", 
      exact: true 
    },
    { 
      to: "/completed", 
      icon: "CheckCircle", 
      label: "Completed" 
    },
    { 
      to: "/overdue", 
      icon: "Clock", 
      label: "Overdue" 
    },
    { 
      to: "/today", 
      icon: "Calendar", 
      label: "Today" 
    }
  ];

  return (
    <motion.div
      className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="ListTodo" size={24} className="text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-gray-900">TaskFlow</h1>
        </motion.div>

        <nav className="space-y-2 mb-8">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-gray-900">Categories</h2>
            <button
              onClick={onAddCategory}
              className="p-1 text-gray-400 hover:text-primary transition-colors"
            >
              <ApperIcon name="Plus" size={16} />
            </button>
          </div>

          <div className="space-y-1">
            {loading ? (
              <Loading type="categories" />
            ) : (
              categories.map((category) => (
                <CategoryItem
                  key={category.Id}
                  category={category}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;