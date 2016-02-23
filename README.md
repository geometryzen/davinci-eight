# davinci-eight a.k.a EIGHT

DaVinci EIGHT is a WebGL library for mathematical physics using Geometric Algebra

EIGHT is designed and developed according to the following principles:

1. Designed foremost to integrate with Mathematical Physics and Geometric Algebra.
2. Manage shader complexity rather than trying to hide it.
3. Be un-opinionated.
4. Assist with management of WebGL state and invariants.
5. Assist with GLSL boilerplate.
6. Assist with long running interactions, resource sharing and context management.
7. Provide reusable geometry abstractions on top of the core for productivity.
8. Provide smart shader program builders for productivity.
9. Facilitate use for research programming, education and demonstration.
10. Explicit is better than implicit.

Used here: [__http://www.mathdoodle.io__](http://mathdoodle.io)

## Why EIGHT?

8 = 2 * 2 * 2, which is the number of dimensions in a geometric space over a vector space of 3 dimensions.

Geometric Algebra is what you get when you define an associative multiplicative product for vectors.

More simply, 3D geometry is simpler when it is done using Geometric Algebra!

WARNING. This library is under active development; the API is subject to changes that are likely to break semantic versioning.

## API documentation

[API Documentation](http://www.mathdoodle.io/docs/davinci-eight/index.html)

## Contributing

### Building

Open a terminal window.

Clone the davinci-eight repo:
```
git clone git://github.com/geometryzen/davinci-eight.git
```

Change to the repo directory:
```
cd davinci-eight
```

Install NPM:
```
npm install
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

Install Bower:
```
bower install
```
to install the software dependencies (For this you need to have [Bower](http://bower.io) installed).

Install JSPM:
```
jspm install
```
to install JSPM, used for testing.

Install TypeScript definitions:
```
tsd install
```
to install TypeScript definitions for Jasmine used in testing.

```
grunt
```
to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed) and to package the individual files into a single JavaScript file.

### Making Changes

Make your changes to the TypeScript files in the _src_ directory. Do not edit the files in the _dist_ directory, these files will be generated.

## License
Copyright (c) 2014-2016 David Holmes
Licensed under the MIT license.
