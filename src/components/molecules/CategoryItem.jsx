import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const CategoryItem = ({ category, isActive }) => {
  return (
    <NavLink
      to={`/category/${category.Id}`}
      className={({ isActive }) =>
        `block p-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
            : "text-gray-700 hover:bg-gray-50"
        }`
      }
    >
      <motion.div
        className="flex items-center gap-3"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <ApperIcon name={category.icon} size={18} />
        <span className="font-medium flex-1">{category.name}</span>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
          {category.taskCount}
        </span>
      </motion.div>
    </NavLink>
  );
};

export default CategoryItem;