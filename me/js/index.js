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
function resizeTop () {
	$top.style.height = window.innerHeight + 'px';
}

var $nav = document.getElementsByTagName('nav')[0];
var navAttached = true;
function handleNav () {
	if (navAttached && window.scrollY > window.innerHeight - 58) {
		$nav.className = 'detached';
		navAttached = false;
	}
	else if (!navAttached && window.scrollY <= window.innerHeight - 58) {
		$nav.className = '';
		navAttached = true;
	}
}

onPageLoad(resizeTop);
onPageLoad(handleNav);
window.onresize = resizeTop;
window.onscroll = handleNav;