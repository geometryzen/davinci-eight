# davinci-eight

[![version](https://img.shields.io/npm/v/davinci-eight.svg)](https://www.npmjs.com/package/davinci-eight) 

[![npm downloads](https://img.shields.io/npm/dm/davinci-eight.svg)](https://npm-stat.com/charts.html?package=davinci-eight&from=2020-06-01) 

<!--
[![Build Status](https://travis-ci.org/geometryzen/davinci-eight.svg)](https://travis-ci.org/geometryzen/davinci-eight) 
-->

[![devDependency status](https://david-dm.org/geometryzen/davinci-eight/dev-status.svg)](https://david-dm.org/geometryzen/davinci-eight?type=dev)

davinci-eight is a WebGL library for mathematical physics using Geometric Algebra

```ts
import { Engine, Capability } from 'davinci-eight'
import { Facet, PerspectiveCamera, DirectionalLight } from 'davinci-eight'
import { Box } from 'davinci-eight'
import { Color } from 'davinci-eight'
import { TrackballControls } from 'davinci-eight'
import { Geometric3 } from 'davinci-eight'

const e2 = Geometric3.e2()
const e3 = Geometric3.e3()

const engine = new Engine('my-canvas')
    .size(500, 500)
    .clearColor(0.1, 0.1, 0.1, 1.0)
    .enable(Capability.DEPTH_TEST)

const ambients: Facet[] = []

const camera = new PerspectiveCamera()
// camera.eye.z = 5
camera.eye = e2 + 3 * e3
ambients.push(camera)

const dirLight = new DirectionalLight()
ambients.push(dirLight)

const box = new Box(engine, { color: Color.green })

const trackball = new TrackballControls(camera, window)
// Subscribe to mouse events from the canvas.
trackball.subscribe(engine.canvas)

/**
 * animate is the callback point for requestAnimationFrame.
 * This has been initialized with a function expression in order
 * to avoid issues associated with JavaScript hoisting.
 */
const animate = function(timestamp: number) {
    engine.clear()

    // Update the camera based upon mouse events received.
    trackball.update()

    // Keep the directional light pointing in the same direction as the camera.
    dirLight.direction.copy(camera.look).sub(camera.eye)

    const t = timestamp * 0.001

    // box.R.rotorFromGeneratorAngle({ xy: 0, yz: 1, zx: 0 }, t)
    box.attitude.rotorFromAxisAngle(e2, t)

    box.render(ambients)

    // This call keeps the animation going.
    requestAnimationFrame(animate)
}

// This call "primes the pump".
requestAnimationFrame(animate)
```

davinci-eight is designed and developed according to the following principles:

1. Designed foremost to support Mathematical Physics using Geometric Algebra.
2. Manage WebGL shader complexity rather than trying to hide it.
3. Be un-opinionated at the lowest levels.
4. Assist with management of WebGL state and invariants.
5. Assist with GLSL boilerplate.
6. Assist with long running interactions, resource sharing and context management.
7. Provide reusable geometry abstractions on top of the core for productivity.
8. Enable low-level WebGL code to coexist with high-level abstractions.
9. Provide smart shader program builders for productivity.
10. Facilitate use for research programming, education and demonstration.
11. Explicit is better than implicit.
12. Organize WebGL API using Object Orientation.

Used here: [__https://www.stemcstudio.com__](https://stemcstudio.com)

## Why 8?

8 = 2<sup>3</sup>, which is the number of dimensions in a geometric space over a vector space of 3 dimensions.

Geometric Algebra is what you get when you define an associative multiplicative product for vectors.

More simply, geometry makes more sense when it is done using Geometric Algebra!

## API Documentation

The `Globals` or top-level components represent only a small portion of what is available in the EIGHT library.
Drilling into the top-level componets will reveal a reusable structure for implementing your own components.

The HTML documentation is best experienced with the following settings:

1. Access        - Public/Protected
2. Inherited     - Unchecked
3. Externals     - Checked
4. Only exported - Unchecked

The documentation is evolving rapidly due to transitioning to a new system of TypeScript documentation generation.
In particular, you may see the word `default` frequently. This is because the EIGHT code uses default exports.
Just click through the `default` links to get past them.

## License
Copyright (c) 2014-2020 David Holmes
Licensed under the MIT license.
