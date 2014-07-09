module.exports = {
	src: {
		javascripts: './src/**/*.+(js|jsx)',
		styles: './stylus/*.styl'
	},
	dest: {
		javascripts: './dist/',
		styles: './public/stylesheets/'
	},
	webpack: {
		entry: './src/browser-main.js',
		output: {
			path: './public/javascripts/',
		    filename: '[name].bundle.js'
		}
	},
	watch: {
		styles: './stylus/',
		javascripts: './src/'
	},
	errorTemplate: {
		title: '<%= error.plugin %>: <%= error.filename %>',
		message: '<%= error.message %>'
	}
};