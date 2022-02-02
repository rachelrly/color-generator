# [Color Generator]('practical-sinoussi-967ca9.netlify.app')

This repo contains an enhanced color generator that returns a random HSL color and has the ability to increment the color based on hue, saturation, or lightness.

View a live demo of the color generator [here]('practical-sinoussi-967ca9.netlify.app').
To generate a new color set, click of the square.

## Stack

- TypeScript
- Parcel
- Deployed with Netlify

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
