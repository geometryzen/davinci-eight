import BeginMode from '../core/BeginMode';
import {Color} from '../core/Color';
import {ColorFacet} from '../facets/ColorFacet';
import DataType from  '../core/DataType';
import {Engine} from '../core/Engine';
import GeometryArrays from '../core/GeometryArrays';
import {Mesh} from '../core/Mesh';
import {ShaderMaterial} from '../materials/ShaderMaterial';
import Vector3 from '../math/Vector3';
import Vector3Facet from '../facets/Vector3Facet';

const uPointA = 'uPointA';
const uPointB = 'uPointB';
const uPointC = 'uPointC';

const uColorA = 'uColorA';
const uColorB = 'uColorB';
const uColorC = 'uColorC';

const vs: string = [
    "attribute float aPointIndex;",
    "attribute float aColorIndex;",
    `uniform vec3 ${uPointA};`,
    `uniform vec3 ${uPointB};`,
    `uniform vec3 ${uPointC};`,
    `uniform vec3 ${uColorA};`,
    `uniform vec3 ${uColorB};`,
    `uniform vec3 ${uColorC};`,
    "uniform mat4 uModel;",
    "uniform mat4 uProjection;",
    "uniform mat4 uView;",
    "varying highp vec4 vColor;",
    "",
    "void main(void) {",
    "  vec3 aPosition;",
    "  vec3 aColor;",
    "  if (aPointIndex == 0.0) {",
    "    aPosition = vec3(0.0, 0.0, 0.0);",
    "  }",
    "  if (aPointIndex == 1.0) {",
    `    aPosition = ${uPointA};`,
    "  }",
    "  if (aPointIndex == 2.0) {",
    `    aPosition = ${uPointB};`,
    "  }",
    "  if (aPointIndex == 3.0) {",
    `    aPosition = ${uPointC};`,
    "  }",
    "  if (aColorIndex == 1.0) {",
    `    aColor = ${uColorA};`,
    "  }",
    "  if (aColorIndex == 2.0) {",
    `    aColor = ${uColorB};`,
    "  }",
    "  if (aColorIndex == 3.0) {",
    `    aColor = ${uColorC};`,
    "  }",
    "  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);",
    "  vColor = vec4(aColor, 1.0);",
    "}"
].join('\n');

const fs: string = [
    "precision mediump float;",
    "varying highp vec4 vColor;",
    "",
    "void main(void) {",
    "  gl_FragColor = vColor;",
    "}"

].join('\n');

export default class Basis extends Mesh {
    private uPointA = new Vector3Facet(uPointA);
    private uPointB = new Vector3Facet(uPointB);
    private uPointC = new Vector3Facet(uPointC);
    private uColorA = new ColorFacet(uColorA);
    private uColorB = new ColorFacet(uColorB);
    private uColorC = new ColorFacet(uColorC);
    constructor(engine: Engine, levelUp = 0) {
        super(void 0, void 0, engine, levelUp + 1);
        this.setLoggingName("Basis");

        // FIXME: This should be initialized to a random orthonormal basis.
        this.uPointA.vector.copy(Vector3.vector(1, 0, 0));
        this.colorA.copy(Color.red);

        this.uPointB.vector.copy(Vector3.vector(0, 1, 0));
        this.colorB.copy(Color.green);

        this.uPointC.vector.copy(Vector3.vector(0, 0, 1));
        this.colorC.copy(Color.blue);

        const geometry = new GeometryArrays(void 0, engine);
        geometry.mode = BeginMode.LINES;
        geometry.setAttribute('aPointIndex', { values: [0, 1, 0, 2, 0, 3], size: 1, type: DataType.FLOAT });
        geometry.setAttribute('aColorIndex', { values: [1, 1, 2, 2, 3, 3], size: 1, type: DataType.FLOAT });
        this.geometry = geometry;
        geometry.release();

        const material = new ShaderMaterial(vs, fs, [], engine);
        this.material = material;
        material.release();

        this.setFacet(`Basis-${uPointA}`, this.uPointA);
        this.setFacet(`Basis-${uPointB}`, this.uPointB);
        this.setFacet(`Basis-${uPointC}`, this.uPointC);

        this.setFacet(`Basis-${uColorA}`, this.uColorA);
        this.setFacet(`Basis-${uColorB}`, this.uColorB);
        this.setFacet(`Basis-${uColorC}`, this.uColorC);

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
