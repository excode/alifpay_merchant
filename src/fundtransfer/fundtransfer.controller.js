const FundtransferModel = require('./fundtransfer.model');
const CasaModel = require('../../src/casa/casa.model');
  const funcs =  require("../../common/functions/funcs");
  
  exports.insert = (req, res) => {
        
        req.body.createby=req.jwt.email  
        req.body.createat=funcs.getTime()
        
        CasaModel.casaFundTransfer(req).then((done)=>{

       /**
        * {
"Header":
{ "status":"status code",
"message":"respond msg & reason"}, 
"Body":
{
"amount": "100.00",
"sourceAccount": "636840xxxxxx5110",
"transfer_in_reference_id": "0",
"sourceAccountTokenize": "636840t0Ifkp5110",
"transfer_out_reference_id": "5730",
"servicecharges": "0.50",
"gst": "0.03",
"destinationBankAccount": "1111257898814567",
"trx_date": "2017-08-11 15:45:39.05",
} }
        */
    let resData = done.Body;
    req.body.sourceaccount=resData.sourceAccount  
    req.body.transfer_in_reference_id=resData.transfer_in_reference_id  
    req.body.sourceaccounttokenize= resData.sourceAccountTokenize  
    req.body.transfer_out_reference_id=resData.transfer_out_reference_id  
    req.body.servicecharges=resData.servicecharges  
    req.body.gst=resData.gst  
    req.body.destinationbankaccount=resData.destinationBankAccount  
    req.body.trx_date=resData.trx_date  
            FundtransferModel.createFundtransfer(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
                }).catch((failed)=>{
                     
                    res.status(400).json( {err:failed} );
            });
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      req.query={...req.query,createby:req.jwt.email}
      
      if (req.query) {
          if (req.query.page) {
              req.query.page = parseInt(req.query.page);
              page = Number.isInteger(req.query.page) ? req.query.page : 0;
          }
      }
      FundtransferModel.list(limit, page,req.query)
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
    FundtransferModel.listAll(req.query)
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
    FundtransferModel.listSuggestions(req.query)
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
    FundtransferModel.findById(req.params.fundtransferId,filter)
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
      FundtransferModel.patchFundtransfer(req.params.fundtransferId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
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
    FundtransferModel.removeById(req.params.fundtransferId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.summary = (req, res ) => {
    req.query={...req.query,createby:req.jwt.email}
    
    FundtransferModel.summary(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  

    