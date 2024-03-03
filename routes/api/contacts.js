/** @format */

const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("../../models/contacts");

router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newContact = await addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await removeContact(id);
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const updatedContact = await updateContact(id, { name, email, phone });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.patch("/:contactId/favorite", async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (typeof favorite === "undefined") {
    return res.status(400).json({ message: "Missing field favorite" });
  }

  try {
    const updatedContact = await updateStatusContact(contactId, { favorite });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
