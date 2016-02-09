import Glyph from '../geometries/Glyph';

export default class FontFace {
    resolution: number;
    glyphs: { [char: string]: Glyph }
    constructor() {
      // Do nothing.
    }
}
