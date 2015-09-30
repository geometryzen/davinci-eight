import Cartesian3 = require('../math/Cartesian3');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * R = mn (i.e. a versor), with the constraint that R * ~R = ~R * R = 1
 *
 * The magnitude constraint means that a Rotor3 can be implemented with a unit scale,
 * leaving only 3 parameters. This should improve computational efficiency.
 */
interface Rotor3 extends Spinor3Coords {
    modified: boolean;
    copy(spinor: Spinor3Coords): Rotor3;
    exp(): Rotor3;
    multiply(spinor: Spinor3Coords): Rotor3;
    scale(s: number): Rotor3;
    product(a: Spinor3Coords, b: Spinor3Coords): Rotor3;
    reverse(): Rotor3;
    toString(): string;
    spinor(m: Cartesian3, n: Cartesian3): Rotor3;
}
export = Rotor3;
