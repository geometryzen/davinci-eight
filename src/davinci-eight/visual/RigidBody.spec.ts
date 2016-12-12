import { Engine } from '../core/Engine';
import { RigidBody } from './RigidBody';
import SphereGeometry from '../geometries/SphereGeometry';
import { MeshMaterial } from '../materials/MeshMaterial';
import vec from '../math/R3';

describe('RigidBody', function () {
    it("should be shareable", function () {
        const engine = new Engine();
        const geometry = new SphereGeometry(engine);
        const material = new MeshMaterial(engine, null);
        const rigidBody = new RigidBody(engine, vec(1, 0, 0), vec(0, 0, 1));
        rigidBody.geometry = geometry;
        rigidBody.material = material;
        expect(rigidBody.isZombie()).toBe(false);
        rigidBody.release();
        expect(rigidBody.isZombie()).toBe(true);
        engine.release();
    });
    it("mass should default to 1", function () {
        const engine = new Engine();
        const geometry = new SphereGeometry(engine);
        const material = new MeshMaterial(engine, null);
        const rigidBody = new RigidBody(engine, vec(1, 0, 0), vec(0, 0, 1));
        rigidBody.geometry = geometry;
        rigidBody.material = material;
        expect(rigidBody.m).toBe(1);
        rigidBody.release();
        engine.release();
    });
    it("momentum should default to 0", function () {
        const engine = new Engine();
        const geometry = new SphereGeometry(engine);
        const material = new MeshMaterial(engine, null);
        const rigidBody = new RigidBody(engine, vec(1, 0, 0), vec(0, 0, 1));
        rigidBody.geometry = geometry;
        rigidBody.material = material;
        expect(rigidBody.P.isZero()).toBeTruthy();
        expect(rigidBody.P.a).toBe(0);
        expect(rigidBody.P.x).toBe(0);
        expect(rigidBody.P.y).toBe(0);
        expect(rigidBody.P.z).toBe(0);
        expect(rigidBody.P.xy).toBe(0);
        expect(rigidBody.P.yz).toBe(0);
        expect(rigidBody.P.zx).toBe(0);
        expect(rigidBody.P.b).toBe(0);
        rigidBody.release();
        engine.release();
    });
    it("charge should default to 0", function () {
        const engine = new Engine();
        const geometry = new SphereGeometry(engine);
        const material = new MeshMaterial(engine, null);
        const rigidBody = new RigidBody(engine, vec(1, 0, 0), vec(0, 0, 1));
        rigidBody.geometry = geometry;
        rigidBody.material = material;
        expect(rigidBody.Q.isZero()).toBeTruthy();
        rigidBody.release();
        engine.release();
    });
});
