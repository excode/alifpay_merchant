const rootPath="../../";
  const BankController = require('./bank.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'bank_id',format:'int',required:true},
{ctrl:'bank_name',format:'text',required:true},
{ctrl:'bank_logo_url',format:'url',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/bank', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankController.insert
      ]);
      
      
      app.get('/bank', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BankController.list
      ]);
      app.get('/bank/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankController.listAll
    ]);
    app.get('/bank/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankController.listSuggestions
    ]);
      app.get('/bank/:bankId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BankController.getById
      ]);
      app.patch('/bank/:bankId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          BankController.patchById
      ]);
      app.delete('/bank/:bankId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          BankController.removeById
      ]);
  };
  
    