# davinci-eight

DaVinci Eight compiles to a JavaScript library for WebGL.

It is an experiment in combining TypeScript, the functional constructor pattern (Douglas Crockford), requirejs, and almond.
It's less about WebGL at the moment although it does solve the context lost problem and cleans up after itself.

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
* v0.9.13: Initial release (pending)

## License
Copyright (c) 2014-2015 David Holmes  
Licensed under the MIT license.

