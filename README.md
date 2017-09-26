![travis ci build](https://travis-ci.org/pjkarlik/Perlin.svg?branch=master)
![webpack3](https://img.shields.io/badge/webpack-3.0-orange.svg) ![javascript](https://img.shields.io/badge/es6-bable-yellow.svg)

# Perlin and Simplex Noise

  A rite of passage for any JavaScript enthusiast - Perlin and Simplex noise, the foundation of all random fun animation things. My goal was to learn the how and why of the two formulas. I kind of get it - not a math person here, however it was good experience converting, researching and developing these examples.

  index.js => /components/Render.js

  This is a port of Ken Perlin's Java code. The
  original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
  SimplexNoise document http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf

## Change Log
  * HSL Render version
  * Added DAT.gui
  * Updated Functions - Improved performance - adapted from online
  * Added Animation - tweaking functions still...
  * Simplex Noise functions - much faster than Perlin
  * Initial Commit - Basic formula found online.

  ## Run the example
    Requires Node v7.0.0 or greater

  ```bash
  $ yarn install
  $ yarn run dev & open http://localhost:2020
  ```

  ## License

  [MIT]
