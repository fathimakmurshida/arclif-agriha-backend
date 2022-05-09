const mongoose = require('mongoose')

const Schema = mongoose.Schema    //schema definition

const PaymentPlanSchema = new Schema({
    plan_name:{ type: String, required: true },
    plan_amount:{ type: Number, required: true },
    plan_amount_inlakh:{ type: String, required: true },
    initial_payment:{type: Number, required: true},
    plan_services:{type: Array, required: true },
    amount_per_sqrft:{type: Number, required: true }
})

var PaymentPlanData = mongoose.model('paymentplan_tb',PaymentPlanSchema) //model creation
module.exports=PaymentPlanData;


