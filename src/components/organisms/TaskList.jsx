import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/molecules/TaskCard";
const TaskList = ({ 
  tasks, 
  categories, 
  loading, 
  error, 
  onToggle, 
  onEdit, 
  onDelete, 
  onRetry,
  emptyType = "tasks",
  onSelectionChange,
  selectedTasks = [],
  onStartTimer,
  onStopTimer
}) => {
  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} type="tasks" />;
  }

  if (!tasks || tasks.length === 0) {
    return <Empty type={emptyType} />;
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
<TaskCard
            key={task.Id}
            task={task}
            categories={categories}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelectionChange={onSelectionChange}
            isSelected={selectedTasks?.includes(task.Id)}
            onStartTimer={onStartTimer}
            onStopTimer={onStopTimer}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;