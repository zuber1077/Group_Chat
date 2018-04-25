const dependable = require('dependable');
const path = require('path'); //tell dependable to go any folder we pesefied here /to look for 

const container = dependable.container();

const dependencies = [//this arrayz
  ['_','lodash'],
  ['passport','passport'],
  ['formidable','formidable'],
];

//adding module as an aray
//register depenscies i use forEach loop to loop thro .. insted of make use of in every file 
dependencies.forEach(function(val) {
    container.register(val[0], function(){ //only call '_'
        return require(val[1]);
    })
});

//any function that we have in those file we can make use of them out side those file by likely calling module.export
container.load(path.join(__dirname,'/controllers')); //interacting w db 
container.load(path.join(__dirname,'/helpers'));

container.register('container',function(){
    return container;
});

module.exports = container;