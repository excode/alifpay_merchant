const MpayModel = require('./casa.model');
const funcs =  require("../../common/functions/funcs");
const mpay = require("../../common/functions/mpay");
  exports.bankList = (req, res) => {
        
        MpayModel.bankList(req)
        .then((result) => {
                
        res.status(200).send(result);

        }).catch((err)=>{
            console.log(err)
            res.status(400).json( {err:err} );
        });
  };
  
  exports.bankAccList = (req, res) => {

    MpayModel.bankAccList(req)
    .then((result) => {
            
    res.status(200).send(result);

    }).catch((err)=>{
        
        res.status(400).json( {err:err} );
    });
};

exports.bankEnroll = (req, res) => {
   
    MpayModel.bankEnroll(req)
    .then((result) => {
            
    res.status(200).send(result);

    }).catch((err)=>{
        
        res.status(400).json( {err:err} );
    });
};


exports.uploadBankDoc = (req, res) => {
   
    MpayModel.uploadBankDoc(req)
    .then((result) => {
            
    res.status(200).send(result);

    }).catch((err)=>{
        
        res.status(400).json( {err:err} );
    });
};

exports.removeBankAcc = (req, res) => {
   
    MpayModel.removeBankAcc(req)
    .then((result) => {
            
    res.status(200).send(result);

    }).catch((err)=>{
        
        res.status(400).json( {err:err} );
    });
};

exports.casaFundTransfer = (req, res) => {
   
    MpayModel.casaFundTransfer(req)
    .then((result) => {
            
    res.status(200).send(result);

    }).catch((err)=>{
        
        res.status(400).json( {err:err} );
    });
};

