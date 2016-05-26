import {ContextConsumer} from './ContextConsumer';
import ContextProvider from './ContextProvider';

/**
 * Invokes contextLost or contextFree as appropiate.
 */
export default function cleanUp(contextProvider: ContextProvider, consumer: ContextConsumer) {
  if (contextProvider) {
    if (contextProvider.isContextLost()) {
      consumer.contextLost()
    }
    else {
      consumer.contextFree(contextProvider)
    }
  }
  else {
    // There is no contextProvider so resources should already be clean.
  }
}
