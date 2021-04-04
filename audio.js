var audioContext = new(window.AudioContext || window.webkitAudioContext)(),
    filter = audioContext.createBiquadFilter(),
    analyser = audioContext.createAnalyser(),
    sampleBuffer, sound, playButton = document.querySelector('.play'),
    stopButton = document.querySelector('.stop'),
    loop = false,
    loopButton = document.querySelector('.loop'),

    filterType = document.querySelector('.filtertype'),
    filterFreq = document.querySelector('.freq'),
    filterFreqSlider = document.querySelector('.filter-slider'),

    filterQ = document.querySelector('.filter-q-value'),
    filterQSlider = document.querySelector('.filter-q-slider'),

    filterGain = document.querySelector('.filter-gain-value'),
    filterGainSlider = document.querySelector('.filter-gain-slider');



// load our sound
init();

function init() {
    loadSound();
}

playButton.onclick = function () {
    playSound();
};

stopButton.onclick = function () {
    stopSound();
};

loopButton.onclick = function () {
    loop = event.target.checked;
};

filterType.oninput = function () {
    changeFilterType(filterType.value);
};

filterFreqSlider.oninput = function () {
    changeFilterFreq(filterFreqSlider.value);
};

filterQSlider.oninput = function () {
    changeFilterQ(filterQSlider.value);
};

filterGainSlider.oninput = function () {
    changeFilterGain(event.target.value);
};

// function to load sounds via AJAX
function loadSound() {
    var request = new XMLHttpRequest();
    request.open('GET', 'admiralbob77_-_All_the_Lines_2.mp3', true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            sampleBuffer = buffer;
            playButton.disabled = false;
            playButton.innerHTML = 'play';
        });
    };

    request.send();
}
// setup sound, loop, and connect to destination
function setupSound() {
    sound = audioContext.createBufferSource();
    sound.buffer = sampleBuffer;
    sound.loop = loop;
    sound.connect(filter);
    filter.connect(analyser)
    analyser.connect(audioContext.destination);
}

// play sound and enable / disable buttons
function playSound() {
    setupSound();
    UI('play');
    sound.start(0);
    sound.onended = function () {
        UI('stop');
    }
}

// stop sound and enable / disable buttons
function stopSound() {
    UI('stop');
    sound.stop(0);
}

// change filter type and enable / disable controls depending on filter type
function changeFilterType(type) {
    filter.type = type;
    switch (type) {
        case 'peaking':
            filterQSlider.disabled = false;
            filterGainSlider.disabled = false;
            break;
        case 'lowpass':
        case 'highpass':
        case 'bandpass':
        case 'notch':
        case 'allpass':
            filterGainSlider.disabled = true;
            filterQSlider.disabled = false;
            break;
        case 'lowshelf':
        case 'highshelf':
            filterGainSlider.disabled = false;
            filterQSlider.disabled = true;
            break;
    }
}

// change filter frequency and update display 
function changeFilterFreq(freq) {
    filter.frequency.value = freq;
    filterFreq.innerHTML = freq + 'Hz';
}

// change filter Q and update display
function changeFilterQ(Q) {
    filter.Q.value = Q;
    filterQ.innerHTML = Q;
}

// change filter Gain and update display
function changeFilterGain(gain) {
    filter.gain.value = gain;
    filterGain.innerHTML = gain + 'dB';
}

function UI(state){
    switch(state){
        case 'play':
            playButton.disabled = true;
            stopButton.disabled = false;
            filterFreqSlider.disabled = false;
            filterQSlider.disabled = false;
            filterGainSlider.disabled = false;
            break;
        case 'stop':
            playButton.disabled = false;
            stopButton.disabled = true;
            filterFreqSlider.disabled = true;
            filterQSlider.disabled = true;
            filterGainSlider.disabled = true;
            break;
    }
}

/* ****************************** */

var frequencyData = new Uint8Array(200);

var svgHeight = '300';
var svgWidth = window.innerWidth - 20;
var barPadding = '1';

function createSvg(parent, height, width) {
  return d3.select(parent).append('svg').attr('height', height).attr('width', width);
}

var svg = createSvg('.container', svgHeight, svgWidth);

// Create our initial D3 chart.
svg.selectAll('rect')
   .data(frequencyData)
   .enter()
   .append('rect')
   .attr('x', function (d, i) {
      return i * (svgWidth / frequencyData.length);
   })
   .attr('width', svgWidth / frequencyData.length - barPadding);

// Continuously loop and update chart with frequency data.
function renderChart() {
    requestAnimationFrame(renderChart);
 
    // Copy frequency data to frequencyData array.
    analyser.getByteFrequencyData(frequencyData);
 
    // Update d3 chart with new data.
    svg.selectAll('rect')
       .data(frequencyData)
       .attr('y', function(d) {
          return svgHeight - d;
       })
       .attr('height', function(d) {
          return d;
       })
       .attr('fill', function() {
          return 'rgb(91,192,222)';
       });
 }
 
 // Run the loop
 renderChart();

/* ****************************** */

/* ios enable sound output */
window.addEventListener('touchstart', function(){
    //create empty buffer
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var source = audioContext.createBufferSource();
    source.connect(analyser);
    //analyser.connect(audioContext.destination);
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}, false);