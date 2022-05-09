const express=require('express')
const router=express.Router();
const auth = require('../controller/auth')
const controller=require('../controller/controller')
const paymentpath=require('../controller/paymenthelper')


router.post('/sendOTP', auth.login);
router.post('/verifyOTP',auth.verifyOTP);
router.post('/home',auth.authenticateUser,auth.home);
router.post('/refresh',auth.refresh)
router.get('/logout',auth.logout)

//create plan
router.post('/createplan', controller.createPlan)
router.get('/viewplan',controller.viewplan)
router.get('/viewsingleplan/:id',controller.viewplanbyid)
router.put('/updateplan/:id',controller.updateplan)

//create adon services
router.post('/createadonservices',controller.createadonservices)
router.get('/viewadonservices',controller.viewadonservices)
router.put('/updateadonservices/:id',controller.updateadonservices)
router.delete('/deleteadonservices/:id',controller.deleteAdonServiceData)

//create user
router.post('/createuser',controller.createuser)
router.get('/viewuser',controller.viewuser)
router.put('/updateuser/:id',controller.updateuser)
router.get('/viewsingleuser/:id',controller.viewsingleuser)

//create and view requiremntslist
router.post('/setrequirementslist',controller.setRequirementsList)
router.post('/getrequirementslist',controller.getRequirementsList)

//choose plan by user
router.post('/chooseplan',controller.choosePlan)
//get user choos plan
router.post('/getuserplan',controller.getuserplan)

router.post('/choosesingleplan',controller.chooseSinglePlan)
router.post('/chooseAdon',controller.chooseAdon)
router.post('/getuserAdon',controller.getuseradon)

//add building details for user
router.post('/addbuildingdetails',controller.addBuildingDetails)
//get building details for user
router.post('/getbuildingdetails',controller.getBuildingDetails)

router.post('/paymentorder',paymentpath.paymentOrder)
router.post('/verifyPayment/:id',paymentpath.paymentVerify)
router.post('/isPaymentcompleted',controller.ispaymentcompleted)

module.exports= router