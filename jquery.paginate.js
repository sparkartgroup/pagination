/*
 * Storyteller Pagination Plug-in 0.0.1
 *
 * Present aggregated content as a single blended and paginated stream.
 * 
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
define(["jquery"], function($) {

	/**
	 * PaginatePlugin(element, attributes)
	 * - element: selector | DOM Element | jQuery
	 * - attributes: A list of key-value pairs below.
	 *
	 * `attributes`
	 * - resource: Pagination-resource Object
	 * - moreButton: selector | DOM Element | jQuery
	 */

	var PaginatePlugin = function(element, attributes) {
		element = $(element);

		attributes = attributes || {};
		if(!attributes.resource || typeof attributes.resource !== "object" || !attributes.resource.get || !attributes.resource.next) {
			throw new Error("unexpected attributes.resource");
		}
		var resource = attributes.resource;

		if(!attributes.moreButton) {
			throw new Error("moreButton is undefined");
		}

		var moreButton;
		if(typeof attributes.moreButton == "string") {
			moreButton = element.find(attributes.moreButton);
		} else {
			moreButton = attributes.moreButton;
		}
		if(!moreButton.length) {
			throw new Error("moreButton is empty");
		}

		var cache = resource.next();

		var next = function() {
			cache
				.done(function() {
					element.trigger("success", arguments);
					cache = resource.next();
				})
				.fail(function() {
					element.trigger("error", arguments);
				});
		};

		// More button
		moreButton.click(function(ev) {
			ev.preventDefault();
			next();
		});

		next();
	};


	/**
	 * $.fn.paginate
	 */

	$.fn.paginate = function(attributes) {
		this.each(function() {
			PaginatePlugin(this, attributes);
		});
		return this;
	};

});
