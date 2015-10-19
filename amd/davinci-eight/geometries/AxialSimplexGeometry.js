var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/SimplexGeometry', '../math/Vector3'], function (require, exports, SimplexGeometry, Vector3) {
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
         * @param type {string} Used for reference count tracking.
         * @param axis {Cartesian3} The <b>axis</b> property.
         */
        function AxialSimplexGeometry(type, axis) {
            _super.call(this, type);
            this.axis = Vector3.copy(axis).normalize();
        }
        /**
         * <p>
         * Sets the <code>axis</code> property to <code>void 0</code>.
         * Calls the base class destructor method.
         * </p>
         * @method destructor
         * @return {void}
         * @protected
         */
        AxialSimplexGeometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return AxialSimplexGeometry;
    })(SimplexGeometry);
    return AxialSimplexGeometry;
});
