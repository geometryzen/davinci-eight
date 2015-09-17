// When using amd-dependency, you must know the file structure of the library being used.
// You must declare a variable for each dependency.
// You may type your variables.
// Be careful to only use the type declarations in type positions that will be erased.

/// <amd-dependency path="davinci-blade/e3ga/Euclidean3" name="Euclidean3"/>
/// <amd-dependency path="davinci-blade/e3ga/scalarE3" name="scalarE3"/>
/// <amd-dependency path="davinci-blade/e3ga/vectorE3" name="vectorE3"/>
/// <amd-dependency path="davinci-blade/e3ga/bivectorE3" name="bivectorE3"/>
/// <amd-dependency path="davinci-blade/e3ga/pseudoscalarE3" name="pseudoscalarE3"/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Geometry = require('../geometries/Geometry');
declare var Euclidean3: any;
declare var scalarE3: (w: number, uom?: blade.Unit) => blade.Euclidean3;
declare var vectorE3: (x: number, y: number, z: number, uom?: blade.Unit) => blade.Euclidean3;
declare var bivectorE3: (xy: number, yz: number, zx: number, uom?: blade.Unit) => blade.Euclidean3;
declare var pseudoscalarE3: (xyz: number, uom?: blade.Unit) => blade.Euclidean3;

class EllipticalCylinderGeometry extends Geometry {
  constructor() {
    super();
    var s: blade.Euclidean3 = scalarE3(1);
    console.log("s: " + s);
    var m: blade.Euclidean3 = new Euclidean3(1, 2, 3, 4, 5, 6, 7, 8);
    console.log("m: " + m);
    var v: blade.Euclidean3 = vectorE3(1, 2, 3);
    console.log("v: " + v);

    var B: blade.Euclidean3 = bivectorE3(3, 4, 5);
    console.log("B: " + B);

    var I: blade.Euclidean3 = pseudoscalarE3(6);
    console.log("I: " + I);
  }
}

export = EllipticalCylinderGeometry;
