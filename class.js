/*
 * Storyteller Pagination 0.0.1
 *
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
define(["pagination/util"], function(util) {

	/**
	 * Class
	 *
	 * Modified version of
	 * [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/)
	 * Based on [CanJS Constructor](http://git.io/jPbJgw)
	 */

	var initializing = false;
	var fnTest = /xyz/.test(function(){var xyz; xyz = 1;}) ? /\b_super\b/ : /.*/;

	var Class = function() {};

	// Create a new Class that inherits from this class
	Class.extend = function(defaults, proto) {
		var _super = this.prototype;
		var mkSuper = function(name, fn) {
			return function() {
				var tmp = this._super;

				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = _super[name];

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);
				this._super = tmp;

				return ret;
			};
		};

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for(var name in proto) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof proto[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(proto[name]) ?
				mkSuper(name, proto[name]) : proto[name];
		}

		// The dummy class constructor
		function ExtendedClass() {
			// All construction is actually done in the init method
			if (!initializing && this.init) {
				this.init.apply(this, arguments);
			}
		}

		// Extend defaults
		ExtendedClass.defaults = util.extend(true, {}, this.defaults, defaults);

		// Populate our constructed prototype object
		ExtendedClass.prototype = prototype;

		// Enforce the constructor to be what we expect
		ExtendedClass.prototype.constructor = ExtendedClass;

		// And make this class extendable
		ExtendedClass.extend = Class.extend;

		return ExtendedClass;
	};

	return Class;
});
