import G3 from '../math/G3';
import Facet from '../core/Facet';
import RigidBody from './RigidBody';
import mustBeObject from '../checks/mustBeObject';
import TrailConfig from './TrailConfig';

/**
 * @module EIGHT
 * @submodule visual
 * @class Trail
 */
export default class Trail {
    private rigidBody: RigidBody
    private Xs: G3[] = []
    private Rs: G3[] = []
    public config: TrailConfig = new TrailConfig();

    /**
     * @property counter
     * @type number
     * @private
     */
    private counter = 0

    /**
     * Constructs a trail for the specified rigidBody.
     * The maximum number of trail points defaults to 10.
     *
     * @class Trail
     * @constructor
     * @param rigidBody {RigidBody}
     * @param [retain = 10] {number}
     */
    constructor(rigidBody: RigidBody) {
        mustBeObject('rigidBody', rigidBody)
        this.rigidBody = rigidBody
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
        if (this.counter % this.config.interval === 0) {
            // We must clone because the properties are mutable.
            this.Xs.unshift(this.rigidBody.X.clone())
            this.Rs.unshift(this.rigidBody.R.clone())
        }
        while (this.Xs.length > this.config.retain) {
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
