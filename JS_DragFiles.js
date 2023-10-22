///////////////////////////////////////////////// 
// Brandon A. Dalmer - 2023
// Image transcode - image to text - 82 X 110 pixels = 36" X 48"
///////////////////////////////////////////////// 

let drop;
let img;
let code = 0;
let output;

function setup() {
  createCanvas(250, 250);
  textSize(32);
  textAlign(CENTER);
  fill(0);
  text("DRAG 2 TEXT", width / 2, height / 2);

  drop = new FileDrop(canvas, imageDropped);
}

function imageDropped(file) {
  if (file.type === 'image') {
    img = createImg(file.data, ''); // Load the image
    img.hide(); // Hide the image element
    img.size(width, height);
    img.parent(canvas);

    output = createWriter("Mariner_4_output" + month() + year() + ".txt");

    img.loadPixels();
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let loc = x + y * img.width * 4;
        let r = img.pixels[loc];
        let g = img.pixels[loc + 1];
        let b = img.pixels[loc + 2];
        code = (r + g + b) / 3; // B&W average
        println(code);
        let txt = nf(int(code), 3);
        output.print(txt + " ");
      }
      output.println();
      output.println();
    }
    output.flush();
    output.close();
  }
}

function draw() {
  // Your drawing code here
}
