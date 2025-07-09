import tasksData from "@/services/mockData/tasks.json";
import React from "react";
import Error from "@/components/ui/Error";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByCategory(categoryId) {
    await delay(300);
    return tasks.filter(t => t.categoryId === parseInt(categoryId));
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(350);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates
    };

    // Handle completion status
    if (updates.completed !== undefined) {
      updatedTask.completedAt = updates.completed ? new Date().toISOString() : null;
    }

    tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    tasks.splice(taskIndex, 1);
    return { success: true };
  },

  async reorder(taskId, newOrder) {
    await delay(250);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    tasks[taskIndex].order = newOrder;
    return { ...tasks[taskIndex] };
  },

  async search(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery)
    );
  },

  async getStats() {
    await delay(200);
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
  },
  // Template operations
  async createTemplate(templateData) {
    await delay(400);
    const newTemplate = {
      ...templateData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      isTemplate: true,
      isRecurring: true,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1,
      archived: false
    };
    tasks.push(newTemplate);
    return { ...newTemplate };
  },

  async getTemplateById(id) {
    await delay(200);
    const template = tasks.find(t => t.Id === parseInt(id) && t.isTemplate);
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  },

  async getTemplates() {
    await delay(300);
    return tasks.filter(t => t.isTemplate && !t.archived);
  },

  async updateTemplate(id, updates) {
    await delay(350);
    const templateIndex = tasks.findIndex(t => t.Id === parseInt(id) && t.isTemplate);
    if (templateIndex === -1) {
      throw new Error("Template not found");
    }
    
    const updatedTemplate = {
      ...tasks[templateIndex],
      ...updates
    };

    tasks[templateIndex] = updatedTemplate;
    return { ...updatedTemplate };
  },

  async deleteTemplate(id) {
    await delay(300);
    const templateIndex = tasks.findIndex(t => t.Id === parseInt(id) && t.isTemplate);
    if (templateIndex === -1) {
      throw new Error("Template not found");
    }
    
    // Archive template instead of deleting
    tasks[templateIndex].archived = true;
    return { success: true };
  },

  async generateInstancesFromTemplate(templateId, options = {}) {
    await delay(400);
    const template = tasks.find(t => t.Id === parseInt(templateId) && t.isTemplate);
    if (!template) {
      throw new Error("Template not found");
    }

    const { generateRecurringInstances } = await import("@/utils/taskUtils");
    const startDate = options.startDate || new Date();
    const endDate = options.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const instances = generateRecurringInstances(template, startDate, endDate);
    
    // Add instances to tasks array with proper IDs
    const newInstances = instances.map(instance => ({
      ...instance,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      order: tasks.length + 1
    }));
    
tasks.push(...newInstances);
    return [...newInstances];
  }
};