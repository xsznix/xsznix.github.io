// show overview
function showOverview(edition, level, lesson) {
	$('#mainmenu').hide();
	$('#back').show();

	$('#overview').attr('data-edition', edition)
		.attr('data-level', level)
		.attr('data-lesson', lesson);

	$('#o_lMastery').html(Math.round(getLessonMastery(edition, level, lesson)) + '%');
	$('#o_content').html(constructLessonOverview(reorderLessonMastery()));

	$('#overview').show();
  $(window).scrollTop();
}

// refresh overview
function refreshOverview() {
	$('#o_content').html(constructLessonOverview(reorderLessonMastery()));
}

// reorder lesson mastery
function reorderLessonMastery() {
	// get things
	var ord = $('input:radio[name=o_ord]:checked').val();
	var words = getWordsInLesson(
		parseInt($('#overview').attr('data-edition')),
		parseInt($('#overview').attr('data-level')),
		parseInt($('#overview').attr('data-lesson')));

	// sort it right
	if (ord == 'can')
		return words;
	else if (ord == 'asc')
		return sortWordsByMastery(words, false);
	else
		return sortWordsByMastery(words, true);
}

// construct lesson overview
function constructLessonOverview(words) {
	var overviewList = '';
	var i;

	for (i in words) {
		overviewList += constructWordOverview(words[i]);
	}

	return overviewList;
}

// construct word overview
function constructWordOverview(wordIndex) {
	return '' +
		'<li class="o_word ' + (wordIndex%2?'odd':'even') + '" data-wordIndex="' + wordIndex + '">' +
			'<span class="o_wordTitle">' + vocab[wordIndex][0] + '</span>' +
			'<div class="progress o_prog">' +
				'<div class="progInner" style="width: ' + getMastery(wordIndex) + '%">&nbsp;</div>' +
			'</div>' +
		'</li>';
}

// sort words by mastery
function sortWordsByMastery(words, desc) {
	var mastery = [[]];

	// make mastery pairs: [word,mastery] etc.
	for (i in words) {
		mastery[i] = [words[i], getMastery(words[i])];
	}

	// sort and reverse if necessary
	mastery.sort(_sortMasteryPair);
	if (desc) mastery.reverse();

	// format sorted list
	var ret = [];
	for (i in mastery) {
		ret[i] = mastery[i][0];
	}

	return ret;
}

// sort word pair
function _sortMasteryPair(a, b) {
	return a[1] == b[1] ? 0 : a[1] > b[1] ? 1 : -1;
}

// resets lesson mastery
function o_resetMastery() {
	// are you sure?
	if (!confirm('Are you sure you want to reset the statistics for this lesson?')) return;

	ed = $('#overview').attr('data-edition');
	lv = $('#overview').attr('data-level');
	ls = $('#overview').attr('data-lesson');

	var words = getWordsInLesson(ed, lv, ls);

	for (i in words) {
		setMastery(words[i], 0);
	}

	// refresh
	resetProgressBar(ed, lv, ls);
	showOverview(ed, lv, ls);
}

// randomise lesson mastery
function o_randomiseMastery() {
	if (!confirm('Are you sure you want to randomise the statistics for this lesson? This should be used for debug purposes only!')) return;

	ed = $('#overview').attr('data-edition');
	lv = $('#overview').attr('data-level');
	ls = $('#overview').attr('data-lesson');

	randomiseMastery(ed, lv, ls);

	// refresh
	resetProgressBar(ed, lv, ls);
	showOverview(ed, lv, ls);
}