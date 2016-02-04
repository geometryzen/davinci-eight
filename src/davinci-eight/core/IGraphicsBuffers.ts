import IGraphicsProgram from './IGraphicsProgram';
import IResource from './IResource';

interface IGraphicsBuffers extends IResource {
    /**
     * @method draw
     * @param program {IGraphicsProgram}
     * @return {void}
     */
    draw(program: IGraphicsProgram): void;
}

export default IGraphicsBuffers;
