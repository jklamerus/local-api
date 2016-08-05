var path = require('path'),
    fs = require('fs');

function logger(req) {
    console.log('##########################'.red);
    console.info('[REST] Request'.green);
    console.log('Date:'.green, new Date());
    console.log('Method:'.green, req.method);
    console.log('Url:'.green, req.url);
    console.log('Headers: \n'.green, req.headers);
    console.log('Body: \n'.green, req.body);
}

module.exports = {

    restLogger: function (req, res, next) {
        logger(req);
        return next();
    },

    errorLogger: function (err, req, res, next) {
        logger(req);
        console.log('Error: \n'.red, '[' + err.status + '] ' + err.message);

        res.status(err.status).send({
            "message": err.message,
            "code": err.status
        });
    },

    getRamlRootDir: function (url) {
        url = fs.realpathSync(url);
        var _res = url.split(path.sep);
        _res.pop();
        return _res.join(path.sep);
    }

}