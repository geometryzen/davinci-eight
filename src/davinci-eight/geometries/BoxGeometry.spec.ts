import Engine from '../core/Engine';
import BoxGeometry from './BoxGeometry';
import BoxGeometryOptions from './BoxGeometryOptions';
import refChange from '../core/refChange';

describe("BoxGeometry", function () {
    it("constructor-destructor", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const options: BoxGeometryOptions = {};
        const geometry = new BoxGeometry(engine, options);
        geometry.release();
        engine.release();
        expect(geometry.isZombie()).toBe(true);
        refChange('stop');
        refChange('dump');
    });

    it("resurrector-destructor", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const options: BoxGeometryOptions = {};
        const geometry = new BoxGeometry(engine, options);
        geometry.release();
        engine.release();
        refChange('stop');
        refChange('dump');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        expect(geometry.isZombie()).toBe(true);
        geometry.addRef();
        geometry.release();
        refChange('stop');
        refChange('dump');
        refChange('reset');
    });
});
