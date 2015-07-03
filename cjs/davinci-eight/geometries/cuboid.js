var triangles = [
    // front
    [0, 1, 2],
    [0, 2, 3],
    // rear
    [4, 7, 5],
    [5, 7, 6],
    // left
    [0, 7, 4],
    [0, 3, 7],
    // right
    [1, 5, 2],
    [2, 5, 6],
    // top
    [2, 7, 3],
    [2, 6, 7],
    // bottom
    [0, 5, 1],
    [0, 4, 5]
];
// TODO: We'd like to be able to use anything here and have some adapter fix the names.
var DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME = 'aVertexPosition';
var DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME = 'aVertexColor';
var DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE = [1.0, 0.0, 0.0];
var DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME = 'aVertexNormal';
var cuboid = function (spec) {
    function getOverride(which, prop, defaultValue, type) {
        if (spec && spec[which] && typeof spec[which][prop] === type) {
            return spec[which][prop];
        }
        else {
            return defaultValue;
        }
    }
    var VERTEX_ATTRIBUTE_POSITION = getOverride('position', 'name', DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME, 'string');
    var VERTEX_ATTRIBUTE_COLOR = getOverride('color', 'name', DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME, 'string');
    var VERTEX_ATTRIBUTE_NORMAL = getOverride('normal', 'name', DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME, 'string');
    var a = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
    var b = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
    var c = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
    var vertexAttributeColor = getOverride('color', 'value', DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE, 'object');
    var elements = [];
    var aVertexPositionArray;
    var aVertexColorArray;
    var aVertexNormalArray;
    var publicAPI = {
        get a() {
            return a;
        },
        set a(value) {
            a = value;
        },
        get b() {
            return b;
        },
        set b(value) {
            b = value;
        },
        get c() {
            return c;
        },
        set c(value) {
            c = value;
        },
        get color() {
            return vertexAttributeColor;
        },
        set color(value) {
            vertexAttributeColor = value;
        },
        draw: function (context) {
            context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
        },
        dynamic: function () { return false; },
        getAttributes: function () {
            return [
                { name: VERTEX_ATTRIBUTE_POSITION, size: 3, normalized: false, stride: 0, offset: 0 },
                { name: VERTEX_ATTRIBUTE_COLOR, size: 3, normalized: false, stride: 0, offset: 0 },
                { name: VERTEX_ATTRIBUTE_NORMAL, size: 3, normalized: false, stride: 0, offset: 0 }
            ];
        },
        hasElements: function () {
            return false;
        },
        getElements: function () {
            // We don't support element arrays (yet).
            return;
        },
        getVertexAttribArrayData: function (name) {
            switch (name) {
                case VERTEX_ATTRIBUTE_POSITION: {
                    return aVertexPositionArray;
                }
                case VERTEX_ATTRIBUTE_COLOR: {
                    return aVertexColorArray;
                }
                case VERTEX_ATTRIBUTE_NORMAL: {
                    return aVertexNormalArray;
                }
                default: {
                    return;
                }
            }
        },
        update: function (time, attributes) {
            function computeVertexList() {
                var vertexList = [
                    // front (+z) face (labelled 0, 1, 2, 3 from lower left counterclockwise from front)
                    c.sub(a).sub(b).scalarMultiply(0.5),
                    c.add(a).sub(b).scalarMultiply(0.5),
                    c.add(a).add(b).scalarMultiply(0.5),
                    c.sub(a).add(b).scalarMultiply(0.5),
                    // rear (-z) face (labelled 4, 5, 6, 7 from lower left counterclockwise from front)
                    c.scalarMultiply(-1).sub(a).sub(b).scalarMultiply(0.5),
                    c.scalarMultiply(-1).add(a).sub(b).scalarMultiply(0.5),
                    c.scalarMultiply(-1).add(a).add(b).scalarMultiply(0.5),
                    c.scalarMultiply(-1).sub(a).add(b).scalarMultiply(0.5)
                ];
                return vertexList;
            }
            var names = attributes.map(function (attribute) { return attribute.name; });
            var requirePosition = names.indexOf(VERTEX_ATTRIBUTE_POSITION) >= 0;
            var requireColor = names.indexOf(VERTEX_ATTRIBUTE_COLOR) >= 0;
            var requireNormal = names.indexOf(VERTEX_ATTRIBUTE_NORMAL) >= 0;
            // Insist that things won't work without aVertexPosition.
            // We just degrade gracefully if the other attribute arrays are not required.
            if (!requirePosition) {
                throw new Error("Cuboid geometry is expecting to provide " + VERTEX_ATTRIBUTE_POSITION);
            }
            var vertices = [];
            var colors = [];
            var normals = [];
            var vertexList = computeVertexList();
            triangles.forEach(function (triangle, index) {
                elements.push(triangle[0]);
                elements.push(triangle[1]);
                elements.push(triangle[2]);
                if (requirePosition) {
                    for (var j = 0; j < 3; j++) {
                        vertices.push(vertexList[triangle[j]].x);
                        vertices.push(vertexList[triangle[j]].y);
                        vertices.push(vertexList[triangle[j]].z);
                    }
                }
                if (requireColor) {
                    colors.push(vertexAttributeColor[0]);
                    colors.push(vertexAttributeColor[1]);
                    colors.push(vertexAttributeColor[2]);
                    colors.push(vertexAttributeColor[0]);
                    colors.push(vertexAttributeColor[1]);
                    colors.push(vertexAttributeColor[2]);
                    colors.push(vertexAttributeColor[0]);
                    colors.push(vertexAttributeColor[1]);
                    colors.push(vertexAttributeColor[2]);
                }
                if (requireNormal) {
                    var v0 = vertexList[triangle[0]];
                    var v1 = vertexList[triangle[1]];
                    var v2 = vertexList[triangle[2]];
                    var perp = v1.sub(v0).cross(v2.sub(v0));
                    var normal = perp.div(perp.norm());
                    normals.push(normal.x);
                    normals.push(normal.y);
                    normals.push(normal.z);
                    normals.push(normal.x);
                    normals.push(normal.y);
                    normals.push(normal.z);
                    normals.push(normal.x);
                    normals.push(normal.y);
                    normals.push(normal.z);
                }
            });
            if (requirePosition) {
                aVertexPositionArray = new Float32Array(vertices);
            }
            if (requireColor) {
                aVertexColorArray = new Float32Array(colors);
            }
            if (requireNormal) {
                aVertexNormalArray = new Float32Array(normals);
            }
        }
    };
    return publicAPI;
};
module.exports = cuboid;
