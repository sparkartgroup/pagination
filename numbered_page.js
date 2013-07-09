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
	 * NumberedPagePagination
	 */

	var NumberedPagePagination = Pagination.extend({
		continue: function(data) {
			return !!data.data.length;
		},

		parameterNames: {
			page: "page",
			perPage: "per_page"
		}
	}, {

		/**
		 * new NumberedPagePagination(resource)
		 */
		init: function(resource) {
			var attributes = this.constructor.defaults;

			if(!util.isFunction(attributes.continue)) {
				throw new Error("attributes.continue not a function");
			}

			this._super();
			this.resource = resource;
			this.continue = attributes.continue;
			this.page = attributes.page || 1;
			this.parameterNames = attributes.parameterNames;
			this.perPage = attributes.perPage;
		},

		/**
		 * NumberedPagePagination#params() -> Object
		 */
		params: function() {
			var params = {};
			params[ this.parameterNames.page ] = this.page;
			params[ this.parameterNames.perPage ] = this.perPage;
			return params;
		},

		/**
		 * NumberedPagePagination#next() -> Deferred
		 */
		next: function() {
			var self = this;
			return this.resource.get(this.params()).pipe(function(data) {
				self.page += self.continue(data) ? 1 : 0;
				return data;
			});
		}
	});

	return NumberedPagePagination;
});
