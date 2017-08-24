const MinHeap = require('min-heap');
import { range } from '../../utils';

export interface Frequency {
  char?: string; // ts-runtime: property must exist or be optional
  frequency: number;
}

/**
 * Return a Huffman Tree for the prefix codes. See the snapshot in `__snapshots`
 * to have a visual rappresentation.
 * @url https://en.wikipedia.org/wiki/Huffman_coding
 *
 * Time complexity: O(n*lg(n))
 * @param frequences Characters frequencies
 */
export function huffman(frequences: Frequency[]) {
  /**
   * Create a min priority queue with min-heap. An almost identical implementation
   * can be found in 'algorithms/misc/priority-queue' but for max priority.
   */
  const queue = new MinHeap((a /*: Frequency*/, b /*: Frequency*/) => {
    a.frequency - b.frequency
  });
  frequences.forEach(freq => queue.insert(freq));

  range(0, frequences.length - 2).forEach(() => {
    const tempLeft = queue.removeHead();
    const tempRight = queue.removeHead();
    tempLeft.left = void 0; // ts-runtime: property must exist
    tempLeft.right = void 0; // ts-runtime: property must exist
    tempRight.left = void 0; // ts-runtime: property must exist
    tempRight.right = void 0; // ts-runtime: property must exist
    const left: Frequency = tempLeft;
    const right: Frequency = tempRight;
    const merged = {
      frequency: left.frequency + right.frequency,
      left,
      right,
    };

    queue.insert(merged);
  });

  return queue.removeHead();
}
