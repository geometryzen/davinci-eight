var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../checks/mustBeObject', '../math/Vector3', '../geometries/Geometry'], function (require, exports, mustBeNumber, mustBeObject, Vector3, Geometry) {
    /**
     * @class AxialGeometry
     */
    var AxialGeometry = (function (_super) {
        __extends(AxialGeometry, _super);
        /**
         * @class SliceGeometry
         * @constructor
         */
        /**
         * @class AxialGeometry
         * @constructor
         */
        function AxialGeometry() {
            _super.call(this);
            /**
             * @property _axis
             * @type {Vector3}
             * @protected
             */
            this._axis = Vector3.e3.clone();
            /**
             * @property _sliceAngle
             * @type {number}
             * @private
             */
            this._sliceAngle = 2 * Math.PI;
            /**
             * @property _sliceStart
             * @type {Vector3}
             * @private
             */
            this._sliceStart = Vector3.e3.clone();
        }
        Object.defineProperty(AxialGeometry.prototype, "axis", {
            /**
             * @property axis
             * @type {Cartesian3}
             */
            get: function () {
                return this._axis.clone();
            },
            set: function (axis) {
                mustBeObject('axis', axis);
                this._axis.copy(axis).normalize();
                this._sliceStart = Vector3.random().cross(this._axis).normalize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AxialGeometry.prototype, "sliceAngle", {
            get: function () {
                return this._sliceAngle;
            },
            set: function (sliceAngle) {
                mustBeNumber('sliceAngle', sliceAngle);
                this._sliceAngle = sliceAngle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AxialGeometry.prototype, "sliceStart", {
            /**
             * The (unit vector) direction of the start of the slice.
             * @property sliceStart
             * @type {Cartesian3}
             */
            get: function () {
                return this._sliceStart.clone();
            },
            set: function (sliceStart) {
                mustBeObject('sliceStart', sliceStart);
                this._sliceStart.copy(sliceStart).normalize();
            },
            enumerable: true,
            configurable: true
        });
        return AxialGeometry;
    })(Geometry);
    return AxialGeometry;
});
