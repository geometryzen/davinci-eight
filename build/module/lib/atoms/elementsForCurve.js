import { isDefined } from '../checks/isDefined';
import { mustBeArray } from '../checks/mustBeArray';
import { numPostsForFence } from './numPostsForFence';
export function elementsForCurve(uSegments, uClosed, elements) {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined(elements) ? mustBeArray('elements', elements) : [];
    // The number of fence posts depends upon whether the curve is open or closed.
    var uLength = numPostsForFence(uSegments, uClosed);
    for (var u = 0; u < uLength; u++) {
        elements.push(u);
    }
    return elements;
}
