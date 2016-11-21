import GeometryOptions from './GeometryOptions';

/**
 * The options when creating a BoxGeometry.
 */
interface BoxGeometryOptions extends GeometryOptions {
    /**
     *
     */
    depth?: number;

    /**
     *
     */
    height?: number;

    /**
     *
     */
    openBack?: boolean;

    /**
     *
     */
    openBase?: boolean;

    /**
     *
     */
    openFront?: boolean;

    /**
     *
     */
    openLeft?: boolean;

    /**
     *
     */
    openRight?: boolean;

    /**
     *
     */
    openCap?: boolean;

    /**
     *
     */
    width?: number;
}

export default BoxGeometryOptions;
