var _res;

_res = tmplUtils.multiCollection(3, 40)(function (i) {
    return tmplUtils.getTemplate('users/user');
});

module.exports = _res;