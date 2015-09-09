//
// makeBox
//
// Create a box with vertices, normals and texCoords. Create VBOs for each as well as the index array.
// Return an object with the following properties:
//
//  normalBuffer        WebGLBuffer object for normals
//  texCoordBuffer      WebGLBuffer object for texCoords
//  vertexBuffer        WebGLBuffer object for vertices
//  indexBuffer         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexBuffer
//
function makeBox(ctx) {
    // box
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
    // vertex coords array
    var vertices = new Float32Array([1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,
        1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,
        1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,
        -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,
        -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
        1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1] // v4-v7-v6-v5 back
    );
    // normal array
    var normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1] // v4-v7-v6-v5 back
    );
    // texCoord array
    var texCoords = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0,
        0, 1, 0, 0, 1, 0, 1, 1,
        1, 0, 1, 1, 0, 1, 0, 0,
        1, 1, 0, 1, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1] // v4-v7-v6-v5 back
    );
    // index array
    // It's implicit that these are TRIANGLE(s)
    var indices = new Uint8Array([0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23] // back
    );
    var normalBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, normalBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, normals, ctx.STATIC_DRAW);
    var texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, texCoords, ctx.STATIC_DRAW);
    var vertexBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);
    // This call clears the ARRAY_BUFFER target.
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
    var indexBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indices, ctx.STATIC_DRAW);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
    var self = {
        get normalBuffer() {
            return normalBuffer;
        },
        get texCoordBuffer() {
            return texCoordBuffer;
        },
        get vertexBuffer() {
            return vertexBuffer;
        },
        get indexBuffer() {
            return indexBuffer;
        },
        get numIndices() {
            return indices.length;
        }
    };
    return self;
}
module.exports = makeBox;
