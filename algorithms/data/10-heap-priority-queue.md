---
id: 10-heap-priority-queue
title: Heap / Priority Queue
order: 10
icon: ListOrdered
difficulty: Intermediate
estimatedTime: 4-5 hours
description: Repeatedly access min/max element
summary: Master heap data structures through 7 levels. From basic top-k problems to streaming median, k-way merge, scheduling algorithms, and advanced heap techniques.
keySignals:
  - Top K elements
  - Median
  - Priority access
  - Kth largest/smallest
  - Streaming data
  - Scheduling
algorithms:
  - Heap (Priority Queue)
  - Min Heap
  - Max Heap
levels:
  - name: Top K Elements
    subtitle: Foundation - Fixed Size Heap
  - name: K-Way Merge
    subtitle: Multiple Sorted Sources
  - name: Two Heaps (Median)
    subtitle: Complementary Heaps
  - name: Heap + Greedy
    subtitle: Scheduling & Optimization
gradingDimensions:
  - name: Heap Selection
    weight: "30%"
    keyPoints:
      - point: Choose min-heap vs max-heap
        explanation: "For kth largest: use min-heap of size k (smallest of the k largest is kth). For kth smallest: use max-heap of size k. Counter-intuitive but efficient."
      - point: Understand heap operations
        explanation: "Insert: O(log n). Pop min/max: O(log n). Peek: O(1). Build from array: O(n). Know when each applies and why heapify is linear."
      - point: Use heap for partial ordering
        explanation: "When you only need min/max, not full sort. Heap gives O(log n) access vs O(n log n) for sort. Perfect for streaming/dynamic data."
  - name: K-Way Merge Pattern
    weight: "25%"
    keyPoints:
      - point: Keep one element per source
        explanation: "For merging k sorted lists, heap holds k elements (one from each list). Always pop minimum, then push next from same source."
      - point: Track element origin
        explanation: "Store (value, list_index, element_index) tuples. After popping, know which list to pull from next. Essential for k-way merge correctness."
      - point: Analyze complexity correctly
        explanation: "Merging n total elements from k lists: O(n log k). Each element enters and leaves heap once. Compare to pairwise merging O(n log n)."
  - name: Two Heaps Pattern
    weight: "25%"
    keyPoints:
      - point: Balance two complementary heaps
        explanation: "Max-heap for smaller half, min-heap for larger half. Median is at top of one or both heaps. Keep sizes within 1 of each other."
      - point: Rebalance after insertion
        explanation: "Insert into appropriate heap based on value. If sizes differ by more than 1, move top element to other heap. Maintains balance."
      - point: Handle even vs odd count
        explanation: "Odd count: median from larger heap. Even count: average of two tops. Track count or check sizes to determine case."
  - name: Problem Recognition
    weight: "20%"
    keyPoints:
      - point: Identify heap signals
        explanation: "\"kth largest\", \"top k\", \"median\", \"merge sorted\", \"schedule by priority\". These keywords suggest heap solution. Also streaming/online scenarios."
      - point: Compare with alternatives
        explanation: "Quick select O(n) for one-time kth element vs heap O(n log k) for dynamic. Sorting O(n log n) for full order vs heap O(n log k) for top k."
      - point: Combine heap with other patterns
        explanation: "Heap + greedy for scheduling. Heap + BFS for Dijkstra. Heap + sliding window for streaming median. Heap augments other algorithms."
questionTitles:
  - Merge k Sorted Lists
  - Kth Largest Element in an Array
  - Top K Frequent Elements
  - Top K Frequent Words
  - Find K Pairs with Smallest Sums
  - Find Median from Data Stream
  - Sliding Window Median
  - Sliding Window Maximum
  - Task Scheduler
  - Reorganize String
  - K Closest Points to Origin
  - Ugly Number II
  - Super Ugly Number
  - Find K Closest Elements
  - Smallest Range Covering Elements from K Lists
  - IPO
  - Trapping Rain Water II
  - Meeting Rooms II
  - Employee Free Time
  - The Skyline Problem
---

# Heap / Priority Queue: Progressive Mastery Path

Heaps give O(log n) insertion/deletion while maintaining min/max order - perfect for "top k", "k-way merge", and "running median" problems. Unlike sorting (O(n log n)), heaps optimize for partial ordering, saving time when you don't need everything sorted.

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | Top K Elements | Fixed-size heap of K | Kth largest, top K frequent | Kth Largest Element |
| **2** | K-Way Merge | Heap of K source heads | Merge k sorted lists/arrays | Merge k Sorted Lists |
| **3** | Two Heaps (Median) | Max-heap + Min-heap | Running median, balanced split | Find Median from Stream |
| **4** | Heap + Greedy | Priority-based scheduling | Task scheduling, resource allocation | Task Scheduler |

