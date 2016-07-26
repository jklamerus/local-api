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

  var dirPath = urlParts.join(path.sep) + path.sep;
  dirPath = dirPath.replace(path.sep + 'templates' + path.sep, path.sep + 'examples' + path.sep)
 
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

  var patt = /(\.js)$/i
  
  var read_dir = function(dir){
   
    fs.readdir(dir, function (err, files) {
      if (err) {throw new Error(err);}
      files.forEach(function(file){
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (err) {throw new Error(err);}
          if(stat && stat.isDirectory()){
            try {
              var example_dir_path = file;
              example_dir_path = example_dir_path.replace('templates','examples');
              fse.mkdirsSync(example_dir_path);
            } catch(e) {
              if ( e.code != 'EEXIST' ) throw e;
            }
            read_dir(file);
          }else{
            if (patt.test(file)) {
              genJson(file);
            }
          }
         
        })
      })
      
      deferred.resolve();
  
    })
  }
  read_dir(pathTemplates);


  return deferred.promise;
}

module.exports = {
  run: readTemplates
};