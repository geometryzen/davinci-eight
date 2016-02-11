import RigidBody from './RigidBody'
import Facet from '../core/Facet'
import Geometry from '../core/Geometry'
import Material from '../core/Material'
import readOnly from '../i18n/readOnly'
import Trail from './Trail'
import TrailConfig from './TrailConfig'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class VisualBody
 * @extends RigidBody
 */
export default class VisualBody extends RigidBody {
    private history: Trail

    /**
     * Property to prevent infinite recursion.
     *
     * @property dontLoop
     * @type boolean
     * @private
     */
    private dontLoop = false

    /**
     * @class VisualBody
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param [type = 'VisualBody'] {string}
     */
    constructor(geometry: Geometry, material: Material, type = 'VisualBody') {
        super(geometry, material, type)
        this.history = new Trail(this)
    }
    draw(ambients: Facet[]): void {
        if (this.history.config.enabled) {
            if (this.dontLoop) {
                super.draw(ambients)
            }
            else {
                this.history.snapshot()
                this.dontLoop = true;
                this.history.draw(ambients)
                this.dontLoop = false;
            }
        }
        else {
            super.draw(ambients)
        }
    }
    get trail(): TrailConfig {
        return this.history.config
    }
    set trail(unused) {
        throw new Error(readOnly('trail').message)
    }
}
