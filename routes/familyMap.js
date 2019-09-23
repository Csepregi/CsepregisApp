const express = require("express");
const router = express.Router();

var {getFamilyMap } = require('../controllers/familyMap');

router.get("/familyMap", getFamilyMap);

module.exports = router;