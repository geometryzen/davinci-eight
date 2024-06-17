import { GeometryKey } from "../core/GeometryKey";
import { VectorE3 } from "../math/VectorE3";
import { GeometryMode } from "./GeometryMode";
import { GeometryOptions } from "./GeometryOptions";

/**
 * @hidden
 */
export interface GridGeometryOptions extends GeometryOptions, GeometryKey {
    /**
     * A parametric function determining the vertex positions.
     */
    aPosition?: (u: number, v: number) => VectorE3;
    /**
     * A parametric function determining the vertex normals.
     */
    aNormal?: (u: number, v: number) => VectorE3;
    /**
     * A parametric function determining the vertex colors.
     */
    aColor?: (u: number, v: number) => { r: number; g: number; b: number };
    /**
     * A parametric function determining the vertex colors.
     */
    aCoords?: (u: number, v: number) => { u: number; v: number };
    /**
     * @default WIRE
     */
    mode?: GeometryMode;
    /**
     * @default 0
     */
    uMin?: number;
    /**
     * @default 1
     */
    uMax?: number;
    /**
     * @default 1
     */
    uSegments?: number;
    /**
     *
     */
    uClosed?: boolean;
    /**
     * @default 0
     */
    vMin?: number;
    /**
     * @default 1
     */
    vMax?: number;
    /**
     * @default 1
     */
    vSegments?: number;
    /**
     *
     */
    vClosed?: boolean;
}
