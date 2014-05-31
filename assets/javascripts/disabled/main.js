$(function() {
	var $p = $('.m-content article').children().first();
	var $nav = $('.m-navigation');

	// Mousein/out code
	if ($nav.hasClass('col-sm-3')) {
		$('body').on('mousemove', function(e) {
			// var distance = $p.offset().left;
			// if (e.clientX < distance) {
			var distance = $p.width() + $p.offset().left;
			if (e.clientX > distance) {
				$nav.fadeIn({ duration: Math.floor(100/6*6) });
			}
		});
		$nav.on('mouseleave', function(e) {
			if (e.toElement) {
				$nav.fadeOut({ duration: Math.floor(100/6*6), queue: false, easing: 'linear' });
			}
		});
	}
});