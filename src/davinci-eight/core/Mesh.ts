import {Color} from './Color';
import ColorFacet from '../facets/ColorFacet'
import Drawable from './Drawable'
import {Engine} from './Engine'
import {Geometric3} from '../math/Geometric3'
import Geometry from './Geometry'
import Material from './Material'
import AbstractMesh from '../core/AbstractMesh'
import Matrix4 from '../math/Matrix4'
import ModelFacet from '../facets/ModelFacet'
import PointSizeFacet from '../facets/PointSizeFacet'
import notSupported from '../i18n/notSupported'

const COLOR_FACET_NAME = 'color'
const MODEL_FACET_NAME = 'model'
const POINT_FACET_NAME = 'point'

/**
 * @module EIGHT
 * @submodule core
 */

// Mesh is designed to be equivalent to the Three.js Mesh in the sense that it assumes
// particlular facets that give the Drawable position, attitude, and color.
// The position and attitude are dimensionless, mutable, and readOnly quantities for performance.

/**
 * @class Mesh
 * @extends Drawable
 */
export class Mesh extends Drawable implements AbstractMesh {

  /**
   * @class Mesh
   * @constructor
   * @param geometry {Geometry}
   * @param material {Material}
   * @param engine {Engine} The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
   */
  constructor(geometry: Geometry, material: Material, engine: Engine) {
    super(geometry, material, engine)
    this.setLoggingName('Mesh')

    const modelFacet = new ModelFacet()
    this.setFacet(MODEL_FACET_NAME, modelFacet)

    const colorFacet = new ColorFacet()
    this.setFacet(COLOR_FACET_NAME, colorFacet)

    const pointFacet = new PointSizeFacet()
    this.setFacet(POINT_FACET_NAME, pointFacet)
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }

  /**
   * Attitude (spinor)
   *
   * @property R
   * @type Geometric3
   */
  get R(): Geometric3 {
    const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    if (facet) {
      return facet.R
    }
    else {
      throw new Error(notSupported('R').message)
    }
  }
  set R(R: Geometric3) {
    const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    if (facet) {
      facet.R.copySpinor(R)
    }
    else {
      throw new Error(notSupported('R').message)
    }
  }

  /**
   * Color
   *
   * @property color
   * @type Color
   */
  get color(): Color {
    const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
    if (facet) {
      return facet.color
    }
    else {
      throw new Error(notSupported('color').message)
    }
  }
  set color(color: Color) {
    const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
    if (facet) {
      facet.color.copy(color)
    }
    else {
      throw new Error(notSupported('color').message)
    }
  }

  /**
   * Position (vector)
   *
   * @property X
   * @type Geometric3
   */
  get X(): Geometric3 {
    const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    if (facet) {
      return facet.X
    }
    else {
      throw new Error(notSupported('X').message)
    }
  }
  set X(X: Geometric3) {
    const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    if (facet) {
      facet.X.copyVector(X)
    }
    else {
      throw new Error(notSupported('X').message)
    }
  }

  /**
   * @property stress
   * @type Matrix4
   */
  get stress(): Matrix4 {
    const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    if (facet) {
      return facet.stress
    }
    else {
      throw new Error(notSupported('stress').message)
    }
  }
  set stress(stress: Matrix4) {
    const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    if (facet) {
      facet.stress.copy(stress)
    }
    else {
      throw new Error(notSupported('stress').message)
    }
  }

  /**
   * @method getPrincipalScale
   * @param name {string}
   * @return {number}
   */
  protected getPrincipalScale(name: string): number {
    const geometry = this.geometry
    if (geometry) {
      const value = geometry.getPrincipalScale(name)
      geometry.release()
      return value
    }
    else {
      throw new Error(`getPrincipalScale('${name}') is not available because geometry is not defined.`)
    }
  }

  /**
   * @method setPrincipalScale
   * @param name {string}
   * @param value {number}
   * @return {void}
   * @protected
   */
  protected setPrincipalScale(name: string, value: number): void {
    const geometry = this.geometry
    geometry.setPrincipalScale(name, value)
    const scaling = geometry.scaling
    this.stress.copy(scaling)
    geometry.release()
  }
}
