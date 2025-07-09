import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDuration, getTotalTaskDuration } from "@/utils/taskUtils";
const TaskCard = ({ task, onToggle, onEdit, onDelete, categories = [], onSelectionChange, isSelected, onStartTimer, onStopTimer }) => {
  const category = categories.find(c => c.Id === task.categoryId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityBorder = () => {
    switch (task.priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-low";
    }
  };

  return (
    <motion.div
      className={`task-card bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${getPriorityBorder()} ${
        task.completed ? "opacity-75" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      layout
    >
<div className="flex items-start gap-4">
        {onSelectionChange && (
          <div className="selection-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange(task.Id, e.target.checked)}
              className="cursor-pointer"
            />
            <div className="selection-checkmark"></div>
          </div>
        )}
        
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.Id)}
            className="cursor-pointer"
          />
          <div className="checkmark"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-gray-900 ${task.completed ? "line-through" : ""}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <ApperIcon 
                name="Flag" 
                size={16} 
                className={getPriorityColor()}
              />
              <button
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
              <button
                onClick={() => onDelete(task.Id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`text-gray-600 mt-2 ${task.completed ? "line-through" : ""}`}>
              {task.description}
            </p>
          )}

<div className="flex items-center gap-4 mt-4">
            {category && (
              <Badge
                variant="outline"
                className="category-pill"
                style={{ backgroundColor: category.color }}
              >
                <ApperIcon name={category.icon} size={12} />
                {category.name}
              </Badge>
            )}

            {task.dueDate && (
              <div className={`flex items-center gap-1 text-sm ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}>
                <ApperIcon name="Calendar" size={14} />
                {format(new Date(task.dueDate), "MMM d, yyyy")}
                {isOverdue && (
                  <Badge variant="danger" size="sm" className="ml-2">
                    Overdue
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Time Tracking Section */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">
{formatDuration(getTotalTaskDuration(task))}
              </span>
              {task.activeTimer && task.activeTimer.isActive && (
                <div className="flex items-center gap-1 text-xs text-accent">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  Active
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {task.activeTimer && task.activeTimer.isActive ? (
                <button
                  onClick={() => onStopTimer && onStopTimer(task.Id)}
                  className="timer-btn timer-btn-stop"
                  title="Stop Timer"
                >
                  <ApperIcon name="Square" size={14} />
                </button>
              ) : (
                <button
                  onClick={() => onStartTimer && onStartTimer(task.Id)}
                  className="timer-btn timer-btn-start"
                  title="Start Timer"
                  disabled={task.completed}
                >
                  <ApperIcon name="Play" size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;