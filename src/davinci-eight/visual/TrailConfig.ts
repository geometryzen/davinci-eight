import config from '../config'
import ErrorMode from '../core/ErrorMode'
import isBoolean from '../checks/isBoolean';
import mustBeBoolean from '../checks/mustBeBoolean';

/**
 *
 */
export class TrailConfig {

  /**
   * @default true
   */
  private _enabled = true;

  /**
   * Determines the number of animation frames between the recording of events.
   *
   * @default 10
   */
  public interval = 10;

  /**
   * Determines the maximum number of historical events that form the trail.
   *
   * @default 10
   */
  public retain = 10;

  /**
   * Intentionally undocumented.
   */
  constructor() {
    // Do nothing.
  }

  /**
   * Determines whether the trail will record historical events and draw them.
   *
   * @default true
   */
  public get enabled(): boolean {
    return this._enabled
  }
  public set enabled(enabled: boolean) {
    if (isBoolean(enabled)) {
      this._enabled = enabled
    }
    else {
      switch (config.errorMode) {
        case ErrorMode.IGNORE: {
          // Do nothing.
          break
        }
        case ErrorMode.WARNME: {
          console.warn("TrailConfig.enabled must be a boolean")
          break;
        }
        default: {
          mustBeBoolean('enabled', enabled)
        }
      }
    }
  }
}
