module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/letest-news', this.letestNews);
        },

        letestNews: function(req, res) {
            res.render('news/news', {title: 'GPchat - leatest News', user: req.user})
        }
    }
}