# davinci-eight a.k.a EIGHT

DaVinci EIGHT is a WebGL library for mathematical physics using Geometric Algebra

EIGHT is designed and developed according to the following principles:

1. Designed foremost to enable custom shader development.
2. Manage shader complexity rather than trying to hide it.
3. Be un-opinionated. Make no assumptions in the core code other than those intrinsic to WebGL.
4. Assist with management of WebGL state and invariants.
5. Assist with GLSL boilerplate.
6. Assist with shader program integrity using e.g. introspection.
7. Provide reusable geometry abstractions on top of the core for productivity.
8. Provide smart shader program builders for productivity.
9. Facilitate use for research programming, education and demonstration.
10. Explicit is better than implicit.
11. It must go up to eleven.

Used here: [__http://www.mathdoodle.io__](http://mathdoodle.io)

## Why EIGHT?

8 = 2 * 2 * 2, which is the number of dimensions in a geometric space over a vector space of 3 dimensions.

Geometric Algebra is what you get when you define an associative multiplicative product for vectors.

More simply, 3D geometry is simpler when it is done using Geometric Algebra!

WARNING. This library is under active development; the API is subject to changes that are likely to break semantic versioning.

[![Build Status](https://travis-ci.org/geometryzen/davinci-eight.png)](https://travis-ci.org/geometryzen/davinci-eight)

## API documentation

[Under development](http://htmlpreview.github.com/?https://github.com/geometryzen/davinci-eight/blob/master/documentation/index.html)

## Getting Started

### Non-AMD execution

Open the following file in your browser (Chrome of Firefox).
```
demo/index.html
```
Make sure that Pop-ups are not blocked for the page.

This will run the non-AMD version of the code.

### AMD execution

To compile the main.ts to main.js:
```
tsc --module "amd" --target ES5
```

Open the following file in your browser (Chrome of Firefox).
```
demo/amd.html
```
Make sure that Pop-ups are not blocked for the page.

This will run the AMD version of the code.

## Contributing

### Building

Open your Terminal.

Clone the davinci-eight repo.
```
git clone git://github.com/geometryzen/davinci-eight.git
```

Change to the repo directory.
```
cd davinci-eight
```

Run
```
npm install
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

Run
```
bower install
```
to install the software dependencies (For this you need to have [Bower](http://bower.io) installed).

Run
```
grunt
```
to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed) and to package the individual files into a single JavaScript file.

### Making Changes

Make your changes to the TypeScript files in the _src_ directory. Do not edit the files in the _dist_ directory, these files will be generated.

## Release History
* 1.0.0:  2015-05-02 Initial release.
* 2.0.0:  2015-06-27 Manage WebGL complexity.
* 2.1.0:  2015-06-30 Shader introspection.
* 2.2.0:  2015-07-02 Ellipsoid.
* 2.3.0:  2015-07-02 uniform variables.
* 2.4.0:  2015-07-03 Cuboid.
* 2.5.0:  2015-07-03 SmartMaterial.
* 2.6.0:  2015-07-05 Mesh, MeshBasicMaterial.
* 2.7.0:  2015-07-05 EIGHT namespace.
* 2.8.0:  2015-07-05 BoxGeometry
* 2.9.0:  2015-07-05 WebGLRenderer
* 2.10.0: 2015-07-05 Quaternion
* 2.11.0: 2015-07-06 Geometry
* 2.12.0: 2015-07-07 ArrowGeometry
* 2.13.0: 2015-07-07 VortexGeometry
* 2.14.0: 2015-07-07 PolyhedronGeometry
* 2.15.0: 2015-07-08 CylinderGeometry
* 2.16.0: 2015-07-08 SphereGeometry
* 2.17.0: 2015-07-08 TubeGeometry
* 2.18.0: 2015-07-08 ParametricGeometry
* 2.19.0: 2015-07-18 Library
* 2.20.0: 2015-07-19 Frustum
* 2.21.0: 2015-07-20 Framework
* 2.22.0: 2015-07-22 Viewport
* 2.23.0: 2015-07-23 ShaderProgram variables
* 2.24.0: 2015-07-23 UniformVec2
* 2.25.0: 2015-07-24 UniformVariable
* 2.26.0: 2015-07-24 uniform checking
* 2.27.0: 2015-07-25 DataUsage
* 2.28.0: 2015-07-25 animation
* 2.29.0: 2015-07-26 objects
* 2.30.0: 2015-07-26 DirectionalLight
* 2.31.0: 2015-07-27 Color
* 2.32.0: 2015-07-27 Vector3
* 2.33.0: 2015-07-27 UniformVector3
* 2.34.0: 2015-07-27 Mutable
* 2.35.0: 2015-07-27 AmbientLight
* 2.36.0: 2015-07-27 Box
* 2.37.0: 2015-07-28 BoxOptions
* 2.38.0: 2015-07-28 SphereBuilder
* 2.39.0: 2015-07-28 ArrowBuilder
* 2.40.0: 2015-07-30 LocalModel
* 2.41.0: 2015-07-30 Node
* 2.42.0: 2015-07-31 DrawList
* 2.43.0: 2015-08-01 VarName
* 2.44.0: 2015-08-01 clearColor

## License
Copyright (c) 2014-2015 David Holmes
Licensed under the MIT license.

