define(["require", "exports"], function (require, exports) {
    //
    // makeSphere
    //
    // Create a sphere with the passed number of latitude and longitude bands and the passed radius.
    // Sphere has vertices, normals and texCoords. Create VBOs for each as well as the index array.
    // Return an object with the following properties:
    //
    //  normalObject        WebGLBuffer object for normals
    //  texCoordObject      WebGLBuffer object for texCoords
    //  vertexObject        WebGLBuffer object for vertices
    //  indexObject         WebGLBuffer object for indices
    //  numIndices          The number of indices in the indexObject
    //
    function makeSphere(ctx, radius, lats, longs) {
        var geometryData = [];
        var normalData = [];
        var texCoordData = [];
        var indexData = [];
        for (var latNumber = 0; latNumber <= lats; ++latNumber) {
            for (var longNumber = 0; longNumber <= longs; ++longNumber) {
                var theta = latNumber * Math.PI / lats;
                var phi = longNumber * 2 * Math.PI / longs;
                var sinTheta = Math.sin(theta);
                var sinPhi = Math.sin(phi);
                var cosTheta = Math.cos(theta);
                var cosPhi = Math.cos(phi);
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longs);
                var v = latNumber / lats;
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
        for (var latNumber = 0; latNumber < lats; ++latNumber) {
            for (var longNumber = 0; longNumber < longs; ++longNumber) {
                var first = (latNumber * (longs + 1)) + longNumber;
                var second = first + longs + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);
                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }
        var normalObject = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, normalObject);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(normalData), ctx.STATIC_DRAW);
        var texCoordObject = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordObject);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(texCoordData), ctx.STATIC_DRAW);
        var vertexObject = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexObject);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(geometryData), ctx.STATIC_DRAW);
        var numIndices = indexData.length;
        var indexObject = ctx.createBuffer();
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexObject);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), ctx.STREAM_DRAW);
        var self = {
            get normalObject() {
                return normalObject;
            },
            get texCoordObject() {
                return texCoordObject;
            },
            get vertexObject() {
                return vertexObject;
            },
            get indexObject() {
                return indexObject;
            },
            get numIndices() {
                return numIndices;
            }
        };
        return self;
    }
});
