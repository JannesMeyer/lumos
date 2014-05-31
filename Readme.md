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

# Installation of the lumos command 

Make sure that you have the `lumos` command and that `/usr/local/bin` is in your PATH.

	ln -s $(pwd)/bin/lumos /usr/local/bin/

/etc/launchd.conf

	setenv PATH /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Configuration of Sublime Text

Make sure that you have a `subl` command:

	ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/

~/Library/Application Support/Sublime Text 3/Packages/Users/Lumos.sublime-build

	{
		"cmd": ["lumos", "view", "--base-path", "${project_path:${folder}}", "$file"],
		"selector": "text.html.markdown"
	}

\*.sublime-project

	{
		"folders":
		[
			{
				"follow_symlinks": true,
				"path": "."
			}
		],
		"settings":
		{
			"draw_indent_guides": false,
			"save_on_focus_lost": true,
			"tab_completion": false,
			"show_panel_on_build": false
		}
	}

# Sublime Text packages
## SmartMarkdown

| Shortcut                         | Description                    |
| -------------------              | ----------------------         |
| Command + Shift + .              | Increase heading level         |
| Command + Shift + ,              | Decrease heading level         |
| Shift + Tab                      | Global folding                 |
| Tab (Inside a heading)           | Fold content                   |
| Shift + Enter (Inside a heading) | New line                       |
| Ctrl + c, Ctrl + n               | Next headline                  |
| Ctrl + c, Ctrl + p               | Previous headline              |
| Ctrl + c, Ctrl + f               | Next headline (same level)     |
| Ctrl + c, Ctrl + b               | Previous headline (same level) |

## MarkdownEditing

	{
		// "color_scheme": "Packages/MarkdownEditing/MarkdownEditor-Dark.tmTheme",
		"color_scheme": "Packages/MarkdownEditing/MarkdownEditor-Yellow.tmTheme",

		"wrap_width": 100,
		"translate_tabs_to_spaces": false,
		"mde.list_indent_auto_switch_bullet": false
	}

# Install nginx (OS X)

Install nginx (make sure `/opt/local/sbin/` is in your PATH)

	sudo port install nginx

Autostart nginx `/Library/LaunchDaemons/org.macports.nginx.plist` ([Alternative method](http://wiki.nginx.org/OSX_launchd), [Method 3](http://superuser.com/questions/304206/how-do-i-start-nginx-on-port-80-at-os-x-login), [Method 4](http://hunterford.me/nginx-startup-script-for-mac-os-x/)).

	sudo port load nginx

Execute these commands:

	cd /opt/local/etc/nginx
	sudo cp nginx.conf.default nginx.conf
	sudo cp mime.types.default mime.types
	sudo mkdir sites-enabled

/opt/local/etc/nginx/nginx.conf:

	http {
	  include /opt/local/etc/nginx/sites-enabled/*;
	}

/opt/local/etc/nginx/sites-enabled/notes.conf:

	server {
		listen       80;
		server_name  notes;

		location / {
			proxy_pass  http://127.0.0.1:9000;
		}
	}

# Advice

Make sure that you whitelist the domain that this server is running on in your AdBlock Plus (ABP) settings to improve page load speeds. ABP injects 20.000 CSS rules into every page that's loaded.

# Inspired by

- [Luminos](https://menteslibres.net/luminos/)
- [werc](http://werc.cat-v.org/)
- [Tagspaces](http://www.tagspaces.org/)
- [Laverna](https://laverna.cc/)
- [nodewiki](https://www.npmjs.org/package/nodewiki)

# Tools

- OS X services
	- [SearchLink](http://brettterpstra.com/projects/searchlink/)
	- [Markdown Service Tools](http://brettterpstra.com/projects/markdown-service-tools/)
		- Links – Flip Link Style (Control + ⌘ + L)
		- Tables – Cleanup (Control + ⌘ + T)
- Scripts
	- [formd](https://github.com/drbunsen/formd)
	- [Convert inline links to references](https://gist.github.com/ttscoff/1207337)
- Apps
	- [TextExpander](http://smilesoftware.com/TextExpander/)