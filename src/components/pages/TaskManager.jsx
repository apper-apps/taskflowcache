import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import TaskFilters from "@/components/molecules/TaskFilters";
import TaskStats from "@/components/organisms/TaskStats";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";

const TaskManager = () => {
  const { categoryId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "",
    category: categoryId || "",
    search: ""
  });

  useEffect(() => {
    loadData();
  }, [categoryId]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: categoryId || "" }));
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, categoriesData, statsData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
        taskService.getStats()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      
      // Update stats
      const updatedStats = await taskService.getStats();
      setStats(updatedStats);
      
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task");
      throw err;
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed
      });

      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updatedTask : t
      ));

      // Update stats
      const updatedStats = await taskService.getStats();
      setStats(updatedStats);
      
      toast.success(
        updatedTask.completed ? "Task completed!" : "Task marked as pending"
      );
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleEditTask = async (task) => {
    // TODO: Implement edit task modal
    console.log("Edit task:", task);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      
      // Update stats
      const updatedStats = await taskService.getStats();
      setStats(updatedStats);
      
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleClearSearch = () => {
    setFilters(prev => ({ ...prev, search: "" }));
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status === "completed" && !task.completed) return false;
      if (filters.status === "pending" && task.completed) return false;
      if (filters.status === "overdue" && (task.completed || !task.dueDate || new Date(task.dueDate) >= new Date())) return false;
      
      // Priority filter
      if (filters.priority && task.priority !== filters.priority) return false;
      
      // Category filter
      if (filters.category && task.categoryId !== parseInt(filters.category)) return false;
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return task.title.toLowerCase().includes(searchLower) ||
               task.description.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} type="tasks" />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          {categoryId ? 
            `Tasks in ${categories.find(c => c.Id === parseInt(categoryId))?.name || 'Category'}` :
            "All Tasks"
          }
        </h1>
        <p className="text-gray-600">
          Manage your tasks efficiently and stay organized
        </p>
      </motion.div>

      <QuickAddTask onAdd={handleAddTask} categories={categories} />

      <TaskStats stats={stats} />

      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        categories={categories}
      />

      <TaskList
        tasks={filteredTasks}
        categories={categories}
        onToggle={handleToggleTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onRetry={loadData}
        emptyType={filters.search ? "search" : categoryId ? "category" : "tasks"}
      />
    </div>
  );
};

export default TaskManager;