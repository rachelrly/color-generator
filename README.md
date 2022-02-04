# [Color Generator](https://practical-sinoussi-967ca9.netlify.app)

This repo contains an enhanced color generator that returns a random HSL color and has the ability to increment the color based on hue, saturation, or lightness.

View a live demo of the color generator [here](https://practical-sinoussi-967ca9.netlify.app).
To generate a new color set, click of the square.

## Stack

- TypeScript
- Parcel
- Deployed with Netlify

## Images

<a data-flickr-embed="true" href="https://www.flickr.com/photos/194941749@N07/51860925398/in/dateposted-public/" title="sample-3"><img src="https://live.staticflickr.com/65535/51860925398_aee2645c67_z.jpg" width="564" height="626" alt="sample-3"></a>

<a data-flickr-embed="true" href="https://www.flickr.com/photos/194941749@N07/51860925398/in/dateposted-public/" title="sample-3"><img src="https://live.staticflickr.com/65535/51860925398_aee2645c67_z.jpg" width="564" height="626" alt="sample-3"></a>

<a data-flickr-embed="true" href="https://www.flickr.com/photos/194941749@N07/51860925398/in/dateposted-public/" title="sample-3"><img src="https://live.staticflickr.com/65535/51860925398_aee2645c67_z.jpg" width="564" height="626" alt="sample-3"></a>

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
