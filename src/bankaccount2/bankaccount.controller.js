const BankaccountModel = require('./bankaccount.model');
const BankModel = require('../../src/bank/bank.model');
const funcs =  require("../../common/functions/funcs");
  
  exports.insert =async (req, res) => {
        req.body.createby=req.jwt.email  
        req.body.createat=funcs.getTime()


       let bankinfo = await BankModel.findById(req.body.bank_id,{});
       req.body.bank_name=bankinfo.bank_name||''
       req.body.acctype_desc=req.body.acctype_id==2?'Current Account':'Savings Account'
          BankaccountModel.createBankaccount(req.body).then((ss)=>{
            //CasaModel.bankAccList(req)
                   // .then((result) => { 
                            
                        res.status(200).send({id: ss.id});
    
                   // }).catch((err)=>{
                        
                      //  res.status(400).json( {err:err} );
                   // });
            }).catch((err1)=>{
                        
                res.status(400).json( {err:err1} );
            });
             
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      req.query={...req.query,createby:req.jwt.email}
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
      BankaccountModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    req.query={...req.query,createby:req.jwt.email}
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
    BankaccountModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    req.query={...req.query,createby:req.jwt.email}
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
    BankaccountModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
    filter['createby'] = req.jwt.email
    
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
    BankaccountModel.findById(req.params.bankaccountId,filter)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.patchById = (req, res) => {
      req.body.updateby=req.jwt.email  
        req.body.updateat=funcs.getTime()
      let filter ={}
      filter['createby'] = req.jwt.email
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
      BankaccountModel.patchBankaccount(req.params.bankaccountId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
    let filter ={}
    filter['createby'] = req.jwt.email
    
    BankaccountModel.findById(req.params.bankaccountId,filter).then((data)=>{
//console.log(data)
    
    let reqN = {...req,body:{acc_no:data.acc_no,bankinfo_id:data.bankinfo_id}}
   // console.log(reqN.body)
    CasaModel.removeBankAcc(reqN).then((deleted)=>{

       //console.log(deleted)
    BankaccountModel.removeById(req.params.bankaccountId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
        }).catch((derr)=>{
            res.status(400).json( {err:derr} );
        })
    }).catch((del_err)=>{
        res.status(400).json( {err:del_err} );
    })
  };
  
   
  

    
  exports.uploadfile=(req,res)=>{
    BankaccountModel.uploadFile(req)
        .then((result) => {
                res.status(201).send( result);
        }).catch((err)=>{

        res.status(400).json( {err :err});
    });
}