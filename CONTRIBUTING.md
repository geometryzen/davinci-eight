## Contributing

### Prerequisites

npm install --global gh-pages
npm install --global jasmine-node
npm install --global karma-cli
npm install --global npm-scripts-info
npm install --global nyc
npm install --global open-cli
npm install --global trash-cli
npm install --global typedoc
npm install --global rollup
npm install --global sleep-ms
npm install --global sorcery

### Building

Open a terminal window.

Clone the davinci-eight repo:

```bash
git clone git://github.com/geometryzen/davinci-eight.git
```

Change to the repo directory:

```bash
cd davinci-eight
```

Install NPM:

```bash
npm install
npm update
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

```bash
npm run info
npm run lint
npm run build
npm run test
npm run docs
npm run pages
npm run watch
```

to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed) and to package the individual files into a single JavaScript file.

## Making Changes

Make your changes to the TypeScript files in the _src_ directory. Do not edit the files in the _dist_ directory, these files will be generated.

## Versioning

The following files should be changed.

```
package.json
src/lib/config.ts
src/index.d.ts
```

## Git

```bash
git add --all
git commit -m '...'
git tag -a 1.2.3 -m '...'
git push origin master --tags
npm publish
```