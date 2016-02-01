var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeString', '../math/R2', '../math/Mat2R', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeArray_1, mustBeString_1, R2_1, Mat2R_1, readOnly_1, Shareable_1) {
    var ReflectionFacetE2 = (function (_super) {
        __extends(ReflectionFacetE2, _super);
        function ReflectionFacetE2(name) {
            _super.call(this, 'ReflectionFacetE2');
            this.matrix = Mat2R_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = new R2_1.default().zero();
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
        ReflectionFacetE2.prototype.destructor = function () {
            this._normal = void 0;
            this.matrix = void 0;
            _super.prototype.destructor.call(this);
        };
        ReflectionFacetE2.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            return void 0;
        };
        ReflectionFacetE2.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('value', value);
        };
        ReflectionFacetE2.prototype.setUniforms = function (visitor, canvasId) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat2(this.name, this.matrix, false, canvasId);
        };
        return ReflectionFacetE2;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE2;
});
