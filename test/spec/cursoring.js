/*global describe, expect, it */
define([
	"dummy_resource",
	"pagination/cusroring"
], function(DummyResource, CursoringPagination){

	describe("Cursoring Pagination", function(){

		var TIMEOUT = 1000;
		var LIMIT = 15;
		var A_LESS_THAN_LIMIT = 3;

		var Pagination = CursoringPagination.extend({
			limit: LIMIT
		});

		var resource = new DummyResource();
		var pagination = new Pagination(resource);

		it( "should set `limit=" + LIMIT + "` param", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.limit ).to.be.a( "number" );
				expect( params.limit ).to.equal( LIMIT );
				return $.Deferred().resolve({ data: []});
			};
			pagination.next().done(function(){
				done();
			});
		});

		it( "should not set `after` param on 1st page", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.after ).to.be.an( "undefined" );
				return $.Deferred().resolve({
					data: [],
					cursors: {
						after: "afterTestToken"
					}
				});
			};
			pagination.next().done(function(){
				done();
			});
		});

		it( "should set `after=afterTestToken` param on 2nd page", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.after ).to.be.a( "string" );
				expect( params.after ).to.equal( "afterTestToken" );
				return $.Deferred().resolve({ data: new Array( A_LESS_THAN_LIMIT )});
			};
			pagination.next().done(function(){
				done();
			});
		});

		// TODO how after ends?

		var Pagination2 = CursoringPagination.extend({
			limit: LIMIT,
			parameterNames: {
				after: "myafter",
				limit: "mylimit"
			}
		});

		var pagination2 = new Pagination2(resource);

		it( "should set custom `after` and `limit` param names", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params ).to.include.keys( "myafter" );
				expect( params ).to.include.keys( "mylimit" );
				return $.Deferred().resolve({
					data: [],
					cursors: {
						after: "afterTestToken"
					}
				});
			};
			pagination2.next().done(function(){
				done();
			});
		});

	});

});
