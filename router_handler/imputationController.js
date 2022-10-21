const {spawn} = require('child_process')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path')
var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};


exports.selection_database = function(req,res){
    if (typeof req.session.viewStatus == 'undefined'){
        req.session.viewStatus = "noExpert"
    } 
    res.locals.viewStatus = req.session.viewStatus

    let dw_rawdata = fs.readFileSync(path.join(__dirname, '../json', 'list.json'));
    db_list = JSON.parse(dw_rawdata)

    res.render('imputation.ejs', {db_list: db_list, pagename: 'Imputation'})
    res.end();
}


exports.database_infos= function(req,res){
    const viewStatus = req.body.viewStatus
    res.locals.viewStatus = viewStatus

    let dw_rawdata = fs.readFileSync(path.join(__dirname, '../json', 'allSchema.json'));
    let db_schema = JSON.parse(dw_rawdata)
    db_name = req.body.db_selected;
    res.render('imputation.ejs', {db_infos: db_list[db_name], db_schema: db_schema[db_name], pagename: 'Imputation'})
    res.end();
}

exports.postResult = function(req, res){
    res.locals.viewStatus = req.body.viewStatus

    //dbInfos:  db_list[db_name]

    //algoInfos:  
    const viewStatus = req.body.viewStatus
    //console.log("view :"+ viewStatus) expert/noExpert
    const algo = req.body[viewStatus]
    //console.log("algo :" + algo) hie/olapknn
    if ( viewStatus == "expert" && algo == "olapknn"){
        const k = req.body.kvalue
        const weight = req.body.weight
    }
    console.log("body")
    console.log(req.body)

    //attributes infos: dim, attri, missing nb
    if (typeof req.body.colSelected != "object"){
        attriImput = [req.body.colSelected]
    } else {
        attriImput = req.body.colSelected
    }
    
    var attriInfos = {}
    for (let i = 0; i< attriImput.length ; i++){
        var dict = {}
        dict["Dimension"] = attriImput[i].split('%')[0]
        dict["Attribute"] = attriImput[i].split('%')[1]
        dict["Missing Number"] = attriImput[i].split('%')[2]
        attriInfos[attriImput[i]] = dict
    }
    // console.log(typeof attriImput)
    // console.log(db_name)
    // console.log(attriInfos)


    //from algo: completed number, completed rate (merge into dictionary attriInfos)

    res.render('imputationResult.ejs',{algo: algo, db_infos: db_list[db_name], attriImput: attriInfos, pagename: 'Imputation'})
    res.end();
}
