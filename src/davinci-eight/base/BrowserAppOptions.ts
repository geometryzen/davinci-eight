import BrowserWindow from './BrowserWindow'

/**
 * @class BrowserAppOptions
 */
interface BrowserAppOptions {
  /**
   * @attribute memcheck
   * @type boolean
   * @optional
   * @default false
   */
  memcheck?: boolean;

  /**
   * @attribute window
   * @type Window
   * @optional
   * @default window
   */
  window?: BrowserWindow;
}

export default BrowserAppOptions;
