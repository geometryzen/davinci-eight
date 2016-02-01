import Measure from '../math/Measure';
import Pseudo from '../math/Pseudo';

interface ImmutableMeasure<T> extends Measure<T>, Pseudo {
    direction(): T;
}

export default ImmutableMeasure;
