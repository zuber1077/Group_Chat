'use strict';

module.exports = function(_){
    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/login',this.getSignup);
        },
        indexPage: function(req,res){
            return res.render('index',{test: 'this is test'});
        },
        getSignup: function(req,res) {
            return res.render('login');
        }
    }
}