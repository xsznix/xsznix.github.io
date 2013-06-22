// start flashcard review
function startFlashcards(edition, level, lesson) {
	$('#mainmenu').hide();
	$('#flashcards').attr('data-edition', edition)
		.attr('data-level', level)
		.attr('data-lesson', lesson);
	$('#f_sub').html('Edition ' + edition + ', Level ' + level + ', Lesson ' + lesson);
	setFlashcard(chooseFlashcard());
	f_hide();
	$('#flashcards').show();
	$('#back').show();
}

// set flashcard
function setFlashcard(wordIndex) {
	word = vocab[wordIndex];
	$('#flashcards').attr('data-word', wordIndex);
	$('#f_vocab').html(word[0]);
	$('#f_yin').html(word[1]);
	$('#f_def').html(word[5].replace(/\//g,'<span class="sep"> | </span>'));
	$('#f_progInner').css('width', getMastery(wordIndex) + '%');
	f_hide();

	ed = $('#flashcards').attr('data-edition');
	lv = $('#flashcards').attr('data-level');
	ls = $('#flashcards').attr('data-lesson');

	// set the lesson mastery
	resetProgressBar(ed, lv, ls);
}

// reveal
function f_reveal() {
	$('#f_reveal').hide();
	$('#f_hidden').show();
}

// hide answers
function f_hide() {
	$('#f_reveal').show();
	$('#f_hidden').hide();
}

// chooses a flashcard from the current lesson
function chooseFlashcard() {
	// get words
	var words = getWordsInLesson(
		parseInt($('#flashcards').attr('data-edition')),
		parseInt($('#flashcards').attr('data-level')),
		parseInt($('#flashcards').attr('data-lesson')));

	// add up the mastery levels
	var c = 0;
	for (i in words) {
		c += Math.pow(105 - getMastery(words[i]), 3);
	}

	// choose a random number that matches the mastery level
	var m = parseInt(Math.random() * c + 1);

	// iterate through something
	c = 0;
	for (var i = 0; i < words.length; i++) {
		c += Math.pow(105 - getMastery(words[i]), 3);
		if (c > m) {
			return parseInt(words[i]);
		}
	}

	// if all else fails
	return 0;
}

// handles the modifying of a flashcard based on user's input and then shows a new flashcard. magic algorithm, may or may not work as intended
// r: the ID of the feedback choice
function f_handle(r) {
	word = parseInt($('#flashcards').attr('data-word'));
	var m = getMastery(word);
	var s = getStreak(word) + 1;
	switch (r) {
		case 1:
			setMastery(word, m + Math.sqrt(s + 1) * 8);
			setStreak(word, s);
			break;
		case 0:
			setMastery(word, m - 5);
			setStreak(word, 0);
			break;
		case -1:
			setMastery(word, m > 20 ? m / 2 : m - 10);
			setStreak(word, 0);
			break;
		default:
	}

//	alert('Word ' + word + ': ' + m + ' to ' + getMastery(word) + ', streak' + s);

	setFlashcard(chooseFlashcard());
}
