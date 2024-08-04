const rootPath="../../";
  const MpaycardController = require('./mpaycard.controller');
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
     
      
      
      app.get('/mpaycard', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          MpaycardController.list
      ]);
      app.get('/mpaycard/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MpaycardController.listAll
    ]);
    app.get('/mpaycard/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        MpaycardController.listSuggestions
    ]);
      app.get('/mpaycard/:mpaycardId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          MpaycardController.getById
      ]);
      app.patch('/mpaycard/:mpaycardId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          MpaycardController.patchById
      ]);
    
  };
  
    