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

	var Pagination = function( resource, attributes ) {};

	/**
	 * CursoringPagination
	 */

	var CursoringPagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	CursoringPagination.prototype = {};

	/**
	 * IndexOffsetPagination
	 */

	var IndexOffsetPagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	IndexOffsetPagination.prototype = {};

	/**
	 * PagePagination
	 */

	var PagePagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	PagePagination.prototype = {};

	/**
	 * TokenPagination
	 */

	var TokenPagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	TokenPagination.prototype = {};


	/**
	 * PaginatePlugin
	 */

	var paginations = {
		"cursoring": CursoringPagination,
		"index-offset": IndexOffsetPagination,
		"page": PagePagination,
		"token": TokenPagination
	};

	var PaginatePlugin = function() {};


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
