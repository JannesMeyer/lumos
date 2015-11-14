// Current fullscreen element
var fullscreenElement;

// Event listeners
var onChangeListeners = [];

// Feature detection
var supported = {};
if (typeof document !== 'undefined') {
  supported.fullscreen = document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.msFullscreenEnabled;
}

if (supported.fullscreen) {
  /*
    Event handlers
   */

  function stateChangeHandler() {
    fullscreenElement = getElement();

    onChangeListeners.forEach(listener => {
      listener(fullscreenElement !== undefined);
    });
  }
  document.addEventListener('fullscreenchange', stateChangeHandler);
  document.addEventListener('webkitfullscreenchange', stateChangeHandler);
  document.addEventListener('mozfullscreenchange', stateChangeHandler);
  document.addEventListener('MSFullscreenChange', stateChangeHandler);

  function errorHandler() {
    alert('Fullscreen operation failed');
  }
  document.addEventListener('fullscreenerror', errorHandler);
  document.addEventListener('webkitfullscreenerror', errorHandler);
  document.addEventListener('mozfullscreenerror', errorHandler);
  document.addEventListener('MSFullscreenError', errorHandler);

  /*
    Helper functions
   */

  function getElement() {
    return document.fullscreenElement ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement ||
           document.msFullscreenElement;
  }

  // http://stackoverflow.com/questions/8427413/webkitrequestfullscreen-fails-when-passing-element-allow-keyboard-input-in-safar
  function getRequestFullscreen(el) {
    return (el.requestFullscreen ||
            el.mozRequestFullScreen ||
            el.webkitRequestFullscreen ||
            el.msRequestFullscreen)
           .bind(el);
  }

  var exitFullscreen = (document.exitFullscreen ||
                        document.mozCancelFullScreen ||
                        document.webkitExitFullscreen ||
                        document.msExitFullscreen)
                       .bind(document);
}

export function toggle(el) {
  if (!supported.fullscreen) {
    console.warn('No fullscreen capability');
    return;
  }

  if (el !== fullscreenElement) {
    getRequestFullscreen(el)();
    return true;
  } else {
    exitFullscreen();
    return false;
  }
}

export function onChange(fn) {
  onChangeListeners.push(fn);
}