import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const QuickAddTask = ({ onAdd, categories = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: "",
    isTemplate: false,
    recurringConfig: {
      interval: "day",
      frequency: 1
    }
  });

  const categoryOptions = [
    { value: "", label: "Select category..." },
    ...categories.map(cat => ({ value: cat.Id, label: cat.name }))
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
];

  const intervalOptions = [
    { value: "day", label: "Day(s)" },
    { value: "week", label: "Week(s)" },
    { value: "month", label: "Month(s)" },
    { value: "year", label: "Year(s)" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const taskData = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      await onAdd(taskData);
      
// Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        priority: "medium",
        dueDate: "",
        isTemplate: false,
        recurringConfig: {
          interval: "day",
          frequency: 1
        }
      });
      setIsExpanded(false);
      
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleQuickAdd = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formData.title.trim()) {
        await handleSubmit(e);
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <FormField
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Add a new task..."
              onKeyDown={handleQuickAdd}
              className="text-lg"
            />
          </div>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            <ApperIcon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
          
          <Button type="submit" className="shrink-0">
            <ApperIcon name="Plus" size={20} />
          </Button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <FormField
              type="textarea"
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task description..."
              rows={2}
            />
            
            <FormField
              type="select"
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categoryOptions}
            />
            
            <FormField
              type="select"
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={priorityOptions}
            />
            
            <FormField
              type="datetime-local"
              label="Due Date"
              name="dueDate"
value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isTemplate}
                  onChange={(e) => setFormData({ ...formData, isTemplate: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                Create as recurring template
              </label>
            </div>
            
            {formData.isTemplate && (
              <>
                <FormField
                  type="select"
                  label="Repeat Every"
                  name="interval"
                  value={formData.recurringConfig.interval}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    recurringConfig: { ...formData.recurringConfig, interval: e.target.value }
                  })}
                  options={intervalOptions}
                />
                
                <FormField
                  type="number"
                  label="Frequency"
                  name="frequency"
                  value={formData.recurringConfig.frequency}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    recurringConfig: { ...formData.recurringConfig, frequency: parseInt(e.target.value) || 1 }
                  })}
                  min="1"
                  placeholder="1"
                />
              </>
            )}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default QuickAddTask;