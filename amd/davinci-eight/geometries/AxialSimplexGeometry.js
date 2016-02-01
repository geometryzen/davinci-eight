var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../checks/mustBeObject', '../geometries/SimplexGeometry'], function (require, exports, CartesianE3_1, mustBeObject_1, SimplexGeometry_1) {
    var AxialSimplexGeometry = (function (_super) {
        __extends(AxialSimplexGeometry, _super);
        function AxialSimplexGeometry(axis) {
            _super.call(this);
            this.setAxis(axis);
        }
        AxialSimplexGeometry.prototype.setAxis = function (axis) {
            mustBeObject_1.default('axis', axis);
            this.axis = CartesianE3_1.default.direction(axis);
            return this;
        };
        AxialSimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        AxialSimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return AxialSimplexGeometry;
    })(SimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AxialSimplexGeometry;
});
