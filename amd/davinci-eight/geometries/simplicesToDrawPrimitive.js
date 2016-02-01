define(["require", "exports", '../collections/copyToArray', '../geometries/dataFromVectorN', '../geometries/DrawAttribute', '../core/DrawMode', '../geometries/DrawPrimitive', '../geometries/simplicesToGeometryMeta', '../geometries/computeUniqueVertices', '../checks/expectArg', '../geometries/Simplex', '../math/VectorN'], function (require, exports, copyToArray_1, dataFromVectorN_1, DrawAttribute_1, DrawMode_1, DrawPrimitive_1, simplicesToGeometryMeta_1, computeUniqueVertices_1, expectArg_1, Simplex_1, VectorN_1) {
    function numberList(size, value) {
        var data = [];
        for (var i = 0; i < size; i++) {
            data.push(value);
        }
        return data;
    }
    function attribName(name, attribMap) {
        expectArg_1.default('name', name).toBeString();
        expectArg_1.default('attribMap', attribMap).toBeObject();
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
        expectArg_1.default('key', key).toBeString();
        expectArg_1.default('attribMap', attribMap).toBeObject();
        var meta = attribMap[key];
        if (meta) {
            var size = meta.size;
            expectArg_1.default('size', size).toBeNumber();
            return meta.size;
        }
        else {
            throw new Error("Unable to compute size; missing attribute specification for " + key);
        }
    }
    function concat(a, b) {
        return a.concat(b);
    }
    function simplicesToDrawPrimitive(simplices, geometryMeta) {
        expectArg_1.default('simplices', simplices).toBeObject();
        var actuals = simplicesToGeometryMeta_1.default(simplices);
        if (geometryMeta) {
            expectArg_1.default('geometryMeta', geometryMeta).toBeObject();
        }
        else {
            geometryMeta = actuals;
        }
        var attribMap = geometryMeta.attributes;
        var keys = Object.keys(attribMap);
        var keysLen = keys.length;
        var k;
        var vertices = computeUniqueVertices_1.default(simplices);
        var vsLength = vertices.length;
        var i;
        var indices = simplices.map(Simplex_1.default.indices).reduce(concat, []);
        var outputs = [];
        for (k = 0; k < keysLen; k++) {
            var key = keys[k];
            var dims = attribSize(key, attribMap);
            var data = numberList(vsLength * dims, void 0);
            outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
        }
        for (i = 0; i < vsLength; i++) {
            var vertex = vertices[i];
            var vertexAttribs = vertex.attributes;
            if (vertex.index !== i) {
                expectArg_1.default('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
            }
            for (k = 0; k < keysLen; k++) {
                var output = outputs[k];
                var size = output.dimensions;
                var value = vertexAttribs[keys[k]];
                if (!value) {
                    value = new VectorN_1.default(numberList(size, 0), false, size);
                }
                var data = dataFromVectorN_1.default(value);
                copyToArray_1.default(data, output.data, i * output.dimensions);
            }
        }
        var attributes = {};
        for (k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var data = output.data;
            attributes[output.name] = new DrawAttribute_1.default(data, output.dimensions);
        }
        switch (geometryMeta.k) {
            case Simplex_1.default.TRIANGLE: {
                return new DrawPrimitive_1.default(DrawMode_1.default.TRIANGLES, indices, attributes);
            }
            case Simplex_1.default.LINE: {
                return new DrawPrimitive_1.default(DrawMode_1.default.LINES, indices, attributes);
            }
            case Simplex_1.default.POINT: {
                return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
            }
            case Simplex_1.default.EMPTY: {
                return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
            }
            default: {
                throw new Error("k => " + geometryMeta.k);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = simplicesToDrawPrimitive;
});
