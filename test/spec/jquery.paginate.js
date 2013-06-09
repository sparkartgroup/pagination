/*global describe, it */
"use strict";
(function () {

	describe( "$.fn.paginate()", function () {

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

	});

})();
