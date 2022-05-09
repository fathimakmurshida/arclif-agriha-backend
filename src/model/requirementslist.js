const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const RequirementslistSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    //requirements_list:{type:Array}
    requirements_list:[]
})

var RequirementsData = mongoose.model('requirementslist_tb', RequirementslistSchema) //model creation
module.exports = RequirementsData;
