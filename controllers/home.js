// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");

module.exports = function(async, gpNames, _, gfs, find, mu, mu2, crypto, Users, Message, FriendResult) {
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
                },
                
                function(callback) {
					const nameRegex =  new RegExp("^" + req.user.username.toLowerCase(), "i");
					Message.aggregate(
						//math every doc thet has sender name and reciver name
						//{or} if doest find 1st data in the 1st obj use 2nd
						{$match:{$or:[{'senderName':nameRegex}, {'receiverName':nameRegex}]}},
						{$sort:{"createdAt":-1}},
						{
							$group:{'_id':{
								"last_message_between":{
									$cond:[//array {operator}
										{//obj
											$gt:[
												{$substr:["$senderName",0,1]},
												{$substr:["$receiverName",0,1]}]
										},
											{$concat:["$senderName"," and ","$receiverName"]},
											{$concat:["$receiverName"," and ","$senderName"]}
									]
								}
							}, "body": {$first:"$$ROOT"}
							}
						}, function(err, newResult) {
							//console.log(newResult);
							callback(err, newResult);
						}
					)
				}

            ],(err, results) =>{
                const res1 = results[0];
                const res2 = results[1];
               // const res3 = results[2];
               const res4 = results[2];
                //console.log(res1);
                const dataChunk = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
               // console.log(res2);

              // const countrySort = _.sortBy(res2, '_id');
              // 

                 res.render('home', {title: 'GPchat - Home', user:req.user, chunks: dataChunk, data: res2, chat: res4});
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
            },

            // function (callback) {
			// 		if(req.body.chatId){
			// 			Message.update({
			// 				'_id': req.body.chatId
			// 			},
			// 			{
			// 				"isRead": true
			// 			}, (err, done) => {
			// 				console.log(done);
			// 				callback(err, done);
			// 			})	
			// 		}
			// 	}
          ], (err, results) => {
              res.redirect('/home');
          });

          FriendResult.PostRequest(req, res, '/home');
      },

      logout: function (req,res) {
          req.logout();
          req.session.destroy((err,) =>{
            res.redirect('/');
          });
      }
    }
}


