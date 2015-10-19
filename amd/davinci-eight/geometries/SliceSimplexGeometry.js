var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialSimplexGeometry', '../checks/isDefined', '../checks/mustBeNumber', '../math/Vector3'], function (require, exports, AxialSimplexGeometry, isDefined, mustBeNumber, Vector3) {
    function perpendicular(axis) {
        return Vector3.random().cross(axis).normalize();
    }
    /**
     * @class SliceSimplexGeometry
     * @extends AxialSimplexGeometry
     */
    var SliceSimplexGeometry = (function (_super) {
        __extends(SliceSimplexGeometry, _super);
        /**
         * <p>
         * Calls the base class constructor.
         * </p>
         * <p>
         * Provides the <code>axis</code> to the <code>AxialSimplexGeometry</code> base class.
         * </p>
         * <p>
         * Provides the <code>type</code> to the <code>AxialSimplexGeometry</code> base class.
         * </p>
         * @class SliceSimplexGeometry
         * @constructor
         * @param type {string} Implementations must provide a type name used for reference count tracking.
         * @param axis [Cartesian3 = Vector3.e3] The <code>axis</code> property.
         * @param sliceStart [Cartesian3] The <code>sliceStart</code> property.
         * @param sliceAngle [number = 2 * Math.PI] The <code>sliceAngle</code> property.
         */
        function SliceSimplexGeometry(type, axis, sliceStart, sliceAngle) {
            if (axis === void 0) { axis = Vector3.e3; }
            if (sliceAngle === void 0) { sliceAngle = 2 * Math.PI; }
            _super.call(this, type, axis);
            /**
             * <p>
             * The angle of the slice, measured in radians.
             * </p>
             * @property sliceAngle
             * @type {number}
             */
            this.sliceAngle = 2 * Math.PI;
            if (isDefined(sliceStart)) {
                // TODO: Verify that sliceStart is orthogonal to axis.
                this.sliceStart = Vector3.copy(sliceStart).normalize();
            }
            else {
                this.sliceStart = perpendicular(this.axis);
            }
            this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        }
        /**
         * <p>
         * Calls the base class destructor method.
         * </p>
         * @method destructor
         * @return {void}
         * @protected
         */
        SliceSimplexGeometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return SliceSimplexGeometry;
    })(AxialSimplexGeometry);
    return SliceSimplexGeometry;
});
