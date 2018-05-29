'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//const secret = require('../secret/secretFile');

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

passport.use(new GoogleStrategy({
       //  clientID: secret.google.clientID,
         //clientSecret: secret.google.clientSecret,
         clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        // callbackURL: 'https://localhost:3000/auth/facebook/callback',
        passReqCallback: true //allow us to pass z data to call back when users try to login //tp check the user exist in db
},(req, accessToken,  refreshToken, profile, done)=>{//pass paremeter

    User.findOne({google: profile.id},(err,user)=>{ //to check if z paticler fb id exist then display message to users
        if(err){ //network err 
            return done(err);
        }
        if(user){ //
            return done(null,user); //user object 
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email    = profile.emails[0].value;
            newUser.userImage = profile._json.image.url;

            newUser.save((err)=>{
                if(err){
                    return done(err)
                }
                return done(null,newUser);
            })
        }
    })

}));
