import GraphicsProgram = require('../materials/GraphicsProgram');
import IContextMonitor = require('../core/IContextMonitor');
import Primitive = require('../geometries/Primitive');
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
     * Constructs the <code>GraphicsProgramBuilder</code>.
     * The lifecycle for using this generator is
     * <ol>
     * <li>Create an instance of the <code>GraphicsProgramBuilder.</code></li>
     * <li>Make calls to the <code>attribute</code> and/or <code>uniform</code> methods in any order.</li>
     * <li>Call the <code>build</code> method to create the <code>GraphicsProgram</code>.</li>
     * </ol>
     * The same builder instance may be reused to create other programs.
     * @class GraphicsProgramBuilder
     * @constructor
     * @param [primitive] {Primitive}
     */
    constructor(primitive?: Primitive);
    /**
     * Declares that the material should have an `attribute` with the specified name and size.
     * @method attribute
     * @param name {string}
     * @param size {number}
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    attribute(name: string, size: number): GraphicsProgramBuilder;
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
     * Creates a GraphicsProgram. This may contain multiple <code>WebGLProgram</code>(s),
     * one for each context supplied. The generated program is compiled and linked
     * for each context in response to context gain and loss events.
     * @method build
     * @param contexts {IContextMonitor[]}
     * @return {GraphicsProgram}
     */
    build(contexts: IContextMonitor[]): GraphicsProgram;
}
export = GraphicsProgramBuilder;
