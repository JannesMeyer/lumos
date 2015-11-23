// hex.colorrrs.com
var colors = {
  'blue': [96, 170, 223],         // #60aadf
  'yellow': [249, 186, 0],        // #f9ba00
  'green': [63, 191, 119],        // #3fbf77
  'red': [255, 109, 97],          // #ff6d61
  'purple': [216, 134, 200],      // #d886c8
  'cyan': [23, 183, 207],         // #17b7cf
  'orange': [255, 154, 41],       // #ff9a29
  'magenta': [243, 124, 186],     // #f37cba
  'blue-mist': [132, 154, 213],   // #849ad5
  'purple-mist': [170, 144, 211], // #aa90d3
  'tan': [187, 160, 141],         // #bba08d
  'lemon-lime': [183, 191, 39],   // #b7bf27
  'apple': [127, 191, 96],        // #7fbf60
  'teal': [0, 185, 164],          // #00b9a4
  'silver': [157, 174, 189],      // #9daebd
  'red-chalk': [249, 98, 133],    // #f96285
  'none': [160, 160, 160]         // #a0a0a0
};

// Feature detection (client-side features)
var supported = {
  history: typeof window !== 'undefined' && Boolean(window.history) && Boolean(window.history.pushState),
  canvas2D: typeof window !== 'undefined' && Boolean(window.CanvasRenderingContext2D)
};

export { colors, supported };