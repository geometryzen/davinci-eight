"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = void 0;
function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
}
exports.isArray = isArray;