### Quick Decision Guide
- **"Find kth largest/smallest"** → Level 1 (Size-K Heap)
- **"Merge multiple sorted sources"** → Level 2 (Heap of Heads)
- **"Running median or balanced"** → Level 3 (Two Heaps)
- **"Schedule by priority"** → Level 4 (Greedy + Heap)

---

<div id="level-1"></div>

## Level 1: Foundation - Top K Elements

> 🎯 **Starting Point**: Sorting gives O(n log n). But for "top k" problems, a heap of size k gives O(n log k)—smaller k means faster! Use min-heap for k largest, max-heap for k smallest.

### [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) (Medium)

**Problem**: Find the kth largest element in an unsorted array.

```python
nums = [3,2,1,5,6,4], k = 2
Output: 5  # 2nd largest element
# Sorted: [6,5,4,3,2,1], k=2 → 5
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know sorting

**New Concept**: Heap maintains top k elements efficiently

**Why It's Foundational**: Introduces heap as alternative to full sort

---

#### Your Natural First Instinct

"Find kth largest" → Sort the entire array!

**Why This Is Overkill**:
```python
# Sorting: O(n log n) to sort entire array
# But we only need kth largest, not full sorted order!
# For k << n (e.g., k=3, n=1,000,000), wasteful
```

**The Hidden Cost**: O(n log n) when we can do O(n log k)!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Min-Heap of Size K Tracks Top K!</h4>
<p><strong>Old thinking</strong>: Sort all n elements (O(n log n))</p>
<p><strong>New thinking</strong>: Maintain heap of size k, only k elements (O(n log k))</p>
<p><strong>Key insight</strong>: Smallest of top k = kth largest!</p>
</div>

#### The Top K Pattern

**Algorithm** (find kth largest):
1. **Maintain** min-heap of size k
2. For each element:
   - Add to heap
   - If heap size > k → remove min (keep only top k)
3. **Result**: heap.min() = kth largest

**Why Min-Heap for Top K**:
```
For top 3: [5, 3, 7, 1, 9, 2]
Min-heap of size 3 always contains: 3 largest
Top of heap (min of these 3) = 3rd largest!

Heap after each insert:
[5] → [3,5] → [3,5,7] → [3,5,7] (1 rejected)
→ [5,7,9] (3 removed) → [5,7,9] (2 rejected)
Result: min([5,7,9]) = 5 = 3rd largest ✓
```

**Complexity**:
- n insertions: O(n log k) (not O(n log n)!)
- Space: O(k) (not O(n)!)

</div>

<div class="code-block-wrapper">

```python
# ❌ Full Sort: O(n log n)
def find_kth_largest_sort(nums, k):
    nums.sort(reverse=True)
    return nums[k - 1]

# Time: O(n log n) - sort entire array
# Space: O(1) excluding sort space
# Problem: Overkill for finding single element
```

```python
# ✅ Min-Heap of Size K: O(n log k)
import heapq

def find_kth_largest(nums, k):
    heap = []

    for num in nums:
        heapq.heappush(heap, num)

        # Keep only k largest
        if len(heap) > k:
            heapq.heappop(heap)  # Remove smallest

    # Min of top k = kth largest
    return heap[0]

# Time: O(n log k) - n insertions, each O(log k)
# Space: O(k) - heap size
# Key: Only maintain k elements, not full array
```

**Alternative: nlargest (built-in)**:
```python
# ✅ Using Python's heapq.nlargest
def find_kth_largest_builtin(nums, k):
    return heapq.nlargest(k, nums)[-1]

# Time: O(n log k) internally
# Space: O(k)
```

**Example Walkthrough**:
```python
nums = [3,2,1,5,6,4], k = 2

Step-by-step heap (min-heap):
Add 3: [3]
Add 2: [2, 3]
Add 1: [1, 2, 3], size > 2 → remove 1 → [2, 3]
Add 5: [2, 3, 5], size > 2 → remove 2 → [3, 5]
Add 6: [3, 5, 6], size > 2 → remove 3 → [5, 6]
Add 4: [4, 5, 6], size > 2 → remove 4 → [5, 6]

