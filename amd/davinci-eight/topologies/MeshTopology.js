var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../topologies/Topology'], function (require, exports, Topology) {
    /**
     * @class MeshTopology
     * @extends Topology
     */
    var MeshTopology = (function (_super) {
        __extends(MeshTopology, _super);
        /**
         * Abstract base class for topologies rendered using TRIANGLES, TRIANGLE_STRIP and TRIANGLE_FAN.
         * @class MeshTopology
         * @constructor
         * @param mode {DrawMode}
         * @param numVertices {number}
         */
        function MeshTopology(mode, numVertices) {
            _super.call(this, mode, numVertices);
        }
        return MeshTopology;
    })(Topology);
    return MeshTopology;
});
