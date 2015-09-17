/**
 * @interface ContextController
 */
interface ContextController {
  start(): void;
  stop(): void;
  // FIXME: kill
  // kill(): void;
}

export = ContextController;