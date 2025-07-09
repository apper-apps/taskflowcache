import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import CategoryItem from "@/components/molecules/CategoryItem";
import Loading from "@/components/ui/Loading";

const MobileSidebar = ({ isOpen, onClose, categories, loading, onAddCategory }) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed top-0 left-0 w-64 h-full bg-white z-50 lg:hidden overflow-y-auto"
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="ListTodo" size={24} className="text-white" />
                  </div>
                  <h1 className="font-display text-xl font-bold text-gray-900">TaskFlow</h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <nav className="space-y-2 mb-8">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    onClick={onClose}
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
                      <div key={category.Id} onClick={onClose}>
                        <CategoryItem category={category} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;