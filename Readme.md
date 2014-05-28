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

# Development

## Install nginx (OS X)

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

# Inspiration

- [Luminos](https://menteslibres.net/luminos/)
- [werc](http://werc.cat-v.org/)