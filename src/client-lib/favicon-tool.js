var ctx;
var faviconUrl;
var faviconImageData;

function load(url, callback) {
	if (url === faviconUrl) {
		callback(faviconImageData);
		return;
	}

	// Load favicon
	var img = document.createElement('img');
	img.addEventListener('load', function() {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		faviconImageData = ctx.getImageData(0, 0, img.width, img.height);
		faviconUrl = url;
		callback(faviconImageData);
	});
	img.src = url;
}

function colorize(srcImg, tintColor) {
	// Create the destination image
	var destImg = ctx.createImageData(srcImg.width, srcImg.height);

	// Colorize
	var t = 1;
	var src = srcImg.data;
	var dest = destImg.data;
	for (var i = 0; i < src.length; ) {
		dest[i] = src[i++] * (1-t) + tintColor[0] * t;
		dest[i] = src[i++] * (1-t) + tintColor[1] * t;
		dest[i] = src[i++] * (1-t) + tintColor[2] * t;
		dest[i] = src[i++]; // alpha component
	}

	// Put it on the canvas
	ctx.putImageData(destImg, 0, 0);

	return ctx.canvas.toDataURL();
}

exports.load = load;
exports.colorize = colorize;

// http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

// /**
//  * Converts an HSL color value to RGB. Conversion formula
//  * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
//  * Assumes h, s, and l are contained in the set [0, 1] and
//  * returns r, g, and b in the set [0, 255].
//  *
//  * @param   Number  h       The hue
//  * @param   Number  s       The saturation
//  * @param   Number  l       The lightness
//  * @return  Array           The RGB representation
//  */
// function hslToRgb(h, s, l){
// 	var r, g, b;

// 	if(s == 0){
// 		r = g = b = l; // achromatic
// 	}else{
// 		function hue2rgb(p, q, t){
// 			if(t < 0) t += 1;
// 			if(t > 1) t -= 1;
// 			if(t < 1/6) return p + (q - p) * 6 * t;
// 			if(t < 1/2) return q;
// 			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
// 			return p;
// 		}

// 		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
// 		var p = 2 * l - q;
// 		r = hue2rgb(p, q, h + 1/3);
// 		g = hue2rgb(p, q, h);
// 		b = hue2rgb(p, q, h - 1/3);
// 	}

// 	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
// }

// /**
//  * Converts an RGB color value to HSL. Conversion formula
//  * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
//  * Assumes r, g, and b are contained in the set [0, 255] and
//  * returns h, s, and l in the set [0, 1].
//  *
//  * @param   Number  r       The red color value
//  * @param   Number  g       The green color value
//  * @param   Number  b       The blue color value
//  * @return  Array           The HSL representation
//  */
// function rgbToHsl(r, g, b){
// 	r /= 255, g /= 255, b /= 255;
// 	var max = Math.max(r, g, b), min = Math.min(r, g, b);
// 	var h, s, l = (max + min) / 2;

// 	if(max == min){
// 		h = s = 0; // achromatic
// 	}else{
// 		var d = max - min;
// 		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
// 		switch(max){
// 			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
// 			case g: h = (b - r) / d + 2; break;
// 			case b: h = (r - g) / d + 4; break;
// 		}
// 		h /= 6;
// 	}

// 	return [h, s, l];
// }