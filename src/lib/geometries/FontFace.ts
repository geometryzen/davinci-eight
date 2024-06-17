import { Glyph } from "../geometries/Glyph";

/**
 * @hidden
 */
export class FontFace {
    resolution: number;
    glyphs: { [char: string]: Glyph };
    constructor() {
        // Do nothing.
    }
}
