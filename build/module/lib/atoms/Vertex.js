import { Coords } from '../math/Coords';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
function stringVectorN(name, vector) {
    if (vector) {
        return name + vector.toString();
    }
    else {
        return name;
    }
}
function stringifyVertex(vertex) {
    var attributes = vertex.attributes;
    var attribsKey = Object.keys(attributes).map(function (name) {
        var vector = attributes[name];
        return stringVectorN(name, vector);
    }).join(' ');
    return attribsKey;
}
/**
 * The data for a vertex in a normalized and uncompressed format that is easy to manipulate.
 */
var Vertex = (function () {
    /**
     * @param numCoordinates The number of coordinates (dimensionality).
     */
    function Vertex(numCoordinates) {
        /**
         * The attribute data for this vertex.
         */
        this.attributes = {};
        mustBeInteger('numCoordinates', numCoordinates);
        mustBeGE('numCoordinates', numCoordinates, 0);
        var data = [];
        for (var i = 0; i < numCoordinates; i++) {
            data.push(0);
        }
        this.coords = new Coords(data, false, numCoordinates);
    }
    /**
     * @returns A string representation of this vertex.
     */
    Vertex.prototype.toString = function () {
        return stringifyVertex(this);
    };
    return Vertex;
}());
export { Vertex };
