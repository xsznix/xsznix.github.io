'use strict';

// Adapted from https://github.com/jquery/jquery/blob/master/src/core/ready.js#L70
function onPageLoad (callback) {
	var completed = function () {
		document.removeEventListener('DOMContentLoaded', completed, false);
		window.removeEventListener('load', completed, false);
		callback();
	}

	if (document.readyState === 'complete')
		setTimeout(completed, 1);
	else {
		document.addEventListener('DOMContentLoaded', completed, false);
		window.addEventListener('load', completed, false);
	}
}

var $top = document.getElementById('top');
var $nav = document.getElementsByTagName('nav')[0];
var $lightrows = document.getElementsByClassName('light');

function resize () {
	$top.height(window.innerHeight);
	// parallax();
}

var navAttached = true;
function stickynav () {
	if (navAttached && window.scrollY > window.innerHeight - 58) {
		$nav.className = 'detached';
		navAttached = false;
	}
	else if (!navAttached && window.scrollY <= window.innerHeight - 58) {
		$nav.className = '';
		navAttached = true;
	}
}

var pax_t = 0;
function parallax () {
	// limit to approx. 30 FPS
	var new_pax_t = +new Date;
	if (new_pax_t - pax_t < 30) return;
	pax_t = new_pax_t;

	var offset = window.scrollY;
	var scaledOffset = -Math.floor(offset / 4) + 'px';
	// var squareOffset = Math.floor(offset / 8) + 'px';
	var squareOffset = scaledOffset;
	document.body.style.backgroundPositionY = scaledOffset;
	$nav.style.backgroundPositionY = scaledOffset;
	for (var i = 0, len = $lightrows.length; i < len; i++) {
		$lightrows[i].style.backgroundPositionY = squareOffset;
	}
}

onPageLoad(resize);
onPageLoad(stickynav);
window.onresize = resize;
window.onscroll = function () { stickynav(); /* parallax(); */ };

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-41144558-1', 'auto');
ga('send', 'pageview');
