define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeString', '../math/Vector2', '../math/Matrix2', '../i18n/readOnly'], function (require, exports, mustBeArray_1, mustBeString_1, Vector2_1, Matrix2_1, readOnly_1) {
    var ReflectionFacetE2 = (function () {
        function ReflectionFacetE2(name) {
            this.matrix = Matrix2_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = new Vector2_1.default().zero();
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('normal').message);
            },
            enumerable: true,
            configurable: true
        });
        ReflectionFacetE2.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            return void 0;
        };
        ReflectionFacetE2.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('value', value);
            return this;
        };
        ReflectionFacetE2.prototype.setUniforms = function (visitor) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat2(this.name, this.matrix, false);
        };
        return ReflectionFacetE2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE2;
});
