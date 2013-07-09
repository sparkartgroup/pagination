/* jshint expr: true */
/*global describe, expect, it */
define([
	"dummy_resource",
	"pagination/token"
], function(DummyResource, TokenPagination){

	describe("Token Pagination", function(){

		var TIMEOUT = 1000;
		var LIMIT = 15;

		var defaultData = {
			nextToken: "testToken"
		};

		var Pagination = TokenPagination.extend({
			limit: LIMIT
		});

		var resource = new DummyResource();
		var pagination = new Pagination(resource);

		it( "should not set `token` param on 1st page", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.token ).to.be.undefined;
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

		it( "should set `token=<something>` param on subsequent pages", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params.token ).to.be.a( "string" );
				expect( params.token ).to.equal( "testToken" );
				return $.Deferred().resolve(defaultData);
			};
			pagination.next().done(function(){
				done();
			});
		});

		// TODO how TokenPagination ends?

		var Pagination2 = TokenPagination.extend({
			limit: LIMIT,
			parameterNames: {
				token: "pageToken",
				limit: "maxResults"
			}
		});

		var pagination2 = new Pagination2(resource);
		resource.get = function() {
			return $.Deferred().resolve(defaultData);
		};
		pagination2.next();

		it( "should set custom `token` and `limit` param names", function( done ){
			this.timeout( TIMEOUT );
			resource.get = function( params ){
				expect( params ).to.include.keys( "pageToken" );
				expect( params ).to.include.keys( "maxResults" );
				return $.Deferred().resolve(defaultData);
			};
			pagination2.next().done(function(){
				done();
			});
		});

	});

});
