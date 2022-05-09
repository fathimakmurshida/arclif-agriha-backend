const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const UserPlanSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    paymentplan_id:{ type: Schema.Types.ObjectId, ref: "paymentplan_tb", required: true },
    // adonservice_id:{type: Schema.Types.ObjectId, ref: "adonservice_tb", required: true}
})

var userPlanData = mongoose.model('userplan_tb', UserPlanSchema) //model creation
module.exports = userPlanData;
