import incLevel from '../base/incLevel';
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
   * @param [level = 0] {number}
   */
  constructor(options: TetrahedronOptions, level = 0) {
    super('Tetrahedron', void 0, void 0, options.engine, incLevel(level))
    const geoOptions: TetrahedronGeometryOptions = {}
    geoOptions.engine = options.engine
    const geometry = new TetrahedronGeometry(geoOptions)
    const matOptions: MeshMaterialOptions = null
    const material = new MeshMaterial(matOptions, options.engine, 0)
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
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
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
