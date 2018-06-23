'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretFile');

//inside user be store userid,name.. /done then save it in z session 
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
//take z id of user and compare it save of z session if it much return user data 
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{ //retien as an object inside this user 
        done(err,user);//if err add value to z err call back //if there is no error = to null
    });
});

passport.use(new FacebookStrategy({
        clientID: secret.facebook.clientID,
       // clientID: process.env.FB_CLIENT_ID,
        clientSecret: secret.facebook.clientSecret,
        //clientSecret: process.env.FB_CLIENT_SECRET,
        profileFields: ['email','displayName','photos'], //profile users
        // callbackURL: 'https://localhost:3000/auth/facebook/callback',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqCallback: true //allow us to pass z data to call back when users try to login //tp check the user exist in db
},(req, token,  refreshToken, profile, done)=>{//pass paremeter

    User.findOne({facebook: profile.id},(err,user)=>{ //to check if z paticler fb id exist then display message to users
        if(err){ //network err 
            return done(err);
        }
        if(user){ //
            return done(null,user); //user object 
        }else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email    = profile._json.email;
            newUser.userImage = "https://graph.facebook.com/" + profile.id + "/picture?type=large";
            newUser.fbTokens.push({token:token});
            
            newUser.save((err)=>{
                return done(null,user);
            });
        }
    });

}));
