define(["require", "exports", '../geometries/DrawAttribute', '../geometries/DrawPrimitive', '../checks/mustBeInteger', '../geometries/Vertex', '../geometries/dataFromVectorN'], function (require, exports, DrawAttribute, DrawPrimitive, mustBeInteger, Vertex, dataFromVectorN) {
    function attributes(elements, vertices) {
        var attribs = {};
        for (var vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
            var vertex = vertices[vertexIndex];
            var names = Object.keys(vertex.attributes);
            for (var namesIndex = 0; namesIndex < names.length; namesIndex++) {
                var name = names[namesIndex];
                var data = dataFromVectorN(vertex.attributes[name]);
                var chunkSize = data.length;
                var attrib = attribs[name];
                if (!attrib) {
                    attrib = attribs[name] = new DrawAttribute([], chunkSize);
                }
                for (var coordIndex = 0; coordIndex < chunkSize; coordIndex++) {
                    attrib.values.push(data[coordIndex]);
                }
            }
        }
        return attribs;
    }
    /**
     * @class Topology
     */
    var Topology = (function () {
        /**
         * Abstract base class for all geometric primitive types
         * @class Topology
         * @constructor
         * @param mode {DrawMode}
         * @param numVertices {number}
         */
        function Topology(mode, numVertices) {
            this.mode = mustBeInteger('mode', mode);
            mustBeInteger('numVertices', numVertices);
            this.vertices = [];
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex());
            }
        }
        /**
         * Creates the elements in a format required for WebGL.
         * This may involve creating some redundancy in order to get WebGL efficiency.
         * Thus, we should regard the topology as normalized
         * @method toDrawPrimitive
         * @return {DrawPrimitive}
         */
        Topology.prototype.toDrawPrimitive = function () {
            return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        return Topology;
    })();
    return Topology;
});
