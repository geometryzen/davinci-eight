"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVariableName = void 0;
function isVariableName(name) {
    if (typeof name === 'string') {
        if (name.length > 0) {
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
exports.isVariableName = isVariableName;
