import marked from 'marked';
import hljs from 'highlight.js';
import util from 'util';

marked.setOptions({
	gfm: true,
	breaks: true,
	highlight: (code, lang) => (lang ? hljs.highlight(lang, code).value : code)
});

class Section {
	constructor(text) {
		this.text = text;
		// this.parent;
		// this.children = [];
		this.highestHeading = 0;
	}
	addChildSection(section, headingDepth) {
		if (this.children === undefined) {
			this.children = [];
			this.highestHeading = headingDepth;
		}
		section.parent = this;
		this.children.push(section);
	}
}

function makeToc(headings) {
	var outline = new Section();
	var sectionDepth = 1;

	if (headings.length === 0) {
		return outline;
	}

	var currentSection = outline;
	var heading;
	for (var i = 0; i < headings.length; ++i) {
		var h = headings[i];
		// h.depth, h.text

		if (h.depth > sectionDepth && h.depth > currentSection.highestHeading) {
			// make new section
			currentSection = heading;
			sectionDepth += 1;
		} else if (h.depth < sectionDepth) {
			// go to parent section
			currentSection = currentSection.parent;
			sectionDepth -= 1;
		}

		heading = new Section(h.text);
		currentSection.addChildSection(heading, h.depth);
	}
	console.log(util.inspect(outline, { depth: null }));


	return '<div id="toc"><div class="toc-heading">Table of contents <span class="toggle">[<a href="#">hide</a>]</span></div></div>';
}

export function makeHtml(content) {
	var tokens = marked.lexer(content);
	var headings = tokens.filter(item => item.type === 'heading');
	var out = marked.parser(tokens);
	out = out.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover">');
	out = out.replace(/(<\/table>)/g, '</table></div>');

	out = makeToc(headings) + out;

	return out;
}