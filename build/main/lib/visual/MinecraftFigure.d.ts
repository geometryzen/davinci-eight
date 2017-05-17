import { Engine } from '../core/Engine';
import { Group } from './Group';
import { ImageTexture } from '../core/ImageTexture';
import { MinecraftHead } from './Minecraft';
import { MinecraftArmL } from './Minecraft';
import { MinecraftArmR } from './Minecraft';
import { MinecraftLegL } from './Minecraft';
import { MinecraftLegR } from './Minecraft';
import { MinecraftTorso } from './Minecraft';
export interface MinecraftFigureOptions {
    height?: number;
    oldSkinLayout?: boolean;
}
/**
 * A group of body parts arranged to look like a figure.
 */
export declare class MinecraftFigure extends Group {
    head: MinecraftHead;
    armL: MinecraftArmL;
    armR: MinecraftArmR;
    legL: MinecraftLegL;
    legR: MinecraftLegR;
    torso: MinecraftTorso;
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftFigureOptions);
}
