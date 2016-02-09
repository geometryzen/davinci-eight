var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/SimplexPrimitivesBuilder'], function (require, exports, SimplexPrimitivesBuilder_1) {
    var TextSimplexGeometry = (function (_super) {
        __extends(TextSimplexGeometry, _super);
        function TextSimplexGeometry(text, face, parameters) {
            _super.call(this);
        }
        return TextSimplexGeometry;
    })(SimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextSimplexGeometry;
});
