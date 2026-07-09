# // Image-2-Text

I’ve always been very interested in space. Growing up I would crawl libraries for interesting texts about the universe, mostly for the artist renderings of far-off worlds. When I first stumbled upon the Mariner 4 drawing created by the NASA/JPL team, I found a connection between digital images, data compression, and art that I had never put together before. This led me down a rabbit hole of researching early image transmission, pixel encoding, and the relationship between images and their underlying data.

What better place to start than by reverse engineering what I believe early image compression and transmission systems were doing in the 1960s.

![First image of Mars - Comparison](/images/first_image.avif)
> *First image of Mars - Comparison*

---

## About

**Image-2-Text** is an image transcoder that converts raster images into text-based representations. The project explores how images can be reconstructed, compressed, and interpreted through numerical data.

Rather than treating an image as a final visual object, this project looks at the image as a collection of stored values. Each pixel becomes information that can be translated, recorded, and rebuilt.

The project currently contains two rendering modes:

---

## MONO Mode

MONO converts each pixel into a grayscale numerical value.

Each pixel is converted using:


(Red + Green + Blue) / 3 = brightness value


The resulting value ranges from:


0 = black
255 = white


Example:


RGB(255,0,0)

(255 + 0 + 0) / 3

= 85


The output becomes a text document containing the brightness value of every pixel.

---

## CRT Mode

CRT treats each pixel as individual RGB channel data.

Instead of averaging the pixel, each channel is preserved:


Red → R
Green → G
Blue → B


Each channel is converted into a tonal code:


BB = darkest values
02-07 = tonal range
WW = brightest values


Example:


RGB(255,128,0)

RWW G04 BBB


The CRT mode is inspired by early display systems, image transmission methods, and the physical limitations of translating digital images into material processes.

The output can be used as a reference for plotting, engraving, fabrication, or other image-making systems.

---

## Image Processing

The program loads an image as a collection of pixels. Each pixel is read individually, and the RGB values are extracted.

The program then converts these values into text data.

A smaller image will process faster and create a more manageable output. For fabrication purposes, images are generally reduced to low resolutions.

Recommended image sizes:


MONO:
82px × 110px

CRT:
Approximately 200px wide maximum


---

## Output

The generated text file becomes an archive of the original image data.

Instead of storing an image as pixels, the image exists as a sequence of numerical instructions. The output can be:

- saved as a text document
- visualized as colored text
- used as source material for fabrication
- recreated through plotting or CNC processes

---

## Web Version

The current version is built with **p5.js** and includes:

- Image upload
- MONO and CRT rendering modes
- RGB channel visualization
- Highlight mode
- Image-to-text preview export
- Physical dimension calculator for fabrication output

---

## Research

This project began through research into early planetary imaging, particularly the transmission and reconstruction of the first images of Mars.

Early space imagery required scientists to think of images not as pictures, but as encoded information. The image existed as a stream of numbers that could be transmitted, interpreted, and reconstructed.

Image-2-Text explores this same relationship between data and image-making.

---

## Previous Processing Version

The original Processing version:

https://github.com/badalmer/Image-2-Text/blob/96d9da8ec169e69e7f42e5f58e2fee0ab11c1d5e/processing/TXT_IMG2TXT.pde

---

## Global Variables

`code` - acts as the output number used to calculate brightness of each pixel. 0 meaning black, 255 meaning white.

`file` - uses image input to process pixels individually. Since the program works pixel-by-pixel, smaller low-resolution images are recommended.

---
