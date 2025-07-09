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

// Recurring task utilities
export const generateRecurringInstances = (template, startDate, endDate) => {
  const instances = [];
  const { interval, frequency, exceptions = [] } = template.recurringConfig;
  
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  
  while (currentDate <= finalDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Skip if this date is in exceptions
    if (!exceptions.includes(dateString)) {
      const instance = {
        ...template,
        Id: undefined, // Will be assigned by service
        title: template.title,
        description: template.description,
        templateId: template.Id,
        isRecurring: true,
        dueDate: new Date(currentDate).toISOString(),
        createdAt: new Date().toISOString(),
        completed: false,
        completedAt: null
      };
      instances.push(instance);
    }
    
    // Calculate next occurrence
    currentDate = calculateNextOccurrence(currentDate, interval, frequency);
  }
  
  return instances;
};

export const calculateNextOccurrence = (currentDate, interval, frequency) => {
  const nextDate = new Date(currentDate);
  
  switch (interval) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + frequency);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (frequency * 7));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + frequency);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
};

export const isValidRecurringConfig = (config) => {
  if (!config || typeof config !== 'object') return false;
  
  const { interval, frequency } = config;
  
  if (!['daily', 'weekly', 'monthly'].includes(interval)) return false;
  if (!Number.isInteger(frequency) || frequency < 1) return false;
  
  return true;
};

export const generateTemplateInstances = (template, options = {}) => {
  const {
    startDate = new Date(),
    daysAhead = 30
  } = options;
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + daysAhead);
  
  return generateRecurringInstances(template, startDate, endDate);
};

export const getRecurringTaskStats = (tasks) => {
  const recurringTasks = tasks.filter(t => t.isRecurring);
  const templates = tasks.filter(t => t.isTemplate);
  
  return {
    totalRecurring: recurringTasks.length,
    totalTemplates: templates.length,
    completedRecurring: recurringTasks.filter(t => t.completed).length,
    activeTemplates: templates.filter(t => !t.archived).length
  };
};

// Time tracking utilities
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0) return "0m";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

export const startTimer = (task) => {
  const now = new Date().toISOString();
  return {
    ...task,
    activeTimer: {
      startTime: now,
      isActive: true
    }
  };
};

export const stopTimer = (task) => {
  if (!task.activeTimer || !task.activeTimer.isActive) {
    return task;
  }
  
  const endTime = new Date().toISOString();
  const sessionDuration = calculateDuration(task.activeTimer.startTime, endTime);
  
  const newTimerEntry = {
    id: Date.now(),
    startTime: task.activeTimer.startTime,
    endTime: endTime,
    duration: sessionDuration
  };
  
  return {
    ...task,
    activeTimer: {
      startTime: null,
      isActive: false
    },
    totalDuration: (task.totalDuration || 0) + sessionDuration,
    timerEntries: [...(task.timerEntries || []), newTimerEntry]
  };
};

export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end - start) / 1000); // Return duration in seconds
};

export const getCurrentSessionDuration = (task) => {
  if (!task.activeTimer || !task.activeTimer.isActive) {
    return 0;
  }
  
  const now = new Date().toISOString();
  return calculateDuration(task.activeTimer.startTime, now);
};

export const getTotalTaskDuration = (task) => {
  let total = task.totalDuration || 0;
  
  // Add current session duration if timer is active
  if (task.activeTimer && task.activeTimer.isActive) {
    total += getCurrentSessionDuration(task);
  }
return total;
};