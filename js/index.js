$(function(){
	$("a").click(function(el) {
		_gaq.push(['_trackEvent', 'Link', 'Follow "' + this.innerText + '"', 'Gone With the Wind']);
		return true;
	});
});