define(["require", "exports", '../geometries/b2', '../geometries/b3', '../math/Euclidean3', '../geometries/Path'], function (require, exports, b2_1, b3_1, Euclidean3_1, Path_1) {
    function drawText(text, face, size, divs) {
        var scale = size / face.resolution;
        var offset = 0;
        var chars = String(text).split('');
        var length = chars.length;
        var fontPaths = [];
        for (var i = 0; i < length; i++) {
            var path = new Path_1.default();
            var char = chars[i];
            var ret = extractGlyphPoints(chars[i], face, scale, offset, path, divs);
            offset += ret.offset;
            fontPaths.push(ret.path);
        }
        var width = offset / 2;
        return { paths: fontPaths, offset: width };
    }
    function extractGlyphPoints(c, face, scale, offset, path, divs) {
        var pts = [];
        var divisions;
        var outline;
        var action;
        var length;
        var scaleX;
        var scaleY;
        var x;
        var y;
        var cpx;
        var cpy;
        var cpx0;
        var cpy0;
        var cpx1;
        var cpy1;
        var cpx2;
        var cpy2;
        var laste;
        var glyph = face.glyphs[c] || face.glyphs['?'];
        if (!glyph)
            return;
        if (glyph.o) {
            outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));
            length = outline.length;
            scaleX = scale;
            scaleY = scale;
            for (var i = 0; i < length;) {
                action = outline[i++];
                switch (action) {
                    case 'm':
                        x = outline[i++] * scaleX + offset;
                        y = outline[i++] * scaleY;
                        path.moveTo(Euclidean3_1.default.fromCartesian(0, x, y, 0, 0, 0, 0, 0, void 0));
                        break;
                    case 'l':
                        x = outline[i++] * scaleX + offset;
                        y = outline[i++] * scaleY;
                        path.lineTo(Euclidean3_1.default.fromCartesian(0, x, y, 0, 0, 0, 0, 0, void 0));
                        break;
                    case 'q':
                        cpx = outline[i++] * scaleX + offset;
                        cpy = outline[i++] * scaleY;
                        cpx1 = outline[i++] * scaleX + offset;
                        cpy1 = outline[i++] * scaleY;
                        var controlPoint = Euclidean3_1.default.fromCartesian(0, cpx1, cpy1, 0, 0, 0, 0, 0, void 0);
                        var point = Euclidean3_1.default.fromCartesian(0, cpx, cpy, 0, 0, 0, 0, 0, void 0);
                        path.quadraticCurveTo(controlPoint, point);
                        laste = pts[pts.length - 1];
                        if (laste) {
                            cpx0 = laste.x;
                            cpy0 = laste.y;
                            for (var i2 = 1, divisions = divs; i2 <= divisions; i2++) {
                                var t = i2 / divisions;
                                b2_1.default(t, cpx0, cpx1, cpx);
                                b2_1.default(t, cpy0, cpy1, cpy);
                            }
                        }
                        break;
                    case 'b':
                        cpx = outline[i++] * scaleX + offset;
                        cpy = outline[i++] * scaleY;
                        var point = Euclidean3_1.default.fromCartesian(0, cpx, cpy, 0, 0, 0, 0, 0, void 0);
                        cpx1 = outline[i++] * scaleX + offset;
                        cpy1 = outline[i++] * scaleY;
                        var controlBegin = Euclidean3_1.default.fromCartesian(0, cpx1, cpy1, 0, 0, 0, 0, 0, void 0);
                        cpx2 = outline[i++] * scaleX + offset;
                        cpy2 = outline[i++] * scaleY;
                        var controlEnd = Euclidean3_1.default.fromCartesian(0, cpx2, cpy2, 0, 0, 0, 0, 0, void 0);
                        path.bezierCurveTo(controlBegin, controlEnd, point);
                        laste = pts[pts.length - 1];
                        if (laste) {
                            cpx0 = laste.x;
                            cpy0 = laste.y;
                            for (var i2 = 1, divisions = divs; i2 <= divisions; i2++) {
                                var t = i2 / divisions;
                                b3_1.default(t, cpx0, cpx1, cpx2, cpx);
                                b3_1.default(t, cpy0, cpy1, cpy2, cpy);
                            }
                        }
                        break;
                }
            }
        }
        return { offset: glyph.ha * scale, path: path };
    }
    function generateTextShapes(text, face, parameters) {
        parameters = parameters || {};
        var size = parameters.size !== undefined ? parameters.size : 100;
        var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments : 4;
        var font = parameters.font !== undefined ? parameters.font : 'helvetiker';
        var weight = parameters.weight !== undefined ? parameters.weight : 'normal';
        var style = parameters.style !== undefined ? parameters.style : 'normal';
        var data = drawText(text, face, size, curveSegments);
        var paths = data.paths;
        var shapes = [];
        for (var p = 0, pl = paths.length; p < pl; p++) {
            Array.prototype.push.apply(shapes, paths[p].toShapes)();
        }
        return shapes;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = generateTextShapes;
});
