'use strict';
var angular = require('angular');
var conv = require('am.convention');
var createState = require('am.state');
module.exports = elementFactory;


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

function elementFactory(definition) {

	var deps = definition.ngDeps || [];

	if (!definition.name) {
		throw new Error('You tried to create the element without name specified!');
	}

	var prefix = conv.prefix(definition.project);

	// duplicate: see am.state
	var stateName = conv.composedName(prefix.upper, definition.name, conv.behaviourComponents.state);
	var moduleName = conv.ngModuleName(prefix.lower, 'elements', definition.name);

	var state = createState(conv.behaviourComponents.element, definition, definition.state);
	var directive = makeDirective(definition, stateName);

	return angular.module(moduleName, deps)
		.directive(definition.name, directive);
}

function makeDirective(definition, stateName) {
	function directiveFactory(ElementState, Channels) {
		return {
			restrict: 'E',
			template: definition.template,
			controller: definition.controller,
			link: function (scope, el, attrs) {
				if (!scope.state) {
					scope.state = new ElementState();
				}
				if (scope.channel){
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
