var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../topologies/Topology'], function (require, exports, Topology_1) {
    var LineTopology = (function (_super) {
        __extends(LineTopology, _super);
        function LineTopology(mode, numVertices) {
            _super.call(this, mode, numVertices);
        }
        return LineTopology;
    })(Topology_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LineTopology;
});
