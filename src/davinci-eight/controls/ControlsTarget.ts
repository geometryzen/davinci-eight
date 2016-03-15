import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'

/**
 * @class ControlTarget
 */
interface ControlsTarget {

  /**
   * @method getAttitude
   * @return {SpinorE3}
   */
  getAttitude(): SpinorE3;

  /**
   * @method setAttitude
   * @param attitude {SpinorE3}
   * @return {void}
   */
  setAttitude(attitude: SpinorE3): void;

  /**
   * @method getPosition
   * @return {VectorE3}
   */
  getPosition(): VectorE3;

  /**
   * @method setPosition
   * @param position {VectorE3}
   * @return {VectorE3}
   */
  setPosition(position: VectorE3): void;
}

export default ControlsTarget;
