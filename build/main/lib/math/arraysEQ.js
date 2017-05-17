"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var isNull_1 = require("../checks/isNull");
var isUndefined_1 = require("../checks/isUndefined");
function arraysEQ(a, b) {
    if (isDefined_1.isDefined(a)) {
        if (isDefined_1.isDefined(b)) {
            if (!isNull_1.isNull(a)) {
                if (!isNull_1.isNull(b)) {
                    var aLen = a.length;
                    var bLen = b.length;
                    if (aLen === bLen) {
                        for (var i = 0; i < aLen; i++) {
                            if (a[i] !== b[i]) {
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return isNull_1.isNull(b);
            }
        }
        else {
            return false;
        }
    }
    else {
        return isUndefined_1.isUndefined(b);
    }
}
exports.arraysEQ = arraysEQ;
