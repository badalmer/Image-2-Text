/////////////////////////////////////////////////
// Brandon A. Dalmer - 2025
// Image transcode - image to text - p5.js
/////////////////////////////////////////////////

let img, thumbnail;
let fileName;
let output = [];
let ready = false;

let panelX, panelY, panelWidth = 200;
let textOutputDiv;
let saveButton, clearButton, uploadButton;
let menuLabel, infoLabel, warningMessage = '';

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont('monospace');

  panelX = windowWidth - panelWidth - 10;
  panelY = 15;
  let buttonWidth = 180;

  // drag-and-drop (still works)
  let cnv = select('canvas');
  cnv.drop(gotFile);
  
  drawAsciiBanner();
  drawUIPanel();

  // text output area
  textOutputDiv = createDiv('');
  textOutputDiv.style('white-space', 'pre-wrap');
  textOutputDiv.style('font-family', 'monospace');
  textOutputDiv.style('background-color', '#f0f0f0');
  textOutputDiv.style('font-size', '6px');
  textOutputDiv.style('overflow', 'auto');
  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (windowWidth - panelWidth - 40) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');
  textOutputDiv.hide();
  
  menuLabel = createSpan('[[ IMG-2-TEXT ]]');
  menuLabel.style('color', 'red');
  menuLabel.style('font-family', 'monospace');
  menuLabel.style('font-size', '12px');
  menuLabel.style('display', 'block');
  menuLabel.style('width', panelWidth + 'px');
  menuLabel.style('text-align', 'center');
  menuLabel.position(panelX, panelY + 15);

  // upload button
  uploadButton = createFileInput(handleFile);
  uploadButton.position(panelX + 10, panelY + 40);
  ButtonStyle(uploadButton, buttonWidth);

  // save button
  saveButton = createButton('Save Text');
  saveButton.position(panelX + 10, panelY + 70);
  saveButton.mousePressed(saveTextFile);
  ButtonStyle(saveButton, buttonWidth);

  // clear button
  clearButton = createButton('Clear');
  clearButton.position(panelX + 10, panelY + 100);
  clearButton.mousePressed(clearOutput);
  ButtonStyle(clearButton, buttonWidth);
  
  infoLabel = createSpan('*Brandon A. Dalmer | 2025');
  infoLabel.style('color', 'red');
  infoLabel.style('font-family', 'monospace');
  infoLabel.style('font-size', '10px');
  infoLabel.style('display', 'block');
  infoLabel.style('width', panelWidth + 'px');
  infoLabel.position(panelX + 10, panelY + 180);

  noLoop();
}

function draw() {
  background(0);
  drawAsciiBanner();
  drawUIPanel();
  

  if (ready && img) {
    img.loadPixels();
    output = [];

    for (let y = 0; y < img.height; y++) {
      let line = [];
      for (let x = 0; x < img.width; x++) {
        let idx = (x + y * img.width) * 4;
        let r = img.pixels[idx + 0];
        let g = img.pixels[idx + 1];
        let b = img.pixels[idx + 2];
        let code = (r + g + b) / 3;
        let txt = nf(int(code), 3);
        line.push(txt);
      }
      output.push(line.join(" "));
    }

    displayText(output);
    drawThumbnail();
    noLoop();
  }
  
  if(ready && img) {
    drawThumbnail();
  }
}

function drawAsciiBanner() {
  fill(255, 0, 0);
  textSize(14);
  noStroke();
  textAlign(LEFT, TOP);
  
  let banner = `##################################################
                                      
              IMG  ➜  TXT  TRANSCODER      
                                      
##################################################

Accepted types: 
++ JPEG/JPG
++ PNG
++ GIF
++ BMP
++ WEBP

Example Image Sizes:
╔════════════════════════════════╗ ╔═════════════╗
║                                ║ ║             ║
║                                ║ ║             ║
║                                ║ ║             ║
║                                ║ ║ 36in x 24in ║
║   36in X 48in : 95px X 127px   ║ ║    ----     ║
║                                ║ ║ 95px x 64px ║
║                                ║ ║             ║
║                                ║ ║             ║
║                                ║ ║             ║
╚════════════════════════════════╝ ╚═════════════╝
╔════════════════════════════════╗ ╔═════════════╗
║                                ║ ║             ║
║                                ║ ║             ║
║                                ║ ║  MAX WIDTH  ║
║  48in X 72in : 127px X 190px   ║ ║             ║
║                                ║ ║    200px    ║
║                                ║ ║             ║
║                                ║ ║             ║
╚════════════════════════════════╝ ╚═════════════╝

Lightburn Text Settings: 
++ 2.639 * inches [exthalf2 0.125 font]
`;
  text(banner, 25, 15);
}

function drawUIPanel() {
  fill(0);
  stroke(255, 0, 0);
  rect(panelX, panelY, panelWidth, 200);
  
  if(warningMessage !== ''){
    noStroke();
    fill(255, 200, 0);
    textSize(10);
    textAlign(LEFT, TOP);
    text(warningMessage, panelX + 10, panelY + 130);
  }
}

function drawThumbnail() {
  let thumbW = panelWidth;
  let aspect = img.width / img.height;
  let thumbH = thumbW / aspect;
  
  let x = panelX;
  let y = panelY + 200 + 10;

  // background for thumbnail area
  fill(30);
  noStroke();
  rect(x, y, thumbW, thumbH);

  image(img, x, y, thumbW, thumbH);
}

function displayText(lines) {
  textOutputDiv.html(lines.join('\n'));
  textOutputDiv.show();
}

function saveTextFile() {
  if (output.length > 0) {
    let dateStr = month() + "_" + year();
    saveStrings(output, fileName + "_output_" + dateStr + ".txt");
  }
}

function clearOutput() {
  output = [];
  textOutputDiv.html('');
  textOutputDiv.hide();
  ready = false;
  warningMessage = '';
  redraw();
}

function gotFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, (loadedImg) => {
      if(loadedImg.width > 1000) {
        warningMessage = 'Error: Image is too large. \nMaximum 200px wide';
        ready = false;
        img = null;
      } else {
        img = loadedImg;
        fileName = file.name.split('.')[0];
        ready = true;
      
        if(img.width > 200) {
          warningMessage = 'Warning: Image is very large.\nMaximum 200px wide';
        } else {
          warningMessage = '';
        }
      }
      redraw();
    });
  } else {
    warningMessage = 'Not an image file.';
    ready = false;
    img = null;
    redraw();
  }
}

// upload button handler
function handleFile(file) {
  gotFile(file);
}

function ButtonStyle(btn, w) {
  btn.style('width', w + 'px');
  btn.style('height', '25px');
  btn.style('color', 'red');
  btn.style('background-color', 'black');
  btn.style('border', '1px solid red');
  btn.style('padding', '0');
  btn.style('line-height', '25px');
  btn.style('font-size', '12px');
  btn.style('box-sizing', 'border-box');
  btn.style('font-family', 'monospace');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  panelX = windowWidth - panelWidth - 10;
  panelY = 15;
  
  menuLabel.position(panelX + 10, panelY + 10);
  uploadButton.position(panelX + 10, panelY + 30);
  saveButton.position(panelX + 10, panelY + 60);
  clearButton.position(panelX + 10, panelY + 90);
  infoLabel.position(panelX + 10, panelY + 180);

  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (panelX - 30) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');

  redraw();
}
