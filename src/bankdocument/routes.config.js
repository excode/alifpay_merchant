const rootPath="../../";
  const BankdocumentController = require('./bankdocument.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'acc_no',format:'text',required:true},
{ctrl:'bankimgname',format:'text',required:true},
{ctrl:'bankimgstring',format:'',required:true},
{ctrl:'uid',format:'text',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/bankdocument', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankdocumentController.insert
      ]);
      
      
      app.get('/bankdocument', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BankdocumentController.list
      ]);
      app.get('/bankdocument/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankdocumentController.listAll
    ]);
    app.get('/bankdocument/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BankdocumentController.listSuggestions
    ]);
      app.get('/bankdocument/:bankdocumentId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BankdocumentController.getById
      ]);
      app.patch('/bankdocument/:bankdocumentId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          BankdocumentController.patchById
      ]);
      app.delete('/bankdocument/:bankdocumentId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          BankdocumentController.removeById
      ]);
  };
  
    