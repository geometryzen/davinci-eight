import { Glyph } from '../geometries/Glyph';
/**
 * @hidden
 */
export declare class FontFace {
    resolution: number;
    glyphs: {
        [char: string]: Glyph;
    };
    constructor();
}
