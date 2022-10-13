// import express module
const express = require('express')
const path = require('path')

// create Router Object
const router = express.Router()

// import router handler module
const indexHandler = require(path.join(__dirname,'../router_handler','index'))

// add ressource to router
// add index router
// router.get('/', (req, res) => {
//     console.log("get index!")
//     res.send("get index!")
// })
router.all('/', indexHandler.index)
module.exports = router
