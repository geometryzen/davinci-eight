var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../geometries/Geometry', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/R3'], function (require, exports, CartesianE3, Geometry, mustBeNumber, mustBeObject, R3) {
    /**
     * @class AxialGeometry
     */
    var AxialGeometry = (function (_super) {
        __extends(AxialGeometry, _super);
        /**
         * @class AxialGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
         */
        function AxialGeometry(axis, sliceStart) {
            _super.call(this);
            /**
             * @property _sliceAngle
             * @type {number}
             * @private
             */
            this._sliceAngle = 2 * Math.PI;
            this.setAxis(axis);
            if (sliceStart) {
                this.setSliceStart(sliceStart);
            }
            else {
                this.setSliceStart(R3.random().cross(axis));
            }
        }
        Object.defineProperty(AxialGeometry.prototype, "axis", {
            /**
             * @property axis
             * @type {CartesianE3}
             */
            get: function () {
                return this._axis;
            },
            set: function (axis) {
                this.setAxis(axis);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {AxialGeometry}
         * @chainable
         */
        AxialGeometry.prototype.setAxis = function (axis) {
            mustBeObject('axis', axis);
            this._axis = CartesianE3.direction(axis);
            this.setSliceStart(R3.random().cross(this._axis));
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
             * @type {CartesianE3}
             */
            get: function () {
                return this._sliceStart;
            },
            set: function (sliceStart) {
                this.setSliceStart(sliceStart);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {AxialGeometry}
         * @chainable
         */
        AxialGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        AxialGeometry.prototype.setSliceStart = function (sliceStart) {
            mustBeObject('sliceStart', sliceStart);
            this._sliceStart = CartesianE3.direction(sliceStart);
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
