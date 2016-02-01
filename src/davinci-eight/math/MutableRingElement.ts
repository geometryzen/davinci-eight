interface MutableRingElement<T> {
    one(): T;
    // FIXME: DRY, this should come from a linear element.
    zero(): T;
}
export default MutableRingElement;
