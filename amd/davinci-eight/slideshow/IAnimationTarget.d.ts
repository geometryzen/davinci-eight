/**
 * @class IAnimationTarget
 */
interface IAnimationTarget {
    /**
     * @property uuid
     * @type {string}
     * @readOnly
     */
    uuid: string;
    /**
     * @method getProperty
     * @param name {String}
     * @return {number[]}
     */
    getProperty(name: string): number[];
    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     */
    setProperty(name: string, value: number[]): void;
}
export = IAnimationTarget;
