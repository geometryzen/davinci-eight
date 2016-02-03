import IGraphicsProgram from './IGraphicsProgram';
import IResource from './IResource';

interface IGraphicsBuffers extends IResource {
    /**
     * @method draw
     * @param program {IGraphicsProgram}
     * @param canvasId {number}
     * @return {void}
     */
    draw(program: IGraphicsProgram, canvasId: number): void;
}

export default IGraphicsBuffers;
