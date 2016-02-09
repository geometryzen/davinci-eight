import Glyph from '../geometries/Glyph';

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * @class FontFace
 */
export default class FontFace {
    /**
     * @property resolution
     * @type {number}
     */
    resolution: number;
    /**
     * @property glyphs
     * @type {{ [char: string]: Glyph }}
     */
    glyphs: { [char: string]: Glyph }
    /**
     * @class FontFace
     * @constructor
     */
    constructor() {
      // Do nothing.
    }
}
