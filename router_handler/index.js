const template = require("art-template")
// add index router
exports.index = (req, res) => {
    if (req.method === 'POST'){
        req.session.VERSION = req.body.version
    }else{
        req.session.VERSION = "No Expert"
    }
    res.send(template('index.html', {version: req.session.VERSION, pagename: 'Home'}))
}
