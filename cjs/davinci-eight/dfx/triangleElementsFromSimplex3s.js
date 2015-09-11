var Elements = require('../dfx/Elements');
var expectArg = require('../checks/expectArg');
var Simplex3 = require('../dfx/Simplex3');
var isDefined = require('../checks/isDefined');
var ElementsAttribute = require('../dfx/ElementsAttribute');
var VectorN = require('../math/VectorN');
var stringifySimplex3Vertex = require('../dfx/stringifySimplex3Vertex');
var Symbolic = require('../core/Symbolic');
var VERTICES_PER_FACE = 3;
// This function has the important side-effect of setting the index property.
// TODO: It would be better to copy the Simplex3 structure?
function computeUniques(faces) {
    var map = {};
    var uniques = [];
    function munge(fv) {
        var key = stringifySimplex3Vertex(fv);
        if (map[key]) {
            var existing = map[key];
            fv.index = existing.index;
        }
        else {
            fv.index = uniques.length;
            uniques.push(fv);
            map[key] = fv;
        }
    }
    faces.forEach(function (face) {
        munge(face.a);
        munge(face.b);
        munge(face.c);
    });
    return uniques;
}
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
    if (isDefined(meta)) {
        var alias = meta.name;
        return isDefined(alias) ? alias : name;
    }
    else {
        throw new Error("Unable to compute name; missing attribute specification for " + name);
    }
}
function attribSize(key, attribMap) {
    expectArg('key', key).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
    var meta = attribMap[key];
    if (isDefined(meta)) {
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
function triangleElementsFromSimplex3s(faces, attribMap) {
    expectArg('faces', faces).toBeObject();
    expectArg('attribMap', attribMap).toBeObject();
    var uniques = computeUniques(faces);
    var elements = {};
    // Initialize the output arrays for all the attributes specified.
    var outputs = {};
    Object.keys(attribMap).forEach(function (key) {
        outputs[key] = numberList(uniques.length * attribSize(key, attribMap), void 0);
    });
    // Cache the special cases (for now).
    var positions = outputs[Symbolic.ATTRIBUTE_POSITION];
    expectArg(Symbolic.ATTRIBUTE_POSITION, positions).toBeObject(missingSpecificationForPosition);
    var normals = outputs[Symbolic.ATTRIBUTE_NORMAL];
    expectArg(Symbolic.ATTRIBUTE_NORMAL, normals).toBeObject(missingSpecificationForNormal);
    // Each face produces three indices.
    var indices = faces.map(Simplex3.indices).reduce(concat, []);
    uniques.forEach(function (unique) {
        var position = unique.position;
        var normal = unique.normal;
        var index = unique.index;
        // TODO: cache the size for position
        position.toArray(positions, index * attribSize(Symbolic.ATTRIBUTE_POSITION, attribMap));
        // TODO: cache the size for position.
        normal.toArray(normals, index * attribSize(Symbolic.ATTRIBUTE_NORMAL, attribMap));
        // TODO: Need string[] of custom keys... to avoid the test within the loop.
        Object.keys(attribMap).forEach(function (key) {
            var output = outputs[key];
            // TODO: We've already looked up the output, why not cache the size there?
            // FIXME: attribMap also contains a spec for positions and normal. Hmm.
            // The separation of custom and standard creates an issue.
            var data = unique.attributes[key];
            if (isDefined(data)) {
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
module.exports = triangleElementsFromSimplex3s;
