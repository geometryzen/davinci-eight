import IProperties = require('../animate/IProperties')
import IUnknown = require('../core/IUnknown')
/**
 * @class IAnimation
 * @extends IUnknown
 */
interface IAnimation extends IUnknown {
  /**
   * @method apply
   * @param offset {number}
   * @return {void}
   */
  apply(offset?: number): void;
  /**
   * @method skip
   * @return {void}
   */
  skip(): void;
  /**
   * @method hurry
   * @param factor {number}
   * @return {void}
   */
  hurry(factor: number): void;
  /**
   * @method extra
   * @return {number}
   */
  extra(): number;
  /**
   * @method done
   * @return {boolean}
   */
  done(): boolean;
}

export = IAnimation
