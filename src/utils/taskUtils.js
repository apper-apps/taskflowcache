export const filterTasks = (tasks, filters) => {
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

export const sortTasks = (tasks, sortBy = "order", ascending = true) => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "dueDate":
        const dateA = new Date(a.dueDate || "9999-12-31");
        const dateB = new Date(b.dueDate || "9999-12-31");
        comparison = dateA - dateB;
        break;
      case "created":
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case "order":
      default:
        comparison = a.order - b.order;
        break;
    }
    
    return ascending ? comparison : -comparison;
  });
};

export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(t => 
    !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "#EF4444";
    case "medium":
      return "#F59E0B";
    case "low":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};

export const validateTask = (task) => {
  const errors = {};
  
  if (!task.title?.trim()) {
    errors.title = "Task title is required";
  }
  
  if (task.title && task.title.length > 200) {
    errors.title = "Task title must be less than 200 characters";
  }
  
  if (task.description && task.description.length > 1000) {
    errors.description = "Description must be less than 1000 characters";
  }
  
  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    errors.dueDate = "Due date cannot be in the past";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};