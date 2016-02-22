define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeString', '../math/Geometric3', '../math/Matrix4', '../i18n/readOnly'], function (require, exports, mustBeArray_1, mustBeString_1, Geometric3_1, Matrix4_1, readOnly_1) {
    var ReflectionFacetE3 = (function () {
        function ReflectionFacetE3(name) {
            this.matrix = Matrix4_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = Geometric3_1.default.zero();
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('normal').message);
            },
            enumerable: true,
            configurable: true
        });
        ReflectionFacetE3.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            return void 0;
        };
        ReflectionFacetE3.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('value', value);
            return this;
        };
        ReflectionFacetE3.prototype.setUniforms = function (visitor) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat4(this.name, this.matrix, false);
        };
        return ReflectionFacetE3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE3;
});
