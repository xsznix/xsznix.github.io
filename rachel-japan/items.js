$(function() {
	$(document.body).removeClass('no_js');
	$('.liquid-slider').liquidSlider({
		autoSlide: false,
		autoHeightEaseFunction: 'easeOutQuint',
		autoHeightEaseDuration: 1000,
		slideEaseFunction: 'easeOutQuint',
		slideEaseDuration: 500
	});

	if (is_old_MSIE) {
		var getImgSize = function (imgSrc, callback) {
	    var newImg = new Image();

	    newImg.onload = function() {
		    callback.call(newImg, width, height);
	    };

	    newImg.src = imgSrc;
	  }

		// TODO
	}
})