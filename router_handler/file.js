// import path and fs modules 
const path = require('path')
const fs = require('fs')
const app = require('../app')
const progress = require('progress-stream')
const spawn = require('child_process').spawn;
const { execSync } = require('child_process');
const exec = require('child_process').exec;
const qs = require("querystring")
const multiparty = require('multiparty');
const { json } = require('express');
// import art-template
// const template = require('art-template')

//  import dateformat
// const dateformat = require('dateformat')
// // import template variable
// template.defaults.imports.dateFormat = dateformat
// // const html = template('view.html', {time: new Date()})
// {{dateFormat(time, 'mm-dd-yyyy')}}
// // set up template root dectory
// template.defaults.root = path.join(__dirname, "../views")
// // set up template's defaut extended name 
// template.defaults.extname = '.html'  // '.art'


// get upload page
exports.upload = (req, res) => {
    if (!req.session.VERSION) {
        req.session.VERSION = req.body.session
    }
    console.log("Upload : req.session ==> " + req.session.VERSION)

    var html = app.template('file', { session: req.session.VERSION, pagename: 'Generation' })
    res.end(html)
    // res.json({ session: req.session.VERSION, pagename: 'Generation' })
    // res.render(path.join(__dirname, '../views', 'file.html'))
}

// ========================= Way 3 ========================
exports.getMeasures = (req, res) => {
    console.log('req.files ' + req.files.length + " " + req.files + " " + req.files)
    if (!req.files) {
        throw Error("FILE_MISSING")
    } else {
        let dataToSends = []
        let filenames = []
        req.files.forEach(file => {

            let result = getFD1(file.originalname)
            // let result = getFD2(file.originalname)
            dataToSends.push(result)

        })

        // send data to browser
        console.log("Stage 8 : dataToSend ==> " + dataToSends.length + " " + dataToSends[0].filename + " " + dataToSends[0].code + " " + dataToSends[0].proposed_measures)
        // res.writeHead(200, { "Content-type": "text/html; charset=UTF-8" });

        // res.render(path.join(__dirname, '../views', 'file_measure.html'), { files: dataToSends })
        // res.end()
        console.log("Measure : req.session ==> " + req.session.VERSION)
        if (!req.session.VERSION) {
            req.session.VERSION = req.body.session
        }
        console.log("Measure : req.session after ==> " + req.session.VERSION)
        var html =  app.template('file_measure', { files: dataToSends, session: req.session.VERSION })
        res.end(html)
    }
}

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


