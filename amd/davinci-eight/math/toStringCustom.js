define(["require", "exports", '../math/stringFromCoordinates'], function (require, exports, stringFromCoordinates) {
    function toStringCustom(coordinates, uom, coordToString, labels) {
        var quantityString = stringFromCoordinates(coordinates, coordToString, labels);
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
    return toStringCustom;
});
