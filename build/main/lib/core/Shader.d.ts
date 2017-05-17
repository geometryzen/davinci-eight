import { Engine } from './Engine';
import { ShareableContextConsumer } from './ShareableContextConsumer';
/**
 *
 */
export declare class Shader extends ShareableContextConsumer {
    private _source;
    private _shaderType;
    private _shader;
    constructor(source: string, type: number, engine: Engine);
    destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
}
