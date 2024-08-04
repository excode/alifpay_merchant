const rootPath="../../";
  const MPayController = require('./casa.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'alifpayusername',format:'text',required:true},
{ctrl:'uid',format:'int',required:true},
{ctrl:'cardtype',format:'',required:true}
  ];


  exports.routesConfig = function (app) {
     
    app.get('/mpay/casa/banklist', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MPayController.bankList
    ]);
      
      app.get('/mpay/casa/bankAccList', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          MPayController.bankAccList
      ]);

      app.post('/mpay/casa/bankEnroll', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MPayController.bankEnroll
    ]);
   
    

    app.post('/mpay/casa/uploadbankdoc', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
      MPayController.uploadBankDoc
  ]);

  app.post('/mpay/casa/removebankacc', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    MPayController.removeBankAcc
]);
app.post('/mpay/casa/casafundtransfer', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(USER),
  MPayController.casaFundTransfer
]);

    
  };
  
    