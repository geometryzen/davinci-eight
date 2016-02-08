var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../programs/fragmentShader', '../core/Material', '../programs/vertexShader'], function (require, exports, fragmentShader_1, Material_1, vertexShader_1) {
    var SmartGraphicsProgram = (function (_super) {
        __extends(SmartGraphicsProgram, _super);
        function SmartGraphicsProgram(aParams, uParams, vColor, vLight) {
            _super.call(this, vertexShader_1.default(aParams, uParams, vColor, vLight), fragmentShader_1.default(aParams, uParams, vColor, vLight));
        }
        return SmartGraphicsProgram;
    })(Material_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SmartGraphicsProgram;
});
