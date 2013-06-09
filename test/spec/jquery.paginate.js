/*global describe, it */
"use strict";
(function () {

	describe( "$.fn.paginate()", function () {

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
			this.timeout( 1000 );
			$( "<div>" ).paginate([{
				resource: new DummyResource(),
				pagination: { type: "index-offset" }
			}]).on( "success", function() {
				done();
			}).trigger( "next" );
		});

		it( "should emit \"error\" event on fetch failure", function( done ) {
			this.timeout( 1000 );
			$( "<div>" ).paginate([{
				resource: new DummyResource({ flavor: "failure" }),
				pagination: { type: "index-offset" }
			}]).on( "error", function() {
				done();
			}).trigger( "next" );
		});

	});

})();
