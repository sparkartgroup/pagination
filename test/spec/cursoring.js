/* jshint expr: true */
/*global describe, expect, it */
define([
	"dummy_resource",
	"pagination/cursoring"
], function(DummyResource, CursoringPagination){

	describe("Cursoring Pagination", function(){

		var TIMEOUT = 1000;
		var LIMIT = 15;

		var defaultData = {
			data: [],
			paging: {
				cursors: {
					after: "afterTestToken"
				}
			}
		};

		var Pagination = CursoringPagination.extend({
			limit: LIMIT
		});

		var resource = new DummyResource();
		var pagination = new Pagination(resource);

		it( "should not set `after` param on 1st page", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.after ).to.be.undefined;
				return $.Deferred().resolve(defaultData);
			};
			pagination.next().done(function(){
				done();
			});
		});

		it( "should set `limit=" + LIMIT + "` param", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.limit ).to.be.a( "number" );
				expect( params.limit ).to.equal( LIMIT );
				return $.Deferred().resolve(defaultData);
			};
			pagination.next().done(function(){
				done();
			});
		});

		it( "should set `after=<something>` param on subsequent pages", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.after ).to.be.a( "string" );
				expect( params.after ).to.equal( "afterTestToken" );
				return $.Deferred().resolve(defaultData);
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
		resource.get = function() {
			return $.Deferred().resolve(defaultData);
		};
		pagination2.next();

		it( "should set custom `after` and `limit` param names", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params ).to.include.keys( "myafter" );
				expect( params ).to.include.keys( "mylimit" );
				return $.Deferred().resolve(defaultData);
			};
			pagination2.next().done(function(){
				done();
			});
		});

	});

});
