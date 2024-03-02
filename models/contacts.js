/** @format */

const fs = require("fs").promises;
const path = require("path");

const contactsFilePath = path.join(__dirname, "../models/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsFilePath, "utf8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    throw new Error("Unable to list contacts"); // Corectare
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return contact;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      throw new Error("Missing required fields");
    }
    const contacts = await listContacts();
    const newContact = { id: Date.now().toString(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      throw new Error("Missing required fields");
    }
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts[index] = { id: contactId, name, email, phone };
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts.splice(index, 1);
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
    return { message: "Contact deleted" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
