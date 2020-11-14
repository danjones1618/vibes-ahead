var cols, rows;
var scl = 50;
var w = 3500;
var h = 1700;

var pos = 0;
var speedRate = 0.001;
var oldSpeedCount = 100;
var newSpeedCount = 0;
var score = 0;

var terrain = [];

var fft, bassPeakDetect, treblePeakDetect;

function preload() {
  music = loadSound('res/Ocean-Shores_YOURSELF-LIVE.mp3');
}

function playMusic() {
  if (!music.isPlaying()) {
    music.setLoop(true);
    music.setVolume(0.1);
    music.play();
  }
}

function calcWindowSize() {
  let width = windowWidth;
  let height = windowHeight * 0.95 - 64
    - document.getElementById("title").offsetHeight - document.getElementById("score-label").offsetHeight;
  return {width, height};
}

let scoreLabel;
function setup() {
  scoreLabel = document.getElementById("score-val");

  const {width, height} = calcWindowSize();
  let canvas = createCanvas(width, height, WEBGL);
  canvas.mousePressed(playMusic);

  showScoreBoard();

  cols = w / scl;
  rows = h / scl;

  fft = new p5.FFT();
  treblePeakDetect = new p5.PeakDetect(20, 20000, 0.2, 5);
  bassPeakDetect = new p5.PeakDetect(20, 6000, 0.2, 5);
  treblePeakDetect.onPeak(onTreblePeak, fft);
  bassPeakDetect.onPeak(onBassPeak, fft);

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}

function onTreblePeak(fft) {
  console.log("treble peak");
}

function onBassPeak(fft) {
  console.log("bass peak");
}

function windowResized() {
  const {width, height} = calcWindowSize();
  resizeCanvas(width, height);
}

function draw() {
  pos -= speedRate * deltaTime;
  var yoff = pos;

  fft.analyze();
  treblePeakDetect.update(fft);
  bassPeakDetect.update(fft);
  
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 200);
      if (terrain[x][y] < -50) 
        terrain[x][y] = -50;
      if (x < (cols / 2 + 5) && (x > cols / 2 - 5)) {
        distance = abs(cols / 2 - x) + 0.5;
        terrain[x][y] = terrain[x][y] * 0.2 * distance - 30;
      }
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  background(0, 0);
  translate(0, 50);
  rotateX(PI / 2.4);
  fill(200, 200, 200, 50);
  translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    stroke('#e0e0e0')
    fill(0, 100);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }

  if (newSpeedCount - oldSpeedCount > 1000) {
    //speedRate += 0.00005;
    speedRate *= 1.01;
    oldSpeedCount = newSpeedCount;
    score += 10;
    scoreLabel.innerHTML = score;
  }
  newSpeedCount += deltaTime;
}