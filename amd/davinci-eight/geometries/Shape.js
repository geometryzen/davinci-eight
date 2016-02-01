var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/Path'], function (require, exports, Path_1) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.call(this);
            this.holes = [];
        }
        return Shape;
    })(Path_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Shape;
});
