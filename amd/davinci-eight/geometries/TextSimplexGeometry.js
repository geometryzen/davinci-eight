var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/generateTextShapes', '../geometries/SimplexGeometry'], function (require, exports, generateTextShapes, SimplexGeometry) {
    function futzParameters(parameters) {
        parameters.amount = parameters.height !== undefined ? parameters.height : 50;
        // defaults
        if (parameters.bevelThickness === undefined)
            parameters.bevelThickness = 10;
        if (parameters.bevelSize === undefined)
            parameters.bevelSize = 8;
        if (parameters.bevelEnabled === undefined)
            parameters.bevelEnabled = false;
        return parameters;
    }
    /**
     * Intentionally undocumented
     */
    var TextSimplexGeometry = (function (_super) {
        __extends(TextSimplexGeometry, _super);
        function TextSimplexGeometry(text, face, parameters) {
            _super.call(this);
            var shapes = generateTextShapes(text, face, parameters);
            //    super(generateTextShapes(text, parameters), parameters, 'TextSimplexGeometry')
        }
        return TextSimplexGeometry;
    })(SimplexGeometry);
    return TextSimplexGeometry;
});
