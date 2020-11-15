var cols, rows;
var scl = 50;
var w = 3500;
var h = 1800;

var pos = 0;
var speedRate = 0.001;
var speedMultiplier = 1;
var oldSpeedCount = 100;
var newSpeedCount = 0;
var deltaAnim = 0;
var deltaAnimTilt = 0;
const animTime = 250;
var rotateDir = 'none';
var tiltDir = 'none';
var score = 0;
var delorean;
var lights;
var windows;
var terrain = [];
var cam;
var posX;
var posY;
var fft, bassPeakDetect, treblePeakDetect;
var playing = false;

function preload() {
  music = loadSound('res/Ocean-Shores_YOURSELF-LIVE.mp3');
  delorean = loadModel('res/del.obj', true);
  lights = loadModel('res/lights.obj', true);
  windows = loadModel('res/windows.obj', true);
}

function playMusic() {
  if (!music.isPlaying()) {
    music.setLoop(true);
    music.setVolume(0.1);
    music.play();
  }
}

function endGame() {
  const finalScore = score * 10;
  playing = false;
  speedMultiplier = 1;
  speedRate = 0.001;
  showSubmitScore(finalScore);
}

// Function called when play game btn is pressed
function playGame() {
  playMusic();
  score = 0;
  speedRate = 0.003;
  speedMultiplier = 1.01;
  document.getElementById("score-label").classList.add("show");
  playing = true;
}

function keyPressed() {
  if (keyCode === 109) {
    document.getElementById("title").innerHTML = "H A C K E R M A N";
    document.getElementsByTagName("body")[0].classList.toggle('light');
    hacking = true;
  }
}

function keyReleased() {
  if (keyCode === 109) {
    document.getElementsByTagName("body")[0].classList.toggle('light');
    document.getElementById("title").innerHTML = "V1bes H4ck3d";
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

  cam = createCamera()
  cam.perspective(PI/3, 1.77, ((1080/2)/tan(PI*60/360))/10.0, ((1080/2)/tan(PI*60/360))*10.0);
  cam.setPosition(0, 0, 700);
  showMainMenu();

  cols = w / scl;
  rows = h / scl;

  posX = 0;
  posY = 0;

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

function sigmoid(t) {
  return 1/(1+Math.pow(Math.E, -0.3*t));
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
      terrain[x][y] = map(noise(xoff+posX, yoff+posY), 0, 1, -100, 250);
      if (terrain[x][y] < -50)
      terrain[x][y] = -50;
      if (x < (cols / 2 + 5) && (x > cols / 2 - 5)) {
        distance = abs(cols / 2 - x) + 0.8;
        terrain[x][y] = terrain[x][y] * 0.05 *distance*distance - 30;
      }
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  background(0, 0);
  translate(0, 50);
  rotateX(PI / 2.25);
  fill(200, 200, 200, 50);
  translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    stroke('#f8a0e9');
    fill(0, 100);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }


  //DELOREAN
    //move your mouse to change light direction
  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  directionalLight(131, 16, 133, -dirX, -dirY + 2, -1);
  noStroke();
  specularMaterial(0xFF, 0xFF, 0xFF, 0xFF);
  translate(w / 2, h * 0.71, 20 * sigmoid(map(terrain[Math.floor(cols / 2)][Math.floor(rows*0.71)], -32, -18, -6, 1)) + 8);
  scale(0.7);
  rotateX(PI / 2);
  rotateY(PI / 2);

  if (keyIsDown(RIGHT_ARROW) && playing) {
    posX += 0.15;
    if (deltaAnim > 0 && rotateDir === 'left')
      deltaAnim *= -0.5;
    rotateDir = 'right';
  }

  if (keyIsDown(LEFT_ARROW) && playing) {
    posX -= 0.15;
    if (deltaAnim > 0 && rotateDir === 'right')
      deltaAnim *= -0.5;
    rotateDir = 'left';
  }
  
  cam.perspective(PI/3, 1.77, ((1080/2)/tan(PI*60/360))/10.0, ((1080/2)/tan(PI*60/360))*10.0);
  if (keyIsDown(UP_ARROW) && playing) {
    posY -= 0.1;
    if (deltaAnimTilt > 0 && tiltDir === 'up')
      deltaAnimTilt *= -0.5;
    tiltDir = 'up';
    // cam.perspective(PI/2.95, 1.77, ((1080/2)/tan(PI*60/360))/10.0, ((1080/2)/tan(PI*60/360))*10.0);
  }

  if (keyIsDown(109) && playing) {
    posY += 0.5;
    if (deltaAnimTilt > 0 && tiltDir === 'down')
      deltaAnimTilt *= -0.5;
    tiltDir = 'down';
  }

  if (rotateDir === 'left') {
    rotateZ(map(deltaAnim, 0, animTime, 0, PI/75));
    rotateY(map(deltaAnim, 0, animTime, 0, -PI/50));
    rotateX(map(deltaAnim, 0, animTime, 0, -PI/20));
  } else if (rotateDir === 'right') {
    rotateZ(map(deltaAnim, 0, animTime, 0, PI/75));
    rotateY(map(deltaAnim, 0, animTime, 0, PI/50));
    rotateX(map(deltaAnim, 0, animTime, 0, PI/20));
  }

  if (tiltDir === 'up') {
    rotateZ(map(deltaAnimTilt, 0, animTime, 0, PI/20));
    fov = map(deltaAnimTilt, 0, animTime, PI/3, PI/2);
    console.log(fov);
    cam.perspective(fov, 1.77, ((1080/2)/tan(PI*60/360))/10.0, ((1080/2)/tan(PI*60/360))*10.0);
  } else if (tiltDir === 'down') {
    rotateZ(map(deltaAnimTilt, 0, animTime, 0, -PI/50));
  }

  model(delorean);

  if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && deltaAnim >= 0) {
    deltaAnim -= deltaTime;
    if (deltaAnim < 0)
      deltaAnim = 0;
  } else if (deltaAnim < animTime) {
    deltaAnim += deltaTime;
    if (deltaAnim > animTime)
      deltaAnim = animTime;
  }

  if (!keyIsDown(UP_ARROW) && !keyIsDown(109) && deltaAnimTilt >= 0) {
      deltaAnimTilt -= deltaTime;
    if (deltaAnimTilt < 0)
      deltaAnimTilt = 0;
  } else if (deltaAnimTilt < animTime) {
      deltaAnimTilt += deltaTime;
    if (deltaAnimTilt > animTime)
      deltaAnimTilt = animTime;
  }

  if (newSpeedCount - oldSpeedCount > 1000 && playing) {
    //speedRate += 0.00005;
    speedRate *= speedMultiplier;
    oldSpeedCount = newSpeedCount;

    score += Math.floor((1532 * speedRate) - posY);
    scoreLabel.innerHTML = score * 10;
  }
  newSpeedCount += deltaTime;

  if (score > Math.random() * 1000 + 100 && playing) {
    endGame();
  }
}