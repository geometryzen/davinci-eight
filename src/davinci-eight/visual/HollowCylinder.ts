import { Color } from '../core/Color';
import direction from './direction';
import { Engine } from '../core/Engine';
import { Geometric3 } from '../math/Geometric3';
import HollowCylinderGeometry from '../geometries/HollowCylinderGeometry';
import HollowCylinderOptions from '../geometries/HollowCylinderOptions';
import { MeshMaterial } from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeEngine from './mustBeEngine';
import mustBeObject from '../checks/mustBeObject';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import { R3 } from '../math/R3';

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

        const geometry = new HollowCylinderGeometry(engine, options);
        this.geometry = geometry;
        geometry.release();

        const mmo: MeshMaterialOptions = { attributes: {}, uniforms: {} };

        mmo.attributes['aPosition'] = 3;
        mmo.attributes['aNormal'] = 3;

        mmo.uniforms['uColor'] = 'vec3';
        mmo.uniforms['uOpacity'] = 'float';
        mmo.uniforms['uModel'] = 'mat4';
        mmo.uniforms['uNormal'] = 'mat3';
        mmo.uniforms['uProjection'] = 'mat4';
        mmo.uniforms['uView'] = 'mat4';
        mmo.uniforms['uAmbientLight'] = 'vec3';
        mmo.uniforms['uDirectionalLightColor'] = 'vec3';
        mmo.uniforms['uDirectionalLightDirection'] = 'vec3';

        const material = new MeshMaterial(engine, mmo);
        this.material = material;
        material.release();

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
