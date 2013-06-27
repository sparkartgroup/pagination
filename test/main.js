require.config({
	paths: {
			jquery: "lib/jquery/jquery",
			pagination: "../",
			spec: "spec/"
	}
});

require([
	"spec/class",
	"spec/index_offset",
	"spec/jquery.paginate"
], function() {
	mocha.run();
});

