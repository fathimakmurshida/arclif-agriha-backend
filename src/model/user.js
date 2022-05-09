const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const UserSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    uname: { type: String, required: true },
    email: { type: String, required: true },
    housename: { type: String },
    Place: { type: String },
    Pincode: { type: Number },
    country: { type: String },
    longitute: { type: String },
    latitude: { type: String },
    Profession: { type: String },
    Nooffamilymembers: { type: Number },
    Seniorcitizen: { type: Boolean},
}, {
    timestamps: true
})

var Userdata = mongoose.model('user_tb', UserSchema) //model creation
module.exports = Userdata;
