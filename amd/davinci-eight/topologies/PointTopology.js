var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/DrawMode', '../topologies/Topology'], function (require, exports, DrawMode, Topology) {
    /**
     * @class PointTopology
     */
    var PointTopology = (function (_super) {
        __extends(PointTopology, _super);
        /**
         * Abstract base class for geometric primitives POINTS.
         * @class PointTopology
         * @constructor
         * @param numVertices {number}
         */
        function PointTopology(numVertices) {
            _super.call(this, DrawMode.POINTS, numVertices);
        }
        return PointTopology;
    })(Topology);
    return PointTopology;
});
