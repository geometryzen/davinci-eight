import { isDefined } from '../checks/isDefined';
import { mustBeArray } from '../checks/mustBeArray';

/**
 * @hidden
 */
function isLabelOne(label: (string | string[])): boolean {
    if (typeof label === 'string') {
        return label === "1";
    }
    else {
        const labels = mustBeArray('label', label);
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

/**
 * @hidden
 */
function appendLabel(coord: number, label: (string | string[]), sb: string[]): void {
    if (typeof label === 'string') {
        sb.push(label);
    }
    else {
        const labels = mustBeArray('label', label);
        if (labels.length === 2) {
            sb.push(coord > 0 ? labels[1] : labels[0]);
        }
        else if (labels.length === 1) {
            sb.push(labels[0]);
        }
        else if (labels.length === 0) {
            // Do nothing.
        }
        else {
            throw new Error("Unexpected basis label array length: " + labels.length);
        }
    }
}

/**
 * @hidden
 */
function appendCoord(coord: number, numberToString: (x: number) => string, label: (string | string[]), sb: string[]): void {
    if (coord !== 0) {
        if (coord >= 0) {
            if (sb.length > 0) {
                sb.push("+");
            }
        }
        else {
            // The coordinate is negative.
            if (typeof label === 'string') {
                // There's only one label, we must use minus signs.
                sb.push("-");
            }
            else {
                const labels = mustBeArray('label', label);
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
                    // This could be considered an error, but we'll let appendLabel deal with it!
                    sb.push("-");
                }
            }
        }
        const n = Math.abs(coord);
        if (n === 1) {
            // 1 times something is just 1, so we only need the label.
            appendLabel(coord, label, sb);
        }
        else {
            sb.push(numberToString(n));
            if (!isLabelOne(label)) {
                sb.push("*");
                appendLabel(coord, label, sb);
            }
            else {
                // 1 times anything is just the thing.
                // We don't need the scalar label, but maybe we might?
            }
        }
    }
    else {
        // Do nothing if the coordinate is zero.
    }
}

/**
 * @hidden
 */
export function stringFromCoordinates(coordinates: number[], numberToString: (x: number) => string, labels: (string | string[])[]): string {
    const sb: string[] = [];
    for (let i = 0, iLength = coordinates.length; i < iLength; i++) {
        const coord = coordinates[i];
        if (isDefined(coord)) {
            appendCoord(coord, numberToString, labels[i], sb);
        }
        else {
            // We'll just say that the whole thing is undefined.
            return void 0;
        }
    }
    return sb.length > 0 ? sb.join("") : "0";
}
