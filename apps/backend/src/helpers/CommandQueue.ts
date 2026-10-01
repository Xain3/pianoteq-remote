import { AppError } from '../errors/AppError.js';

/** Serializes host mutations and bounds pending work; a failed command cannot poison the queue. */
export class CommandQueue {
  private tail: Promise<void> = Promise.resolve();
  private pending = 0;

  run<T>(command: () => Promise<T>): Promise<T> {
    if (this.pending >= 8) {
      return Promise.reject(new AppError('BUSY', 'Too many pending commands. Try again.', 409));
    }
    this.pending += 1;
    const result = this.tail.then(command);
    this.tail = result
      .then(
        () => undefined,
        () => undefined,
      )
      .finally(() => {
        this.pending -= 1;
      });
    return result;
  }
}
