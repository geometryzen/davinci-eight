import Measure from '../math/Measure';

interface ImmutableMeasure<T> extends Measure<T> {
    direction(): T;
}

export default ImmutableMeasure;
