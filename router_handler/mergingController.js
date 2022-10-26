const {spawn} = require('child_process')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};

//get "/merging"
exports.database_infos= function(req,res){
    if (typeof req.session.VERSION == 'undefined'){
        res.locals.viewStatus = "No Expert"
    } else {
        res.locals.viewStatus = req.session.VERSION
    }    

    let all_rawdata = fs.readFileSync(path.join(__dirname, '../json', 'allSchema.json'))
    let all_schema = JSON.parse(all_rawdata)
    let db_rawlist = fs.readFileSync(path.join(__dirname, '../json','list.json'))
    let db_list = JSON.parse(db_rawlist)
    res.render('merging.ejs', {all_schema: all_schema, db_list: db_list, pagename: 'Merging'})
    res.end();
}

//post "/merging/result"
exports.mergingResult=function(req,res){
    dwSelected = req.body.dwSelected
    userName = req.body.userName
    password = req.body.password

    if (typeof req.session.VERSION == 'undefined'){
        res.locals.viewStatus = "No Expert"
    } else {
        res.locals.viewStatus = req.session.VERSION
    }    

    let merging_rawdata = fs.readFileSync(path.join(__dirname, '../json','mergingSchema.json'))
    const merging_schema = JSON.parse(merging_rawdata)
    let all_rawdata = fs.readFileSync(path.join(__dirname, '../json','allSchema.json'))
    all_schema = JSON.parse(all_rawdata)

    //update allSchema.json
    combination = Object.assign(all_schema, merging_schema)
    fs.writeFileSync(path.join(__dirname, '../json','allSchema.json'), JSON.stringify(all_schema,undefined,2))

    //update list.json
    var db_infos = require(path.join(__dirname, '../json','list.json'));
    db_infos[Object.keys(merging_schema)[0]] = {
                        "name": userName,
                        "dsn":"localhost/orcl"
                    }
    fs.writeFile(path.join(__dirname, '../json','list.json'), JSON.stringify(db_infos,undefined,2), function (err) {
        //console.log(err);
        });

    //create database
    // let connection;
    // var oracledb = require('oracledb');
    // (async function() {
    // try{
    //     connection = await oracledb.getConnection({
    //         user : 'system',
    //         password : 'orcl',
    //         connectString : 'localhost/orcl'
    //     });
    //     await connection.execute(`alter session set "_ORACLE_SCRIPT" = true`);
    //     await connection.execute(`create user `+ userName +` IDENTIFIED BY "`+ password +`"`);  
    //     await connection.execute(`alter user `+ userName +`
    //                                 default tablespace "SYSTEM" 
    //                                 temporary tablespace "TEMP"`);
    //     await connection.execute(`grant create session,
    //                                 create view,
    //                                 create sequence,
    //                                 create procedure,
    //                                 create table,
    //                                 create trigger,
    //                                 create type,
    //                                 create materialized view
    //                                 to ` + userName)
    //     console.log("Successfully connected to Oracle!")
    // } catch(err) {
    //     console.log("Error: ", err);
    // } finally {
    //     if (connection) {
    //     try {
    //         await connection.close();
    //     } catch(err) {
    //         console.log("Error when closing the database connection: ", err);
    //     }
    //     }
    // }
    // })()
    res.render('mergingResult.ejs',{dwSelected: dwSelected, userName: userName, password: password, merging_schema:merging_schema, pagename: 'Merging'})
    res.end()
}

//get "/merging/result"
exports.refreshMergingResult=function(req,res){
    if (typeof req.session.VERSION == 'undefined'){
        res.locals.viewStatus = "No Expert"
    } else {
        res.locals.viewStatus = req.session.VERSION
    }    

    let merging_rawdata = fs.readFileSync(path.join(__dirname, '../json','mergingSchema.json'))
    const merging_schema = JSON.parse(merging_rawdata)

    res.render('mergingResult.ejs',{dwSelected: dwSelected, userName: userName, password: password,merging_schema:merging_schema, pagename: 'Merging'})
    res.end()
}

//put "/merging/result"
exports.changeName = function(req, res){
    const db_name = req.body.dbname
    const dim_names = JSON.parse(req.body.dimname)
    const hie_names = JSON.parse(req.body.hiename)
    const fact_names = JSON.parse(req.body.factname)

    let merging_rawdata = fs.readFileSync(path.join(__dirname, '../json','mergingSchema.json'))
    const merging_schema = JSON.parse(merging_rawdata)

    //rewrite dimension&hierarchy names
    let hie_index = 0
    Object.entries(merging_schema[db_name]).forEach(function(dims, index){
        const [dim, dim_detail] = dims
        if (dim != "Fact" && dim_detail.Name != dim_names[index] ){
            merging_schema[db_name][dim].Name = dim_names[index]
        }else if(dim == "Fact"){
            Object.entries(merging_schema[db_name][dim]).forEach(function(facts, index){
                const [fact, fact_detail] = facts
                if (fact_detail.Name != fact_names[index] ){
                    merging_schema[db_name][dim][fact].Name = fact_names[index]
                }
            })
        }
        if( typeof merging_schema[db_name][dim].Hierarchy !== 'undefined'){
            Object.entries(merging_schema[db_name][dim].Hierarchy).forEach(function(hies, index){
                const [hie, hie_detail] = hies
                if ( hie_detail.Name != hie_names[hie_index] ){
                    merging_schema[db_name][dim].Hierarchy[hie].Name = hie_names[hie_index]
                } 
                hie_index += 1
            })
        }
        
    })

    //update schema
    update_combination = Object.assign(all_schema, merging_schema)
    fs.writeFileSync(path.join(__dirname, '../json','mergingSchema.json'), JSON.stringify(merging_schema,undefined,2))
    fs.writeFileSync(path.join(__dirname, '../json','allSchema.json'), JSON.stringify(all_schema,undefined,2))
    
    res.status(200).end()

}