module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/news/tech', this.letestNews);
        },

        letestNews: function(req, res) {
            res.render('news/tech', {title: 'GPchat - Tech News', user: req.user})
        }
    }
}