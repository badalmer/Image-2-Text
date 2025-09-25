/////////////////////////////////////////////////
// Brandon A. Dalmer - 2025
// Image transcode - image to text - CRT style - p5.js
/////////////////////////////////////////////////

let img;
let fileName;
let output = [];
let ready = false;

let panelX, panelY, panelWidth = 200;
let textOutputDiv;
let saveButton, clearButton, uploadButton, highlightToggle;
let menuLabel, infoLabel, warningMessage = '';
let highlightMode = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont('monospace');

  panelX = windowWidth - panelWidth - 10;
  panelY = 15;
  let buttonWidth = 180;

  let cnv = select('canvas');
  cnv.drop(gotFile);

  drawAsciiBanner();
  drawUIPanel();

  textOutputDiv = createDiv('');
  textOutputDiv.style('white-space', 'pre-wrap');
  textOutputDiv.style('font-family', 'monospace');
  textOutputDiv.style('background-color', "#242424");
  textOutputDiv.style('font-size', '3px');
  textOutputDiv.style('overflow', 'auto');
  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (windowWidth - panelWidth - 40) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');
  textOutputDiv.hide();

  menuLabel = createSpan('[[ IMG-2-TXT CRT ]]');
  menuLabel.style('color', 'red');
  menuLabel.style('font-family', 'monospace');
  menuLabel.style('font-size', '12px');
  menuLabel.style('display', 'block');
  menuLabel.style('width', panelWidth + 'px');
  menuLabel.style('text-align', 'center');
  menuLabel.position(panelX, panelY + 15);

  uploadButton = createFileInput(handleFile);
  uploadButton.position(panelX + 10, panelY + 40);
  ButtonStyle(uploadButton, buttonWidth);

  saveButton = createButton('Save Text');
  saveButton.position(panelX + 10, panelY + 70);
  saveButton.mousePressed(saveTextFile);
  ButtonStyle(saveButton, buttonWidth);

  clearButton = createButton('Clear');
  clearButton.position(panelX + 10, panelY + 100);
  clearButton.mousePressed(clearOutput);
  ButtonStyle(clearButton, buttonWidth);
  
  highlightToggle = createButton('Enable Highlight');
  highlightToggle.position(panelX + 10, panelY + 130);
  highlightToggle.mousePressed(() => {
    highlightMode = !highlightMode;
    highlightToggle.html(highlightMode ? 'Disable Highlight' : 'Enable Highlight');
    redraw();
  });
  ButtonStyle(highlightToggle, buttonWidth);  

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
    renderCRTText();
    drawThumbnail();
    noLoop();
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
║  36in X 48in : 112px X 34px    ║ ║    ----     ║
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

  if (warningMessage !== '') {
    noStroke();
    fill(255, 200, 0);
    textSize(10);
    textAlign(LEFT, TOP);
    text(warningMessage, panelX + 10, panelY + 160);
  }
}

function drawThumbnail() {
  let thumbW = panelWidth;
  let aspect = img.width / img.height;
  let thumbH = thumbW / aspect;

  let x = panelX;
  let y = panelY + 200 + 10;

  fill(30);
  noStroke();
  rect(x, y, thumbW, thumbH);

  image(img, x, y, thumbW, thumbH);
}

function renderCRTText() {
  if (!ready || !img) return;

  img.loadPixels();
  output = [];
  let html = '';

  for (let y = 0; y < img.height; y++) {
    let lineHtml = '';
    let lineTxt = '';

    for (let x = 0; x < img.width; x++) {
      let idx = (x + y * img.width) * 4;
      let r = img.pixels[idx + 0];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];

      let rTxt = "R" + nf(r, 3);
      let gTxt = "G" + nf(g, 3);
      let bTxt = "B" + nf(b, 3);

      // plain text for saving
      if (y % 2 === 0) lineTxt += `${rTxt} ${gTxt} ${bTxt} `;
      else lineTxt += `${bTxt} ${rTxt} ${gTxt} `;

      // HTML display
      if (highlightMode) {
        lineHtml += `<span style="display:inline-block; width:10px; text-align:center; background-color:rgb(${r},0,0); color:black;">${rTxt}</span>`;
        lineHtml += `<span style="display:inline-block; width:10px; text-align:center; background-color:rgb(0,${g},0); color:black;">${gTxt}</span>`;
        lineHtml += `<span style="display:inline-block; width:10px; text-align:center; background-color:rgb(0,0,${b}); color:black;">${bTxt}</span>`;
      } else {
        if (y % 2 === 0) {
          lineHtml += `<span style="color:rgb(${r},0,0)">${rTxt}</span> `;
          lineHtml += `<span style="color:rgb(0,${g},0)">${gTxt}</span> `;
          lineHtml += `<span style="color:rgb(0,0,${b})">${bTxt}</span> `;
        } else {
          lineHtml += `<span style="color:rgb(0,0,${b})">${bTxt}</span> `;
          lineHtml += `<span style="color:rgb(${r},0,0)">${rTxt}</span> `;
          lineHtml += `<span style="color:rgb(0,${g},0)">${gTxt}</span> `;
        }
      }
    }

    output.push(lineTxt);
    html += lineHtml + '<br><br>';
  }

  textOutputDiv.html(html);
  textOutputDiv.show();
}

function saveTextFile() {
  if (output.length > 0) {
    let txtOutput = [];

    for (let i = 0; i < output.length; i++) {
      let line = output[i].replace(/<[^>]+>/g, '');
      txtOutput.push(line);
      txtOutput.push('');
    }

    let dateStr = month() + "_" + year();
    saveStrings(txtOutput, fileName + "_CRT_output_" + dateStr + ".txt");
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
      if (loadedImg.width > 1000) {
        warningMessage = 'Error: Image is too large. Maximum 200px wide';
        ready = false;
        img = null;
      } else {
        img = loadedImg;
        fileName = file.name.split('.')[0];
        ready = true;

        if (img.width > 200) warningMessage = 'Warning: Image is very large. Maximum 200px wide';
        else warningMessage = '';
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

  menuLabel.position(panelX + 10, panelY + 15);
  uploadButton.position(panelX + 10, panelY + 40);
  saveButton.position(panelX + 10, panelY + 70);
  clearButton.position(panelX + 10, panelY + 100);
  highlightToggle.position(panelX + 10, panelY + 130);
  infoLabel.position(panelX + 10, panelY + 180);

  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (panelX - 30) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');

  redraw();
}
