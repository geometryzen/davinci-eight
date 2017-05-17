import { Glyph } from '../geometries/Glyph';
export declare class FontFace {
    resolution: number;
    glyphs: {
        [char: string]: Glyph;
    };
    constructor();
}
