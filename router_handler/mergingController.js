const {spawn} = require('child_process')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};


exports.database_infos= function(req,res){
    let all_rawdata = fs.readFileSync(path.join(__dirname, '../json', 'allSchema.json'))
    let all_schema = JSON.parse(all_rawdata)
    let db_rawlist = fs.readFileSync(path.join(__dirname, '../json','list.json'))
    let db_list = JSON.parse(db_rawlist)
    res.render('merging.ejs', {all_schema: all_schema, db_list:db_list, pagename: 'Merging'})
    res.end();
}


exports.mergingResult=function(req,res){
    const dwSelected = req.body.dwSelected
    const userName = req.body.userName
    const password = req.body.password

    if (typeof req.session.viewStatus == 'undefined'){
        req.session.viewStatus = "noExpert"
    } 
    res.locals.viewStatus = req.session.viewStatus

    let merging_rawdata = fs.readFileSync(path.join(__dirname, '../json','merging.json'))
    const merging_schema = JSON.parse(merging_rawdata)

    res.render('mergingResult.ejs',{dwSelected: dwSelected, userName: userName, password: password, merging_schema:merging_schema, pagename: 'Merging'})
    res.end()
}