var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    var StockTicker = (function (_super) {
        __extends(StockTicker, _super);
        function StockTicker() {
            _super.call(this, 'StockTicker');
            this.price = Math.PI;
        }
        StockTicker.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniform1f('uStockTicker', this.price, canvasId);
        };
        return StockTicker;
    })(Shareable);
    return StockTicker;
});
