import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  tasks, 
  categories, 
  loading, 
  error, 
  onToggle, 
  onEdit, 
  onDelete, 
  onRetry,
  emptyType = "tasks"
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
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;