var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/DrawMode', '../topologies/Topology'], function (require, exports, DrawMode_1, Topology_1) {
    var PointTopology = (function (_super) {
        __extends(PointTopology, _super);
        function PointTopology(numVertices) {
            _super.call(this, DrawMode_1.default.POINTS, numVertices);
        }
        return PointTopology;
    })(Topology_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointTopology;
});
