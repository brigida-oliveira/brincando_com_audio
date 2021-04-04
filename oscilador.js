// create our AudioContext and Oscillator Nodes
var audioContext, analyser, osc, gain;
// assign our sliders and buttons to variables 
var startButton = document.querySelector('.start'),
    stopButton = document.querySelector('.stop'),
    waveformButtons = document.querySelectorAll('.waveforms button'),
    freqSlider = document.querySelector('.freq-slider'),
    detuneSlider = document.querySelector('.detune-slider'),
    gainSlider = document.querySelector('.gain-slider'),
    gainDisplay = document.querySelector('.gain'),
    freqDisplay = document.querySelector('.freq'),
    detuneDisplay = document.querySelector('.detune');

// load our default value
init();

// setup start/stop
startButton.onclick = start;
stopButton.onclick = stop;

// setup waveform changes
addEventListenerBySelector('.waveforms button', 'click', function (event) {
    var type = event.target.dataset.waveform;
    changeType(type);
});


// update frequency when slider moves
freqSlider.oninput = function () {
    changeFreq(freqSlider.value);
}


function init() {
    audioContext = new(window.AudioContext || window.webkitAudioContext)();
    gain = audioContext.createGain();
    gain.gain.value = 1;
    analyser = audioContext.createAnalyser();
    osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440;
    osc.detune.value = 0;
    osc.connect(gain);
    gain.connect(analyser);
    osc.start(0);
}

// start everything by connecting to destination
function start() {
    UI('start');
    analyser.connect(audioContext.destination);
}

// stop everything by connecting to destination
function stop() {
    UI('stop');
    analyser.disconnect(audioContext.destination);
}

// change waveform type
function changeType(type) {
    osc.type = type;
}

// change frequency
function changeFreq(freq) {
    osc.frequency.value = freq;
    freqDisplay.innerHTML = freq + 'Hz';
}

// utilities
function addEventListenerBySelector(selector, event, fn) {
    var list = document.querySelectorAll(selector);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

function UI(state) {
    switch (state) {
        case 'start':
            startButton.disabled = true;
            waveformButtons.disable = false;
            stopButton.disabled = false;
            break;
        case 'stop':
            startButton.disabled = false;
            waveformButtons.disable = true;
            stopButton.disabled = true;
            break;
    }
}

/* ************************** */

/* ************************** */

/* ios enable sound output */
	window.addEventListener('touchstart', function(){
		//create empty buffer
		var buffer = audioContext.createBuffer(1, 1, 22050);
		var source = audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(audioContext.destination);
		source.start(0);
	}, false);