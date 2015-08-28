// When using amd-dependency, you must know the file structure of the library being used.
// You must declare a variable for each dependency.
// You may type your variables.
// Be careful to only use the type declarations in type positions that will be erased.
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <amd-dependency path="davinci-blade/e3ga/Euclidean3" name="Euclidean3"/>
/// <amd-dependency path="davinci-blade/e3ga/scalarE3" name="scalarE3"/>
/// <amd-dependency path="davinci-blade/e3ga/vectorE3" name="vectorE3"/>
/// <amd-dependency path="davinci-blade/e3ga/bivectorE3" name="bivectorE3"/>
/// <amd-dependency path="davinci-blade/e3ga/pseudoscalarE3" name="pseudoscalarE3"/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var Geometry = require('../geometries/Geometry');
var EllipticalCylinderGeometry = (function (_super) {
    __extends(EllipticalCylinderGeometry, _super);
    function EllipticalCylinderGeometry() {
        _super.call(this);
        var s = scalarE3(1);
        console.log("s: " + s);
        var m = new Euclidean3(1, 2, 3, 4, 5, 6, 7, 8);
        console.log("m: " + m);
        var v = vectorE3(1, 2, 3);
        console.log("v: " + v);
        var B = bivectorE3(3, 4, 5);
        console.log("B: " + B);
        var I = pseudoscalarE3(6);
        console.log("I: " + I);
    }
    return EllipticalCylinderGeometry;
})(Geometry);
module.exports = EllipticalCylinderGeometry;
