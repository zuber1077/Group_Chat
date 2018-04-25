'use strict';

module.exports = function(_,passport,Uvalid){
    return { SetRouting: function(router) {
        router.get("/", this.indexPage);
        // router.get('/signup',this.getSignup);
        router.get("/login", this.loginPage);
        router.get("/home", this.homePage);
        router.get('/auth/facebook', this.getFacebookLogin); 
        router.get('/auth/facebook/callback', this.facebookLogin); //call back URL
        router.get('/auth/google', this.getGoogleLogin);
        router.get('/auth/google/callback', this.googleLogin);

        router.post("/login",Uvalid.LoginValidation, this.postlogin)
        router.post("/", Uvalid.SignUpValidation, this.postSignup); //data validate before seedn db
      }, // indexPage: function(req,res){
      //     return res.render('index');
      // },

      loginPage: function(req, res) {
        const errors = req.flash("error");
        return res.render("login", {
          title: "GPchat | Login",
          messages: errors,
          hasErrors: errors.length > 0
        });
      },

      postlogin: passport.authenticate("local.login", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true
      }),

      
      indexPage: function(req, res) { //which is Signup
        const errors = req.flash("error");
        return res.render("index", {
          title: "GPchat | SignUp",
          messages: errors,
          hasErrors: errors.length > 0
        }); //if it > 0 t / < 0 f //alert message display only when there is err

      }, 
      postSignup: passport.authenticate("local.signup", { //which is indexPage
        successRedirect: "/home",
        failureRedirect: "/",
        failureFlash: true
      }), 

      /* FacebookLogin  */

      getFacebookLogin: passport.authenticate('facebook',{
        scope: 'email'
      }),

      facebookLogin: passport.authenticate('facebook',{
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
      }),

      /* GoogleLogin  */

      getGoogleLogin: passport.authenticate('google',{
        scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read']
      }),

      googleLogin: passport.authenticate('google',{
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
      }),

      homePage: function(req, res) {
        return res.render("home");
      },
      
       
    };
}
