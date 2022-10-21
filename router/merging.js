const express = require("express");
const router = express.Router();

const mergingController = require("../router_handler/mergingController");

router.get("/", mergingController.database_infos)

router.post("/result", mergingController.mergingResult)

router.get("/result", mergingController.refreshMergingResult)

router.put("/result", mergingController.changeName)

module.exports = router;