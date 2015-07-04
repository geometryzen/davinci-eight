define(["require", "exports", 'davinci-eight/math/e3ga/vectorE3'], function (require, exports, vectorE3) {
    var vertexList = [
        // front (+z) face (labelled 0, 1, 2, 3 from lower left counterclockwise from front)
        vectorE3(-0.5, -0.5, +0.5),
        vectorE3(+0.5, -0.5, +0.5),
        vectorE3(+0.5, +0.5, +0.5),
        vectorE3(-0.5, +0.5, +0.5),
        // rear (-z) face (labelled 4, 5, 6, 7 from lower left counterclockwise from front)
        vectorE3(-0.5, -0.5, -0.5),
        vectorE3(+0.5, -0.5, -0.5),
        vectorE3(+0.5, +0.5, -0.5),
        vectorE3(-0.5, +0.5, -0.5)
    ];
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
    var box = function (spec) {
        var elements = [];
        var aVertexPositionArray;
        var aVertexColorArray;
        var aVertexNormalArray;
        var publicAPI = {
            draw: function (context) {
                context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
            },
            dynamic: function () { return false; },
            getVertexAttributeMetaInfos: function () {
                return [
                    { property: 'position', name: 'aVertexPosition', size: 3, normalized: false, stride: 0, offset: 0 },
                    { property: 'color', name: 'aVertexColor', size: 3, normalized: false, stride: 0, offset: 0 },
                    { property: 'normal', name: 'aVertexNormal', size: 3, normalized: false, stride: 0, offset: 0 }
                ];
            },
            hasElements: function () {
                return false;
            },
            getElements: function () {
                // We don't support element arrays (yet).
                return;
            },
            getVertexAttributeData: function (name) {
                switch (name) {
                    case 'aVertexPosition': {
                        return aVertexPositionArray;
                    }
                    case 'aVertexColor': {
                        return aVertexColorArray;
                    }
                    case 'aVertexNormal': {
                        return aVertexNormalArray;
                    }
                    default: {
                        return;
                    }
                }
            },
            update: function (time, attributes) {
                var names = attributes.map(function (attribute) { return attribute.name; });
                var requirePosition = names.indexOf('aVertexPosition') >= 0;
                var requireColor = names.indexOf('aVertexColor') >= 0;
                var requireNormal = names.indexOf('aVertexNormal') >= 0;
                // Insist that things won't work without aVertexPosition.
                // We just degrade gracefully if the other attribute arrays are not required.
                if (!requirePosition) {
                    throw new Error("Box geometry is expecting to provide aVertexPosition");
                }
                var vertices = [];
                var colors = [];
                var normals = [];
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
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
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
    return box;
});
