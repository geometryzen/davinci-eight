define(["require", "exports", '../dfx/Elements', '../dfx/ElementsAttribute', '../checks/expectArg', '../dfx/Simplex', '../core/Symbolic', '../dfx/uniqueVertices', '../math/VectorN'], function (require, exports, Elements, ElementsAttribute, expectArg, Simplex, Symbolic, uniqueVertices, VectorN) {
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
    function missingSpecificationForPosition() {
        return "missing specification for " + Symbolic.ATTRIBUTE_POSITION;
    }
    function missingSpecificationForNormal() {
        return "missing specification for " + Symbolic.ATTRIBUTE_NORMAL;
    }
    function triangles(faces, attribMap) {
        expectArg('faces', faces).toBeObject();
        expectArg('attribMap', attribMap).toBeObject();
        var uniques = uniqueVertices(faces);
        var elements = {};
        // Initialize the output arrays for all the attributes specified.
        var outputs = {};
        Object.keys(attribMap).forEach(function (key) {
            outputs[key] = numberList(uniques.length * attribSize(key, attribMap), void 0);
        });
        // Cache the special cases (for now).
        var positions = outputs[Symbolic.ATTRIBUTE_POSITION];
        expectArg(Symbolic.ATTRIBUTE_POSITION, positions).toBeObject(missingSpecificationForPosition);
        // Each face produces three indices.
        var indices = faces.map(Simplex.indices).reduce(concat, []);
        uniques.forEach(function (unique) {
            var position = unique.position;
            var index = unique.index;
            // TODO: cache the size for position
            position.toArray(positions, index * attribSize(Symbolic.ATTRIBUTE_POSITION, attribMap));
            // TODO: Need string[] of custom keys... to avoid the test within the loop.
            Object.keys(attribMap).forEach(function (key) {
                var output = outputs[key];
                // TODO: We've already looked up the output, why not cache the size there?
                // FIXME: attribMap also contains a spec for positions and normal. Hmm.
                // The separation of custom and standard creates an issue.
                var data = unique.attributes[key];
                if (data) {
                    unique.attributes[key].toArray(output, index * attribSize(key, attribMap));
                }
            });
        });
        var attributes = {};
        // Specifying the size fixes the length of the VectorN, disabling push and pop, etc.
        // TODO: Use map
        Object.keys(attribMap).forEach(function (key) {
            var output = outputs[key];
            var data = outputs[key];
            // TODO: We've already looked up output. Why not cache the output name and use the size?
            var vector = new VectorN(data, false, data.length);
            attributes[attribName(key, attribMap)] = new ElementsAttribute(vector, attribSize(key, attribMap));
        });
        return new Elements(new VectorN(indices, false, indices.length), attributes);
    }
    return triangles;
});
