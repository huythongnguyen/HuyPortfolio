---
id: 09-divide-conquer
title: Divide and Conquer
order: 9
icon: Split
difficulty: Intermediate
estimatedTime: 4-5 hours
description: Solve by breaking into independent subproblems
summary: Master divide and conquer through 6 levels. From classic merge sort to quick select, crossing-boundary problems, and matrix multiplication patterns.
keySignals:
  - Independent subproblems
  - Combine solutions
  - Recursive structure
  - Reduce complexity
algorithms:
  - Divide and Conquer
  - Merge Sort
  - Quick Sort
  - Quick Select
levels:
  - name: Merge Sort Pattern
    subtitle: Foundation - Split & Merge
  - name: K-Way Merge
    subtitle: Multiple Sorted Sources
  - name: Crossing Boundary
    subtitle: Max Subarray Pattern
  - name: Quick Select
    subtitle: O(n) Kth Element
gradingDimensions:
  - name: Problem Decomposition
    weight: "30%"
    keyPoints:
      - point: Identify independent subproblems
        explanation: "Split so subproblems don't share state. Merge sort: left half and right half are independent. If subproblems overlap, DP might be better."
      - point: Define the split strategy
        explanation: "Binary split: divide in half (O(log n) depth). K-way split: divide into k parts. Partition: split around pivot. Match split strategy to problem structure."
      - point: Handle base cases correctly
        explanation: "When to stop splitting? Usually size 0 or 1. Return immediately solvable answer. Base cases anchor recursion and prevent infinite loops."
  - name: Merge Strategy
    weight: "30%"
    keyPoints:
      - point: Design efficient combine step
        explanation: "Merge sort: O(n) two-pointer merge. Max subarray: O(n) crossing computation. Combine step often dominates complexity. Optimize carefully."
      - point: Handle crossing/boundary cases
        explanation: "Some answers span the split point. Max subarray must check left, right, AND crossing. Don't miss solutions that bridge subproblems."
      - point: Maintain solution properties
        explanation: "If merging sorted lists, result must be sorted. If finding kth element, maintain correct count. Combine step must preserve problem invariants."
  - name: Complexity Analysis
    weight: "25%"
    keyPoints:
      - point: Apply Master Theorem
        explanation: "T(n) = aT(n/b) + f(n). Merge sort: T(n) = 2T(n/2) + O(n) = O(n log n). Know common patterns: 2T(n/2)+O(n)=O(n log n), 2T(n/2)+O(1)=O(n)."
      - point: Analyze recurrence correctly
        explanation: "Count work at each level of recursion tree. log n levels × O(n) per level = O(n log n). Understand why D&C often achieves logarithmic depth."
      - point: Compare with alternatives
        explanation: "Quick select O(n) average vs sorting O(n log n). Binary search O(log n) vs linear O(n). D&C isn't always best - know when it wins."
  - name: Implementation Quality
    weight: "15%"
    keyPoints:
      - point: Avoid excessive copying
        explanation: "Pass indices instead of creating new arrays. Merge in-place when possible. Copying at each level adds O(n) per level of overhead."
      - point: Handle edge cases
        explanation: "Empty input, single element, duplicate values. Off-by-one errors in split points. Test with small inputs to verify correctness."
      - point: Manage recursion depth
        explanation: "O(log n) depth for balanced splits. Worst case O(n) for unbalanced. Consider iterative version or tail recursion if stack is concern."
questionTitles:
  - Merge k Sorted Lists
  - Sort an Array
  - Sort List
  - Maximum Subarray
  - Kth Largest Element in an Array
  - Find K Closest Elements
  - Search a 2D Matrix II
  - Count of Smaller Numbers After Self
  - Reverse Pairs
  - Count of Range Sum
  - Median of Two Sorted Arrays
  - Closest Pair of Points
  - Pow(x, n)
  - Different Ways to Add Parentheses
  - Beautiful Array
---

# Divide and Conquer: Progressive Mastery Path

## Chapter Overview

Divide and Conquer achieves algorithmic elegance through problem decomposition: split into independent subproblems, solve recursively, then combine. This paradigm powers some of computing's most fundamental algorithms—merge sort, quick select, FFT—achieving logarithmic depth and polynomial efficiency where brute force requires exponential time.

**What You'll Master:**
- Split problems into independent recursive subproblems
- Design efficient merge/combine strategies
- Handle boundary-crossing cases (max subarray pattern)
- Apply partitioning for average O(n) selection
- Analyze complexity using Master Theorem and recurrence trees

