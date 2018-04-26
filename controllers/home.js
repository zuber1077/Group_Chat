// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");

module.exports = function (async, gpName, _, gfs, find, mu, mu2, crypto) {
    return {
        SetRouting: function (router) {
            router.get("/home", this.homePage);  
        },

        homePage: function(req, res) {
            // gfs.files.find().toArray((err, files) => {
            //   if (!files || files.length === 0) {
            //     res.render("home", { files: false });
            //   } else {
            //     files.map(file => {
            //       if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            //         file.isImage = true;
            //       } else {
            //         file.isImage = false;
            //       }
            //     });
            //     // res.render("home", { files: files });
            //   }
              // File Exists

              //return res.json(files);
            // });

            async.parallel([
                function (callback) {
                    gpName.find({},(err,result)=>{
                        callback(err, result)
                    })
                }
            ],(err, result)=>{
                const res1 = result[0];
                //console.log(res1);
                
                 res.render("home", {title: 'GPchat - Home', data: res1});
            })

            
      }
    }
}