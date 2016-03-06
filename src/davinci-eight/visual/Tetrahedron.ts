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
   * @param options {TetrahedronOptions}
   */
  constructor(options: TetrahedronOptions) {
    super('Tetrahedron', void 0, void 0, options.engine)
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
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
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
