import stagesData from "@/services/mockData/stages.json";

let stages = [...stagesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const stageService = {
  async getAll() {
    await delay(200);
    return [...stages].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await delay(150);
    const stage = stages.find(s => s.Id === parseInt(id));
    if (!stage) {
      throw new Error(`Stage with ID ${id} not found`);
    }
    return { ...stage };
  },

  async create(stageData) {
    await delay(300);
    const maxId = Math.max(...stages.map(s => s.Id), 0);
    const maxOrder = Math.max(...stages.map(s => s.order), 0);
    const newStage = {
      ...stageData,
      Id: maxId + 1,
      order: maxOrder + 1
    };
    stages.push(newStage);
    return { ...newStage };
  },

  async update(id, stageData) {
    await delay(250);
    const index = stages.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Stage with ID ${id} not found`);
    }
    
    const updatedStage = {
      ...stages[index],
      ...stageData,
      Id: parseInt(id)
    };
    stages[index] = updatedStage;
    return { ...updatedStage };
  },

  async delete(id) {
    await delay(200);
    const index = stages.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Stage with ID ${id} not found`);
    }
    
    const deletedStage = { ...stages[index] };
    stages.splice(index, 1);
    return deletedStage;
  },

  async reorder(stageOrders) {
    await delay(300);
    stageOrders.forEach(({ id, order }) => {
      const stage = stages.find(s => s.Id === parseInt(id));
      if (stage) {
        stage.order = order;
      }
    });
    return [...stages].sort((a, b) => a.order - b.order);
  }
};