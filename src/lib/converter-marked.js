module marked from 'marked'
module hljs from 'highlight.js'

// https://github.com/chjj/marked/blob/master/README.md
marked.setOptions({
	gfm: true,
	breaks: true,
	highlight: (code, lang) => lang ? hljs.highlight(lang, code).value : code
});

export function convert(content) {
	var out = marked(content);

	out = out.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover">');
	out = out.replace(/(<\/table>)/g, '</table></div>');

	return out;
}