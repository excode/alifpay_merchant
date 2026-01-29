const AccountsModel = require('./accounts.model');
const crypto = require('crypto');
const funcs =  require("../../common/functions/funcs");
const otp =  require("../../common/functions/otp");

exports.test = async (req, res) => {
    var req ={
        "body":{
        "email":"kazad79@gmail.com"
        }
    }
    var originPass="11212121";
    await otp.sendWelcome(req.body,originPass)
}
exports.reg = (req, res) => {

    req.body.createby=req.jwt.email
    req.body.createat=funcs.getTime()
    req.body.acctype = "NORMAL";
    req.body.introducer =req.jwt.username
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    var pass= req.body.password;
    req.body.password = salt + "$" + hash;
}
   
    AccountsModel.createAccounts(req.body)
          .then(async(result) => {
            
            await otp.sendWelcome(req.body,pass)
            res.status(200).send({id: result.id});

          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
     

};
exports.reg2 = (req, res) => {

    //req.body.createby=req.jwt.email
    req.body.createat=funcs.getTime()
    req.body.acctype = "NORMAL";
    if(req.body.coop){
        req.body.acctype = "F-COP";
    }      
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    var pass= req.body.password;
    req.body.password = salt + "$" + hash;
}
   
    AccountsModel.createAccounts2(req.body)
          .then(async(result) => {
            
            await otp.sendWelcome(req.body,pass)
            res.status(200).send({id: result.id});

          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
     

};

exports.merchantReg = (req, res) => {

    req.body.createby="REG"
    req.body.createat=funcs.getTime()
             
    // Hashing  password data 
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        var pass= req.body.password;
        req.body.password = salt + "$" + hash;
    }
        req.body.createby="REG-MERCHANT"
        req.body.acctype = "MERCHANT";
        AccountsModel.createAccounts(req.body)
              .then(async(result) => {
                
                await otp.sendWelcome(req.body,pass)
                res.status(200).send({id: result.id});
    
              }).catch((err)=>{
                 
                  res.status(400).json( {err:err} );
              });
         
    
    };

  exports.insert = (req, res) => {
            req.body.createby=req.jwt.email  
        req.body.createat=funcs.getTime() 
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
            AccountsModel.createAccounts(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      req.query.createby = req.jwt.email;
       /*
        IMPORTANT
        you can put predefined condition here  based on user and role  
        for example 
        req.query.createBy = req.JWT.email
        req.query.organizationId = req.JWT.userOrganization

        you can also put condition based on user role
        like 
        if(req.JWT.userType>1) 
        req.query.organizationId = req.JWT.userOrganization //  I
        }
        */
      if (req.query) {
          if (req.query.page) {
              req.query.page = parseInt(req.query.page);
              page = Number.isInteger(req.query.page) ? req.query.page : 0;
          }
      }
      AccountsModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    
    /*
        IMPORTANT
        you can put predefined condition here  based on user and role  
        for example 
        req.query.createBy = req.JWT.email
        req.query.organizationId = req.JWT.userOrganization

        you can also put condition based on user role
        like 
        if(req.JWT.userType>1){ 
        req.query.organizationId = req.JWT.userOrganization //  I
        }
     */
        req.query.id = req.JWT.userId;
    AccountsModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    
    /*
    IMPORTANT
    HERE  "serach" query parameter is reserved for keword searh  
    you can put predefined condition here  based on user and role  
    for example 
    req.query.createBy = req.JWT.email
    req.query.organizationId = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    req.query.organizationId = req.JWT.userOrganization //  I
    }
     */
    req.query.id = req.JWT.userId;
    AccountsModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
      /*
    IMPORTANT
     
    you can put predefined condition here  based on user and role  
    for example 
    filter['createBy'] = req.JWT.email
    filter['organizationId'] = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    filter['organizationId'] = req.JWT.userOrganization //  I
    }
     */
    filter['id'] = req.JWT.userId

    AccountsModel.findById(req.params.accountsId,filter)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.patchById = (req, res) => {
    req.body.updateby=req.jwt.email  
    req.body.updateat=funcs.getTime() 
   
      AccountsModel.patchAccounts(req.jwt.userId, req.body)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
    let filter ={}
      /*
    IMPORTANT
     
    you can put predefined condition here  based on user and role  
    for example 
    filter['createBy'] = req.JWT.email
    filter['organizationId'] = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    filter['organizationId'] = req.JWT.userOrganization //  I
    }
     */
    filter['id'] = req.JWT.userId
    AccountsModel.removeById(req.params.accountsId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  
exports.uploadfile=(req,res)=>{
    
    AccountsModel.uploadFile(req)
        .then((result) => {
                res.status(201).send( result);
        }).catch((err)=>{

        res.status(400).json( {err :err});
    });
}
        

    
exports.getByEmail = (req, res) => {
    
     
    let email = req.params.email

    AccountsModel.findByEmail(email)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };