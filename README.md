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
* 1.000.0: 2015-05-02 Initial release.
* 2.000.0: 2015-06-27 Manage WebGL complexity.
* 2.001.0: 2015-06-30 Shader introspection.
* 2.002.0: 2015-07-02 Ellipsoid.
* 2.003.0: 2015-07-02 uniform variables.
* 2.004.0: 2015-07-03 Cuboid.
* 2.005.0: 2015-07-03 SmartMaterial.
* 2.006.0: 2015-07-05 Mesh, MeshBasicMaterial.
* 2.007.0: 2015-07-05 EIGHT namespace.
* 2.008.0: 2015-07-05 BoxGeometry
* 2.009.0: 2015-07-05 WebGLRenderer
* 2.010.0: 2015-07-05 Quaternion
* 2.011.0: 2015-07-06 Geometry
* 2.012.0: 2015-07-07 ArrowGeometry
* 2.013.0: 2015-07-07 VortexGeometry
* 2.014.0: 2015-07-07 PolyhedronGeometry
* 2.015.0: 2015-07-08 CylinderGeometry
* 2.016.0: 2015-07-08 SphereGeometry
* 2.017.0: 2015-07-08 TubeGeometry
* 2.018.0: 2015-07-08 ParametricGeometry
* 2.019.0: 2015-07-18 Library
* 2.020.0: 2015-07-19 Frustum
* 2.021.0: 2015-07-20 Framework
* 2.022.0: 2015-07-22 Viewport
* 2.023.0: 2015-07-23 ShaderProgram variables
* 2.024.0: 2015-07-23 UniformVec2
* 2.025.0: 2015-07-24 UniformVariable
* 2.026.0: 2015-07-24 uniform checking
* 2.027.0: 2015-07-25 DataUsage
* 2.028.0: 2015-07-25 animation
* 2.029.0: 2015-07-26 objects
* 2.030.0: 2015-07-26 DirectionalLight
* 2.031.0: 2015-07-27 Color
* 2.032.0: 2015-07-27 Vector3
* 2.033.0: 2015-07-27 UniformVector3
* 2.034.0: 2015-07-27 Mutable
* 2.035.0: 2015-07-27 AmbientLight
* 2.036.0: 2015-07-27 Box
* 2.037.0: 2015-07-28 BoxOptions
* 2.038.0: 2015-07-28 SphereBuilder
* 2.039.0: 2015-07-28 ArrowBuilder
* 2.040.0: 2015-07-30 LocalModel
* 2.041.0: 2015-07-30 Node
* 2.042.0: 2015-07-31 DrawList
* 2.043.0: 2015-08-01 VarName
* 2.044.0: 2015-08-01 clearColor
* 2.045.0: 2015-08-02 View, Frustum, Perspective
* 2.046.0: 2015-08-03 shaderProgram
* 2.047.0: 2015-08-04 Arrow
* 2.048.0: 2015-08-06 Matrix4
* 2.049.0: 2015-08-07 Arrow
* 2.050.0: 2015-08-09 attribute and uniform name overrides
* 2.051.0: 2015-08-09 Restore names used in Symbolic
* 2.052.0: 2015-08-09 BarnGeometry
* 2.053.0: 2015-08-10 Vector2
* 2.054.0: 2015-08-11 Quaternion
* 2.055.0: 2015-08-12 View
* 2.056.0: 2015-08-13 Renderer
* 2.057.0: 2015-08-16 Cylinder
* 2.058.0: 2015-08-16 CylinderMeshBuilder
* 2.059.0: 2015-08-19 Upgrade blade
* 2.060.0: 2015-08-27 Stats
* 2.061.0: 2015-08-30 uniforms
* 2.062.0: 2015-09-02 addRef,release
* 2.063.0: 2015-09-02 contextFree
* 2.064.0: 2015-09-02 frustum, perspective, view
* 2.065.0: 2015-09-03 Geometry
* 2.066.0: 2015-09-03 uniforms
* 2.067.0: 2015-09-03 DrawableVisitor
* 2.068.0: 2015-09-04 API
* 2.069.0: 2015-09-04 AbstractMatrix
* 2.070.0: 2015-09-05 UniformLocation
* 2.071.0: 2015-09-05 VertexBuffer
* 2.072.0: 2015-09-05 drawArrays
* 2.073.0: 2015-09-06 cleanup
* 2.074.0: 2015-09-06 memoize
* 2.075.0: 2015-09-06 IUnknown
* 2.076.0: 2015-09-07 Spinor3
* 2.077.0: 2015-09-08 Buffer
* 2.078.0: 2015-09-09 Face
* 2.079.0: 2015-09-09 VectorN
* 2.080.0: 2015-09-09 checkIn,setUp,tearDown,checkOut
* 2.081.0: 2015-09-10 token
* 2.082.0: 2015-09-11 Mesh
* 2.083.0: 2015-09-11 IUnknownMap
* 2.084.0: 2015-09-11 Simplex
* 2.085.0: 2015-09-12 Vertex
* 2.086.0: 2015-09-12 triangles
* 2.087.0: 2015-09-12 triangle
* 2.088.0: 2015-09-12 cube
* 2.089.0: 2015-09-12 refactor
* 2.090.0: 2015-09-13 checkGeometry
* 2.091.0: 2015-09-13 DrawElements
* 2.092.0: 2015-09-13 Symbolic
* 2.093.0: 2015-09-14 Rotor3
* 2.094.0: 2015-09-15 k-simplex
* 2.095.0: 2015-09-16 multi-canvas
* 2.096.0: 2015-09-16 BoxComplex
* 2.097.0: 2015-09-17 HTMLScriptsMaterial
* 2.098.0: 2015-09-18 IUnknownArray
* 2.099.0: 2015-09-18 IContextCommand
* 2.100.0: 2015-09-19 BoxGeometry
* 2.101.0: 2015-09-19 IBufferGeometry
* 2.102.0: 2015-09-20 RigidBody3

## License
Copyright (c) 2014-2015 David Holmes
Licensed under the MIT license.
