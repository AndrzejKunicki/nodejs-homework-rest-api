const express = require("express");
const router = express.Router();
const ctr = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  UpdatePerson,
  CreatePerson,
  UpdateStatusPerson,
  ValidateMongoId,
} = require("./validation");

router
  .get("/", guard, ctr.listContacts)
  .post("/", guard, CreatePerson, ctr.addContact);

router
  .get("/:contactId", guard, ValidateMongoId, ctr.getContactById)
  .delete("/:contactId", guard, ValidateMongoId, ctr.removeContact)
  .put("/:contactId", guard, ValidateMongoId, UpdatePerson, ctr.updateContact);

router.patch(
  "/:contactId/favorite",
  guard,
  UpdateStatusPerson,
  ctr.updateContact
);

module.exports = router;
