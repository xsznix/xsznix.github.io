$(function() {
	$(document.body).removeClass('no_js');
	$('.liquid-slider').liquidSlider({
		autoSlide: false,
		autoHeightEaseFunction: 'easeOutQuint',
		autoHeightEaseDuration: 1000,
		slideEaseFunction: 'easeOutQuint',
		slideEaseDuration: 500
	});
})