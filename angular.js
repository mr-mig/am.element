'use strict';
var angular = require('angular-cjs');
var createState = require('am.state/angular');
var createElement = require('./index')(createState);

// register element using angular DI container
module.exports = function(definition){
  var result = createElement(definition);

  // try to get the module first
  // this is the case when state is created for a structure entity like element
  try{
    angular.module(result.moduleName);
  } catch(e) {
    angular.module(result.moduleName, []);
  }

  return angular.module(result.moduleName)
    .directive(result.elementName, result.elementFactoryFn);
};