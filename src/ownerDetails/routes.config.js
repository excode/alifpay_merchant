const rootPath="../../";
  const OwnerDetailsController = require('./ownerDetails.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'name',format:'text',required:true},
{ctrl:'contactnumber',format:'phone',required:true},
{ctrl:'email',format:'email',required:true},
{ctrl:'icno',format:'text',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/ownerdetails', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OwnerDetailsController.insert
      ]);
      
      
    app.post('/ownerdetails/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.ownerdetailsInsertPermission(),  // 
        //PermissionMiddleware.jownerdetailsInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OwnerDetailsController.uploadfile
    ]);
        
      app.get('/ownerdetails', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          OwnerDetailsController.list
      ]);
      app.get('/ownerdetails/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OwnerDetailsController.listAll
    ]);
    app.get('/ownerdetails/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OwnerDetailsController.listSuggestions
    ]);
      app.get('/ownerdetails/:ownerdetailsId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          OwnerDetailsController.getById
      ]);
      app.patch('/ownerdetails/:ownerdetailsId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          OwnerDetailsController.patchById
      ]);
      app.delete('/ownerdetails/:ownerdetailsId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          OwnerDetailsController.removeById
      ]);
  };
  
    