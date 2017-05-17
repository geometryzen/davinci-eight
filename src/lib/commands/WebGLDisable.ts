import { Capability } from '../core/Capability';
import { ContextManager } from '../core/ContextManager';
import { mustBeNumber } from '../checks/mustBeNumber';
import { ShareableBase } from '../core/ShareableBase';

/**
 * disable(capability: Capability): void
 */
export class WebGLDisable extends ShareableBase {
    private _capability: Capability;

    constructor(private contextManager: ContextManager, capability: Capability) {
        super();
        this.setLoggingName('WebGLDisable');
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
        this.contextManager.gl.disable(this._capability);
    }

    contextLost(): void {
        // do nothing
    }
}
