const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');

container.resolve(function(users){
    //setup confguration for express
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        app.listen(3000, () => {
            console.log('listening on port 3000');
        });
        ConfigureExpress(app);
        //setup express promise router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }

    //configuration
    function ConfigureExpress(app) {
        app.use(express.static('public'));//render make use of every static file inside public img,c..
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
    }
});