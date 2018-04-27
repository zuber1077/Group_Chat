
// const path = require('path'); //allow z path when we wont z file to store 
const fs = require('fs'); //paticlar function allow to rename z file or be saved with z original name
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const crypto = require('crepto');

module.exports = function(formidable, gpNames, aws) {
  return {
    SetRouting: function(router) {
      router.get("/dashboard", this.adminPage); //i am using this keyword i have this function inside z same controller
     // router.get('/files', this.filesPage);
      //router.get('/files/:filename', this.filesPage);
     // router.get('/image/:filename', this.filesPage);
      //router.get('/files/:filename', this.filePage);
    router.post("/uploadFile", uploadFile.any(), this.uploadFile); //for images ,file
    //router.post("/uploadFile", uploadFile.single('name','country','upload'), this.uploadFile); //for images ,file
     //router.post("/uploadFile", aws.Upload.any(), this.uploadFile); //for images ,file
     // router.post("/dashboard",  this.adminPostPage);
    },

    // filesPage: function (req,res) {
    //   gfs.files.find().toArray((err, files)=>{
    //     if(!files || files.length === 0){
    //       return res.status(404).json({
    //         err: 'No files exist'
    //       });
    //     }
    //     return res.json(files);
    //   });
    // },

    // filesPage: function (req,res) {
    //   gfs.files.findOne({filename: req.params.filename}, function (err, file) {
    //       if(!file || file.length === 0){
    //       return res.status(404).json({
    //         err: 'No files exist'
    //       });
    //     }
        //File Exists

    //     return res.json(file);
    //   });

    // },

    // filesPage: function (req,res) {
    //   gfs.files.findOne({filename: req.params.filename}, function (err, file) {
    //       if(!file || file.length === 0){
    //       return res.status(404).json({
    //         err: 'No files exist'
    //       });
    //     }
    //       //check if image
    //       if(file.contentType === 'image/jpeg' || file.contentType === 'img/png'){
    //         //  Read putput to browser
    //         const readstream = gfs.createReadStream(file.filename);
    //         readstream.pipe(res);
    //       }else{
    //         res.status(404).json({
    //           err: "Not an Image"
    //         });
    //       }
    //   });

    // },
    uploadFile: function (req,res) {
        const newGroup = new gpNames();
        newGroup.name = req.body.name;
        newGroup.country = req.body.country;
        newGroup.filename = req.body.upload;
        newGroup.save((err) => {
            res.render('admin/dashboard')
        })
        
    },

    // filePage: function (req,res) {
        
    // },


    adminPage: function(req, res) {
      res.render("admin/dashboard"); 
    },

  //   uploadFile: function (req,res) {
  //     gfs.files.find().toArray((err, files) => {
  //         if(!files || files.length === 0){
  //         res.render('home', {files: false});
  //       }else{
  //           files.map(file => {
  //               if(file.contentType === 'image/jpeg' || 
  //               file.contentType === 'image/png'){
  //                   file.isImage = true;
  //               }else{
  //                   file.isImage = false;
  //               }
  //           });
  //           res.render('home', {files: files});
  //       }
  //      // File Exists

  //       return res.json(files);
  //     });
  //  },

  //   uploadFile: function(req, res) {

  //      const newGroup = new gpName();
  //      newGroup.name = req.body.name;
  //      newGroup.country = req.body.country;
  //      newGroup.image = req.body.upload;
  //      newGroup.save(err => {
  //        res.render("admin/dashboard");
  //      });
  //    // formidable event to allow z images ,file to be added local folder
  //     const form = new formidable.IncomingForm();
  //     form.uploadDir = path.join(__dirname, "../public/uploads"); //z path z file to save in | stored

  //     //listen for event

  //     form.on("file", (field, file) => {
  //       //to rename z file or stored orginal name
  //       fs.rename(file.path, path.join(form.uploadDir, file.name), err => {
  //         if (err) throw err;
  //         console.log("File renamed successfully");
  //       });
  //     }); //call z file event rename z file if s (c)

  //     form.on("error", err => {
  //       //if e (err,c)
  //       console.log(err);
  //     });

  //     form.on("end", () => {
  //       //file upload s end and (c)
  //       console.log("File upload is successful");
  //     });

  //     form.parse(req);
    }
  };
//};

// const storage = multer.diskStorage({
//     diskStorage: './public/uploads',
//     filename: function (req, file, cb) {
//         cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));

//     }
// });

// const upload = multer({
//     storage: storage
// }).single('upload');



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
    gfs.collection("group");
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
          bucketName: "group"
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadFile = multer({ storage });