(function() {
	RockPaperScissors.prototype.ROCK = 0;
	RockPaperScissors.prototype.PAPER = 1;
	RockPaperScissors.prototype.SCISSORS = 2;
	RockPaperScissors.prototype.guess = function(){return guess.apply(this, []);};
	RockPaperScissors.prototype.move = function(a,b){return move.apply(this, [a,b]);};
	RockPaperScissors.prototype.names = ['rock', 'paper', 'scissors'];

	function initHistory() {
		var h = [];
		for (var i = 0; i < 3; i++) {
			h.push([]);
			for (var j = 0; j < 3; j++){
				h[i].push([]);
				for (var k = 0; k < 3; k++) {
					h[i][j].push([]);
					for (var l = 0; l < 8; l++) {
						h[i][j][k].push(-1);
					}
				}
			}
		}
		return h;
	}

	function guess() {
		if (this.prev[0] === -1 || this.prev[1] === -1 || this.prev[2] === -1)
			return parseInt(Math.random() * 3);
		var choices = this.history[this.prev[0]][this.prev[1]][this.prev[2]];
		var idx = choices.lastIndexOf(-1);
		if (idx + 1 === choices.length) return parseInt(Math.random() * 3);
		// guess an element between idx+1 and choices.length
		var validchoices = choices.slice(idx + 1);
		var guess = parseInt(Math.random() * validchoices.length);
		return (validchoices[guess] + 1) % 3;
	}

	function move(pick, other) {
		if (this.prev[0] !== -1 && this.prev[1] !== -1 && this.prev[2] !== -1)
			this.history[this.prev[0]][this.prev[1]][this.prev[2]] =
				this.history[this.prev[0]][this.prev[1]][this.prev[2]].slice(1).concat(pick);
		this.prev = [this.prev[1], this.prev[2], pick];

		// 0: draw; 1: computer win; -1: human win
		if (pick === other) return 0;
		if ((pick + 1) % 3 === other) return 1;
		else return -1;
	}

	function RockPaperScissors() {
		this.history = initHistory();
		this.prev = [-1, -1, -1];
	}

	window.RockPaperScissors = RockPaperScissors;
})();

$(function() {
	var rps = new RockPaperScissors();
	var currGuess, humanWins, computerWins, humanPrev, computerPrev;
	var $rock = $('#rock'),
		$paper = $('#paper'),
		$scissors = $('#scissors');
		$human = $('#human'),
		$computer = $('#computer'),
		$reset = $('#reset')
		$winner = $('#winner'),
		$wincount = $('#wincount'),
		$losecount = $('#losecount');
	var winnerNames = {'-1': 'Player', '0': 'Nobody', '1': 'Computer'};

	$rock.click(function() {
		move(0);
	});
	$paper.click(function() {
		move(1);
	});
	$scissors.click(function () {
		move(2);
	});
	$reset.click(init);

	function init() {
		humanWins = 0;
		computerWins = 0;
		humanPrev = '';
		computerPrev = '';
		currGuess = rps.guess();
		updateUI();
	}

	function move(pick) {
		var win = rps.move(pick, currGuess);
		if (win === 1) computerWins++;
		else if (win === -1) humanWins++;
		humanPrev = rps.names[pick];
		computerPrev = rps.names[currGuess];
		currGuess = rps.guess();
		updateUI();
	}

	function updateUI() {
		$human.text(humanPrev);
		$computer.text(computerPrev);
		var winner = currWinner();
		$winner.text(winnerNames[winner]);
		if (winner === -1) {
			$wincount.text(humanWins);
			$losecount.text(computerWins);
		} else {
			$wincount.text(computerWins);
			$losecount.text(humanWins);
		}
	}

	function currWinner() {
		if (humanWins === computerWins) return 0;
		else if (humanWins > computerWins) return -1;
		else return 1;
	}

	init();
});