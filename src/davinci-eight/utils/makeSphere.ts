import Thing = require('../utils/Thing');
//
// makeSphere
//
// Create a sphere with the passed number of latitude and longitude bands and the passed radius.
// Sphere has vertices, normals and texCoords. Create VBOs for each as well as the index array.
// Return an object with the following properties:
//
//  normalBuffer        WebGLBuffer object for normals
//  texCoordBuffer      WebGLBuffer object for texCoords
//  vertexBuffer        WebGLBuffer object for vertices
//  indexBuffer         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexBuffer
//
function makeSphere(ctx: WebGLRenderingContext, radius: number, lats: number, longs: number): Thing
{
    let geometryData: number[] = [ ];
    let normalData: number[] = [ ];
    let texCoordData: number[] = [ ];
    let indexData: number[] = [ ];

    var latNumber: number;
    var longNumber: number;

    for (latNumber = 0; latNumber <= lats; ++latNumber) {
        for (longNumber = 0; longNumber <= longs; ++longNumber) {
            var theta = latNumber * Math.PI / lats;
            var phi = longNumber * 2 * Math.PI / longs;
            var sinTheta = Math.sin(theta);
            var sinPhi = Math.sin(phi);
            var cosTheta = Math.cos(theta);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1-(longNumber/longs);
            var v = latNumber/lats;

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            texCoordData.push(u);
            texCoordData.push(v);
            geometryData.push(radius * x);
            geometryData.push(radius * y);
            geometryData.push(radius * z);
        }
    }

    for (latNumber = 0; latNumber < lats; ++latNumber) {
        for (longNumber = 0; longNumber < longs; ++longNumber) {
            var first = (latNumber * (longs+1)) + longNumber;
            var second = first + longs + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first+1);

            indexData.push(second);
            indexData.push(second+1);
            indexData.push(first+1);
        }
    }

    // FIXME: What I don't like about this is the coupling of the geometry to the WebGL buffering.
    let normalBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, normalBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(normalData), ctx.STATIC_DRAW);

    let texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(texCoordData), ctx.STATIC_DRAW);

    let vertexBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(geometryData), ctx.STATIC_DRAW);

    let numIndices = indexData.length;
    let indexBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), ctx.STREAM_DRAW);

    let self: Thing = {
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
        return numIndices;
      }
    };
    return self;
}