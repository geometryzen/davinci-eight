import Rotor3 = require('../math/Rotor3');
/**
 * Functional constructor for producing a Rotor3.
 * The function is named so as to avoid case-insensitive collisions with Rotor3.
 * This will be exposed as `rotor3`.
 * We only need 2 parameters because the sum of the squares of the components is 1.
 * Perhaps we should think of the third as being part of a cache?
 * Extending this idea, what if
 */
declare function rotor3(): Rotor3;
export = rotor3;
