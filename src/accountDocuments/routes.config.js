const rootPath="../../";
  const AccountDocumentsController = require('./accountDocuments.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'accountid',format:'int',required:true},
{ctrl:'documenttype',format:'',required:true},
{ctrl:'documentnumber',format:'text',required:true},
{ctrl:'verified',format:'boolean',required:false},
{ctrl:'verfricationstatus',format:'number',required:false}
  ];
  exports.routesConfig = function (app) {
      app.post('/accountdocuments', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountDocumentsController.insert
      ]);
      
      
    app.post('/accountdocuments/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.accountdocumentsInsertPermission(),  // 
        //PermissionMiddleware.jaccountdocumentsInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountDocumentsController.uploadfile
    ]);
        
      app.get('/accountdocuments', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountDocumentsController.list
      ]);
      app.get('/accountdocuments/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountDocumentsController.listAll
    ]);
    app.get('/accountdocuments/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountDocumentsController.listSuggestions
    ]);
      app.get('/accountdocuments/:accountdocumentsId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountDocumentsController.getById
      ]);
      app.get('/accountdocuments/:accountdocumentsId/:doctype', [
       // ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountDocumentsController.getByIdImage
    ]);
      app.patch('/accountdocuments/:accountdocumentsId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          AccountDocumentsController.patchById
      ]);
      app.delete('/accountdocuments/:accountdocumentsId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          AccountDocumentsController.removeById
      ]);
  };
  
    