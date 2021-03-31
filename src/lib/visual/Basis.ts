import { BeginMode } from '../core/BeginMode';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { GeometryArrays } from '../core/GeometryArrays';
import { GraphicsProgramSymbols as GPS } from '../core/GraphicsProgramSymbols';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { Primitive } from '../core/Primitive';
import { ColorFacet } from '../facets/ColorFacet';
import { Vector3Facet } from '../facets/Vector3Facet';
import { ShaderMaterial } from '../materials/ShaderMaterial';
import { Vector3 } from '../math/Vector3';
import { BasisOptions } from './BasisOptions';
import { ds } from './Defaults';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';

/**
 * @hidden
 */
const uPointA = 'uPointA';
/**
 * @hidden
 */
const uPointB = 'uPointB';
/**
 * @hidden
 */
const uPointC = 'uPointC';

/**
 * @hidden
 */
const uColorA = 'uColorA';
/**
 * @hidden
 */
const uColorB = 'uColorB';
/**
 * @hidden
 */
const uColorC = 'uColorC';

/**
 * @hidden
 */
const vertexShaderSrc = function (): string {
    const vs: string = [
        "attribute float aPointIndex;",
        "attribute float aColorIndex;",
        `uniform vec3 ${uPointA};`,
        `uniform vec3 ${uPointB};`,
        `uniform vec3 ${uPointC};`,
        `uniform vec3 ${uColorA};`,
        `uniform vec3 ${uColorB};`,
        `uniform vec3 ${uColorC};`,
        `uniform mat4 ${GPS.UNIFORM_MODEL_MATRIX};`,
        `uniform mat4 ${GPS.UNIFORM_PROJECTION_MATRIX};`,
        `uniform mat4 ${GPS.UNIFORM_VIEW_MATRIX};`,
        `varying highp vec4 ${GPS.VARYING_COLOR};`,
        "",
        "void main(void) {",
        `  vec3 ${GPS.ATTRIBUTE_POSITION};`,
        `  vec3 ${GPS.ATTRIBUTE_COLOR};`,
        "  if (aPointIndex == 0.0) {",
        `    ${GPS.ATTRIBUTE_POSITION} = vec3(0.0, 0.0, 0.0);`,
        "  }",
        "  if (aPointIndex == 1.0) {",
        `    ${GPS.ATTRIBUTE_POSITION} = ${uPointA};`,
        "  }",
        "  if (aPointIndex == 2.0) {",
        `    ${GPS.ATTRIBUTE_POSITION} = ${uPointB};`,
        "  }",
        "  if (aPointIndex == 3.0) {",
        `    ${GPS.ATTRIBUTE_POSITION} = ${uPointC};`,
        "  }",
        "  if (aColorIndex == 1.0) {",
        `    ${GPS.ATTRIBUTE_COLOR} = ${uColorA};`,
        "  }",
        "  if (aColorIndex == 2.0) {",
        `    ${GPS.ATTRIBUTE_COLOR} = ${uColorB};`,
        "  }",
        "  if (aColorIndex == 3.0) {",
        `    ${GPS.ATTRIBUTE_COLOR} = ${uColorC};`,
        "  }",
        `  gl_Position = ${GPS.UNIFORM_PROJECTION_MATRIX} * ${GPS.UNIFORM_VIEW_MATRIX} * ${GPS.UNIFORM_MODEL_MATRIX} * vec4(${GPS.ATTRIBUTE_POSITION}, 1.0);`,
        `  ${GPS.VARYING_COLOR} = vec4(${GPS.ATTRIBUTE_COLOR}, 1.0);`,
        "}"
    ].join('\n');
    return vs;
};

/**
 * @hidden
 */
const fragmentShaderSrc = function (): string {
    const fs: string = [
        "precision mediump float;",
        `varying highp vec4 ${GPS.VARYING_COLOR};`,
        "",
        "void main(void) {",
        `  gl_FragColor = ${GPS.VARYING_COLOR};`,
        "}"

    ].join('\n');
    return fs;
};

/**
 * A 3D visual representation of a reference frame or basis vectors.
 */
export class Basis extends Mesh<Geometry, Material> {
    private uPointA = new Vector3Facet(uPointA);
    private uPointB = new Vector3Facet(uPointB);
    private uPointC = new Vector3Facet(uPointC);
    private uColorA = new ColorFacet(uColorA);
    private uColorB = new ColorFacet(uColorB);
    private uColorC = new ColorFacet(uColorC);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options 
     * @param levelUp Leave as zero unless you are extending this class. 
     */
    constructor(contextManager: ContextManager, options: BasisOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: ds.axis, meridian: ds.meridian }, levelUp + 1);
        this.setLoggingName("Basis");

        this.uPointA.vector = Vector3.vector(1, 0, 0);
        this.colorA.copy(Color.red);

        this.uPointB.vector = Vector3.vector(0, 1, 0);
        this.colorB.copy(Color.green);

        this.uPointC.vector = Vector3.vector(0, 0, 1);
        this.colorC.copy(Color.blue);

        const primitive: Primitive = {
            mode: BeginMode.LINES,
            attributes: {
                aPointIndex: { values: [0, 1, 0, 2, 0, 3], size: 1 },
                aColorIndex: { values: [1, 1, 2, 2, 3, 3], size: 1 }
            }
        };
        const geometry = new GeometryArrays(contextManager, primitive);
        this.geometry = geometry;
        geometry.release();

        const material = new ShaderMaterial(vertexShaderSrc(), fragmentShaderSrc(), [], contextManager);
        this.material = material;
        material.release();

        this.setFacet(`Basis-${uPointA}`, this.uPointA);
        this.setFacet(`Basis-${uPointB}`, this.uPointB);
        this.setFacet(`Basis-${uPointC}`, this.uPointC);

        this.setFacet(`Basis-${uColorA}`, this.uColorA);
        this.setFacet(`Basis-${uColorB}`, this.uColorB);
        this.setFacet(`Basis-${uColorC}`, this.uColorC);

        setColorOption(this, options, void 0);
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
    get a(): Vector3 {
        return this.uPointA.vector;
    }
    get b(): Vector3 {
        return this.uPointB.vector;
    }
    get c(): Vector3 {
        return this.uPointC.vector;
    }
    get colorA(): Color {
        return this.uColorA.color;
    }
    get colorB(): Color {
        return this.uColorB.color;
    }
    get colorC(): Color {
        return this.uColorC.color;
    }
}
