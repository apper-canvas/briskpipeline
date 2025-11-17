import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    return { ...deal };
  },

  async getByContactId(contactId) {
    await delay(250);
    return deals.filter(d => d.contactId === parseInt(contactId));
  },

  async create(dealData) {
    await delay(400);
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      contactId: parseInt(dealData.contactId),
      value: parseFloat(dealData.value),
      probability: parseInt(dealData.probability),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
      contactId: dealData.contactId ? parseInt(dealData.contactId) : deals[index].contactId,
      value: dealData.value ? parseFloat(dealData.value) : deals[index].value,
      probability: dealData.probability ? parseInt(dealData.probability) : deals[index].probability,
      updatedAt: new Date().toISOString()
    };
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async updateStage(id, stage) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    // Update probability based on stage
    const probabilityMap = {
      "Lead": 20,
      "Qualified": 40,
      "Proposal": 60,
      "Negotiation": 75,
      "Closed Won": 100,
      "Closed Lost": 0
    };
    
    const updatedDeal = {
      ...deals[index],
      stage,
      probability: probabilityMap[stage] || deals[index].probability,
      updatedAt: new Date().toISOString()
    };
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    const deletedDeal = { ...deals[index] };
    deals.splice(index, 1);
    return deletedDeal;
  },

  async getByStage(stage) {
    await delay(200);
    return deals.filter(d => d.stage === stage);
  },

  async getPipelineMetrics() {
    await delay(300);
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const totalDeals = deals.length;
    const stageGroups = deals.reduce((acc, deal) => {
      if (!acc[deal.stage]) {
        acc[deal.stage] = { count: 0, value: 0 };
      }
      acc[deal.stage].count++;
      acc[deal.stage].value += deal.value;
      return acc;
    }, {});

    const wonDeals = deals.filter(d => d.stage === "Closed Won");
    const lostDeals = deals.filter(d => d.stage === "Closed Lost");
    const activeDeals = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));

    return {
      totalValue,
      totalDeals,
      activeDeals: activeDeals.length,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      winRate: totalDeals > 0 ? ((wonDeals.length / totalDeals) * 100) : 0,
      averageDealSize: totalDeals > 0 ? (totalValue / totalDeals) : 0,
      stageBreakdown: stageGroups
    };
  }
};