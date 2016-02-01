var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../geometries/Geometry', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/R3'], function (require, exports, CartesianE3_1, Geometry_1, mustBeNumber_1, mustBeObject_1, R3_1) {
    var AxialGeometry = (function (_super) {
        __extends(AxialGeometry, _super);
        function AxialGeometry(axis, sliceStart) {
            _super.call(this);
            this._sliceAngle = 2 * Math.PI;
            this.setAxis(axis);
            if (sliceStart) {
                this.setSliceStart(sliceStart);
            }
            else {
                this.setSliceStart(R3_1.default.random().cross(axis));
            }
        }
        Object.defineProperty(AxialGeometry.prototype, "axis", {
            get: function () {
                return this._axis;
            },
            set: function (axis) {
                this.setAxis(axis);
            },
            enumerable: true,
            configurable: true
        });
        AxialGeometry.prototype.setAxis = function (axis) {
            mustBeObject_1.default('axis', axis);
            this._axis = CartesianE3_1.default.direction(axis);
            this.setSliceStart(R3_1.default.random().cross(this._axis));
            return this;
        };
        Object.defineProperty(AxialGeometry.prototype, "sliceAngle", {
            get: function () {
                return this._sliceAngle;
            },
            set: function (sliceAngle) {
                mustBeNumber_1.default('sliceAngle', sliceAngle);
                this._sliceAngle = sliceAngle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AxialGeometry.prototype, "sliceStart", {
            get: function () {
                return this._sliceStart;
            },
            set: function (sliceStart) {
                this.setSliceStart(sliceStart);
            },
            enumerable: true,
            configurable: true
        });
        AxialGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        AxialGeometry.prototype.setSliceStart = function (sliceStart) {
            mustBeObject_1.default('sliceStart', sliceStart);
            this._sliceStart = CartesianE3_1.default.direction(sliceStart);
        };
        AxialGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return AxialGeometry;
    })(Geometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AxialGeometry;
});
