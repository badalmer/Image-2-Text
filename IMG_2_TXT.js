/////////////////////////////////////////////////
// Brandon A. Dalmer - 2026
// Image transcode - image to text - complete
/////////////////////////////////////////////////

let img;
let fileName;
let output = [];
let ready = false;

let panelX, panelY, panelWidth = 200;
let rows = 0;  
let lines = 0;

let widthInput, heightInput, calculateButton;

let textOutputDiv;
let saveButton, clearButton, uploadButton, saveTextImageButton, muteButton, highlightToggle, modeButton;
let menuLabel, infoLabel, warningMessage = '';

let highlightMode = false;
let muteMode = false;

let renderMode = "MONO";

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.getContext('2d', { willReadFrequently: true });
  background(0);
  textFont('monospace');

  panelX = windowWidth - panelWidth - 15;
  panelY = 15;
  let buttonWidth = 180;

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

  menuLabel = createSpan('[[ IMG-2-TXT MONOCHROME ]]');
  menuLabel.style('color', 'red');
  menuLabel.style('font-family', 'monospace');
  menuLabel.style('font-size', '12px');
  menuLabel.style('display', 'block');
  menuLabel.style('width', panelWidth + 'px');
  menuLabel.style('text-align', 'center');
  menuLabel.position(panelX, panelY + 15);
  
  modeButton = createButton('Mode: MONO');
  modeButton.position(panelX +10, panelY + 40);
  modeButton.mousePressed(() => {
    if (renderMode === "MONO") {
      renderMode = "CRT";
      modeButton.html("Mode: CRT");
    } else {
      renderMode = "MONO";
      modeButton.html("Mode: MONO");
    }
  
    menuLabel.html(
      renderMode === "MONO"
      ? "[[ IMG-2-TXT MONOCHROME ]]"
      : "[[ IMG-2-TXT CRT ]]"
    );
    
    output = [];
    textOutputDiv.html('');
    
    updateDimensions();
    redraw();
  });
  ButtonStyle(modeButton, buttonWidth);

  uploadButton = createFileInput(handleFile);
  uploadButton.position(panelX + 10, panelY + 70);
  ButtonStyle(uploadButton, buttonWidth);

  saveButton = createButton('Save Text');
  saveButton.position(panelX + 10, panelY + 100);
  saveButton.mousePressed(saveTextFile);
  ButtonStyle(saveButton, buttonWidth);

  clearButton = createButton('Clear');
  clearButton.position(panelX + 10, panelY + 130);
  clearButton.mousePressed(clearOutput);
  ButtonStyle(clearButton, buttonWidth);
  
  highlightToggle = createButton('Enable Highlight');
  highlightToggle.position(panelX + 10, panelY + 160);
  highlightToggle.mousePressed(() => {
    highlightMode = !highlightMode;
    highlightToggle.html(highlightMode ? 'Disable Highlight' : 'Enable Highlight');
    redraw();
  });
  ButtonStyle(highlightToggle, buttonWidth);
  
  muteButton = createButton('Mute Green Pixels');
  muteButton.position(panelX + 10, panelY + 190);
  muteButton.mousePressed(() => {
    muteMode = !muteMode;
    muteButton.html(muteMode ? 'Show Green Pixels' : 'Mute Green Pixels');
  
    console.log("Mute Mode:", muteMode);
  
    renderCRTText();
  });
  ButtonStyle(muteButton, buttonWidth);
  
  saveTextImageButton = createButton('Save Preview Image');
  saveTextImageButton.position(panelX + 10, panelY + 220);  
  saveTextImageButton.mousePressed(() => {
    html2canvas(textOutputDiv.elt).then(canvas => {
      let link = document.createElement('a');
      link.download = fileName + "_TXT_preview.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
  ButtonStyle(saveTextImageButton, buttonWidth);

  widthInput = createInput('');
  widthInput.attribute('placeholder', 'Width (in)');
  widthInput.position(panelX + 10, panelY + 250);
  widthInput.size(80);
  InputStyle(widthInput);
  
  heightInput = createInput('');
  heightInput.attribute('placeholder', 'Height (in)');
  heightInput.position(panelX + 105, panelY + 250);
  heightInput.size(80);
  InputStyle(heightInput);
  
  calculateButton = createButton('Calculate');
  calculateButton.position(panelX + 10, panelY + 273);
  calculateButton.mousePressed(updateDimensions);
  ButtonStyle(calculateButton, 180);
  updateDimensions();

  infoLabel = createSpan('*Brandon A. Dalmer | 2026');
  infoLabel.style('color', 'red');
  infoLabel.style('font-family', 'monospace');
  infoLabel.style('font-size', '10px');
  infoLabel.style('display', 'block');
  infoLabel.style('width', panelWidth + 'px');
  infoLabel.position(panelX + 10, panelY + 310);
  
  noLoop();
}

function draw() {
  background(0);
  drawAsciiBanner();
  drawUIPanel();
  if (!ready || !img) {
    return;
  }
  drawThumbnail();
  if (renderMode === "MONO") {
    renderMonoText();
  } 
  else if (renderMode === "CRT") {
    renderCRTText();
  }
  
  noLoop();
}

function updateDimensions() {
  let w = float(widthInput.value()) || 0;
  let h = float(heightInput.value()) || 0;

  if (renderMode === "MONO") {
    rows = Math.round(w * 2.72917);
    lines = Math.round(h * 3.05);
  } 
  
  else if (renderMode === "CRT") {
    rows = Math.round(w * 0.875);   // width
    lines = Math.round(h * 3.1111);   // height
  }
  
  redraw();
}

function quantizeColor(v, channel) {
  let steps = [31, 63, 95, 127, 159, 191, 223, 255];
  let value = steps.find(s => v <= s) || 225;
  if (channel === 'r') return [value, 0, 0];
  if (channel === 'g') return [0, value, 0];
  if (channel === 'b') return [0, 0, value];
}

function drawAsciiBanner() {
  fill(255, 0, 0);
  textSize(14);
  noStroke();
  textAlign(LEFT, TOP);
  
  let w = widthInput ? float(widthInput.value()) : 0;
  let h = heightInput ? float(heightInput.value()) : 0;

  let banner = `


##################################################

            IMG  ➜  TXT  TRANSCODER

##################################################

Width (in):  ${w}
Height (in): ${h}

Calculated Output:
Width: ${rows}px
Height: ${lines}px

Accepted types:
++ JPEG/JPG
++ PNG
++ GIF
++ BMP
++ WEBP
`;

  text(banner, 25, 15);
}

function drawUIPanel() {
  fill(0);
  stroke(255, 0, 0);
  rect(panelX, panelY, panelWidth, 330);

  if (warningMessage !== '') {
    noStroke();
    fill(255, 200, 0);
    textSize(10);
    text(warningMessage, panelX + 10, panelY + 350, panelWidth - 20);
  }
}

function drawThumbnail() {
  if (!img) return;

  let w = panelWidth;
  let h = w * (img.height / img.width);

  image(img, panelX, panelY + 350, w, h);
}

function renderMonoText() {
  output = [];
  let html = '';

  for (let y = 0; y < img.height; y++) {
    let lineTxt = '';
    let lineHtml = '';

    for (let x = 0; x < img.width; x++) {
      let i = (x + y * img.width) * 4;

      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];

      let code = (r + g + b) / 3;
      let txt = nf(floor(code), 3);

      lineTxt += txt + " ";

      // GREYSCALE INTENSITY
      let grey = code; // 0–255

      if (highlightMode) {
        lineHtml += `<span style="
          display:inline-block;
          width:10px;
          text-align:center;
          background-color:rgb(${grey},${grey},${grey});
          color:${grey > 140 ? '#000' : '#fff'};
        ">${txt}</span>`;
      } else {
        lineHtml += `<span style="color:rgb(${grey},${grey},${grey})">${txt}</span> `;
      }
    }

    output.push(lineTxt);
    output.push('');
    html += lineHtml + '<br><br>';
  }

  textOutputDiv.html(html);
  textOutputDiv.show();
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

      let rTxt = "R" + tonalCode(r);
      let gTxt = "G" + tonalCode(g);
      let bTxt = "B" + tonalCode(b);

      // plain text for saving
      if (y % 2 === 0) lineTxt += `${rTxt} ${gTxt} ${bTxt} `;
      else lineTxt += `${bTxt} ${rTxt} ${gTxt} `;

      // HTML display
      let rCol = quantizeColor(r, 'r');
      let gCol = quantizeColor(g, 'g');
      let bCol = quantizeColor(b, 'b');
      
      if (highlightMode && !muteMode) {

        lineHtml += `<span style="display:inline-block; width:10px; text-align:center; background-color:rgb(${r},0,0); color:black;">${rTxt}</span>`;
        lineHtml += `<span style="display:inline-block; width:10px; text-align:center; background-color:rgb(0,${g},0); color:black;">${gTxt}</span>`;
        lineHtml += `<span style="display:inline-block; width:10px; text-align:center; background-color:rgb(0,0,${b}); color:black;">${bTxt}</span>`;
      
      } else if (muteMode) {
      
        lineHtml += `<span style="color:rgb(${r},0,0)">${rTxt}</span> `;
        lineHtml += `<span style="color:black">${gTxt}</span> `;
        lineHtml += `<span style="color:rgb(0,0,${b})">${bTxt}</span> `;
      
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
    output.push('');
    html += lineHtml + '<br><br>';
  }

  textOutputDiv.html(html);
  textOutputDiv.show();
}

function mutePixels() {
  textOutputDiv.style('background-color', "#242424");
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, (loaded) => {

      if (loaded.width > 500) {
        warningMessage = 'Error: Image is too large. \nMaximum 500px wide';
        ready = false;
        img = null;

      } else {
        img = loaded;
        img.loadPixels();

        fileName = file.name.split('.')[0];
        ready = true;

        if (img.width > 200) {
          warningMessage = 'Warning: Image is very large. \nIdeally 200px wide';
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

function saveTextFile() {
  if (!output.length) return;
  saveStrings(
    output,
    fileName + "_" + renderMode + "_output.txt"
  );
}

function clearOutput() {
  img = null;
  output = [];
  ready = false;
  textOutputDiv.html('');
  textOutputDiv.hide();
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  panelX = windowWidth - panelWidth - 15;
  panelY = 15;

  menuLabel.position(panelX, panelY + 15);
  modeButton.position(panelX +10, panelY + 40);
  uploadButton.position(panelX + 10, panelY + 70);
  saveButton.position(panelX + 10, panelY + 100);
  clearButton.position(panelX + 10, panelY + 130);
  highlightToggle.position(panelX + 10, panelY + 160);
  muteButton.position(panelX + 10, panelY + 190);
  saveTextImageButton.position(panelX + 10, panelY + 220);
  widthInput.position(panelX + 10, panelY + 250);
  heightInput.position(panelX + 105, panelY + 250);
  calculateButton.position(panelX + 10, panelY + 273);
  infoLabel.position(panelX + 10, panelY + 310);

  textOutputDiv.style('width', (panelX - 40) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');
  
  redraw();
}

function ButtonStyle(btn, w) {
  btn.style('width', w + 'px');
  btn.style('height', '25px');
  btn.style('color', 'red');
  btn.style('background-color', 'black');
  btn.style('border', '1px solid red');
  btn.style('font-family', 'monospace');
  btn.style('font-size', '12px');
}

function InputStyle(inp) {
  inp.style('color', 'red');
  inp.style('background-color', 'black');
  inp.style('border', '1px solid red');
  inp.style('font-family', 'monospace');
  inp.style('font-size', '12px');
}

function tonalCode(v) {
  if (v <= 31) return "BB";
  else if (v <= 63) return "02";
  else if (v <= 95) return "03";
  else if (v <= 127) return "04";
  else if (v <= 159) return "05";
  else if (v <= 191) return "06";
  else if (v <= 223) return "07";
  else return "WW";
}
