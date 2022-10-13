const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 80
// // load template engine
// app.engine('html', require('express-art-template'))

app.get('/python', (req, res) => {

    // let fpath = path.join(__dirname, 'uploads', 'example_mesure2.csv')
    // spawn new child process to call the python script
    // const python = spawn('python', ['script1.py', 12, 13]);
    // const python = spawn('python', ['E:\\Stage\\PythonProject\\process\\process.py','E:\\Stage\\datafile\\example_mesure2.csv' ]);
    
    
    // const python = spawn('python', [path.join(__dirname, 'python', 'test.py') , fpath ]);
    // // collect data from script
    //     python.stderr.on('data', (data) => {
    //     console.error(`child stderr:\n${data}`)
    // })
    // python.stdout.on('data', (data) => {
    //     console.log('Pipe data from python script ...');
    //     dataToSend = data.toString().trim().replace(/\r\n/g, "");
    //     console.log(JSON.parse(dataToSend))
    //       // send data to browser
    //       res.send(dataToSend)
    //     //   console.log(dataToSend)
    // });
    // // in close event we are sure that stream from child process is closed
    // python.stdout.on('end', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    // });
    // let cmd = [path.join(__dirname, 'python', 'test.py') , fpath ]
    // run(cmd, function(message) {
    //     console.log('message ' + message)
    //   });

    // let id = 'example_mesure2.csv'
    // let jsonpath = path.join(__dirname, 'json', 'example_mesure2.json')
    // let pypath = path.join(__dirname, 'python', 'hierarchy.py')
    // console.log(`pypath : ${pypath}`)
    // let fpath = path.join(__dirname, 'uploads', 'example_mesure2.csv')
    // console.log(`fpath ${fpath}`)
    // exec('python ' + pypath + " " + fpath + " " + jsonpath, (err, stdout, stderr) => {
    //     if (err) {
    //         console.log(`err ${err}`)
    //         res.json({ code: 400 })
    //     }
    //     console.log(`stdout ${stdout}`)
    //     let json_result = getJson(req.params.id)
    //     let dataToSend = { name: req.params.id, code: 200, measures: json_result['selected_measures'], hierarchies: json_result['hierarchies'] }
    //     console.log(`json_result ${dataToSend.name}  ${dataToSend.code}  ${dataToSend.measures} ${dataToSend.hierarchies}`)
    //     console.log(`type of meausres ${typeof dataToSend.measures === "object"}`)
    //     res.render(path.join(__dirname, '../views/', 'file_hierarchy.html'), dataToSend)
    //     res.end()
    // })


    // const python = spawn('python', [pypath, fpath, jsonpath])
    // console.log("execute python...")
    // python.stderr.on('data', (data) => {
    //     console.error(`child stderr:\n${data}`)
    // })
    // console.log("execute python 1...")
    // python.stdout.on('data', (data) => {
    //     console.log('Pipe data from python script ...')
    //     // let data_recu = uint8arrayToString(data).replace(/'/g, '"')
    //     let data_recu = data.toString()
    //     console.log(`data recepted 2 ${data_recu}`)
    //     let json_result = getJson(id)
    //     let dataToSend = { name: id, code: 200, dfs: json_result['final_dfs'], measures: json_result['selected_measures'], dimensions: json_result['dimensions'] }
    //     console.log(`json_result ${dataToSend.name}  ${dataToSend.code}  ${dataToSend.dfs} ${dataToSend.measures} ${dataToSend.dimensions}`)
    //     console.log(`type of meausres ${typeof dataToSend.measures === "object"}`)
    //     res.render(path.join(__dirname, 'views', 'file_hierarchy.html'), dataToSend)
    //     res.end()
    // })

    // console.log("execute python 2...")

    // python.stdout.on('end', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    // })
    // console.log(`end ===== `)
  filenames = '[E:\\Stage\\pythonByNodeJS\\uploads\\DW1.csv,E:\\Stage\\pythonByNodeJS\\uploads\\DW2.csv]'
  getFD2(filenames)

})
app.listen(port, () => console.log(`Example app listening on port 
${port}, please open http://localhost:${port} !`))


function getJson(filename) {
    let jsonpath = path.join(__dirname, "json", filename.replace('csv', 'json'))
    console.log(`python jsonpath is ${jsonpath}`)
    let data = JSON.parse(fs.readFileSync(jsonpath, 'utf-8'))
    return data
}

function run(cmd, cb) {
    var command = require('child_process').spawn('python', cmd);
    // var command = child('python', cmd);
    var result = '';
    command.stdout.on('data', function(data) {
      result += data.toString();
    });
    command.on('close', function(code) {
        return cb(result);
    });
  }

  
// get funtionnal dependance from python
function getFD2(filenames) {
  const { execSync } = require('child_process');
  let pypath = path.join(__dirname, 'python', 'measure.py')
  console.log(pypath)
  let hyfd = path.join(__dirname, 'python', 'HyFD', 'HyFD.jar')
  console.log(hyfd)
  let fpath = filenames
  console.log(`file ==> ${fpath}`)

  let pythonout = execSync('python ' + pypath + " " + fpath + " " + hyfd)

  console.log(`python code is ${pythonout.toString()}`)
  let dataToSend = JSON.parse(pythonout.toString().split("jsonoutput ")[1])
  dataToSend.code = 200
  console.log(`pythonout ${dataToSend.filename}  ${dataToSend.code}  ${dataToSend.proposed_measures}`)
  console.log(`type of meausres ${typeof dataToSend.proposed_measures === "object"}`)
  console.log(dataToSend)
  return dataToSend
}
