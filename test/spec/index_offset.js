/*global describe, expect, it */
define([
	"dummy_resource",
	"pagination/index_offset"
], function(DummyResource, IndexOffsetPagination) {

	describe("IndexOffset Pagination", function () {

		var TIMEOUT = 1000;
		var LIMIT = 15;
		var A_LESS_THAN_LIMIT = 3;

		var Pagination = IndexOffsetPagination.extend({
			limit: LIMIT
		});

		var resource = new DummyResource();
		var pagination = new Pagination(resource);

		it( "should set `limit=" + LIMIT + "` param", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.limit ).to.be.a( "number" );
				expect( params.limit ).to.equal( LIMIT );
				return $.Deferred().resolve({ data: [] });
			};
			pagination.next().done(function() {
				done();
			});
		});

		it( "should set `offset=0` param on 1st page", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.offset ).to.be.a( "number" );
				expect( params.offset ).to.equal( 0 );
				return $.Deferred().resolve({ data: new Array( LIMIT ) });
			};
			pagination.next().done(function() {
				done();
			});
		});

		it( "should set `offset=" + LIMIT + "` param on 2nd page after fetching " + LIMIT + " items", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.offset ).to.be.a( "number" );
				expect( params.offset ).to.equal( LIMIT );
				return $.Deferred().resolve({ data: new Array( A_LESS_THAN_LIMIT ) });
			};
			pagination.next().done(function() {
				done();
			});
		});

		it( "should set `offset=" + (LIMIT + A_LESS_THAN_LIMIT) + "` param on 3nd page after fetching " + A_LESS_THAN_LIMIT + " more items", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params.offset ).to.be.a( "number" );
				expect( params.offset ).to.equal( LIMIT + A_LESS_THAN_LIMIT );
				return $.Deferred().resolve({ data: [] });
			};
			pagination.next().done(function() {
				done();
			});
		});

		var Pagination2 = IndexOffsetPagination.extend({
			limit: LIMIT,
			parameterNames: {
				offset: "myoffset",
				limit: "mylimit"
			}
		});

		var pagination2 = new Pagination2(resource);

		it( "should set custom `offset` and `limit` param names", function( done ) {
			this.timeout( TIMEOUT );
			resource.get = function( params ) {
				expect( params ).to.include.keys( "myoffset" );
				expect( params ).to.include.keys( "mylimit" );
				return $.Deferred().resolve({ data: [] });
			};
			pagination2.next().done(function() {
				done();
			});
		});

	});

});
