// http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// converts CSV into JS array
function CSVToArray( strData, strDelimiter ){
	strDelimiter = (strDelimiter || ",");
	var objPattern = new RegExp(
		(
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);
	var arrData = [[]];
	var arrMatches = null;
	while (arrMatches = objPattern.exec( strData )){
		var strMatchedDelimiter = arrMatches[ 1 ];
		if (
			strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)
		){
		arrData.push( [] );
		}
		if (arrMatches[ 2 ]){
		var strMatchedValue = arrMatches[ 2 ].replace(
			new RegExp( "\"\"", "g" ),
			"\""
		);
		} else {
			var strMatchedValue = arrMatches[ 3 ];
		}
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}
	return( arrData );
}

// returns index of words that are in specified lesson
function getWordsInLesson(edition, level, lesson) {
	// sanity check edition and level
	if (edition != 1 && edition != 3) {
		Console.log('Error: no such edition: ' + edition);
		return [];
	}
	if (level != 1 && level != 2) {
		Console.log('Error: no such level: ' + level);
		return [];
	}
	
	// process words
	var word;
	var wordsInLesson = [];
	for (word in vocab) {
		if (
				vocab[word][2] == edition &&
				vocab[word][3] == level &&
				vocab[word][4] == lesson){
			wordsInLesson.push(word);
		}
	}
	
	return wordsInLesson;
}