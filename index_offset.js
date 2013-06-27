/*
 * Storyteller Pagination 0.0.1
 *
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
define(["pagination/pagination", "pagination/util"], function(Pagination, util) {

	/**
	 * IndexOffsetPagination
	 */

	var IndexOffsetPagination = Pagination.extend({
		count: function(data) {
			return data.data.length;
		},

		parameterNames: {
			offset: "offset",
			limit: "limit"
		}
	}, {

		/**
		 * new IndexOffsetPagination(resource)
		 */
		init: function(resource) {
			var attributes = this.constructor.defaults;

			if(!util.isFunction(attributes.count)) {
				throw new Error("attributes.count not a function");
			}

			this._super();
			this.resource = resource;
			this.count = attributes.count;
			this.limit = attributes.limit;
			this.offset = attributes.offset || 0;
			this.parameterNames = attributes.parameterNames;
		},

		/**
		 * IndexOffsetPagination#data() -> Object
		 */
		data: function() {
			var data = {};
			data[ this.parameterNames.offset ] = this.offset;
			data[ this.parameterNames.limit ] = this.limit;
			return data;
		},

		/**
		 * IndexOffsetPagination#next() -> Deferred
		 */
		next: function() {
			var self = this;
			return this.resource.get(this.data()).pipe(function(data) {
				self.offset += self.count(data);
				return data;
			});
		}
	});

	return IndexOffsetPagination;
});
