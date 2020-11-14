var cols, rows;
var scl = 50;
var w = 3500;
var h = 1700;
var pos = 0;

function calcWindowSize() {
    let width = windowWidth;
    let height = windowHeight * 0.95 - 64
      - document.getElementById("title").offsetHeight - document.getElementById("score-label").offsetHeight;
    return {width, height};
}

function windowResized() {
    const {width, height} = calcWindowSize();
    resizeCanvas(width, height);
}

function onPlayButtonPress() {

}

function onScoreButtonPress() {

}

function onSettingsButtonPress() {

}

function setup() {
    const {width, height} = calcWindowSize();
    let canvas = createCanvas(width, height, WEBGL);
    cols = w / scl;
    rows = h / scl;

    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
        for (var y = 0; y < rows; y++) {
          terrain[x][y] = 0; //specify a default value for now
        }
      }
}

function draw() {
    pos -= 0.1;
    var yoff = pos;

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
}