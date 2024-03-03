/** @format */

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = {
  listContacts: async () => {
    try {
      const contacts = await Contact.find();
      return contacts;
    } catch (error) {
      throw new Error("Unable to list contacts");
    }
  },

  getContactById: async (contactId) => {
    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        throw new Error("Contact not found");
      }
      return contact;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addContact: async (body) => {
    try {
      const { name, email, phone } = body;
      if (!name || !email || !phone) {
        throw new Error("Missing required fields");
      }
      const newContact = await Contact.create({ name, email, phone });
      return newContact;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateContact: async (contactId, body) => {
    try {
      const { name, email, phone } = body;
      if (!name || !email || !phone) {
        throw new Error("Missing required fields");
      }
      const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        { name, email, phone },
        { new: true }
      );
      if (!updatedContact) {
        throw new Error("Contact not found");
      }
      return updatedContact;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  removeContact: async (contactId) => {
    try {
      const deletedContact = await Contact.findByIdAndDelete(contactId);
      if (!deletedContact) {
        throw new Error("Contact not found");
      }
      return { message: "Contact deleted" };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateStatusContact: async (contactId, body) => {
    try {
      const { favorite } = body;
      if (typeof favorite === "undefined") {
        throw new Error("Missing field favorite");
      }

      const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        { favorite },
        { new: true }
      );

      if (!updatedContact) {
        throw new Error("Contact not found");
      }

      return updatedContact;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
