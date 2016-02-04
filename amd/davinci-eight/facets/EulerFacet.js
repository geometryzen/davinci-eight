var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../i18n/readOnly', '../utils/Shareable', '../math/R3'], function (require, exports, readOnly_1, Shareable_1, R3_1) {
    var EulerFacet = (function (_super) {
        __extends(EulerFacet, _super);
        function EulerFacet() {
            _super.call(this, 'EulerFacet');
            this._rotation = new R3_1.default();
        }
        EulerFacet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        EulerFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        EulerFacet.prototype.setProperty = function (name, value) {
            return this;
        };
        EulerFacet.prototype.setUniforms = function (visitor) {
            console.warn("EulerFacet.setUniforms");
        };
        Object.defineProperty(EulerFacet.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('rotation').message);
            },
            enumerable: true,
            configurable: true
        });
        return EulerFacet;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EulerFacet;
});
