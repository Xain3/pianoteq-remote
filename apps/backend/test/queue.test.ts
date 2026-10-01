import { expect, test } from 'vitest';
import { CommandQueue } from '../src/helpers/CommandQueue.js';

test('commands stay ordered and a failure does not block subsequent commands', async () => {
  const queue = new CommandQueue();
  const order: number[] = [];
  const failed = queue.run(async () => {
    order.push(1);
    throw new Error('Rejected');
  });
  const recovered = queue.run(async () => {
    order.push(2);
    return 'ok';
  });
  await expect(failed).rejects.toThrow('Rejected');
  await expect(recovered).resolves.toBe('ok');
  expect(order).toEqual([1, 2]);
});
