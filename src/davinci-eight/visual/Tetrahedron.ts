import Mesh from '../core/Mesh'
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import TetrahedronOptions from './TetrahedronOptions'
import TetrahedronGeometryOptions from '../geometries//TetrahedronGeometryOptions'
import TetrahedronGeometry from '../geometries/TetrahedronGeometry'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Tetrahedron
 * @extends Mesh
 */
export default class Tetrahedron extends Mesh {

  /**
   * @class Tetrahedron
   * @constructor
   * @param [options] {TetrahedronOptions}
   */
  constructor(options: TetrahedronOptions = {}) {
    super(void 0, void 0, options.engine)
    this.setLoggingName('Tetrahedron')
    const geoOptions: TetrahedronGeometryOptions = {}
    geoOptions.engine = options.engine
    const geometry = new TetrahedronGeometry(geoOptions)
    const matOptions: MeshMaterialOptions = null
    const material = new MeshMaterial(matOptions, options.engine)
    this.geometry = geometry
    this.material = material
    geometry.release()
    material.release()
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }

  /**
   * @property radius
   * @type number
   * @default 1
   */
  get radius(): number {
    return this.getPrincipalScale('radius')
  }
  set radius(radius: number) {
    this.setPrincipalScale('radius', radius)
  }
}
