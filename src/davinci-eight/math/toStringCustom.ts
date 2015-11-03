import stringFromCoordinates = require('../math/stringFromCoordinates')
import Unit = require('../math/Unit')

function toStringCustom(coordinates: number[], uom: Unit, coordToString: (x: number) => string, labels: string[]): string {
    var quantityString: string = stringFromCoordinates(coordinates, coordToString, labels);
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

export = toStringCustom