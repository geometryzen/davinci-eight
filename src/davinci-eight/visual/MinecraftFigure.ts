import { Engine } from '../core/Engine';
import Group from './Group';
import ImageTexture from '../core/ImageTexture';
import isBoolean from '../checks/isBoolean';
import isNumber from '../checks/isNumber';
import { MinecraftHead } from './Minecraft';
import { MinecraftArmL } from './Minecraft';
import { MinecraftArmR } from './Minecraft';
import { MinecraftLegL } from './Minecraft';
import { MinecraftLegR } from './Minecraft';
import { MinecraftTorso } from './Minecraft';
import vec from '../math/R3';

const e1 = vec(1, 0, 0);
const e2 = vec(0, 1, 0);

interface MinecraftFigureOptions {
    height?: number;
    oldSkinLayout?: boolean;
}

/**
 * A group of body parts arranged to look like a figure.
 */
export default class MinecraftFigure extends Group {
    public head: MinecraftHead;
    public armL: MinecraftArmL;
    public armR: MinecraftArmR;
    public legL: MinecraftLegL;
    public legR: MinecraftLegR;
    public torso: MinecraftTorso;
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftFigureOptions = {}) {
        super();
        const height = isNumber(options.height) ? options.height : 1;
        const scale = height / 32;
        const oldSkinLayout = isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false;
        this.head = new MinecraftHead(engine, texture, { height, offset: e2.scale(scale * 4), oldSkinLayout });
        this.head.position.zero().addVector(e2, scale * 24);
        this.add(this.head);
        this.head.release();

        this.torso = new MinecraftTorso(engine, texture, { height, oldSkinLayout });
        this.torso.position.zero().addVector(e2, scale * 18);
        this.add(this.torso);
        this.torso.release();

        this.armL = new MinecraftArmL(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.armL.position.zero().addVector(e2, scale * 22).addVector(e1, scale * 6);
        this.add(this.armL);
        this.armL.release();

        this.armR = new MinecraftArmR(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.armR.position.zero().addVector(e2, scale * 22).subVector(e1, scale * 6);
        this.add(this.armR);
        this.armR.release();

        this.legL = new MinecraftLegL(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.legL.position.zero().addVector(e2, scale * 10).addVector(e1, scale * 2);
        this.add(this.legL);
        this.legL.release();

        this.legR = new MinecraftLegR(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.legR.position.zero().addVector(e2, scale * 10).subVector(e1, scale * 2);
        this.add(this.legR);
        this.legR.release();
    }
}

