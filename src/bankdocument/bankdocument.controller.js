const BankdocumentModel = require('./bankdocument.model');

  const funcs =  require("../../common/functions/funcs");
  
  exports.insert = (req, res) => {
            req.body.createby=req.jwt.email  
        req.body.createat=funcs.getTime()
        req.body.id=req.jwt.id
        
            BankdocumentModel.createBankdocument(req.body)
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
      BankdocumentModel.list(limit, page,req.query)
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
    BankdocumentModel.listAll(req.query)
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
    BankdocumentModel.listSuggestions(req.query)
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
    BankdocumentModel.findById(req.params.bankdocumentId,filter)
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
      BankdocumentModel.patchBankdocument(req.params.bankdocumentId, req.body,filter)
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
    BankdocumentModel.removeById(req.params.bankdocumentId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  

    