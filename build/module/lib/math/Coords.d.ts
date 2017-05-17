import { VectorN } from './VectorN';
/**
 *
 */
export declare class Coords extends VectorN<number> {
    /**
     *
     */
    constructor(coords: number[], modified?: boolean, size?: number);
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate to zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    approx(n: number): void;
    /**
     *
     */
    equals(other: any): boolean;
}
