$(function() {
	var $p = $('.m-content article').children().first();
	var $nav = $('.m-navigation');

	// Mousein/out code
	if ($nav.hasClass('col-sm-3')) {
		$('body').on('mousemove', function(e) {
			var distance = $p.offset().left;
			if (e.clientX < distance) {
				$nav.addClass('show');
			}
		});
		$nav.on('mouseleave', function(e) {
			$nav.removeClass('show');
		});
	}
});