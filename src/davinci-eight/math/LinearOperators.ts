
/**
 *
 */
interface LinearOperators<T> {
    __add__(other: number | T): T
    __radd__(other: number | T): T
    __sub__(other: number | T): T
    __rsub__(other: number | T): T
    __pos__(): T
    __neg__(): T
    __tilde__(): T
}

export = LinearOperators