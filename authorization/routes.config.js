const VerifyUserMiddleware = require('./middlewares/verify.user.middleware');
const AuthorizationController = require('./controllers/authorization.controller');
//const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
exports.routesConfig = function (app) {

    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);
    app.post('/auth2', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.loginOTP
    ]);
    app.post('/refreshMytoken', [
        ValidationMiddleware.verifyRefreshBodyField,
        //VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.refresh_token
    ]);
    app.post('/authVerify', [
        VerifyUserMiddleware.hasOTPValidFields,
        VerifyUserMiddleware.isOTPMatch,
        AuthorizationController.loginOTP
    ]);
    app.post('/resendOTP', [
        VerifyUserMiddleware.hasOTPResendValidFields,
        VerifyUserMiddleware.isOTPResendMatch,
        AuthorizationController.resendOTP
    ]);


    app.post('/changePassword', [
        ValidationMiddleware.validJWTNeeded,
        VerifyUserMiddleware.hasChangeValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch2,
        AuthorizationController.changePassword
    ]);

    app.post('/resendOTPFP', [
        VerifyUserMiddleware.hasOTPResendFPValidFields,
        VerifyUserMiddleware.isOTPResendMatch,
        AuthorizationController.resendOTPFP
    ]);

    app.post('/changePassword2', [
        VerifyUserMiddleware.hasChangePasswordValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch3,
        AuthorizationController.changePassword
    ]);

    app.post('/authtest/:username', [
        //VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatchTemp,
        AuthorizationController.loginOTP
    ]);
    
};