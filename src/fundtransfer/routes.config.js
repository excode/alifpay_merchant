const rootPath="../../";
  const FundtransferController = require('./fundtransfer.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'amount',format:'number',required:true},
    {ctrl:'bankid',format:'number',required:true},
    //{ctrl:'cardpin',format:'int',required:true},

  ];
  exports.routesConfig = function (app) {
      app.post('/fundtransfer', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        FundtransferController.insert
      ]);
      
      
      app.get('/fundtransfer', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FundtransferController.list
      ]);
      app.get('/fundtransfer/summary', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        FundtransferController.summary
    ]);
      app.get('/fundtransfer/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        FundtransferController.listAll
    ]);
    app.get('/fundtransfer/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        FundtransferController.listSuggestions
    ]);
      app.get('/fundtransfer/:fundtransferId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FundtransferController.getById
      ]);
      app.patch('/fundtransfer/:fundtransferId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          FundtransferController.patchById
      ]);
      app.delete('/fundtransfer/:fundtransferId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          FundtransferController.removeById
      ]);
  };
  
    