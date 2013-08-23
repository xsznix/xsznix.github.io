$(function() {
	$('.abjadic').each(function(i) {
		// prepare tokens
		var origText = this.innerText;
		var tokens = origText.split(' ');
		for (i in tokens) {
			tokens[i] = tokens[i].split("'");
		}

		// create glyphs
		var $this = $(this);
		$this.html('').addClass('rendered');
		for (i in tokens) {
			var $word = $(document.createElement('span')).addClass('word');
			for (j in tokens[i]) {
				if ($.inArray(tokens[i][j], ['.',',',';',':','?','!','"']) != -1)
					$word.append($(document.createElement('span')).addClass('punct').text(tokens[i][j]));
				else
					$word.append($(document.createElement('span')).addClass('glyph ' + tokens[i][j].split('.').join(' ')));
			}
			$this.append($word).append(' ');
		}
	})
})