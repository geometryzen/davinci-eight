import BeginMode from '../core/BeginMode';
import {Color} from '../core/Color';
import contextManagerFromOptions from './contextManagerFromOptions';
import expectOptions from '../checks/expectOptions';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridGeometry from '../geometries/GridGeometry';
import GridGeometryOptions from '../geometries/GridGeometryOptions';
import GridOptions from './GridOptions';
import isDefined from '../checks/isDefined';
import isFunction from '../checks/isFunction';
import isNull from '../checks/isNull';
import isUndefined from '../checks/isUndefined';
import {LineMaterial} from '../materials/LineMaterial';
import LineMaterialOptions from '../materials/LineMaterialOptions';
import {Mesh} from '../core/Mesh';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeGE from '../checks/mustBeGE';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import {PointMaterial} from '../materials/PointMaterial';
import PointMaterialOptions from '../materials/PointMaterialOptions';
import R3 from '../math/R3';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import validate from '../checks/validate';
import VectorE3 from '../math/VectorE3';

const COORD_MIN_DEFAULT = -1;
const COORD_MAX_DEFAULT = +1;
const GRID_SEGMENTS_DEFAULT = 10;
const GRID_K_DEFAULT = 1;

const OPTION_CONTEXT_MANAGER = { name: 'contextManager' };
const OPTION_ENGINE = { name: 'engine' };
const OPTION_OFFSET = { name: 'offset' };
const OPTION_TILT = { name: 'tilt' };
const OPTION_STRESS = { name: 'stress' };
const OPTION_COLOR = { name: 'color', assertFn: mustBeObject };

const OPTION_POSITION_FUNCTION = { name: 'aPosition', assertFn: mustBeFunction };
const OPTION_NORMAL_FUNCTION = { name: 'aNormal', assertFn: mustBeFunction };
const OPTION_COLOR_FUNCTION = { name: 'aColor', assertFn: mustBeFunction };
const OPTION_UMIN = { name: 'uMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
const OPTION_UMAX = { name: 'uMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
const OPTION_USEGMENTS = { name: 'uSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
const OPTION_VMIN = { name: 'vMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
const OPTION_VMAX = { name: 'vMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
const OPTION_VSEGMENTS = { name: 'vSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
const OPTION_K = { name: 'k', defaultValue: 1, assertFn: mustBeInteger };

const OPTIONS = [
    OPTION_CONTEXT_MANAGER,
    OPTION_ENGINE,
    OPTION_OFFSET,
    OPTION_TILT,
    OPTION_STRESS,
    OPTION_COLOR,
    OPTION_POSITION_FUNCTION,
    OPTION_NORMAL_FUNCTION,
    OPTION_COLOR_FUNCTION,
    OPTION_UMIN,
    OPTION_UMAX,
    OPTION_USEGMENTS,
    OPTION_VMIN,
    OPTION_VMAX,
    OPTION_VSEGMENTS,
    OPTION_K
];
const OPTION_NAMES = OPTIONS.map((option) => option.name);

function aPositionDefault(u: number, v: number): VectorE3 {
    return R3(u, v, 0);
}

function aNormalDefault(u: number, v: number): VectorE3 {
    return R3(0, 0, 1);
}

function isFunctionOrNull(x: any): boolean {
    return isFunction(x) || isNull(x);
}

function isFunctionOrUndefined(x: any): boolean {
    return isFunction(x) || isUndefined(x);
}

function transferGeometryOptions(source: GridOptions, target: GridGeometryOptions): void {

    target.contextManager = contextManagerFromOptions(source);

    if (isFunctionOrNull(source.aPosition)) {
        target.aPosition = source.aPosition;
    }
    else if (isUndefined(source.aPosition)) {
        target.aPosition = aPositionDefault;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }

    if (isFunctionOrNull(source.aNormal)) {
        target.aNormal = source.aNormal;
    }
    else if (isUndefined(source.aNormal)) {
        target.aNormal = aNormalDefault;
    }
    else {
        throw new Error("aNormal must be one of function, null, or undefined.");
    }

    if (isFunctionOrNull(source.aColor)) {
        target.aColor = source.aColor;
    }
    else if (isUndefined(source.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }

    target.uMin = validate('uMin', source.uMin, COORD_MIN_DEFAULT, mustBeNumber);
    target.uMax = validate('uMax', source.uMax, COORD_MAX_DEFAULT, mustBeNumber);
    target.uSegments = validate('uSegments', source.uSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger);
    mustBeGE('uSegments', target.uSegments, 0);

    target.vMin = validate('vMin', source.vMin, COORD_MIN_DEFAULT, mustBeNumber);
    target.vMax = validate('vMax', source.vMax, COORD_MAX_DEFAULT, mustBeNumber);
    target.vSegments = validate('vSegments', source.vSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger);
    mustBeGE('vSegments', target.vSegments, 0);
}

function configPoints(options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = {};
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = BeginMode.POINTS;
    const geometry = new GridGeometry(geoOptions);
    grid.geometry = geometry;
    geometry.release();

    const matOptions: PointMaterialOptions = { attributes: {}, uniforms: {} };

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';

    const material = new PointMaterial(matOptions, contextManagerFromOptions(options));
    grid.material = material;
    material.release();
}

function configLines(options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = {};
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = BeginMode.LINES;
    const geometry = new GridGeometry(geoOptions);
    grid.geometry = geometry;
    geometry.release();

    const matOptions: LineMaterialOptions = { attributes: {}, uniforms: {} };

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }

    if (isFunction(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

    const material = new LineMaterial(matOptions, contextManagerFromOptions(options));
    grid.material = material;
    material.release();
}

function configMesh(options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = {};
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = BeginMode.TRIANGLE_STRIP;
    const geometry = new GridGeometry(geoOptions);
    grid.geometry = geometry;
    geometry.release();

    const matOptions: MeshMaterialOptions = { attributes: {}, uniforms: {} };

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have the aPosition attribute.
    }
    else {
        throw new Error();
    }

    if (isFunctionOrUndefined(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    }
    else if (isNull(options.aNormal)) {
        // We're being instructed not to have the aNormal attribute.
    }
    else {
        throw new Error();
    }

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else if (isNull(options.aColor)) {
        // We're being instructed not to have the aColor attribute.
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else if (isUndefined(options.aColor)) {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else {
        throw new Error();
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';

    const material = new MeshMaterial(matOptions, contextManagerFromOptions(options));
    grid.material = material;
    material.release();
}

/**
 *
 */
export class Grid extends Mesh {

    /**
     *
     * @param options
     */
    constructor(options: GridOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManagerFromOptions(options), levelUp + 1);
        this.setLoggingName('Grid');
        expectOptions(OPTION_NAMES, Object.keys(options));

        const k: number = isDefined(options.k) ? options.k : GRID_K_DEFAULT;
        switch (k) {
            case 0: {
                configPoints(options, this);
                break;
            }
            case 1: {
                configLines(options, this);
                break;
            }
            case 2: {
                configMesh(options, this);
                break;
            }
            default: {
                throw new Error(`'${k}' is not a valid option for k.`);
            }
        }

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
