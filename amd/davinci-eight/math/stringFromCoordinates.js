define(["require", "exports", '../checks/isDefined', '../checks/mustBeArray'], function (require, exports, isDefined_1, mustBeArray_1) {
    function isLabelOne(label) {
        if (typeof label === 'string') {
            return label === "1";
        }
        else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                return isLabelOne(labels[0]) && isLabelOne(labels[1]);
            }
            else if (labels.length === 1) {
                return isLabelOne(labels[0]);
            }
            else {
                return false;
            }
        }
    }
    function appendLabel(coord, label, sb) {
        if (typeof label === 'string') {
            sb.push(label);
        }
        else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                sb.push(coord > 0 ? labels[1] : labels[0]);
            }
            else if (labels.length === 1) {
                sb.push(labels[0]);
            }
            else if (labels.length === 0) {
            }
            else {
                throw new Error("Unexpected basis label array length: " + labels.length);
            }
        }
    }
    function appendCoord(coord, numberToString, label, sb) {
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            }
            else {
                if (typeof label === 'string') {
                    sb.push("-");
                }
                else {
                    var labels = mustBeArray_1.default('label', label);
                    if (labels.length === 2) {
                        if (labels[0] !== labels[1]) {
                            if (sb.length > 0) {
                                sb.push("+");
                            }
                        }
                        else {
                            sb.push("-");
                        }
                    }
                    else if (labels.length === 1) {
                        sb.push("-");
                    }
                    else {
                        sb.push("-");
                    }
                }
            }
            var n = Math.abs(coord);
            if (n === 1) {
                appendLabel(coord, label, sb);
            }
            else {
                sb.push(numberToString(n));
                if (!isLabelOne(label)) {
                    sb.push("*");
                    appendLabel(coord, label, sb);
                }
                else {
                }
            }
        }
        else {
        }
    }
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var sb = [];
        for (var i = 0, iLength = coordinates.length; i < iLength; i++) {
            var coord = coordinates[i];
            if (isDefined_1.default(coord)) {
                appendCoord(coord, numberToString, labels[i], sb);
            }
            else {
                return void 0;
            }
        }
        return sb.length > 0 ? sb.join("") : "0";
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = stringFromCoordinates;
});
