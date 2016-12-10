import { Color } from '../core/Color';
import direction from './direction';
import { Engine } from '../core/Engine';
import { Geometric3 } from '../math/Geometric3';
import GPS from '../core/GraphicsProgramSymbols';
import HollowCylinderGeometry from '../geometries/HollowCylinderGeometry';
import HollowCylinderGeometryOptions from '../geometries/HollowCylinderGeometryOptions';
import HollowCylinderOptions from './HollowCylinderOptions';
import { MeshMaterial } from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeEngine from './mustBeEngine';
import mustBeObject from '../checks/mustBeObject';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import { R3 } from '../math/R3';
import vectorE3Object from './vectorE3Object';

/**
 * 
 */
export default class HollowCylinder extends RigidBody {
    /**
     * Cache the initial axis value so that we can compute the axis at any
     * time by rotating the initial axis using the Mesh attitude.
     */
    private initialAxis: R3;

    constructor(engine: Engine, options: HollowCylinderOptions = {}) {
        super(mustBeEngine(engine, 'HollowCylinder'), 1);
        this.setLoggingName('HollowCylinder');

        this.initialAxis = direction(options, { x: 0, y: 1, z: 0 });

        const geoOptions: HollowCylinderGeometryOptions = { kind: 'HollowCylinderGeometry' };
        geoOptions.cutLine = vectorE3Object(options.cutLine);
        geoOptions.height = vectorE3Object(options.height);
        geoOptions.innerRadius = options.innerRadius;
        geoOptions.outerRadius = options.outerRadius;
        geoOptions.sliceAngle = options.sliceAngle;

        const cachedGeometry = engine.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof HollowCylinderGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new HollowCylinderGeometry(engine, geoOptions);
            this.geometry = geometry;
            geometry.release();
            engine.putCacheGeometry(geoOptions, geometry);
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

        const cachedMaterial = engine.getCacheMaterial(mmo);
        if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
            this.material = cachedMaterial;
            cachedMaterial.release();
        }
        else {
            const material = new MeshMaterial(engine, mmo);
            this.material = material;
            material.release();
            engine.putCacheMaterial(mmo, material);
        }

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        this.synchUp();
    }
    protected destructor(levelUp: number): void {
        this.cleanUp();
        super.destructor(levelUp + 1);
    }

    /**
     * Axis (vector)
     */
    get axis(): Geometric3 {
        return Geometric3.fromVector(this.initialAxis).rotate(this.R);
    }
    set axis(axis: Geometric3) {
        mustBeObject('axis', axis);
        this.R.rotorFromDirections(this.initialAxis, axis);
    }

}
