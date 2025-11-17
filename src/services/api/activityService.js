import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    return { ...activity };
  },

  async getByContactId(contactId) {
    await delay(250);
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getByDealId(dealId) {
    await delay(250);
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async create(activityData) {
    await delay(400);
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
      dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
      timestamp: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id),
      contactId: activityData.contactId ? parseInt(activityData.contactId) : activities[index].contactId,
      dealId: activityData.dealId ? parseInt(activityData.dealId) : activities[index].dealId
    };
    activities[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    const deletedActivity = { ...activities[index] };
    activities.splice(index, 1);
    return deletedActivity;
  },

  async getRecent(limit = 10) {
    await delay(200);
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  async getByType(type) {
    await delay(200);
    return activities
      .filter(a => a.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};