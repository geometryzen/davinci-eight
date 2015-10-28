import isDefined = require('../checks/isDefined')
import mustBeNumber = require('../checks/mustBeNumber')

function stringFromCoordinates(
    coordinates: number[],
    numberToString: (x: number) => string,
    labels: string[]): string {
    var i: number, _i: number, _ref: number;
    var str: string;
    var sb: string[] = [];
    var append = function(coord: number, label: string): void {
        var n: number;
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            } else {
                sb.push("-");
            }
            n = Math.abs(coord);
            if (n === 1) {
                sb.push(label);
            } else {
                sb.push(numberToString(n));
                if (label !== "1") {
                    sb.push("*");
                    sb.push(label);
                }
            }
        }
    };
    for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        var coord = coordinates[i]
        if (isDefined(coord)) {
            append(coord, labels[i]);
        }
        else {
            // We'll just say that the whole thing is undefined.
            return void 0
        }
    }
    if (sb.length > 0) {
        str = sb.join("");
    } else {
        str = "0";
    }
    return str;
}
export = stringFromCoordinates