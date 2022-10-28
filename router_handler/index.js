const template = require("art-template")
// add index router
exports.index = (req, res) => {
    console.log("index")
    console.log(req.session.VERSION)
    if (typeof req.session.VERSION == 'undefined'){
        res.locals.viewStatus = "No Expert"
    } else {
        res.locals.viewStatus = req.session.VERSION
    }

    // if (req.method === 'POST'){
    //     req.session.VERSION = req.body.version
    // }else{
    //     req.session.VERSION = "No Expert"
    // }
    res.send(template('index.html', {version: req.session.VERSION, pagename: 'Home'}))
}
