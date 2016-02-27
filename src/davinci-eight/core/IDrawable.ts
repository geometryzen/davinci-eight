import IContextConsumer from './IContextConsumer'
import Geometry from './Geometry'
import IMaterial from './IMaterial'
import IUnknown from './IUnknown'
import Facet from './Facet'

/**
 * @class IDrawable
 * @extends IUnknown
 * @extends IContextConsumer
 */
interface IDrawable extends IUnknown, IContextConsumer {

    /**
     * @property name
     * @type string
     */
    name: string

    /**
     * @property geometry
     * @type Geometry
     */
    geometry: Geometry

    /**
     * @property material
     * @type IMaterial
     */
    material: IMaterial

    /**
     * @property visible
     * @type boolean
     */
    visible: boolean

    /**
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void

    /**
     * @method setUniforms
     * @return {void}
     */
    setUniforms(): void

}

export default IDrawable
