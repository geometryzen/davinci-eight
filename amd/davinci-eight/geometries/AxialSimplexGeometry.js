var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../checks/mustBeObject', '../geometries/SimplexGeometry'], function (require, exports, CartesianE3, mustBeObject, SimplexGeometry) {
    /**
     * @class AxialSimplexGeometry
     * @extends SimplexGeometry
     */
    var AxialSimplexGeometry = (function (_super) {
        __extends(AxialSimplexGeometry, _super);
        /**
         * <p>
         * A geometry which has axial symmetry, giving it an <code>axis</code> property.
         * </p>
         * <p>
         * Calls the base class constructor.
         * Provides the <code>type</code> to the <code>SimplexGeometry</code> base class.
         * Makes a copy of the axis, normalizes the copy and initializes the <code>axis</axis> property.
         * </p>
         * @class AxialSimplexGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         */
        function AxialSimplexGeometry(axis) {
            _super.call(this);
            this.setAxis(axis);
        }
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {AxialSimplexGeometry}
         * @chainable
         */
        AxialSimplexGeometry.prototype.setAxis = function (axis) {
            mustBeObject('axis', axis);
            this.axis = CartesianE3.direction(axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {AxialSimplexGeometry}
         * @chainable
         */
        AxialSimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {AxialSimplexGeometry}
         * @chainable
         */
        AxialSimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return AxialSimplexGeometry;
    })(SimplexGeometry);
    return AxialSimplexGeometry;
});
