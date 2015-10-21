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
        function AxialGeometry() {
            _super.call(this);
            /**
             * @property _sliceAngle
             * @type {number}
             * @private
             */
            this._sliceAngle = 2 * Math.PI;
            this._axis = Vector3.e2.clone();
            this._sliceStart = Vector3.e1.clone();
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
                this.setAxis(axis);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAxis
         * @param axis {Cartesian3}
         * @return {AxialGeometry}
         * @chainable
         */
        AxialGeometry.prototype.setAxis = function (axis) {
            mustBeObject('axis', axis);
            this._axis.copy(axis).normalize();
            // FIXME: randomize
            this._sliceStart.copy(Vector3.random()).cross(this._axis).normalize();
            return this;
        };
        Object.defineProperty(AxialGeometry.prototype, "sliceAngle", {
            /**
             * @property sliceAngle
             * @type {number}
             * @default 2 * Math.PI
             */
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
        /**
         * @method setPosition
         * @param position {Cartesian3}
         * @return {AxialGeometry}
         * @chainable
         */
        AxialGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {AxialGeometry}
         */
        AxialGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return AxialGeometry;
    })(Geometry);
    return AxialGeometry;
});
