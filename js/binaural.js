window.AudioContext = window.AudioContext || window.webkitAudioContext;

function Binaural() {
    // vars
    this.baseFreq = 200;
    this.beatFreq = 10;
    this.gain = 0.1;
    this.muted = false;

    // init
    this.ctx = new AudioContext();

    this.osc1 = this.ctx.createOscillator();
    this.osc2 = this.ctx.createOscillator();

    this.merger = this.ctx.createChannelMerger(2);

    this.gainNode = this.ctx.createGainNode();

    // hook everything up
    this.osc1.connect(this.merger, 0, 0); // I don't understand how this works
    this.osc2.connect(this.merger, 0, 1);

    this.merger.connect(this.gainNode);

    this.gainNode.connect(this.ctx.destination);

    // initial values
    this.osc1.frequency.value = this.baseFreq - this.beatFreq * 0.5;
    this.osc2.frequency.value = this.baseFreq + this.beatFreq * 0.5;

    this.gainNode.gain.value = this.gain;

    // modifiers
    this.setGain = function (g) {
        this.gain = g;
        this.gainNode.gain.value = g;
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
        } else {
            this.gainNode.gain.value = this.gain;
        }
    }

    this.start = function (f) {
        this.osc1.start(0);
        this.osc2.start(0);
    }
}