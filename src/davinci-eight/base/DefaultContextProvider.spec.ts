import DefaultContextProvider from './DefaultContextProvider';
import { Engine } from '../core/Engine';
// import refChange from '../core/refChange';

describe("DefaultContextProvider", function () {
  const engine = new Engine;
  const contextProvider = new DefaultContextProvider(engine);
  xit("new release", function () {
    expect(contextProvider instanceof DefaultContextProvider).toBe(true);
    contextProvider.release();
    engine.release();
  });
});
