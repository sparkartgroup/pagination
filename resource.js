/*
 * Storyteller Pagination 0.0.1
 *
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
define(["jquery", "pagination/class", "pagination/util"], function($, Class, util) {

	/**
	 * Resource
	 *
	 * A simple resource encapsulation.
	 */

	var Resource = Class.extend({
		params: {}
	}, {

		/**
		 * var resource = new Resource(attributes)
		 */
		init: function(attributes) {
			attributes = util.extend({}, this.constructor.defaults, attributes);
			this.url = attributes.url;
			this.params = attributes.params;

			if(attributes.pagination) {
				var pagination = new attributes.pagination(this);
				this.next = util.proxy(pagination.next, pagination);
			}
		},

		/**
		 * resource.get(params) -> Deferred
		 */
		get: function(params) {
			params = util.extend({}, this.params, params);
			return $.get(this.url, params);
		}
	});

	return Resource;
});
