import AbelianOperators from '../math/AbelianOperators';
/**
 * Special methods for operators on elements of linear spaces.
 * This is provided for interface consistency.
 * It may not adhere to strict mathematical definitions.
 */
interface LinearOperators<T, UNIT> extends AbelianOperators<T, UNIT> {
    /**
     * Unary ~
     */
    __tilde__(): T
}

export default LinearOperators;
