"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeStringMapList(ms) {
    var result = {};
    ms.forEach(function (m) {
        var keys = Object.keys(m);
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var value = m[key];
            result[key] = value;
        }
    });
    return result;
}
exports.mergeStringMapList = mergeStringMapList;
