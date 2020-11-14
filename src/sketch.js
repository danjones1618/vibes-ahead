var cols, rows;
var scl = 50;
var w = 3500;
var h = 1500;

var flying = 0;

var terrain = [];

function preload() {
  music = loadSound('res/Ocean-Shores_YOURSELF-LIVE.mp3');
}

function playMusic() {
  music.setLoop(true);
  music.setVolume(0.1);
  music.play();
}

function calcWindowSize() {
  let width = windowWidth;
  let height = windowHeight * 0.9 - 32 - document.getElementById("title").offsetHeight;
  return {width, height};
}

function setup() {
  const {width, height} = calcWindowSize();
  let canvas = createCanvas(width, height, WEBGL);
  playMusic();

  cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}

function windowResized() {
  const {width, height} = calcWindowSize();
  resizeCanvas(width, height);
}

function draw() {
  flying -= 0.08;
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  background(0, 0);
  translate(0, 50);
  rotateX(PI / 3);
  fill(200, 200, 200, 50);
  translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    stroke('#e0e0e0')
    fill(0, 0);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
}