**The Divide and Conquer Recipe:**
1. **Divide:** Split problem into smaller independent subproblems
2. **Conquer:** Solve subproblems recursively (base case: size ≤ 1)
3. **Combine:** Merge subproblem solutions into overall solution

**Key Distinction from DP:**
- D&C: Subproblems are **independent** (no shared state)
- DP: Subproblems **overlap** (same calculation repeated)

Divide and Conquer splits problems into independent subproblems, solves them recursively, and combines results. It powers efficient algorithms like merge sort (O(n log n)) and quick select (O(n) average), transforming brute force O(n²) into logarithmic or linear solutions.

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | Merge Sort Pattern | Split → Recurse → Merge | Sort array, count inversions | Sort an Array |
| **2** | K-Way Merge | Merge multiple sorted sources | Merge k sorted lists | Merge k Sorted Lists |
| **3** | Crossing Boundary | Handle cases spanning split | Max subarray, closest pair | Maximum Subarray |
| **4** | Quick Select | Partition around pivot | Kth largest in O(n) average | Kth Largest Element |

### Quick Decision Guide
- **"Sort or count inversions"** → Level 1 (Merge Sort)
- **"Merge k sorted things"** → Level 2 (K-Way with Heap)
- **"Answer may cross midpoint"** → Level 3 (Handle crossing case)
- **"Find kth element quickly"** → Level 4 (Quick Select)

---

<div id="level-1"></div>

## Level 1: Foundation - Merge Sort

> 🎯 **Starting Point**: Divide & Conquer splits problems into smaller subproblems, solves them recursively, and combines results. Merge Sort is the classic example: split, sort halves, merge.

### [Sort an Array](https://leetcode.com/problems/sort-an-array/) (Medium)

**Problem**: Sort an array in ascending order using an efficient algorithm.

