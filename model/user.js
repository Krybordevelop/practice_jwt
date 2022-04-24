const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {type: String, default:null, require:true, require:true},
    last_name: {type: String, default:null},
    email:{type:String, unique:true,require:true},
    password:{type:String, require:true},
    role: [{ type: String, ref: 'userRoleSchema'}]
    //token:{type:String}
})

const userRoleSchema = new mongoose.Schema({
    value: {type:String, unique:true, default:"guest"}
})

module.exports.userRoleSchema = mongoose.model('role', userRoleSchema)
module.exports.userSchema = mongoose.model('user', userSchema)