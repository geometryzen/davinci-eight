import core from '../core'
import ErrorMode from '../core/ErrorMode'
import isBoolean from '../checks/isBoolean';
import mustBeBoolean from '../checks/mustBeBoolean';
// import mustBeGE from '../checks/mustBeGE';
'use strict';
/**
 * @class TrailConfig
 */
export default class TrailConfig {
  /**
   * @property _enabled
   * @type boolean
   * @default true
   */
  private _enabled = true
  public interval = 10
  public retain = 10;
  constructor() {
    // Do nothing.
  }
  public get enabled() {
    return this._enabled
  }
  public set enabled(enabled: boolean) {
    if (isBoolean(enabled)) {
      this._enabled = enabled
    }
    else {
      switch (core.errorMode) {
        case ErrorMode.IGNORE: {
          // Do nothing.
        }
          break;
        case ErrorMode.WARNME: {
          console.warn("TrailConfig.enabled must be a boolean")
        }
          break;
        default: {
          mustBeBoolean('enabled', enabled)
        }
      }
    }
  }
}
