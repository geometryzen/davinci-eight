define(["require", "exports", '../math/CartesianE3', '../checks/mustBeBoolean', '../checks/mustBeObject'], function (require, exports, CartesianE3_1, mustBeBoolean_1, mustBeObject_1) {
    var Geometry = (function () {
        function Geometry() {
            this._position = CartesianE3_1.default.zero;
            this.useTextureCoords = false;
        }
        Object.defineProperty(Geometry.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (position) {
                this.setPosition(position);
            },
            enumerable: true,
            configurable: true
        });
        Geometry.prototype.enableTextureCoords = function (enable) {
            mustBeBoolean_1.default('enable', enable);
            this.useTextureCoords = enable;
            return this;
        };
        Geometry.prototype.setPosition = function (position) {
            mustBeObject_1.default('position', position);
            this._position = CartesianE3_1.default.fromVectorE3(position);
            return this;
        };
        Geometry.prototype.toPrimitives = function () {
            console.warn("Geometry.toPrimitives() must be implemented by derived classes.");
            return [];
        };
        return Geometry;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Geometry;
});
