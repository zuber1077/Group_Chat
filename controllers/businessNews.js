module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/news/business', this.lifeStyleNews);
        },

        lifeStyleNews: function(req, res) {
            res.render('news/business', {title: 'GPchat - Business News', user: req.user})
        }
    }
}