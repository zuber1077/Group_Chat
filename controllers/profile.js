module.exports = function(async, Users, Message, formidable, aws, FriendResult) {
    return {
        SetRouting: function(router) {
			router.get('/settings/profile', this.getProfilePage);
			
			router.post('/userupload', uploadFile.any(), this.userUpload);
			router.post('/settings/profile', this.postProfilePage);

			router.get('/profile/:name', this.overviewPage);
			router.post('/profile/:name', this.overviewPostPage);
        },

        getProfilePage: function (req, res) {
            async.parallel([
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
							const arr = [
								{path: 'body.sender', model: 'User'},
								{path: 'body.receiver', model: 'User'}
							];

							Message.populate(newResult, arr, (err, newResult1) => {
								//console.log(newResult1[0].body.sender);
								callback(err, newResult1);
							});
						}
					)
				}

			], (err, results) => {
				const result1 = results[0];
				const result2 = results[1];
				
				res.render('user/profile' ,{title: 'GPchat - Profile ', user:req.user,data: result1, chat: result2});
			});
		},
	

		postProfilePage: function(req, res) {
			FriendResult.PostRequest(req, res, '/settings/profile');

				async.waterfall([
					function(callback) {
						Users.findOne({'_id':req.user._id}, (err, result) => {
							callback(err, result);
						})
					},
					function(result, callback) {
						if(req.body.upload === null || req.body.upload === ''){
								Users.update({
									'_id':req.user._id
								}, 
								{
									username: req.body.username,
									fullname: req.body.fullname,
									gender: req.body.gender,
									country: req.body.country,
									bio: req.body.bio,
									userImage: result.userImage
								},
								{//if z field doesnt exist inside doc then add it
									upsert: true
								}, (err, result) => {
									console.log(result);
									res.redirect('/settings/profile');
								})
						}else if(req.body.upload !== null || req.body.upload !== ''){
								Users.update({
									'_id':req.user._id
								}, 
								{
									username: req.body.username,
									fullname: req.body.fullname,
									gender: req.body.gender,
									country: req.body.country,
									bio: req.body.bio,
									userImage: req.body.upload
								},
								{//if z field doesnt exist inside doc then add it
									upsert: true
								}, (err, result) => {
									console.log(result);
									res.redirect('/settings/profile');
								})
						}
					}
				]);
		},
			userUpload: function(req, res) {
			const form = new formidable.IncomingForm();
			 form.uploadDir = path.join(__dirname, "../public/uploads"); //z path z file to save in | stored

      //listen for event

      form.on("file", (field, file) => {
        //to rename z file or stored orginal name
        fs.rename(file.path, path.join(form.uploadDir, file.name), err => {
          if (err) throw err;
          console.log("File renamed successfully");
        });
      }); //call z file event rename z file if s (c)
			// form.on('file', (field, file) => {});
			form.on('error', (err) => {});
			form.on('end', () => {});
			form.parse(req);
		},

		//
		overviewPage: function(req,res) {
			async.parallel([
				function (callback) {
					Users.findOne({'username': req.params.name})
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

			], (err, results) => {
				const result1 = results[0];
				const result2 = results[1];
				
				res.render('user/overview' ,{title: 'GPchat - Overview ', user:req.user,data: result1, chat: result2});
			});
		},

		overviewPostPage: function(req,res) {
			FriendResult.PostRequest(req, res, '/profile/'+req.params.name);
		}
  }
}



const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
// const methodOverride = require("method-override");


const app = express();

// Middleware
app.use(bodyParser.json());
// app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Mongo URI
const mongoURI = "mongodb://127.0.0.1/groupchat";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("upload");
})

// app.post('/dashboard', upload.single('upload'), (req,res)=>{

// })


// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          // name: "name",
          // image: "upload",
          // country: "country",
          filename: filename,
          bucketName: "upload"
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadFile = multer({ storage });