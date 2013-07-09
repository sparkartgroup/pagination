/* jshint expr: true */
/*global describe, expect, it */
define([
	"dummy_resource",
	"pagination/numbered_page"
], function(DummyResource, NumberedPagePagination) {

	describe("NumberedPage Pagination", function () {

		var TIMEOUT = 1000;
		var PER_PAGE = 15;

		var defaultData = {
			data: new Array( PER_PAGE )
		};
		var emptyData = {
			data: []
		};

		var Pagination = NumberedPagePagination.extend({
			perPage: PER_PAGE
		});

		var resource = new DummyResource();
		var pagination = new Pagination(resource);

		it( "should set `page=1` param on 1st page", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.page ).to.be.a( "number" );
				expect( params.page ).to.equal( 1 );
				return $.Deferred().resolve(defaultData);
			};
			pagination.next().done(function() {
				done();
			});
		});

		it( "should set `page=2` param on 2nd page", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.page ).to.be.a( "number" );
				expect( params.page ).to.equal( 2 );
				return $.Deferred().resolve(defaultData);
			};
			pagination.next().done(function() {
				done();
			});
		});

		it( "should set `per_page=" + PER_PAGE + "` param", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.per_page ).to.be.a( "number" );
				expect( params.per_page ).to.equal( PER_PAGE );
				return $.Deferred().resolve(emptyData);
			};
			pagination.next().done(function() {
				done();
			});
		});

		it( "should NOT advance to `page=4` after fetching empty data", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.page ).to.be.a( "number" );
				expect( params.page ).to.equal( 3 );
				return $.Deferred().resolve(emptyData);
			};
			pagination.next().done(function() {
				done();
			});
		});

		var Pagination2 = NumberedPagePagination.extend({
			perPage: PER_PAGE,
			parameterNames: {
				page: "myPage",
				perPage: "myPerPage"
			}
		});

		var pagination2 = new Pagination2(resource);

		it( "should set custom `page` and `perPage` param names", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params ).to.include.keys( "myPage" );
				expect( params ).to.include.keys( "myPerPage" );
				return $.Deferred().resolve({ data: [] });
			};
			pagination2.next().done(function() {
				done();
			});
		});

	});

});
