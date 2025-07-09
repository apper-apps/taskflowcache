import { format, isToday, isPast, isThisWeek } from "date-fns";

export const formatDate = (date, formatString = "MMM d, yyyy") => {
  if (!date) return "";
  return format(new Date(date), formatString);
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
};

export const getRelativeTime = (date) => {
  if (!date) return "";
  
  const taskDate = new Date(date);
  
  if (isToday(taskDate)) {
    return "Today";
  }
  
  if (isThisWeek(taskDate)) {
    return format(taskDate, "EEEE");
  }
  
  return format(taskDate, "MMM d");
};

export const sortByDate = (tasks, ascending = true) => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate || a.createdAt);
    const dateB = new Date(b.dueDate || b.createdAt);
    
    return ascending ? dateA - dateB : dateB - dateA;
  });
};