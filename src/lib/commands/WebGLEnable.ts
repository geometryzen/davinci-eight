import { Capability } from '../core/Capability';
import { ContextManager } from '../core/ContextManager';
import { mustBeNumber } from '../checks/mustBeNumber';
import { ShareableBase } from '../core/ShareableBase';

/**
 * enable(capability: Capability): void
 */
export class WebGLEnable extends ShareableBase {
    private _capability: Capability;

    constructor(private contextManager: ContextManager, capability: Capability) {
        super();
        this.setLoggingName('WebGLEnable');
        this._capability = mustBeNumber('capability', capability);
    }

    protected destructor(levelUp: number): void {
        this._capability = void 0;
        super.destructor(levelUp + 1);
    }

    contextFree(): void {
        // do nothing
    }

    contextGain(): void {
        this.contextManager.gl.enable(this._capability);
    }

    contextLost(): void {
        // do nothing
    }
}