exports.getSchema = (req, res) => {
    let form = new multiparty.Form()
    form.parse(req, function (err, fields, file) {
        console.log(fields)
        // data['session'] = fields.session
        // data['proposed_measure'] = fields.proposed_measure
        // data['additional_measure'] = fields.additional_measure

        console.log("Schema : req.session before ==> " + req.session.VERSION)
        if (!req.session.VERSION) {
            req.session.VERSION = fields.session
        }
        console.log("Schema : req.session after ==> " + req.session.VERSION)
        console.log('req.fields.proposed_measure ' + fields.proposed_measure)
        console.log('req.fields.additional_measure ' + fields.additional_measure)
        if (!req.params.id) {
            throw Error("FILE_MISSING")
        } else {
            let jsonpath = path.join(__dirname, "../json", req.params.id + '.json')
            let proposed_measure = fields.proposed_measure === undefined ? [] : [fields.proposed_measure.toString()]
            let additional_measure = fields.additional_measure === undefined ? [] : [fields.additional_measure.toString()]
            let measures = proposed_measure.concat(additional_measure)
            measures = measures.length === 0 ? null : measures
            console.log(`measure ${measures}`)
            let pypath = path.join(__dirname, '../python', 'hierarchy.py')
            console.log(`pypath : ${pypath}`)
            let fpath = path.join(__dirname, '../uploads', req.params.id + ".csv")
            console.log(`fpath ${fpath}`)
            const python = spawn('python', [pypath, fpath, jsonpath, measures])

            python.stderr.on('data', (data) => {
                console.error(`child stderr:\n${data}`)
            })

            python.stdout.on('data', (data) => {
                console.log('Pipe data from python script ...')
                let data_recu = uint8arrayToString(data).replace(/'/g, '"')
                // let data_recu = data.toString()
                console.log(`data recepted 2 ${data_recu}`)
                // let json_result = getJson(req.params.id + ".csv")

                let cls, schemastr = schemaStyle(data_recu)
                console.log(`schemastr ==> ${schemastr}`)

                // res.render(path.join(__dirname, '../views', 'file_schema.html'), { database: json_result, session: req.session.VERSION })
                // res.end()
                // var html = template('file_schema', { database: json_result, session: req.session.VERSION })
                var html = app.template('file_schema', { database: JSON.parse(data_recu), cls: cls, schema: schemastr, session: req.session.VERSION })
                res.end(html)
                // res.json({ database: json_result, session: req.session.VERSION })
            })

            python.stdout.on('end', (code) => {
                console.log(`child process close all stdio with code ${code}`);
            })
            console.log(`end ===== `)
        }
    })

}

exports.editName = (req, res) => {
    let jsonpath = path.join(__dirname, "../json", req.params.id + ".json")
    var jsondata = JSON.parse(fs.readFileSync(jsonpath))
    let form = new multiparty.Form()
    form.parse(req, function (err, fields, file) {
        for (let i = 0; i < jsondata.dimensions.length; i++) {
            var dim = "dimension" + i
            jsondata.dimensions[i].name = fields[dim]
            for (let j = 0; j < jsondata.dimensions[i].hierarchies.length; j++) {
                var hie = "hierarchy" + i + "_" + j
                jsondata.dimensions[i].hierarchies.name = fields[hie]
            }
        }

        for (let i = 0; i < jsondata.facts.length; i++) {
            var fact = "fact" + i
            jsondata.facts[i].name = fields[fact]
            console.log(`fact ${i} ${jsondata.facts[i].name} ${fields[fact]}`)
        }

        if (!req.session.VERSION) {
            req.session.VERSION = fields['session']
        }

        let jsondatastr = JSON.stringify(jsondata, undefined, 2)
        fs.writeFile(jsonpath, jsondatastr, (err) => {
            if (err) { res.json({ code: 400 }) }
            let cls, schemastr = schemaStyle(jsondatastr)
            res.json({ code: 200, cls: cls, schema: schemastr,})
        })
    })
}

exports.editSchema = (req, res) => {
    if (!req.params.id) {
        throw Error("FILE_MISSING")
    } else {
        let jsonpath = path.join(__dirname, "../json", req.params.id + ".json")
        var jsondata = JSON.parse(fs.readFileSync(jsonpath))
        // console.log(JSON.stringify(req.body.dimensions))
        // console.log(req.body.dimensions[0].name.toString().toLowerCase())
        jsondata.dimensions = req.body.dimensions
            jsondata.facts = req.body.facts
            if (!req.session.VERSION) {
                req.session.VERSION = req.body.session
            }
            fs.writeFile(jsonpath, JSON.stringify(jsondata, undefined, 2), (err) => {
                if (err) { res.json({ code: 400 }) }
                let cls, schemastr = schemaStyle(JSON.stringify(jsondata))
                var html = app.template('file_schema', { database: jsondata, cls: cls, schema: schemastr, session: req.session.VERSION })
                res.json({ code: 200, html: html})
            })
    }
}

exports.dateDimension = (req, res) => {
    if (!req.params.id) {
        throw Error("FILE_MISSING")
    } else {
        let jsonpath = path.join(__dirname, "../json", req.params.id + ".json")
        var jsondata = JSON.parse(fs.readFileSync(jsonpath))
        let form = new multiparty.Form()
        form.parse(req, function (err, fields, file) {
            jsondata.dimensions[fields.index].attributes = fields.date
            console.log("before ==> " + JSON.stringify(fields.date))

              // transfomr date dimension
            var new_hie = JSON.parse(JSON.stringify(fields.date)) // light copy
            var new_hie2 = []
            
            if (fields.date.indexOf("week") > -1 && getInclude(fields.date, ["month", "quarter","semester"]).length > 1){
                new_hie2.push(fields.date[0])
                new_hie.splice(new_hie.indexOf("week"), 1)
                new_hie2.push("week")
                if (new_hie.indexOf("year") > -1){
                    new_hie2.push("year")
                }
            }

            console.log("after ==> " + JSON.stringify(fields.date))

 
            jsondata.dimensions[fields.index].hierarchies = []
            jsondata.dimensions[fields.index].hierarchies.push({
                name: "h_" + new_hie[0] +"_" + new_hie[1],
                hierarchy: new_hie.toString(),
                parametres: new_hie,
                weak_att: []
              })

            if (new_hie2.length > 2){
                jsondata.dimensions[fields.index].hierarchies.push({
                    name: "h_" + new_hie2[0] +"_" + new_hie2[1],
                    hierarchy: new_hie2.toString(),
                    parametres: new_hie2,
                    weak_att: []
                  })
            }
            if (!req.session.VERSION) {
                req.session.VERSION = fields.session
            }

            fs.writeFile(jsonpath, JSON.stringify(jsondata, undefined, 2), (err) => {
                if (err) { res.json({ code: 400 }) }
                var tablehtml = app.template('file_table', { database: {filename: jsondata.filename}, dim: JSON.parse(JSON.stringify(jsondata.dimensions[fields.index])), indexdim: parseInt(fields.index), session: req.session.VERSION })
                let cls, schemastr = schemaStyle(JSON.stringify(jsondata))
                res.json({code: 200, tablehtml: tablehtml, cls: cls, schema: schemastr})
            })
        })
    }
}

// exports.editSchema = (req, res) => {
//     let jsonpath = path.join(__dirname, "../json", req.params.id + ".json")
//     var jsondata = JSON.parse(fs.readFileSync(jsonpath))
//     jsondata.dimensions = req.body.dimensions
//     jsondata.facts = req.body.facts

//     fs.writeFile(jsonpath, JSON.stringify(jsondata, undefined, 2), (err) => {
//         if (err) { res.json({ code: 400 }) }
//         res.json({ code: 200 })
//     })
// }

exports.generateDB = (req, res) => {
    console.log("req.body " + req.body.data)
    datastr = qs.parse(req.body)
    if (!req.params.id) {
        throw Error("FILE_MISSING")
    } else {
        console.log("DB : req.session ==> " + req.session.VERSION)
        if (!req.session.VERSION) {
            req.session.VERSION = req.body.session
        }
        console.log("DB : req.session after ==> " + req.session.VERSION)

        let jsonpath = path.join(__dirname, "../json", req.params.id + ".json")
        let pypath = path.join(__dirname, '../python', 'generate_db.py')
        console.log(`pypath : ${pypath}`)
        let fpath = path.join(__dirname, '../uploads', req.params.id + ".csv")
        console.log(`fpath ${fpath}`)

        const python = spawn('python', [pypath, fpath, jsonpath])

        python.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`)
        })

        python.stdout.on('data', (data) => {
            console.log('Pipe data from python script ...')
            let data_recu = data.toString()
            console.log(`data recepted 2 ${data_recu}`)
            // let dataToSend = { name: req.params.id.toString().split(".")[0], code: 200, measures: json_result['selected_measures'], dimensions: json_result['dimensions'] }
            // res.render(path.join(__dirname, '../views', 'file_db.html'), { database: json_result })
            // res.end()
            let json_result = getJson(req.params.id + ".csv")
            var html =  app.template('file_db', { database: json_result, session: req.session.VERSION })
            res.end(html)
        })

        python.stdout.on('end', (code) => {
            console.log(`child process close all stdio with code ${code}`);
        })
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

function getInclude(arr1, arr2){
    return arr1.filter((item) => {
        return arr2.includes(item)
    })
}

function executePython1(argvs) {
    return new Promise((resolve, reject) => {
        const child = spawn('python', argvs)
        var output = ""
        child.stdout.on('data', (chunk) => {
            console.log('chunk ' + chunk)
            output += chunk.toString()
        })

        child.stdout.on('end', (code) => {
            console.log('output 1 is' + output)
            if (output !== "") {
                output = output.toString().trim().replace(/\r\n/g, "").split("output")[1]
                console.log('output is ' + output)
                output = JSON.parse(output)
                output.code = 200
            } else {
                output = { code: 400 }
            }
            console.log('output 2 is ' + output.filename)
            resolve(output)
        })

        child.on('error', error => reject(error))
    })
}


function run_cmd(args, cb, end) {
    var spawn = require('child_process').spawn,
        child = spawn('python', args),
        me = this;
    child.stdout.on('data', function (buffer) { cb(me, buffer) });
    child.stdout.on('end', end);
}

function executePython(argvs, cb) {
    var dataToSend = "";
    const python = spawn('python', argvs)
    // collect data from script

    python.stdin.resume()
    python.stdout.setEncoding('utf8');
    python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...')
        // console.log(data.toString())
        dataToSend += data
    })

    python.stderr.setEncoding('utf8')
    python.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`)
    })

    python.stdout.on('end', (code) => {
        console.log(`child process end all stdio with code ${code}`);
        console.log("get dataToSend " + dataToSend.toString().trim().replace(/\r\n/g, "").split("output")[1])
        if (dataToSend !== "") {
            dataToSend = JSON.parse(dataToSend.toString().trim().replace(/\r\n/g, "").split("output")[1])
            dataToSend.code = 200
        } else {
            dataToSend = { code: 400 }
        }
        cb(dataToSend)
    })
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
        console.log('')
        console.log(stdout)
    })

    let json_result = getJson(filename)
    json_result.code = 200
    let dataToSend = json_result
    console.log(`json_result ${dataToSend.filename}  ${dataToSend.code}  ${dataToSend.proposed_measures}`)
    console.log(`type of meausres ${typeof dataToSend.proposed_measures === "object"}`)

    // console.log(`str2 ${dataToSend.name}  ${dataToSend.meausre}`)
    if (code !== 0) {
        dataToSend = { filename: filename, code: 401, msg: 'Find maeasures failed' }
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

    let pythonout = execSync('python ' + pypath + " " + fpath + " " + hyfd)

    console.log(`python code is ${pythonout.toString()}`)
    // let json_result = getJson(filename)
    pythonout = JSON.parse(pythonout.toString().split("jsonoutput ")[1])
    pythonresult.code = 200
    pythonout.log(`pythonout ${pythonout.filename}  ${pythonout.code}  ${pythonout.proposed_measures}`)
    pythonout.log(`type of meausres ${typeof pythonout.proposed_measures === "object"}`)

    // var dataToSend = getJson(filename)
    // console.log(`str2 ${dataToSend.name}  ${dataToSend.meausres}`)
    // if (pythonout !== "") {
    //     dataToSend = JSON.parse(pythonout.toString().trim().replace(/\r\n/g, "").split("output")[1])
    //     dataToSend.code = 200
    // } else {
    //     dataToSend = {name: filename, code: 400, msg: 'Get maeasures failed' }
    // }

    // if (dataToSend === "") {
    //     dataToSend = {name: filename, code: 400, msg: 'Get maeasures failed' }
    // }
    return pythonresult
}

