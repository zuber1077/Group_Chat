'use strict';
module.exports = function () {
    return {
        SignUpValidation: (req,res,next)=>{
             //if try to submit w empty username,validate email field and password
            req.checkBody('username','Username is Required').notEmpty(); 
            req.checkBody('username','Username Must Not Be Less Than 5').isLength({min: 5});//
            req.checkBody('email','Email is Required').notEmpty(); 
            req.checkBody('email','Email is Invalid').isEmail();//
            req.checkBody('password','Password is Required').notEmpty(); 
            req.checkBody('password','Password Must Not Be Less Than 5').isLength({min: 5});//
            //store z validation return promise 
            req.getValidationResult()
                .then((result)=>{ //get error array 
                    const errors = result.array();
                    const messages = []; //retrive z error message
                    errors.forEach((error)=>{
                        messages.push(error.msg); //push into z new array crated
                    });
                    //add err message to flash 
                    req.flash('error',messages);
                    res.redirect('/'); //then redirect back 
                })
                .catch((err)=>{ //return next
                    return next();
                });
        },
        LoginValidation: (req,res,next)=>{
             //if try to submit w empty username,validate email field and password
            req.checkBody('email','Email is Required').notEmpty(); 
            req.checkBody('email','Email is Invalid').isEmail();//
            req.checkBody('password','Password is Required').notEmpty(); 
            req.checkBody('password','Password Must Not Be Less Than 5').isLength({min: 5});//
            //store z validation return promise 
            req.getValidationResult()
                .then((result)=>{ //get error array 
                    const errors = result.array();
                    const messages = []; //retrive z error message
                    errors.forEach((error)=>{
                        messages.push(error.msg); //push into z new array crated
                    });
                    //add err message to flash 
                    req.flash('error',messages);
                    res.redirect('/login'); //then redirect back 
                })
                .catch((err)=>{ //return next
                    return next();
                });
        }
    }
}
