/* Chrome sucks for this XHR stuff:

https://code.google.com/p/chromium/issues/detail?id=108425
https://code.google.com/p/chromium/issues/detail?id=108766
https://code.google.com/p/chromium/issues/detail?id=94369#c65
http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.13

[JSON breaking back button in Chrome, Reload Button in IE (Showing as naked data) - Stack Overflow](http://stackoverflow.com/questions/10715852/json-breaking-back-button-in-chrome-reload-button-in-ie-showing-as-naked-data)

Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT

IE sucks when using vary:
http://crisp.tweakblogs.net/blog/311/internet-explorer-and-cacheing-beware-of-the-vary.html

Chrome sucks for link rel="subresource":
https://code.google.com/p/chromium/issues/detail?id=312327
http://caffeinatetheweb.com/baking-acceleration-into-the-web-itself/
https://docs.google.com/document/d/1HeTVglnZHD_mGSaID1gUZPqLAa1lXWObV-Zkx6q_HF4/edit

*/

/*
- [XMLHttpRequest | MDN](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest)
- [XMLHttpRequest wrapped into a promise](https://gist.github.com/matthewp/3099268)
 */

function getJSON(path) {
	var req = new XMLHttpRequest();
	req.open('GET', path);
	req.setRequestHeader('Accept', 'application/json');
	// req.dataType = 'json';

	return new Promise(function(resolve, reject) {
		req.onload = event => {
			try {
				resolve(JSON.parse(req.response));
			} catch(e) {
				reject(e);
			}
		};
		req.onerror = event => { reject(new Error(req.status)); };
		req.ontimeout = event => { reject(new Error('Timed out')); };
		// req.onabort
		req.send();
	});
}

exports.getJSON = getJSON;