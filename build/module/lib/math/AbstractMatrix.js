import { lockable } from '../core/Lockable';
import { TargetLockedError } from '../core/Lockable';
import { mustBeDefined } from '../checks/mustBeDefined';
import { mustBeInteger } from '../checks/mustBeInteger';
import { expectArg } from '../checks/expectArg';
import { readOnly } from '../i18n/readOnly';
/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 */
var AbstractMatrix = (function () {
    /**
     * @param elements
     * @param dimensions
     */
    function AbstractMatrix(elements, dimensions) {
        this.lock_ = lockable();
        this.elements_ = mustBeDefined('elements', elements);
        this.dimensions_ = mustBeInteger('dimensions', dimensions);
        this.length_ = dimensions * dimensions;
        expectArg('elements', elements).toSatisfy(elements.length === this.length_, 'elements must have length ' + this.length_);
        this.modified = false;
    }
    AbstractMatrix.prototype.isLocked = function () {
        return this.lock_.isLocked();
    };
    AbstractMatrix.prototype.lock = function () {
        return this.lock_.lock();
    };
    AbstractMatrix.prototype.unlock = function (token) {
        return this.lock_.unlock(token);
    };
    Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
        get: function () {
            return this.dimensions_;
        },
        set: function (unused) {
            throw new Error(readOnly('dimensions').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMatrix.prototype, "elements", {
        get: function () {
            return this.elements_;
        },
        set: function (elements) {
            if (this.isLocked()) {
                throw new TargetLockedError('elements');
            }
            expectArg('elements', elements).toSatisfy(elements.length === this.length_, "elements length must be " + this.length_);
            this.elements_ = elements;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMatrix.prototype.copy = function (m) {
        if (this.isLocked()) {
            throw new TargetLockedError('copy');
        }
        this.elements.set(m.elements);
        return this;
    };
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    AbstractMatrix.prototype.getElement = function (row, column) {
        return this.elements[row + column * this.dimensions_];
    };
    /**
     * Determines whether this matrix is the identity matrix.
     */
    AbstractMatrix.prototype.isOne = function () {
        for (var i = 0; i < this.dimensions_; i++) {
            for (var j = 0; j < this.dimensions_; j++) {
                var value = this.getElement(i, j);
                if (i === j) {
                    if (value !== 1) {
                        return false;
                    }
                }
                else {
                    if (value !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    AbstractMatrix.prototype.setElement = function (row, column, value) {
        if (this.isLocked()) {
            throw new TargetLockedError('setElement');
        }
        this.elements[row + column * this.dimensions_] = value;
    };
    return AbstractMatrix;
}());
export { AbstractMatrix };
