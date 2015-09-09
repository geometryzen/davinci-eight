import LineVertex = require('../dfx/LineVertex');
declare class Line {
    a: LineVertex;
    b: LineVertex;
    /**
     * @class Line
     * @constructor
     * @param a {LineVertex}
     * @param b {LineVertex}
     */
    constructor(a: LineVertex, b: LineVertex);
}
export = Line;
