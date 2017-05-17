import { mustBeArray } from './mustBeArray';
/**
 * Determines whether the actual options supplied are expected.
 *
 * Usage:
 *
 * expectOptions(['foo', 'bar'], Object.keys(options));
 *
 */
export function expectOptions(expects, actuals) {
    mustBeArray('expects', expects);
    mustBeArray('actuals', actuals);
    var iLength = actuals.length;
    for (var i = 0; i < iLength; i++) {
        var actual = actuals[i];
        if (expects.indexOf(actual) < 0) {
            throw new Error(actual + " is not one of the expected options: " + JSON.stringify(expects, null, 2) + ".");
        }
    }
}
