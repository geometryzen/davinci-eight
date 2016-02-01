define(["require", "exports", '../geometries/DrawAttribute', '../geometries/DrawPrimitive', '../checks/mustBeInteger', '../geometries/Vertex', '../geometries/dataFromVectorN'], function (require, exports, DrawAttribute_1, DrawPrimitive_1, mustBeInteger_1, Vertex_1, dataFromVectorN_1) {
    function attributes(elements, vertices) {
        var attribs = {};
        for (var vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
            var vertex = vertices[vertexIndex];
            var names = Object.keys(vertex.attributes);
            for (var namesIndex = 0; namesIndex < names.length; namesIndex++) {
                var name = names[namesIndex];
                var data = dataFromVectorN_1.default(vertex.attributes[name]);
                var size = data.length;
                var attrib = attribs[name];
                if (!attrib) {
                    attrib = attribs[name] = new DrawAttribute_1.default([], size);
                }
                for (var coordIndex = 0; coordIndex < size; coordIndex++) {
                    attrib.values.push(data[coordIndex]);
                }
            }
        }
        return attribs;
    }
    var Topology = (function () {
        function Topology(mode, numVertices) {
            this.mode = mustBeInteger_1.default('mode', mode);
            mustBeInteger_1.default('numVertices', numVertices);
            this.vertices = [];
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex_1.default());
            }
        }
        Topology.prototype.toDrawPrimitive = function () {
            return new DrawPrimitive_1.default(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        return Topology;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Topology;
});
