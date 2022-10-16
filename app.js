// import express
const express = require('express')
// import cors middleware
const cors  = require('cors')
// import path
const path = require('path')
//import body-parser
const bodyParser = require('body-parser')
//import cookie-parser
const cookieParser = require('cookie-parser')
// import express-session
const session = require('express-session')
// create server instance
const app = express()

//====================== add to router_handle ==============
// // import art-template
const template = require('art-template')
// //  import dateformat
// const dateformat = require('dateformat')
// // import template variable
// template.defaults.imports.dateFormat = dateformat
// // const html = template('view.html', {time: new Date()})
// // {{dateFormat(time, 'mm-dd-yyyy')}}

const indexof = function(substr, str){
    if (str.indexOf(substr) !== -1){
        return true
    }
    return false
}
template.defaults.imports.indexOf = indexof

const lower = function(str){
    return str.toString().toLowerCase()
}
template.defaults.imports.lower = lower

// set up template root dectory
template.defaults.root = path.join(__dirname, 'views')
// set up template's defaut extended name 
template.defaults.extname = '.html'  // '.art'
//====================== add to router_handle end ==============


//import router module
// import connect db router
require('./config/DBConnect') //由于没有返回值，不需要设置变量
// import index router
const indexRouter = require('./router/index')
// import file router
const fileRouter = require('./router/file')
// import imputation router
const imputationRouter = require("./router/imputation")
// import merging router
const mergingRouter = require("./router/merging")


// load template engine
app.engine('html', require('express-art-template'))
app.engine('html', require('ejs').renderFile);

// register cors middleware as global middleware
// app.use(cors({origin:'http://127.0.0.1:80', credentials: true}))
app.use(cors())

// encode application/x-www-form-urlencoded formart's form
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//add router to static files
app.use('/static', express.static(path.join(__dirname, 'static')))
//add router to controller files
app.use('/ctrl', express.static(path.join(__dirname, 'controller')))
//add router to node_modules files
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
// //add router to uploads files
// app.use('/uploads', express.static(__dirname + '/uploads'))

//add router to views files
app.set('views', path.join(__dirname, 'views'))

app.use(cookieParser())
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 1000 * 60 * 60}
}))


app.all('*', function (req, res, next) {    
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:80");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "get, post");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials",'true');
    // res.header("Access-Control-Allow-Credentials", true);
    // res.header("X-Powered-By", ' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// set session
app.post('/setsession', (req, res)=>{
    console.log('setsession ' + req.body.version)
    req.session.VERSION = req.body.version
    console.log('set session: ' + req.session.VERSION)
    res.json({version: req.session.VERSION})
})

// Set url with router
app.use('/files', fileRouter);
app.get('/conndb', (req, res) => {db})
app.use("/imputation", imputationRouter)
app.use("/merging", mergingRouter)
app.use('/', indexRouter);


// assign port and run server
app.listen(80, () => {
    console.log('server running at http://127.0.0.1/')
})

// exports app
module.exports.app = app;
module.exports.template = template;