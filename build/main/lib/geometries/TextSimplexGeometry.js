"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// import generateTextShapes from '../geometries/generateTextShapes';
// import ExtrudeSimplexGeometry from '../geometries/ExtrudeSimplexGeometry')
var SimplexPrimitivesBuilder_1 = require("../geometries/SimplexPrimitivesBuilder");
/*
function futzParameters(parameters: { amount?: number; bevelEnabled?: boolean, bevelSize?: number, bevelThickness?: number; height?: number }) {

    parameters.amount = parameters.height !== undefined ? parameters.height : 50

    // defaults

    if (parameters.bevelThickness === undefined) parameters.bevelThickness = 10
    if (parameters.bevelSize === undefined) parameters.bevelSize = 8
    if (parameters.bevelEnabled === undefined) parameters.bevelEnabled = false

    return parameters
}
*/
var TextSimplexGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(TextSimplexGeometry, _super);
    function TextSimplexGeometry(text, face, parameters) {
        return _super.call(this) || this;
        // var shapes = generateTextShapes(text, face, parameters)
        //    super(generateTextShapes(text, parameters), parameters, 'TextSimplexGeometry')
    }
    return TextSimplexGeometry;
}(/*Extrude*/ SimplexPrimitivesBuilder_1.SimplexPrimitivesBuilder));
exports.TextSimplexGeometry = TextSimplexGeometry;
