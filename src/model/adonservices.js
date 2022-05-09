const mongoose = require('mongoose');
const { NumberInstance } = require('twilio/lib/rest/pricing/v2/voice/number');

const Schema = mongoose.Schema    //schema definition

const AdonServiceSchema = new Schema({
    adonservicename:{ type: String, required: true },
    adonserviceamount:{ type: Number, required: true },
    adonservicedescription:{ type: String, required: true}
})

var AdonServiceData = mongoose.model('adonservice_tb',AdonServiceSchema) //model creation
module.exports=AdonServiceData;


