define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var i, _i, _ref;
        var str;
        var sb = [];
        var append = function (coord, label) {
            var n;
            if (coord !== 0) {
                if (coord >= 0) {
                    if (sb.length > 0) {
                        sb.push("+");
                    }
                }
                else {
                    sb.push("-");
                }
                n = Math.abs(coord);
                if (n === 1) {
                    sb.push(label);
                }
                else {
                    sb.push(numberToString(n));
                    if (label !== "1") {
                        sb.push("*");
                        sb.push(label);
                    }
                }
            }
        };
        for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            var coord = coordinates[i];
            if (isDefined(coord)) {
                append(coord, labels[i]);
            }
            else {
                // We'll just say that the whole thing is undefined.
                return void 0;
            }
        }
        if (sb.length > 0) {
            str = sb.join("");
        }
        else {
            str = "0";
        }
        return str;
    }
    return stringFromCoordinates;
});
