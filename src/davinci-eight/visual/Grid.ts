import Color from '../core/Color';
import ContextManager from '../core/ContextManager';
import expectOptions from '../checks/expectOptions';
import GeometryMode from '../geometries/GeometryMode';
import geometryModeFromOptions from './geometryModeFromOptions';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridGeometry from '../geometries/GridGeometry';
import GridGeometryOptions from '../geometries/GridGeometryOptions';
import GridOptions from './GridOptions';
import isFunction from '../checks/isFunction';
import isNull from '../checks/isNull';
import isUndefined from '../checks/isUndefined';
import LineMaterial from '../materials/LineMaterial';
import LineMaterialOptions from '../materials/LineMaterialOptions';
import Material from '../core/Material';
import Mesh from '../core/Mesh';
import MeshMaterial from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeGE from '../checks/mustBeGE';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import PointMaterial from '../materials/PointMaterial';
import PointMaterialOptions from '../materials/PointMaterialOptions';
import R3 from '../math/R3';
import setAxisAndMeridian from './setAxisAndMeridian';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import validate from '../checks/validate';
import VectorE3 from '../math/VectorE3';

const COORD_MIN_DEFAULT = -1;
const COORD_MAX_DEFAULT = +1;
const GRID_SEGMENTS_DEFAULT = 10;

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
const OPTION_MODE = { name: 'mode', defaultValue: GeometryMode.WIRE, assertFn: mustBeInteger };

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
 * 
 */
function configGeometry(engine: ContextManager, geoOptions: GridGeometryOptions, grid: Grid): void {
    // Don't use the Geometry cache until we can better differentiate the options.
    const geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
    /*
    const cachedGeometry = engine.getCacheGeometry(geoOptions);
    if (cachedGeometry && cachedGeometry instanceof GridGeometry) {
        grid.geometry = cachedGeometry;
        cachedGeometry.release();
    }
    else {
        const geometry = new GridGeometry(engine, geoOptions);
        grid.geometry = geometry;
        geometry.release();
        engine.putCacheGeometry(geoOptions, geometry);
    }
    */
}

function configPoints(engine: ContextManager, options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.POINT;
    configGeometry(engine, geoOptions, grid);

    const matOptions: PointMaterialOptions = { kind: 'PointMaterial', attributes: {}, uniforms: {} };

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

    const cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof PointMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        const material = new PointMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}

function configLines(engine: ContextManager, options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.WIRE;
    configGeometry(engine, geoOptions, grid);

    const matOptions: LineMaterialOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };

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

    const cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof LineMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        const material = new LineMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}

function configMesh(engine: ContextManager, options: GridOptions, grid: Grid) {
    const geoOptions: GridGeometryOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.MESH;
    configGeometry(engine, geoOptions, grid);

    const geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();

    const matOptions: MeshMaterialOptions = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

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

    const cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        const material = new MeshMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}

/**
 *
 */
export class Grid extends Mesh<GridGeometry, Material> {

    constructor(engine: ContextManager, options: GridOptions = {}, levelUp = 0) {
        super(void 0, void 0, engine, {}, levelUp + 1);
        this.setLoggingName('Grid');
        expectOptions(OPTION_NAMES, Object.keys(options));

        const mode = geometryModeFromOptions(options, GeometryMode.WIRE);
        switch (mode) {
            case GeometryMode.POINT: {
                configPoints(engine, options, this);
                break;
            }
            case GeometryMode.WIRE: {
                configLines(engine, options, this);
                break;
            }
            case GeometryMode.MESH: {
                configMesh(engine, options, this);
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

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
