'use strict';

module.exports = function(_,passport){
    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup',this.getSignup);
            router.get('/home',this.homePage);

            router.post('/signup',this.postSignup);
        },
        indexPage: function(req,res){
            return res.render('index');
        },
        getSignup: function (req,res) {
            return res.render('signup');
        },
        postSignup: passport.authenticate('local.signup',{
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        homePage: function (req,res) {
            return res.render('home');
        }
    }
}
