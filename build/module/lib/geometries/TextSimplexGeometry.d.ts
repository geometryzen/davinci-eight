import { FontFace } from '../geometries/FontFace';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
/**
 * @hidden
 */
export declare class TextSimplexGeometry extends /*Extrude*/ SimplexPrimitivesBuilder {
    constructor(text: string, face: FontFace, parameters: {
        amount?: number;
        bevelEnabled?: boolean;
        bevelSize?: number;
        bevelThickness?: number;
        height?: number;
    });
}