Final heap: [5, 6]
Min of heap = 5 = 2nd largest ✓
```

**For K Smallest**: Use max-heap (negate values)
```python
def find_kth_smallest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, -num)  # Negate for max-heap
        if len(heap) > k:
            heapq.heappop(heap)
    return -heap[0]  # Negate back
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle edge cases (k=1, k=n, duplicates)
- ✅ Approach: Recognize heap optimization over sort
- ✅ Edge Cases: All same values, k out of bounds

**Code Quality (25%)**:
- ✅ Readability: Clear heap operations
- ✅ Efficiency: Size-limited heap

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n log k) vs O(n log n) sort
- ✅ Space: O(k) vs O(n) for full sort

**Communication (20%)**:
- ✅ Thought Process: "Only need top k, not full sort"
- ✅ Explanation: "Min-heap of size k keeps smallest of top k elements"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Merge K Sorted Lists with Heap

> 🔄 **When You Need the Next Smallest From Multiple Sources**: Top K tracks k largest from one stream. K-way merge picks the smallest from k *different* sorted lists—heap of k "heads" always gives you the minimum.

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

**What You Already Know**: Heap for maintaining min/max

**New Dimension**: Use heap to track **heads of k lists** (not just values)

**Progressive Insight**: Heap gives us min of k values in O(log k)

---

#### Your Next Natural Thought

"Merge k lists" → Compare all k first elements each time!

**Why This Is Inefficient**:
```python
# At each step:
# - Find min of k list heads → O(k)
# - Repeat N times (total nodes)
# Total: O(kN) - linear search among k values
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Heap Tracks Min of K Heads in O(log k)!</h4>
<p><strong>Old pattern</strong>: Linear search among k heads O(k)</p>
<p><strong>New pattern</strong>: Heap gives min of k heads in O(log k)</p>
<p><strong>Key insight</strong>: N operations × O(log k) = O(N log k) vs O(kN)!</p>
</div>

#### The K-Way Merge Pattern

**Algorithm**:
1. **Initialize** heap with first node from each list
2. **While** heap not empty:
   - Pop min node
   - Add to result
   - If popped node has next → push next to heap
3. **Result**: Merged sorted list

**Why Heap**:
- Always gives smallest among k list heads
- O(log k) per operation vs O(k) linear scan
- Total: O(N log k) where N = total nodes

**Heap Contents**: (node.val, list_index, node) tuples

</div>

<div class="code-block-wrapper">

```python
# ❌ Linear Scan: O(kN)
def merge_k_lists_scan(lists):
    dummy = ListNode(0)
    curr = dummy

    while True:
        min_val = float('inf')
        min_idx = -1

        # O(k) scan to find minimum
        for i in range(len(lists)):
            if lists[i] and lists[i].val < min_val:
                min_val = lists[i].val
                min_idx = i

        if min_idx == -1:  # All lists exhausted
            break

        curr.next = lists[min_idx]
        lists[min_idx] = lists[min_idx].next
        curr = curr.next

    return dummy.next

# Time: O(kN) - O(k) scan × N nodes
# Problem: Linear search for min among k heads
```

```python
# ✅ Heap-Based: O(N log k)
import heapq

def merge_k_lists(lists):
    heap = []
    dummy = ListNode(0)
    curr = dummy

    # Initialize heap with first node from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))

    # Merge using heap
    while heap:
        val, i, node = heapq.heappop(heap)

        curr.next = node
        curr = curr.next

        # Add next node from same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next

# Time: O(N log k) - N nodes, O(log k) per operation
# Space: O(k) - heap size
# Key: Heap maintains min of k heads efficiently
```

**Example Walkthrough**:
```python
lists = [1→4→5, 1→3→4, 2→6]

Initial heap: [(1,0,node), (1,1,node), (2,2,node)]

Pop (1,0): result=[1], push (4,0), heap=[(1,1), (2,2), (4,0)]
Pop (1,1): result=[1,1], push (3,1), heap=[(2,2), (3,1), (4,0)]
Pop (2,2): result=[1,1,2], push (6,2), heap=[(3,1), (4,0), (6,2)]
Pop (3,1): result=[1,1,2,3], push (4,1), heap=[(4,0), (4,1), (6,2)]
Pop (4,0): result=[1,1,2,3,4], push (5,0), heap=[(4,1), (5,0), (6,2)]
Pop (4,1): result=[1,1,2,3,4,4], heap=[(5,0), (6,2)]
Pop (5,0): result=[1,1,2,3,4,4,5], heap=[(6,2)]
Pop (6,2): result=[1,1,2,3,4,4,5,6], heap=[]

