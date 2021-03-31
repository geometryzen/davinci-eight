import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { GraphicsProgramSymbols as GPS } from '../core/GraphicsProgramSymbols';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { HollowCylinderGeometry } from '../geometries/HollowCylinderGeometry';
import { HollowCylinderGeometryOptions } from '../geometries/HollowCylinderGeometryOptions';
import { MeshMaterial } from '../materials/MeshMaterial';
import { ds } from './Defaults';
import { HollowCylinderOptions } from './HollowCylinderOptions';
import { MeshMaterialOptionsWithKind } from './materialFromOptions';
import { offsetFromOptions } from './offsetFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';

/**
 * A 3D visual representation of a hollow cylinder.
 */
export class HollowCylinder extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options 
     * @param levelUp Leave as zero unless you are extending this class. 
     */
    constructor(contextManager: ContextManager, options: HollowCylinderOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1);
        this.setLoggingName('HollowCylinder');

        const geoOptions: HollowCylinderGeometryOptions = { kind: 'HollowCylinderGeometry' };

        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());

        geoOptions.outerRadius = isDefined(options.outerRadius) ? mustBeNumber('outerRadius', options.outerRadius) : ds.radius;
        geoOptions.innerRadius = isDefined(options.innerRadius) ? mustBeNumber('innerRadius', options.innerRadius) : 0.5 * geoOptions.outerRadius;
        geoOptions.sliceAngle = options.sliceAngle;

        const geometry = new HollowCylinderGeometry(contextManager, geoOptions);
        this.geometry = geometry;
        geometry.release();

        const mmo: MeshMaterialOptionsWithKind = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

        mmo.attributes[GPS.ATTRIBUTE_POSITION] = 3;
        mmo.attributes[GPS.ATTRIBUTE_NORMAL] = 3;

        mmo.uniforms[GPS.UNIFORM_COLOR] = 'vec3';
        mmo.uniforms[GPS.UNIFORM_OPACITY] = 'float';
        mmo.uniforms[GPS.UNIFORM_MODEL_MATRIX] = 'mat4';
        mmo.uniforms[GPS.UNIFORM_NORMAL_MATRIX] = 'mat3';
        mmo.uniforms[GPS.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        mmo.uniforms[GPS.UNIFORM_VIEW_MATRIX] = 'mat4';
        mmo.uniforms[GPS.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        mmo.uniforms[GPS.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        mmo.uniforms[GPS.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';

        const material = new MeshMaterial(contextManager, mmo);
        this.material = material;
        material.release();

        setAxisAndMeridian(this, options);
        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        if (isDefined(options.length)) {
            this.length = mustBeNumber('length', options.length);
        }

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

    /**
     * The length of the cylinder, a scalar. Defaults to 1.
     */
    get length(): number {
        return this.getScaleY();
    }
    set length(length: number) {
        const x = this.getScaleX();
        const z = this.getScaleZ();
        this.setScale(x, length, z);
    }
}
