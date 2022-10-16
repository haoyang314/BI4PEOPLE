// import express module
const express = require('express')
const path = require('path')
// create Router Object
const router = express.Router()
// import router handler module
const fileHandler = require(path.join(__dirname, '../router_handler','file'))
const multer = require('multer')
//import app
const app = require('../app')




router.get('/', fileHandler.upload)

// // // ============== Way 1 =======================
// const upload = multer({
//     dest: 'uploads/'
//     // dest: path.join(__dirname, "../uploads/")
// })
// router.post('/', upload.any() , fileHandler.getFile)

// ===============Way 2 =======================
const myStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        console.log('file ' + file)
        cb(null,'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null,  file.originalname)
    }
})
const upload = multer({storage:myStorage, 
    // limits: {fileSize:10}
})
// upload.any() == upload.array("file") or upload.single("file")
router.post('/', upload.any() , fileHandler.getMeasures) //=============== Way 2 and 3 ==================

// ===============Way 3 =======================
router.post('/upload', fileHandler.isExisted)

// // ================ Way 4 ======================
// router.post('/', fileHandler.getFile)
// router.post('/', fileHandler.uploadFile)


router.post('/:id/schema', fileHandler.getSchema)
router.post('/:id/editname', fileHandler.editName)
router.post('/:id/editschema', fileHandler.editSchema)
router.post('/:id/adddb', fileHandler.generateDB)
router.post('/:id/datedim', fileHandler.dateDimension)

module.exports = router