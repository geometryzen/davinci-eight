define(["require", "exports", "davinci-blade/Euclidean3"], function (require, exports, Euclidean3) {
    //
    // Computing the geometry of an ellipsoid (essentially a deformed sphere) is rather
    // intricate owing to the fact that the spherical coordinate parameters, theta and phi,
    // have different characteristics.
    //
    // The smallest number of segments corresponds to two tetrahedrons.
    // This is actually the worst case which occurs when theta includes the poles
    // and phi closes.
    var THETA_SEGMENTS_MINIMUM = 2;
    var PHI_SEGMENTS_MINIMUM = 3;
    // For more realism, use more segments. The complexity of computation goes as the square.
    var REALISM = 7;
    var THETA_SEGMENTS_DEFAULT = THETA_SEGMENTS_MINIMUM * REALISM;
    var PHI_SEGMENTS_DEFAULT = PHI_SEGMENTS_MINIMUM * REALISM;
    function cacheTrig(segments, start, length, cosCache, sinCache) {
        for (var index = 0; index <= segments; index++) {
            var angle = start + index * length / segments;
            cosCache.push(Math.cos(angle));
            sinCache.push(Math.sin(angle));
        }
    }
    function computeVertex(a, b, c, cosTheta, sinTheta, cosPhi, sinPhi) {
        // Optimize for the north and south pole by simplifying the calculation.
        // This has no other effect than for performance.
        var optimize = false;
        var northPole = optimize && (cosTheta === +1);
        var southPole = optimize && (cosTheta === -1);
        if (northPole) {
            return b;
        }
        else if (southPole) {
            return b.scalarMultiply(-1);
        }
        else {
            var A = a.scalarMultiply(cosPhi).scalarMultiply(sinTheta);
            var B = b.scalarMultiply(cosTheta);
            var C = c.scalarMultiply(sinPhi).scalarMultiply(sinTheta);
            return A.add(B).add(C);
        }
    }
    var ellipsoid = function (spec) {
        var a = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        var b = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        var c = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        var thetaSegments = THETA_SEGMENTS_DEFAULT;
        var thetaStart = 0;
        var thetaLength = Math.PI;
        var phiSegments = PHI_SEGMENTS_DEFAULT;
        var phiStart = 0;
        var phiLength = 2 * Math.PI;
        var elements = [];
        var triangles = [];
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
            get thetaSegments() {
                return thetaSegments;
            },
            set thetaSegments(value) {
                thetaSegments = Math.max(THETA_SEGMENTS_MINIMUM, Math.floor(value) || THETA_SEGMENTS_DEFAULT);
            },
            get thetaStart() {
                return thetaStart;
            },
            set thetaStart(value) {
                thetaStart = value;
            },
            get thetaLength() {
                return thetaLength;
            },
            set thetaLength(value) {
                thetaLength = Math.max(0, Math.min(value, Math.PI));
            },
            get phiSegments() {
                return phiSegments;
            },
            set phiSegments(value) {
                phiSegments = Math.max(PHI_SEGMENTS_MINIMUM, Math.floor(value) || PHI_SEGMENTS_DEFAULT);
            },
            get phiStart() {
                return phiStart;
            },
            set phiStart(value) {
                phiStart = value;
            },
            get phiLength() {
                return phiLength;
            },
            set phiLength(value) {
                phiLength = Math.max(0, Math.min(value, 2 * Math.PI));
            },
            draw: function (context) {
                context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
            },
            dynamics: function () { return false; },
            getAttributeMetaInfos: function () {
                return {
                    position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
                };
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
                // This function depends on how the vertexList is computed.
                function vertexIndex(thetaIndex, phiIndex) {
                    return thetaIndex * (phiSegments + 1) + phiIndex;
                }
                function computeVertexList(cosThetaCache, sinThetaCache, cosPhiCache, sinPhiCache) {
                    var vertexList = [];
                    var cosTheta;
                    var sinTheta;
                    var cosPhi;
                    var sinPhi;
                    for (var thetaIndex = 0; thetaIndex <= thetaSegments; thetaIndex++) {
                        cosTheta = cosThetaCache[thetaIndex];
                        sinTheta = sinThetaCache[thetaIndex];
                        // We compute more phi points because phi may not return back to the start.
                        for (var phiIndex = 0; phiIndex <= phiSegments; phiIndex++) {
                            cosPhi = cosPhiCache[phiIndex];
                            sinPhi = sinPhiCache[phiIndex];
                            vertexList.push(computeVertex(a, b, c, cosTheta, sinTheta, cosPhi, sinPhi));
                        }
                    }
                    return vertexList;
                }
                function computeTriangles() {
                    var faces = [];
                    for (var thetaIndex = 0; thetaIndex < thetaSegments; thetaIndex++) {
                        for (var phiIndex = 0; phiIndex < phiSegments; phiIndex++) {
                            var index1 = vertexIndex(thetaIndex, phiIndex);
                            var index2 = vertexIndex(thetaIndex, phiIndex + 1);
                            var index3 = vertexIndex(thetaIndex + 1, phiIndex + 1);
                            var index4 = vertexIndex(thetaIndex + 1, phiIndex);
                            faces.push([index1, index2, index3]);
                            faces.push([index1, index3, index4]);
                        }
                    }
                    return faces;
                }
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
                // Cache values of cosine and sine of theta and phi.
                var cosThetaCache = [];
                var sinThetaCache = [];
                cacheTrig(thetaSegments, thetaStart, thetaLength, cosThetaCache, sinThetaCache);
                var cosPhiCache = [];
                var sinPhiCache = [];
                cacheTrig(phiSegments, phiStart, phiLength, cosPhiCache, sinPhiCache);
                var vertexList = computeVertexList(cosThetaCache, sinThetaCache, cosPhiCache, sinPhiCache);
                triangles = computeTriangles();
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
    return ellipsoid;
});
