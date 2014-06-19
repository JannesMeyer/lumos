module keypress from 'client-lib/keypress-tool'
module fullscreen from 'client-lib/fullscreen-tool'
module scroll from 'client-lib/scroll-tool'
module pageComponent from './components/page'


/**
 * Navigation
 */

addEventListener('popstate', event => {
	if (event.state) {
		data = event.state;
		document.title = data.title;
		pageComponent.renderToDocument(data, document.body);
	} else {
		console.warn('state is null after popstate event');
	}
});

/**
 * Key events
 */

keypress.bind({}, 'e', event => {
	if (data.editURL) {
		location.href = data.editURL;
	}
});
function goToNext(e) {
	if (data.nextItem) {
		pageComponent.navigateTo(data.nextItem.link, data.nextItem.name);
	}
	e.preventDefault();
}
function goToPrevious(e) {
	if (data.prevItem) {
		pageComponent.navigateTo(data.prevItem.link, data.prevItem.name);
	}
	e.preventDefault();
}
keypress.bind({}, 'j', goToNext);
keypress.bind({}, 'k', goToPrevious);
keypress.bind({}, 'right', goToNext);
keypress.bind({}, 'left', goToPrevious);
keypress.bind({}, 'enter', goToNext);
keypress.bind({shift: true}, 'enter', goToPrevious);

// Only go further if we are at the bottom of the current page
keypress.bind({}, 'down', scroll.ifAtBottom(goToNext));
keypress.bind({}, 'space', scroll.ifAtBottom(goToNext));
// TODO: sroll the new page to the bottom when going back
keypress.bind({shift: true}, 'space', scroll.ifAtTop(goToPrevious));
keypress.bind({}, 'up', scroll.ifAtTop(goToPrevious));

keypress.bind({}, 'r', event => {
	pageComponent.navigateTo('/');
});
keypress.bind({meta: true}, 'up', event => {
	pageComponent.navigateTo('..');
});
keypress.bind({}, 'f', event => {
	fullscreen.toggle(document.documentElement);
});
keypress.bind({inputEl: true}, 'esc', event => {
	if (event.target.blur) {
		event.target.blur();
	}
});

pageComponent.renderToDocument(data, document.body);

// var isNode = typeof window === 'undefined' || !window.navigator;