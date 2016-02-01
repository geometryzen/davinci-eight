define(["require", "exports", '../math/stringFromCoordinates'], function (require, exports, stringFromCoordinates_1) {
    function toStringCustom(coordinates, uom, coordToString, labels) {
        var quantityString = stringFromCoordinates_1.default(coordinates, coordToString, labels);
        if (uom) {
            var unitString = uom.toString().trim();
            if (unitString) {
                return quantityString + ' ' + unitString;
            }
            else {
                return quantityString;
            }
        }
        else {
            return quantityString;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = toStringCustom;
});
