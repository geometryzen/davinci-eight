/**
 * This class acts as an adapter from a Geometry to a VertexAttributeProvider.
 */
var GeometryVertexAttributeProvider = (function () {
    function GeometryVertexAttributeProvider(geometry) {
        this.geometry = geometry;
    }
    GeometryVertexAttributeProvider.prototype.draw = function (context) {
        context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
    };
    GeometryVertexAttributeProvider.prototype.dynamics = function () {
        // TODO: EIGHT.VertexAttributeProvider.dynamic should also be a property.
        return false; //this.geometry.dynamic;
    };
    GeometryVertexAttributeProvider.prototype.hasElements = function () {
        return false;
    };
    GeometryVertexAttributeProvider.prototype.getElements = function () {
        throw new Error("getElements");
        return null;
    };
    GeometryVertexAttributeProvider.prototype.getVertexAttributeData = function (name) {
        switch (name) {
            case 'aVertexPosition': {
                return this.aVertexPositionArray;
            }
            case 'aVertexColor': {
                return this.aVertexColorArray;
            }
            case 'aVertexNormal': {
                return this.aVertexNormalArray;
            }
            default: {
                return;
            }
        }
    };
    GeometryVertexAttributeProvider.prototype.getAttributeMetaInfos = function () {
        return {
            position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
            color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
            normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
        };
    };
    GeometryVertexAttributeProvider.prototype.update = function (time, attributes) {
        var vertices = [];
        var colors = [];
        var normals = [];
        var elements = [];
        var vertexList = this.geometry.vertices;
        this.geometry.faces.forEach(function (face) {
            elements.push(face.a);
            elements.push(face.b);
            elements.push(face.c);
            vertices.push(vertexList[face.a].x);
            vertices.push(vertexList[face.a].y);
            vertices.push(vertexList[face.a].z);
            vertices.push(vertexList[face.b].x);
            vertices.push(vertexList[face.b].y);
            vertices.push(vertexList[face.b].z);
            vertices.push(vertexList[face.c].x);
            vertices.push(vertexList[face.c].y);
            vertices.push(vertexList[face.c].z);
            colors.push(0);
            colors.push(1);
            colors.push(0);
            colors.push(0);
            colors.push(1);
            colors.push(0);
            colors.push(0);
            colors.push(1);
            colors.push(0);
            // Make copies where needed to avoid mutating the geometry.
            var a = vertexList[face.a];
            var b = vertexList[face.b].clone();
            var c = vertexList[face.c].clone();
            var perp = b.sub(a).cross(c.sub(a));
            var normal = perp.divideScalar(perp.length());
            normals.push(normal.x);
            normals.push(normal.y);
            normals.push(normal.z);
            normals.push(normal.x);
            normals.push(normal.y);
            normals.push(normal.z);
            normals.push(normal.x);
            normals.push(normal.y);
            normals.push(normal.z);
        });
        this.aVertexPositionArray = new Float32Array(vertices);
        this.aVertexColorArray = new Float32Array(colors);
        this.aVertexNormalArray = new Float32Array(normals);
    };
    return GeometryVertexAttributeProvider;
})();
module.exports = GeometryVertexAttributeProvider;
