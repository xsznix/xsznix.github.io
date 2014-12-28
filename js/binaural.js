window.AudioContext = window.AudioContext || window.webkitAudioContext;

function Binaural() {
    // vars
    this.baseFreq = 500;
    this.beatFreq = 25;
    this.gain = 0.2;
    this.bgGain = 0.05;
    this.masterGain = 0.5;
    this.muted = false;
    this.beatsMuted = false;
    this.noiseMuted = false;
    this.noiseType = "pink";

    // init
    this.ctx = new AudioContext();

    this.osc1 = this.ctx.createOscillator();
    this.osc2 = this.ctx.createOscillator();

    this.merger = this.ctx.createChannelMerger(2);
    this.gainNode = this.ctx.createGain();

    this.whitenoise = this.ctx.createNoiseGen(true);
    this.pinknoise = this.ctx.createPinkNoiseFilter();
    this.brownnoise = this.ctx.createBrownNoiseFilter();
    this.violetnoise = this.ctx.createVioletNoiseFilter();
    this.greynoise = this.ctx.createGreyNoiseFilter();
    this.bgGainNode = this.ctx.createGain();

    this.masterGainNode = this.ctx.createGain();

    // hook everything up
    this.osc1.connect(this.merger, 0, 0); // I don't understand how this works
    this.osc2.connect(this.merger, 0, 1);

    this.merger.connect(this.gainNode);
    this.gainNode.connect(this.masterGainNode);

    this.whitenoise.connect(this.pinknoise);
    this.pinknoise.connect(this.bgGainNode);
    this.bgGainNode.connect(this.masterGainNode);

    this.masterGainNode.connect(this.ctx.destination);

    // initial values
    this.osc1.frequency.value = this.baseFreq - this.beatFreq * 0.5;
    this.osc2.frequency.value = this.baseFreq + this.beatFreq * 0.5;

    this.gainNode.gain.value = this.gain;
    this.bgGainNode.gain.value = this.bgGain;
    this.masterGainNode.gain.value = this.masterGain;

    // modifiers
    this.setGain = function (g) {
        this.gain = g;
        this.gainNode.gain.value = g;
    }

    this.setBgGain = function (g) {
        this.bgGain = g;
        this.bgGainNode.gain.value = g;
    }

    this.setMasterGain = function (g) {
        this.masterGain = g;
        this.masterGainNode.gain.value = g;
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
            this.masterGainNode.disconnect();
            this.muteBeats(true);
            this.muteNoise(true);
        } else {
            this.muteBeats(false);
            this.muteNoise(false);
            this.masterGainNode.connect(this.ctx.destination);
        }
    }

    this.setNoiseType = function (n) {
        this.whitenoise.disconnect();
        this.pinknoise.disconnect();
        this.brownnoise.disconnect();
        this.violetnoise.disconnect();
        this.greynoise[1].disconnect();
        this.noiseType = n;
        if (n == "white") {
            this.whitenoise.connect(this.bgGainNode);
        } else if (n == "pink") {
            this.whitenoise.connect(this.pinknoise);
            this.pinknoise.connect(this.bgGainNode);
        } else if (n == "brown") {
            this.whitenoise.connect(this.brownnoise);
            this.brownnoise.connect(this.bgGainNode);
        } else if (n == "violet") {
            this.whitenoise.connect(this.violetnoise);
            this.violetnoise.connect(this.bgGainNode);
        } else if (n == "grey") {
            this.whitenoise.connect(this.greynoise[0]);
            this.greynoise[1].connect(this.bgGainNode);
        }
    }

    this.muteBeats = function (m) {
        this.beatsMuted = m;
        if (this.muted || m) {
            this.osc1.disconnect();
            this.osc2.disconnect();
        } else {
            this.osc1.connect(this.merger, 0, 0);
            this.osc2.connect(this.merger, 0, 1);
        }
    }

    this.muteNoise = function (m) {
        this.noiseMuted = m;
        if (this.muted || m) {
            this.whitenoise.disconnect();
            this.pinknoise.disconnect();
            this.brownnoise.disconnect();
            this.violetnoise.disconnect();
            this.greynoise[1].disconnect();
        } else {
            this.setNoiseType(this.noiseType);
        }
    }

    this.start = function () {
        this.osc1.start(0);
        this.osc2.start(0);
    }
}
