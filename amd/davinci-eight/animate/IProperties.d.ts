import IUnknown = require('../core/IUnknown');
/**
 * @class IProperties
 * @extends IUnknown
 */
interface IProperties extends IUnknown {
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
export = IProperties;
