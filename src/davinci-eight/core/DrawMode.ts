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
     * @property LINE_LOOP
     * @type {DrawMode}
     */
    LINE_LOOP,

    /**
     * @property TRIANGLES
     * @type {DrawMode}
     */
    TRIANGLES,

    /**
     * @property TRIANGLE_STRIP
     * @type {DrawMode}
     */
    TRIANGLE_STRIP,

    /**
     * @property TRIANGLE_FAN
     * @type {DrawMode}
     */
    TRIANGLE_FAN
}

export default DrawMode;
