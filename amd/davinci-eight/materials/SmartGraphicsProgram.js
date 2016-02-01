var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../programs/createGraphicsProgram', '../programs/fragmentShader', '../materials/GraphicsProgram', '../i18n/readOnly', '../programs/vertexShader'], function (require, exports, createGraphicsProgram_1, fragmentShader_1, GraphicsProgram_1, readOnly_1, vertexShader_1) {
    var SmartGraphicsProgram = (function (_super) {
        __extends(SmartGraphicsProgram, _super);
        function SmartGraphicsProgram(aParams, uParams, vColor, vLight, contexts) {
            _super.call(this, 'SmartGraphicsProgram', contexts);
            this.aParams = {};
            this.uParams = {};
            this.vColor = false;
            this.vLight = false;
            this.aParams = aParams;
            this.uParams = uParams;
            this.vColor = vColor;
            this.vLight = vLight;
            this.makeReady(false);
        }
        SmartGraphicsProgram.prototype.createGraphicsProgram = function () {
            var bindings = [];
            var vs = this.vertexShader;
            var fs = this.fragmentShader;
            return createGraphicsProgram_1.default(this.monitors, vs, fs, bindings);
        };
        Object.defineProperty(SmartGraphicsProgram.prototype, "vertexShader", {
            get: function () {
                return vertexShader_1.default(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('vertexShader').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartGraphicsProgram.prototype, "fragmentShader", {
            get: function () {
                return fragmentShader_1.default(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('fragmentShader').message);
            },
            enumerable: true,
            configurable: true
        });
        return SmartGraphicsProgram;
    })(GraphicsProgram_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SmartGraphicsProgram;
});
