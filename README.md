# davinci-eight

DaVinci Eight compiles to a JavaScript library for WebGL. It is an experiment in combining TypeScript,
the functional constructor pattern (Douglas Crockford), requirejs and almond.

## Getting Started

It does not run yet! But it will very soon.

## Contributing

### Building

Open your Terminal, clone davinci-eight:
```
git clone git://github.com/geometryzen/davinci-eight.git
```

Enter the project directory.
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
jake --jakefile Jakefile.js
```
to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed).

Run
```
grunt
```
to package the individual files into a single JavaScript file.
