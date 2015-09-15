define(["require", "exports", '../dfx/checkGeometry', '../dfx/computeUniqueVertices', '../dfx/DrawElements', '../dfx/DrawAttribute', '../checks/expectArg', '../dfx/Simplex', '../math/VectorN'], function (require, exports, checkGeometry, computeUniqueVertices, DrawElements, DrawAttribute, expectArg, Simplex, VectorN) {
    function numberList(size, value) {
        var data = [];
        for (var i = 0; i < size; i++) {
            data.push(value);
        }
        return data;
    }
    function attribName(name, attribMap) {
        expectArg('name', name).toBeString();
        expectArg('attribMap', attribMap).toBeObject();
        var meta = attribMap[name];
        if (meta) {
            var alias = meta.name;
            return alias ? alias : name;
        }
        else {
            throw new Error("Unable to compute name; missing attribute specification for " + name);
        }
    }
    function attribSize(key, attribMap) {
        expectArg('key', key).toBeString();
        expectArg('attribMap', attribMap).toBeObject();
        var meta = attribMap[key];
        if (meta) {
            var size = meta.size;
            // TODO: Override the message...
            expectArg('size', size).toBeNumber();
            return meta.size;
        }
        else {
            throw new Error("Unable to compute size; missing attribute specification for " + key);
        }
    }
    function concat(a, b) {
        return a.concat(b);
    }
    function toDrawElements(geometry, geometryInfo) {
        expectArg('geometry', geometry).toBeObject();
        var actuals = checkGeometry(geometry);
        if (geometryInfo) {
            expectArg('geometryInfo', geometryInfo).toBeObject();
        }
        else {
            geometryInfo = actuals;
        }
        var attribMap = geometryInfo.attributes;
        // Cache the keys and keys.length of the specified attributes and declare a loop index.
        var keys = Object.keys(attribMap);
        var keysLen = keys.length;
        var k;
        // Side effect is to set the index property, but it will be be the same as the array index. 
        var vertices = computeUniqueVertices(geometry);
        var vsLength = vertices.length;
        var i;
        // Each simplex produces as many indices as vertices.
        // This is why we need the Vertex to have an temporary index property.
        var indices = geometry.map(Simplex.indices).reduce(concat, []);
        // Create intermediate data structures for output and to cache dimensions and name.
        // For performance an an array will be used whose index is the key index.
        var outputs = [];
        for (k = 0; k < keysLen; k++) {
            var key = keys[k];
            var dims = attribSize(key, attribMap);
            var data = numberList(vsLength * dims, void 0);
            outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
        }
        // Accumulate attribute data in intermediate data structures.
        for (i = 0; i < vsLength; i++) {
            var vertex = vertices[i];
            var vertexAttribs = vertex.attributes;
            if (vertex.index !== i) {
                expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
            }
            for (k = 0; k < keysLen; k++) {
                var output = outputs[k];
                var size = output.dimensions;
                var data = vertexAttribs[keys[k]];
                if (!data) {
                    data = new VectorN(numberList(size, 0), false, size);
                }
                data.toArray(output.data, i * output.dimensions);
            }
        }
        // Copy accumulated attribute arrays to output data structure.
        var attributes = {};
        for (k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var data = output.data;
            var vector = new VectorN(data, false, data.length);
            attributes[output.name] = new DrawAttribute(vector, output.dimensions);
        }
        return new DrawElements(geometryInfo.k, new VectorN(indices, false, indices.length), attributes);
    }
    return toDrawElements;
});
