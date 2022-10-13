// import path and fs modules 
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const progress = require('progress-stream')
const multer = require('multer')
const { spawn, execSync } = require('child_process');
const exec = require('child_process').exec;
const { resolve } = require('path')
const { rejects } = require('assert')
const { networkInterfaces } = require('os')
const { FILE } = require('dns');
const { get } = require('http');

const template = require('art-template')
const { stdout, stderr } = require('process')

template.defaults.root = path.join(__dirname, "../views")
template.defaults.extname = '.html'

// ============ export functions start ===================

// ========================= Way 2 ========================
// get upload file
// exports.getFile = (req,res) => {
//     console.log('req.files ' + req.files)
//     if (!req.files){
//         throw Error("FILE_MISSING")
//     }else{
//         let dataToSend = []
//         req.files.forEach(file => {
//             dataToSend.push(file.originalname)        
//         })
//         // send data to browser
//         console.log("Stage 8 : dataToSend ==> " + dataToSend)  
//         if (dataToSend.length > 0) {
//             res.send(JSON.stringify({code: 201, result: dataToSend}))
//         }else{
//             res.send(JSON.stringify({code: 401}))
//         }

//     }
// }


// ========================= Way 3 ========================
exports.getFile = (req, res) => {
    console.log('req.files ' + req.files.length + " " + req.files + " " + req.files)
    if (!req.files) {
        throw Error("FILE_MISSING")
    } else {
        let dataToSends = []
        req.files.forEach(file => {
            // let code = getFD(req, res)               // console.log(result)
            let result = getFD1(file.originalname)
            console.log(`result  ${result}   ${result.code}  ${result.measures.length}`)
            dataToSends.push(result)             // console.log(result)

            // if (result.code===1) {
            //     dataToSend.push({"file": file.originalname, "code":401, "msg": 'Find maeasures failed'})   
            // }else if(result.code===401){
            //     dataToSend.push({"file": file.originalname, "code":401, "msg": 'Read results failed'})   
            // }else{
            //     dataToSend.push({file: file.originalname, code:200, measure: result.measure, others: result.others})     
            // }
        })


        // for (let i = 0; i < files.length; i ++) {
        //     console.log('Each file ==> ' + files[i]+" file name: " + files[i].originalname)
        //     dataToSend.push(files[i].originalname)       
        // }

        // send data to browser
        console.log("Stage 8 : dataToSend ==> " + dataToSends.length + " " + dataToSends[0] + " " + dataToSends[0].code   + " " + dataToSends[0].measures)
        // const html = template(path.join(__dirname, '../views/', 'file.html'), {
        //     files: dataToSend
        // })

        res.render(path.join(__dirname, '../views/', 'file.html'), { files: dataToSends }) //============
        res.end()


        // if (dataToSend.length > 0) {
        //     res.end(html)
        // }else{
        //     res.json({code:401, msg: 'Upload files failed'})
        // }

    }
}


// // ========================= Way 4 ========================
// const myStorage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         console.log('file ' + file)
//         cb(null,'uploads/')
//     },
//     filename: (req, file, cb) => {
//         cb(null,  file.originalname)
//         // cb(null,  file.originalname + "_" + Date.now())
//     }
// })
// const upload = multer({storage:myStorage, 
//     // limits: {fileSize:10}
// })

// exports.getFile = (req,res, next) => {
//     // create progress stream nstance
//     var p = progress({length: '0'}) // set length 0
//     req.pipe(p)
//     p.header = req.header

//     // // get the real length of upload file for multipart
//     // p.on('length', networkInterfaces = (realLength) => {
//     //     console.log('realLength : %s', realLength)
//     //     p.setLength(realLength)
//     // })

//     // get upload progress
//     // p.on('progress', _)
//     p.on('progress', (obj) => {
//         console.log('progress : %s', obj.percentage)
//     })

//     // upload file
//     upload.any()(p, res, next) 
// }

// exports.uploadFile = (req, res, next) => {
//     res.json({code: 201})
// }



// =============== Is Existed =====================
exports.isExisted = async (req, res) => {
    console.log('Stage 4: req.body.files ' + req.body.filenames)
    console.log('Stage 4: req.body.files[0] ' + req.body.filenames[0])
    if (!req.body.filenames) {
        throw Error("FILE_MISSING")
    } else {
        var existList = []
        req.body.filenames.forEach(file => {
            var des_file = path.join(__dirname, '../uploads', file)
            if (isFileExisted(des_file)) {
                existList.push(file)
            }
        })

        console.log('Stage 5: existList ' + existList.length)
        if (existList.length > 0) {
            res.json({ code: 200, result: existList })
            // res.send(JSON.stringify({code: 200, result: existList}))
        } else {
            res.json({ code: 201 })
            // res.send(JSON.stringify({code:201}))
        }

    }
}

