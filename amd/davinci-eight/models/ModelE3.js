var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeString', '../math/G3', '../math/R3', '../math/SpinG3', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeString_1, G3_1, R3_1, SpinG3_1, readOnly_1, Shareable_1) {
    var ModelE3 = (function (_super) {
        __extends(ModelE3, _super);
        function ModelE3(type) {
            if (type === void 0) { type = 'ModelE3'; }
            _super.call(this, mustBeString_1.default('type', type));
            this._position = new G3_1.default().zero();
            this._attitude = new G3_1.default().zero().addScalar(1);
            this._posCache = new R3_1.default();
            this._attCache = new SpinG3_1.default();
            this._position.modified = true;
            this._attitude.modified = true;
        }
        ModelE3.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelE3.prototype, "R", {
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default(ModelE3.PROP_ATTITUDE).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE3.prototype, "X", {
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default(ModelE3.PROP_POSITION).message);
            },
            enumerable: true,
            configurable: true
        });
        ModelE3.prototype.getProperty = function (name) {
            switch (name) {
                case ModelE3.PROP_ATTITUDE: {
                    return this._attCache.copy(this._attitude).coords;
                }
                case ModelE3.PROP_POSITION: {
                    return this._posCache.copy(this._position).coords;
                }
                default: {
                    console.warn("ModelE3.getProperty " + name);
                    return void 0;
                }
            }
        };
        ModelE3.prototype.setProperty = function (name, data) {
            switch (name) {
                case ModelE3.PROP_ATTITUDE:
                    {
                        this._attCache.coords = data;
                        this._attitude.copySpinor(this._attCache);
                    }
                    break;
                case ModelE3.PROP_POSITION:
                    {
                        this._posCache.coords = data;
                        this._position.copyVector(this._posCache);
                    }
                    break;
                default: {
                    console.warn("ModelE3.setProperty " + name);
                }
            }
        };
        ModelE3.PROP_ATTITUDE = 'R';
        ModelE3.PROP_POSITION = 'X';
        return ModelE3;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModelE3;
});
