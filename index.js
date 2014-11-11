'use strict';
var conv = require('am.convention');
module.exports = createElementWithState;


var definitionSchema = {
  name: 'element name',
  ngDeps: ['array', 'of', 'angular', 'module names'],
  state: {
    // element's state object
  },
  services: ['array', 'of', 'injectable', 'services'],
  postlink: function (scope, el, services) {
  }
};

function createElementWithState(stateCreationFunction){
  return function createElement(definition) {

    var deps = definition.ngDeps || [];
    definition.services = definition.services || [];
    definition.postlink = definition.postlink || function(){};
    definition.state = definition.state || {};

    if (!definition.name) {
      throw new Error('You tried to create the element without name specified!');
    }

    if (!definition.template) {
      throw new Error('You tried to create the element without template specified!');
    }

    var stateName = conv.names.state(definition.name);
    var moduleName = conv.names.ngModule(conv.structureComponents.element, definition.name);

    var state = stateCreationFunction(
      conv.structureComponents.element,
      definition, definition.state);
    var directive = makeDirectiveFactory(definition, stateName);

    return {
      moduleName: moduleName,
      elementFactoryFn: directive,
      elementName: definition.name,
      moduleDependencies: deps
    };
  };
}


// use angular directive syntax to define element
function makeDirectiveFactory(definition, stateName) {
  function directiveFactory(ElementState, Channels) {
    var injectedCustomServices = Array.prototype.slice.call(arguments, 2);
    return {
      restrict: 'E',
      template: definition.template,
      link: function (scope, el, attrs) {
        if (!attrs.state) {
          console.log('Warning! It seems you forgot to specify state attribute for \'' + definition.name + '\' element!');
        }
        if (!scope.state) {
          scope.state = new ElementState();
        }
        if (scope.channel) {
          var channels = scope.channel.split(' ');
          channels.forEach(function(channel){
            Channels.get(channel).listen(scope, scope.state);
          });
        }

        var injectedArguments = [scope, el].concat(injectedCustomServices);

        // call the postlink with all custom services injected after scope and el arguments
        definition.postlink.apply(undefined, injectedArguments);
      },
      scope: {
        state: '=',
        channel: '@'
      }
    };
  }

  directiveFactory.$inject = [stateName, 'Channels'].concat(definition.services);

  return directiveFactory;
}