```python
nums = [5, 2, 3, 1]
Output: [1, 2, 3, 5]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know recursion

**New Concept**: Divide & Conquer - split problem, solve independently, combine results

**Why It's Foundational**: Introduces the classic D&C pattern: divide, conquer, merge

---

#### Your Natural First Instinct

"Sort array" → Use built-in sort or bubble sort?

**Why Understanding D&C Matters**:
```python
# Bubble sort: O(n²) - too slow for large arrays
# Built-in sort: Black box, don't learn the pattern
# Merge sort: O(n log n) AND teaches divide & conquer!
```

**The Hidden Insight**: Splitting problem in half repeatedly gives O(log n) levels!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Split in Half, Merge Sorted Halves!</h4>
<p><strong>Old thinking</strong>: Sort directly with O(n²) comparisons</p>
<p><strong>New thinking</strong>: Split into halves, sort each, merge in O(n)</p>
<p><strong>Key insight</strong>: Merging two sorted arrays is linear!</p>
</div>

#### The Merge Sort Pattern

**Three Steps**:
1. **Divide**: Split array into two halves
2. **Conquer**: Recursively sort each half
3. **Combine**: Merge two sorted halves

**Why This Works**:
- Base case: Single element is already sorted
- Recursive case: Merge two sorted arrays in O(n) time
- Tree height: log n levels
- Work per level: O(n) merging
- Total: O(n log n)

**Merge Logic**:
```
Two sorted arrays: [1,3,5] and [2,4,6]
Compare first elements, take smaller, advance pointer
[1] → compare 3 vs 2 → [1,2] → compare 3 vs 4 → [1,2,3] ...
Result: [1,2,3,4,5,6]
```

</div>

<div class="code-block-wrapper">

```python
# ❌ Bubble Sort: O(n²)
def bubble_sort(nums):
    n = len(nums)
    for i in range(n):
        for j in range(n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
    return nums

# Time: O(n²) - nested loops
# Space: O(1)
# Problem: Too slow for large arrays
```

```python
# ✅ Merge Sort: O(n log n)
def sort_array(nums):
    if len(nums) <= 1:
        return nums

    # Divide
    mid = len(nums) // 2
    left = sort_array(nums[:mid])
    right = sort_array(nums[mid:])

    # Conquer & Combine
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays"""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Append remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Time: O(n log n) - log n levels, O(n) work per level
# Space: O(n) - temporary arrays for merging
# Key: Divide, conquer recursively, merge efficiently
```

**Example Walkthrough**:
```python
nums = [5, 2, 3, 1]

Level 0: [5, 2, 3, 1]
         /            \
Level 1: [5, 2]      [3, 1]
         /    \      /    \
Level 2: [5]  [2]  [3]  [1]  ← Base cases

Merge Level 2 → 1:
  merge([5], [2]) = [2, 5]
  merge([3], [1]) = [1, 3]

Merge Level 1 → 0:
  merge([2,5], [1,3]) = [1, 2, 3, 5]

Result: [1, 2, 3, 5]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Sort correctly, handle edge cases (empty, single element)
- ✅ Approach: Recognize divide & conquer pattern
- ✅ Edge Cases: Duplicates, negative numbers, sorted array

**Code Quality (25%)**:
- ✅ Readability: Clear divide/merge separation
- ✅ Efficiency: Clean merge logic

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n log n) time, O(n) space
- ✅ Understanding: Log n levels, O(n) work per level

**Communication (20%)**:
- ✅ Thought Process: "Split in half, sort recursively, merge sorted halves"
- ✅ Explanation: "Merging two sorted arrays is linear, tree has log n levels"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Merge K Sorted Lists

> 🔄 **When There Are More Than Two Parts**: Merge sort splits into 2 parts. But what about k sorted lists? Keep splitting in half, or use a heap to always pick the smallest head—both are D&C thinking!

### [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) (Hard)

**Problem**: Merge k sorted linked lists into one sorted list.

```python
lists = [
  1→4→5,
  1→3→4,
  2→6
]
Output: 1→1→2→3→4→4→5→6
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: Divide & conquer with binary split

**New Dimension**: Apply D&C to multiple inputs (not just split one array)

**Progressive Insight**: Merge lists pairwise using same D&C pattern

---

#### Your Next Natural Thought

"Merge k lists" → Merge them sequentially one by one!

**Why This Is Suboptimal**:
```python
# Sequential merging:
# Merge list 0 and 1 → result has ~2N nodes
# Merge result and list 2 → result has ~3N nodes
# Merge result and list 3 → result has ~4N nodes
# ...
# Each merge gets progressively larger!
# Total: O(kN) where k = num lists, N = total nodes
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Merge Pairwise Like Merge Sort!</h4>
<p><strong>Old pattern</strong>: Sequential merging O(kN)</p>
<p><strong>New pattern</strong>: Pairwise merging O(N log k) - treat lists like array elements!</p>
<p><strong>Key insight</strong>: Same D&C tree structure, different input type!</p>
</div>

#### The K-Way Merge Pattern

**Apply Merge Sort Logic**:
- Instead of splitting one array
- Pair up k lists
- Merge pairs recursively

**Complexity**:
- Log k levels (repeatedly divide k by 2)
- O(N) work per level (merge all nodes)
- Total: O(N log k) where N = total nodes

**vs Sequential**:
```
Sequential: k-1 merges, increasing size → O(kN)
Pairwise: log k levels, constant total size → O(N log k)
```

</div>

<div class="code-block-wrapper">

```python
# ❌ Sequential Merging: O(kN)
def merge_k_lists_sequential(lists):
    if not lists:
        return None

    result = lists[0]
    for i in range(1, len(lists)):
        result = merge_two_lists(result, lists[i])

    return result

# Time: O(kN) - k lists, each merge grows result
# Problem: Each merge processes more nodes than necessary
```

```python
# ✅ Divide & Conquer: O(N log k)
def merge_k_lists(lists):
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]

    return merge_range(lists, 0, len(lists) - 1)

def merge_range(lists, start, end):
    # Base case: single list
    if start == end:
        return lists[start]

    # Divide
    mid = (start + end) // 2
    left = merge_range(lists, start, mid)
    right = merge_range(lists, mid + 1, end)

    # Conquer: merge two lists
    return merge_two_lists(left, right)

def merge_two_lists(l1, l2):
    """Merge two sorted linked lists"""
    dummy = ListNode(0)
    curr = dummy

    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next

    curr.next = l1 if l1 else l2
    return dummy.next

# Time: O(N log k) - log k levels, O(N) per level
# Space: O(log k) - recursion stack
# Key: Pairwise merging like merge sort
```

**Example Walkthrough**:
```python
lists = [1→4, 1→3, 2→6, 5]
        k = 4 lists

Level 0 (k=4):
  Merge pairs: (list0, list1) and (list2, list3)

Level 1 (k=2):
  merge(1→4, 1→3) = 1→1→3→4
  merge(2→6, 5) = 2→5→6

Level 2 (k=1):
  merge(1→1→3→4, 2→5→6) = 1→1→2→3→4→5→6

Total levels: log₂(4) = 2
Work per level: All N nodes processed once
Result: O(N log k)
```

**Why This Is Faster**:
```
Sequential:
  Round 1: merge(list0, list1) - 2N/k nodes
  Round 2: merge(result, list2) - 3N/k nodes
  ...
  Total: N(1 + 2 + 3 + ... + k)/k = O(kN)

Pairwise (D&C):
  Each level: All N nodes merged exactly once
  Levels: log k
  Total: O(N log k)

For k=1000, N=1,000,000:
  Sequential: ~1 billion operations
  D&C: ~10 million operations (100x faster!)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use divide & conquer to merge lists pairwise"
- ✅ Correctness: Handle empty lists, single list, null nodes
- ⭐ **Key Skill**: Applying D&C to multiple inputs

**Communication (20%)**:
- ✅ Thought Process: "Sequential merging is O(kN), pairwise is O(N log k)"
- ✅ Explanation: "Same merge sort pattern applied to k lists"
- ⭐ **Key Skill**: Explaining complexity improvement

**Time/Space (20%)**:
- ✅ Big-O: "O(N log k) from log k levels of O(N) merging"
- ⭐ **Key Skill**: Understanding k vs N in complexity

**Code Quality (25%)**:
- ✅ Implementation: Clean recursion, correct merge logic
- ✅ Efficiency: Pairwise merging

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Maximum Subarray with D&C

> 🔄 **When the Answer Crosses the Split Point**: Merge k lists combines independent results. But max subarray might *span* the split! Handle three cases: left half, right half, or crossing the middle.

### [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) (Medium)

**Problem**: Find contiguous subarray with largest sum.

```python
nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6  # [4,-1,2,1]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: Divide, conquer, combine results

**New Complexity**: Max can cross the divide point! Need to check:
1. Max in left half
2. Max in right half
3. **Max crossing midpoint** ← New!

**Progressive Challenge**: Three-way comparison instead of simple merge

---

#### The Pattern Shift

**Level 1**: Split, sort halves, merge
**Level 2**: Pair up inputs, merge recursively
**Level 3**: Split, recurse, but also check **crossing** case

**Key Difference**: Answer might span both halves!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Don't Forget the Crossing Case!</h4>
<p><strong>Old pattern</strong>: Combine left and right results directly</p>
<p><strong>New pattern</strong>: Check THREE cases - left max, right max, AND crossing max!</p>
<p><strong>Key insight</strong>: Optimal subarray might cross the midpoint!</p>
</div>

#### The Crossing Subarray Pattern

**Three Cases for Max Subarray**:
1. **Entirely in left half**: Recurse left
2. **Entirely in right half**: Recurse right
3. **Crosses midpoint**: Extend from mid left + extend from mid right

**Finding Crossing Max**:
```
From mid, extend left: find max sum ending at mid
From mid+1, extend right: find max sum starting at mid+1
Crossing max = left_sum + right_sum
```

**Why This Works**: Any subarray crossing mid includes mid and mid+1

**Note**: Kadane's algorithm solves this in O(n), but D&C demonstrates the pattern!

</div>

<div class="code-block-wrapper">

```python
# ❌ Forgetting Crossing Case
def max_subarray_wrong(nums):
    if len(nums) == 1:
        return nums[0]

    mid = len(nums) // 2
    left_max = max_subarray_wrong(nums[:mid])
    right_max = max_subarray_wrong(nums[mid:])

    return max(left_max, right_max)  # Missing crossing case!

# Problem: Misses subarrays that cross midpoint
# Example: [-2, 1, -3, 4] with mid=2
# Left max=1, right max=4, but [-2,1,-3,4]=0 crosses
```

```python
# ✅ D&C with Crossing Check: O(n log n)
def max_subarray_dc(nums):
    def helper(left, right):
        if left == right:
            return nums[left]

        mid = (left + right) // 2

        # Case 1: Max in left half
        left_max = helper(left, mid)

        # Case 2: Max in right half
        right_max = helper(mid + 1, right)

        # Case 3: Max crossing midpoint
        # Extend left from mid
        left_sum = float('-inf')
        total = 0
        for i in range(mid, left - 1, -1):
            total += nums[i]
            left_sum = max(left_sum, total)

        # Extend right from mid+1
        right_sum = float('-inf')
        total = 0
        for i in range(mid + 1, right + 1):
            total += nums[i]
            right_sum = max(right_sum, total)

        cross_max = left_sum + right_sum

        # Return max of three cases
        return max(left_max, right_max, cross_max)

    return helper(0, len(nums) - 1)

# Time: O(n log n) - log n levels, O(n) per level for crossing
# Space: O(log n) - recursion stack
# Key: Three-way comparison includes crossing case
```

**Comparison with Kadane's**:
```python
# ✅ Kadane's Algorithm: O(n) - more efficient!
def max_subarray_kadane(nums):
    max_sum = current_sum = nums[0]

    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)

    return max_sum

# Time: O(n) - single pass
# Space: O(1)
# Note: D&C shows pattern, Kadane's is optimal for this problem
```

**Example Walkthrough**:
```python
nums = [-2, 1, -3, 4, -1, 2]
               mid=2

Left half: [-2, 1, -3]
  Left max = 1

Right half: [4, -1, 2]
  Right max = 5 (4-1+2)

Crossing mid (index 2):
  Extend left from -3: max(-3, -3+1, -3+1-2) = -2
  Extend right from 4: max(4, 4-1, 4-1+2) = 5
  Cross max = -2 + 5 = 3

Result: max(1, 5, 3) = 5... wait, but optimal is 6!
(This recursively continues, full recursion finds 6)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use D&C with three-way comparison including crossing case"
- ✅ Correctness: Handle all negative numbers, single element
- ⭐ **Key Skill**: Remembering crossing case

**Communication (20%)**:
- ✅ Thought Process: "Max subarray could be in left, right, or cross midpoint"
- ✅ Explanation: "Extend from mid in both directions for crossing max"
- ⭐ **Key Skill**: Explaining why crossing case is necessary

**Time/Space (20%)**:
- ✅ Big-O: "O(n log n) vs O(n) Kadane's - D&C not optimal here but shows pattern"
- ⭐ **Key Skill**: Understanding when D&C isn't best choice

**Code Quality (25%)**:
- ✅ Implementation: Correct crossing sum calculation
- ✅ Efficiency: Clean three-way max comparison

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Quick Select (Partition-Based D&C)

> 🔄 **When You Don't Need Full Sorting**: Merge sort processes both halves. But finding kth element only needs ONE half! Quick Select partitions around a pivot—if pivot is at position k, done. Otherwise recurse on the correct half.

### [Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/) (Medium)

**Problem**: Find the kth largest element in unsorted array.

```python
nums = [3,2,1,5,6,4], k = 2
Output: 5  # 2nd largest
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Divide & conquer recursively

**New Complexity**: **Partition-based** D&C (Quick Select pattern)
- Don't recurse on both sides
- Only recurse on side containing answer!

**Progressive Challenge**: Choose partition, prune one side, O(n) average!

---

#### The Complexity Ladder

**Level 1**: Split evenly, process both sides (merge sort)
**Level 2**: Pair up, process recursively (k-way merge)
**Level 3**: Split evenly, check crossing (max subarray)
**Level 4**: Partition around pivot, process one side only (quick select)

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: Partition, Then Recurse on ONE Side Only!</h4>
<p><strong>Old pattern</strong>: Recurseon both sides, combine results</p>
<p><strong>New pattern</strong>: Partition around pivot, recurse only on relevant side</p>
<p><strong>Key insight</strong>: Pruning one side reduces average to O(n)!</p>
</div>

#### The Quick Select Pattern

**Algorithm** (find kth largest):
1. **Partition** array around pivot
2. **Compare** pivot position with k
3. **Recurse**:
   - If pivot is kth largest → done!
   - If pivot rank > k → recurse left
   - If pivot rank < k → recurse right

**Partition**: Rearrange so elements < pivot are left, >= pivot are right

**Complexity**:
- Best/Average: O(n) - prune half each time
- Worst: O(n²) - if pivot always worst choice
- Expected: O(n + n/2 + n/4 + ...) = O(2n) = O(n)

</div>

<div class="code-block-wrapper">

```python
# ❌ Full Sort: O(n log n)
def find_kth_largest_sort(nums, k):
    nums.sort(reverse=True)
    return nums[k - 1]

# Time: O(n log n) - full sort overkill
# Problem: Sort entire array when we only need kth element
```

```python
# ✅ Quick Select: O(n) average
def find_kth_largest(nums, k):
    k = len(nums) - k  # Convert to kth smallest (0-indexed)

    def quick_select(left, right):
        # Partition around last element
        pivot = nums[right]
        i = left

        for j in range(left, right):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1

        nums[i], nums[right] = nums[right], nums[i]
        # Now nums[i] is in correct position

        # Compare with k
        if i == k:
            return nums[i]
        elif i < k:
            return quick_select(i + 1, right)  # Recurse right
        else:
            return quick_select(left, i - 1)  # Recurse left

    return quick_select(0, len(nums) - 1)

# Time: O(n) average - each partition prunes ~half
# Space: O(log n) average - recursion stack
# Key: Partition and recurse on ONE side only
```

**Example Walkthrough**:
```python
nums = [3,2,1,5,6,4], k=2 → find 2nd largest = 5
k_index = 6-2 = 4 (4th smallest, 0-indexed)

Partition around pivot=4:
  [3,2,1,4,6,5]
  pivot at index 3

  Compare: 3 < 4 → recurse right [6,5]

Partition around pivot=5:
  [5,6] in original, but after partition: [5,6]
  pivot at index 4

  Compare: 4 == 4 → Found it!
  Return nums[4] = 5
```

**Why O(n) Average**:
```
Good pivot (median-ish):
  Level 0: n operations (partition whole array)
  Level 1: n/2 operations (partition half)
  Level 2: n/4 operations
  ...
  Total: n + n/2 + n/4 + ... ≈ 2n = O(n)

Bad pivot (always min/max):
  Level 0: n operations
  Level 1: n-1 operations
  Level 2: n-2 operations
  ...
  Total: n + (n-1) + (n-2) + ... = O(n²)

Random pivot → average case O(n)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use quick select to partition and recurse on one side"
- ✅ Correctness: Handle edge cases, convert k correctly
- ⭐ **Key Skill**: Understanding partition-based D&C

**Communication (20%)**:
- ✅ Thought Process: "After partition, only one side contains kth element"
- ✅ Explanation: "Pruning one side gives O(n) average instead of O(n log n)"
- ⭐ **Key Skill**: Explaining expected O(n) complexity

**Time/Space (20%)**:
- ✅ Big-O: "O(n) average, O(n²) worst case"
- ✅ Optimization: "Better than O(n log n) sort for finding kth element"
- ⭐ **Key Skill**: Understanding average vs worst case

**Code Quality (25%)**:
- ✅ Implementation: Correct partition logic
- ✅ Efficiency: In-place partitioning

</div>
</div>

---

<div id="grading-success"></div>

## Grading Success Across Levels

**What Matters Most**: Interviewers grade D&C on your ability to **identify subproblems**, **explain the combine step** clearly, and **analyze recurrence relations** (Master Theorem, recursion trees) for time complexity.

**Common Pitfalls to Avoid**:
- ❌ Forgetting to combine results from subproblems
- ❌ Missing crossing cases (max subarray, closest pair)
- ❌ Not recognizing when to prune one branch (quick select vs merge sort)
- ❌ Confusing O(n log n) with O(n) - partition-based is faster!

**Interview Success Formula**:
1. **State the divide** → "I'll split into [two halves / k groups / pivot partition]"
2. **Explain conquer** → "Recursively solve each subproblem..."
3. **Describe combine** → "Merge results by [merging sorted / checking crossing case]"
4. **Analyze complexity** → "T(n) = 2T(n/2) + O(n) → O(n log n) by Master Theorem"

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Sort an Array](https://leetcode.com/problems/sort-an-array/)** → Merge sort basics
2. **[Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)** → Modified binary search
3. **[Pow(x, n)](https://leetcode.com/problems/powx-n/)** → Fast exponentiation

### 🟡 Medium - Core Patterns
4. **[Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)** → K-way merge
5. **[Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)** → Crossing case pattern
6. **[Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/)** → Quick select
7. **[Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/)** → Expression D&C
8. **[Sort List](https://leetcode.com/problems/sort-list/)** → Merge sort on linked list
9. **[Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)** → Merge sort with counting

### 🔴 Hard - Advanced Mastery
10. **[Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)** → Binary search D&C
11. **[Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)** → Modified merge sort
12. **[Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)** → Merge sort with range counting

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Sort an Array (Merge Sort) | Basic recursion | Divide-conquer-merge pattern | Understanding O(n log n) |
| **2** | Merge k Sorted Lists | Level 1 | Apply D&C to multiple inputs | Pairwise vs sequential |
| **3** | Maximum Subarray | Level 2 | Handle crossing cases | Three-way comparison |
| **4** | Kth Largest (Quick Select) | Level 3 | Partition-based D&C | Prune one side for O(n) |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
