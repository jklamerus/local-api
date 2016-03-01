var fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  Q = require('q'),
  winston = require('winston'),
  colors = require('colors'),
  findRemoveSync = require('find-remove'),
  tmplUtils = require('../models/tmplUtils');

global.faker = require('faker');
//faker.js method aliases (v. 2.1.5 -> v.3.0.1)
global.faker.random.array_element = global.faker.random.arrayElement;
global.faker.random.object_element = global.faker.random.objectElement;
global.faker.helpers.randomNumber = global.faker.random.number;

global.tmplUtils = tmplUtils;

function prepareUrl(url) {
  url = url.split(path.sep);
  url.pop();
  url = url.join(path.sep);

  return path.join(url, 'templates');
}

function genJson(url) {

  var urlParts = url.split(path.sep),
    tmplFilename = path.basename(url, '.js'),
    fileContent;

  urlParts.pop();

  winston.debug('[localapi]', 'Start'.yellow, 'reading template ' + colors.gray(tmplFilename + '.js'));
  fileContent = require(url);
  fileContent = JSON.stringify(fileContent, null, 4);
  winston.debug('[localapi]', 'Success'.green, 'reading template ' + colors.gray(tmplFilename + '.js'));

  winston.debug('[localapi]', 'Start'.yellow, 'generating json from template ' + colors.gray(tmplFilename + '.js'));

  urlParts.pop();
  urlParts.push('examples');
  var dirPath = urlParts.join(path.sep) + path.sep;

  fs.writeFileSync(dirPath + tmplFilename + '.json', fileContent, {flags: 'w'});

  winston.debug('[localapi]', 'Success'.green, 'generating json from template ' + colors.gray(tmplFilename + '.js'));
}

function readTemplates() {

  var deferred = Q.defer(),
    pathTemplates = path.join(lapi.ramlRootDir, 'templates'),
    pathExmaples = path.join(lapi.ramlRootDir, 'examples');

  // create 'examples' dir if doesn't exist
  fse.mkdirsSync(pathExmaples);

  winston.debug('[localapi]', 'Start'.yellow, 'cleaning examples directory');

  findRemoveSync(pathExmaples, {extensions: ['.json']});

  winston.debug('[localapi]', 'Success'.green,  'cleaning examples directory');

  //winston.debug('[localapi] Process '.cyan);

  fs.readdir(pathTemplates, function (err, files) {
    if (err) {throw new Error(err);}

    var i = files.length,
      patt = /(\.js)$/i,
      tmplPath;

    while (i--) {
      if (patt.test(files[i])) {

        tmplPath = path.join(pathTemplates, files[i]);
        genJson(tmplPath);

      }
    }

    deferred.resolve();

  })

  return deferred.promise;
}

module.exports = {
  run: readTemplates
};