function getJson(filename) {
    // ============= Edit for DW Test ================
    filename = filename.split(".")[0] + "_V0.csv"
    // ============= Edit for DW Test End ================
    let jsonpath = path.join(__dirname, "../json", filename.replace('csv', 'json'))
    console.log(`python jsonpath is ${jsonpath}`)
    let data = ""
    try {
        data = JSON.parse(fs.readFileSync(jsonpath, 'utf-8'))
    } catch (SyntaxError) {
        data = JSON.parse(fs.readFileSync(jsonpath, 'utf-8'))
    }
    return data
}

function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n)
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
        let data_recu = uint8arrayToString(data).replace(/'/g, '"')
        console.log(`data recepted 2 ${data_recu}`)
    })
    python.stdout.on('end', (code) => {
        console.log(`child process close all stdio with code ${code}`);

    })
}

function schemaStyle(schemastr) {
    if (typeof (schemastr) !== 'Object') {
        schemastr = JSON.parse(schemastr)
    }

    schemastr = JSON.stringify({ dimensions: schemastr.dimensions, facts: schemastr.facts })
    schemastr = schemastr.replace(/&/g, '&').replace(/</, '<').replace(/>/, '>')
    return schemastr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = 'json-number'
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key'
                } else {
                    cls = 'json-string'
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean'
            } else if (/null/.test(match)) {
                cls = 'null'
            }
            return cls, match
        })
}