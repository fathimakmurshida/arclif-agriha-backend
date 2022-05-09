const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const LoginSchema = new Schema({
    phonenumber:{ type: String, required: true },
    roletype:{ type: String, required: true }, 
},{
    timestamps: true
})

var Logindata = mongoose.model('login_tb',LoginSchema) //model creation
module.exports=Logindata;


