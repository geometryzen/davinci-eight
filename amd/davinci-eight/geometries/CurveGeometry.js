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
    var CurveGeometry = (function () {
        function CurveGeometry(n, generator) {
            this.n = n;
            this.generator = generator;
        }
        CurveGeometry.prototype.draw = function (context) {
            context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
        };
        CurveGeometry.prototype.dynamic = function () {
            return true;
        };
        CurveGeometry.prototype.getAttributes = function () {
            return [
                { name: 'aVertexPosition', size: 3, normalized: false, stride: 0, offset: 0 },
                { name: 'aVertexColor', size: 3, normalized: false, stride: 0, offset: 0 }
            ];
        };
        CurveGeometry.prototype.getElements = function () {
            return this.elements;
        };
        CurveGeometry.prototype.getVertexAttribArrayData = function (name) {
            switch (name) {
                case 'aVertexPosition': {
                    return this.vertices;
                }
                case 'aVertexColor': {
                    return this.vertexColors;
                }
                default: {
                    return;
                }
            }
        };
        CurveGeometry.prototype.update = function (time) {
            var n = this.n;
            var generator = this.generator;
            var vs = [];
            var indices = [];
            for (var i = 0; i < n; i++) {
                var pos = generator(i, time);
                vs.push(pos.x);
                vs.push(pos.y);
                vs.push(pos.z);
                indices.push(i);
            }
            this.elements = new Uint16Array(indices);
            this.vertices = new Float32Array(vs);
            this.vertexColors = new Float32Array(makeArray(indices.length));
        };
        return CurveGeometry;
    })();
    return CurveGeometry;
});
