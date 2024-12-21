class homeuicontroller {
    async home(req, res) {
        return res.render('homeview/home')
    }
}

module.exports = new homeuicontroller();