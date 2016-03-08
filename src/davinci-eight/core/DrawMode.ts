/**
 * @module EIGHT
 * @submodule core
 */

/**
 * The enumerated modes of drawing WebGL primitives.
 * @class DrawMode
 */
enum DrawMode {
    /**
     * @property POINTS
     * @type {DrawMode}
     */
    POINTS,

    /**
     * @property LINES
     * @type {DrawMode}
     */
    LINES,

    /**
     * @property LINE_STRIP
     * @type {DrawMode}
     */
    LINE_STRIP,

    /**
     * @property TRIANGLES
     * @type {DrawMode}
     */
    TRIANGLES,

    /**
     * @property TRIANGLE_STRIP
     * @type {DrawMode}
     */
    TRIANGLE_STRIP
}

export default DrawMode;
