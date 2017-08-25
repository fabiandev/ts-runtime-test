define("tsr/misc/activity-selection/activity-selection", ["exports", "ts-runtime/lib", "../../utils"], function (exports, _lib, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Activity = undefined;
    exports.activitySelector = activitySelector;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const Activity = exports.Activity = _lib2.default.type("Activity", _lib2.default.object(_lib2.default.property("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("finish", _lib2.default.nullable(_lib2.default.number()))));
    function activitySelector(activities) {
        const T = _lib2.default.typeParameter("T", _lib2.default.nullable(_lib2.default.ref(Activity)));
        let _activitiesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.flowInto(T))));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))));
        _lib2.default.param("activities", _activitiesType).assert(activities);

        const selected = [activities[0]];
        let _lastActivityType = _lib2.default.nullable(_lib2.default.ref(Activity)),
            lastActivity = _lastActivityType.assert(activities[0]);

        (0, _utils.range)(1, activities.length - 1).forEach(_lib2.default.annotate(index => {
            const currentActivity = activities[index];
            if (currentActivity.start >= lastActivity.finish) {
                selected.push(currentActivity);
                lastActivity = _lastActivityType.assert(currentActivity);
            }
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(selected);
    }
    _lib2.default.annotate(activitySelector, _lib2.default.function(fn => {
        const T = fn.typeParameter("T", _lib2.default.nullable(_lib2.default.ref(Activity)));
        return [_lib2.default.param("activities", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.flowInto(T))))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))];
    }));
});
define('tsr/misc/activity-selection/activity-selection.spec', ['./activity-selection'], function (_activitySelection) {
    'use strict';

    describe('activitySelector', () => {
        it('should return a selection of non-conflicting activities', () => {
            const activities = [{ start: 1, finish: 4 }, { start: 3, finish: 5 }, { start: 0, finish: 6 }, { start: 5, finish: 7 }, { start: 3, finish: 9 }, { start: 5, finish: 9 }, { start: 6, finish: 10 }, { start: 8, finish: 11 }, { start: 8, finish: 12 }, { start: 2, finish: 14 }, { start: 12, finish: 16 }];
            const selected = (0, _activitySelection.activitySelector)(activities);
            expect(selected).toEqual([{ start: 1, finish: 4 }, { start: 5, finish: 7 }, { start: 8, finish: 11 }, { start: 12, finish: 16 }]);
        });
    });
});
define('tsr/misc/huffman/huffman', ['exports', 'ts-runtime/lib', '../../utils', 'min-heap'], function (exports, _lib, _utils, MinHeap) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Frequency = undefined;
    exports.huffman = huffman;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const Frequency = exports.Frequency = _lib2.default.type("Frequency", _lib2.default.object(_lib2.default.property("char", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.property("frequency", _lib2.default.nullable(_lib2.default.number()))));
    function huffman(frequences) {
        let _frequencesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.ref(Frequency))));
        _lib2.default.param("frequences", _frequencesType).assert(frequences);

        const queue = new MinHeap(_lib2.default.annotate((a, b) => {
            a.frequency - b.frequency;
        }, _lib2.default.function(_lib2.default.param("a", _lib2.default.any()), _lib2.default.param("b", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        frequences.forEach(_lib2.default.annotate(freq => {
            return queue.insert(freq);
        }, _lib2.default.function(_lib2.default.param("freq", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        (0, _utils.range)(0, frequences.length - 2).forEach(_lib2.default.annotate(() => {
            const tempLeft = queue.removeHead();
            const tempRight = queue.removeHead();
            tempLeft.left = void 0;
            tempLeft.right = void 0;
            tempRight.left = void 0;
            tempRight.right = void 0;
            const left = _lib2.default.nullable(_lib2.default.ref(Frequency)).assert(tempLeft);
            const right = _lib2.default.nullable(_lib2.default.ref(Frequency)).assert(tempRight);
            const merged = {
                frequency: left.frequency + right.frequency,
                left,
                right
            };
            queue.insert(merged);
        }, _lib2.default.function(_lib2.default.return(_lib2.default.any()))));
        return queue.removeHead();
    }
    _lib2.default.annotate(huffman, _lib2.default.function(_lib2.default.param("frequences", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.ref(Frequency))))), _lib2.default.return(_lib2.default.any())));
});
define('tsr/misc/huffman/huffman.spec', ['./huffman', '../../utils'], function (_huffman, _utils) {
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
define('tsr/misc/inversions-count/inversions-count', ['exports', 'ts-runtime/lib', '../../utils', 'lodash/head'], function (exports, _lib, _utils, _head) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countInversions = countInversions;

    var _lib2 = _interopRequireDefault(_lib);

    var _head2 = _interopRequireDefault(_head);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function merge(input, start, mid, end) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _startType = _lib2.default.nullable(_lib2.default.number());
        let _midType = _lib2.default.nullable(_lib2.default.number());
        let _endType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("start", _startType).assert(start);
        _lib2.default.param("mid", _midType).assert(mid);
        _lib2.default.param("end", _endType).assert(end);
        const left = input.slice(start, mid);
        const right = input.slice(mid, end);
        left[left.length] = -Infinity;
        right[right.length] = -Infinity;
        let inversionCount = 0;
        (0, _utils.range)(start, end - 1).forEach(_lib2.default.annotate(index => {
            if ((0, _head2.default)(left) > (0, _head2.default)(right)) {
                inversionCount += right.length - 1;
                input[index] = left.shift();
            } else {
                input[index] = right.shift();
            }
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(inversionCount);
    }
    _lib2.default.annotate(merge, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("mid", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
    function countInversions(input, start = 0, end = input.length) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _startType = _lib2.default.nullable(_lib2.default.number());
        let _endType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("start", _startType).assert(start);
        _lib2.default.param("end", _endType).assert(end);
        if (end - start <= 1) return _returnType.assert(0);
        const mid = Math.floor((start + end) / 2);
        const leftCount = countInversions(input, start, mid);
        const rightCount = countInversions(input, mid, end);
        return _returnType.assert(leftCount + rightCount + merge(input, start, mid, end));
    }
    _lib2.default.annotate(countInversions, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
});
define('tsr/misc/inversions-count/inversions-count.spec', ['./inversions-count'], function (_inversionsCount) {
    'use strict';

    describe('countInversions', () => {
        it('should count the number of inversions', () => {
            const input = [2, 3, 8, 6, 1];
            const count = (0, _inversionsCount.countInversions)(input);
            expect(count).toBe(5);
        });
    });
});
define("tsr/misc/longest-common-subsequence/longest-common-subsequence", ["exports", "ts-runtime/lib", "../../utils"], function (exports, _lib, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.lcsLengths = lcsLengths;
    exports.findLCS = findLCS;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function lcsLengths(seqA, seqB) {
        let _seqAType = _lib2.default.nullable(_lib2.default.string());
        let _seqBType = _lib2.default.nullable(_lib2.default.string());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
        _lib2.default.param("seqA", _seqAType).assert(seqA);
        _lib2.default.param("seqB", _seqBType).assert(seqB);
        const lengthA = seqA.length;
        const lengthB = seqB.length;
        const lengths = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))).assert(new Array(lengthA + 1));
        (0, _utils.fill)(lengths, _lib2.default.annotate((index) => {
            let _indexType = _lib2.default.nullable(_lib2.default.number());
            _lib2.default.param("index", _indexType).assert(index);
            return new Array(lengthB + 1);
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.any()))));
        (0, _utils.range)(0, lengthA).forEach(_lib2.default.annotate(i => {
            return lengths[i][0] = 0;
        }, _lib2.default.function(_lib2.default.param("i", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        (0, _utils.range)(0, lengthB).forEach(_lib2.default.annotate(i => {
            return lengths[0][i] = 0;
        }, _lib2.default.function(_lib2.default.param("i", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        (0, _utils.range)(0, lengthA - 1).forEach(_lib2.default.annotate(indexA => {
            (0, _utils.range)(0, lengthB - 1).forEach(_lib2.default.annotate(indexB => {
                const charA = seqA[indexA];
                const charB = seqB[indexB];
                if (charA === charB) {
                    lengths[indexA + 1][indexB + 1] = lengths[indexA][indexB] + 1;
                } else {
                    const subSeqALength = lengths[indexA][indexB + 1];
                    const subSeqBLength = lengths[indexA + 1][indexB];
                    lengths[indexA + 1][indexB + 1] = Math.max(subSeqALength, subSeqBLength);
                }
            }, _lib2.default.function(_lib2.default.param("indexB", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        }, _lib2.default.function(_lib2.default.param("indexA", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(lengths);
    }
    _lib2.default.annotate(lcsLengths, _lib2.default.function(_lib2.default.param("seqA", _lib2.default.nullable(_lib2.default.string())), _lib2.default.param("seqB", _lib2.default.nullable(_lib2.default.string())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))))));

    function walkLCS(lengths, seqA, seqB, indexA, indexB) {
        let _lengthsType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))));
        let _seqAType = _lib2.default.nullable(_lib2.default.string());
        let _seqBType = _lib2.default.nullable(_lib2.default.string());
        let _indexAType = _lib2.default.nullable(_lib2.default.number());
        let _indexBType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.string()));
        _lib2.default.param("lengths", _lengthsType).assert(lengths);
        _lib2.default.param("seqA", _seqAType).assert(seqA);
        _lib2.default.param("seqB", _seqBType).assert(seqB);
        _lib2.default.param("indexA", _indexAType).assert(indexA);
        _lib2.default.param("indexB", _indexBType).assert(indexB);
        if (indexA === 0 || indexB === 0) return _returnType.assert('');
        if (seqA[indexA - 1] === seqB[indexB - 1]) {
            const subLCS = walkLCS(lengths, seqA, seqB, indexA - 1, indexB - 1);
            return _returnType.assert(subLCS + seqA[indexA - 1]);
        } else if (lengths[indexA - 1][indexB] >= lengths[indexA][indexB - 1]) {
            return _returnType.assert(walkLCS(lengths, seqA, seqB, indexA - 1, indexB));
        } else {
            return _returnType.assert(walkLCS(lengths, seqA, seqB, indexA, indexB - 1));
        }
    }
    _lib2.default.annotate(walkLCS, _lib2.default.function(_lib2.default.param("lengths", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))))), _lib2.default.param("seqA", _lib2.default.nullable(_lib2.default.string())), _lib2.default.param("seqB", _lib2.default.nullable(_lib2.default.string())), _lib2.default.param("indexA", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("indexB", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.string()))));
    function findLCS(seqA, seqB) {
        let _seqAType = _lib2.default.nullable(_lib2.default.string());
        let _seqBType = _lib2.default.nullable(_lib2.default.string());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.string()));
        _lib2.default.param("seqA", _seqAType).assert(seqA);
        _lib2.default.param("seqB", _seqBType).assert(seqB);
        const lengths = lcsLengths(seqA, seqB);
        const lcs = walkLCS(lengths, seqA, seqB, seqA.length, seqB.length);
        return _returnType.assert(lcs);
    }
    _lib2.default.annotate(findLCS, _lib2.default.function(_lib2.default.param("seqA", _lib2.default.nullable(_lib2.default.string())), _lib2.default.param("seqB", _lib2.default.nullable(_lib2.default.string())), _lib2.default.return(_lib2.default.nullable(_lib2.default.string()))));
});
define('tsr/misc/longest-common-subsequence/longest-common-subsequence.spec', ['./longest-common-subsequence'], function (_longestCommonSubsequence) {
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
define("tsr/misc/maximum-subarray/maximum-subarray", ["exports", "ts-runtime/lib", "../../utils"], function (exports, _lib, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.maxCrossSubarray = maxCrossSubarray;
    exports.maxSubarray = maxSubarray;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function maxCrossSubarray(input, start, mid, end) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _startType = _lib2.default.nullable(_lib2.default.number());
        let _midType = _lib2.default.nullable(_lib2.default.number());
        let _endType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.object(_lib2.default.property("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("sum", _lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("start", _startType).assert(start);
        _lib2.default.param("mid", _midType).assert(mid);
        _lib2.default.param("end", _endType).assert(end);
        let leftIndex = -1;
        let leftMaxSum = -Infinity;
        let sum = 0;
        (0, _utils.reverseRange)(mid, start).forEach(_lib2.default.annotate(index => {
            sum += input[index];
            if (sum > leftMaxSum) {
                leftMaxSum = sum;
                leftIndex = index;
            }
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        let rightIndex = -1;
        let rightMaxSum = -Infinity;
        sum = 0;
        (0, _utils.range)(mid + 1, end).forEach(_lib2.default.annotate(index => {
            sum += input[index];
            if (sum > rightMaxSum) {
                rightMaxSum = sum;
                rightIndex = index;
            }
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert({
            start: leftIndex,
            end: rightIndex,
            sum: leftMaxSum + rightMaxSum
        });
    }
    _lib2.default.annotate(maxCrossSubarray, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("mid", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.object(_lib2.default.property("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("sum", _lib2.default.nullable(_lib2.default.number()))))));
    function maxSubarray(input, start, end) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _startType = _lib2.default.nullable(_lib2.default.number());
        let _endType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.object(_lib2.default.property("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("sum", _lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("start", _startType).assert(start);
        _lib2.default.param("end", _endType).assert(end);
        if (end - start === 0) return _returnType.assert({ start, end, sum: input[start] });
        const mid = Math.floor((start + end) / 2);
        const leftMax = maxSubarray(input, start, mid);
        const rightMax = maxSubarray(input, mid + 1, end);
        const crossMax = maxCrossSubarray(input, start, mid, end);
        if (leftMax.sum >= rightMax.sum && leftMax.sum >= crossMax.sum) {
            return _returnType.assert(leftMax);
        } else if (rightMax.sum >= leftMax.sum && rightMax.sum >= crossMax.sum) {
            return _returnType.assert(rightMax);
        } else {
            return _returnType.assert(crossMax);
        }
    }
    _lib2.default.annotate(maxSubarray, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.object(_lib2.default.property("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("sum", _lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/misc/maximum-subarray/maximum-subarray.spec', ['./maximum-subarray'], function (_maximumSubarray) {
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
define('tsr/misc/priority-queue/priority-queue', ['exports', 'ts-runtime/lib', 'lodash/head', 'lodash/last', '../../sort/heap-sort/heap-sort', '../../utils'], function (exports, _lib, _head, _last, _heapSort, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.maximum = maximum;
    exports.extractMax = extractMax;
    exports.increasePriority = increasePriority;
    exports.insert = insert;

    var _lib2 = _interopRequireDefault(_lib);

    var _head2 = _interopRequireDefault(_head);

    var _last2 = _interopRequireDefault(_last);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function maximum(queue) {
        let _queueType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("queue", _queueType).assert(queue);
        return _returnType.assert((0, _head2.default)(queue));
    }
    _lib2.default.annotate(maximum, _lib2.default.function(_lib2.default.param("queue", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
    function extractMax(queue) {
        let _queueType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("queue", _queueType).assert(queue);
        const max = maximum(queue);
        (0, _utils.setHead)(queue, (0, _last2.default)(queue));
        queue.pop();
        (0, _heapSort.maxHeapify)(queue, 0, queue.length);
        return _returnType.assert(max);
    }
    _lib2.default.annotate(extractMax, _lib2.default.function(_lib2.default.param("queue", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));

    function isParentInvalid(queue, index) {
        let _queueType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()));
        _lib2.default.param("queue", _queueType).assert(queue);
        _lib2.default.param("index", _indexType).assert(index);
        return _returnType.assert(queue[(0, _heapSort.parent)(index)] < queue[index]);
    }
    _lib2.default.annotate(isParentInvalid, _lib2.default.function(_lib2.default.param("queue", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))));
    function increasePriority(queue, index, increase) {
        let _queueType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        let _increaseType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("queue", _queueType).assert(queue);
        _lib2.default.param("index", _indexType).assert(index);
        _lib2.default.param("increase", _increaseType).assert(increase);
        queue[index] += increase;

        let validHeapIndex = index;
        while (isParentInvalid(queue, validHeapIndex) && validHeapIndex !== 0) {
            (0, _utils.swap)(queue, validHeapIndex, (0, _heapSort.parent)(validHeapIndex));
            validHeapIndex = (0, _heapSort.parent)(validHeapIndex);
        }
        return _returnType.assert(queue);
    }
    _lib2.default.annotate(increasePriority, _lib2.default.function(_lib2.default.param("queue", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("increase", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    function insert(queue, value) {
        let _queueType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _valueType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("queue", _queueType).assert(queue);
        _lib2.default.param("value", _valueType).assert(value);
        queue.push(0);
        increasePriority(queue, queue.length - 1, value);
        return _returnType.assert(queue);
    }
    _lib2.default.annotate(insert, _lib2.default.function(_lib2.default.param("queue", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("value", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/misc/priority-queue/priority-queue.spec', ['./priority-queue'], function (_priorityQueue) {
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
define("tsr/misc/rod-cutting/rod-cutting", ["exports", "ts-runtime/lib", "../../utils"], function (exports, _lib, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BestResults = undefined;
    exports.topDownCutRod = topDownCutRod;
    exports.bottomUpCutRod = bottomUpCutRod;
    exports.cutRod = cutRod;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const BestResults = exports.BestResults = _lib2.default.type("BestResults", _lib2.default.object(_lib2.default.property("bestPrices", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.property("bestFirstCuts", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    function topDownCutRod(prices, length) {
        let _pricesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _lengthType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(BestResults)));
        _lib2.default.param("prices", _pricesType).assert(prices);
        _lib2.default.param("length", _lengthType).assert(length);
        const bestPrices = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))).assert(new Array(length + 1));
        bestPrices.fill(-Infinity);
        const bestFirstCuts = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))).assert(new Array(length + 1));
        return _returnType.assert(topDownCutRodAux(prices, length, bestPrices, bestFirstCuts));
    }
    _lib2.default.annotate(topDownCutRod, _lib2.default.function(_lib2.default.param("prices", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("length", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(BestResults)))));
    function topDownCutRodAux(prices, length, bestPrices, bestFirstCuts) {
        let _pricesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _lengthType = _lib2.default.nullable(_lib2.default.number());
        let _bestPricesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _bestFirstCutsType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(BestResults)));
        _lib2.default.param("prices", _pricesType).assert(prices);
        _lib2.default.param("length", _lengthType).assert(length);
        _lib2.default.param("bestPrices", _bestPricesType).assert(bestPrices);
        _lib2.default.param("bestFirstCuts", _bestFirstCutsType).assert(bestFirstCuts);
        if (bestPrices[length] >= 0) return _returnType.assert({ bestPrices, bestFirstCuts });
        let maxCutPrice = -Infinity;
        let _bestFirstCutType = _lib2.default.nullable(_lib2.default.number()),
            bestFirstCut = _bestFirstCutType.assert(-1);
        if (length === 0) maxCutPrice = 0;else {
            (0, _utils.range)(1, length).forEach(_lib2.default.annotate(firstCut => {
                const remainingRod = topDownCutRodAux(prices, length - firstCut, bestPrices, bestFirstCuts);
                const cutPrice = prices[firstCut] + remainingRod.bestPrices[length - firstCut];
                if (cutPrice > maxCutPrice) {
                    maxCutPrice = cutPrice;
                    bestFirstCut = _bestFirstCutType.assert(firstCut);
                }
            }, _lib2.default.function(_lib2.default.param("firstCut", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        }
        bestPrices[length] = maxCutPrice;
        bestFirstCuts[length] = bestFirstCut;
        return _returnType.assert({
            bestPrices,
            bestFirstCuts
        });
    }
    _lib2.default.annotate(topDownCutRodAux, _lib2.default.function(_lib2.default.param("prices", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("length", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("bestPrices", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("bestFirstCuts", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(BestResults)))));
    function bottomUpCutRod(prices, length) {
        let _pricesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _lengthType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(BestResults)));
        _lib2.default.param("prices", _pricesType).assert(prices);
        _lib2.default.param("length", _lengthType).assert(length);
        const bestPrices = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))).assert(new Array(length + 1));
        const bestFirstCuts = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))).assert(new Array(length + 1));
        bestPrices.fill(-Infinity);

        bestPrices[0] = 0;
        (0, _utils.range)(1, length).forEach(_lib2.default.annotate(subLength => {
            let maxCutPrice = -Infinity;
            (0, _utils.range)(1, subLength).forEach(_lib2.default.annotate(firstCut => {
                const cutPrice = prices[firstCut] + bestPrices[subLength - firstCut];
                if (cutPrice > maxCutPrice) {
                    maxCutPrice = cutPrice;
                    bestPrices[subLength] = maxCutPrice;
                    bestFirstCuts[subLength] = firstCut;
                }
            }, _lib2.default.function(_lib2.default.param("firstCut", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        }, _lib2.default.function(_lib2.default.param("subLength", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert({
            bestPrices,
            bestFirstCuts
        });
    }
    _lib2.default.annotate(bottomUpCutRod, _lib2.default.function(_lib2.default.param("prices", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("length", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(BestResults)))));
    function cutRod(prices, length, strategy = 'bottomUp') {
        let _pricesType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _lengthType = _lib2.default.nullable(_lib2.default.number());
        let _strategyType = _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.string("bottomUp")), _lib2.default.nullable(_lib2.default.string("topDown"))));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("prices", _pricesType).assert(prices);
        _lib2.default.param("length", _lengthType).assert(length);
        _lib2.default.param("strategy", _strategyType).assert(strategy);
        const { bestFirstCuts } = strategy === 'bottomUp' ? bottomUpCutRod(prices, length) : topDownCutRod(prices, length);
        let remainingRod = length;
        const bestCuts = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))).assert([]);
        while (remainingRod) {
            bestCuts.push(bestFirstCuts[remainingRod]);
            remainingRod -= bestFirstCuts[remainingRod];
        }
        return _returnType.assert(bestCuts);
    }
    _lib2.default.annotate(cutRod, _lib2.default.function(_lib2.default.param("prices", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("length", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("strategy", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.string("bottomUp")), _lib2.default.nullable(_lib2.default.string("topDown"))))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/misc/rod-cutting/rod-cutting.spec', ['./rod-cutting'], function (_rodCutting) {
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
define("tsr/search/binary-search/binary-search", ["exports", "ts-runtime/lib"], function (exports, _lib) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.binarySearch = binarySearch;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function binarySearch(input, value, start, end) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _valueType = _lib2.default.nullable(_lib2.default.number());
        let _startType = _lib2.default.nullable(_lib2.default.number());
        let _endType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("value", _valueType).assert(value);
        _lib2.default.param("start", _startType).assert(start);
        _lib2.default.param("end", _endType).assert(end);
        if (start > end || value < input[start] || value > input[end]) return _returnType.assert(null);
        const mid = Math.floor((end + start) / 2);
        if (input[mid] === value) return _returnType.assert(mid);else if (input[mid] < value) return _returnType.assert(binarySearch(input, value, mid + 1, end));else return _returnType.assert(binarySearch(input, value, start, mid - 1));
    }
    _lib2.default.annotate(binarySearch, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("value", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
});
define('tsr/search/binary-search/binary-search.spec', ['./binary-search'], function (_binarySearch) {
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
define("tsr/search/binary-search-tree/binary-search-tree", ["exports", "ts-runtime/lib"], function (exports, _lib) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Tree = exports.Node = undefined;
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

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const Node = exports.Node = _lib2.default.type("Node", Node => _lib2.default.object(_lib2.default.property("parent", _lib2.default.nullable(_lib2.default.ref(Node)), true), _lib2.default.property("key", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("left", _lib2.default.nullable(_lib2.default.ref(Node)), true), _lib2.default.property("right", _lib2.default.nullable(_lib2.default.ref(Node)), true)));
    const Tree = exports.Tree = _lib2.default.type("Tree", _lib2.default.object(_lib2.default.property("root", _lib2.default.nullable(_lib2.default.ref(Node)))));
    function createNode(key, left = null, right = null) {
        let _keyType = _lib2.default.nullable(_lib2.default.number());
        let _leftType = _lib2.default.nullable(_lib2.default.ref(Node));
        let _rightType = _lib2.default.nullable(_lib2.default.ref(Node));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("key", _keyType).assert(key);
        _lib2.default.param("left", _leftType).assert(left);
        _lib2.default.param("right", _rightType).assert(right);
        const node = {
            key,
            left,
            right,
            parent: null
        };
        if (left) left.parent = node;
        if (right) right.parent = node;
        return _returnType.assert(node);
    }
    _lib2.default.annotate(createNode, _lib2.default.function(_lib2.default.param("key", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("left", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.param("right", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function inOrderWalk(node) {
        let _nodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        _lib2.default.param("node", _nodeType).assert(node);
        if (!node) return;
        inOrderWalk(node.left);
        console.log(node);
        inOrderWalk(node.right);
    }
    _lib2.default.annotate(inOrderWalk, _lib2.default.function(_lib2.default.param("node", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.any())));
    function search(node, key) {
        let _nodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        let _keyType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("node", _nodeType).assert(node);
        _lib2.default.param("key", _keyType).assert(key);
        if (!node) return _returnType.assert(null);
        if (node.key === key) return _returnType.assert(node);else if (node.key < key) return _returnType.assert(search(node.right, key));else return _returnType.assert(search(node.left, key));
    }
    _lib2.default.annotate(search, _lib2.default.function(_lib2.default.param("node", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.param("key", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function minimum(node) {
        let _nodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("node", _nodeType).assert(node);
        let _leftMostType = _lib2.default.nullable(_lib2.default.ref(Node)),
            leftMost = _leftMostType.assert(node);
        while (leftMost !== null && leftMost.left !== null) {
            leftMost = _leftMostType.assert(leftMost.left);
        }
        return _returnType.assert(leftMost);
    }
    _lib2.default.annotate(minimum, _lib2.default.function(_lib2.default.param("node", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function maximum(node) {
        let _nodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("node", _nodeType).assert(node);
        let _rightMostType = _lib2.default.nullable(_lib2.default.ref(Node)),
            rightMost = _rightMostType.assert(node);
        while (rightMost !== null && rightMost.right !== null) {
            rightMost = _rightMostType.assert(rightMost.right);
        }
        return _returnType.assert(rightMost);
    }
    _lib2.default.annotate(maximum, _lib2.default.function(_lib2.default.param("node", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function successor(node) {
        let _nodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("node", _nodeType).assert(node);
        if (node.right !== null) return _returnType.assert(minimum(node.right));
        let parent = node.parent;
        let current = node;
        while (parent !== null && parent.right === current) {
            current = parent;
            parent = parent.parent;
        }
        return _returnType.assert(parent);
    }
    _lib2.default.annotate(successor, _lib2.default.function(_lib2.default.param("node", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function predecessor(node) {
        let _nodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("node", _nodeType).assert(node);
        if (node.left !== null) return _returnType.assert(node.left);
        let parent = node.parent;
        let current = node;
        while (parent !== null && parent.left === current) {
            current = parent;
            parent = parent.parent;
        }
        return _returnType.assert(parent);
    }
    _lib2.default.annotate(predecessor, _lib2.default.function(_lib2.default.param("node", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function insert(tree, leaf) {
        let _treeType = _lib2.default.nullable(_lib2.default.ref(Tree));
        let _leafType = _lib2.default.nullable(_lib2.default.ref(Node));
        _lib2.default.param("tree", _treeType).assert(tree);
        _lib2.default.param("leaf", _leafType).assert(leaf);
        let _parentType = _lib2.default.nullable(_lib2.default.ref(Node)),
            parent = _parentType.assert(null);
        let current = tree.root;
        while (current !== null) {
            parent = _parentType.assert(current);
            if (leaf.key >= current.key) {
                current = current.right;
            } else {
                current = current.left;
            }
        }
        if (parent === null) tree.root = leaf;else if (leaf.key >= parent.key) parent.right = leaf;else parent.left = leaf;
        leaf.parent = parent;
    }
    _lib2.default.annotate(insert, _lib2.default.function(_lib2.default.param("tree", _lib2.default.nullable(_lib2.default.ref(Tree))), _lib2.default.param("leaf", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.any())));
    function transplant(tree, oldNode, newNode) {
        let _treeType = _lib2.default.nullable(_lib2.default.ref(Tree));
        let _oldNodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        let _newNodeType = _lib2.default.nullable(_lib2.default.ref(Node));
        _lib2.default.param("tree", _treeType).assert(tree);
        _lib2.default.param("oldNode", _oldNodeType).assert(oldNode);
        _lib2.default.param("newNode", _newNodeType).assert(newNode);
        if (oldNode.parent === null) tree.root = newNode;else if (oldNode.parent.left === oldNode) oldNode.parent.left = newNode;else oldNode.parent.right = newNode;
        if (newNode !== null) newNode.parent = oldNode.parent;
    }
    _lib2.default.annotate(transplant, _lib2.default.function(_lib2.default.param("tree", _lib2.default.nullable(_lib2.default.ref(Tree))), _lib2.default.param("oldNode", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.param("newNode", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.any())));
    function remove(tree, removed) {
        let _treeType = _lib2.default.nullable(_lib2.default.ref(Tree));
        let _removedType = _lib2.default.nullable(_lib2.default.ref(Node));
        _lib2.default.param("tree", _treeType).assert(tree);
        _lib2.default.param("removed", _removedType).assert(removed);
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
    _lib2.default.annotate(remove, _lib2.default.function(_lib2.default.param("tree", _lib2.default.nullable(_lib2.default.ref(Tree))), _lib2.default.param("removed", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.return(_lib2.default.any())));
});
define('tsr/search/binary-search-tree/binary-search-tree.spec', ['./binary-search-tree'], function (_binarySearchTree) {
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
define('tsr/sort/counting-sort/counting-sort', ['exports', 'ts-runtime/lib', 'lodash/forEachRight', '../../utils'], function (exports, _lib, _forEachRight, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countingSort = countingSort;

    var _lib2 = _interopRequireDefault(_lib);

    var _forEachRight2 = _interopRequireDefault(_forEachRight);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function countingSort(input, max) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _maxType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("max", _maxType).assert(max);
        const result = [];
        const counter = new Array(max + 1);
        counter.fill(0);
        input.forEach(_lib2.default.annotate(value => {
            return counter[value] += 1;
        }, _lib2.default.function(_lib2.default.param("value", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        (0, _utils.range)(1, max).forEach(_lib2.default.annotate(index => {
            return (0, _utils.increaseOfPrevious)(counter, index);
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        (0, _forEachRight2.default)(input, _lib2.default.annotate(value => {
            counter[value] -= 1;
            const position = counter[value];
            result[position] = value;
        }, _lib2.default.function(_lib2.default.param("value", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(result);
    }
    _lib2.default.annotate(countingSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("max", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/counting-sort/counting-sort.spec', ['lodash/max', './counting-sort'], function (_max, _countingSort) {
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
define('tsr/sort/heap-sort/heap-sort', ['exports', 'ts-runtime/lib', '../../utils'], function (exports, _lib, _utils) {
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

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function parent(index) {
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("index", _indexType).assert(index);
        return _returnType.assert(Math.floor((index - 1) / 2));
    }
    _lib2.default.annotate(parent, _lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
    function left(index) {
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("index", _indexType).assert(index);
        return _returnType.assert(2 * index + 1);
    }
    _lib2.default.annotate(left, _lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
    function right(index) {
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("index", _indexType).assert(index);
        return _returnType.assert(2 * (index + 1));
    }
    _lib2.default.annotate(right, _lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
    function isInHeap(index, heapSize) {
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        let _heapSizeType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()));
        _lib2.default.param("index", _indexType).assert(index);
        _lib2.default.param("heapSize", _heapSizeType).assert(heapSize);
        return _returnType.assert(index < heapSize);
    }
    _lib2.default.annotate(isInHeap, _lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("heapSize", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))));
    function maxHeapify(input, index, heapSize) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        let _heapSizeType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("index", _indexType).assert(index);
        _lib2.default.param("heapSize", _heapSizeType).assert(heapSize);
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
        return _returnType.assert(input);
    }
    _lib2.default.annotate(maxHeapify, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("heapSize", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    function buildMaxHeap(input) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);

        const firstLeaf = Math.floor((input.length - 1) / 2);
        (0, _utils.reverseRange)(firstLeaf).forEach(_lib2.default.annotate(index => {
            maxHeapify(input, index, input.length);
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(input);
    }
    _lib2.default.annotate(buildMaxHeap, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    function heapSort(input) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        buildMaxHeap(input);
        (0, _utils.reverseRange)(input.length - 1).forEach(_lib2.default.annotate(heapEnd => {
            (0, _utils.swap)(input, 0, heapEnd);
            maxHeapify(input, 0, heapEnd);
        }, _lib2.default.function(_lib2.default.param("heapEnd", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(input);
    }
    _lib2.default.annotate(heapSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/heap-sort/heap-sort.spec', ['./heap-sort'], function (_heapSort) {
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
define("tsr/sort/insertion-sort/insertion-sort", ["exports", "ts-runtime/lib", "../../utils"], function (exports, _lib, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.insertionSort = insertionSort;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function insertionSort(input) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        input.forEach(_lib2.default.annotate((pivot, pivotIndex) => {
            let compareIndex = pivotIndex - 1;
            while (compareIndex > -1 && input[compareIndex] > pivot) {
                (0, _utils.moveRight)(input, compareIndex);
                compareIndex -= 1;
            }
            input[compareIndex + 1] = pivot;
        }, _lib2.default.function(_lib2.default.param("pivot", _lib2.default.any()), _lib2.default.param("pivotIndex", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(input);
    }
    _lib2.default.annotate(insertionSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/insertion-sort/insertion-sort.spec', ['./insertion-sort'], function (_insertionSort) {
    'use strict';

    describe('Insertion sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _insertionSort.insertionSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('tsr/sort/merge-and-insertion-sort/merge-and-insertion-sort', ['exports', 'ts-runtime/lib', '../insertion-sort/insertion-sort', '../merge-sort/merge-sort'], function (exports, _lib, _insertionSort, _mergeSort) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.mergeAndInsertionSort = mergeAndInsertionSort;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function mergeAndInsertionSort(input, start = 0, end = input.length, threshold = 10) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        if (end - start <= 1) return _returnType.assert([]);
        if (end - start <= threshold) return _returnType.assert((0, _insertionSort.insertionSort)(input));

        const mid = Math.floor((start + end) / 2);
        mergeAndInsertionSort(input, start, mid);
        mergeAndInsertionSort(input, mid, end);
        return _returnType.assert((0, _mergeSort.merge)(input, start, mid, end));
    }
    _lib2.default.annotate(mergeAndInsertionSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.any()), _lib2.default.param("end", _lib2.default.any()), _lib2.default.param("threshold", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/merge-and-insertion-sort/merge-and-insertion-sort.spec', ['./merge-and-insertion-sort'], function (_mergeAndInsertionSort) {
    'use strict';

    describe('Insertion sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _mergeAndInsertionSort.mergeAndInsertionSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define('tsr/sort/merge-sort/merge-sort', ['exports', 'ts-runtime/lib', 'lodash/head', '../../utils'], function (exports, _lib, _head, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.merge = merge;
    exports.mergeSort = mergeSort;

    var _lib2 = _interopRequireDefault(_lib);

    var _head2 = _interopRequireDefault(_head);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function merge(input, start, mid, end) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _startType = _lib2.default.nullable(_lib2.default.number());
        let _midType = _lib2.default.nullable(_lib2.default.number());
        let _endType = _lib2.default.nullable(_lib2.default.number());
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("start", _startType).assert(start);
        _lib2.default.param("mid", _midType).assert(mid);
        _lib2.default.param("end", _endType).assert(end);

        const left = input.slice(start, mid);
        const right = input.slice(mid, end);
        left[left.length] = Infinity;
        right[right.length] = Infinity;
        (0, _utils.range)(start, end - 1).forEach(_lib2.default.annotate(index => {
            if ((0, _head2.default)(left) <= (0, _head2.default)(right)) input[index] = left.shift();else input[index] = right.shift();
        }, _lib2.default.function(_lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return input;
    }
    _lib2.default.annotate(merge, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("mid", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.any())));
    function mergeSort(input, start = 0, end = input.length) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        if (end - start <= 1) return _returnType.assert([]);
        const mid = Math.floor((start + end) / 2);
        mergeSort(input, start, mid);
        mergeSort(input, mid, end);
        return _returnType.assert(merge(input, start, mid, end));
    }
    _lib2.default.annotate(mergeSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.any()), _lib2.default.param("end", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/merge-sort/merge-sort.spec', ['./merge-sort'], function (_mergeSort) {
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
define('tsr/sort/quick-sort/quick-sort', ['exports', 'ts-runtime/lib', 'lodash/random', '../../utils'], function (exports, _lib, _random, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.partition = partition;
    exports.quickSort = quickSort;

    var _lib2 = _interopRequireDefault(_lib);

    var _random2 = _interopRequireDefault(_random);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function partition(input, left, right, randomized) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _leftType = _lib2.default.nullable(_lib2.default.number());
        let _rightType = _lib2.default.nullable(_lib2.default.number());
        let _randomizedType = _lib2.default.nullable(_lib2.default.boolean());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.number()));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("left", _leftType).assert(left);
        _lib2.default.param("right", _rightType).assert(right);
        _lib2.default.param("randomized", _randomizedType).assert(randomized);
        if (randomized) (0, _utils.swap)(input, (0, _random2.default)(left, right), right);
        const pivot = input[right];
        let minEdge = left - 1;
        (0, _utils.range)(left, right - 1).forEach(_lib2.default.annotate(current => {
            if (input[current] <= pivot) {
                minEdge += 1;
                (0, _utils.swap)(input, minEdge, current);
            }
        }, _lib2.default.function(_lib2.default.param("current", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        (0, _utils.swap)(input, minEdge + 1, right);
        return _returnType.assert(minEdge + 1);
    }
    _lib2.default.annotate(partition, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("left", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("right", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("randomized", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))));
    function quickSort(input, start = 0, end = input.length - 1, randomized = false) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        if (start >= end) return _returnType.assert(input);
        const mid = partition(input, start, end, randomized);
        quickSort(input, start, mid - 1);
        quickSort(input, mid + 1, end);
        return _returnType.assert(input);
    }
    _lib2.default.annotate(quickSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("start", _lib2.default.any()), _lib2.default.param("end", _lib2.default.any()), _lib2.default.param("randomized", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/quick-sort/quick-sort.spec', ['./quick-sort', 'lodash/last'], function (_quickSort, last) {
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
define("tsr/sort/selection-sort/selection-sort", ["exports", "ts-runtime/lib", "../../utils"], function (exports, _lib, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.selectionSort = selectionSort;

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function selectionSort(input) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);

        (0, _utils.range)(0, input.length - 2).forEach(_lib2.default.annotate(pivotIndex => {
            let min = input[pivotIndex];
            let minIndex = pivotIndex;
            for (let i = pivotIndex + 1; i < input.length; i++) {
                if (input[i] < min) {
                    min = input[i];
                    minIndex = i;
                }
            }
            (0, _utils.swap)(input, minIndex, pivotIndex);
        }, _lib2.default.function(_lib2.default.param("pivotIndex", _lib2.default.any()), _lib2.default.return(_lib2.default.any()))));
        return _returnType.assert(input);
    }
    _lib2.default.annotate(selectionSort, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
define('tsr/sort/selection-sort/selection-sort.spec', ['./selection-sort'], function (_selectionSort) {
    'use strict';

    describe('Insertion sort', function () {
        test('It should sort the items', function () {
            const input = [5, 2, 4, 6, 1, 3];
            const result = (0, _selectionSort.selectionSort)(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
define("tsr/tsr-declarations", ["ts-runtime/lib"], function (_lib) {
    "use strict";

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    _lib2.default.declare("Array.163722653", _lib2.default.type("Array", Array => {
        const T = Array.typeParameter("T");
        return _lib2.default.object(_lib2.default.property("length", _lib2.default.nullable(_lib2.default.number())), _lib2.default.indexer("n", _lib2.default.nullable(_lib2.default.number()), _lib2.default.nullable(T)), _lib2.default.property("includes", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("searchElement", _lib2.default.nullable(T)), _lib2.default.param("fromIndex", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("toString", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.string()))))), _lib2.default.property("toLocaleString", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.string()))))), _lib2.default.property("push", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("items", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("pop", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(_lib2.default.undef()))))))), _lib2.default.property("concat", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("items", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))), _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))), _lib2.default.property("join", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("separator", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.string()))))), _lib2.default.property("reverse", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))), _lib2.default.property("shift", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(_lib2.default.undef()))))))), _lib2.default.property("slice", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("start", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))), _lib2.default.property("sort", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("compareFn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("a", _lib2.default.nullable(T)), _lib2.default.param("b", _lib2.default.nullable(T)), _lib2.default.return(_lib2.default.nullable(_lib2.default.number())))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.this(undefined)))))), _lib2.default.property("splice", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("deleteCount", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.param("items", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))), _lib2.default.property("unshift", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("items", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("indexOf", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("searchElement", _lib2.default.nullable(T)), _lib2.default.param("fromIndex", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("lastIndexOf", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("searchElement", _lib2.default.nullable(T)), _lib2.default.param("fromIndex", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("every", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.param("thisArg", _lib2.default.any(), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("some", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.param("thisArg", _lib2.default.any(), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("forEach", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.void())))), _lib2.default.param("thisArg", _lib2.default.any(), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("map", _lib2.default.nullable(_lib2.default.function(fn => {
            const U = fn.typeParameter("U");
            return [_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(U))))), _lib2.default.param("thisArg", _lib2.default.any(), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(U))))];
        }))), _lib2.default.property("filter", _lib2.default.nullable(_lib2.default.function(fn => {
            const S = fn.typeParameter("S", _lib2.default.nullable(T));
            return [_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean())))), _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.any())))))), _lib2.default.param("thisArg", _lib2.default.any(), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(S))), _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))];
        }))), _lib2.default.property("reduce", _lib2.default.nullable(_lib2.default.function(fn => {
            const U = fn.typeParameter("U");
            return [_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.function(_lib2.default.param("previousValue", _lib2.default.nullable(T)), _lib2.default.param("currentValue", _lib2.default.nullable(T)), _lib2.default.param("currentIndex", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(T)))), _lib2.default.nullable(_lib2.default.function(_lib2.default.param("previousValue", _lib2.default.nullable(U)), _lib2.default.param("currentValue", _lib2.default.nullable(T)), _lib2.default.param("currentIndex", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(U))))))), _lib2.default.param("initialValue", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(U))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(U))))];
        }))), _lib2.default.property("reduceRight", _lib2.default.nullable(_lib2.default.function(fn => {
            const U = fn.typeParameter("U");
            return [_lib2.default.param("callbackfn", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.function(_lib2.default.param("previousValue", _lib2.default.nullable(T)), _lib2.default.param("currentValue", _lib2.default.nullable(T)), _lib2.default.param("currentIndex", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(T)))), _lib2.default.nullable(_lib2.default.function(_lib2.default.param("previousValue", _lib2.default.nullable(U)), _lib2.default.param("currentValue", _lib2.default.nullable(T)), _lib2.default.param("currentIndex", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(U))))))), _lib2.default.param("initialValue", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(U))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(U))))];
        }))), _lib2.default.property(Symbol.unscopables, _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.object(_lib2.default.property("copyWithin", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.property("entries", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.property("fill", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.property("find", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.property("findIndex", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.property("keys", _lib2.default.nullable(_lib2.default.boolean())), _lib2.default.property("values", _lib2.default.nullable(_lib2.default.boolean()))))))), _lib2.default.property(Symbol.iterator, _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.ref(IterableIterator, _lib2.default.nullable(T))))))), _lib2.default.property("entries", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.ref(IterableIterator, _lib2.default.nullable(_lib2.default.tuple(_lib2.default.nullable(_lib2.default.number()), _lib2.default.nullable(T))))))))), _lib2.default.property("keys", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.ref(IterableIterator, _lib2.default.nullable(_lib2.default.number()))))))), _lib2.default.property("values", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.ref(IterableIterator, _lib2.default.nullable(T))))))), _lib2.default.property("find", _lib2.default.nullable(_lib2.default.function(fn => {
            const Z = fn.typeParameter("Z");
            return [_lib2.default.param("predicate", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.function(_lib2.default.param("this", _lib2.default.void()), _lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("obj", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean())))), _lib2.default.nullable(_lib2.default.function(_lib2.default.param("this", _lib2.default.nullable(Z)), _lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("obj", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))))), _lib2.default.param("thisArg", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.undef()), _lib2.default.nullable(Z))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(_lib2.default.undef()))))];
        }))), _lib2.default.property("findIndex", _lib2.default.nullable(_lib2.default.function(fn => {
            const Z = fn.typeParameter("Z");
            return [_lib2.default.param("predicate", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.function(_lib2.default.param("this", _lib2.default.void()), _lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("obj", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean())))), _lib2.default.nullable(_lib2.default.function(_lib2.default.param("this", _lib2.default.nullable(Z)), _lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("obj", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))))), _lib2.default.param("thisArg", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.undef()), _lib2.default.nullable(Z))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))];
        }))), _lib2.default.property("fill", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.nullable(T)), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.this(undefined)))))), _lib2.default.property("copyWithin", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("target", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("start", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("end", _lib2.default.nullable(_lib2.default.number()), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.this(undefined)))))));
    }));
    _lib2.default.declare("ObjectConstructor.3204808584", _lib2.default.type("ObjectConstructor", _lib2.default.object(_lib2.default.property("prototype", _lib2.default.nullable(_lib2.default.ref(Object))), _lib2.default.callProperty(_lib2.default.function(_lib2.default.param("value", _lib2.default.any(), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.ref(Object)), _lib2.default.any()))))), _lib2.default.property("getPrototypeOf", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.return(_lib2.default.any())))), _lib2.default.property("getOwnPropertyDescriptor", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.param("p", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.string()), _lib2.default.nullable(_lib2.default.ref(PropertyKey))))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(PropertyDescriptor)))))), _lib2.default.property("getOwnPropertyNames", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.string()))))))), _lib2.default.property("create", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.object()), _lib2.default.null()))), _lib2.default.param("properties", _lib2.default.nullable(_lib2.default.intersection(_lib2.default.nullable(_lib2.default.ref(PropertyDescriptorMap)), _lib2.default.nullable(_lib2.default.ref(ThisType, _lib2.default.any())))), true), _lib2.default.return(_lib2.default.any())))), _lib2.default.property("defineProperty", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.param("p", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.string()), _lib2.default.nullable(_lib2.default.ref(PropertyKey))))), _lib2.default.param("attributes", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.intersection(_lib2.default.nullable(_lib2.default.ref(PropertyDescriptor)), _lib2.default.nullable(_lib2.default.ref(ThisType, _lib2.default.any())))), _lib2.default.nullable(_lib2.default.ref(PropertyDescriptor))))), _lib2.default.return(_lib2.default.any())))), _lib2.default.property("defineProperties", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.param("properties", _lib2.default.nullable(_lib2.default.intersection(_lib2.default.nullable(_lib2.default.ref(PropertyDescriptorMap)), _lib2.default.nullable(_lib2.default.ref(ThisType, _lib2.default.any()))))), _lib2.default.return(_lib2.default.any())))), _lib2.default.property("seal", _lib2.default.nullable(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        return [_lib2.default.param("o", _lib2.default.nullable(T)), _lib2.default.return(_lib2.default.nullable(T))];
    }))), _lib2.default.property("freeze", _lib2.default.nullable(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        return [_lib2.default.param("a", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))), _lib2.default.nullable(T)))), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.ref(ReadonlyArray, _lib2.default.nullable(T))), _lib2.default.nullable(T), _lib2.default.nullable(_lib2.default.ref(Readonly, _lib2.default.nullable(T))))))];
    }))), _lib2.default.property("preventExtensions", _lib2.default.nullable(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        return [_lib2.default.param("o", _lib2.default.nullable(T)), _lib2.default.return(_lib2.default.nullable(T))];
    }))), _lib2.default.property("isSealed", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("isFrozen", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("isExtensible", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("keys", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.object()), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.string()))))))), _lib2.default.property("assign", _lib2.default.nullable(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        const U = fn.typeParameter("U");
        const V = fn.typeParameter("V");
        const W = fn.typeParameter("W");
        return [_lib2.default.param("target", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(T), _lib2.default.nullable(_lib2.default.object())))), _lib2.default.param("source", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(U), _lib2.default.nullable(_lib2.default.array(_lib2.default.any())))), true), _lib2.default.param("source2", _lib2.default.nullable(V), true), _lib2.default.param("source3", _lib2.default.nullable(W), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.intersection(_lib2.default.nullable(T), _lib2.default.nullable(U))), _lib2.default.nullable(_lib2.default.intersection(_lib2.default.nullable(T), _lib2.default.nullable(U), _lib2.default.nullable(V))), _lib2.default.nullable(_lib2.default.intersection(_lib2.default.nullable(T), _lib2.default.nullable(U), _lib2.default.nullable(V), _lib2.default.nullable(W))), _lib2.default.any())))];
    }))), _lib2.default.property("getOwnPropertySymbols", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.symbol()))))))), _lib2.default.property("is", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value1", _lib2.default.any()), _lib2.default.param("value2", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("setPrototypeOf", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("o", _lib2.default.any()), _lib2.default.param("proto", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.object()), _lib2.default.null()))), _lib2.default.return(_lib2.default.any())))))));
    _lib2.default.declare("NodeRequire.1730063951", _lib2.default.type("NodeRequire", _lib2.default.object(_lib2.default.property("cache", _lib2.default.any()), _lib2.default.property("extensions", _lib2.default.any()), _lib2.default.property("main", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.ref(NodeModule)), _lib2.default.nullable(_lib2.default.undef())))), _lib2.default.property("requireActual", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("moduleName", _lib2.default.nullable(_lib2.default.string())), _lib2.default.return(_lib2.default.any())))), _lib2.default.property("requireMock", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("moduleName", _lib2.default.nullable(_lib2.default.string())), _lib2.default.return(_lib2.default.any())))), _lib2.default.property("resolve", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("id", _lib2.default.nullable(_lib2.default.string())), _lib2.default.return(_lib2.default.nullable(_lib2.default.string()))))))));
    _lib2.default.declare("Infinity.3204808584", _lib2.default.var("Infinity", _lib2.default.nullable(_lib2.default.number())));
    _lib2.default.declare("Math.3204808584", _lib2.default.type("Math", Math => _lib2.default.object(_lib2.default.property("E", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("LN10", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("LN2", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("LOG2E", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("LOG10E", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("PI", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("SQRT1_2", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property("SQRT2", _lib2.default.nullable(_lib2.default.number())), _lib2.default.property(Symbol.toStringTag, _lib2.default.nullable(_lib2.default.string("Math"))), _lib2.default.property("abs", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("acos", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("asin", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("atan", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("atan2", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("y", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("ceil", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("cos", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("exp", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("floor", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("log", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("max", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("values", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("min", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("values", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("pow", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("y", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("random", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("round", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("sin", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("sqrt", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("tan", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("clz32", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("imul", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("y", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("sign", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("log10", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("log2", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("log1p", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("expm1", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("cosh", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("sinh", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("tanh", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("acosh", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("asinh", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("atanh", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("hypot", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("values", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("trunc", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("fround", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))), _lib2.default.property("cbrt", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("x", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.number()))))))));
    _lib2.default.declare("ArrayConstructor.3204808584", _lib2.default.type("ArrayConstructor", _lib2.default.object(_lib2.default.property("prototype", _lib2.default.nullable(_lib2.default.array(_lib2.default.any()))), _lib2.default.callProperty(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        return [_lib2.default.param("arrayLength", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.number()), _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.array(_lib2.default.any())), _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))];
    })), _lib2.default.property("isArray", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("arg", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("from", _lib2.default.nullable(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        const U = fn.typeParameter("U");
        const Z = fn.typeParameter("Z");
        return [_lib2.default.param("iterable", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.ref(Iterable, _lib2.default.nullable(T))), _lib2.default.nullable(_lib2.default.ref(ArrayLike, _lib2.default.nullable(T)))))), _lib2.default.param("mapfn", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.function(_lib2.default.param("this", _lib2.default.void()), _lib2.default.param("v", _lib2.default.nullable(T)), _lib2.default.param("k", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(U)))), _lib2.default.nullable(_lib2.default.function(_lib2.default.param("this", _lib2.default.nullable(Z)), _lib2.default.param("v", _lib2.default.nullable(T)), _lib2.default.param("k", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(U)))))), true), _lib2.default.param("thisArg", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.undef()), _lib2.default.nullable(Z))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(U))), _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))))];
    }))), _lib2.default.property("of", _lib2.default.nullable(_lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        return [_lib2.default.param("items", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))), true), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))];
    }))))));
    _lib2.default.declare("Console.814591853", _lib2.default.type("Console", Console => _lib2.default.object(_lib2.default.property("Console", _lib2.default.nullable(_lib2.default.ref(NodeJS.ConsoleConstructor))), _lib2.default.property("assert", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("test", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.boolean()), _lib2.default.any())), true), _lib2.default.param("message", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("clear", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.void())))), _lib2.default.property("count", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("countTitle", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("debug", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("dir", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.union(_lib2.default.nullable(_lib2.default.array(_lib2.default.any())), _lib2.default.nullable(_lib2.default.ref(NodeJS.InspectOptions)))), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("dirxml", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("value", _lib2.default.any()), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("error", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("exception", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("group", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("groupTitle", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("groupCollapsed", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("groupTitle", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("groupEnd", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.void())))), _lib2.default.property("info", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("log", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("msIsIndependentlyComposed", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("element", _lib2.default.nullable(_lib2.default.ref(Element))), _lib2.default.return(_lib2.default.nullable(_lib2.default.boolean()))))), _lib2.default.property("profile", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("reportName", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("profileEnd", _lib2.default.nullable(_lib2.default.function(_lib2.default.return(_lib2.default.void())))), _lib2.default.property("select", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("element", _lib2.default.nullable(_lib2.default.ref(Element))), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("table", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("data", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("time", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("timerName", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("timeEnd", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("timerName", _lib2.default.nullable(_lib2.default.string()), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("trace", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))), _lib2.default.property("warn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("message", _lib2.default.any(), true), _lib2.default.param("optionalParams", _lib2.default.nullable(_lib2.default.array(_lib2.default.any())), true), _lib2.default.return(_lib2.default.void())))))));
});
define('tsr/utils', ['exports', 'ts-runtime/lib', 'lodash/range', 'lodash/rangeRight'], function (exports, _lib, _range, _rangeRight) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Node = undefined;
    exports.fill = fill;
    exports.increaseOfPrevious = increaseOfPrevious;
    exports.moveRight = moveRight;
    exports.range = range;
    exports.reverseRange = reverseRange;
    exports.toSerializableTree = toSerializableTree;
    exports.setHead = setHead;
    exports.swap = swap;

    var _lib2 = _interopRequireDefault(_lib);

    var _range2 = _interopRequireDefault(_range);

    var _rangeRight2 = _interopRequireDefault(_rangeRight);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function fill(array, valueFn) {
        const T = _lib2.default.typeParameter("T");
        let _arrayType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.flowInto(T))));
        let _valueFnType = _lib2.default.nullable(_lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.any())));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))));
        _lib2.default.param("array", _arrayType).assert(array);
        _lib2.default.param("valueFn", _valueFnType).assert(valueFn);
        for (let i = 0; i < array.length; i++) array[i] = valueFn(i);
        return _returnType.assert(array);
    }
    _lib2.default.annotate(fill, _lib2.default.function(fn => {
        const T = fn.typeParameter("T");
        return [_lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.flowInto(T))))), _lib2.default.param("valueFn", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.any())))), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(T))))];
    }));
    function increaseOfPrevious(array, index) {
        let _arrayType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _indexType = _lib2.default.nullable(_lib2.default.number());
        _lib2.default.param("array", _arrayType).assert(array);
        _lib2.default.param("index", _indexType).assert(index);
        array[index] += array[index - 1];
    }
    _lib2.default.annotate(increaseOfPrevious, _lib2.default.function(_lib2.default.param("array", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("index", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.any())));
    function moveRight(input, index) {
        input[index + 1] = input[index];
    }
    _lib2.default.annotate(moveRight, _lib2.default.function(_lib2.default.param("input", _lib2.default.any()), _lib2.default.param("index", _lib2.default.any()), _lib2.default.return(_lib2.default.any())));
    function range(from, to) {
        let _fromType = _lib2.default.nullable(_lib2.default.number());
        let _toType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("from", _fromType).assert(from);
        _lib2.default.param("to", _toType).assert(to);
        return _returnType.assert((0, _range2.default)(from, to + 1));
    }
    _lib2.default.annotate(range, _lib2.default.function(_lib2.default.param("from", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("to", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    function reverseRange(from, to = 0) {
        let _fromType = _lib2.default.nullable(_lib2.default.number());
        let _toType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("from", _fromType).assert(from);
        _lib2.default.param("to", _toType).assert(to);
        return _returnType.assert((0, _rangeRight2.default)(to, from + 1));
    }
    _lib2.default.annotate(reverseRange, _lib2.default.function(_lib2.default.param("from", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("to", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    const Node = exports.Node = _lib2.default.type("Node", Node => _lib2.default.object(_lib2.default.property("left", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.property("right", _lib2.default.nullable(_lib2.default.ref(Node)))));
    function toSerializableTree(root, nodeConverter) {
        let _rootType = _lib2.default.nullable(_lib2.default.ref(Node));
        let _nodeConverterType = _lib2.default.nullable(_lib2.default.function(_lib2.default.param("node", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)));
        _lib2.default.param("root", _rootType).assert(root);
        _lib2.default.param("nodeConverter", _nodeConverterType).assert(nodeConverter);
        if (!root) return _returnType.assert();
        toSerializableTree(root.left, nodeConverter);
        Object.assign(root, nodeConverter(root));
        toSerializableTree(root.right, nodeConverter);
        return _returnType.assert(root);
    }
    _lib2.default.annotate(toSerializableTree, _lib2.default.function(_lib2.default.param("root", _lib2.default.nullable(_lib2.default.ref(Node))), _lib2.default.param("nodeConverter", _lib2.default.nullable(_lib2.default.function(_lib2.default.param("node", _lib2.default.any()), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))))), _lib2.default.return(_lib2.default.nullable(_lib2.default.ref(Node)))));
    function setHead(input, value) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _valueType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("value", _valueType).assert(value);
        input[0] = value;
        return _returnType.assert(input);
    }
    _lib2.default.annotate(setHead, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("value", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
    function swap(input, from, to) {
        let _inputType = _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())));
        let _fromType = _lib2.default.nullable(_lib2.default.number());
        let _toType = _lib2.default.nullable(_lib2.default.number());
        const _returnType = _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))));
        _lib2.default.param("input", _inputType).assert(input);
        _lib2.default.param("from", _fromType).assert(from);
        _lib2.default.param("to", _toType).assert(to);
        const temp = input[from];
        input[from] = input[to];
        input[to] = temp;
        return _returnType.assert(input);
    }
    _lib2.default.annotate(swap, _lib2.default.function(_lib2.default.param("input", _lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number())))), _lib2.default.param("from", _lib2.default.nullable(_lib2.default.number())), _lib2.default.param("to", _lib2.default.nullable(_lib2.default.number())), _lib2.default.return(_lib2.default.nullable(_lib2.default.array(_lib2.default.nullable(_lib2.default.number()))))));
});
