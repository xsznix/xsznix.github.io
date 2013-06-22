// get the vocab
jQuery.get('integrated_chinese.csv', init);

// initialise screen
function init(data) {
	vocab = CSVToArray(data);
	$('#loading').hide();
	$('#mainmenu').show().html(constructEditionMenu(1) + '<br>' + constructEditionMenu(3));
}

// constructs for initialisation
function constructEditionMenu(edition) {
	return '' +
		'<div class="m_edition" data-edition="'+edition+'">' +
			'<h2 class="m_editionname">Edition ' + edition + '</h2>' +
			constructLevelMenu(edition, 1) + constructLevelMenu(edition, 2) +
		'</div>';
}
function constructLevelMenu(edition, level) {
	var numLessons;
	var menu =
		'<div class="m_level" data-edition="'+edition+'" data-level="'+level+'">' +
		'<h3 class="m_levelname">Level ' + level + '</h3>';
	if (edition == 1 && level == 1)
		numLessons = 23;
	else
		numLessons = 20;

	for (var i = 1; i <= numLessons; i++) {
		menu += constructLessonMenu(edition, level, i);
	}

	return menu + '</div>';
}
function constructLessonMenu(edition, level, lesson) {
	return '' +
		'<div class="m_lesson '+(lesson%2?'odd':'even')+'" data-edition="'+edition+'" data-level="'+level+'" data-lesson="'+lesson+'">' +
			'<div class="m_lessonname">Lesson '+lesson+'</div>'+
			'<div class="m_lessonactions">' +
				'<span class="m_overview" onclick="showOverview('+edition+','+level+','+lesson+')">Overview</span>' +
				'<span class="m_start" onclick="startFlashcards('+edition+','+level+','+lesson+')"><span class="m_startInner">&raquo;</span></span>' +
			'</div>' +
			'<div class="progress">' +
				'<div class="progInner" style="width:' + getLessonMastery(edition, level, lesson) + '%">&nbsp;</div>' +
			'</div>' +
		'</div>';
}

// show main
function showMain() {
	$('#flashcards').hide();
	$('#overview').hide();
	$('#back').hide();
	$('#mainmenu').show();
}

// refresh lesson progress bar
function resetProgressBar(edition, level, lesson) {
	$('.m_lesson[data-edition=' + edition
		+ '][data-level=' + level
		+ '][data-lesson=' + lesson +'] .progInner')
		.css('width', getLessonMastery(edition, level, lesson) + '%');
}