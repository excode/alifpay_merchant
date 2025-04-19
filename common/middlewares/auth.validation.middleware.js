const jwt = require('jsonwebtoken'),
secret = require('../config/env.config.js').jwt_secret
//const MerchantModel = require('../../src/merchantInfo/merchantinfo.model');
const MerchantModel = require('../../src/merchantInfo/merchantInfo.model.js')
const BankAccountModel = require('../../src/bankaccount/bankaccount.model');
const OwnerModel = require('../../src/ownerDetails/ownerDetails.model');
crypto = require('crypto');
const  env  = process.env;
exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    }
};




exports.validJWTNeeded = (req, res, next) => {
    let jwt_Secret =  env.PROJECT_ID??secret ;
    

    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], jwt_Secret);
                
                return next();
            }

        } catch (err) {
            console.log(err)
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
};


exports.infoValid = async(req, res, next) => {
    let merchantEmail =  req.jwt.email
    const merchant= await MerchantModel.findByEmail2(merchantEmail);
    if(merchant){
        req.body.merchant =merchant
    }else{
        return res.status(401).send({err:"Merchant information not available"}); 
    }
   
    const bankAccounts =await BankAccountModel.listAll({createby:merchantEmail});
    
    if(bankAccounts && bankAccounts.length>0){
        req.body.bankAccounts=bankAccounts; 
    }else{
        return res.status(401).send({err:"Merchant bank information not available"}); 
    }
    const owners = await OwnerModel.listAll({createby:merchantEmail});
      
    if(owners && owners.length>0){
        req.body.owners=owners; 
    }else{
        return res.status(401).send({err:"Business owner information not available"}); 
    }

   
                
        return next();
           
};