// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");

module.exports = function(async, gpNames, _, gfs, find, mu, mu2, crypto, Users) {
    return {
        SetRouting: function (router) {
            router.get("/home", this.homePage); 
            router.post('/home', this.postHomePage); 

            router.get('/logout', this.logout);
        },

        homePage: function(req, res) {

            async.parallel([ //allow each function that be added to run in parallel
                function(callback) {
                    gpNames.find({},(err,result)=>{ //stored insise result
                        callback(err, result)
                    })
                },

                // function(callback) {
                //     gpNames.aggregate({
                //       $group: {
                //           _id: "$country"
                //       }  
                //     },(err, newResult) =>{
                //         callback(err, newResult);
                //     });
                // },

                function (callback) {
					Users.findOne({'username': req.user.username})
					.populate('request.userId')
					.exec((err,result) => {
						callback(err, result);
					})
				}
            ],(err, results) =>{
                const res1 = results[0];
                const res2 = results[1];
               // const res3 = results[2];
                //console.log(res1);
                const dataChunk = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
               // console.log(res2);

              // const countrySort = _.sortBy(res2, '_id');
              // 

                 res.render('home', {title: 'GPchat - Home', user:req.user, chunks: dataChunk, data: res2});
            })

            
      },
    //post route for add to fov
      postHomePage: function(req, res) {
          async.parallel([
            function(callback) {
                gpNames.update({ //taken to data 
                    '_id': req.body.id, //find by id from users
                    'fans.username': {$ne: req.user.username}//check the user exist
                }, {
                    $push: {fans: {
                        username: req.user.username,
                        email: req.user.email
                    }}
                }, (err, count) => {
                    console.log(count);
                    callback(err, count);
                });
            }
          ], (err, results) => {
              res.redirect('/home');
          });
      },

      logout: function (req,res) {
          req.logout();
          req.session.destroy((err,) =>{
            res.redirect('/');
          });
      }
    }
}


