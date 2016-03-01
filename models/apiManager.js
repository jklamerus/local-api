var _ = require('lodash'),
    schemaValidator = require('../models/schemaValidator'),
    Q = require('q'),
    winston = require('winston'),
    url = require('url'),
    ramlRoot,
    resourcesUrls = [],
    methodToValidate = ['post', 'put', 'patch'];

var getResponse = function (ramlRoot, req) {

    var deferred = Q.defer();

    var contentType, basedPath, currentMethod, currentResource, successResponse, validationSchema, postPutPatchReq,
        successResponseObj, currentHeaders;

    contentType = localUtils.getContentType(req);

    req.method = req.method.toLowerCase();

    // remove baseUri path
    basedPath = localUtils.removeBaseUri(req.path, ramlRoot.baseUri, ramlRoot.version);

    // find current resource in raml definitions
    currentResource = localUtils.findResource(basedPath);

    // find chosen method in raml definitions
    //console.log('Resource: ', currentResource);
    currentMethod = localUtils.findMethod(currentResource, req.method);

    //console.log('Method: ', currentMethod);
    if (contentType && currentMethod.method != 'get') {
        localUtils.checkRequestContentType(currentMethod, contentType);
    }

    // find success response in this resource
    successResponseObj = localUtils.findSuccessResponse(currentMethod.responses, contentType);
    successResponse = successResponseObj.body;

    // find success headers in this resource
    currentHeaders = successResponseObj.headers;

    // check if POST, PUT or PATCH method
    postPutPatchReq = methodToValidate.indexOf(req.method) >= 0;

    // find validation schema for request data
    validationSchema = postPutPatchReq ? localUtils.findValidationSchema(currentMethod, contentType) : null;

    // check if sent data is valid (POST, PUT, PATCH)
    if (validationSchema) {

        var result = localUtils.validateJson(req.body, validationSchema);

        var _finalRes;
        if (result.errors.length > 0) {
            var error = result.errors.shift();
            _finalRes = {
                data: {
                    message: error.stack.substr(result.propertyPath.length + 1)
                },
                code: 400
            }
        } else {

            var resBody, example;

            if (successResponse.example === false) {
                example = req.body;
            } else if (!successResponse.example) {
                example = "";
            } else {
                try {
                    example = JSON.parse(successResponse.example);
                } catch (e) {
                    example = successResponse.example;
                }
            }

            if (_.isObject(req.body) && _.isObject(example)) {
                resBody = _.clone(example, true);
                for (var key in req.body) {
                    resBody[key] = req.body[key];
                }
            } else {
                resBody = example;
            }

            _finalRes = {
                data: resBody,
                code: successResponseObj.code,
                headers: currentHeaders
            }
        }
        deferred.resolve(_finalRes);

    } else {
        // send response
        deferred.resolve({
            data: successResponse.example,
            code: successResponseObj.code,
            headers: currentHeaders
        });
    }

    return deferred.promise;

};

