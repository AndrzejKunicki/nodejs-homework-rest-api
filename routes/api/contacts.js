const express = require("express");
const router = express.Router();
const Contacts = require("../../model");
const { UpdatePerson, CreatePerson } = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const results = await Contacts.listContacts();
    return res.json({ status: "succes", code: 200, data: { results } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await Contacts.getContactById(req.params.contactId);
    if (result) {
      return res.json({ status: "succes", code: 201, data: { result } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", CreatePerson, async (req, res, next) => {
  try {
    const result = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "succes", code: 201, data: { result } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await Contacts.removeContact(req.params.contactId);
    if (result) {
      return res.json({ status: "succes", code: 201, data: { result } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", UpdatePerson, async (req, res, next) => {
  try {
    const result = await Contacts.updateContact(req.params.contactId, req.body);
    if (result) {
      return res.json({ status: "succes", code: 201, data: { result } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
