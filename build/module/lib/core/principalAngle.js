/**
 * Converts the angle specified into one in the closed interval [0, Math.PI]
 */
export function principalAngle(angle) {
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
