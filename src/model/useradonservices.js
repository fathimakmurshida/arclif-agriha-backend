const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const UserAdonSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    //adonservice_name:[{String}],
    adonservice_name:[],
    //{ type: Array,default:[]},
    total_amount:{type:Number}
})

var userAdonData = mongoose.model('useradon_tb', UserAdonSchema) //model creation
module.exports = userAdonData;
