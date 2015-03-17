/**
 * The Field interface represents the operations that can be performed on quantities.
 *
 * @class Field
 */
interface Field<T> {
    add(rhs: T): T;
    sub(rhs: T): T;
    mul(rhs: T): T;
    div(rhs: T): T;
}
export = Field;