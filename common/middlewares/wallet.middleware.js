
const AccountModel= require('../../src/accounts/accounts.model');
const TransferModel= require('../../src/transfer/transfer.model');
const TopupModel= require('../../src/topup/topup.model');
const crypto = require('crypto');
exports.validSourceAccount =async (req, res, next) => {
    if (req.jwt) {
        const source = await AccountModel.findByUsername(req.jwt.username)
        console.log(req.jwt)
        console.log(source)
        if(source){
            if(parseInt(source.verfricationstatus)==1){

                const newBalance = source.walletbalance + parseFloat(req.body.amount);

                if(newBalance>=0){
                    return next();
                }else{
                    return res.status(501).send({error: 'Balance low'});
                }
                
                
            }else{
                return res.status(501).send({error: 'Source account not  verified'});
            }

        }else{
            return res.status(501).send({error: 'Source account is  invalid'}); 
        }

       
    } else {
        return res.status(501).send({error: 'Source account not  verified'});
    }
};


exports.activeTransfer =async (req, res, next) => {
    if (req.jwt) {
        const active = await TransferModel.findActiveTrasfer(req.jwt.username)
        if(active){
           
                return res.status(501).send({error: 'There is an active transfer process.'});
            

        }else{
            return next(); 
        }

       
    } else {
        return res.status(501).send({error: 'Source account not  verified'});
    }
};

exports.validDestinationAccount =async (req, res, next) => {
    console.log(req.body.accountto+ "   "+req.jwt.username)
    if (req.body.accountto) {
        if(req.body.accountto.toLowerCase()!=req.jwt.username.toLowerCase()){
        const destination = await AccountModel.findByUsername(req.body.accountto)
        if(destination){
            if(parseInt(destination.verfricationstatus)==1){

               
                    return next();
               
                
                
            }else{
                return res.status(501).send({error: 'destination account not  verified 2'});
            }

        }else{
            return res.status(501).send({error: 'destination account is  invalid'}); 
        }
        }else{
            return res.status(501).send({error: 'destination and source is same'});
        }
       
    } else {
        return res.status(501).send({error: 'destination account not  verified 1'});
    }
};

exports.validDestinationAccount1 =async (req, res, next) => {
    if (req.body.accountto) {
        const destination = await AccountModel.findByUsername(req.body.accountto)
        if(destination){
            if(destination.varificationstatus==1){

               
                    return next();
               
                
                
            }else{
                return res.status(501).send({error: 'destination account not  verified 1'});
            }

        }else{
            return res.status(501).send({error: 'destination account is  invalid'}); 
        }

       
    } else {
        return res.status(501).send({error: 'destination account not  verified 2'});
    }
};

exports.isOTPMatch = (req, res, next) => {
    if (req.body.otp) {
    TransferModel.findOTP(req.body.transferId,req.jwt.username)
        .then(async(user)=>{
            if(!user){
                res.status(404).send({errors: 'Invalid OTP information 1'});
            }else{
                let passwordFields = user.otp.split('$');
                let salt = passwordFields[0];
        
                let hash = crypto.createHmac('sha512', salt).update(req.body.otp).digest("base64");
                if (hash === passwordFields[1]) {
                    
                    //await  TransferModel.flushOTP( user.id);
                    return next();
                        
                       
                } else {
                    return res.status(501).send({errors: 'Invalid OTP information 2'});
                }
            }
        });
    }else{
        return res.status(501).send({errors: 'Missing OTP data'});
    }
};




exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
     
    if (req.body) {
        if (!req.body.accountto) {
            errors.push('Missing destination account');
        }
        if (!req.body.amount) {
            errors.push('Missing amount field');
            if (Number.isNaN(req.body.amount)) {
                errors.push('Invalid Amount  field');
            }
        }
        

        if (errors.length) {
            return res.status(501).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(501).send({errors: 'Missing form data'});
    }
};


exports.validTopupAccount =async (req, res, next) => {
    if (req.jwt) {
        const source = await AccountModel.findById(req.jwt.userId)
        if(source){
            if(parseInt(source.verfricationstatus)== 1){

               
                    return next();
                
                
                
            }else{
               // console.log(source)
               // console.log(parseInt(source.verfricationstatus)== 1)
                return res.status(501).send({error: 'Topup account not  verified 1'});
            }

        }else{
            return res.status(501).send({error: 'Topup account is  invalid 2'}); 
        }

       
    } else {
        return res.status(501).send({error: 'Topup account not  verified'});
    }
};

exports.validTopupCheck =async (req, res, next) => {
    if (req.params.topupId) {
        const source = await TopupModel.checkActiveTopup(req.params.topupId)
        if(source){
            if(source.status== "PENDING"){

               
                    return next();
                
                
                
            }else{
               // console.log(source)
               // console.log(parseInt(source.verfricationstatus)== 1)
                return res.status(501).send({error: 'Topup not   valid 2'});
            }

        }else{
            return res.status(501).send({error: 'Topup ID not valid'}); 
        }

       
    } else {
        return res.status(501).send({error: 'Topup ID not valid'});
    }
};