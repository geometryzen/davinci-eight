import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import Euclidean3 from '../math/Euclidean3';
import FontFace from '../geometries/FontFace';
import Path from '../geometries/Path';
import Shape from '../geometries/Shape';

function drawText(text: string, face: FontFace, size: number, divs: number): { paths: Path[]; offset: number } {

    var scale = size / face.resolution
    var offset = 0
    var chars = String(text).split('')
    var length = chars.length

    var fontPaths: Path[] = [];

    for (var i = 0; i < length; i++) {

        var path = new Path();
        // var char = chars[i]
        var ret = extractGlyphPoints(chars[i], face, scale, offset, path, divs);
        offset += ret.offset;

        fontPaths.push(ret.path);

    }

    var width = offset / 2;

    return { paths: fontPaths, offset: width };
}

/**
 * c: The character. FIXME
 */
function extractGlyphPoints(c: string, face: FontFace, scale: number, offset: number, path: Path, divs: number) {

    var pts: Euclidean3[] = [];

    var divisions: number;
    var outline: (number | string)[];
    var action: string;
    var length: number;
    var scaleX: number;
    var scaleY: number;
    var x: number;
    var y: number;
    var cpx: number;
    var cpy: number;
    var cpx0: number;
    var cpy0: number;
    var cpx1: number;
    var cpy1: number;
    var cpx2: number;
    var cpy2: number;
    var laste: Euclidean3;
    var glyph = face.glyphs[c] || face.glyphs['?'];

    if (!glyph) return;

    if (glyph.o) {

        outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));
        length = outline.length;

        scaleX = scale;
        scaleY = scale;

        for (var i = 0; i < length;) {

            action = <string>outline[i++];

            switch (action) {

                case 'm':

                    // Move To

                    x = <number>outline[i++] * scaleX + offset;
                    y = <number>outline[i++] * scaleY;
                    path.moveTo(Euclidean3.fromCartesian(0, x, y, 0, 0, 0, 0, 0, void 0));
                    break;

                case 'l':

                    // Line To

                    x = <number>outline[i++] * scaleX + offset;
                    y = <number>outline[i++] * scaleY;
                    path.lineTo(Euclidean3.fromCartesian(0, x, y, 0, 0, 0, 0, 0, void 0));
                    break;

                case 'q':

                    // QuadraticCurveTo

                    cpx = <number>outline[i++] * scaleX + offset;
                    cpy = <number>outline[i++] * scaleY;
                    cpx1 = <number>outline[i++] * scaleX + offset;
                    cpy1 = <number>outline[i++] * scaleY;
                    var controlPoint = Euclidean3.fromCartesian(0, cpx1, cpy1, 0, 0, 0, 0, 0, void 0)
                    var point = Euclidean3.fromCartesian(0, cpx, cpy, 0, 0, 0, 0, 0, void 0)

                    path.quadraticCurveTo(controlPoint, point);

                    laste = pts[pts.length - 1];

                    if (laste) {

                        cpx0 = laste.x;
                        cpy0 = laste.y;

                        for (var i2 = 1, divisions = divs; i2 <= divisions; i2++) {

                            var t = i2 / divisions;
                            b2(t, cpx0, cpx1, cpx);
                            b2(t, cpy0, cpy1, cpy);
                        }

                    }

                    break;

                case 'b':

                    // Cubic Bezier Curve

                    cpx = <number>outline[i++] * scaleX + offset;
                    cpy = <number>outline[i++] * scaleY;
                    point = Euclidean3.fromCartesian(0, cpx, cpy, 0, 0, 0, 0, 0, void 0)

                    cpx1 = <number>outline[i++] * scaleX + offset;
                    cpy1 = <number>outline[i++] * scaleY;
                    var controlBegin = Euclidean3.fromCartesian(0, cpx1, cpy1, 0, 0, 0, 0, 0, void 0)

                    cpx2 = <number>outline[i++] * scaleX + offset;
                    cpy2 = <number>outline[i++] * scaleY;
                    var controlEnd = Euclidean3.fromCartesian(0, cpx2, cpy2, 0, 0, 0, 0, 0, void 0)

                    path.bezierCurveTo(controlBegin, controlEnd, point);

                    laste = pts[pts.length - 1];

                    if (laste) {
                        cpx0 = laste.x;
                        cpy0 = laste.y;
                        for (var i2 = 1, divisions = divs; i2 <= divisions; i2++) {
                            var t = i2 / divisions;
                            b3(t, cpx0, cpx1, cpx2, cpx);
                            b3(t, cpy0, cpy1, cpy2, cpy);
                        }
                    }
                    break;
            }
        }
    }

    return { offset: glyph.ha * scale, path: path };
}


export default function generateTextShapes(text: string, face: FontFace, parameters: { curveSegments?: number; font?: string; size?: number; style?: string; weight?: string }) {
    parameters = parameters || {};

    var size = parameters.size !== undefined ? parameters.size : 100;
    var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments : 4;

    // var font = parameters.font !== undefined ? parameters.font : 'helvetiker';
    // var weight = parameters.weight !== undefined ? parameters.weight : 'normal';
    // var style = parameters.style !== undefined ? parameters.style : 'normal';

    // TODO: What are these not being used?
    // FontUtils.face = font;
    // FontUtils.weight = weight;
    // FontUtils.style = style;

    // Get a Font data json object

    var data /* : { paths: Path<R2>[]; offset: number } */ = drawText(text, face, size, curveSegments);

    var paths = data.paths;
    var shapes: Shape[] = [];

    for (var p = 0, pl = paths.length; p < pl; p++) {

        Array.prototype.push.apply(shapes, paths[p].toShapes)();

    }

    return shapes;
}
