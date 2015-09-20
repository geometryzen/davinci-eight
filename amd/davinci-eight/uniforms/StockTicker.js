define(["require", "exports"], function (require, exports) {
    var StockTicker = (function () {
        function StockTicker() {
            this.price = Math.PI;
        }
        StockTicker.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniform1f('uStockTicker', this.price, canvasId);
        };
        return StockTicker;
    })();
    return StockTicker;
});
