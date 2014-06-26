# davinci-eight

DaVinci Eight compiles to a JavaScript library for WebGL. It is an experiment in combining TypeScript,
the functional constructor pattern (Douglas Crockford), requirejs and almond.

## Getting Started

It does not run yet! But it will very soon.

## Contributing

### Building

Open your Terminal, clone davinci-eight
```
git clone git://github.com/geometryzen/davinci-eight.git
```

Enter the directory
```
cd davinci-eight
```

and run
```
npm install
```
to install the development dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

and run
```
bower install
```
to install the development dependencies (For this you need to have [Bower](bower.io) installed).

Run the TypeScript compiler to generate JavaScript and d.ts files.
```
jake --jakefile Jakefile.js
```

Package the individual files into a single JavaScript file.
```
grunt
```
