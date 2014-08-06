import marked from 'marked';
import hljs from 'highlight.js';
import util from 'util';

marked.setOptions({
	gfm: true,
	breaks: true,
	highlight: (code, lang) => (lang ? hljs.highlight(lang, code).value : code)
});

function sectionToHTML(section) {
	var out = '';

	if (section.text) {
		var slug = section.text.toLowerCase().replace(/[^\w]+/g, '-');
		out += '<li><a href="#' + slug + '">' + section.text + '</a>';
	}
	if (section.children) {
		out += '<ol>';
		for (var i = 0; i < section.children.length; ++i) {
			out += sectionToHTML(section.children[i]);
		}
		out += '</ol>';
	}
	if (section.text) {
		out += '</li>';
	}
	return out;
}

class Section {
	constructor(parent, text, headingDepth) {
		if (text) {
			this.text = text;
		}
		if (parent) {
			this.parent = parent;
			this.depth = parent.depth + 1;
			if (!parent.children) {
				parent.children = [];
				parent.highestHeading = headingDepth;
			}
			parent.children.push(this);
		} else {
			this.depth = 0;
		}
	}
}

function makeOutline(headings) {
	var outline = new Section();
	var currentSection = outline;
	var heading;
	for (var i = 0; i < headings.length; ++i) {
		var h = headings[i];
		if (!currentSection.children) {
			// always use an empty section
		} else if (h.depth >= currentSection.depth &&
		           h.depth > currentSection.highestHeading) {
			currentSection = heading;
		} else if (h.depth <= currentSection.depth) {
			currentSection = currentSection.parent;
		}
		heading = new Section(currentSection, h.text, h.depth);
	}
	return outline;
}

function makeToc(headings) {
	var outline = makeOutline(headings);
	console.log(util.inspect(outline, { depth: null }));
	if (!outline.children) {
		return '';
	}
	return '<div class="m-toc"><div class="toc-heading">Table of contents <span class="toggle">[<a href="#">hide</a>]</span></div>' +
		sectionToHTML(outline) +
		'</div>';
}

export function makeHtml(content) {
	var tokens = marked.lexer(content);
	var headings = tokens.filter(item => item.type === 'heading');
	var toc = makeToc(headings);

	var content = marked.parser(tokens);
	content = content.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover">');
	content = content.replace(/(<\/table>)/g, '</table></div>');

	return toc + content;
}