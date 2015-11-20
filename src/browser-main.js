import React from 'react';
import ReactDOM from 'react-dom';
import MyHTML from './components/MyHTML';
import { getJSON } from 'xhr-tool';
import { supported } from './constants';

import debugLib from 'debug';
import io from 'socket.io-client';
var debug = debugLib('lumos');
// localStorage.debug = 'lumos';

addEventListener('load', event => {
  // Initialize React
  getJSON(location.pathname).then(data => {
    data.isUserNavigation = false;
    // TODO: Update app variable in page.jsx
    renderToDOM(data);
  });

  // TODO: how to know the port?
  var socket = io('http://notes:9000', {
    path: '/581209544f9a07/socket.io',
    transports: ['websocket']
  });
  socket.on('connect', () => {
    debug('Connected');

    socket.emit('viewing', decodeURIComponent(location.pathname));
  });

  socket.on('disconnect', () => {
    debug('Disconnected');
  });

  socket.on('change', () => {
    debug('Content changed');

    get(location.pathname).then(data => {
      data.isUserNavigation = false;
      renderToDOM(data);
    });
  });

  // Listen for navigation events
  // TODO: e.preventDefault()
  on('pageDidNavigate', pathname => {
    socket.emit('viewing', decodeURIComponent(location.pathname));
  });
});



////////////////////////////////////

function renderToDOM(data) {
  return ReactDOM.render(<MyHTML data={data} />, document);
}

// Event listeners
var pageDidNavigateListeners = [];
function on(eventName, listener) {
  if (eventName === 'pageDidNavigate') {
    pageDidNavigateListeners.push(listener);
  } else {
    console.warn('Unrecognized event name');
  }
}

// TODO: links inside the page
// TODO: Require a node (mid-tree or leaf) as argument
// https://code.google.com/p/chromium/issues/detail?id=50298
function navigateTo(path, title) {
  if (!supported.history) {
    // Fall back to normal navigation if the browser doesn't support the history API
    location.href = path;
  }

  // TODO: Queue push state when in fullscreen, because it would exit fullscreen mode (in Chrome)
  history.pushState(undefined, undefined, path);

  getJSON(path).then(data => {
    data.isUserNavigation = true;
    history.replaceState(data, undefined, path);
    renderToDOM(data);

    pageDidNavigateListeners.forEach(listener => {
      listener(path);
    });
  });
}