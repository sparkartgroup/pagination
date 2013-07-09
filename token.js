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
	 * TokenPagination
	 */

	var TokenPagination = Pagination.extend({
		getNextToken: function(data) {
			return data.nextToken;
		},

		parameterNames: {
			token: "token",
			limit: "limit"
		}
	}, {

		/**
		 * new TokenPagination(resource)
		 */
		init: function(resource) {
			var attributes = this.constructor.defaults;

			if(!util.isFunction(attributes.getNextToken)) {
				throw new Error("attributes.getNextToken not a function");
			}

			this._super();
			this.resource = resource;
			this.token = attributes.token;
			this.getNextToken = attributes.getNextToken;
			this.limit = attributes.limit;
			this.parameterNames = attributes.parameterNames;
		},

		/**
		 * TokenPagination#params() -> Object
		 */
		params: function() {
			var params = {};
			if(this.token) {
				params[this.parameterNames.token] = this.token;
			}
			params[this.parameterNames.limit] = this.limit;
			return params;
		},

		/**
		 * TokenPagination#next() -> Deferred
		 */
		next: function() {
			var self = this;
			return this.resource.get(this.params()).pipe(function(data) {
				self.token = self.getNextToken(data);
				return data;
			});
		}
	});

	return TokenPagination;
});
