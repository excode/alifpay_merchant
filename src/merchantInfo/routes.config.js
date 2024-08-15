const rootPath="../../";
  const MerchantInfoController = require('./merchantInfo.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'contactperson',format:'text',required:true},
{ctrl:'mobileno',format:'phone',required:true},
{ctrl:'introducer',format:'text',required:true},
{ctrl:'email',format:'email',required:true},
{ctrl:'street',format:'text',required:true},
{ctrl:'address',format:'text',required:true},
{ctrl:'city',format:'text',required:true},
{ctrl:'state',format:'text',required:true},
{ctrl:'postcode',format:'text',required:true},
{ctrl:'country',format:'text',required:true},
{ctrl:'avgtransaction',format:'number',required:true},
{ctrl:'avgmonthlytransaction',format:'number',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/merchantinfo', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MerchantInfoController.insert
      ]);
      
      
    app.post('/merchantinfo/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.merchantinfoInsertPermission(),  // 
        //PermissionMiddleware.jmerchantinfoInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MerchantInfoController.uploadfile
    ]);
        
      app.get('/merchantinfo', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          MerchantInfoController.list
      ]);
      app.get('/merchantinfo/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MerchantInfoController.listAll
    ]);
    app.get('/merchantinfo/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MerchantInfoController.listSuggestions
    ]);
      app.get('/merchantinfo/:merchantinfoId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          MerchantInfoController.getById
      ]);
      app.patch('/merchantinfo/:merchantinfoId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          MerchantInfoController.patchById
      ]);
      app.delete('/merchantinfo/:merchantinfoId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          MerchantInfoController.removeById
      ]);
      app.post('/merchantinfo/sendApplication', [
        ValidationMiddleware.validJWTNeeded,
        ValidationMiddleware.infoValid,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        MerchantInfoController.sendApplication
    ]);
  };
  
    