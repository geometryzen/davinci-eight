import AnimationAppOptions from '../base/AnimationAppOptions'

/**
 * @class MultiViewAppOptions
 * @extends AnimationAppOptions
 */
interface MultViewAppOptions extends AnimationAppOptions {
  /**
   * <p>
   * The initial number of views. Views may be added and removed later.
   * </p>
   *
   * @attribute numViews
   * @type number
   * @optional
   * @default 1
   */
  numViews?: number;
}

export default MultViewAppOptions
