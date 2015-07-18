/**
 * A DrawContext is the argument for the Drawable draw() method.
 */
interface DrawContext {
    /**
     * The time of the current animation frame.
     */
    time(): number;
}
export = DrawContext;
