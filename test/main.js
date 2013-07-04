require.config({
	paths: {
			jquery: "lib/jquery/jquery",
			pagination: "../",
			spec: "spec/"
	}
});

require([
	/* Class */
	"spec/class",

	/* Paginations */
	"spec/cursoring",
	"spec/index_offset",

	/* Blend Resources */
	"spec/blend_resources",

	/* Plugin */
	"spec/jquery.paginate"
], function() {
	mocha.run();
});

