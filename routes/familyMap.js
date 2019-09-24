const express = require("express");
const router = express.Router();
router.use(express.json({limit: '1mb'}));
const Geolocation = require('../models/geolocation');

var {getFamilyMap } = require('../controllers/familyMap');

router.get("/familyMap", getFamilyMap);

router.post("/familyMap", (request, response) => {
    console.log(request.body);
    const data = request.body
    Geolocation.latitude = data.lat;
    Geolocation.longitude = data.lon;
    response.json({
        status: 'success',
        latitute: data.lat,
        longitute: data.lon
    });
});

module.exports = router;