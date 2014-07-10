module.exports = {
	src: {
		javascripts: './src/**/*.+(js|jsx)',
		styles: './stylus/*.styl'
	},
	dest: {
		javascripts: './dist',
		styles: './public/stylesheets'
	},
	watch: {
		styles: './stylus',
		javascripts: './src'
	},
	errorTemplate: {
		title: '<%= error.fileName %>',
		message: '<%= error.message %>'
	}
};