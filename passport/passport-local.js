'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

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

passport.use('local.signup',new LocalStrategy({
    usernameField: 'email', //default user signup
    passwordField: 'password',//
    passReqToCallback: true //all user data pass in to call back  //if it false noting data will return
},(req,email,password,done)=>{//

    User.findOne({'email': email},(err,user)=>{ //to check if z email is exist then display message to users
        if(err){ //network err 
            return done(err);
        }
        if(user){ //
            return done(null,false,req.flash('error','User with email already exist')); //using flush
        }
        const newUser = new User();//
        newUser.username = req.body.username.replace(/ /g, "-"); //match form name and replace
        newUser.fullname = req.body.username.replace(/ /g, "-");
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password); //saved as encrypted password insed z db

        newUser.save((err)=>{ //save data
            done(null,newUser);
        });
    });

}));

passport.use('local.login',new LocalStrategy({
    usernameField: 'email', //default user signup
    passwordField: 'password',//
    passReqToCallback: true //all user data pass in to call back  //if it false noting data will return
},(req,email,password,done)=>{//

    User.findOne({'email': email},(err,user)=>{ //to check if z email is exist then display message to users
        if(err){ //network err 
            return done(err);
        }
        const messages = [];//if z email does not exist or z password not valid 
        if(!user || !user.validUserPassword(password)){
            messages.push('Email Does Not Exist or Password is Invalid')
            return done(null,false,req.flash('error',messages));
        }

        return done(null,user);
    });

}));