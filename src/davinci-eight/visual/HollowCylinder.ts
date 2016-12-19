import Color from '../core/Color';
import { ds } from './Defaults';
import ContextManager from '../core/ContextManager';
import GPS from '../core/GraphicsProgramSymbols';
import HollowCylinderGeometry from '../geometries/HollowCylinderGeometry';
import HollowCylinderGeometryOptions from '../geometries/HollowCylinderGeometryOptions';
import HollowCylinderOptions from './HollowCylinderOptions';
import referenceAxis from './referenceAxis';
import referenceMeridian from './referenceMeridian';
import isDefined from '../checks/isDefined';
import MeshMaterial from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeNumber from '../checks/mustBeNumber';
import RigidBody from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import spinorE3Object from './spinorE3Object';
import vectorE3Object from './vectorE3Object';

/**
 * 
 */
export default class HollowCylinder extends RigidBody {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: HollowCylinderOptions = {}, levelUp = 0) {
        super(contextManager, referenceAxis(options, ds.axis), referenceMeridian(options, ds.meridian), levelUp + 1);
        this.setLoggingName('HollowCylinder');

        const geoOptions: HollowCylinderGeometryOptions = { kind: 'HollowCylinderGeometry' };
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis));
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian));
        geoOptions.outerRadius = isDefined(options.outerRadius) ? mustBeNumber('outerRadius', options.outerRadius) : ds.radius;
        geoOptions.innerRadius = isDefined(options.innerRadius) ? mustBeNumber('innerRadius', options.innerRadius) : 0.5 * geoOptions.outerRadius;
        geoOptions.sliceAngle = options.sliceAngle;

        const cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof HollowCylinderGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new HollowCylinderGeometry(contextManager, geoOptions);
            this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }

        const mmo: MeshMaterialOptions = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

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

        const cachedMaterial = contextManager.getCacheMaterial(mmo);
        if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
            this.material = cachedMaterial;
            cachedMaterial.release();
        }
        else {
            const material = new MeshMaterial(contextManager, mmo);
            this.material = material;
            material.release();
            contextManager.putCacheMaterial(mmo, material);
        }

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
