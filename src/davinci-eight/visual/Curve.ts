import BeginMode from '../core/BeginMode';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import CurveGeometry from '../geometries/CurveGeometry';
import CurveGeometryOptions from '../geometries/CurveGeometryOptions';
import CurveOptions from './CurveOptions';
import isDefined from '../checks/isDefined';
import isFunction from '../checks/isFunction';
import isNull from '../checks/isNull';
import isUndefined from '../checks/isUndefined';
import {LineMaterial} from '../materials/LineMaterial';
import LineMaterialOptions from '../materials/LineMaterialOptions';
import {Mesh} from '../core/Mesh';
import mustBeGE from '../checks/mustBeGE';
import mustBeNumber from '../checks/mustBeNumber';
import {PointMaterial} from '../materials/PointMaterial';
import PointMaterialOptions from '../materials/PointMaterialOptions';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

function aPositionDefault(u: number): VectorE3 {
    return Vector3.vector(u, 0, 0);
}

function isFunctionOrNull(x: any): boolean {
    return isFunction(x) || isNull(x);
}

function isFunctionOrUndefined(x: any): boolean {
    return isFunction(x) || isUndefined(x)
}

function transferGeometryOptions(options: CurveOptions, geoOptions: CurveGeometryOptions): void {

    if (isFunctionOrNull(options.aPosition)) {
        geoOptions.aPosition = options.aPosition
    }
    else if (isUndefined(options.aPosition)) {
        geoOptions.aPosition = aPositionDefault
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.")
    }

    if (isFunctionOrNull(options.aColor)) {
        geoOptions.aColor = options.aColor
    }
    else if (isUndefined(options.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.")
    }

    if (isDefined(options.uMax)) {
        geoOptions.uMax = mustBeNumber('uMax', options.uMax)
    }
    else {
        geoOptions.uMax = +0.5
    }

    if (isDefined(options.uMin)) {
        geoOptions.uMin = mustBeNumber('uMin', options.uMin)
    }
    else {
        geoOptions.uMin = -0.5
    }

    if (isDefined(options.uSegments)) {
        geoOptions.uSegments = mustBeGE('uSegments', options.uSegments, 0)
    }
    else {
        geoOptions.uSegments = 1
    }
}

function configPoints(options: CurveOptions, curve: Curve) {
    const geoOptions: CurveGeometryOptions = {}
    transferGeometryOptions(options, geoOptions)
    geoOptions.mode = BeginMode.POINTS
    const geometry = new CurveGeometry(geoOptions)
    curve.geometry = geometry
    geometry.release()

    const matOptions: PointMaterialOptions = { attributes: {}, uniforms: {} }

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error()
    }

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
    }

    if (isFunction(options.aOpacity)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_OPACITY] = 1
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float'
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float'

    const material = new PointMaterial(matOptions, options.engine)
    curve.material = material
    material.release()
}

function configLines(options: CurveOptions, curve: Curve) {
    const geoOptions: CurveGeometryOptions = {}
    transferGeometryOptions(options, geoOptions)
    geoOptions.mode = BeginMode.LINES
    const geometry = new CurveGeometry(geoOptions)
    curve.geometry = geometry
    geometry.release()

    const matOptions: LineMaterialOptions = { attributes: {}, uniforms: {} }

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error()
    }

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3'
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4'
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4'

    const material = new LineMaterial(matOptions, options.engine)
    curve.material = material
    material.release()
}

/**
 *
 */
export class Curve extends Mesh {

    /**
     * @param options
     */
    constructor(options: CurveOptions = {}, levelUp = 0) {
        super(void 0, void 0, options.engine, levelUp + 1);
        this.setLoggingName('Curve');

        const mode: BeginMode = isDefined(options.mode) ? options.mode : BeginMode.LINES;
        switch (mode) {
            case BeginMode.POINTS: {
                configPoints(options, this);
            }
                break
            case BeginMode.LINES:
            case BeginMode.LINE_STRIP: {
                configLines(options, this);
            }
                break
            default: {
                throw new Error(`'${mode}' is not a valid option for mode.`);
            }
        }
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1)
    }
}
