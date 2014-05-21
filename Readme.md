# Installation

	npm install -g lumos

If you want your file lists to sort correctly you have to compile Node.js with libicu i18n support.

- <https://github.com/joyent/node/issues/6371>
- <https://github.com/joyent/node/issues/4689>

The `make install` installs files to these locations:

	/usr/local/bin/node
	/usr/local/lib/dtrace/node.d
	/usr/local/share/systemtap/tapset/node.stp
	/usr/local/share/man/man1/node.1
	/usr/local/include/node/*
	/usr/local/lib/node_modules/*

# Advice

Make sure that you whitelist the domain that this server is running on in your AdBlock Plus (ABP) settings to improve page load speeds. ABP injects 20.000 CSS rules into every page that's loaded.