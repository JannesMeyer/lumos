# TODO

- Script that automatically opens a file for the current day
- Support for link-lists (favicon, domain, bullet color, etc.)
- Better syntax highlighting
- Fix list styling
- Add collapsible spoiler tags
	- [StackOverflow](http://meta.stackexchange.com/questions/1191/add-markdown-support-for-hidden-until-you-click-text-aka-spoilers)
- Syntax highlighting
- Jumping to headers: [here][section-preview]
- Support more MultiMarkdown
	- [MultiMarkdown features](http://bywordapp.com/markdown/guide.html#section-mmd)
	- [MultiMarkdown User's Guide](https://github.com/fletcher/MultiMarkdown/blob/master/Documentation/MultiMarkdown%20User%27s%20Guide.md)
	- [Markdown cheat sheet](http://warpedvisions.org/projects/markdown-cheat-sheet.md)
	- [dtjm/node-multimarkdown](https://github.com/dtjm/node-multimarkdown)
- make a command line command to serve the current directory ([reference](https://github.com/visionmedia/serve/blob/master/bin/serve))
- j/k movement
- Ability to create separate, but adjacent lists
- Replace spaces in path with hyphen or underscore
- Sort by creation date and offer ability to file change creation date
	- <http://apple.stackexchange.com/questions/99536/changing-creation-date-of-a-file>
- Create backup script that preserves file creation date
- Incorporate Spotlight search
	- <http://osxnotes.net/spotlight.html>
	- <https://github.com/afriggeri/jump/blob/master/lib/find.js>
	- `mdfind -onlyin /Users/jannes/Dropbox/Notes 'kMDItemFSName=*.mdown'`
	- `mdls /Users/jannes/Dropbox/Notes/Computer/Mac/Sleep.mdown`
- Caching + Watchman
	- <https://github.com/paulmillr/chokidar>
	- <https://www.npmjs.org/package/fsevents>
- Use the [Markdown mark](https://github.com/dcurtis/markdown-mark/blob/master/README.md)

ES6:
	Object.create()
	Object.defineProperty()
	Object.preventExtensions()
	Object.seal()
	Object.freeze()
	const
	let
	Destructuring
	Functions in block scope
	Parameter default values
	Rest parameters
	Spread operator
	Generators, iterators
	Classes
	Promises
	Expression closures

	[a, b] = [b, a]
	var [s,v,o] = db.getTriple()
	let {'Title': title} = jsonResult
	for({'Title': title} of dict)

	[What's New In A Spec](http://espadrine.github.io/New-In-A-Spec/es6/)
	[ES6 compatibility table](http://kangax.github.io/es5-compat-table/es6/)
http://code.tutsplus.com/articles/use-ecmascript-6-today--net-31582

## Natural sorting

- Source: <http://www.davekoelle.com/alphanum.html>
- Source: <http://sourcefrog.net/projects/natsort/strnatcmp.c>
- Source: <http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/> <https://github.com/overset/javascript-natural-sort>
- jQuery plugin: <http://tinysort.sjeiti.com/>
- <http://jsfiddle.net/rodneyrehm/5pLLG/>

- <http://www.naturalordersort.org/>
- <http://blog.overzealous.com/post/55829457993/natural-sorting-within-angular-js>
- Explorer
	- [StrCmpLogicalW](http://msdn.microsoft.com/en-us/library/bb759947.aspx)
- Finder
	- [NSNumericSearch](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/Strings/Articles/SearchingStrings.html)

- Discussion: <http://blog.codinghorror.com/sorting-for-humans-natural-sort-order/>
- Discussion: <http://blog.rodneyrehm.de/archives/14-Sorting-Were-Doing-It-Wrong.html>

# Resources

- <https://github.com/expressjs/serve-index/blob/master/index.js>
- <https://github.com/jed/browserver-client>
- <https://github.com/wearefractal/vinyl>
- <https://github.com/hparra/gulp-rename/blob/master/index.js>
- [SearchLink - BrettTerpstra.com](http://brettterpstra.com/projects/searchlink/)
- Markdown formatting tools
	- [Markdown Service Tools](http://brettterpstra.com/projects/markdown-service-tools/)
	- [drbunsen/formd](https://github.com/drbunsen/formd)
	- [Convert inline Markdown links to references](https://gist.github.com/ttscoff/1207337)
- [TextExpander](https://smilesoftware.com/TextExpander/index.html)