var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../topologies/Topology'], function (require, exports, Topology_1) {
    var MeshTopology = (function (_super) {
        __extends(MeshTopology, _super);
        function MeshTopology(mode, numVertices) {
            _super.call(this, mode, numVertices);
        }
        return MeshTopology;
    })(Topology_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MeshTopology;
});
