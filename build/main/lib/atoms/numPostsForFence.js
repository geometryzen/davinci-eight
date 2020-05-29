"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numPostsForFence = void 0;
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeInteger_1 = require("../checks/mustBeInteger");
/**
 * Computes the number of posts to build a fence from the number of segments.
 */
function numPostsForFence(segmentCount, closed) {
    mustBeInteger_1.mustBeInteger('segmentCount', segmentCount);
    mustBeGE_1.mustBeGE('segmentCount', segmentCount, 0);
    mustBeBoolean_1.mustBeBoolean('closed', closed);
    return closed ? segmentCount : segmentCount + 1;
}
exports.numPostsForFence = numPostsForFence;
