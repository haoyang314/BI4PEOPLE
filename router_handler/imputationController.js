const {spawn} = require('child_process')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path')
var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};


exports.selection_database = function(req,res){
    let dw_rawdata = fs.readFileSync(path.join(__dirname, '../json', 'impulist.json'));
    db_list = JSON.parse(dw_rawdata)

    res.render('imputation.ejs', {db_list: db_list, pagename: 'Imputation'})
    res.end();
}


exports.database_infos= function(req,res){
    let dw_rawdata = fs.readFileSync(path.join(__dirname, '../json', 'imputation.json'));
    let db_schema = JSON.parse(dw_rawdata)
    let db_name = req.body.db_selected;
    res.render('imputation.ejs', {db_infos: db_list[db_name], db_schema: db_schema[db_name], pagename: 'Imputation'})
    res.end();

}

exports.postResult = function(req, res){
    res.locals.viewStatus = req.session.viewStatus
    const algo = req.body.algo
    const attriImput = req.body.colSelected
    // console.log(attriImput)
    //console.log(db_name)
    var attriInfos = {}
    for (let i=0; i<attriImput.length ; i++){
        var dict = {}
        dict["Dimension"] = attriImput[i].split('-')[0]
        dict["Attribute"] = attriImput[i].split('-')[1]
        dict["Missing Number"] = attriImput[i].split('-')[2]
        attriInfos[attriImput[i]] = dict
    }
    console.log(attriInfos)

    res.render('imputationResult.ejs',{algo:algo, db_infos:db_list[db_name], attriImput: attriInfos,pagename: 'Imputation'})
    res.end();
}
