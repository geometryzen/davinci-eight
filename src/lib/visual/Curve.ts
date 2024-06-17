import { isDefined } from "../checks/isDefined";
import { isFunction } from "../checks/isFunction";
import { isNull } from "../checks/isNull";
import { isUndefined } from "../checks/isUndefined";
import { mustBeGE } from "../checks/mustBeGE";
import { mustBeNumber } from "../checks/mustBeNumber";
import { Color } from "../core/Color";
import { ContextManager } from "../core/ContextManager";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";
import { Material } from "../core/Material";
import { Mesh } from "../core/Mesh";
import { CurveGeometry } from "../geometries/CurveGeometry";
import { CurveGeometryOptions } from "../geometries/CurveGeometryOptions";
import { CurveMode } from "../geometries/CurveMode";
import { LineMaterial } from "../materials/LineMaterial";
import { PointMaterial } from "../materials/PointMaterial";
import { Vector3 } from "../math/Vector3";
import { VectorE3 } from "../math/VectorE3";
import { CurveOptions } from "./CurveOptions";
import { LineMaterialOptionsWithKind, PointMaterialOptionsWithKind } from "./materialFromOptions";
import { setColorOption } from "./setColorOption";
import { setDeprecatedOptions } from "./setDeprecatedOptions";

/**
 * @hidden
 */
function aPositionDefault(u: number): VectorE3 {
    return Vector3.vector(u, 0, 0);
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
function transferGeometryOptions(options: CurveOptions, geoOptions: CurveGeometryOptions): void {
    if (isFunctionOrNull(options.aPosition)) {
        geoOptions.aPosition = options.aPosition;
    } else if (isUndefined(options.aPosition)) {
        geoOptions.aPosition = aPositionDefault;
    } else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }

    if (isFunctionOrNull(options.aColor)) {
        geoOptions.aColor = options.aColor;
    } else if (isUndefined(options.aColor)) {
        // Do nothing.
    } else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }

    if (isDefined(options.uMax)) {
        geoOptions.uMax = mustBeNumber("uMax", options.uMax);
    } else {
        geoOptions.uMax = +0.5;
    }

    if (isDefined(options.uMin)) {
        geoOptions.uMin = mustBeNumber("uMin", options.uMin);
    } else {
        geoOptions.uMin = -0.5;
    }

    if (isDefined(options.uSegments)) {
        geoOptions.uSegments = mustBeGE("uSegments", options.uSegments, 0);
    } else {
        geoOptions.uSegments = 1;
    }
}

/**
 * @hidden
 */
function configPoints(contextManager: ContextManager, options: CurveOptions, curve: Curve) {
    const geoOptions: CurveGeometryOptions = { kind: "CurveGeometry" };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = CurveMode.POINTS;
    const geometry = new CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();

    const matOptions: PointMaterialOptionsWithKind = { kind: "PointMaterial", attributes: {}, uniforms: {} };

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    } else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    } else {
        throw new Error();
    }

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    } else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = "vec3";
    }

    if (isFunction(options.aOpacity)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_OPACITY] = 1;
    } else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = "float";
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = "float";
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = "mat4";
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = "mat4";
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = "mat4";
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = "float";

    const material = new PointMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}

/**
 * @hidden
 */
function configLines(contextManager: ContextManager, options: CurveOptions, curve: Curve) {
    const geoOptions: CurveGeometryOptions = { kind: "CurveGeometry" };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = CurveMode.LINES;
    const geometry = new CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();

    const matOptions: LineMaterialOptionsWithKind = { kind: "LineMaterial", attributes: {}, uniforms: {} };

    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    } else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    } else {
        throw new Error();
    }

    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    } else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = "vec3";
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = "float";
    }

    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = "mat4";
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = "mat4";
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = "mat4";

    const material = new LineMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}

/**
 * A 3D visual representation of a discrete parameterized line.
 */
export class Curve extends Mesh<CurveGeometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options: CurveOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, {}, levelUp + 1);
        this.setLoggingName("Curve");

        const mode: CurveMode = isDefined(options.mode) ? options.mode : CurveMode.LINES;
        switch (mode) {
            case CurveMode.POINTS: {
                configPoints(contextManager, options, this);
                break;
            }
            case CurveMode.LINES: {
                configLines(contextManager, options, this);
                break;
            }
            default: {
                throw new Error(`'${mode}' is not a valid option for mode.`);
            }
        }

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
