/*
 * Storyteller Pagination Plug-in 0.0.1
 * @requires jQuery
 *
 * Present aggregated content as a single blended and paginated stream.
 * 
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
(function( $, undefined ) {


	/**
	 * Resource
	 *
	 * A simple encapsulation.
	 */

	var Resource = function( url, data ) {
		this.url = url;
		this.data = data;
	};

	Resource.prototype = {

		/**
		 * Resource#get( data ) -> Deferred
		 */
		get: function( data ) {
			return $.get( this.url, $.extend( {}, this.data, data ));
		}
	};


	/**
	 * Pagination
	 *
	 * Extends resource with .next().
	 */

	var Pagination = function( resource, attributes ) {
		var self = this;
		var ongoingNext = null;
		this.resource = resource;
		this.attributes = attributes || {};
		this.parameter = attributes.parameter;
		resource.next = function() {
			if( ongoingNext ) {
				return ongoingNext;
			}
			return ongoingNext = self.next.call( self ).always(function() {
				ongoingNext = null;
			});
		};
	};

	/**
	 * CursoringPagination
	 */

	var CursoringPagination = function(/* resource, attributes */) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	CursoringPagination.prototype = {};

	/**
	 * IndexOffsetPagination
	 */

	var IndexOffsetPagination = function( resource, attributes ) {
		// Pagination super
		attributes = $.extend( true, {}, IndexOffsetPagination.defaults, attributes );

		if( !$.isFunction( attributes.count ) ) {
			throw new Error( "attributes.count not a function" );
		}

		Pagination.apply( this, arguments );
		this.count = attributes.count;
		this.limit = attributes.limit;
		this.offset = attributes.offset || 0;
	};

	IndexOffsetPagination.defaults = {
		count: function( data ) {
			return data.data.length;
		},
		parameterNames: {
			offset: "offset",
			limit: "limit"
		}
	};

	IndexOffsetPagination.prototype = {

		/**
		 * IndexOffsetPagination#data() -> Object
		 */
		data: function() {
			var data = {};
			var parameterNames = this.attributes.parameterNames;
			data[ parameterNames.offset ] = this.offset;
			data[ parameterNames.limit ] = this.limit;
			return data;
		},

		/**
		 * IndexOffsetPagination#next() -> Deferred
		 */
		next: function() {
			var self = this;
			return this.resource.get( this.data() ).pipe(function( data ) {
				self.offset += self.count( data );
				return data;
			});
		}
	};

	/**
	 * PagePagination
	 */

	var PagePagination = function(/* resource, attributes */) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	PagePagination.prototype = {};

	/**
	 * TokenPagination
	 */

	var TokenPagination = function(/* resource, attributes */) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	TokenPagination.prototype = {};


	/**
	 * PaginatePlugin( element, attributes )
	 * - element: selector | DOM Element | jQuery
	 * - attributes: An Array of key-value pairs below.
	 *
	 * `attributes`
	 * - resource: String containing the resource URL or an Object of key-value pairs below.
	 * - pagination: Object of key-value pairs below.
	 *
	 * `resource`
	 * - url: String containing the resource URL.
	 * - data: Object of data to be sent to the server.
	 *
	 * `pagination`
	 * - type: String containing the pagination type.
	 * - attributes: Object with specific pagination attributes.
	 */

	var paginations = {
		"cursoring": CursoringPagination,
		"index-offset": IndexOffsetPagination,
		"page": PagePagination,
		"token": TokenPagination
	};

	var PaginatePlugin = function( element, attributes ) {
		element = $( element );
		$.each( attributes, function() {
			var attributes = this || {};
			if( typeof attributes.resource == "string" ) {
				attributes.resource = { url: attributes.resource };
			}
			if( !attributes.resource || typeof attributes.resource !== "object" ) {
				throw new Error( "unexpected attributes.resource" );
			}
			var resource;
			if( $.isFunction( attributes.resource.get ) ) {
				resource = attributes.resource;
			} else {
				resource = new Resource( attributes.resource.url, attributes.resource.data );
			}

			// Augment resource with appropriate type of pagination
			var pagination = attributes.pagination || {};
			var paginationClass = paginations[ pagination.type ];
			new paginationClass( resource, pagination.attributes );

			// Call resource.next on "next" event,
			// trigger success or failure in the sequence.
			element.on( "next", function() {
				resource.next()
					.done(function() {
						element.trigger( "success", arguments );
					})
					.fail(function() {
						element.trigger( "error", arguments );
					});
			});
		});
	};


	/**
	 * $.fn.paginate
	 */

	$.fn.paginate = function( attributes ) {
		this.each(function() {
			PaginatePlugin( this, attributes );
		});
		return this;
	};

})( jQuery );
