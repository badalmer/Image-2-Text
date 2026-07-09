# // Image-2-Text

I’ve always been very interested in space. Growing up I would crawl libraries for interesting texts about the universe, mostly for the artist renderings of far-off worlds. When I first stumbled upon the Mariner 4 drawing created by the NASA/JPL team, I found a connection between digital images, data compression, and art that I had never put together before. This led me down a rabbit hole of researching early image transmission, pixel encoding, and the relationship between images and their underlying data.

What better place to start than by reverse engineering what I believe early image compression and transmission systems were doing in the 1960s.

![First image of Mars - Comparison](/images/first_image.avif)
> *First image of Mars - Comparison*

## About

**Image-2-Text** is an image transcoder that converts raster images into text-based representations. The project currently contains two rendering modes:

## MONO Mode

MONO converts each pixel into a grayscale numerical value.

Each pixel is converted using:


>(Red + Green + Blue) / 3 = average value

These values are then recorded before moving on to the next pixel.


## CRT Mode

CRT treats each pixel as individual RGB channel data.

Instead of averaging the pixel, each channel is preserved:

## Links

More information can be found here: https://brandon-a-dalmer.gitbook.io/studio-notes/codecs/image-2-text

The original Processing version: https://github.com/badalmer/Image-2-Text/blob/96d9da8ec169e69e7f42e5f58e2fee0ab11c1d5e/processing/TXT_IMG2TXT.pde

## Global Variables

`code` - acts as the output number used to calculate brightness of each pixel. 0 meaning black, 255 meaning white.

`file` - uses image input to process pixels individually. Since the program works pixel-by-pixel, smaller low-resolution images are recommended.
