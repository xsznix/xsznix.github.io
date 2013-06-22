// updates the good streak level of a word to localStorage
function setStreak(wordIndex, streak) {
	localStorage['s_'+wordIndex] = parseInt(streak < 0 ? 0 : streak);
}

// gets the streak level of a word
function getStreak(wordIndex) {
	var streak = localStorage['s_'+wordIndex];
	if (streak == undefined || isNaN(streak))
		return 0;
	else
		return parseInt(streak);
}

// updates the mastery level of a word to localStorage to an integer between 0 and 100, inclusive
function setMastery(wordIndex, mastery) {
	localStorage['m_'+wordIndex] = parseInt(mastery > 100 ? 100 : mastery < 0 ? 0 : mastery);
}

// gets the mastery level of a word
function getMastery(wordIndex) {
	var mastery = localStorage['m_'+wordIndex];
	if (mastery == undefined || isNaN(mastery))
		return 0;
	else
		return parseInt(mastery);
}

// calculates and returns the mastery of a lesson
function getLessonMastery(edition, level, lesson) {
	var mastery = 0;
	var words = getWordsInLesson(edition, level, lesson);
	var i;
	// add all the masteries
	for (i in words) {
		mastery += getMastery(words[i]);
	}
	// divide by number of words
	mastery /= words.length;
	
	return mastery;
}

// debug: sets random mastery levels
function randomiseMastery(edition, level, lesson) {
	var words = getWordsInLesson(edition, level, lesson);
	var i;
	for (i in words) {
		setMastery(words[i], Math.floor(Math.random() * 101));
	}
}
