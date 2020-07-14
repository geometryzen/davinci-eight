# davinci-eight

[![version](https://img.shields.io/npm/v/davinci-eight.svg)](https://www.npmjs.com/package/davinci-eight) 

[![npm downloads](https://img.shields.io/npm/dm/davinci-eight.svg)](https://npm-stat.com/charts.html?package=davinci-eight&from=2020-06-01) 

<!--
[![Build Status](https://travis-ci.org/geometryzen/davinci-eight.svg)](https://travis-ci.org/geometryzen/davinci-eight) 
-->

[![devDependency status](https://david-dm.org/geometryzen/davinci-eight/dev-status.svg)](https://david-dm.org/geometryzen/davinci-eight?type=dev)

davinci-eight is a WebGL library for mathematical physics using Geometric Algebra

Example: [__https://www.stemcstudio.com/gists/54644519dcd556bf8bf779bfa084ced3__](https://stemcstudio.com/gists/54644519dcd556bf8bf779bfa084ced3)

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

Typedoc here: [__https://geometryzen.github.io/davinci-eight__](https://geometryzen.github.io/davinci-eight)

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
