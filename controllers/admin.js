
const express = require("express");
const app = express();

const upload = require('express-fileupload');
app.use(upload());
module.exports = function (upload, gpNames, aws, isEmpty) {
  return {
    SetRouting: function (router) {
      router.get("/dashboard", this.adminPage); //i am using this keyword i have this function 
      router.post("/uploadFile", this.uploadFile); //for images ,file

    },

    uploadFile: function(req, res) {

      let filename = 'default.jpg';

      // if (!isEmpty(req.files)) {
      // Upload File

      let file = req.files.file;
      filename = Date.now() + '-';

      file.mv('./public/uploads/' + filename, (err) => {
        if (err) throw err;
      });

      // console.log('is not Empty');
      // }
      //      console.log(req.files);

      const newGroup = new gpNames();
      newGroup.name = req.body.name;
      newGroup.country = req.body.country;
      newGroup.image = filename
      newGroup.save((err) => {
        res.redirect('/dashboard');
      })



    },
    adminPage: function (req, res) {
      res.render("admin/dashboard");
    },


  }
}
