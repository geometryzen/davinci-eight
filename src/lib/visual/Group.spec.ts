import { Group } from './Group';
import { refChange } from '../core/refChange';

describe("Group", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const group = new Group();
        group.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
