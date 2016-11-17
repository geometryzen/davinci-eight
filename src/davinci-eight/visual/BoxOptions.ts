import VisualOptions from './VisualOptions';

/**
 *
 */
interface BoxOptions extends VisualOptions {
    /**
     * Determines whether the Box is rendered with lines or triangles.
     */
    wireFrame?: boolean;
    /**
     * 
     */
    color?: { r: number; g: number; b: number };

    /**
     * The extent of the box in the z-axis direction.
     */
    depth?: number;

    /**
     * The extent of the box in the y-axis direction.
     */
    height?: number;

    /**
     *
     * @default false
     */
    openBack?: boolean;

    /**
     *
     * @default false
     */
    openBase?: boolean;

    /**
     *
     * @default false
     */
    openFront?: boolean;

    /**
     *
     * @default false
     */
    openLeft?: boolean;

    /**
     *
     * @default false
     */
    openRight?: boolean;

    /**
     *
     * @default false
     */
    openCap?: boolean;

    /**
     * The extent of the box in the x-axis direction.
     */
    width?: number;
}

export default BoxOptions;
