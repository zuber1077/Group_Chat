const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs'); //enqrept z password 

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, default: ''},
    fullname: {type: String, unique: true, default: ''},
    // lastname: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    userImage: {type: String, default: 'default.png'},
    facebook: {type: String, default: ''},
    fbTokens: Array, //add password take care
    google: {type: String, default: '' }
});
//enqrept password 
userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);//generate hash(salt) and enqrept z password before save to db /length of 10
};
//deqrept z password when z user trying to login
userSchema.methods.validUserPassword = function (password) {
    return bcrypt.compareSync(password,this.password); //to compare input user password and z db 
};

module.exports = mongoose.model('User',userSchema);