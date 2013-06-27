(function(AudioContext) {

	// white noise algorithm adapted from https://github.com/mattdiamond/synthjs
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

	function minMax (pink) {
		var min = [];
		var max = [];
		for (var i = 0; i < pink.length; i++) {
			min[i] = Math.min.apply(null, pink[i]);
			max[i] = Math.max.apply(null, pink[i]);
		}
		return { min: Math.min.apply(null, min), max: Math.max.apply(null, max) };
	}

	function normalize(channel, coefficient) {
		for (var j = 0; j < channel.length; j++) {
			channel[j] *= coefficient;
		}
	}

	// pink noise algorithm and helper functions adapted from
	// https://github.com/web-audio-components/pink-noise
	function PinkNoiseFilterFactory(context, bufSize) {
		bufSize = bufSize || 4096;
		var node = context.createJavaScriptNode(bufSize, 2, 2);

		node.onaudioprocess = function(e) {
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

				outBufferL[i] = bL[0] + bL[1] + bL[2] + bL[3] + bL[4] + bL[5] + bL[6] + whiteL * 0.5362;
				outBufferR[i] = bR[0] + bR[1] + bR[2] + bR[3] + bR[4] + bR[5] + bR[6] + whiteR * 0.5362;

				bL[6] = whiteL * 0.115926;
				bR[6] = whiteR * 0.115926;
			}

			var t = minMax([inBufferL, inBufferR]);
			var coeff = 0.5 / Math.max(Math.abs(t.min), t.max);

			outBufferL = normalize(outBufferL, coeff);
			outBufferR = normalize(outBufferR, coeff);
		}

		return node;
	}

	// brown noise algorithm adapted from http://www.source-code.biz/snippets/java/BrownNoiseGenerator.java
	function BrownNoiseFilterFactory(context, bufSize) {
		const SLOPE = 0.1, HPFILTER = 0.02;
		bufSize = bufSize || 4096;
		var node = context.createJavaScriptNode(bufSize, 2, 2);
		var currentValueL = 0, currentValueR = 0;

		node.onaudioprocess = function(e) {
			var inBufferL = e.inputBuffer.getChannelData(0);
			var inBufferR = e.inputBuffer.getChannelData(1);
			var outBufferL = e.outputBuffer.getChannelData(0);
			var outBufferR = e.outputBuffer.getChannelData(1);
			var whiteL, whiteR, i;

			for (i = 0; i < bufSize; i++) {
				whiteL = inBufferL[i] * SLOPE;
				whiteR = inBufferR[i] * SLOPE;
				currentValueL = currentValueL * (1 - HPFILTER) + whiteL;
				currentValueR = currentValueR * (1 - HPFILTER) + whiteR;
				if (currentValueL < -1.0 || currentValueL > 1.0)
					currentValueL -= 2 * whiteL;
				if (currentValueR < -1.0 || currentValueR > 1.0)
					currentValueR -= 2 * whiteR;
				outBufferL[i] = currentValueL * 3;
				outBufferR[i] = currentValueR * 3;
			}
		}

		return node;
	}

	// violet noise algorithm obtained by simply taking derivative of white noise
	function VioletNoiseFilterFactory(context, bufSize) {
		bufSize = bufSize || 4096;
		var node = context.createJavaScriptNode(bufSize, 2, 2);
		var currentValueL = 0, currentValueR = 0;

		node.onaudioprocess = function(e) {
			var inBufferL = e.inputBuffer.getChannelData(0);
			var inBufferR = e.inputBuffer.getChannelData(1);
			var outBufferL = e.outputBuffer.getChannelData(0);
			var outBufferR = e.outputBuffer.getChannelData(1);

			for (var i = 0; i < bufSize; i++) {
				outBufferL[i] = inBufferL[i] - currentValueL;
				outBufferR[i] = inBufferR[i] - currentValueR;
				currentValueL = inBufferL[i];
				currentValueR = inBufferR[i];
			}

			var t = minMax([outBufferL, outBufferR]);
			var coeff = Math.max(Math.abs(t.min), t.max);

			outBufferL = normalize(outBufferL, coeff);
			outBufferR = normalize(outBufferR, coeff);
		}

		return node;
	}

	// a couple of biquads should reasonably approximate grey noise
	// probably still a really rough approximation though :-/
	function GreyNoiseFilterFactory(context) {
		var node1 = context.createBiquadFilter();
		node1.type = node1.PEAKING;
		node1.frequency.value = 1500;
		node1.Q.value = 0.04;
		node1.gain.value = -40;

		var node2 = context.createBiquadFilter();
		node2.type = node2.HIGHSHELF;
		node2.frequency.value = 14000;
		node2.gain.value = -10;

		var node3 = context.createBiquadFilter();
		node3.type = node3.LOWSHELF;
		node3.frequency.value = 120;
		node3.gain.value = 8;

		var node4 = context.createGainNode();
		node4.gain.value = 30;

		node1.connect(node2);
		node2.connect(node3);
		node3.connect(node4);

		return [node1, node4];
	}

	AudioContext.prototype.createNoiseGen = function(stereo, bufSize){ return NoiseGenFactory(this, stereo, bufSize); };
	AudioContext.prototype.createPinkNoiseFilter = function(bufSize){ return PinkNoiseFilterFactory(this, bufSize); };
	AudioContext.prototype.createBrownNoiseFilter = function(bufSize) { return BrownNoiseFilterFactory(this, bufSize); };
	AudioContext.prototype.createVioletNoiseFilter = function(bufSize) { return VioletNoiseFilterFactory(this, bufSize); };
	AudioContext.prototype.createGreyNoiseFilter = function() { return GreyNoiseFilterFactory(this); };

})(window.AudioContext || window.webkitAudioContext);