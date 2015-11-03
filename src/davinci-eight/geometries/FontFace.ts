import Glyph = require('../geometries/Glyph')

/**
 * @class FontFace
 */
class FontFace {
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
    }
}

export = FontFace