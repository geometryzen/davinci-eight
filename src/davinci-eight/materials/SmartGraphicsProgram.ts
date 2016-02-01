import AttribMetaInfo from '../core/AttribMetaInfo';
import createGraphicsProgram from '../programs/createGraphicsProgram';
import fragmentShader from '../programs/fragmentShader';
import getAttribVarName from '../core/getAttribVarName';
import getUniformVarName from '../core/getUniformVarName';
import GeometryMeta from '../geometries/GeometryMeta';
import glslAttribType from '../programs/glslAttribType';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IGraphicsProgram from '../core/IGraphicsProgram';
import GraphicsProgram from '../materials/GraphicsProgram';
import mergeStringMapList from '../utils/mergeStringMapList';
import MeshMaterialParameters from '../materials/MeshMaterialParameters';
import MonitorList from '../scene/MonitorList';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeInteger from '../checks/mustBeInteger';
import readOnly from '../i18n/readOnly';
import UniformMetaInfo from '../core/UniformMetaInfo';
import vColorRequired from '../programs/vColorRequired';
import vertexShader from '../programs/vertexShader';
import vLightRequired from '../programs/vLightRequired';

/**
 * <p>
 * SmartGraphicsProgram constructs a vertex shader and a fragment shader.
 * The shader codes are configured by specifying attributes, uniforms and varyings.
 * The default configuration is produces minimal shaders.
 * <p> 
 * @class SmartGraphicsProgram
 * @extends GraphicsProgram
 */
export default class SmartGraphicsProgram extends GraphicsProgram {
    public aParams: { [name: string]: { glslType: string } } = {};
    public uParams: { [name: string]: { glslType: string } } = {};
    private vColor: boolean = false;
    private vLight: boolean = false;
    /**
     * @class SmartGraphicsProgram
     * @constructor
     * @param aParams
     * @param uParams
     * @param vColor {boolean}
     * @param vLight {boolean}
     * @param [contexts] {IContextMonitor[]}
     */
    constructor(
        aParams: { [name: string]: { glslType: string } },
        uParams: { [name: string]: { glslType: string } },
        vColor: boolean,
        vLight: boolean,
        contexts?: IContextMonitor[]
    ) {
        super('SmartGraphicsProgram', contexts);
        this.aParams = aParams;
        this.uParams = uParams;
        this.vColor = vColor;
        this.vLight = vLight;
        // We can start eagerly or omit this call entirely and wait till we are used.
        this.makeReady(false);
    }

    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     */
    protected createGraphicsProgram(): IGraphicsProgram {
        // FIXME: Make the bindings work.
        let bindings: string[] = []
        let vs = this.vertexShader
        let fs = this.fragmentShader
        return createGraphicsProgram(this.monitors, vs, fs, bindings)
    }

    /**
     * @property vertexShader
     * @type {string}
     * @readOnly
     */
    get vertexShader(): string {
        return vertexShader(this.aParams, this.uParams, this.vColor, this.vLight)
    }
    set vertexShader(unused) {
        throw new Error(readOnly('vertexShader').message)
    }

    /**
     * @property fragmentShader
     * @type {string}
     * @readOnly
     */
    get fragmentShader(): string {
        return fragmentShader(this.aParams, this.uParams, this.vColor, this.vLight)
    }
    set fragmentShader(unused) {
        throw new Error(readOnly('fragmentShader').message)
    }
}
