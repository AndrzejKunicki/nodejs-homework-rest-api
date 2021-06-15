const express = require("express");
const router = express.Router();
const ctr = require("../../../controllers/users");

router.post("/signup", ctr.register);
router.post("/login", ctr.login);
router.post("/logout", ctr.logout);

module.exports = router;
