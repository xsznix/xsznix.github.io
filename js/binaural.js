window.AudioContext = window.AudioContext || window.webkitAudioContext;

function Binaural() {
    // vars
    this.baseFreq = 200;
    this.beatFreq = 10;
    this.gain = 0.1;
    this.bgGain = 0.025;
    this.muted = false;

    // init
    this.ctx = new AudioContext();

    this.osc1 = this.ctx.createOscillator();
    this.osc2 = this.ctx.createOscillator();

    this.merger = this.ctx.createChannelMerger(2);
    this.gainNode = this.ctx.createGainNode();

    this.whitenoise = this.ctx.createNoiseGen(true);
    this.pinknoise = this.ctx.createPinkNoiseFilter();
    this.bgGainNode = this.ctx.createGainNode();

    // hook everything up
    this.osc1.connect(this.merger, 0, 0); // I don't understand how this works
    this.osc2.connect(this.merger, 0, 1);

    this.merger.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.whitenoise.connect(this.pinknoise);
    this.pinknoise.connect(this.bgGainNode);
    this.bgGainNode.connect(this.ctx.destination);

    // initial values
    this.osc1.frequency.value = this.baseFreq - this.beatFreq * 0.5;
    this.osc2.frequency.value = this.baseFreq + this.beatFreq * 0.5;

    this.gainNode.gain.value = this.gain;
    this.bgGainNode.gain.value = this.bgGain;

    // modifiers
    this.setGain = function (g) {
        this.gain = g;
        this.gainNode.gain.value = g;
    }

    this.setBgGain = function (g) {
        this.bgGain = g;
        this.bgGainNode.gain.value = g;
    }

    this.setBaseFreq = function (f) {
        this.baseFreq = f;
        this.osc1.frequency.value = f - this.beatFreq * 0.5;
        this.osc2.frequency.value = f + this.beatFreq * 0.5;
    }

    this.setBeatFreq = function (f) {
        this.beatFreq = f;
        this.osc1.frequency.value = this.baseFreq - f * 0.5;
        this.osc2.frequency.value = this.baseFreq + f * 0.5;
    }

    this.mute = function (m) {
        this.muted = m;
        if (m) {
            this.gainNode.gain.value = 0;
            this.bgGainNode.gain.value = 0;
        } else {
            this.gainNode.gain.value = this.gain;
            this.bgGainNode.gain.value = this.bgGain;
        }
    }

    this.setNoiseType = function (n) {
        this.whitenoise.disconnect();
        this.pinknoise.disconnect();
        if (n == "white") {
            this.whitenoise.connect(this.bgGainNode);
        } else if (n == "pink") {
            this.whitenoise.connect(this.pinknoise);
            this.pinknoise.connect(this.bgGainNode);
        }
    }

    this.start = function () {
        this.osc1.start(0);
        this.osc2.start(0);
    }
}