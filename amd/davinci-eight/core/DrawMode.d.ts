/**
 * The enumerated modes of drawing WebGL primitives.
 * @class DrawMode
 */
declare enum DrawMode {
    /**
     * @property POINTS
     * @type {DrawMode}
     */
    POINTS = 0,
    /**
     * @property LINES
     * @type {DrawMode}
     */
    LINES = 1,
    /**
     * @property LINE_STRIP
     * @type {DrawMode}
     */
    LINE_STRIP = 2,
    /**
     * @property LINE_LOOP
     * @type {DrawMode}
     */
    LINE_LOOP = 3,
    /**
     * @property TRIANGLES
     * @type {DrawMode}
     */
    TRIANGLES = 4,
    /**
     * @property TRIANGLE_STRIP
     * @type {DrawMode}
     */
    TRIANGLE_STRIP = 5,
    /**
     * @property TRIANGLE_FAN
     * @type {DrawMode}
     */
    TRIANGLE_FAN = 6,
}
export = DrawMode;
