// http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

export function load(url) {
  return new Promise(function(resolve, reject) {
    var img = document.createElement('img');
    img.addEventListener('load', () => {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      var imageData = context.getImageData(0, 0, img.width, img.height);

      resolve([context, imageData]);
    });
    img.addEventListener('error', () => {
      reject(new Error('Image could not be loaded'));
    });
    img.src = url;
  });
}

export function colorize(context, srcImg, tintColor) {
  // Create the destination image
  var destImg = context.createImageData(srcImg.width, srcImg.height);

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
  context.putImageData(destImg, 0, 0);

  return context.canvas.toDataURL();
}