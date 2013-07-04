/*global describe, expect, it */
define([
	"dummy_resource",
	"pagination/blend_resources",
	"pagination/cursoring",
	"pagination/index_offset"
], function(DummyResource, BlendResources, CursoringPagination, IndexOffsetPagination){

	describe("Blend Resources", function(){

		var TIMEOUT = 1000;
		var LIMIT = 15;

		var defaultIndexOffsetData = {
			data: []
		};
		var defaultCursoringData = {
			data: [],
			paging: {
				cursors: {
					after: "afterTestToken"
				}
			}
		};

		var Pagination1 = CursoringPagination.extend({
			limit: LIMIT
		});
		var Pagination2 = IndexOffsetPagination.extend({
			limit: LIMIT
		});

		var resource1 = new DummyResource({
			pagination: Pagination1
		});
		var resource2 = new DummyResource({
			pagination: Pagination2
		});

		var blendedResource = new BlendResources({
			r1: resource1,
			r2: resource2
		});

		it( "should complete successfully when all resources comlpetes successfully", function( done ) {
			var a = 0;
			this.timeout( TIMEOUT );
			resource1.get = function() {
				a++;
				return $.Deferred().resolve(defaultCursoringData);
			};
			resource2.get = function() {
				a++;
				return $.Deferred().resolve(defaultIndexOffsetData);
			};
			blendedResource.next().done(function() {
				expect( a ).to.equal( 2 );
				done();
			});
		});

		it( "should scope fetched data", function( done ) {
			this.timeout( TIMEOUT );
			resource1.get = function() {
				return $.Deferred().resolve(defaultCursoringData);
			};
			resource2.get = function() {
				return $.Deferred().resolve(defaultIndexOffsetData);
			};
			blendedResource.next().done(function(data) {
				expect( data ).to.include.keys( "r1" );
				expect( data ).to.include.keys( "r2" );
				done();
			});
		});

	});

});
