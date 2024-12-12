const UsersModel = require('./users.model');
const crypto = require('crypto');
const funcs =  require("../../common/functions/funcs");
//const MPayModel = require('../../src/mpay/mpay.model');
  
exports.reg = (req, res) => {

    req.body.createby="REG"
req.body.createat=funcs.getTime()
         
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
    UsersModel.createUsers(req.body)
          .then((result) => {
                  
            res.status(200).send({id: result.id});

          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
     

};

  exports.insert = (req, res) => {
            req.body.createby=req.jwt.email  
        req.body.createat=funcs.getTime()
        req.body.id=req.jwt.id
         
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
            UsersModel.createUsers(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      req.query={...req.query,id:req.jwt.id}
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
      UsersModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    req.query={...req.query,id:req.jwt.id}
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
    UsersModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    req.query={...req.query,id:req.jwt.id}
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
    UsersModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = async(req, res) =>{
    let filter ={}
    let include = req.query.exclude?req.query.exclude:1
    let cardInfo ={};//include==1? await MPayModel.getcardbalance(req):{};
    let usuerInfo={};
    let card={};
    let mpayinfo={};
    if(include==1){
        try{
            cardInfo=  {};
            card=cardInfo["Body"]["cardlist"]??{};
        }catch{
            card = {"cardno":"error","balance":"err","accStatus":""}
        }
   
        try{
            usuerInfo=  {};
            mpayinfo = usuerInfo;
        }catch{
            /*
userInfo = data;
        listOfAccStatus = cf.listSearch(
            c.accStatusData, userInfo?["card"]["accStatus"] ?? "");
        listOfUserStatus = cf.listSearch(c.userStatusData,
            userInfo?["mpayinfo"]["userstatuslookup_id"] ?? "");

        listOfDocStatus = cf.listSearch(
            c.docStatusData, userInfo?["mpayinfo"]["docstatuslookup_id"] ?? "");

        listOfkycStatus = cf.listSearch(
            c.kycStatusData, userInfo?["mpayinfo"]["kycstatuslookup_id"] ?? "");
      });
      cardno = userInfo?['card']['cardno'] ?? "1111222233334444";
            */
            mpayinfo = {"name":"error","balance":"err","userstatuslookup_id":"1","docstatuslookup_id":"0","kycstatuslookup_id":"0"}
        }
    }
    //let usuerInfo = include==1? await MPayModel.getaccountinfo(req):{};
    console.log("AAAAA")
    UsersModel.findById(req.jwt.userId,filter)
          .then((result) => {
            const {otp,password,otpfor,walletbalanceencrypted,otpexpires, ...rest}= result;
            
            
              res.status(200).send({...rest,card,mpayinfo});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };

  exports.getById2 = (req, res) => {
    let filter ={}
    
    UsersModel.findById(req.params.usersId)
          .then((result) => {
            const {verfricationstatus, ...rest}= result;
           // if(parseInt(verfricationstatus)==1){
                const {id,username,name, ...rest1}= rest;

                res.status(200).send({id,username,name});
           // }else{
              //  res.status(400).json( {err:"User not verified"} );
          //  }


              //res.status(200).send(rest);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.patchById = (req, res) => {
      req.body.updateby=req.jwt.email  
        req.body.updateat=funcs.getTime() 
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
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
      UsersModel.patchUsers(req.params.usersId, req.body,filter)
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
    UsersModel.removeById(req.params.usersId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };

  exports.removeUserById = (req, res) => { 
 
      res.status(200).send({data:"USER DELETED "});
  
};

exports.requestOtp2 = (req, res) => {
    let username =req.params.username
    let forType=req.body.type??0;
    let reqFor="{mobile:'"+req.jwt.mobileno+"',name:'"+req.jwt.name+"',username:'"+req.jwt.username+"',for:'Link wallet with merchant-store QR Code'}";
  
    if(forType==1){
      
    }
      UsersModel.requestOtp2(username, reqFor)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  exports.getOtp2Info = (req, res) => {
      let username =req.jwt.username
      //let forType=req.body.type??0;
     // let reqFor="{mobile:'"+req.jwt.mobileno+"',name:'"+req.jwt.name+"',username:'"+req.jwt.username+"',for:'Link wallet with merchant-store QR Code'}";
    
      //if(forType==1){
        
      //}
        UsersModel.getOtp2For(username)
            .then((result) => {
                res.status(200).send(result);
            }).catch((err)=>{
              console.log(err)
                res.status(400).json( {err:err} );
            });
    
    };
  
    exports.updateOtp2 = (req, res) => {
      let username =req.jwt.username
      let otp2= funcs.randomNumber(6);
      //let forType=req.body.type??0;
     // let reqFor="{mobile:'"+req.jwt.mobileno+"',name:'"+req.jwt.name+"',username:'"+req.jwt.username+"',for:'Link wallet with merchant-store QR Code'}";
    
      //if(forType==1){
        
      //}
        UsersModel.updateOtp2(username,otp2)
            .then((result) => {
                res.status(200).send(result);
            }).catch((err)=>{
              console.log(err)
                res.status(400).json( {err:err} );
            });
    
    };
  
    exports.verifyOtp2=(req, res)=>{
      console.log(req.body)
      let otp2=req.body.otp2
      let username= req.body.username
      UsersModel.verifyOtp2(username,otp2,req.jwt.username)
      .then((result) => {
          res.status(200).send(result);
      }).catch((err)=>{
        console.log(err)
          res.status(400).json( {err:err} );
      });
    }
  

    