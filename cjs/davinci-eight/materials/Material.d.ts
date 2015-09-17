import AttribLocation = require('../core/AttribLocation');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import UniformLocation = require('../core/UniformLocation');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
/**
 * @module EIGHT
 * @class Material
 * @implements IProgram
 */
declare class Material implements IProgram {
    private inner;
    private readyPending;
    programId: string;
    vertexShader: string;
    fragmentShader: string;
    private _refCount;
    private _monitors;
    private type;
    /**
     * @constructor
     * @param contexts {ContextMonitor[]}
     * @param type {string} The class name, used for logging and serialization.
     */
    constructor(contexts: ContextMonitor[], type: string);
    private makeReady(async);
    monitors: ContextMonitor[];
    addRef(): number;
    release(): number;
    use(canvasId: number): void;
    attributes: {
        [name: string]: AttribLocation;
    };
    uniforms: {
        [name: string]: UniformLocation;
    };
    enableAttrib(name: string): void;
    disableAttrib(name: string): void;
    contextFree(canvasId: number): void;
    contextGain(manager: ContextManager): void;
    contextLoss(canvasId: number): void;
    protected createProgram(): IProgram;
    uniform1f(name: string, x: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): void;
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void;
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void;
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void;
    uniformVector1(name: string, vector: Vector1): void;
    uniformVector2(name: string, vector: Vector2): void;
    uniformVector3(name: string, vector: Vector3): void;
    uniformVector4(name: string, vector: Vector4): void;
}
export = Material;
