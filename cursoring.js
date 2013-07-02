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
	 * CursoringPagination
	 */

	var CursoringPagination = Pagination.extend({
		getAfter: function(data) {
			return data.paging.cursors.after;
		},

		parameterNames: {
			after: "after",
			limit: "limit"
		}
	}, {

		/**
		 * new CursoringPagination(resource)
		 */
		init: function(resource) {
			var attributes = this.constructor.defaults;

			if(!util.isFunction(attributes.getAfter)) {
				throw new Error("attributes.getAfter not a function");
			}

			this._super();
			this.resource = resource;
			this.after = attributes.after;
			this.getAfter = attributes.getAfter;
			this.limit = attributes.limit;
			this.parameterNames = attributes.parameterNames;
		},

		/**
		 * CursoringPagination#params() -> Object
		 */
		params: function() {
			var params = {};
			if(this.after) {
				params[this.parameterNames.after] = this.after;
			}
			params[this.parameterNames.limit] = this.limit;
			return params;
		},

		/**
		 * CursoringPagination#next() -> Deferred
		 */
		next: function() {
			var self = this;
			return this.resource.get(this.params()).pipe(function(data) {
				self.after = self.getAfter(data);
				return data;
			});
		}
	});

	return CursoringPagination;
});
