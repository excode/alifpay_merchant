const rootPath="../../";
  const AccountsController = require('./accounts.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const crypto = require('crypto');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'email',format:'email',required:true,max:250,min:5},
{ctrl:'name',format:'text',required:true,max:150,min:2},
{ctrl:'address',format:'text',required:false,max:250,min:2},
{ctrl:'city',format:'text',required:false},
{ctrl:'state',format:'text',required:false},
{ctrl:'postcode',format:'text',required:false},
{ctrl:'password',format:'password',required:true},
{ctrl:'country',format:'text',required:false},
{ctrl:'username',format:'text',required:true}
  ];

  const formValidationMerchantRules=[
    {ctrl:'email',format:'email',required:true,max:250,min:5},
    {ctrl:'name',format:'text',required:true,max:150,min:2},
    {ctrl:'address',format:'text',required:true,max:250,min:2},
    {ctrl:'city',format:'text',required:true},
    {ctrl:'state',format:'text',required:true},
    {ctrl:'postcode',format:'text',required:true},
    {ctrl:'password',format:'password',required:true},
    {ctrl:'businessname',format:'text',required:true},
    {ctrl:'businessregistration',format:'text',required:false},
    {ctrl:'username',format:'text',required:true}
  ];

  const formValidationRules2=[
{ctrl:'introducer',format:'text',required:true,max:250,min:5},
{ctrl:'email',format:'email',required:true,max:250,min:5},
{ctrl:'name',format:'text',required:true,max:150,min:2},
{ctrl:'address',format:'text',required:false,max:250,min:2},
{ctrl:'city',format:'text',required:false},
{ctrl:'state',format:'text',required:false},
{ctrl:'postcode',format:'text',required:false},
{ctrl:'password',format:'password',required:true},
{ctrl:'country',format:'text',required:false},
{ctrl:'username',format:'text',required:true}
  ];
  exports.routesConfig = function (app) {
    
      
    app.post('/accounts/reg', [
      ValidationMiddleware.validJWTNeeded,
      FormValidation.formValidation(formValidationRules),
      AccountsController.reg
    ]);
    app.post('/accounts/reg2', [
     // ValidationMiddleware.validJWTNeeded,
      FormValidation.formValidation(formValidationRules2),
      AccountsController.reg2
    ]);
   
    
   
        
      app.get('/accounts', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountsController.list
      ]);
      app.get('/accounts/fp/:email/', [
        //ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountsController.getByEmail
    ]);
    
     
  };
  
    