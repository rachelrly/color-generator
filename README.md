# [Color Sequence Generator](https://practical-sinoussi-967ca9.netlify.app)

View a live demo of the color sequence generator [here](https://practical-sinoussi-967ca9.netlify.app).

## Stack

- Svelte
- TypeScript
- TailwindCSS

## Images

<a data-flickr-embed="true" href="https://www.flickr.com/photos/194941749@N07/51860925503/in/dateposted-public/" title="sample-1"><img src="https://live.staticflickr.com/65535/51860925503_5e3e0721c2_w.jpg" width="389" height="400" alt="sample-1"></a>

<a data-flickr-embed="true" href="https://www.flickr.com/photos/194941749@N07/51860925388/in/dateposted-public/" title="sample-2"><img src="https://live.staticflickr.com/65535/51860925388_1e03e1a8d2_w.jpg" width="400" height="357" alt="sample-2"></a>

<a data-flickr-embed="true" href="https://www.flickr.com/photos/194941749@N07/51860925398/in/dateposted-public/" title="sample-3"><img src="https://live.staticflickr.com/65535/51860925398_aee2645c67_w.jpg" width="360" height="400" alt="sample-3"></a>

## Codebase

### /src

Contains the TS code for the project.

#### /index.ts

Contains `main()` run by index.html

#### /square.ts

Creates SVG square in the dom. Also has function to generate stacked square from an array of any given length.

#### /colors.ts

Sets color for a stacked square.

#### /types

Contains TS types, including the HSL class used to contain color logic.

#### / utils

Contains functions for random number generation and incrementing colors.
