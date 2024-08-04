const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuid = require('uuid');
const otp = require("../../common/functions/otp");
const utils = require("../../common/functions/utils");
const UserModel = require('../../src/users/users.model');

const  env  = process.env;
const token_validity="30d"
exports.login = async(req, res) => {
    try {

        let name =req.body.name
        
        if(req.body.x=="0"){
            console.log("+++SENDING OTP++++")
            await otp.sendOTP(req.body)
        }
        console.log("OK5")
        res.status(201).send({email:req.body.email,name:name,userId:req.body.userId});
        
    } catch (err) {
        
        res.status(500).send({errors: err});
    }
};

exports.loginOTP = (req, res) => {
    try {
        let jwt_Secret =  env.JWT_SECRET??jwtSecret ;
        let refreshId =  req.body.userId + jwt_Secret ;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let name= req.body.name;
        let uid= req.body.uid;
        let token = jwt.sign(req.body, jwt_Secret,{expiresIn:token_validity});
        
        let b = new Buffer.from(hash);
        let refresh_token = jwt.sign(req.body, refreshId);

        let final_refresh_token = utils.mergeStrings(req.body.userId,refresh_token);
        
        res.status(201).send({accessToken: token, refreshToken: final_refresh_token,name:name,uid:uid});
    } catch (err) {
        
        res.status(500).send({errors: err});
    }
};


exports.refresh_token = (req, res) => {
    try {
        const refreshToken = req.body.refresh_token;
        let jwt_Secret =  env.JWT_SECRET??jwtSecret ;
        
       if (refreshToken == null) return res.sendStatus(401); // No refresh token provided
       const {a,b} = utils.reverseMerge(refreshToken);
        const refresh_secret= a +jwt_Secret;
        //console.log(a);
        jwt.verify(b, refresh_secret,async (err, user) => {
            if (err) return res.sendStatus(403); // Invalid refresh token
            //console.log(user);

            const {refreshKey,iat,uid,...newuser}=user;
            let nUid="0";// uid;
           
            if(nUid=="0"){
                const usr = await UserModel.findByUsername(newuser.username);
                if(usr){
                    nUid = usr.uid??"0";
                   // console.log("++++++++++++++++")
                    //console.log(usr)
                   // console.log("++++++++++++++++")
                }
            }
            let refreshId =  user.userId + jwt_Secret ;
            const newuser1 = {...newuser,uid:nUid};
            const accessToken = jwt.sign(newuser1, jwt_Secret,{expiresIn:token_validity});

            let refresh_token = jwt.sign(newuser1, refreshId);

            let final_refresh_token = utils.mergeStrings(user.userId,refresh_token);
            //console.log(newuser1)
         
            res.status(201).send({accessToken: accessToken,refreshToken: final_refresh_token,name:user.name,uid:nUid});
        });
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.resendOTP = async(req, res) => {
    try {
       
       // req.body.refreshKey = salt;
      
        let name= req.body.name;
       
        console.log("OK4")
        if(req.body.email){
        await otp.sendOTP(req.body)
        }
        console.log("OK5")
        res.status(201).send({email:req.body.email,name:name});
        
    } catch (err) {
        
        res.status(500).send({errors: err});
    }
};


exports.changePassword = async(req, res) => {
    try {
       
       // console.log("OK3")
        let name= req.body.name;
       // console.log("OK4")
      
        await otp.sendChangePassword(req.body,req.body.password)
       // console.log("OK5")
        res.status(201).send({email:req.body.email,name:name});
        
    } catch (err) {
        
        res.status(500).send({errors: err});
    }
};



exports.resendOTPFP = async(req, res) => {
    try {
       
        let name= req.body.name;
        await otp.sendOTP(req.body,1)
        res.status(201).send({email:req.body.email,name:name});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};