# TODO

https://github.com/expressjs/serve-index/blob/master/index.js
https://github.com/jed/browserver-client
https://github.com/wearefractal/vinyl


- Sort by creation date and offer ability to file change creation date
	- <http://apple.stackexchange.com/questions/99536/changing-creation-date-of-a-file>
- Create backup script that preserves file creation date
- Incorporate Spotlight search
	- <http://osxnotes.net/spotlight.html>
	- <https://github.com/afriggeri/jump/blob/master/lib/find.js>


	mdfind -onlyin /Users/jannes/Dropbox/Notes 'kMDItemFSName=*.mdown'
	mdls /Users/jannes/Dropbox/Notes/Computer/Mac/Sleep.mdown



Caching + Watchman
https://github.com/paulmillr/chokidar
https://www.npmjs.org/package/fsevents

Favicon addon

Markdown mark
https://github.com/dcurtis/markdown-mark/blob/master/README.md

Markdown Extensions:
	spoiler

ES6:
	Object.create()
	Object.defineProperty()
	Object.preventExtensions()
	Object.seal()
	Object.freeze()


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


Node.js doesn't enable v8-i18n, which means that libicu doesn't get bundled.
https://github.com/joyent/node/issues/6371
https://github.com/joyent/node/issues/4689
https://github.com/joyent/node

installing /usr/local/bin/node
installing /usr/local/lib/dtrace/node.d
installing /usr/local/share/systemtap/tapset/node.stp
installing /usr/local/share/man/man1/node.1
installing /usr/local/include/node/*
installing /usr/local/lib/node_modules/*