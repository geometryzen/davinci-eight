var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialSimplexGeometry', '../checks/isDefined', '../checks/mustBeNumber', '../math/R3'], function (require, exports, AxialSimplexGeometry, isDefined, mustBeNumber, R3) {
    function perpendicular(axis) {
        return R3.random().cross(axis).normalize();
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
         * @param axis [VectorE3 = R3.e3] The <code>axis</code> property.
         * @param sliceStart [VectorE3] The <code>sliceStart</code> property.
         * @param sliceAngle [number = 2 * Math.PI] The <code>sliceAngle</code> property.
         */
        function SliceSimplexGeometry(axis, sliceStart, sliceAngle) {
            if (axis === void 0) { axis = R3.e3; }
            if (sliceAngle === void 0) { sliceAngle = 2 * Math.PI; }
            _super.call(this, axis);
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
                this.sliceStart = R3.copy(sliceStart).normalize();
            }
            else {
                this.sliceStart = perpendicular(this.axis);
            }
            this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        }
        return SliceSimplexGeometry;
    })(AxialSimplexGeometry);
    return SliceSimplexGeometry;
});
