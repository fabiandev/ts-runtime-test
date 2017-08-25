define('pkg/misc/activity-selection/activity-selection', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.activitySelector = activitySelector;
    function activitySelector(activities) {
        const selected = [activities[0]];
        let lastActivity = activities[0];

        (0, _utils.range)(1, activities.length - 1).forEach(index => {
            const currentActivity = activities[index];
            if (currentActivity.start >= lastActivity.finish) {
                selected.push(currentActivity);
                lastActivity = currentActivity;
            }
        });
        return selected;
    }
});
define('pkg/misc/activity-selection/activity-selection.spec', ['./activity-selection'], function (_activitySelection) {
    'use strict';

    describe('activitySelector', () => {
        it('should return a selection of non-conflicting activities', () => {
            const activities = [{ start: 1, finish: 4 }, { start: 3, finish: 5 }, { start: 0, finish: 6 }, { start: 5, finish: 7 }, { start: 3, finish: 9 }, { start: 5, finish: 9 }, { start: 6, finish: 10 }, { start: 8, finish: 11 }, { start: 8, finish: 12 }, { start: 2, finish: 14 }, { start: 12, finish: 16 }];
            const selected = (0, _activitySelection.activitySelector)(activities);
            expect(selected).toEqual([{ start: 1, finish: 4 }, { start: 5, finish: 7 }, { start: 8, finish: 11 }, { start: 12, finish: 16 }]);
        });
    });
});
define('pkg/misc/huffman/huffman', ['exports', '../../utils', 'min-heap'], function (exports, _utils, MinHeap) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.huffman = huffman;
    function huffman(frequences) {
        const queue = new MinHeap((a, b) => a.frequency - b.frequency);
        frequences.forEach(freq => queue.insert(freq));
        (0, _utils.range)(0, frequences.length - 2).forEach(() => {
            const left = queue.removeHead();
            const right = queue.removeHead();
            const merged = {
                frequency: left.frequency + right.frequency,
                left,
                right
            };
            queue.insert(merged);
        });
        return queue.removeHead();
    }
});
define('pkg/misc/huffman/huffman.spec', ['./huffman', '../../utils'], function (_huffman, _utils) {
    'use strict';

    describe('huffman', () => {
        it('should return the tree of prefix codes', () => {
            const frequences = [{ char: 'a', frequency: 45 }, { char: 'b', frequency: 13 }, { char: 'c', frequency: 12 }, { char: 'd', frequency: 16 }, { char: 'e', frequency: 9 }, { char: 'f', frequency: 5 }];
            const tree = (0, _huffman.huffman)(frequences);

            const serializable = (0, _utils.toSerializableTree)(tree, node => {
                const key = node.char ? `${node.char}:${node.frequency}` : node.frequency;
                return { key, left: node.left, right: node.right };
            });
            expect(tree).toMatchSnapshot('Huffman coding tree');
        });
    });
});
define('pkg/misc/inversions-count/inversions-count', ['exports', '../../utils', 'lodash/head'], function (exports, _utils, _head) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countInversions = countInversions;

    var _head2 = _interopRequireDefault(_head);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function merge(input, start, mid, end) {
        const left = input.slice(start, mid);
        const right = input.slice(mid, end);
        left[left.length] = -Infinity;
        right[right.length] = -Infinity;
        let inversionCount = 0;
        (0, _utils.range)(start, end - 1).forEach(index => {
            if ((0, _head2.default)(left) > (0, _head2.default)(right)) {
                inversionCount += right.length - 1;
                input[index] = left.shift();
            } else {
                input[index] = right.shift();
            }
        });
        return inversionCount;
    }
    function countInversions(input, start = 0, end = input.length) {
        if (end - start <= 1) return 0;
        const mid = Math.floor((start + end) / 2);
        const leftCount = countInversions(input, start, mid);
        const rightCount = countInversions(input, mid, end);
        return leftCount + rightCount + merge(input, start, mid, end);
    }
});
define('pkg/misc/inversions-count/inversions-count.spec', ['./inversions-count'], function (_inversionsCount) {
    'use strict';

    describe('countInversions', () => {
        it('should count the number of inversions', () => {
            const input = [2, 3, 8, 6, 1];
            const count = (0, _inversionsCount.countInversions)(input);
            expect(count).toBe(5);
        });
    });
});
define('pkg/misc/longest-common-subsequence/longest-common-subsequence', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.lcsLengths = lcsLengths;
    exports.findLCS = findLCS;
    function lcsLengths(seqA, seqB) {
        const lengthA = seqA.length;
        const lengthB = seqB.length;
        const lengths = new Array(lengthA + 1);
        (0, _utils.fill)(lengths, () => new Array(lengthB + 1));
        (0, _utils.range)(0, lengthA).forEach(i => lengths[i][0] = 0);
        (0, _utils.range)(0, lengthB).forEach(i => lengths[0][i] = 0);
        (0, _utils.range)(0, lengthA - 1).forEach(indexA => {
            (0, _utils.range)(0, lengthB - 1).forEach(indexB => {
                const charA = seqA[indexA];
                const charB = seqB[indexB];
                if (charA === charB) {
                    lengths[indexA + 1][indexB + 1] = lengths[indexA][indexB] + 1;
                } else {
                    const subSeqALength = lengths[indexA][indexB + 1];
                    const subSeqBLength = lengths[indexA + 1][indexB];
                    lengths[indexA + 1][indexB + 1] = Math.max(subSeqALength, subSeqBLength);
                }
            });
        });
        return lengths;
    }

    function walkLCS(lengths, seqA, seqB, indexA, indexB) {
        if (indexA === 0 || indexB === 0) return '';
        if (seqA[indexA - 1] === seqB[indexB - 1]) {
            const subLCS = walkLCS(lengths, seqA, seqB, indexA - 1, indexB - 1);
            return subLCS + seqA[indexA - 1];
        } else if (lengths[indexA - 1][indexB] >= lengths[indexA][indexB - 1]) {
            return walkLCS(lengths, seqA, seqB, indexA - 1, indexB);
        } else {
            return walkLCS(lengths, seqA, seqB, indexA, indexB - 1);
        }
    }
    function findLCS(seqA, seqB) {
        const lengths = lcsLengths(seqA, seqB);
        const lcs = walkLCS(lengths, seqA, seqB, seqA.length, seqB.length);
        return lcs;
    }
});
define('pkg/misc/longest-common-subsequence/longest-common-subsequence.spec', ['./longest-common-subsequence'], function (_longestCommonSubsequence) {
    'use strict';

    describe('lcsLengths', () => {
        it('should return the table of common subsequences lengths', () => {
            const seqA = 'ABCBDAB';
            const seqB = 'BDCABA';
            const lengths = (0, _longestCommonSubsequence.lcsLengths)(seqA, seqB);

            lengths.y = ' ' + seqA;
            lengths.x = ' ' + seqB;
            expect(lengths).toMatchSnapshot('LCS subsequences lengths');
        });
    });
    describe('findLCS', () => {
        it('should return the LCS for two sequences', () => {
            const seqA = 'ABCBDAB';
            const seqB = 'BDCABA';
            const lcs = (0, _longestCommonSubsequence.findLCS)(seqA, seqB);
            expect(lcs).toBe('BCBA');
        });
    });
});
define('pkg/misc/maximum-subarray/maximum-subarray', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.maxCrossSubarray = maxCrossSubarray;
    exports.maxSubarray = maxSubarray;
    function maxCrossSubarray(input, start, mid, end) {
        let leftIndex = -1;
        let leftMaxSum = -Infinity;
        let sum = 0;
        (0, _utils.reverseRange)(mid, start).forEach(index => {
            sum += input[index];
            if (sum > leftMaxSum) {
                leftMaxSum = sum;
                leftIndex = index;
            }
        });
        let rightIndex = -1;
        let rightMaxSum = -Infinity;
        sum = 0;
        (0, _utils.range)(mid + 1, end).forEach(index => {
            sum += input[index];
            if (sum > rightMaxSum) {
                rightMaxSum = sum;
                rightIndex = index;
            }
        });
        return {
            start: leftIndex,
            end: rightIndex,
            sum: leftMaxSum + rightMaxSum
        };
    }
    function maxSubarray(input, start, end) {
        if (end - start === 0) return { start, end, sum: input[start] };
        const mid = Math.floor((start + end) / 2);
        const leftMax = maxSubarray(input, start, mid);
        const rightMax = maxSubarray(input, mid + 1, end);
        const crossMax = maxCrossSubarray(input, start, mid, end);
        if (leftMax.sum >= rightMax.sum && leftMax.sum >= crossMax.sum) {
            return leftMax;
        } else if (rightMax.sum >= leftMax.sum && rightMax.sum >= crossMax.sum) {
            return rightMax;
        } else {
            return crossMax;
        }
    }
});
define('pkg/misc/maximum-subarray/maximum-subarray.spec', ['./maximum-subarray'], function (_maximumSubarray) {
    'use strict';

    describe('maxCrossSubarray', () => {
        it('should find the maximum cross-subarray', () => {
            const input = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
            const result = (0, _maximumSubarray.maxCrossSubarray)(input, 0, 9, input.length - 1);
            expect(result).toEqual({
                start: 7,
                end: 10,
                sum: 43
            });
        });
    });
    describe('maxSubarray', () => {
        it('should find the maximum subarray', () => {
            const input = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
            const result = (0, _maximumSubarray.maxSubarray)(input, 0, input.length - 1);
            expect(result).toEqual({
                start: 7,
                end: 10,
                sum: 43
            });
        });
    });
});
define('pkg/misc/priority-queue/priority-queue', ['exports', 'lodash/head', 'lodash/last', '../../sort/heap-sort/heap-sort', '../../utils'], function (exports, _head, _last, _heapSort, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.maximum = maximum;
  exports.extractMax = extractMax;
  exports.increasePriority = increasePriority;
  exports.insert = insert;

  var _head2 = _interopRequireDefault(_head);

  var _last2 = _interopRequireDefault(_last);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function maximum(queue) {
    return (0, _head2.default)(queue);
  }
  function extractMax(queue) {
    const max = maximum(queue);
    (0, _utils.setHead)(queue, (0, _last2.default)(queue));
    queue.pop();
    (0, _heapSort.maxHeapify)(queue, 0, queue.length);
    return max;
  }

  function isParentInvalid(queue, index) {
    return queue[(0, _heapSort.parent)(index)] < queue[index];
  }
  function increasePriority(queue, index, increase) {
    queue[index] += increase;

    let validHeapIndex = index;
    while (isParentInvalid(queue, validHeapIndex) && validHeapIndex !== 0) {
      (0, _utils.swap)(queue, validHeapIndex, (0, _heapSort.parent)(validHeapIndex));
      validHeapIndex = (0, _heapSort.parent)(validHeapIndex);
    }
    return queue;
  }
  function insert(queue, value) {
    queue.push(0);
    increasePriority(queue, queue.length - 1, value);
    return queue;
  }
});
define('pkg/misc/priority-queue/priority-queue.spec', ['./priority-queue'], function (_priorityQueue) {
    'use strict';

    describe('extractMax', () => {
        it('should extract the maximum priority from the queue', () => {
            const queue = [5, 2, 4, 0, 1, 3];
            const max = (0, _priorityQueue.extractMax)(queue);
            expect(max).toBe(5);
            expect(queue).toEqual([4, 2, 3, 0, 1]);
        });
    });
    describe('increasePriority', () => {
        it('should increase the priority of an item in the queue', () => {
            const queue = [5, 2, 4, 0, 1, 3];
            (0, _priorityQueue.increasePriority)(queue, 2, 2);
            expect(queue).toEqual([6, 2, 5, 0, 1, 3]);
        });
    });
    describe('insert', () => {
        it('should allow creation of a queue', () => {
            const queue = [];
            (0, _priorityQueue.insert)(queue, 5);
            (0, _priorityQueue.insert)(queue, 2);
            (0, _priorityQueue.insert)(queue, 4);
            (0, _priorityQueue.insert)(queue, 0);
            (0, _priorityQueue.insert)(queue, 1);
            (0, _priorityQueue.insert)(queue, 3);
            expect(queue).toEqual([5, 2, 4, 0, 1, 3]);
        });
        it('should add a priority in the queue', () => {
            const queue = [5, 2, 4, 0, 1, 3];
            (0, _priorityQueue.insert)(queue, 6);
            expect(queue).toEqual([6, 2, 5, 0, 1, 3, 4]);
        });
    });
});
define('pkg/misc/rod-cutting/rod-cutting', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.topDownCutRod = topDownCutRod;
    exports.bottomUpCutRod = bottomUpCutRod;
    exports.cutRod = cutRod;
    function topDownCutRod(prices, length) {
        const bestPrices = new Array(length + 1);
        bestPrices.fill(-Infinity);
        const bestFirstCuts = new Array(length + 1);
        return topDownCutRodAux(prices, length, bestPrices, bestFirstCuts);
    }
    function topDownCutRodAux(prices, length, bestPrices, bestFirstCuts) {
        if (bestPrices[length] >= 0) return { bestPrices, bestFirstCuts };
        let maxCutPrice = -Infinity;
        let bestFirstCut = -1;
        if (length === 0) maxCutPrice = 0;else {
            (0, _utils.range)(1, length).forEach(firstCut => {
                const remainingRod = topDownCutRodAux(prices, length - firstCut, bestPrices, bestFirstCuts);
                const cutPrice = prices[firstCut] + remainingRod.bestPrices[length - firstCut];
                if (cutPrice > maxCutPrice) {
                    maxCutPrice = cutPrice;
                    bestFirstCut = firstCut;
                }
            });
        }
        bestPrices[length] = maxCutPrice;
        bestFirstCuts[length] = bestFirstCut;
        return {
            bestPrices,
            bestFirstCuts
        };
    }
    function bottomUpCutRod(prices, length) {
        const bestPrices = new Array(length + 1);
        const bestFirstCuts = new Array(length + 1);
        bestPrices.fill(-Infinity);

        bestPrices[0] = 0;
        (0, _utils.range)(1, length).forEach(subLength => {
            let maxCutPrice = -Infinity;
            (0, _utils.range)(1, subLength).forEach(firstCut => {
                const cutPrice = prices[firstCut] + bestPrices[subLength - firstCut];
                if (cutPrice > maxCutPrice) {
                    maxCutPrice = cutPrice;
                    bestPrices[subLength] = maxCutPrice;
                    bestFirstCuts[subLength] = firstCut;
                }
            });
        });
        return {
            bestPrices,
            bestFirstCuts
        };
    }
    function cutRod(prices, length, strategy = 'bottomUp') {
        const { bestFirstCuts } = strategy === 'bottomUp' ? bottomUpCutRod(prices, length) : topDownCutRod(prices, length);
        let remainingRod = length;
        const bestCuts = [];
        while (remainingRod) {
            bestCuts.push(bestFirstCuts[remainingRod]);
            remainingRod -= bestFirstCuts[remainingRod];
        }
        return bestCuts;
    }
});
define('pkg/misc/rod-cutting/rod-cutting.spec', ['./rod-cutting'], function (_rodCutting) {
    'use strict';

    describe('topDownCutRod', () => {
        it('should return the maximum prices for a rod of given length', () => {
            const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
            const { bestPrices } = (0, _rodCutting.topDownCutRod)(prices, 4);
            expect(bestPrices[4]).toBe(10);
            expect(bestPrices[3]).toBe(8);
            expect(bestPrices[2]).toBe(5);
            expect(bestPrices[1]).toBe(1);
            expect(bestPrices[0]).toBe(0);
        });
        it('should consider the result with no cut at all', () => {
            const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
            expect((0, _rodCutting.topDownCutRod)(prices, 10).bestPrices[10]).toBe(30);
        });
    });
    describe('bottomUpCutRod', () => {
        it('should return the maximum prices for a rod of given length', () => {
            const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
            const { bestPrices } = (0, _rodCutting.bottomUpCutRod)(prices, 4);
            expect(bestPrices[4]).toBe(10);
            expect(bestPrices[3]).toBe(8);
            expect(bestPrices[2]).toBe(5);
            expect(bestPrices[1]).toBe(1);
            expect(bestPrices[0]).toBe(0);
        });
        it('should consider the result with no cut at all', () => {
            const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
            expect((0, _rodCutting.bottomUpCutRod)(prices, 10).bestPrices[10]).toBe(30);
        });
    });
    describe('cutRod', () => {
        it('should return the best cuts length for a rod of given length', () => {
            const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
            const bestCuts = (0, _rodCutting.cutRod)(prices, 7);
            expect(bestCuts).toEqual([1, 6]);
        });
        it('should return the same result despite the chosen strategy', () => {
            const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
            const bottomUp = (0, _rodCutting.cutRod)(prices, 7, 'bottomUp');
            const topDown = (0, _rodCutting.cutRod)(prices, 7, 'topDown');
            expect(bottomUp).toEqual(topDown);
        });
    });
});
define("pkg/search/binary-search/binary-search", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.binarySearch = binarySearch;
    function binarySearch(input, value, start, end) {
        if (start > end || value < input[start] || value > input[end]) return null;
        const mid = Math.floor((end + start) / 2);
        if (input[mid] === value) return mid;else if (input[mid] < value) return binarySearch(input, value, mid + 1, end);else return binarySearch(input, value, start, mid - 1);
    }
});
define('pkg/search/binary-search/binary-search.spec', ['./binary-search'], function (_binarySearch) {
    'use strict';

    describe('binarySearch', () => {
        it('should find the index of the value', () => {
            const input = [1, 2, 3, 4, 5, 6];
            const right = (0, _binarySearch.binarySearch)(input, 5, 0, input.length - 1);
            const left = (0, _binarySearch.binarySearch)(input, 2, 0, input.length - 1);
            expect(right).toEqual(4);
            expect(left).toEqual(1);
        });
        it('should find the index of the value at the edges', () => {
            const input = [1, 2, 3, 4, 5, 6];
            const right = (0, _binarySearch.binarySearch)(input, 6, 0, input.length - 1);
            const left = (0, _binarySearch.binarySearch)(input, 1, 0, input.length - 1);
            expect(right).toEqual(5);
            expect(left).toEqual(0);
        });
        it('should return NULL if the value is not present', () => {
            const input = [1, 2, 3, 4, 5, 6];
            const right = (0, _binarySearch.binarySearch)(input, 7, 0, input.length - 1);
            const left = (0, _binarySearch.binarySearch)(input, -1, 0, input.length - 1);
            expect(right).toEqual(null);
            expect(left).toEqual(null);
        });
    });
});
define("pkg/search/binary-search-tree/binary-search-tree", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.createNode = createNode;
    exports.inOrderWalk = inOrderWalk;
    exports.search = search;
    exports.minimum = minimum;
    exports.maximum = maximum;
    exports.successor = successor;
    exports.predecessor = predecessor;
    exports.insert = insert;
    exports.transplant = transplant;
    exports.remove = remove;
    function createNode(key, left = null, right = null) {
        const node = {
            key,
            left,
            right,
            parent: null
        };
        if (left) left.parent = node;
        if (right) right.parent = node;
        return node;
    }
    function inOrderWalk(node) {
        if (!node) return;
        inOrderWalk(node.left);
        console.log(node);
        inOrderWalk(node.right);
    }
    function search(node, key) {
        if (!node) return null;
        if (node.key === key) return node;else if (node.key < key) return search(node.right, key);else return search(node.left, key);
    }
    function minimum(node) {
        let leftMost = node;
        while (leftMost !== null && leftMost.left !== null) {
            leftMost = leftMost.left;
        }
        return leftMost;
    }
    function maximum(node) {
        let rightMost = node;
        while (rightMost !== null && rightMost.right !== null) {
            rightMost = rightMost.right;
        }
        return rightMost;
    }
    function successor(node) {
        if (node.right !== null) return minimum(node.right);
        let parent = node.parent;
        let current = node;
        while (parent !== null && parent.right === current) {
            current = parent;
            parent = parent.parent;
        }
        return parent;
    }
    function predecessor(node) {
        if (node.left !== null) return node.left;
        let parent = node.parent;
        let current = node;
        while (parent !== null && parent.left === current) {
            current = parent;
            parent = parent.parent;
        }
        return parent;
    }
    function insert(tree, leaf) {
        let parent = null;
        let current = tree.root;
        while (current !== null) {
            parent = current;
            if (leaf.key >= current.key) {
                current = current.right;
            } else {
                current = current.left;
            }
        }
        if (parent === null) tree.root = leaf;else if (leaf.key >= parent.key) parent.right = leaf;else parent.left = leaf;
        leaf.parent = parent;
    }
    function transplant(tree, oldNode, newNode) {
        if (oldNode.parent === null) tree.root = newNode;else if (oldNode.parent.left === oldNode) oldNode.parent.left = newNode;else oldNode.parent.right = newNode;
        if (newNode !== null) newNode.parent = oldNode.parent;
    }
    function remove(tree, removed) {
        if (removed.left === null) transplant(tree, removed, removed.right);else if (removed.right === null) transplant(tree, removed, removed.left);else {
            const minRight = minimum(removed.right);
            if (minRight.parent !== removed) {
                transplant(tree, minRight, minRight.right);

                minRight.right = removed.right;
                minRight.right.parent = minRight;
            }
            transplant(tree, removed, minRight);

            minRight.left = removed.left;
            minRight.left.parent = minRight;
        }
    }
});
define('pkg/search/binary-search-tree/binary-search-tree.spec', ['./binary-search-tree'], function (_binarySearchTree) {
    'use strict';

    function createBST() {
        return (0, _binarySearchTree.createNode)(15, (0, _binarySearchTree.createNode)(6, (0, _binarySearchTree.createNode)(3, (0, _binarySearchTree.createNode)(2), (0, _binarySearchTree.createNode)(4)), (0, _binarySearchTree.createNode)(7, null, (0, _binarySearchTree.createNode)(13, (0, _binarySearchTree.createNode)(9)))), (0, _binarySearchTree.createNode)(18, (0, _binarySearchTree.createNode)(17), (0, _binarySearchTree.createNode)(20)));
    }
    describe('createBST', () => {
        it('should create a correct BST', () => {
            expect(createBST()).toMatchSnapshot('createBST');
        });
    });
    describe('search', () => {
        it('should find the node with a given key', () => {
            const tree = createBST();
            const node = (0, _binarySearchTree.search)(tree, 3);
            expect(node.key).toBe(3);
            expect(node.left.key).toBe(2);
            expect(node.right.key).toBe(4);
        });
    });
    describe('minimum', () => {
        it('should find the node with minimum key', () => {
            const tree = createBST();
            const minimumNode = (0, _binarySearchTree.minimum)(tree);
            expect(minimumNode.key).toBe(2);
        });
    });
    describe('maximum', () => {
        it('should find the node with maximum key', () => {
            const tree = createBST();
            const maximumNode = (0, _binarySearchTree.maximum)(tree);
            expect(maximumNode.key).toBe(20);
        });
    });
    describe('successor', () => {
        it('should find the successor node on right if available', () => {
            const tree = createBST();
            const successorNode = (0, _binarySearchTree.successor)(tree);
            expect(successorNode.key).toBe(17);
        });
        it('should find the ancestor successor node if not available on right', () => {
            const tree = createBST();
            const node13 = (0, _binarySearchTree.search)(tree, 13);
            const successorNode = (0, _binarySearchTree.successor)(node13);
            expect(successorNode.key).toBe(15);
        });
    });
    describe('predecessor', () => {
        it('should find the predecessor node on left if available', () => {
            const tree = createBST();
            const predecessorNode = (0, _binarySearchTree.predecessor)(tree);
            expect(predecessorNode.key).toBe(6);
        });
        it('should find the ancestor predecessor node if not available on left', () => {
            const tree = createBST();
            const node9 = (0, _binarySearchTree.search)(tree, 9);
            const predecessorNode = (0, _binarySearchTree.predecessor)(node9);
            expect(predecessorNode.key).toBe(7);
        });
    });
    describe('insert', () => {
        it('should insert a node', () => {
            const tree = { root: (0, _binarySearchTree.createNode)(3) };
            const leaf = (0, _binarySearchTree.createNode)(2);
            (0, _binarySearchTree.insert)(tree, leaf);
            expect(tree.root.left.key).toBe(2);
            expect(leaf.parent).toEqual(tree.root);
        });
        it('should insert a node if the tree is empty', () => {
            const tree = { root: null };
            const leaf = (0, _binarySearchTree.createNode)(2);
            (0, _binarySearchTree.insert)(tree, leaf);
            expect(tree.root).toEqual(tree.root);
            expect(leaf.parent).toBe(null);
        });
        it('should allow creation of a Binary Search Tree', () => {
            const tree = { root: null };
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(12));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(5));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(2));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(9));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(18));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(15));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(13));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(17));
            (0, _binarySearchTree.insert)(tree, (0, _binarySearchTree.createNode)(19));
            expect(tree.root).toMatchSnapshot('BST insertion');
        });
    });
    describe('remove', () => {
        it('should have a working transplant utility', () => {
            const tree = {
                root: createBST()
            };
            const node20 = tree.root.right.right;
            const replacement = (0, _binarySearchTree.createNode)(21);
            (0, _binarySearchTree.transplant)(tree, node20, replacement);
            expect(tree.root.right.right.key).toBe(21);
            expect(tree.root.right.right.parent.key).toBe(18);
        });
        it('should remove a leaf from the BST', () => {
            const tree = {
                root: createBST()
            };
            const node20 = tree.root.right.right;
            (0, _binarySearchTree.remove)(tree, node20);
            expect(tree.root.right.right).toBe(null);
        });
        it('should remove an internal node from the BST and replace with the right child', () => {
            const tree = {
                root: createBST()
            };
            const node18 = tree.root.right;
            (0, _binarySearchTree.remove)(tree, node18);
            expect(tree.root.right.key).toBe(20);
        });
        it('should remove an internal node from the BST and replace with the minimum right child', () => {
            const tree = {
                root: createBST()
            };
            (0, _binarySearchTree.remove)(tree, tree.root);
            expect(tree.root.key).toBe(17);
            expect(tree.root.right.left).toBe(null);
        });
    });
});
define('pkg/sort/counting-sort/counting-sort', ['exports', 'lodash/forEachRight', '../../utils'], function (exports, _forEachRight, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countingSort = countingSort;

    var _forEachRight2 = _interopRequireDefault(_forEachRight);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function countingSort(input, max) {
        const result = [];
        const counter = new Array(max + 1);
        counter.fill(0);
        input.forEach(value => counter[value] += 1);
        (0, _utils.range)(1, max).forEach(index => (0, _utils.increaseOfPrevious)(counter, index));
        (0, _forEachRight2.default)(input, value => {
            counter[value] -= 1;
            const position = counter[value];
            result[position] = value;
        });
        return result;
    }
});
define('pkg/sort/counting-sort/counting-sort.spec', ['lodash/max', './counting-sort'], function (_max, _countingSort) {
    'use strict';

    var _max2 = _interopRequireDefault(_max);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    describe('Counting sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _countingSort.countingSort)(input, (0, _max2.default)(input));
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/sort/heap-sort/heap-sort', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.parent = parent;
    exports.left = left;
    exports.right = right;
    exports.maxHeapify = maxHeapify;
    exports.buildMaxHeap = buildMaxHeap;
    exports.heapSort = heapSort;
    function parent(index) {
        return Math.floor((index - 1) / 2);
    }
    function left(index) {
        return 2 * index + 1;
    }
    function right(index) {
        return 2 * (index + 1);
    }
    function isInHeap(index, heapSize) {
        return index < heapSize;
    }
    function maxHeapify(input, index, heapSize) {
        const leftChild = left(index);
        const rightChild = right(index);
        let maxIndex = index;
        if (isInHeap(leftChild, heapSize) && input[leftChild] > input[index]) {
            maxIndex = leftChild;
        }
        if (isInHeap(rightChild, heapSize) && input[rightChild] > input[maxIndex]) {
            maxIndex = rightChild;
        }
        if (maxIndex !== index) {
            (0, _utils.swap)(input, index, maxIndex);

            maxHeapify(input, maxIndex, heapSize);
        }
        return input;
    }
    function buildMaxHeap(input) {
        const firstLeaf = Math.floor((input.length - 1) / 2);
        (0, _utils.reverseRange)(firstLeaf).forEach(index => {
            maxHeapify(input, index, input.length);
        });
        return input;
    }
    function heapSort(input) {
        buildMaxHeap(input);
        (0, _utils.reverseRange)(input.length - 1).forEach(heapEnd => {
            (0, _utils.swap)(input, 0, heapEnd);
            maxHeapify(input, 0, heapEnd);
        });
        return input;
    }
});
define('pkg/sort/heap-sort/heap-sort.spec', ['./heap-sort'], function (_heapSort) {
    'use strict';

    describe('Utilities', function () {
        test('left', function () {
            expect((0, _heapSort.left)(0)).toEqual(1);
        });
        test('right', function () {
            expect((0, _heapSort.right)(0)).toEqual(2);
        });
    });
    describe('maxHeapify', function () {
        test('It should move the item to the right position', function () {
            const input = [0, 5, 4, 2, 1, 3];
            const result = (0, _heapSort.maxHeapify)(input, 0, input.length);
            expect(result).toEqual([5, 2, 4, 0, 1, 3]);
        });
    });
    describe('buildMaxHeap', function () {
        test('It should build a max heap from given input', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _heapSort.buildMaxHeap)(input);
            expect(result).toEqual([6, 5, 4, 2, 1, 3]);
        });
    });
    describe('Heap sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _heapSort.heapSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/sort/insertion-sort/insertion-sort', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.insertionSort = insertionSort;
    function insertionSort(input) {
        input.forEach((pivot, pivotIndex) => {
            let compareIndex = pivotIndex - 1;
            while (compareIndex > -1 && input[compareIndex] > pivot) {
                (0, _utils.moveRight)(input, compareIndex);
                compareIndex -= 1;
            }
            input[compareIndex + 1] = pivot;
        });
        return input;
    }
});
define('pkg/sort/insertion-sort/insertion-sort.spec', ['./insertion-sort'], function (_insertionSort) {
    'use strict';

    describe('Insertion sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _insertionSort.insertionSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/sort/merge-and-insertion-sort/merge-and-insertion-sort', ['exports', '../insertion-sort/insertion-sort', '../merge-sort/merge-sort'], function (exports, _insertionSort, _mergeSort) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.mergeAndInsertionSort = mergeAndInsertionSort;
    function mergeAndInsertionSort(input, start = 0, end = input.length, threshold = 10) {
        if (end - start <= 1) return [];
        if (end - start <= threshold) return (0, _insertionSort.insertionSort)(input);

        const mid = Math.floor((start + end) / 2);
        mergeAndInsertionSort(input, start, mid);
        mergeAndInsertionSort(input, mid, end);
        return (0, _mergeSort.merge)(input, start, mid, end);
    }
});
define('pkg/sort/merge-and-insertion-sort/merge-and-insertion-sort.spec', ['./merge-and-insertion-sort'], function (_mergeAndInsertionSort) {
    'use strict';

    describe('Insertion sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _mergeAndInsertionSort.mergeAndInsertionSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/sort/merge-sort/merge-sort', ['exports', 'lodash/head', '../../utils'], function (exports, _head, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.merge = merge;
    exports.mergeSort = mergeSort;

    var _head2 = _interopRequireDefault(_head);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function merge(input, start, mid, end) {
        const left = input.slice(start, mid);
        const right = input.slice(mid, end);
        left[left.length] = Infinity;
        right[right.length] = Infinity;
        (0, _utils.range)(start, end - 1).forEach(index => {
            if ((0, _head2.default)(left) <= (0, _head2.default)(right)) input[index] = left.shift();else input[index] = right.shift();
        });
        return input;
    }
    function mergeSort(input, start = 0, end = input.length) {
        if (end - start <= 1) return [];
        const mid = Math.floor((start + end) / 2);
        mergeSort(input, start, mid);
        mergeSort(input, mid, end);
        return merge(input, start, mid, end);
    }
});
define('pkg/sort/merge-sort/merge-sort.spec', ['./merge-sort'], function (_mergeSort) {
    'use strict';

    describe('Merge', function () {
        test('It should merge the two ordered sub-arrays with final result ordered', function () {
            const input = [4, 5, 6, 1, 2, 3];
            const result = (0, _mergeSort.merge)(input, 0, 3, 6);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
    describe('Merge sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _mergeSort.mergeSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/sort/quick-sort/quick-sort', ['exports', 'lodash/random', '../../utils'], function (exports, _random, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.partition = partition;
    exports.quickSort = quickSort;

    var _random2 = _interopRequireDefault(_random);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function partition(input, left, right, randomized) {
        if (randomized) (0, _utils.swap)(input, (0, _random2.default)(left, right), right);
        const pivot = input[right];
        let minEdge = left - 1;
        (0, _utils.range)(left, right - 1).forEach(current => {
            if (input[current] <= pivot) {
                minEdge += 1;
                (0, _utils.swap)(input, minEdge, current);
            }
        });
        (0, _utils.swap)(input, minEdge + 1, right);
        return minEdge + 1;
    }
    function quickSort(input, start = 0, end = input.length - 1, randomized = false) {
        if (start >= end) return input;
        const mid = partition(input, start, end, randomized);
        quickSort(input, start, mid - 1);
        quickSort(input, mid + 1, end);
        return input;
    }
});
define('pkg/sort/quick-sort/quick-sort.spec', ['./quick-sort', 'lodash/last'], function (_quickSort, last) {
    'use strict';

    describe('Quick sort partition', function () {
        test('It should move the pivot to the correct position', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const pivotIndex = (0, _quickSort.partition)(input, 0, input.length - 1, false);
            expect(pivotIndex).toBe(2);
        });
        test('It should move the pivot to the correct position when randomized', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const pivotIndex = (0, _quickSort.partition)(input, 0, input.length - 1, true);
            const pivot = input[pivotIndex];
            input.forEach((value, index) => {
                if (index < pivotIndex) expect(value).toBeLessThanOrEqual(pivot);else if (index > pivotIndex) expect(value).toBeGreaterThan(pivot);else expect(value).toBe(pivot);
            });
        });
        test('Smaller numbers should be at pivot left', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const pivot = last(input);
            const pivotIndex = (0, _quickSort.partition)(input, 0, input.length - 1, false);
            const smaller = input.slice(0, pivotIndex);
            smaller.forEach(value => expect(value).toBeLessThanOrEqual(pivot));
        });
        test('Bigger numbers should be at pivot right', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const pivot = last(input);
            const pivotIndex = (0, _quickSort.partition)(input, 0, input.length - 1, false);
            const bigger = input.slice(pivotIndex + 1);
            bigger.forEach(value => expect(value).toBeGreaterThan(pivot));
        });
    });
    describe('Quick sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _quickSort.quickSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
        test('It should sort the items in randomized mode', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _quickSort.quickSort)(input, 0, input.length - 1, true);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/sort/selection-sort/selection-sort', ['exports', '../../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.selectionSort = selectionSort;
    function selectionSort(input) {
        (0, _utils.range)(0, input.length - 2).forEach(pivotIndex => {
            let min = input[pivotIndex];
            let minIndex = pivotIndex;
            for (let i = pivotIndex + 1; i < input.length; i++) {
                if (input[i] < min) {
                    min = input[i];
                    minIndex = i;
                }
            }
            (0, _utils.swap)(input, minIndex, pivotIndex);
        });
        return input;
    }
});
define('pkg/sort/selection-sort/selection-sort.spec', ['./selection-sort'], function (_selectionSort) {
    'use strict';

    describe('Insertion sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _selectionSort.selectionSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('pkg/utils', ['exports', 'lodash/range', 'lodash/rangeRight'], function (exports, _range, _rangeRight) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.fill = fill;
    exports.increaseOfPrevious = increaseOfPrevious;
    exports.moveRight = moveRight;
    exports.range = range;
    exports.reverseRange = reverseRange;
    exports.toSerializableTree = toSerializableTree;
    exports.setHead = setHead;
    exports.swap = swap;

    var _range2 = _interopRequireDefault(_range);

    var _rangeRight2 = _interopRequireDefault(_rangeRight);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function fill(array, valueFn) {
        for (let i = 0; i < array.length; i++) array[i] = valueFn(i);
        return array;
    }
    function increaseOfPrevious(array, index) {
        array[index] += array[index - 1];
    }
    function moveRight(input, index) {
        input[index + 1] = input[index];
    }
    function range(from, to) {
        return (0, _range2.default)(from, to + 1);
    }
    function reverseRange(from, to = 0) {
        return (0, _rangeRight2.default)(to, from + 1);
    }
    function toSerializableTree(root, nodeConverter) {
        if (!root) return;
        toSerializableTree(root.left, nodeConverter);
        Object.assign(root, nodeConverter(root));
        toSerializableTree(root.right, nodeConverter);
        return root;
    }
    function setHead(input, value) {
        input[0] = value;
        return input;
    }
    function swap(input, from, to) {
        const temp = input[from];
        input[from] = input[to];
        input[to] = temp;
        return input;
    }
});
