// add index router
exports.index = (req, res) => {
    if (req.method === 'POST'){
        req.session.VERSION = req.body.version
    }else{
        req.session.VERSION = "No Expert"
    }
    res.render('index.html', {version: req.session.VERSION, pagename: 'Home'})
}
