import { GeometryMode } from "../geometries/GeometryMode";
import { SpinorE3 } from "../math/SpinorE3";
import { VectorE3 } from "../math/VectorE3";

/**
 *
 */
export interface CylinderOptions extends Record<string, unknown> {
    /**
     * Defaults to e2.
     */
    axis?: VectorE3;
    /**
     *
     */
    color?: { r: number; g: number; b: number };
    /**
     *
     */
    colored?: boolean;
    /**
     *
     */
    heightSegments?: number;
    /**
     * Defaults to 1.
     */
    length?: number;
    /**
     *
     */
    meridian?: VectorE3;
    /**
     *
     */
    mode?: "mesh" | "wire" | "point" | GeometryMode;
    /**
     *
     */
    offset?: VectorE3;
    /**
     * Defaults to false.
     */
    openBase?: boolean;
    /**
     * Defaults to false.
     */
    openCap?: boolean;
    /**
     * Defaults to false.
     */
    openWall?: boolean;
    /**
     * Defaults to 1.
     */
    radius?: number;
    /**
     *
     */
    textured?: boolean;
    /**
     *
     */
    thetaSegments?: number;
    /**
     *
     */
    tilt?: SpinorE3;
    /**
     *
     */
    transparent?: boolean;
}
