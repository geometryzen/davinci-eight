import G3 from '../math/G3';
import Facet from '../core/Facet';
import RigidBody from './RigidBody';
import mustBeGE from '../checks/mustBeGE';
import mustBeObject from '../checks/mustBeObject';

/**
 * @module EIGHT
 * @submodule visual
 * @class Trail
 */
export default class Trail {
    private rigidBody: RigidBody
    private Xs: G3[] = []
    private Rs: G3[] = []

    /**
     * @property counter
     * @type number
     * @private
     */
    private counter = 0

    /**
     * @property maxLength
     * @type number
     */
    maxLength: number

    /**
     * @property spacing
     * @type number
     * @default 60
     */
    spacing = 60

    /**
     * Constructs a trail for the specified rigidBody.
     * The maximum number of trail points defaults to 10.
     *
     * @class Trail
     * @constructor
     * @param rigidBody {RigidBody}
     * @param [maxLength = 10] {number}
     */
    constructor(rigidBody: RigidBody, maxLength = 10) {
        mustBeObject('rigidBody', rigidBody)
        mustBeGE('maxLength', maxLength, 0)
        this.rigidBody = rigidBody
        this.maxLength = maxLength
    }

    /**
     * Records the RigidBody variables according to the __spacing__ property.
     *
     * @method snapshot()
     * @return {void}
     */
    snapshot(): void {
        // It would be much more efficient to allocate an array
        // of the right size and treat it as a circular buffer.
        // We could also reuse the G3 objects.
        if (this.counter % this.spacing === 0) {
            // We must clone because the properties are mutable.
            this.Xs.unshift(this.rigidBody.X.clone())
            this.Rs.unshift(this.rigidBody.R.clone())
        }
        while (this.Xs.length > this.maxLength) {
            this.Xs.pop()
            this.Rs.pop()
        }
        this.counter++
    }

    /**
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void {
        // Save the rigidBody position and attitude so that we can restore them later.
        const X = this.rigidBody.X.clone()
        const R = this.rigidBody.R.clone()
        for (let i = 0, iLength = this.Xs.length; i < iLength; i++) {
            this.rigidBody.X.copy(this.Xs[i])
            this.rigidBody.R.copy(this.Rs[i])
            this.rigidBody.draw(ambients)
        }
        // Restore the rigidBody position and attitude.
        this.rigidBody.X.copy(X)
        this.rigidBody.R.copy(R)
    }
}
