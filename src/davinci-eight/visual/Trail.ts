import Euclidean3 from '../math/Euclidean3';
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
    /**
     * @property rigidBody
     * @type RigidBody
     * @private
     */
    private rigidBody: RigidBody

    /**
     * @property Xs
     * @type {Euclidean3[]}
     * @private
     */
    private Xs: Euclidean3[] = []

    /**
     * @property Rs
     * @type {Euclidean3[]}
     * @private
     */
    private Rs: Euclidean3[] = []

    /**
     * @property config
     * @type TrailConfig
     * @public
     */
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
     * Records the RigidBody variables according to the interval property.
     *
     * @method snapshot()
     * @return {void}
     */
    snapshot(): void {
        if (this.counter % this.config.interval === 0) {
            this.Xs.unshift(this.rigidBody.X)
            this.Rs.unshift(this.rigidBody.R)
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
        const X = this.rigidBody.X
        const R = this.rigidBody.R
        for (let i = 0, iLength = this.Xs.length; i < iLength; i++) {
            this.rigidBody.X = this.Xs[i]
            this.rigidBody.R = this.Rs[i]
            this.rigidBody.draw(ambients)
        }
        // Restore the rigidBody position and attitude.
        this.rigidBody.X = X
        this.rigidBody.R = R
    }
}
