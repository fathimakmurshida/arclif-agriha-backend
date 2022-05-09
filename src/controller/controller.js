
const PaymentPlanData = require('../model/paymentplan')
const AdonServiceData = require('../model/adonservices')
const userData = require('../model/user')
const Logindata = require('../model/login')
const userPlanData = require('../model/userplan')
const BuldingDetails = require('../model/buildingdetails');
const RequirementslistData = require('../model/requirementslist');
const userAdonData = require('../model/useradonservices')
const paymentData =require('../model/paymentSchema')
//create plan
const createPlan = (req, res) => {
    try {
        console.log(req.body)
        const paymentplandata = PaymentPlanData(req.body)
        paymentplandata.save().then((response) => {
            res.status(200).json({ msg: "plan added", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : plan not added !! ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }

}
//view all plan
const viewplan = (req, res) => {
    try {
        PaymentPlanData.find().then((response) => {
            console.log(response);
            res.status(200).json({ msg: "success", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }

}
//view single plan_name
const viewplanbyid = (req, res) => {
    try {
        const id = req.params.id;
        PaymentPlanData.findById({ _id: id }).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "success", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//choose plan
const chooseSinglePlan = (req, res) => {
    try {
        const planid = req.body.planid;
        PaymentPlanData.findById({ _id: planid }).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "success", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//update plan
const updateplan = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        PaymentPlanData.findByIdAndUpdate(id, data).then((response) => {
            console.log(response);

            res.status(200).json({ msg: "plan data updated !!" })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//createadonservices
const createadonservices = (req, res) => {
    try {
        console.log(req.body)
        const adonServiceData = AdonServiceData(req.body)
        adonServiceData.save().then((response) => {
            res.status(200).json({ msg: "AdonServiceData added", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : AdonService not added !! ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }

}
//viewadonservices
const viewadonservices = (req, res) => {
    try {
        AdonServiceData.find().then((response) => {
            console.log(response);
            res.status(200).json({ msg: "success", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }

}
//updateadonservices
const updateadonservices = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        AdonServiceData.findByIdAndUpdate(id, data).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "AdonService data updated !!", })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//delete AdonServiceData
const deleteAdonServiceData = (req, res) => {
    try {
        const id = req.params.id;

        AdonServiceData.findByIdAndDelete(id).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "AdonService data deleted !!", })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//create user
const createuser = (req, res) => {
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        userData.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response)
                if (!response) {
                    const userdata = userData(req.body)
                    userdata.save().then((response) => {
                        res.status(200).json({ msg: "userdetails added !!", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `error : userdetails not added !! ${err}`, })
                    })
                } else {
                    res.json({ msg: `error : userdetails already added !!`, data: response })
                }
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `error : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }
}
//view user
const viewuser = (req, res) => {
    try {
        userData.aggregate([
            {
                $lookup:
                {
                    from: 'login_tbs',
                    localField: 'login_id',
                    foreignField: '_id',
                    as: 'userlogindetails'
                }
            }
        ]).then((response) => {
            res.status(200).json({ msg: "success", details: response })
        })
    } catch (err) {
        res.send(err)
    }

}
//view user by id
const viewsingleuser = (req, res) => {
    try {
        const id = req.params.id;
        // userData.aggregate([
        //     { $match: { login_id: id } },
        //     {
        //         $lookup:
        //         {
        //             from: 'login_tbs',
        //             localField: 'login_id',
        //             foreignField: '_id',
        //             as: 'userlogindetails'
        //         }
        //     }
        // ]).then((response) => {
        //     res.status(200).json({ msg: "success", details: response })
        // })
        userData.find({ login_id: id }).then((respons) => {
            Logindata.find({ _id: id }).then((response) => {
                const data = { userdetails: respons, logindetails: response }
                console.log(response);
                res.status(200).json({ msg: "success", details: data })
            })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//update user
const updateuser = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        userData.findByIdAndUpdate(id, data).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "userData  updated !!", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//setuserrequirements 
const setuserrequirements = (req, res) => {
    try {
        console.log(req.body)
        const userRequiremnts = Requiremnts(req.body)
        userRequiremnts.save().then((response) => {
            res.status(200).json({ msg: "user added", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : user not added !! ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
//getuserrequirements
// const getuserrequirements= (req, res) => {
//     Requiremnts.aggregate([
//         {
//             $lookup:
//             {
//                 from: 'login_tbs',
//                 localField: 'login_id',
//                 foreignField: '_id',
//                 as: 'userlogindetails'
//             }
//         },{
//             $lookup:
//             {
//                 from: 'buildingdetails',
//                 localField: 'buildingdetails_id',
//                 foreignField: '_id',
//                 as: 'paymentplandetails'
//             }
//         },{
//             $lookup:
//             {
//                 from: 'paymentplan_tb',
//                 localField: 'paymentplan_id',
//                 foreignField: '_id',
//                 as: 'paymentplandetails'
//             }
//         },{

//         }
//     ])
// }

// add building details


const addBuildingDetails = (req, res) => {
    //login_id,paymentplan_id,adonservice_id
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        BuldingDetails.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response)
                if (!response) {
                    const RequirementsData = BuldingDetails(req.body)
                    RequirementsData.save().then((response) => {
                        res.status(200).json({ msg: "building data added !!", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `error : building data not added !! ${err}`, })
                    })
                } else {
                    res.json({ msg: `error : building data already added !!`, data: response })
                }
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `error : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }


}

const updateBuildingDetails=(req, res)=>{
    try {
        const id = req.params.id;
        const data = req.body;

        BuldingDetails.findByIdAndUpdate(id, data).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "Building details  updated !!", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    }
}
const getBuildingDetails=(req, res)=>{
    try {
        const loginid = req.body.id;
        BuildingDetails.findById({ login_id: loginid }).then((response) => {
            console.log(response);
            res.status(200).json({ msg: "success", details: response })
        }).catch((err) => {
            console.error(err);
            res.json({ msg: `error : ${err}`, })
        })
    } catch (err) {
        res.send(err)
    } 
}

const setRequirementsList = (req, res) => {
    //login_id,requiremnts list array : body
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        RequirementslistData.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response)
                if (!response) {
                    const RequirementsData = RequirementslistData(req.body)
                    RequirementsData.save().then((response) => {
                        res.status(200).json({ msg: "Requirementslist added !!", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `error : Requirementslist not added !! ${err}`, })
                    })
                } else {
                    res.json({ msg: `error : Requirementslist already added !!`, data: response })
                }
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `error : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }

}
const getRequirementsList = (req, res) => {
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        RequirementslistData.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response)
                res.status(200).json({ msg: "success", details: response })
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `error : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }
}
const choosePlan = (req, res) => { //************************ */
    //login_id,paymentplan_id
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        userPlanData.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response)
                if (!response) {
                    const RequirementsData = userPlanData(req.body)
                    RequirementsData.save().then((response) => {
                        res.status(200).json({ msg: "choose plan added !!", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `error : choose plan not added !! ${err}`, })
                    })
                } else {
                    res.json({ msg: `error : Requirementslist already added !!`, data: response })
                }
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `error : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }

}
const getuserplan = (req, res) => {
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        userPlanData.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response.paymentplan_id)
                PaymentPlanData.findById({ _id: response.paymentplan_id })
                    .then((response) => {
                        res.status(200).json({ msg: "success", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `Paymentplanerror : !! ${err}`, })
                    })
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `userplanerror : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }
}
const chooseAdon = (req, res) => {
    try {
        const login_id = req.body.login_id;
        const adonservice_name = req.body.adonservice_name;
        const total_amount = req.body.total_amount;

        console.log(req.body)

        userAdonData.findOne({ login_id: login_id })
            .then((response) => {
                console.log(response)
                if (!response) {
                    const RequirementsData = userAdonData(req.body)
                    RequirementsData.save().then((response) => {
                        res.status(200).json({ msg: "user adon services added !!", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `error : user adon services data not added !! ${err}`, })
                    })
                } else {
                    res.json({ msg: `error : user adon services data already added !!`, data: response })
                }
            }).catch((err) => {
                console.error(err);
                res.json({ msg: `error : !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }

}
//get user selected adonservices
const getuseradon = (req, res) => {
    //login_id 
    try {
        console.log(req.body)
        const loginid = req.body.login_id;
        userAdonData.findOne({ login_id: loginid })
            .then((response) => {
                console.log(response)
                        res.status(200).json({ msg: "success", details: response })
                    }).catch((err) => {
                        console.error(err);
                        res.json({ msg: `GetUserplanerror : !! ${err}`, })
                    })
         
    } catch (err) {
        res.send(err)
    }
}

const ispaymentcompleted = (req,res) => {
    try {

         const loginid = req.body.userId;
         paymentData.find({userId:loginid}).then((response)=>{
            res.status(200).json({ msg: "payment details already added", details: response })
             }).catch((err) => {
                console.error(err);
                res.json({ msg: `isPaymentcompletederror: !! ${err}`, })
            })
    } catch (err) {
        res.send(err)
    }
          
}
module.exports = {
    createPlan,
    viewplan,
    viewplanbyid,
    updateplan,
    chooseSinglePlan,

    createadonservices,
    viewadonservices,
    updateadonservices,
    deleteAdonServiceData,
    createuser,
    viewuser,
    viewsingleuser,
    updateuser,
    setuserrequirements,
    addBuildingDetails,
    // getAllBuildingDetails,
    getBuildingDetails,
    updateBuildingDetails,
    // getuserrequirements
    setRequirementsList,
    getRequirementsList,

    choosePlan,//save user plan
    getuserplan,//get user plan
    chooseAdon,//save user adon 
    getuseradon,//get user adon services


    ispaymentcompleted

}