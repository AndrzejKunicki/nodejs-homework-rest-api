const express = require("express");
const router = express.Router();
const ctr = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

router.post("/signup", ctr.register);
router.post("/login", ctr.login);
router.post("/logout", guard, ctr.logout);
router.post("/current", guard, ctr.current);

module.exports = router;