Final: 1→1→2→3→4→4→5→6
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use heap to efficiently find min among k heads"
- ✅ Correctness: Handle empty lists, single list, null nodes
- ⭐ **Key Skill**: Recognizing k-way merge pattern

**Communication (20%)**:
- ✅ Thought Process: "Heap reduces finding min from O(k) to O(log k)"
- ✅ Explanation: "Each operation is O(log k), total O(N log k)"
- ⭐ **Key Skill**: Explaining complexity improvement

**Time/Space (20%)**:
- ✅ Big-O: "O(N log k) vs O(kN) or O(N log N) full sort"
- ⭐ **Key Skill**: Understanding k vs N in complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct heap initialization and updates
- ✅ Efficiency: Heap-based merging

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Running Median with Two Heaps

> 🔄 **When One Heap Isn't Enough**: K-way merge uses one heap. But median needs *both* halves—smaller half in max-heap, larger half in min-heap. Tops of both heaps give you the middle!

### [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) (Hard)

**Problem**: Design data structure to find median from stream of integers.

```python
MedianFinder mf = MedianFinder()
mf.addNum(1)    # [1]
mf.addNum(2)    # [1,2]
mf.findMedian() # 1.5
mf.addNum(3)    # [1,2,3]
mf.findMedian() # 2.0
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: Single heap for min/max

**New Complexity**: Need **two heaps** working together!
- Max-heap: Lower half of numbers
- Min-heap: Upper half of numbers

**Progressive Challenge**: Balance two heaps to find median in O(1)

---

#### The Pattern Shift

**Level 1**: One heap (top k)
**Level 2**: One heap (k-way merge)
**Level 3**: **Two heaps** (split data, balance sizes)

**Key Difference**: Heaps complement each other!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Split Data into Two Halves with Heaps!</h4>
<p><strong>Old thinking</strong>: Keep sorted array, insert in O(n)</p>
<p><strong>New thinking</strong>: Max-heap (lower half) + min-heap (upper half), O(log n) insert!</p>
<p><strong>Key insight</strong>: Median is at boundary between heaps!</p>
</div>

#### The Two-Heap Pattern

**Invariants**:
1. **Max-heap** stores smaller half (largest on top)
2. **Min-heap** stores larger half (smallest on top)
3. **Size**: len(max_heap) = len(min_heap) OR len(max_heap) = len(min_heap) + 1

**Finding Median**:
```
If sizes equal: median = (max_heap.top + min_heap.top) / 2
If max_heap larger: median = max_heap.top
```

**Adding Number**:
1. Add to max_heap (smaller half)
2. Balance: move max_heap.top to min_heap
3. Size balance: if min_heap larger, move back

**Why This Works**: Heaps maintain sorted split, median at boundary!

</div>

<div class="code-block-wrapper">

```python
# ❌ Sorted Array: O(n) insert
class MedianFinder_Sorted:
    def __init__(self):
        self.nums = []

    def addNum(self, num):
        # Binary search insert: O(n) due to shifting
        bisect.insort(self.nums, num)  # O(n)

    def findMedian(self):
        n = len(self.nums)
        if n % 2 == 0:
            return (self.nums[n//2-1] + self.nums[n//2]) / 2
        return self.nums[n//2]

# Time: O(n) per add, O(1) median
# Problem: Insertion is slow for large streams
```

```python
# ✅ Two Heaps: O(log n) insert
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # Max-heap (negate values)
        self.large = []  # Min-heap

    def addNum(self, num):
        # Add to max-heap (small half)
        heapq.heappush(self.small, -num)

        # Balance: largest of small ≤ smallest of large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)

        # Size balance: sizes differ by at most 1
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0

# Time: O(log n) per add, O(1) median
# Space: O(n) - store all numbers
# Key: Two heaps maintain split, median at boundary
```

**Example Walkthrough**:
```python
addNum(1): small=[-1], large=[]
  Median: -small[0] = 1

addNum(2): small=[-2,-1], large=[]
  Balance value: 2 > 1 → move 2 to large
  small=[-1], large=[2]
  Median: (-(-1) + 2) / 2 = 1.5

addNum(3): small=[-3,-1], large=[2]
  Balance value: 3 > 2 → move 3 to large
  small=[-1], large=[2,3]
  Size imbalance: move 2 back
  small=[-2,-1], large=[3]
  Median: -small[0] = 2.0
```

**Visualization**:
```
Stream: 5, 15, 1, 3, 8, 7

After each number:
5:  small=[5]              large=[]           median=5
15: small=[5]              large=[15]         median=10
1:  small=[5,1]            large=[15]         median=5
3:  small=[5,3,1]          large=[15]         median=4
8:  small=[5,3,1]          large=[8,15]       median=6.5
7:  small=[5,3,1]          large=[7,8,15]     median=6
    (adjust: move 7 to small, move 5 to large)
    small=[7,3,1]          large=[5,8,15]

Small half (max-heap): always ≤ median
Large half (min-heap): always ≥ median
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use two heaps to split data and maintain median"
- ✅ Correctness: Handle odd/even counts, balance heaps correctly
- ⭐ **Key Skill**: Understanding two-heap collaboration

**Communication (20%)**:
- ✅ Thought Process: "Max-heap for lower half, min-heap for upper half"
- ✅ Explanation: "Median is at boundary - O(1) access after O(log n) insert"
- ⭐ **Key Skill**: Explaining invariant maintenance

**Time/Space (20%)**:
- ✅ Big-O: "O(log n) insert vs O(n) for sorted array"
- ⭐ **Key Skill**: Understanding streaming complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct balancing logic
- ✅ Efficiency: Both invariants maintained

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Task Scheduler with Greedy Heap

> 🔄 **When Greedy Meets Priority**: Two heaps maintain balance. Task Scheduler combines greedy (always pick most frequent task) with heap (efficiently find the maximum). Add cooldown tracking for the full solution.

### [Task Scheduler](https://leetcode.com/problems/task-scheduler/) (Medium)

**Problem**: Schedule tasks with cooldown n (same task must wait n intervals). Return minimum intervals needed.

```python
tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
# Schedule: A → B → idle → A → B → idle → A → B
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Heaps maintain priority ordering

**New Complexity**: **Greedy scheduling** with heap + cooldown tracking

**Progressive Challenge**: Combine heap (priority) with time management

---

#### The Complexity Ladder

**Level 1**: Heap for static top k
**Level 2**: Heap for dynamic k-way merge
**Level 3**: Two heaps working together
**Level 4**: Heap + greedy scheduling + time tracking

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: Greedily Schedule Most Frequent First!</h4>
<p><strong>Old thinking</strong>: Try all scheduling orders</p>
<p><strong>New thinking</strong>: Max-heap gives most frequent task → schedule greedily</p>
<p><strong>Key insight</strong>: Most frequent task determines minimum intervals!</p>
</div>

#### The Task Scheduler Pattern

**Algorithm**:
1. **Count** task frequencies → max-heap
2. **Each cycle** (n+1 intervals):
   - Pop up to n+1 tasks from heap
   - Execute each (or idle if heap empty)
   - Decrement counts, push back if count > 0
3. **Repeat** until heap empty

**Why Greedy**:
- Most frequent task creates most idle time
- Schedule it first each cycle to minimize total idle

**Formula** (alternative):
```
max_freq = most frequent task count
max_count = number of tasks with max frequency
intervals = max((max_freq-1)*(n+1) + max_count, len(tasks))
```

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force: Try all orderings
# Exponential combinations, infeasible
```

```python
# ✅ Greedy with Heap: O(n)
from collections import Counter
import heapq

def least_interval(tasks, n):
    # Count frequencies
    counts = Counter(tasks)

    # Max-heap of frequencies (negate for max-heap)
    max_heap = [-count for count in counts.values()]
    heapq.heapify(max_heap)

    time = 0

    while max_heap:
        temp = []  # Tasks for next cycle

        # Process one cycle (n+1 intervals)
        for _ in range(n + 1):
            if max_heap:
                count = heapq.heappop(max_heap)
                if count + 1 < 0:  # Still has remaining tasks
                    temp.append(count + 1)
            time += 1

            # Early exit if done
            if not max_heap and not temp:
                break

        # Re-add tasks with remaining counts
        for count in temp:
            heapq.heappush(max_heap, count)

    return time

# Time: O(n) where n = number of tasks
# Space: O(1) - at most 26 task types
# Key: Greedy scheduling with heap priority
```

**Mathematical Formula Approach**:
```python
# ✅ Mathematical Formula: O(n)
def least_interval_formula(tasks, n):
    counts = Counter(tasks)

    max_freq = max(counts.values())
    max_count = sum(1 for c in counts.values() if c == max_freq)

    # Formula: (max_freq - 1) * (n + 1) + max_count
    # Or just len(tasks) if no idle needed
    return max((max_freq - 1) * (n + 1) + max_count, len(tasks))

# Time: O(n) - count frequencies
# Space: O(1) - at most 26 letters
```

**Example Walkthrough**:
```python
tasks = ["A","A","A","B","B","B"], n = 2

Counts: {A: 3, B: 3}
Max-heap: [-3, -3]

Cycle 1 (intervals 0-2):
  Pop A (count=3→2): schedule A, time=1
  Pop B (count=3→2): schedule B, time=2
  Heap empty: idle, time=3
  temp=[-2, -2]

Cycle 2 (intervals 3-5):
  Pop A (count=2→1): schedule A, time=4
  Pop B (count=2→1): schedule B, time=5
  Heap empty: idle, time=6
  temp=[-1, -1]

Cycle 3 (intervals 6-7):
  Pop A (count=1→0): schedule A, time=7
  Pop B (count=1→0): schedule B, time=8
  Heap empty and no more tasks: break

Total: 8 intervals

Schedule: A B _ A B _ A B
```

**Formula Explanation**:
```
max_freq = 3, max_count = 2, n = 2

(max_freq - 1) × (n + 1) + max_count
= (3 - 1) × (2 + 1) + 2
= 2 × 3 + 2
= 8

Why this works:
- (max_freq-1) groups of (n+1) intervals
- Each group has most frequent task + n other slots
- Last group needs max_count tasks (all with max freq)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use max-heap to greedily schedule most frequent tasks"
- ✅ Correctness: Handle edge cases (n=0, all same task, no idle needed)
- ⭐ **Key Skill**: Combining greedy + heap + time management

**Communication (20%)**:
- ✅ Thought Process: "Most frequent task determines minimum intervals"
- ✅ Explanation: "Schedule most frequent first to minimize idle time"
- ⭐ **Key Skill**: Explaining greedy optimality

**Time/Space (20%)**:
- ✅ Big-O: "O(n) for n tasks, heap operations are O(1) per cycle"
- ⭐ **Key Skill**: Understanding bounded heap size (26 letters)

**Code Quality (25%)**:
- ✅ Implementation: Clean cycle logic, correct cooldown handling
- ✅ Efficiency: Early exit when done

</div>
</div>

---

<div id="grading-success"></div>

## Grading Success Across Levels

**What Matters Most**: Interviewers grade heap problems on your ability to **choose min vs max heap** correctly, **maintain heap invariants** (especially for two-heap patterns), and **explain why heap beats alternatives** (sorting, arrays).

**Common Pitfalls to Avoid**:
- ❌ Using max-heap for "top k largest" (should use min-heap!)
- ❌ Not maintaining two-heap balance (median finder)
- ❌ Forgetting Python's heapq is min-heap only (negate for max)
- ❌ Using heap when simple sort would be clearer (k ≈ n case)

**Interview Success Formula**:
1. **Choose heap type** → "Min-heap for top k largest because we evict smallest"
2. **Explain invariant** → "Heap maintains [property] in O(log n) per operation"
3. **Compare alternatives** → "Sorting is O(n log n), heap is O(n log k) - better when k << n"
4. **Two-heap pattern** → "Max-heap for lower half, min-heap for upper half, median at boundary"

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/)** → Top k with min-heap
2. **[Last Stone Weight](https://leetcode.com/problems/last-stone-weight/)** → Max-heap simulation
3. **[Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)** → Frequency heap

### 🟡 Medium - Core Patterns
4. **[Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)** → K-way merge
5. **[Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)** → Two heaps
6. **[Task Scheduler](https://leetcode.com/problems/task-scheduler/)** → Greedy heap scheduling
7. **[Kth Smallest Element in Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)** → Matrix k-way merge
8. **[Reorganize String](https://leetcode.com/problems/reorganize-string/)** → Greedy heap with constraint
9. **[Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)** → Heap for intervals

### 🔴 Hard - Advanced Mastery
10. **[Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)** → Two heaps with removal
11. **[Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)** → Multi-dimensional heap
12. **[IPO](https://leetcode.com/problems/ipo/)** → Two heaps for optimization

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Kth Largest Element | Sorting basics | Heap for top k (O(k) space vs O(n)) | Size-limited heap |
| **2** | Merge k Sorted Lists | Level 1 | Heap for k-way merge | O(log k) vs O(k) comparison |
| **3** | Find Median from Data Stream | Level 2 | Two heaps working together | Maintaining invariants |
| **4** | Task Scheduler | Level 3 | Greedy heap scheduling | Heap + time + greedy |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
