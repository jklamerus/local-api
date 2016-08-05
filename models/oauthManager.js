//var oidc = require('openid-connect').oidc();

module.exports = function () {

}

//var _ = require('lodash');
//
//module.exports = function(config){
//
//    function getRedirectUrl(req){
//
//        var _res;
//
//        if (req.query.origin) {
//
//            _res = req.query.origin + req.url;
//            _res += '#access_token=' + config.appToken + '&token_type=Bearer&expires_in=3600';
//
//        } else {
//
//            console.log('[error] No origin parameter specified.'.red)
//            _res = config.baseUrl;
//
//        }
//
//        return _res;
//
//    }
//
//    return {
//        auth: function (req, res) {
//            res.redirect(303, getRedirectUrl(req));
//        },
//
//        token: function (req, res) {
//            if(req.method === 'POST'){
//
//                res.header('Content-Type','application/json');
//
//                var body = req.body,
//                    headers = req.headers,
//                    status,
//                    response;
//
//                if (!headers.authorization) {
//                    response = {error: "Missing http header: Authorization"};
//                    status = 401;
//                } else if (headers.authorization.indexOf('Basic ') != 0) {
//                    response = {error: "Authorization token is invalid"};
//                    status = 401;
//                } else if (!body.grant_type) {
//                    response = {error: "Required parameter is missing: grant_type"};
//                    status = 401;
//                } else if (body.grant_type !== 'client_credentials') {
//                    response = {error: "Required parameter is invalid: grant_type"};
//                    status = 401;
//                } else {
//                    response = {
//                        token_type: "Bearer",
//                        expires_in: "3600",
//                        access_token: config.appToken
//                    };
//                    status = 200;
//                }
//
//                res.status(status).send(response);
//
//            } else {
//                res.redirect(303, config.baseUrl);
//            }
//
//
//        }
//
//    };
//
//
//};
