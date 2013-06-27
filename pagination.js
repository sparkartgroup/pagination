/*
 * Storyteller Pagination 0.0.1
 *
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
define(["pagination/class"], function(Class) {
	/**
	 * Pagination
	 *
	 * Extends resource with .next().
	 */

	var Pagination = Class.extend({}, {
		init: function() {
			var self = this;
			var ongoingNext = null;

			// Intercept parent's .next() to avoid concurrent .next() calls.
			var _next = this.next;
			this.next = function() {
				if(this.ongoingNext) {
					return ongoingNext;
				}
				return ongoingNext = _next.call(self).always(function() {
					ongoingNext = null;
				});
			};
		}
	});

	return Pagination;
});
