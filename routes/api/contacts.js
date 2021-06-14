const express = require("express");
const router = express.Router();
const ctr = require("../../controllers/contacts");
const {
  UpdatePerson,
  CreatePerson,
  UpdateStatusPerson,
  ValidateMongoId,
} = require("./validation");

router.get("/", ctr.listContacts).post("/", CreatePerson, ctr.addContact);

router
  .get("/:contactId", ValidateMongoId, ctr.getContactById)
  .delete("/:contactId", ValidateMongoId, ctr.removeContact)
  .put("/:contactId", ValidateMongoId, UpdatePerson, ctr.updateContact);

router.patch("/:contactId/favorite", UpdateStatusPerson, ctr.updateContact);

module.exports = router;
