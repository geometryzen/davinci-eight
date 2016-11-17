import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeInteger from '../checks/mustBeInteger';

const LINE = 1;
const TRIANGLE = 2;

/**
 * Converts from a wireFrame option to a simplex k-value.
 * We also support a k value for backwards compatibility.
 */
export default function kFromOptions(options?: { wireFrame?: boolean; k?: number }): number {
    if (isDefined(options)) {
        if (isDefined(options.wireFrame)) {
            return mustBeBoolean('wireFrame', options.wireFrame) ? LINE : TRIANGLE;
        }
        else if (isDefined(options.k)) {
            return mustBeInteger('k', options.k);
        }
        else {
            // In the absence of any hints to the contrary we assume...
            return TRIANGLE;
        }
    }
    else {
        return TRIANGLE;
    }
}
