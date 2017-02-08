import Geometric3 from '../math/Geometric3';

/**
 *
 */
export default class ModelE3 {

  /**
   * The name of the property that designates the attitude.
   */
  public static readonly PROP_ATTITUDE = 'R';

  /**
   * The name of the property that designates the position.
   */
  public static readonly PROP_POSITION = 'X';

  private readonly _position = Geometric3.zero(false);
  private readonly _attitude = Geometric3.one(false);

  /**
   * <p>
   * A collection of properties for Rigid Body Modeling.
   * </p>
   * <p>
   * ModelE3 implements Facet required for manipulating a composite object.
   * </p>
   * <p>
   * Constructs a ModelE3 at the origin and with unity attitude.
   * </p>
   */
  constructor() {
    this._position.modified = true;
    this._attitude.modified = true;
  }

  /**
   * <p>
   * The <em>attitude</em>, a rotor.
   * </p>
   */
  get R(): Geometric3 {
    return this._attitude;
  }
  set R(attitude: Geometric3) {
    this._attitude.copySpinor(attitude);
  }

  /**
   * <p>
   * The <em>position</em>, a vector.
   * </p>
   */
  get X(): Geometric3 {
    return this._position;
  }
  set X(position: Geometric3) {
    this._position.copyVector(position);
  }
}
