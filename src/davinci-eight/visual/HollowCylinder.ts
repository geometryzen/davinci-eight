import { Color } from '../core/Color';
import { Engine } from '../core/Engine';
import HollowCylinderGeometry from '../geometries/HollowCylinderGeometry';
import HollowCylinderOptions from '../geometries/HollowCylinderOptions';
import { MeshMaterial } from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeEngine from './mustBeEngine';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import Vector3 from '../math/Vector3';

// TODO: Why have an initial axis when height vector is defined.
const e2 = Vector3.vector(0, 1, 0);

/**
 * 
 */
export default class HollowCylinder extends RigidBody {
    constructor(engine: Engine, options: HollowCylinderOptions = {}, levelUp = 0) {
        super(void 0, void 0, mustBeEngine(engine, 'HollowCylinder'), e2, levelUp + 1);

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

        setColorOption(this, options, Color.hotpink);
        setDeprecatedOptions(this, options);

        if (levelUp === 0) {
            this.synchUp();
        }
    }
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.destructor(levelUp + 1);
    }
}
