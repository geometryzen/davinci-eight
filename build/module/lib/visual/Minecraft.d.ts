import { Engine } from '../core/Engine';
import { Geometry } from '../core/Geometry';
import { ImageTexture } from '../core/ImageTexture';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { VectorE3 } from '../math/VectorE3';
/**
 * @hidden
 */
export declare enum MinecraftPartKind {
    Head = 0,
    Helm = 1,
    RightLeg = 2,
    Torso = 3,
    RightArm = 4,
    LeftLeg = 5,
    LeftArm = 6,
    RightLegLayer2 = 7,
    TorsoLayer2 = 8,
    RightArmLayer2 = 9,
    LeftLegLayer2 = 10,
    LeftArmLayer2 = 11
}
/**
 * @hidden
 */
export interface MinecraftInternalBodyPartOptions {
    height: number;
    partKind: MinecraftPartKind;
    oldSkinLayout: boolean;
    offset?: VectorE3;
}
/**
 * @hidden
 */
export declare class MinecraftBodyPart extends Mesh<Geometry, Material> {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftInternalBodyPartOptions, levelUp?: number);
    protected destructor(levelUp: number): void;
}
/**
 * @hidden
 */
export interface MinecraftBodyPartOptions {
    height?: number;
    oldSkinLayout?: boolean;
    offset?: VectorE3;
}
/**
 * @hidden
 */
export declare class MinecraftHead extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftBodyPartOptions);
    protected destructor(levelUp: number): void;
}
/**
 * @hidden
 */
export declare class MinecraftTorso extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftBodyPartOptions);
    protected destructor(levelUp: number): void;
}
/**
 * @hidden
 */
export declare class MinecraftArmL extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftBodyPartOptions);
    protected destructor(levelUp: number): void;
}
/**
 * @hidden
 */
export declare class MinecraftArmR extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftBodyPartOptions);
    protected destructor(levelUp: number): void;
}
/**
 * @hidden
 */
export declare class MinecraftLegL extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftBodyPartOptions);
    protected destructor(levelUp: number): void;
}
/**
 * @hidden
 */
export declare class MinecraftLegR extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options?: MinecraftBodyPartOptions);
    protected destructor(levelUp: number): void;
}
