/**
 * Records reference count changes in a system-wide data structure.
 * A change is normally either +1 or -1.
 * a change of 0 is interpreted as a command in the uuid parameter and a context in the name.
 * Commands are:
 * 'dump'
 * 'reset'
 * 'skip'
 * 'trace'
 */
declare function refChange(uuid: string, change: number, name?: string): void;
export = refChange;
