"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataType_1 = require("../core/DataType");
var DrawAttribute_1 = require("./DrawAttribute");
var DrawPrimitive_1 = require("./DrawPrimitive");
var mustBeArray_1 = require("../checks/mustBeArray");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var notSupported_1 = require("../i18n/notSupported");
var Vertex_1 = require("./Vertex");
var dataFromVectorN_1 = require("../geometries/dataFromVectorN");
function checkSize(length) {
    if (length === 1) {
        return 1;
    }
    else if (length === 2) {
        return 2;
    }
    else if (length === 3) {
        return 3;
    }
    else if (length === 4) {
        return 4;
    }
    else {
        throw new Error("length must be 1, 2, 3, or 4");
    }
}
/**
 * This helper function converts Vertex (VectorN) attributes into the Primitive (number[]) format.
 * There is some magic in the conversion of various types (Geometric2, Geometric3, Vector2, Vector3)
 * to number[], but the basic rule is that the vector grade is extracted and used in a way that is
 * consistent with the linear dimension (2,3), so there should be no surprises.
 */
function attributes(elements, vertices) {
    mustBeArray_1.mustBeArray('elements', elements);
    var attribs = {};
    var iLen = vertices.length;
    for (var i = 0; i < iLen; i++) {
        var vertex = vertices[i];
        var names = Object.keys(vertex.attributes);
        var jLen = names.length;
        for (var j = 0; j < jLen; j++) {
            var name_1 = names[j];
            var data = dataFromVectorN_1.dataFromVectorN(vertex.attributes[name_1]);
            var size = checkSize(data.length);
            var attrib = attribs[name_1];
            if (!attrib) {
                attrib = attribs[name_1] = new DrawAttribute_1.DrawAttribute([], size, DataType_1.DataType.FLOAT);
            }
            for (var k = 0; k < size; k++) {
                attrib.values.push(data[k]);
            }
        }
    }
    return attribs;
}
/**
 * The VertexPrimitive class provides the preferred method for creating geometries.
 * Classes derived from VertexPrimitive create vertices and pathways through them
 * with indices such as TRIANGLE_STRIP. (Reversing this procedure from an arbitrary
 * collection of simplices is an NP problem). The resulting topology can then be
 * modified by a parameterized function either prior to buffering or in a shader.
 * VertexPrimitive uses the Vertex structure which is based on VectorN for ease of mesh
 * generation and transformation. Topolgy provides a toPrimitive method which results
 * in a more compact representation based upon number[]. An even more compact
 * representation is VertexArrays, which interleaves the vertex.
 */
var VertexPrimitive = (function () {
    /**
     * Constructs a VertexPrimitive and initializes the vertices property with the required number of vertices.
     *
     * @param mode
     * @param numVertices
     * @param numCoordinates The number of coordinates required to label each vertex.
     */
    function VertexPrimitive(mode, numVertices, numCoordinates) {
        this.mode = mustBeInteger_1.mustBeInteger('mode', mode);
        mustBeInteger_1.mustBeInteger('numVertices', numVertices);
        mustBeGE_1.mustBeGE('numVertices', numVertices, 0);
        mustBeInteger_1.mustBeInteger('numCoordinates', numCoordinates);
        mustBeGE_1.mustBeGE('numCoordinates', numCoordinates, 0);
        this.vertices = [];
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex_1.Vertex(numCoordinates));
        }
    }
    VertexPrimitive.prototype.vertexTransform = function (transform) {
        mustBeNonNullObject_1.mustBeNonNullObject('transform', transform);
        // Derived classes must implement in order to supply correct ranges.
        throw new Error(notSupported_1.notSupported('vertexTransform').message);
    };
    /**
     *
     */
    VertexPrimitive.prototype.toPrimitive = function () {
        // Derived classes are responsible for allocating the elements array.
        var context = function () { return 'toPrimitive'; };
        mustBeArray_1.mustBeArray('elements', this.elements, context);
        return new DrawPrimitive_1.DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices));
    };
    return VertexPrimitive;
}());
exports.VertexPrimitive = VertexPrimitive;
