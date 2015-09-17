/**
 * @interface ContextController
 */
interface ContextController {
  /**
   * @method start
   */
  start(): void;
  /**
   * @method stop
   */
  stop(): void;
  // FIXME: kill: You won't be seeing me again.
  // kill(): void;
}

export = ContextController;