var localUtils = {

    removeBaseUri: function (path, baseUri, version) {
        if (baseUri) {
            var basePath = url.parse(baseUri).pathname.replace(/^\/?/, '/');
            versionedBasePath = basePath.replace(/{version}/, version).replace(/%7Bversion%7D/, version),
                re = new RegExp('^' + versionedBasePath),
                basedPath = path.replace(re, '/').replace(/\/\//, '/');
            return basedPath;
        } else {
            return path;
        }
    },

    getContentType: function (req) {
        var contentType = req.header('Content-Type');
        return contentType ? contentType.split(';')[0] : null;
    },

    findResource: function (path) {
        var resources = _.clone(resourcesUrls).reverse();
        for (var i = 0, j = resources.length; i < j; i++) {
            var obj = resources[i];
            try {
                var regExp = new RegExp('^' + obj.uri + '$');
                if (regExp.test(path)) {
                    var matches = regExp.exec(path).slice(1);
                    if (matches.length) {
                        var values = {};
                        var schema = {
                            properties: {}
                        };
                        for (var k = 0, l = matches.length; k < l; k++) {
                            values[obj.uriParameters[k].name] = this.getMatchValue(matches[k], obj.uriParameters[k].schema);
                            schema.properties[obj.uriParameters[k].name] = obj.uriParameters[k].schema;
                        }

                        var jsonSchemaValidator = schemaValidator.get();
                        var validation = jsonSchemaValidator.validate(values, schema);
                        if (validation.errors.length > 0) {
                            throw new Error('Validation errors');
                        }
                    }
                    return obj.resource;
                }
            } catch (e) {
                /** Validation errors, which means that some uri params do not validate to matched raml url **/
            }
        }

        throw new Error('Specified path not in raml');
    },

    getMatchValue: function (match, schema) {
        if (schema.type) {
            switch (schema.type) {
                case 'number':
                    var parsedFloat = parseFloat(match);
                    if (parsedFloat == match) {
                        return parsedFloat
                    } else {
                        throw new Error('Unable to parse');
                    }
                    break;
                case 'integer':
                    var parsedInt = parseInt(match);
                    if (parsedInt == match) {
                        return parsedInt
                    } else {
                        throw new Error('Unable to parse');
                    }
                    break;
                case 'boolean':
                    var lowerCase = match.toLowerCase();
                    if (['true', 'false'].indexOf(lowerCase) >= 0) {
                        return lowerCase == 'true';
                    } else {
                        throw new Error('Incorrect boolean value');
                    }
                    break;
            }
        }
        return match;
    },

    findMethod: function (resource, method) {
        if (resource.methods && (res = _.find(resource.methods, {method: method}))) {
            return res;
        }
        throw new Error('Specified method not in raml');
    },


    checkRequestContentType: function (resource, contentType) {
        var approvedType = ['application/json', 'text/plain', 'raw', 'application/x-www-urlencoded'];

        if (approvedType.indexOf(contentType) != -1) {

            var reqContentType = resource.body[contentType] || null;
            var approvedContentType = Object.keys(resource.body);

            if (reqContentType) {
                return reqContentType;
            } else {
                throw new Error('Content-Type ' + contentType + ' is not specified for this resource. Specified Content-Type: ' + approvedContentType);
            }

        }
        else {
            throw new Error('You can only use request content-type from ' + approvedType);
        }


    },

    findSuccessResponse: function (responses, contentType) {

        var resObj = localUtils.getFirstElem(responses),
            code = resObj.value,
            responseCode = resObj.key;

        if (!code) {
            throw new Error('Success response is not specified for this resource');
        }

        var body = code.body,
            headers = code.headers;
        if (!body) {
            throw new Error('Body is not specified for this resource');
        }

        var succ = body['application/json'];
        if (!succ) {
            throw new Error('No data for undefined Content-Type');
        }

        return {
            body: succ,
            headers: headers,
            code: responseCode
        };
    },

    findValidationSchema: function (method, contentType) {
        return method && method.body && method.body[contentType] && method.body[contentType].schema ? JSON.parse(method.body[contentType].schema) : null;
    },

    validateJson: function (body, schema, succ) {

        var jsonSchemaValidator = schemaValidator.get();
        return jsonSchemaValidator.validate(body, schema);
    },

    setCustomHeaders: function (headers, res) {
        for (var key in headers) {
            var curr = headers[key];
            res.set(key, curr.example.replace(/(\n|\r)/g, ''));
        }
    },

    getFirstElem: function (obj) {
        for (var key in obj) {
            return {
                key: key,
                value: obj[key]
            }
            break;
        }
    }

};

module.exports = {

    setRamlRoot: function (raml) {
        ramlRoot = raml;
    },

    buildResourcesUrls: function () {
        function next(currentResource, params) {

            if (currentResource.relativeUriPathSegments) {
                currentResource.relativeUriPathSegments.forEach(function (segment) {
                    var match = /\{(.*)\}/.exec(segment);
                    if (match) {
                        params.uriSegments.push('(.*)');
                        params.uriParameters.push({
                            name: match[1],
                            schema: currentResource.uriParameters[match[1]]
                        });
                    } else {
                        params.uriSegments.push(segment);
                    }
                });
                params.resource = currentResource;
                params.uri = '/' + params.uriSegments.join('/');

                resourcesUrls.push(params);
            }

            if (currentResource.resources) {
                _.forEach(currentResource.resources, function (resource) {
                    next(resource, _.cloneDeep(params));
                })
            }
        }

        next(ramlRoot, {uriSegments: [], uri: '', uriParameters: []});
    },

    ramlMethods: function (req, res) {

        var self = this;

        try {
            getResponse(ramlRoot, req).then(function (ramlRes) {
                if (ramlRes.headers) {
                    localUtils.setCustomHeaders(ramlRes.headers, res);
                }
                if (!res.get('Content-Type')) {
                    res.set('Content-Type', 'application/json'); // set default content-type
                }
                res.status(ramlRes.code).send(ramlRes.data);
            });
        } catch (e) {
            winston.error(e);
            res.status(404).send({
                "message": "This resource does not exist, look into the documentation",
                "code": 40402
            });
        }

    }

};
