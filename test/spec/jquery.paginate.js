/*global describe, expect, it */
(function () {
	"use strict";

	var DummyResource = function( attributes ) {
		attributes = attributes || { flavor: "success" };
		this.get = DummyResource.prototype.flavors[ attributes.flavor ];
	};
	DummyResource.prototype = {};
	DummyResource.prototype.flavors = {
		success: function() {
			return $.Deferred().resolve({ data: [] });
		},
		failure: function() {
			return $.Deferred().reject();
		}
	};

	describe( "$.fn.paginate()", function () {
		var TIMEOUT = 1000;

		/**
		 * Basic unit tests
		 */

		it( "should be defined", function() {
			expect( $.fn.paginate ).to.be.a( "function" );
		});

		it( "should validate attributes.resource", function() {
			[ undefined, null, 23, function() {} ].forEach(function( unvalidType ) {
				expect(function() {
					$( "<div>" ).paginate([{
						resource: unvalidType,
						pagination: {}
					}]);
				}).to.throw( Error, /unexpected attributes.resource/ );
			});
		});

		it( "should emit \"success\" event on fetch success", function( done ) {
			this.timeout( TIMEOUT );
			$( "<div>" ).paginate([{
				resource: new DummyResource(),
				pagination: { type: "index-offset" }
			}]).on( "success", function() {
				done();
			}).trigger( "next" );
		});

		it( "should emit \"error\" event on fetch failure", function( done ) {
			this.timeout( TIMEOUT );
			$( "<div>" ).paginate([{
				resource: new DummyResource({ flavor: "failure" }),
				pagination: { type: "index-offset" }
			}]).on( "error", function() {
				done();
			}).trigger( "next" );
		});

		/**
		 * Index/Offset unit tests
		 */

		describe( "Index/Offset pagination", function () {
			var LIMIT = 15;
			var A_LESS_THAN_LIMIT = 3;
			var resource = new DummyResource();
			var element = $( "<div>" ).paginate([{
				resource: resource,
				pagination: {
					type: "index-offset",
					attributes: { limit: LIMIT }
				}
			}]);

			it( "should set `limit=" + LIMIT + "` param", function( done ) {
				this.timeout( TIMEOUT );
				resource.get = function( params ) {
					expect( params.limit ).to.be.a( "number" );
					expect( params.limit ).to.equal( LIMIT );
					return $.Deferred().resolve({ data: [] });
				};
				element.one( "success", function() {
					done();
				}).trigger( "next" );
			});

			it( "should set `offset=0` param on 1st page", function( done ) {
				this.timeout( TIMEOUT );
				resource.get = function( params ) {
					expect( params.offset ).to.be.a( "number" );
					expect( params.offset ).to.equal( 0 );
					return $.Deferred().resolve({ data: new Array( LIMIT ) });
				};
				element.one( "success", function() {
					done();
				}).trigger( "next" );
			});

			it( "should set `offset=" + LIMIT + "` param on 2nd page after fetching " + LIMIT + " items", function( done ) {
				this.timeout( TIMEOUT );
				resource.get = function( params ) {
					expect( params.offset ).to.be.a( "number" );
					expect( params.offset ).to.equal( LIMIT );
					return $.Deferred().resolve({ data: new Array( A_LESS_THAN_LIMIT ) });
				};
				element.one( "success", function() {
					done();
				}).trigger( "next" );
			});

			it( "should set `offset=" + LIMIT + A_LESS_THAN_LIMIT + "` param on 3nd page after fetching " + A_LESS_THAN_LIMIT + " more items", function( done ) {
				this.timeout( TIMEOUT );
				resource.get = function( params ) {
					expect( params.offset ).to.be.a( "number" );
					expect( params.offset ).to.equal( LIMIT + A_LESS_THAN_LIMIT );
					return $.Deferred().resolve({ data: [] });
				};
				element.one( "success", function() {
					done();
				}).trigger( "next" );
			});

			it( "should set custom `offset` and `limit` param names", function( done ) {
				this.timeout( TIMEOUT );
				var element = $( "<div>" ).paginate([{
					resource: resource,
					pagination: {
						type: "index-offset",
						attributes: {
							limit: LIMIT,
							parameterNames: {
								offset: "myoffset",
								limit: "mylimit"
							}
						}
					}
				}]);
				resource.get = function( params ) {
					expect( params ).to.include.keys( "myoffset" );
					expect( params ).to.include.keys( "mylimit" );
					return $.Deferred().resolve({ data: [] });
				};
				element.one( "success", function() {
					done();
				}).trigger( "next" );
			});

		});

	});

})();
