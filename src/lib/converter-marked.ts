import * as marked from 'marked';
import * as hljs from 'highlight.js';
import * as util from 'util';

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
  constructor(parent?, text?, headingDepth?) {
    if (text !== undefined) {
      this.text = text;
    }
    if (parent !== undefined) {
      this.parent = parent;
      this.depth = parent.depth + 1;
      if (parent.children === undefined) {
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

  var section = outline;
  var heading;
  for (var i = 0; i < headings.length; i++) {
    var h = headings[i];
    if (!section.children) {
      // always use an empty section
    } else if (h.depth > section.highestHeading) {
      section = heading;
    } else if (h.depth <= section.depth) {
      section = section.parent;
    }
    heading = new Section(section, h.text, h.depth);
  }

  return outline;
}

function makeToc(headings) {
  var outline = makeOutline(headings);
  // console.log(util.inspect(outline, { depth: null }));
  var script = '<script>function toggleTOC() { document.getElementsByClassName("m-toc")[0].classList.toggle("toc-hidden"); }</script>';
  return outline.children ? '<div class="m-toc">' + script +
    '<div class="toc-heading">Content <small class="toggle"><a href="javascript:toggleTOC()">toggle</a></small></div>' +
    '<div class="toc-content">' +
    sectionToHTML(outline) +
    '</div></div>' : '';
}

export function makeHtml(content) {
  var tokens = marked.lexer(content);
  var headings = tokens.filter(item => item.type === 'heading');
  var toc = makeToc(headings);

  var content2 = marked.parser(tokens);
  content2 = content2.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover">');
  content2 = content2.replace(/(<\/table>)/g, '</table></div>');

  return toc + content2;
}