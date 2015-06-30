/// <reference path="../geometries/Geometry.d.ts" />
define(["require", "exports"], function (require, exports) {
    function makeArray(length) {
        var xs = [];
        for (var i = 0; i < length; i++) {
            xs.push(1.0);
            xs.push(1.0);
            xs.push(1.0);
        }
        return xs;
    }
    var LatticeGeometry = (function () {
        function LatticeGeometry(I, J, K, generator) {
            this.I = I;
            this.J = J;
            this.K = K;
            this.generator = generator;
        }
        LatticeGeometry.prototype.draw = function (context) {
            context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
        };
        LatticeGeometry.prototype.dynamic = function () {
            return true;
        };
        LatticeGeometry.prototype.getAttributes = function () {
            return [
                { name: 'aVertexPosition', size: 3, normalized: false, stride: 0, offset: 0 },
                { name: 'aVertexColor', size: 3, normalized: false, stride: 0, offset: 0 }
            ];
        };
        LatticeGeometry.prototype.getElements = function () {
            return this.elements;
        };
        LatticeGeometry.prototype.getVertexAttribArrayData = function (name) {
            switch (name) {
                case 'aVertexPosition': {
                    return this.vertices;
                }
                case 'aVertexColor': {
                    return this.vertexColors;
                }
                case 'aVertexNormal': {
                    return this.vertexNormals;
                }
                default: {
                    return;
                }
            }
        };
        LatticeGeometry.prototype.update = function (time) {
            var I = this.I;
            var J = this.J;
            var K = this.K;
            var generator = this.generator;
            var vs = [];
            var ps = [];
            var pointIndex = 0;
            for (var i = -I; i <= I; i++) {
                for (var j = -J; j <= J; j++) {
                    for (var k = -K; k <= K; k++) {
                        var pos = generator(i, j, k, time);
                        vs.push(pos.x);
                        vs.push(pos.y);
                        vs.push(pos.z);
                        ps.push(pointIndex);
                        pointIndex++;
                    }
                }
            }
            this.elements = new Uint16Array(ps);
            this.vertices = new Float32Array(vs);
            this.vertexColors = new Float32Array(makeArray(ps.length));
            this.vertexNormals = new Float32Array(makeArray(ps.length));
        };
        return LatticeGeometry;
    })();
    return LatticeGeometry;
});
