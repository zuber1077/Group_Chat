const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');


const container = require("./container");


container.resolve(function(users){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/group_chat_app');

    //setup confguration for express
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(process.env.PORT || 3000, function() {
          console.log("Listening on port 3000");
        });
        ConfigureExpress(app);

        //setup express promise router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }

    //configuration or express midlle wear 
    function ConfigureExpress(app) {
        app.use(express.static('public'));//render make use of every static file inside public img,c..
        app.use(cookieParser()); //save cookies in the browser 
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator()); //validate on z server side for storing data 

        app.use(session({ //save session
            secret: "password1", 
            resave: false, saveUninitialized: false, 
            store: new MongoStore({ mongooseConnection: mongoose.connection})  //data can be save in db reuse later
            
            }));
        app.use(flash()); //to display flash message 

        app.use(passport.initialize());
        app.use(passport.session());
    }

});