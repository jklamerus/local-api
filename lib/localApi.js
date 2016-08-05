var express = require('express'),
    pack = require('../package'),
    path = require('path'),
    bodyParser = require("body-parser"),
    app = express(),
    _ = require('lodash'),
    ramlParser = require('raml-parser'),
    winston = require('winston'),
    colors = require('colors'),
    fs = require('fs'),
    Q = require('q'),
    ramlRoot,
    server;

app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.raw());

var customUtils = require('./../models/utils.js'),
    apiManager = require('./../models/apiManager.js'),
    templatesManager = require('./../models/templatesManager.js');

// set global data
global.lapi = {
    appRoot: path.resolve(__dirname), // app root dir path
    ramlAddress: null // raml url
};

exports.start = function (ramlUrl, options) {

    global.lapi.ramlAddress = ramlUrl;
    options.port = typeof(options.port) != 'undefined' ? options.port : 3333;
    options.examples = typeof(options.examples) != 'undefined' ? options.examples : true;

    // set raml root dir path
    global.lapi.ramlRootDir = customUtils.getRamlRootDir(ramlUrl);

    winston.info('LocalAPI'.cyan, pack.version, 'by IsaaCloud.com');
    winston.info('[localapi]', 'Run app'.green);
    fs.readFile(__dirname + '/../docs/ascii.txt', 'utf-8', function (err, content) {
        if (!err) {
            console.log(content);
        }
    });

    var examples;

    if (!options.examples) {
        var defer = Q.defer();
        examples = defer.promise;
        defer.resolve();
    } else {
        examples = templatesManager.run();
    }

    examples.then(function () {

        winston.debug('[localapi]', 'Start'.yellow, 'raml loading');
        return ramlParser.loadFile(lapi.ramlAddress);


    }).then(function (data) {

        ramlRoot = data;
        apiManager.setRamlRoot(data);
        winston.debug('[localapi]', 'Success'.green, 'raml loading');

        app.use(customUtils.restLogger);
        app.use(customUtils.errorLogger);

        //app.get('/oauth/auth', oauthManager.auth);
        //app.all('/oauth/token', oauthManager.token);
        app.all('*', apiManager.ramlMethods);

        apiManager.buildResourcesUrls();

        server = app.listen(options.port, function () {
            var port = server.address().port;

            winston.debug('[localapi]', 'Finished'.green);
            winston.info('[localapi]', 'App running at', colors.gray('http://localhost:' + port))
        });

        server.on('error', function (e) {
            if (e.code == 'EADDRINUSE') {
                winston.error('Port is already in use, please choose another port'.red);
            } else {
                throw e;
            }
        });

    }, function (error) {
        winston.error(error.message);
        winston.debug(error);
    });
};