import AttribLocation = require('../core/AttribLocation');
import IContextProvider = require('../core/IContextProvider');
import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Shareable = require('../utils/Shareable');
import UniformLocation = require('../core/UniformLocation');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
/**
 * @class Material
 * @extends Shareable
 * @extends IMaterial
 */
declare class Material extends Shareable implements IMaterial {
    private inner;
    private readyPending;
    private _monitors;
    private type;
    programId: string;
    /**
     * @class Material
     * @constructor
     * @param contexts {ContextMonitor[]}
     * @param type {string} The class name, used for logging and serialization.
     */
    constructor(contexts: ContextMonitor[], type: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    protected makeReady(async: boolean): void;
    /**
     * @property monitors
     * @type {ContextMonitor[]}
     */
    monitors: ContextMonitor[];
    fragmentShader: string;
    use(canvasId: number): void;
    attributes(canvasId: number): {
        [name: string]: AttribLocation;
    };
    uniforms(canvasId: number): {
        [name: string]: UniformLocation;
    };
    enableAttrib(name: string, canvasId: number): void;
    disableAttrib(name: string, canvasId: number): void;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    protected createProgram(): IMaterial;
    uniform1f(name: string, x: number, canvasId: number): void;
    uniform2f(name: string, x: number, y: number, canvasId: number): void;
    uniform3f(name: string, x: number, y: number, z: number, canvasId: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number): void;
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1, canvasId: number): void;
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId: number): void;
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId: number): void;
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId: number): void;
    uniformVector1(name: string, vector: Vector1, canvasId: number): void;
    uniformVector2(name: string, vector: Vector2, canvasId: number): void;
    uniformVector3(name: string, vector: Vector3, canvasId: number): void;
    uniformVector4(name: string, vector: Vector4, canvasId: number): void;
    vertexShader: string;
}
export = Material;
