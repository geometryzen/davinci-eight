"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts the angle specified into one in the closed interval [0, Math.PI]
 */
function principalAngle(angle) {
    if (angle > 2 * Math.PI) {
        return principalAngle(angle - 2 * Math.PI);
    }
    else if (angle < 0) {
        return principalAngle(angle + 2 * Math.PI);
    }
    else {
        return angle;
    }
}
exports.principalAngle = principalAngle;
