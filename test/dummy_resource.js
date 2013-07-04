define(["pagination/class", "pagination/util"], function(Class, util) {
	var DummyResource = Class.extend({}, {
		init: function(attributes) {
			attributes = attributes || {};
			if(attributes.pagination) {
				var pagination = new attributes.pagination(this);
				this.next = util.proxy(pagination.next, pagination);
			}
		}
	});

	return DummyResource;
});
