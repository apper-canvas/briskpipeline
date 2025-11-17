import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    
    const deletedContact = { ...contacts[index] };
    contacts.splice(index, 1);
    return deletedContact;
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) {
      return [...contacts];
    }
    
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.position.toLowerCase().includes(searchTerm) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
};