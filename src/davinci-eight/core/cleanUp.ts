import IContextConsumer from './IContextConsumer';
import IContextProvider from './IContextProvider';

export default function cleanUp(context: IContextProvider, consumer: IContextConsumer) {
    if (context) {
        const gl = context.gl
        if (gl) {
            if (gl.isContextLost()) {
                consumer.contextLost()
            }
            else {
                consumer.contextFree(context)
            }
        }
    }
}