'use strict';

module.exports = function(_,passport,Uvalid){
    return { SetRouting: function(router) {
        router.get("/", this.indexPage);
        // router.get('/signup',this.getSignup);
        router.get("/login", this.loginPage);

        router.post("/", Uvalid.SignUpValidation, this.postSignup); //data validate before seedn db
      }, // indexPage: function(req,res){
      //     return res.render('index');
      // },
      indexPage: function(req, res) {
        const errors = req.flash("error");
        return res.render("index", {
          title: "GPchat | login",
          messages: errors,
          hasErrors: errors.length > 0
        }); //if it > 0 t / < 0 f //alert message display only when there is err
      }, postSignup: passport.authenticate("local.signup", {
        successRedirect: "/login",
        failureRedirect: "/",
        failureFlash: true
      }), loginPage: function(req, res) {
        return res.render("login");
      } };
}
