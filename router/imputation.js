const express = require("express");
const router = express.Router();

const imputationController = require("../router_handler/imputationController");

router.get("/", imputationController.selection_database)

router.post("/", imputationController.database_infos)

router.post("/result", imputationController.postResult)


module.exports = router;