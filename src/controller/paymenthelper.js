const paymentSchema = require('../model/paymentSchema');
const razorpayPayment = require('../payment_integration/razorpay');
const sendMail = require("../controller/Nodemailer/nodemailer");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    //<!===== create payment order and inset userid,orderId to database =======/> //
    paymentOrder: (req, res) => {
        razorpayPayment.createOrder(req.body.amount).then(order => {
            if (order.status === 'created') {
                const paymentData = paymentSchema({
                    orderId: order.id,
                    userId: req.body.userId,
                })
                paymentData.save().then(data => {
                    res.json({ status: 200, order: order });
                }
                ).catch(err => {
                    console.log(err);
                    res.json(err);
                })
            }
        }).catch(err => {
            res.json(err);
        })
    },
    //<!========= verify payment and update payment status to database ========/>//
    paymentVerify: (req, res) => {
        razorpayPayment.verifyPayment(req.body).then(order => {
            paymentSchema.updateOne({ userId:ObjectId(req.params.id) }, {
                paymentId: order.id,
                amount: order.amount / 100,
                paymentStatus: order.status,
                method: order.method,
                email: order.email,
                orderId: order.order_id,
                fee: order.fee / 100,
                tax: order.tax / 100,
            }, (err, data) => { 
                console.log(data)
                if (err) {
                    res.json({ error: err, message: 'Payment updation failed' });
                } else {
                    sendMail.receiptMail(order).then(mail => {
                       //res.json({ status: 200, message: 'Payment verified successfully' });
                       res.redirect("https://architectural-services-arclifs.vercel.app/success");
                    }).catch(err => {
                        res.json({ error: err, message: 'Payment verified successfully but mail sending failed' });
                    })
                }
            }
            )
        }).catch(err => {
            res.json({ status: 500, message: 'Payment not verified' });
        })
    },
    delete: (req, res) => {
        console.log(req.body);
        paymentSchema.deleteMany({ userId: ObjectId(req.body.id) }, (err, data) => {
            if (err) {
                res.json({ error: err, message: 'Payment deletion failed' });
            }else{
                res.json({ status: 200, message: 'Payment deleted successfully' });
            }    
        } ) 
    }
}