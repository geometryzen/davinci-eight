import { Glyph } from '../geometries/Glyph';

export class FontFace {
  resolution: number;
  glyphs: { [char: string]: Glyph };
  constructor() {
    // Do nothing.
  }
}
