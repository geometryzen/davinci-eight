import { Engine } from '../core/Engine';
import { ImageTexture } from '../core/ImageTexture';
import { Group } from './Group';
import { MinecraftArmL, MinecraftArmR, MinecraftHead, MinecraftLegL, MinecraftLegR, MinecraftTorso } from './Minecraft';
/**
 * @hidden
 */
export interface MinecraftFigureOptions {
    height?: number;
    oldSkinLayout?: boolean;
}
/**
 * A group of body parts arranged to look like a figure.
 * @hidden
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
