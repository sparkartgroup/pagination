/*
 * Storyteller Pagination 0.0.1
 *
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
define(["jquery", "pagination/class"], function($, Class) {

	/**
	 * BlendResources
	 *
	 * Blend all resources into a single "virtual" one.
	 */

	var BlendResources = Class.extend({
	}, {

		/**
		 * new BlendResources(resources)
		 *
		 * `resources` is a plain object of key-value pairs where key is the `name` of the resource, and `value` is the resource instance.
		 * Eg.
		 * {
		 *   facebook: new Facebook(),
		 *   twitter: new Twitter()
		 * }
		 */
		init: function(resources) {
			var name;
			var self = this;
			this.resources = [];
			this.resourceNames = [];
			for(name in resources) {
				self.resources.push(resources[name]);
				self.resourceNames.push(name);
			}
		},

		_bulk: function(action, args) {
			var resources = this.resources;
			var resourceNames = this.resourceNames;
			var dfds = resources.map(function(resource) {
				return resource[action].apply(resource, args);
			});
			return $.when.apply($, dfds).then(function() {
				var args = arguments;
				return resourceNames.reduce(function(obj, name, i) {
					obj[name] = args[i];
					return obj;
				}, {});
			});
		},

		/**
		 * blendedResources.get(...)
		 *
		 * Returns a Promise object.
		 * On successful completion, returns the merged data as a key-value pairs where key is the resource's `name`, ane value is the resource's data.
		 * Eg.
		 * {
		 *   facebook: {...},
		 *   twitter: {...}
		 * }
		 */
		get: function() {
			return this._bulk("get", arguments);
		},

		next: function() {
			return this._bulk("next", arguments);
		}
	});

	return BlendResources;
});
