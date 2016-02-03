/**
 * @class EventEmitter
 */
export default class EventEmitter<T> {
  /**
   * The name of the event is the key to the map.
   */
  private _eventRegistry: { [name: string]: ((eventName: string, key: string, value: number, source: T) => any)[] };
  private owner: T;

  /**
   * @class EventEmitter
   * @constructor
   * @param owner
   */
  constructor(owner: T) {
    this.owner = owner;
  }

  public addEventListener(eventName: string, callback: (eventName: string, key: string, value: number, source: T) => void) {
    this._eventRegistry = this._eventRegistry || {};

    let listeners = this._eventRegistry[eventName];
    if (!listeners) {
      listeners = this._eventRegistry[eventName] = [];
    }

    if (listeners.indexOf(callback) === -1) {
      listeners.push(callback);
    }
    return callback;
  }

  public removeEventListener(eventName, callback: (eventName: string, key: string, value: number, source: T) => any) {
    this._eventRegistry = this._eventRegistry || {};

    const listeners = this._eventRegistry[eventName];
    if (!listeners)
      return;

    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * @property emit
   * @param eventName {string}
   * @param key {string}
   * @param value {number}
   */
  public emit(eventName: string, key: string, value: number): any {
    if (this._eventRegistry) {
      const listeners = this._eventRegistry[eventName];
      if (listeners) {
        const iLength = listeners.length;
        if (iLength) {
          for (let i = 0; i < iLength; i++) {
            listeners[i](eventName, key, value, this.owner);
          }
        }
      }
    }
  }
}
