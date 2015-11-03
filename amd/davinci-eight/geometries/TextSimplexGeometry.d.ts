import FontFace = require('../geometries/FontFace');
import SimplexGeometry = require('../geometries/SimplexGeometry');
/**
 * Intentionally undocumented
 */
declare class TextSimplexGeometry extends SimplexGeometry {
    constructor(text: string, face: FontFace, parameters: {
        amount?: number;
        bevelEnabled?: boolean;
        bevelSize?: number;
        bevelThickness?: number;
        height?: number;
    });
}
export = TextSimplexGeometry;
