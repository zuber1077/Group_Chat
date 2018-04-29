// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");

module.exports = function (async, gpNames, _, gfs, find, mu, mu2, crypto) {
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
                    gpNames.find({},(err,result)=>{
                        callback(err, result)
                    })
                }

                // function(callback) {
                //     gpNames.aggregate({
                //       $group: {
                //           _id: "$country"
                //       }  
                //     },(err, newResult) =>{
                //         callback(err, newResult);
                //     });
                // }
            ],(err, results)=>{
                const res1 = results[0];
                //const res2 = result[1];
                //console.log(res1);
                const dataChunk = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                //console.log(dataChunk);

               // const countrySort = _.sortBy(res2, '_id');
               // country: countrySort

                 res.render("home", {title: 'GPchat - Home', user:req.user, data: dataChunk});
            })

            
      }
    }
}


