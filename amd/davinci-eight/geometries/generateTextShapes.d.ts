import FontFace = require('../geometries/FontFace');
import Shape = require('../geometries/Shape');
declare function generateTextShapes(text: string, face: FontFace, parameters: {
    curveSegments?: number;
    font?: string;
    size?: number;
    style?: string;
    weight?: string;
}): Shape[];
export = generateTextShapes;
