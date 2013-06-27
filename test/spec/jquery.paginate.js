/*global describe, expect, it */
define([
	"jquery",
	"dummy_resource",
	"pagination/jquery.paginate"
], function($, DummyResource) {

	var resource = new DummyResource();
	resource.next = function() {
		return this.get();
	};

	describe("$.fn.paginate()", function () {
		var TIMEOUT = 1000;

		it("should be defined", function() {
			expect($.fn.paginate).to.be.a("function");
		});

		it("should emit \"success\" event on fetch success", function(done) {
			this.timeout(TIMEOUT);
			resource.get = function() {
				return $.Deferred().resolve({data: []});
			};
			$("<div>").one("success", function() {
				done();
			}).paginate({
				resource: resource,
				moreButton: $("<div>")
			});
		});

		it("should emit \"error\" event on fetch failure", function(done) {
			this.timeout(TIMEOUT);
			resource.get = function() {
				return $.Deferred().reject();
			};
			$("<div>").one("error", function() {
				done();
			}).paginate({
				resource: resource,
				moreButton: $("<div>")
			});
		});

	});

});