// ============ export functions end ===================


// middleware
// juge if file exist
function isFileExisted(path) {
    try {
        fs.accessSync(path, fs.F_OK)
    } catch (err) {
        return false;
    }
    return true;
}

// transform format for the data from python
var uint8arrayToString = function (data) {
    return String.fromCharCode.apply(null, data);
}

// get funtionnal dependance from python
function getFD1(filename) {
    let pypath = path.join(__dirname, '../python', 'measure.py')
    console.log(pypath)
    let hyfd = path.join(__dirname, '../python', 'HyFD', 'HyFD.jar')
    console.log(hyfd)
    let fpath = path.join(__dirname, '../uploads', filename)
    console.log(fpath)
    let code = 0
    exec('python ' + pypath + " " + fpath + " " + hyfd, (err, stdout, stderr) => {
        if (err) {
            code = 1
        }
        console.log(`stdout ${stdout}`)
    })

    console.log(`python code is ${code}`)

    var dataToSend = getJson(filename)
    console.log(`str2 ${dataToSend.name}  ${dataToSend.meausre}`)
    if (code !== 0) {
        dataToSend = { name: filename, code: 401, msg: 'Find maeasures failed' }
    } 
    return dataToSend
}


// get funtionnal dependance from python
function getFD2(filename) {
    let pypath = path.join(__dirname, '../python', 'measure.py')
    console.log(pypath)
    let hyfd = path.join(__dirname, '../python', 'HyFD', 'HyFD.jar')
    console.log(hyfd)
    let fpath = path.join(__dirname, '../uploads', filename)
    console.log(fpath)
    let code = 0
    let pythonout = execSync('python ' + pypath + " " + fpath + " " + hyfd)

    console.log(`python code is ${pythonout.toString()}`)

    var dataToSend = getJson(filename)
    console.log(`str2 ${dataToSend.name}  ${dataToSend.meausres}`)
    if (code !== 0) {
        dataToSend = { name: filename, code: 401, msg: 'Find maeasures failed' }
    } 
    return dataToSend
}

function getJson(filename) {
    let jsonpath = path.join(__dirname, "../json", filename.replace('csv', 'json'))
    console.log(`python jsonpath is ${jsonpath}`)
    // var json_result;
    // fs.readFile(jsonpath, 'utf-8', (err, data) => {
    //      if (err) {
    //         console.log(`err ${err}`)
    //         json_result = { name: filename, code: 401, msg: 'Read results failed' }
    //         // res.send(dataToSend)
    //     } else {
    //         data = JSON.parse(data)
    //         console.log(`json data ${data}`)
    //         console.log(`json data 1 ${data['measures']}  ${data['others']}`)
    //         json_result = {name: filename, code: 200, meausre: data['measures'], others: data['others'] }         
    //     }
    // })
    let data = JSON.parse(fs.readFileSync(jsonpath, 'utf-8'))
    let json_result = {name: filename, code: 200, measures: data['measures'], others: data['others']}  
    console.log(`json_result ${json_result.name}  ${json_result.code}  ${json_result.measures}`)
    console.log(`type of meausres ${typeof json_result.measures === "object"}`)
    return json_result
}


function getFD(filename) {
    // spawn new child process to call the python script
    // const python = spawn('python', ['script1.py', 12, 13]);
    // const python = spawn('python', ['E:\\Stage\\PythonProject\\process\\process.py','E:\\Stage\\datafile\\example_mesure2.csv' ]);
    let pypath = path.join(__dirname, '../python', 'measure.py')
    console.log(pypath)
    let hyfd = path.join(__dirname, '../python', 'HyFD', 'HyFD.jar')
    console.log(hyfd)
    let fpath = path.join(__dirname, '../uploads', filename)
    console.log(fpath)
    // let pypath = path.join(__dirname, '../python', 'script1.py')
    // const python = spawn('python', [pypath, 11, 13 ])
    const python = spawn('python', [pypath, fpath, hyfd])
    // collect data from script
    python.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`)
    })

    python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...')
        // console.log(`data recepted 1 ${data.toString()}`)
        let data_recu = uint8arrayToString(data).replace(/'/g, '"')
        // strdata = data.toString();
        // console.log(`data recepted 2 ${data_recu}`)
        console.log(`data recepted 2 ${data_recu}`)
        // let strdata = JSON.parse(data_recu)
        // console.log(`data recepted 3 ${strdata}`)
    })
    python.stdout.on('end', (code) => {
        console.log(`child process close all stdio with code ${code}`);

    })

    // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    // })

}
