import { VectorN } from './VectorN';

/**
 *
 */
export class Coords extends VectorN<number> {

    /**
     *
     */
    constructor(coords: number[], modified?: boolean, size?: number) {
        super(coords, modified, size);
    }

    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate to zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    approx(n: number): void {
        let max = 0;
        const coords = this.coords;
        const iLen = coords.length;
        for (let i = 0; i < iLen; i++) {
            max = Math.max(max, Math.abs(coords[i]));
        }
        const threshold = max * Math.pow(10, -n);
        for (let i = 0; i < iLen; i++) {
            if (Math.abs(coords[i]) < threshold) {
                coords[i] = 0;
            }
        }
    }

    /**
     *
     */
    equals(other: any): boolean {
        if (other instanceof Coords) {
            const iLen = this.coords.length;
            for (let i = 0; i < iLen; i++) {
                if (this.coords[i] !== other.coords[i]) {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
}
