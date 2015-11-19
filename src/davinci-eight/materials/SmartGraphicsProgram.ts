import AttribMetaInfo = require('../core/AttribMetaInfo');
import createGraphicsProgram = require('../programs/createGraphicsProgram');
import fragmentShader = require('../programs/fragmentShader');
import getAttribVarName = require('../core/getAttribVarName');
import getUniformVarName = require('../core/getUniformVarName');
import GeometryMeta = require('../geometries/GeometryMeta');
import glslAttribType = require('../programs/glslAttribType');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import GraphicsProgram = require('../materials/GraphicsProgram');
import mergeStringMapList = require('../utils/mergeStringMapList');
import MeshMaterialParameters = require('../materials/MeshMaterialParameters');
import MonitorList = require('../scene/MonitorList');
import mustBeDefined = require('../checks/mustBeDefined');
import mustBeInteger = require('../checks/mustBeInteger');
import readOnly = require('../i18n/readOnly')
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vColorRequired = require('../programs/vColorRequired');
import vertexShader = require('../programs/vertexShader');
import vLightRequired = require('../programs/vLightRequired');

/**
 * <p>
 * SmartGraphicsProgram constructs a vertex shader and a fragment shader.
 * The shader codes are configured by specifying attributes, uniforms and varyings.
 * The default configuration is produces minimal shaders.
 * <p> 
 * @class SmartGraphicsProgram
 * @extends GraphicsProgram
 */
class SmartGraphicsProgram extends GraphicsProgram {
    public aParams: { [name: string]: { glslType: string } } = {};
    public uParams: { [name: string]: { glslType: string } } = {};
    private vColor: boolean = false;
    private vLight: boolean = false;
    /**
     * @class SmartGraphicsProgram
     * @constructor
     * @param contexts {IContextMonitor[]}
     * @param aParams
     * @param uParams
     * @param vColor {boolean}
     * @param vLight {boolean}
     */
    constructor(contexts: IContextMonitor[],
        aParams: { [name: string]: { glslType: string } },
        uParams: { [name: string]: { glslType: string } },
        vColor: boolean,
        vLight: boolean
    ) {
        super(contexts, 'SmartGraphicsProgram');
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

export = SmartGraphicsProgram;
