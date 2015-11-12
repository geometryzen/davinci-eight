import Measure = require('../math/Measure')
import Pseudo = require('../math/Pseudo')

interface ImmutableMeasure<T> extends Measure<T>, Pseudo {
    direction(): T;
}
export = ImmutableMeasure