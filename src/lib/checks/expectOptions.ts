import { mustBeArray } from './mustBeArray';
/**
 * Determines whether the actual options supplied are expected.
 *
 * Usage:
 * 
 * expectOptions(['foo', 'bar'], Object.keys(options));
 * 
 */
export function expectOptions(expects: string[], actuals: string[]): void {
    mustBeArray('expects', expects);
    mustBeArray('actuals', actuals);
    const iLength = actuals.length;
    for (let i = 0; i < iLength; i++) {
        const actual = actuals[i];
        if (expects.indexOf(actual) < 0) {
            throw new Error(`${actual} is not one of the expected options: ${JSON.stringify(expects, null, 2)}.`);
        }
    }
}
