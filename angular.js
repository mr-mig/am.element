'use strict';
var angular = require('angular-cjs');
var createState = require('am.state/angular');
var createElement = require('./index')(createState);

// register element using angular DI container
module.exports = function(definition){
  var result = createElement(definition);

  return angular.module(result.moduleName, result.moduleDependencies)
    .directive(result.elementName, result.elementFactoryFn);
};