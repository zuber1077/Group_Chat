// import { Mongoose } from "mongoose";

// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3'); 

// AWS.config.update({
//     accessKeyId: '',
//     secretAccessKey: '',
//     region: '',
// });

// const S0 = new AWS.S3({});
// const upload = multer({
//     storage: multerS3({
//         S3: S0,
//         bucket: 'GPchat',
//         acl: 'public-read',
//         metadata(req, file, cb){
//             cb(null, {fieldName: file.fieldName});
//         },
//         key(req, file, cb){
//             cb(null, file.originalname); //get file original name
//         },
//         rename(fieldName, fileName){
//             return fileName.replace(/\W+/g, '-'); //if there is space in b/n z file name replace -
//         }
//     })
// })


// const storage = multer.diskStorage({
//     diskStorage: './public/uploads',
//     filename: function (req, file, cb) {
//         cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));

//     }
// });

// const upload = multer({
//     storage: storage
// }).single('upload');



// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
// // const methodOverride = require("method-override");


// const app = express();

// // Middleware
// app.use(bodyParser.json());
// // app.use(methodOverride("_method"));
// app.set("view engine", "ejs");

// // Mongo URI
// const mongoURI = "mongodb://127.0.0.1/groupchat";

// // Create mongo connection
// const conn = mongoose.createConnection(mongoURI);

// let gfs;

// conn.once('open', function(){
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads');
// })

// // app.post('/dashboard', upload.single('upload'), (req,res)=>{

// // })


// // Create storage engine
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads"
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });


//  exports.Upload = upload;
