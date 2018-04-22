'use strict';

module.exports = function(_,passport,Uvalid){
    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup',this.getSignup);
            router.get('/home',this.homePage);

            router.post('/signup', Uvalid.SignUpValidation, this.postSignup);//data validate before seedn db
        },
        indexPage: function(req,res){
            return res.render('index');
        },
        getSignup: function (req,res) {
            const errors = req.flash('error');
            return res.render('signup',{title: 'GPchat | login', messages: errors, hasErrors: errors.length > 0}); //if it > 0 t / < 0 f //alert message display only when there is err 
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
