const rootPath="../../";
  const BankaccountController = require('./bankaccount.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
  
{ctrl:'bank_id',format:'int',required:true},
{ctrl:'acc_no',format:'text',required:true},
{ctrl:'acctype_id',format:'number',required:true},
{ctrl:'acc_desc',format:'text',required:true},

  ];
  exports.routesConfig = function (app) {
      app.post('/bankaccount2', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankaccountController.insert
      ]);
      
      app.post('/bankaccount2/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.merchantinfoInsertPermission(),  // 
        //PermissionMiddleware.jmerchantinfoInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankaccountController.uploadfile
    ]);
      app.get('/bankaccount2', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BankaccountController.list
      ]);
      app.get('/bankaccount2/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankaccountController.listAll
    ]);
    app.get('/bankaccount2/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankaccountController.listSuggestions
    ]);
      app.get('/bankaccount2/:bankaccountId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BankaccountController.getById
      ]);
      app.patch('/bankaccount2/:bankaccountId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          BankaccountController.patchById
      ]);
      app.delete('/bankaccount2/:bankaccountId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          BankaccountController.removeById
      ]);
  };
  
    