import minimist from 'minimist';
import open from './lib/open-tool';

function edit() {
	var argv = minimist(args);

	if (argv._.length === 0) {
		open.openEditor();
	} else {
		var filePath = argv._[0];
		// escape() will not encode: @*/+
		// (encodes Unicode characters to Unicode escape sequences, too)
		// encodeURI() will not encode: ~!@#$&*()=:/,;?+'
		// encodeURIComponent() will not encode: ~!*()'
		if (argv['decode-url']) {
			filePath = decodeURI(filePath);
		}

		open.openEditor(filePath);
	}
}

default export edit;