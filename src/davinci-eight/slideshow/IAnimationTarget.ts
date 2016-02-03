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
     * @return {IAnimationTarget}
     * @chainable
     */
    setProperty(name: string, value: number[]): IAnimationTarget;
}

export default IAnimationTarget;
