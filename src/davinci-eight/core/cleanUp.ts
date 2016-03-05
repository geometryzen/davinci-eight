import ContextConsumer from './ContextConsumer';
import ContextProvider from './ContextProvider';

export default function cleanUp(context: ContextProvider, consumer: ContextConsumer) {
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
