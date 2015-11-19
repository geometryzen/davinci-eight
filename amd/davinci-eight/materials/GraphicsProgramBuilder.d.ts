import IContextMonitor = require('../core/IContextMonitor');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * @class GraphicsProgramBuilder
 */
declare class GraphicsProgramBuilder {
    /**
     * @property aMeta
     * @private
     */
    private aMeta;
    /**
     * @property uParams
     * @private
     */
    private uParams;
    /**
     * @class GraphicsProgramBuilder
     * @constructor
     * @param primitive [DrawPrimitive]
     */
    constructor(primitive?: DrawPrimitive);
    /**
     * Declares that the material should have an `attribute` with the specified name and chunkSize.
     * @method attribute
     * @param name {string}
     * @param chunkSize {number}
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    attribute(name: string, chunkSize: number): GraphicsProgramBuilder;
    /**
     * Declares that the material should have a `uniform` with the specified name and type.
     * @method uniform
     * @param name {string}
     * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    uniform(name: string, type: string): GraphicsProgramBuilder;
    /**
     * @method build
     * @param contexts {IContextMonitor[]}
     * @return {GraphicsProgram}
     */
    build(contexts: IContextMonitor[]): GraphicsProgram;
}
export = GraphicsProgramBuilder;
