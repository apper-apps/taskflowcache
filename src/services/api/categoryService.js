import categoriesData from "@/services/mockData/categories.json";

let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(250);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(250);
    const categoryIndex = categories.findIndex(c => c.Id === parseInt(id));
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...updates
    };

    categories[categoryIndex] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(300);
    const categoryIndex = categories.findIndex(c => c.Id === parseInt(id));
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    categories.splice(categoryIndex, 1);
    return { success: true };
  },

  async updateTaskCount(categoryId, count) {
    await delay(100);
    const categoryIndex = categories.findIndex(c => c.Id === parseInt(categoryId));
    if (categoryIndex !== -1) {
      categories[categoryIndex].taskCount = count;
      return { ...categories[categoryIndex] };
    }
    throw new Error("Category not found");
  }
};