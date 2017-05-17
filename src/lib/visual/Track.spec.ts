import { Engine } from '../core/Engine';
import { Track } from './Track';
import { refChange } from '../core/refChange';

describe('Track', function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const track = new Track(engine);
        expect(track.isZombie()).toBe(false);
        track.release();
        engine.release();
        expect(track.isZombie()).toBe(true);
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
