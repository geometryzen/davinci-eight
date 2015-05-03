/// <reference path="../../../src/davinci-eight/objects/Mesh.d.ts" />
import glMatrix = require('gl-matrix');
declare var mesh: (geometry?: glMatrix.Geometry, material?: any) => Mesh;
export = mesh;
