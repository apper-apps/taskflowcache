import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import TaskStats from "@/components/organisms/TaskStats";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskFilters from "@/components/molecules/TaskFilters";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";

const TaskManager = () => {
  const { categoryId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
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

  const handleStartTimer = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const { startTimer } = await import("@/utils/taskUtils");
      const updatedTask = startTimer(task);

      const savedTask = await taskService.update(taskId, {
        activeTimer: updatedTask.activeTimer
      });

      setTasks(prev => prev.map(t => 
        t.Id === taskId ? savedTask : t
      ));

      toast.success("Timer started!");
    } catch (err) {
      toast.error("Failed to start timer");
    }
  };

  const handleStopTimer = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const { stopTimer } = await import("@/utils/taskUtils");
      const updatedTask = stopTimer(task);

      const savedTask = await taskService.update(taskId, {
        activeTimer: updatedTask.activeTimer,
        totalDuration: updatedTask.totalDuration,
        timerEntries: updatedTask.timerEntries
      });

      setTasks(prev => prev.map(t => 
        t.Id === taskId ? savedTask : t
      ));

      toast.success("Timer stopped!");
    } catch (err) {
      toast.error("Failed to stop timer");
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return;
    
    try {
      const incompleteTasks = selectedTasks.filter(taskId => {
        const task = tasks.find(t => t.Id === taskId);
        return task && !task.completed;
      });
      
      if (incompleteTasks.length === 0) {
        toast.info("All selected tasks are already completed");
        return;
      }
      
      // Update all selected incomplete tasks
      const updatePromises = incompleteTasks.map(taskId => 
        taskService.update(taskId, { completed: true })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      setTasks(prev => prev.map(task => 
        incompleteTasks.includes(task.Id) 
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task
      ));
      
      // Clear selection
      setSelectedTasks([]);
      
      // Update stats
      const updatedStats = await taskService.getStats();
      setStats(updatedStats);
      
      toast.success(`${incompleteTasks.length} task${incompleteTasks.length > 1 ? 's' : ''} marked as complete!`);
    } catch (err) {
      toast.error("Failed to complete selected tasks");
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

  const handleTaskSelection = (taskId, isSelected) => {
    setSelectedTasks(prev => 
      isSelected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleSelectAll = () => {
    const filteredTaskIds = filteredTasks.map(t => t.Id);
    setSelectedTasks(prev => 
      prev.length === filteredTaskIds.length 
        ? [] 
        : filteredTaskIds
    );
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
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
/>

      {selectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-primary font-medium">
                {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkComplete}
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Mark selected complete
              </button>
            </div>
          </div>
        </motion.div>
      )}

<TaskList
        tasks={filteredTasks}
        categories={categories}
        onToggle={handleToggleTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onRetry={loadData}
        emptyType={filters.search ? "search" : categoryId ? "category" : "tasks"}
        onSelectionChange={handleTaskSelection}
        selectedTasks={selectedTasks}
        onSelectAll={handleSelectAll}
        onStartTimer={handleStartTimer}
        onStopTimer={handleStopTimer}
      />
    </div>
  );
};

export default TaskManager;