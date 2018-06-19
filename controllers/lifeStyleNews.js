module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/news/life-style', this.lifeStyleNews);
        },

        lifeStyleNews: function(req, res) {
            res.render('news/life-style', {title: 'GPchat - life Style News', user: req.user})
        }
    }
}