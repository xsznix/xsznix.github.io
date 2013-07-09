$(function() {
	var win = $(window);
	var navbar = $('#navbar');
	var navbar_next = navbar.next();
	var navbar_position = navbar_next.position().top;
	var fix_navbar = true;

	var determine_if_fix_navbar = function () {
		fix_navbar = win.width() > 630;
	}

	var do_scroll = function () {
		if (!fix_navbar) {
			navbar.css({position: 'absolute', top: navbar_position + 'px'});
			return;
		}

		navbar_position = navbar_next.position().top;

		var s = win.scrollTop();
		if (s >= navbar_position)
			navbar.css({position: 'fixed', top: 0});
		else
			navbar.css({position: 'absolute', top: navbar_position + 'px'});
	}

	var offset_navbar = function () {
		var offset = navbar.height() - 2;
		navbar_next.css('margin-top', offset + 'px');

		determine_if_fix_navbar();
		navbar_position = navbar_next.position().top;
		do_scroll();
	}

	$(window).scroll(do_scroll);

	win.resize(offset_navbar);

	offset_navbar();
	do_scroll();
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41144558-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();