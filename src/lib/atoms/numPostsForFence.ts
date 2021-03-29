import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';

/**
 * Computes the number of posts to build a fence from the number of segments.
 * @hidden
 */
export function numPostsForFence(segmentCount: number, closed: boolean): number {
    mustBeInteger('segmentCount', segmentCount);
    mustBeGE('segmentCount', segmentCount, 0);
    mustBeBoolean('closed', closed);
    return closed ? segmentCount : segmentCount + 1;
}
