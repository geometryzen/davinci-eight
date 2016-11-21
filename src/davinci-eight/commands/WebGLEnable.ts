import Capability from '../core/Capability';
import { ContextConsumer } from '../core/ContextConsumer';
import ContextProvider from '../core/ContextProvider';
import mustBeNumber from '../checks/mustBeNumber';
import { ShareableBase } from '../core/ShareableBase';

/**
 * enable(capability: Capability): void
 */
export class WebGLEnable extends ShareableBase implements ContextConsumer {
    private _capability: Capability;

    constructor(capability: Capability) {
        super();
        this.setLoggingName('WebGLEnable');
        this._capability = mustBeNumber('capability', capability);
    }

    protected destructor(levelUp: number): void {
        this._capability = void 0;
        super.destructor(levelUp + 1);
    }

    contextFree(manager: ContextProvider): void {
        // do nothing
    }

    contextGain(manager: ContextProvider): void {
        manager.gl.enable(this._capability);
    }

    contextLost(): void {
        // do nothing
    }
}
