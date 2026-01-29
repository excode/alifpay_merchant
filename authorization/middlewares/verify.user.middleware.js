const UserModel = require('../../src/users/users.model');
const crypto = require('crypto');
const funcs =  require("../../common/functions/funcs");

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
        if (!req.body.username) {
            errors.push('Missing username field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing username and password fields'});
    }
};
exports.hasChangeValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
        if (!req.body.oldPassword) {
            errors.push('Missing old Password');
        }
        if (!req.body.newPassword) {
            errors.push('Missing new Password field');

        }else{
            if (req.body.newPassword.length<6) {
                errors.push('New Password length is short');
            }
        }
        
        if (req.body.confirmPassword!=req.body.newPassword) {
            errors.push('Confirm and New password not match');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing Password fields'});
    }
};

exports.hasOTPValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.otp) {
            errors.push('Missing OTP field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and OTP fields'});
    }
};
exports.hasOTPResendValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
        if (!req.body.userId) {
            errors.push('Missing userid field');
        }
        if (!req.body.email) {
            errors.push('Missing email field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing userid and email fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByUsername(req.body.username.trim())
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid Login information'});
            }else{
                let passwordFields = user.password.split('$');
                let salt = passwordFields[0];
                //let fcm = req.body.fcm;
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                //console.log(hash);
               // console.log(passwordFields[1]);
                if (hash === passwordFields[1]) {
                    console.log("OK1")
                    console.log(user);
                   let x=req.body._x;
                   let userType=4;
                    if(user.acctype=="FP"){
                        userType=2;
                    }else if(user.acctype=="FC"){
                        userType=3;
                    }else if(user.acctype=="F-COP"){
                        console.log("SET USERTYPE 5 ");
                        userType=5;
                    }

                    req.body = {
                            userId: user.id?user.id:"",
                            email: user.email,
                            uid: user.uid?user.uid:0,
                            name: user.name ,
                            username: user.username ,
                            country: user.country ,
                            mobileno: user.mobileno,
                            acctype:user.acctype,
                            userType:userType,
                            x:x 
                        
                    };
                   // console.log("OK2")
                   
                    return next();
                        
                       
                } else {
                    return res.status(400).send({errors: 'Invalid Login information'});
                }
            }
        });
};

exports.isOTPMatch = (req, res, next) => {
    UserModel.findByEmailWithOTP(req.body.email.trim())
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid OTP information 1'});
            }else{
                let passwordFields = user.otp.split('$');
                let salt = passwordFields[0];
                let fcm = req.body.fcm;
                let hash = crypto.createHmac('sha512', salt).update(req.body.otp).digest("base64");
               // console.log(hash);
               // console.log(passwordFields[1]);
                if (hash === passwordFields[1]) {
                    let userType=4;
                    if(user.acctype=="FP"){
                        userType=2;
                    }else if(user.acctype=="FC"){
                        userType=3;
                    }
                    req.body = {
                        userId: user.id?user.id:"",
                        email: user.email,
                        uid: user.uid?user.uid:0,
                        name: user.name ,
                        username: user.username ,
                        country: user.country??"" ,
                        mobileno: user.mobileno??"",
                        userType:userType

                    };
                    await  UserModel.flushOTP( user.id);
                    return next();
                        
                       
                } else {
                    return res.status(400).send({errors: 'Invalid OTP information 2'});
                }
            }
        });
};

exports.isOTPResendMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email.trim(),false)
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid user information '});
            }else{
                console.log(user)
              
                    req.body = {
                        userId: user.id?user.id:"",
                        email: user.email,
                        uid: user.uid?user.uid:0,
                        name: user.name ,
                        username: user.username ,
                        country: user.country ,
                        mobileno: user.mobileno 
                    };
                    console.log("CCCCC")
                    await  UserModel.flushOTP( user.id);
                    console.log("DDDDD")
                    return next();
                        
                       
                
            }
        });
};


exports.isPasswordAndUserMatch2 = (req, res, next) => {
    UserModel.findByUsername(req.jwt.username.trim())
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid Login information'});
            }else{
                let passwordFields = user.password.split('$');
                let salt = passwordFields[0];
                //let fcm = req.body.fcm;
                let hash = crypto.createHmac('sha512', salt).update(req.body.oldPassword).digest("base64");
                //console.log(hash);
               // console.log(passwordFields[1]);
                if (hash === passwordFields[1]) {
                    await UserModel.updatePassword(user.id,req.body.newPassword);
                   // console.log("OK1")
                    req.body = {
                            userId: user.id?user.id:"",
                            email: user.email,
                            uid: user.uid?user.uid:0,
                            password: req.body.newPassword,
                            name: user.name ,
                            username: user.username ,
                            country: user.country ,
                            mobileno: user.mobileno 
                        
                    };
                   // console.log("OK2")
                   
                    return next();
                        
                       
                } else {
                    return res.status(400).send({errors: 'Invalid Login information'});
                }
            }
        });
};

exports.isPasswordAndUserMatch3 = (req, res, next) => {
    UserModel.findByEmailWithOTP(req.body.email.trim())
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid  information'});
            }else{
                let passwordFields = user.otp.split('$');
                let salt = passwordFields[0];
                //let fcm = req.body.fcm;
                let hash = crypto.createHmac('sha512', salt).update(req.body.otp).digest("base64");
                //console.log(hash);
               // console.log(passwordFields[1]);
                if (hash === passwordFields[1]) {
                    await UserModel.updatePassword(user.id,req.body.newPassword);
                   // console.log("OK1")
                    req.body = {
                            userId: user.id?user.id:"",
                            email: user.email,
                            uid: user.uid?user.uid:0,
                            password: req.body.newPassword,
                            name: user.name ,
                            username: user.username ,
                            country: user.country ,
                            mobileno: user.mobileno 
                        
                    };
                   // console.log("OK2")
                   
                    return next();
                        
                       
                } else {
                    return res.status(400).send({errors: 'Invalid Login information'});
                }
            }
        });
};


exports.hasOTPResendFPValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
       
        if (!req.body.email) {
            errors.push('Missing email field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing userid and email fields'});
    }
};


exports.hasChangePasswordValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }

        if (!req.body.otp) {
            errors.push('Missing otp field');
        }
        
        if (!req.body.newPassword) {
            errors.push('Missing new Password field');

        }else{
            if (req.body.newPassword.length<6) {
                errors.push('New Password length is short');
            }
        }
        
        if (req.body.confirmPassword!=req.body.newPassword) {
            errors.push('Confirm and New password not match');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing Password fields'});
    }
};


exports.isPasswordAndUserMatchTemp = (req, res, next) => {
    UserModel.findByUsername(req.params.username.trim())
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid Login information'});
            }else{
                
                if (1 === 1) {
                   // console.log("OK1")
                    req.body = {
                            userId: user.id?user.id:"",
                            email: user.email,
                            uid: user.uid?user.uid:0,
                            name: user.name ,
                            username: user.username ,
                            country: user.country ,
                            mobileno: user.mobileno 
                        
                    };
                   // console.log("OK2")
                   
                    return next();
                        
                       
                } else {
                    return res.status(400).send({errors: 'Invalid Login information'});
                }
            }
        });
};