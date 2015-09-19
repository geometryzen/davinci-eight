define(["require", "exports"], function (require, exports) {
    var StockTicker = (function () {
        function StockTicker() {
            this.price = Math.PI;
        }
        StockTicker.prototype.accept = function (visitor) {
            visitor.uniform1f('uStockTicker', this.price);
        };
        return StockTicker;
    })();
    return StockTicker;
});
