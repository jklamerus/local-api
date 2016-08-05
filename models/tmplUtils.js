var path = require('path');

module.exports = {

    stringId: function (l) {
        var len = l || 24,
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            result = '';
        for (var i = len; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    },

    randomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    multiCollection: function (min, max) {
        var _arr = [],
            loops = this.randomNumber(min, max);
        return function (fun) {
            for (var i = 0; i < loops; i++) {
                _arr.push(fun(i));
            }
            return _arr;
        }
    },

    getTemplate: function (url) {
        url = path.join(lapi.ramlRootDir, 'templates', url);
        delete require.cache[require.resolve(url)];
        return require(url);
    }

}