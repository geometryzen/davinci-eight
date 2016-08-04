import VisualOptions from './VisualOptions'

/**
 *
 */
interface BoxOptions extends VisualOptions {
    /**
     * 
     */
    color?: { r: number; g: number; b: number };

    /**
     *
     * @default 1
     */
    depth?: number;

    /**
     *
     * @default 1
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
     *
     * @default 1
     */
    width?: number;
}

export default BoxOptions
