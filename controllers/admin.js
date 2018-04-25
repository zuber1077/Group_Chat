
const path = require('path'); //allow z path when we wont z file to store 
const fs = require('fs'); //paticlar function allow to rename z file or be saved with z original name

module.exports = function (formidable) {
    return {
        SetRouting: function (router) {
            router.get('/dashboard', this.adminPage); //i am using this keyword i have this function inside z same controller 

            router.post('/uploadFile', this.uploadFile); //for images ,file
        },

        adminPage: function (req,res) {
            res.render('admin/dashboard');
        },

        uploadFile: function (req,res) { //formidable event to allow z images ,file to be added local folder
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname,'../public/uploads');//z path z file to save in | stored
            
            //listen for event

            form.on('file',(field,file)=>{ //to rename z file or stored orginal name 
                fs.rename(file.path, path.join(form.uploadDir,file.name),(err)=>{
                    if(err) throw err;
                    console.log('File renamed successfully');
                })
            }); //call z file event rename z file if s (c) 

            form.on('error',(err)=>{ //if e (err,c)  
                console.log(err);
                
            });

            form.on('end', () => { //file upload s end and (c)
                console.log('File upload is successful');
                
            });

            form.parse(req);
        }
    }
}

