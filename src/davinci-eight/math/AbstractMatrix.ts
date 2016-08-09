import mustBeDefined from '../checks/mustBeDefined';
import mustBeInteger from '../checks/mustBeInteger';
import expectArg from '../checks/expectArg';
import readOnly from '../i18n/readOnly';

/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 */
export default class AbstractMatrix<T extends { elements: Float32Array }> {

    private _elements: Float32Array;
    private _length: number;
    private _dimensions: number;
    public modified: boolean;

    /**
     * @param elements
     * @param dimensions
     */
    constructor(elements: Float32Array, dimensions: number) {
        this._elements = mustBeDefined('elements', elements)
        this._dimensions = mustBeInteger('dimensions', dimensions)
        this._length = dimensions * dimensions
        expectArg('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
        this.modified = false;
    }

    get dimensions(): number {
        return this._dimensions
    }
    set dimensions(unused) {
        throw new Error(readOnly('dimensions').message)
    }

    get elements(): Float32Array {
        return this._elements;
    }
    set elements(elements: Float32Array) {
        expectArg('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
        this._elements = elements;
    }

    copy(m: T): T {
        this.elements.set(m.elements)
        return <T><any>this;
    }

    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    getElement(row: number, column: number): number {
        return this.elements[row + column * this._dimensions]
    }

    /**
     * Determines whether this matrix is the identity matrix.
     */
    isOne(): boolean {
        for (let i = 0; i < this._dimensions; i++) {
            for (let j = 0; j < this._dimensions; j++) {
                const value = this.getElement(i, j)
                if (i === j) {
                    if (value !== 1) {
                        return false
                    }
                }
                else {
                    if (value !== 0) {
                        return false
                    }
                }
            }
        }
        return true
    }

    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    setElement(row: number, column: number, value: number): void {
        this.elements[row + column * this._dimensions] = value
    }
}
