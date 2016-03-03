import Mesh from '../core/Mesh'
import MeshMaterial from '../materials/MeshMaterial'
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
    super('Tetrahedron', void 0, void 0)
    const geoOptions: TetrahedronGeometryOptions = {}
    const geometry = new TetrahedronGeometry(geoOptions)
    const material = new MeshMaterial()
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
