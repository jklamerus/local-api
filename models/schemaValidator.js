var ValidatorResult = require('jsonschema').ValidatorResult;
var Validator = require('jsonschema').Validator;


var validateJsonNot = function (instance, schema, options, ctx) {
    var self = this;
    if (instance === undefined) return null;
    var result = new ValidatorResult(instance, schema, options, ctx);
    var not = schema.not || schema.disallow;
    if (!not) return null;

    if (not.type) {
        var types = not.type;
        if (!(types instanceof Array)) {
            types = [types];
        }
        types.forEach(function (type) {
            if (self.testType(instance, schema, options, ctx, type)) {
                var schemaId = type && type.id && ('<' + type.id + '>') || '<' + type + '>';
                result.addError({
                    name: 'not',
                    argument: schemaId,
                    message: "is of prohibited type " + schemaId,
                });
            }
        });
    } else {
        result.addError({
            name: 'not',
            argument: 'field',
            message: "is a prohibited field",
        });
    }
    return result;
}

var jsonSchemaValidator = new Validator();
jsonSchemaValidator.attributes.not = validateJsonNot;

module.exports = {

    get: function () {
        return jsonSchemaValidator;
    },


}