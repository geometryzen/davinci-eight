var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../checks/mustBeArray', '../checks/mustBeString', '../math/R3', '../math/Mat4R', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, CartesianE3_1, mustBeArray_1, mustBeString_1, R3_1, Mat4R_1, readOnly_1, Shareable_1) {
    var ReflectionFacetE3 = (function (_super) {
        __extends(ReflectionFacetE3, _super);
        function ReflectionFacetE3(name) {
            _super.call(this, 'ReflectionFacetE3');
            this.matrix = Mat4R_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = new R3_1.default().copy(CartesianE3_1.default.zero);
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
        ReflectionFacetE3.prototype.destructor = function () {
            this._normal = void 0;
            this.matrix = void 0;
            _super.prototype.destructor.call(this);
        };
        ReflectionFacetE3.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            return void 0;
        };
        ReflectionFacetE3.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('value', value);
            return this;
        };
        ReflectionFacetE3.prototype.setUniforms = function (visitor, canvasId) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat4(this.name, this.matrix, false, canvasId);
        };
        return ReflectionFacetE3;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE3;
});
