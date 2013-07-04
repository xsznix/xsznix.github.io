$(function() {
	$(document.body).removeClass('no_js');
	$('#variant_slider').liquidSlider({
		autoSlide: false,
		autoHeightEaseFunction: 'easeOutQuint',
		autoHeightEaseDuration: 1000,
		slideEaseFunction: 'easeOutQuint',
		slideEaseDuration: 500,
		mobileNavDefaultText: 'Explore variants...',
		hashLinking: true
	});
	$('#fabric_slider').liquidSlider({
		autoSlide: false,
		autoHeightEaseFunction: 'easeOutQuint',
		autoHeightEaseDuration: 1000,
		slideEaseFunction: 'easeOutQuint',
		slideEaseDuration: 500,
		mobileNavDefaultText: 'Explore fabrics...',
		hashLinking: true
	});

	// preserve aspect ratio when resizing in IE
	if (is_old_MSIE) (function() {
		var getImgSize = function (img, callback) {
			var newImg = new Image();

			newImg.onload = function() {
				callback.apply(img, [this.width, this.height]);
			};

			newImg.src = img.src;
		}

		var allImages = $('img');

		var loadAllImgSizes = function () {
			allImages.each(function (index, elem) {
				getImgSize(elem, function (w, h) {
					$(this).data({aspectRatio: h / w});
					fixAspectRatio(this);
				});
			});
		}

		var fixAspectRatio = function (elem) {
				elem.style.height = Math.round((elem.clientWidth ? elem.clientWidth : $(elem).css('max-width')) * $(elem).data('aspectRatio')) + 'px';
		}

		var fixAllAspectRatios = function () {
			allImages.each(function (index, elem) {
				fixAspectRatio(elem);
			});
		}

		loadAllImgSizes();

		$(window).resize(function () {
			fixAllAspectRatios();
		});
	})();
})