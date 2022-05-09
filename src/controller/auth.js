require('dotenv').config();
const fast2sms=require('fast-two-sms')
const fast2smsKey=process.env.SMS_FAST2SMS;

const Logindata = require('../model/login');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const crypto = require('crypto');
const smsKey = process.env.SMS_SECRET_KEY;
const twilioNum = process.env.TWILIO_PHONE_NUMBER;
const jwt = require('jsonwebtoken');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
let refreshTokens = [];


const login = (req, res) => {
    try {
    
        if (req.body.phonenumber) {
            const phone = req.body.phonenumber;
            const otp = Math.floor(100000 + Math.random() * 900000);
            const ttl = 2 * 60 * 1000; //2minutes
            const expires = Date.now() + ttl;
            const data = `${phone}.${otp}.${expires}`;
            const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
            const fullHash = `${hash}.${expires}`;
            var options = {authorization : fast2smsKey,message:`security code for ARCLIF-AGRIHA is ${otp}`,numbers :[phone]}
            fast2sms.sendMessage(options)
            // client.messages
            //     .create({
            //         body: `Security code For ARCLIF is ${otp}`,
            //         from: twilioNum,
            //         to: phone
            //     })
                .then((messages) => {
                    console.log(messages)
                    res.status(200).send({ phone: phone, hash: fullHash, msg: `OTP :${otp} send successfully`, status: "200" });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(404).send({ msg: "fast2sms error", status: "404" });
                });

            // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
            // res.status(200).send({ phone, hash: fullHash, details: details, });          // Use this way in Production
        } else {
            res.json({ msg: `phonenumber required !!` })
        }
    } catch (err) {
        res.send(err)
    }
};

const verifyOTP = (req, res) => {
    try {
        if (req.body.phonenumber) {
            const phone = req.body.phonenumber;
            const roletype = req.body.roletype;
            const hash = req.body.hash;
            const otp = req.body.otp;
            var msg = req.body.msg;
            var details = [{
                data: ""
            }];

            let [hashValue, expires] = hash.split('.');

            let now = Date.now();
            if (now > parseInt(expires)) {
                return res.send({ msg: 'Timeout. Please try again' });
            }

            let data = `${phone}.${otp}.${expires}`;
            let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');

            if (newCalculatedHash === hashValue) {
                Logindata.find({ phonenumber: phone })
                    .then((response) => {
                        if (response.length == 0) {
                            const data = {
                                phonenumber: phone,
                                roletype: roletype
                            }
                            const loginData = Logindata(data)
                            loginData.save()
                                .then((responsedata) => {
                                    msg = "register"
                                    details = [{
                                        data: responsedata
                                    }]
                                })
                        } else {
                            msg = "login"
                            details = [{
                                data: response
                            }]
                        }
                        const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
                        const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });

                        refreshTokens.push(refreshToken);
                        setTimeout(() => {
                            res
                                .status(200)
                                .cookie('accessToken', accessToken, {
                                    expires: new Date(new Date().getTime() + 30 * 1000),
                                    sameSite: 'strict',
                                    httpOnly: true
                                })
                                .cookie('refreshToken', refreshToken, {
                                    expires: new Date(new Date().getTime() + 31557600000), //1 year
                                    sameSite: 'strict',
                                    httpOnly: true
                                })
                                .cookie('authSession', true, { 
                                    expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' 
                                })
                                .cookie('refreshTokenID', true, {
                                    expires: new Date(new Date().getTime() + 31557600000),
                                    sameSite: 'strict'
                                })
                                .send({ msg: `${msg} verified`, data: details });
                        }, 1000)
                    }).catch((err) => {
                    
                        res.status(400).json({ msg: err.message, status: "404" });
                    })
            
            } else {
                console.log('not authenticated');

                return res.json({ verification: false, msg: 'Incorrect OTP' });
            }
        } else {
            res.json({ msg: 'Incorrect input!!' });
        }
    } catch (err) {
        res.send(err)
    }
}

const home = (req, res) => {
    console.log('home private route');
    res.send('Private Protected Route - Home');
}

async function authenticateUser(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;

        jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, phone) => {
            if (phone) {
                req.phone = phone;
                next();
            } else if (err.message === 'TokenExpiredError') {
                return res.send({
                    success: false,
                    msg: 'Access token expired'
                });
            } else {
                console.log(err);
                return res.send({ err, msg: 'User not authenticated' });
            }
        });
    } catch (err) {
        res.send(err)
    }
}

const refresh = (req, res) => {
    try{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.json({ message: 'Refresh token not found, login again' });
    if (!refreshTokens.includes(refreshToken))
        return res.json({ message: 'Refresh token blocked, login again' });

    jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phone) => {
        if (!err) {
            const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, {
                expiresIn: '24h'
            });
            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    expires: new Date(new Date().getTime() + 30 * 1000),
                    sameSite: 'strict',
                    httpOnly: true
                })
                .cookie('authSession', true, {
                    expires: new Date(new Date().getTime() + 30 * 1000),
                    sameSite: 'strict'
                })
                .json({ previousSessionExpired: true, success: true });
        } else {
            return res.json({
                success: false,
                msg: 'Invalid refresh token'
            });
        }
    });
} catch (err) {
    res.send(err)
}
}

const logout = (req, res) => {
    try{
    console.log("logout");
    res
        .clearCookie('refreshToken')
        .clearCookie('accessToken')
        .clearCookie('authSession')
        .clearCookie('refreshTokenID')
        .send('logout');
    } catch (err) {
        res.send(err)
    }
}

module.exports = {
    login,
    verifyOTP,
    home,
    authenticateUser,
    refresh,
    logout
}