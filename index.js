'use strict';
var conv = require('am.convention');
module.exports = createElementWithState;


var definitionSchema = {
  name: 'element name',
  ngDeps: ['array', 'of', 'angular', 'module names'],
  state: {
    // element's state object
  },
  controller: function (some, injected, services) {
  },
  postlink: function (state, el, scope, attrs) {
  }
};

function createElementWithState(stateCreationFunction){
  return function createElement(definition) {

    var deps = definition.ngDeps || [];

    if (!definition.name) {
      throw new Error('You tried to create the element without name specified!');
    }

    var stateName = conv.names.state(definition.name);
    var moduleName = conv.names.module(conv.structureComponents.element, definition.name);

    var state = stateCreationFunction(
      conv.behaviourComponents.element,
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
    return {
      restrict: 'E',
      template: definition.template,
      controller: definition.controller,
      link: function (scope, el, attrs) {
        if (!scope.state) {
          scope.state = new ElementState();
        }
        if (scope.channel) {
          Channels[scope.channel].listen(scope, scope.state);
        }

        definition.postlink(scope.state, el, scope, attrs);
      },
      scope: {
        state: '=',
        channel: '@'
      }
    };
  }

  directiveFactory.$inject = [stateName, 'Channels'];

  return directiveFactory;
}
