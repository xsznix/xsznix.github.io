(function(AudioContext) {

	// adapted from https://github.com/mattdiamond/synthjs

	function NoiseGenFactory(context, stereo, bufSize){
		bufSize = bufSize || 4096;
		var node = context.createJavaScriptNode(bufSize, 1, 2);
		node.onaudioprocess = function(e) {
			var outBufferL = e.outputBuffer.getChannelData(0);
			var outBufferR = e.outputBuffer.getChannelData(1);
			for (var i = 0; i < bufSize; i++){
				outBufferL[i] = Math.random() * 2 - 1;
				outBufferR[i] = stereo ? Math.random() * 2 - 1 : outBufferL[i];
			}
		}
		return node;
	}

	// pink noise algorithm adapted from https://github.com/web-audio-components/pink-noise

	function PinkNoiseFilterFactory(context, bufSize) {
		bufSize = bufSize || 4096;
		var node = context.createJavaScriptNode(bufSize, 2, 2);

		node.onaudioprocess = function(e) {
			// You will not BELIEVE how much hacking it took to get this to work.
			var inBufferL = e.inputBuffer.getChannelData(0);
			var inBufferR = e.inputBuffer.getChannelData(1);
			var outBufferL = e.outputBuffer.getChannelData(0);
			var outBufferR = e.outputBuffer.getChannelData(1);
			var bL = [0, 0, 0, 0, 0, 0, 0], bR = [0, 0, 0, 0, 0, 0, 0], whiteL, whiteR, i;

			for (i = 0; i < bufSize; i++) {
				whiteL = inBufferL[i];
				whiteR = inBufferR[i];

				bL[0] = 0.99886 * bL[0] + whiteL * 0.0555179;
				bL[1] = 0.99332 * bL[1] + whiteL * 0.0750759;
				bL[2] = 0.96900 * bL[2] + whiteL * 0.1538520;
				bL[3] = 0.86650 * bL[3] + whiteL * 0.3104856;
				bL[4] = 0.55000 * bL[4] + whiteL * 0.5329522;
				bL[5] = -0.7616 * bL[5] - whiteL * 0.0168980;

				bR[0] = 0.99886 * bR[0] + whiteR * 0.0555179;
				bR[1] = 0.99332 * bR[1] + whiteR * 0.0750759;
				bR[2] = 0.96900 * bR[2] + whiteR * 0.1538520;
				bR[3] = 0.86650 * bR[3] + whiteR * 0.3104856;
				bR[4] = 0.55000 * bR[4] + whiteR * 0.5329522;
				bR[5] = -0.7616 * bR[5] - whiteR * 0.0168980;

				outBufferL[i] = bL.reduce(sum, 0) + whiteL * 0.5362;
				outBufferR[i] = bR.reduce(sum, 0) + whiteR * 0.5362;

				bL[6] = whiteL * 0.115926;
				bR[6] = whiteR * 0.115926;
			}

			var t = minMax([inBufferL, inBufferR]);
			var min = t.min, max = t.max;
			var divisor = Math.max(Math.abs(min), max);

			var normalize = function(channel) {
				for (var j = 0; j < channel.length; j++) {
					channel[j] /= divisor * 2;
				}
			}

			outBufferL = normalize(outBufferL);
			outBufferR = normalize(outBufferR);
		}

		return node;
	}

	function minMax (pink) {
		var min = [];
		var max = [];
		for (var i = 0; i < pink.length; i++) {
			min.push(Math.min.apply(null, pink[i]));
			max.push(Math.max.apply(null, pink[i]));
		}
		return { min: Math.min.apply(null, min), max: Math.max.apply(null, max) };
	}

	function sum (a, b) { return a + b; }

	AudioContext.prototype.createNoiseGen = function(stereo, bufSize){ return NoiseGenFactory(this, stereo, bufSize); };
	AudioContext.prototype.createPinkNoiseFilter = function(bufSize){ return PinkNoiseFilterFactory(this, bufSize); };

})(window.AudioContext || window.webkitAudioContext);