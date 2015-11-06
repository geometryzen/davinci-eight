import Measure = require('../math/Measure');
import Pseudo = require('../math/Pseudo');
interface ImmutableMeasure<T> extends Measure<T>, Pseudo {
    unitary(): T;
}
export = ImmutableMeasure;
