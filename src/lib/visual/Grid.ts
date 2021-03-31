import { expectOptions } from '../checks/expectOptions';
import { isFunction } from '../checks/isFunction';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { validate } from '../checks/validate';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { GeometryMode } from '../geometries/GeometryMode';
import { GridGeometry } from '../geometries/GridGeometry';
import { GridGeometryOptions } from '../geometries/GridGeometryOptions';
import { LineMaterial } from '../materials/LineMaterial';
import { MeshMaterial } from '../materials/MeshMaterial';
import { PointMaterial } from '../materials/PointMaterial';
import { vec } from '../math/R3';
import { VectorE3 } from '../math/VectorE3';
import { geometryModeFromOptions } from './geometryModeFromOptions';
import { GridOptions } from './GridOptions';
import { LineMaterialOptionsWithKind, MeshMaterialOptionsWithKind, PointMaterialOptionsWithKind } from './materialFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';

/**
 * @hidden
 */
const COORD_MIN_DEFAULT = -1;
/**
 * @hidden
 */
const COORD_MAX_DEFAULT = +1;
/**
 * @hidden
 */
const GRID_SEGMENTS_DEFAULT = 10;
/**
 * @hidden
 */
const OPTION_OFFSET = { name: 'offset' };
/**
 * @hidden
 */
const OPTION_TILT = { name: 'tilt' };
/**
 * @hidden
 */
const OPTION_STRESS = { name: 'stress' };
/**
 * @hidden
 */
const OPTION_COLOR = { name: 'color', assertFn: mustBeObject };
/**
 * @hidden
 */
const OPTION_POSITION_FUNCTION = { name: 'aPosition', assertFn: mustBeFunction };
/**
 * @hidden
 */
const OPTION_NORMAL_FUNCTION = { name: 'aNormal', assertFn: mustBeFunction };
/**
 * @hidden
 */
const OPTION_COLOR_FUNCTION = { name: 'aColor', assertFn: mustBeFunction };
/**
 * @hidden
 */
const OPTION_UMIN = { name: 'uMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
/**
 * @hidden
 */
const OPTION_UMAX = { name: 'uMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
/**
 * @hidden
 */
const OPTION_USEGMENTS = { name: 'uSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
/**
 * @hidden
 */
const OPTION_VMIN = { name: 'vMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
/**
 * @hidden
 */
const OPTION_VMAX = { name: 'vMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
/**
 * @hidden
 */
const OPTION_VSEGMENTS = { name: 'vSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
/**
 * @hidden
 */
const OPTION_MODE = { name: 'mode', defaultValue: GeometryMode.WIRE, assertFn: mustBeInteger };

/**
 * @hidden
 */
const OPTIONS = [
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
    OPTION_MODE
];

/**
 * @hidden
 */
const OPTION_NAMES = OPTIONS.map((option) => option.name);

/**
 * @hidden
 */
function aPositionDefault(u: number, v: number): VectorE3 {
    return vec(u, v, 0);
}

/**
 * @hidden
 */
function aNormalDefault(u: number, v: number): VectorE3 {
    mustBeNumber('u', u);
    mustBeNumber('v', v);
    return vec(0, 0, 1);
}

/**
 * @hidden
 */
function isFunctionOrNull(x: any): boolean {
    return isFunction(x) || isNull(x);
}

/**
 * @hidden
 */
function isFunctionOrUndefined(x: any): boolean {
    return isFunction(x) || isUndefined(x);
}

/**
 * @hidden
 */
function transferGeometryOptions(source: GridOptions, target: GridGeometryOptions): void {

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

/**
 * @hidden
 */
function configGeometry(engine: ContextManager, geoOptions: GridGeometryOptions, grid: Grid): void {
    const geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
}

/**
 * @hidden
 */
function configPoints(engine: ContextManager, options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.POINT;
    configGeometry(engine, geoOptions, grid);

    const matOptions: PointMaterialOptionsWithKind = { kind: 'PointMaterial', attributes: {}, uniforms: {} };

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
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';

    const material = new PointMaterial(engine, matOptions);
    grid.material = material;
    material.release();
}

/**
 * @hidden
 */
function configLines(engine: ContextManager, options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.WIRE;
    configGeometry(engine, geoOptions, grid);

    const matOptions: LineMaterialOptionsWithKind = { kind: 'LineMaterial', attributes: {}, uniforms: {} };

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }

    /*
    if (isFunction(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    }
    */

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

    const material = new LineMaterial(engine, matOptions);
    grid.material = material;
    material.release();
}

/**
 * @hidden
 */
function configMesh(engine: ContextManager, options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.MESH;
    configGeometry(engine, geoOptions, grid);

    const geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();

    const matOptions: MeshMaterialOptionsWithKind = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

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

    const material = new MeshMaterial(engine, matOptions);
    grid.material = material;
    material.release();
}

/**
 * A 3D visual representation of a a discrete parameterized surface.
 */
export class Grid extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options 
     * @param levelUp Leave as zero unless you are extending this class. 
     */
    constructor(contextManager: ContextManager, options: GridOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, {}, levelUp + 1);
        this.setLoggingName('Grid');
        expectOptions(OPTION_NAMES, Object.keys(options));

        const mode = geometryModeFromOptions(options, GeometryMode.WIRE);
        switch (mode) {
            case GeometryMode.POINT: {
                configPoints(contextManager, options, this);
                break;
            }
            case GeometryMode.WIRE: {
                configLines(contextManager, options, this);
                break;
            }
            case GeometryMode.MESH: {
                configMesh(contextManager, options, this);
                break;
            }
            default: {
                throw new Error(`'${mode}' is not a valid option for mode.`);
            }
        }

        setAxisAndMeridian(this, options);
        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * @hidden
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
