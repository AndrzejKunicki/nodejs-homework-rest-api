const express = require("express");
const router = express.Router();
const ctr = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

router.post("/signup", ctr.register);
router.post("/login", ctr.login);
router.post("/logout", guard, ctr.logout);
router.post("/current", guard, ctr.current);
router.patch("/avatars", guard, upload.single("avatar"), ctr.avatars);

module.exports = router;
