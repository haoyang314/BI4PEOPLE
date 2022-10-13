// // import oracledb module
// const oracle = require('oracledb')

// //connect to oracle
// const db = oracle.getConnection(
//     {
//         user:'orcl',
//         password: 'cynini0828',
//         connectString : "ORACLE_DEV_DB_TNS_NAME"
//     },
//     connExecute
// )

// import mongodb module
const mongoose = require('mongoose')
// connect to mongodb
const db = mongoose.connect('mongodb://localhost/dbname', {useNewUrlParser:true})
.then(() => console.log('Connect to BD sucessfully!'))
.catch(() => console.log('Connect to BD failed!'))


exports.db = db