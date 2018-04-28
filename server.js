const express = require('express');
const bodyParser = require('body-parser');//allow us get data from html form
const ejs = require('ejs');
// const https = require('https');
const http = require('http');
const cookieParser = require('cookie-parser'); 
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash'); //allow us to display flush messages
const passport = require('passport');
const socketIO = require('socket.io');
const { Users } = require('./helpers/UsersClass');
// const fs = require("fs");
// var path = require("path");
// const option = {
//   cert: fs.readFileSync(path.resolve(__dirname, "cert.pem")),
//   key: fs.readFileSync(path.resolve(__dirname, "key.pem"))
// };


// const { MongoClient } = require("mongodb");

const container = require("./container");


container.resolve(function(users, _, admin, home, group){

    mongoose.Promise = global.Promise;
    mongoose.Promise = Promise;
    mongoose.connect('mongodb://127.0.0.1/groupchat', function(error, db) {
        if(!error){
             console.log("We are connected");
        }
        else
           console.dir(error);
    });
// );
    mongoose.connection.on("error", err => {
      console.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });
    //setup confguration for express
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(process.env.PORT || 3000, function() {
          console.log("Listening on port 3000");
        });

        
        // const server = https.createServer(app);
        // app.listen(process.env.PORT || 3000,function () {
        //     console.log("Listening on port 3000");
        // });
        // var server = https.createServer(app).listen(3000,function () {
        //     console.log("l");
            
        // });
        ConfigureExpress(app);
        require("./socket/groupchat")(io, Users);
        //setup express promise router
        const router = require("express-promise-router")();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        
        app.use(router);
    }

    //configuration or express midlle wear 
    function ConfigureExpress(app) {

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));//render make use of every static file inside public img,c..
        app.use(cookieParser()); //save cookies in the browser 
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator()); //validate on z server side for storing data 

        app.use(session({ //save session
            secret: "myownsecretkey", 
            resave: false, 
            saveUninitialized: false, 
            store: new MongoStore({ mongooseConnection: mongoose.connection})  //data can be save in db reuse later
            
            }));
        app.use(flash()); //to display flash message 

        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
});
 