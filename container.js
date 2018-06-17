//register as dependecise //what ever use pass us parameter
const dependable = require('dependable');
const path = require('path'); //tell dependable to go any folder we pesefied here /to look for 

const container = dependable.container();

//for example lodash can be used as multiple times in diffent files

const dependencies = [//this arrayz
  ['_','lodash'],
  ['passport','passport'],
  ['formidable','formidable'],
  ['upload','express-fileupload'],
  ['async','async'],
  ['isEmpty', './helpers/upload.js'],
  ['gpNames','./models/gpName'],
 // ['User', './models/user'],
//   ['user','./controllers/users'],
  ['Users', './models/user'],
  ['Message', './models/message'],
  ['Group', './models/groupmessage.js'],
  ['aws','./helpers/AWSUpload'],
  ['gfs','gridfs-stream'],
  ['find','multer-gridfs-storage'],
  ['mu','multer-gridfs-storage'],
  ['mu2','multer'],
  ['crypto','crypto'],
  //['admin','./controllers/admin']

];

//adding module as an aray
//register depenscies i use forEach loop to loop thro .. insted of make use of in every file 
dependencies.forEach(function(val) {
    container.register(val[0], function(){ //only call '_'
        return require(val[1]); //call by own name
    })
});

//any function that we have in those file we can make use of them out side those file by likely calling module.export
container.load(path.join(__dirname,'/controllers')); //interacting w db //
container.load(path.join(__dirname,'/helpers')); //any function inside this can be reused

container.register('container',function(){
    return container;
});

module.exports = container;