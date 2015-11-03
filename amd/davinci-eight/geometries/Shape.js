var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/Path'], function (require, exports, Path) {
    /**
     * @class Shape
     */
    var Shape = (function (_super) {
        __extends(Shape, _super);
        /**
         * @class Shape
         * @constructor
         */
        function Shape() {
            _super.call(this);
            this.holes = [];
        }
        return Shape;
    })(Path);
    return Shape;
});
