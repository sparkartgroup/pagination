/*global describe, expect, it */
define([
	"pagination/class"
], function(Class) {

	describe("Class", function () {

		var Person = Class.extend({}, {
			init: function(isDancing) {
				this.dancing = isDancing;
			},
			dance: function() {
				return this.dancing;
			}
		});

		var Ninja = Person.extend({}, {
			init: function() {
				this._super( false );
			},
			dance: function() {
				// Call the inherited version of dance()
				return this._super();
			},
			swingSword: function() {
				return true;
			}
		});

		var madonna = new Person(true);
		var michelangelo = new Ninja();

		it("should extend prototype methods", function() {
			expect(madonna.dance).to.be.a("function");
			expect(michelangelo.swingSword).to.be.a("function");
			expect(michelangelo.swingSword()).to.be.true;
		});

		it("should call .init() on instantiation", function() {
			expect(madonna.dance()).to.be.true;
		});

		it("should set _super", function() {
			expect(michelangelo.dance).to.be.a("function");
			expect(michelangelo.dance()).to.be.false;
		});

		it("should instanceof appropriately", function() {
			expect(madonna instanceof Person).to.be.true;
			expect(madonna instanceof Class).to.be.true;
			expect(michelangelo instanceof Ninja).to.be.true;
			expect(michelangelo instanceof Person).to.be.true;
			expect(michelangelo instanceof Class).to.be.true;
		});

		var Dancer = Person.extend({
			dancer: true
		});

		it("should set defaults", function() {
			expect(Dancer.defaults.dancer).to.be.true;
		});

	});

});
