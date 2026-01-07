# Sorting

## Chapter Overview

Sorting transcends simple element arrangement—it's a preprocessing strategy that unlocks algorithm optimizations. This chapter reveals when paying the O(n log n) sorting cost enables subsequent O(n) or O(log n) operations, transforming otherwise intractable O(n²) problems into efficient solutions.

**What You'll Master:**
- Merge sorted arrays in-place with zero extra space
- Apply three-way partitioning for constant-space sorting
- Recognize when sorting enables greedy interval merging
- Design custom comparators for non-standard orderings
- Choose between comparison-based and linear-time sorts

The key insight: sorting isn't the goal—it's a tool. Master when to sort (enabling binary search, two pointers, or greedy approaches) and when alternative approaches avoid sorting's overhead entirely.

**Strategic Patterns:**
- **O(n log n) preprocessing** → O(log n) binary search per query
- **Sorted intervals** → O(n) greedy merge instead of O(n²) pairwise checks
- **Custom ordering** → Transform comparison to unlock sorting power

## When to Recall These Techniques

Sorting problems appear when element order enables optimization or when the problem explicitly requires ordering. The key is recognizing whether sorting unlocks a simpler algorithm (binary search, two pointers, greedy merging) or if the problem requires custom comparison logic.

**Quick Pattern Recognition:**
- **Merging sorted arrays in-place** → In-place merging (fill from end)
- **Three distinct values to sort** → Three-way partitioning (Dutch Flag)
- **Overlapping intervals** → Sort + greedy merge
- **Custom ordering rules** → Custom comparator
- **Finding k-th element** → Quick Select or heap

## The Learning Ladder

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | In-Place Merging | Merge without extra space | Two sorted arrays, limited memory | Merge Sorted Array |
| **2** | Three-Way Partitioning | Dutch National Flag | 3 categories, single pass | Sort Colors |
| **3** | Interval Problems | Sort by start/end time | Overlapping ranges, scheduling | Merge Intervals |
| **4** | Custom Comparator | Define ordering logic | Non-standard sort criteria | Largest Number |

## Deep Dive: Pattern Recognition

### In-Place Merging
You have two sorted arrays and must merge them without extra space. Classic signal: "merge sorted array," "combine in-place," space complexity O(1). Work backwards from the end to avoid overwriting unprocessed elements. Use three pointers: two for reading from ends, one for writing position.

**When to use:** Merging pre-sorted data with limited memory. The empty space at the end of the target array allows safe backward filling without overwrites.

### Three-Way Partitioning
Array contains limited distinct values (like 0, 1, 2) needing sorting in one pass. Dutch National Flag algorithm maintains three regions: elements less than pivot, equal to pivot, greater than pivot. Single pass with O(1) space beats O(n log n) general sorting.

**When to use:** Problem has 3 categories or values. Classic example: Sort Colors. Maintain invariants [0s][1s][unsorted][2s] with three pointers.

### Interval Problems
Overlapping intervals, scheduling conflicts, or range merging problems. Unsorted intervals require O(n²) pairwise checks. Sorting by start time makes overlaps adjacent, enabling O(n) greedy merge. If current.start ≤ last.end, intervals overlap.

**When to use:** Problems with time ranges, scheduling, merging overlapping periods. Sort first (O(n log n)), then linear scan (O(n)) for merging or conflict detection.

### Custom Comparator
Problem requires non-standard ordering that numeric/lexicographic sort doesn't provide. Example: "Largest Number" needs concatenation-based comparison ("9" > "534" because "9534" > "5349"). Define custom comparison function or lambda key.

**When to use:** Default sorting doesn't match problem requirements. Multi-key sorting, concatenation logic, or domain-specific orderings. Use `key=lambda` or `cmp_to_key` for custom comparison.

---

<div id="level-1"></div>

## Level 1: Foundation - In-Place Merging

> 🎯 **Starting Point**: You know how to merge arrays with extra space. Now learn to merge in-place by working backwards—fill from the end to avoid overwriting!

### [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) (Easy)

**Problem**: Given two sorted arrays `nums1` and `nums2`, merge `nums2` into `nums1` in-place.

```python
nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3  →  [1,2,2,3,5,6]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know how to merge two sorted arrays

**New Concept**: Merging in-place by filling from the END

**Why It's Foundational**: Teaches reverse iteration to avoid overwrites

---

#### Your Natural First Instinct

"Merge two arrays" → Start from the beginning!

**Why This Breaks**:
```
If we fill from left to right, we overwrite nums1[0] before using it
nums1 = [1,2,3,_,_,_], nums2 = [2,5,6]
Place 1 at nums1[0]... but it's already there!
Place 2 at nums1[1]... oops, overwrote original nums1[1]=2!
```

**The Hidden Cost**:
- Need to shift elements right each time → O(n) per insertion
- Total: O(n²) with shifting or O(n) extra space with temp array

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Fill From the End!</h4>
<p><strong>Old thinking</strong>: Merge left-to-right (causes overwrites)</p>
<p><strong>New thinking</strong>: Merge right-to-left (empty space is at the end!)</p>
</div>

#### The Reverse Iteration Insight

Instead of forward merging (risky), **fill backward into empty space**:

**Key Idea**:
- nums1 has extra space at the end
- Start from the largest elements (ends of both arrays)
- Place larger element at end of nums1
- Work backwards → never overwrite unprocessed data

**Why This Works**:
- Three pointers: p1 (last of nums1 data), p2 (last of nums2), p (write position at end)
- Compare nums1[p1] vs nums2[p2], place larger at nums1[p]
- Move pointers leftward
- No overwrites because we're filling empty space!

</div>

<div class="code-block-wrapper">

### Approach 1: Copy and Merge (Extra Space)

```python
def merge_brute(nums1, m, nums2, n):
    """
    Create a copy of nums1's valid data, then merge.

    Time Complexity: O(m + n) - single pass through both arrays
    Space Complexity: O(m) - requires copy of nums1's data
    Problem: Unnecessary memory allocation when nums1 has space
    """
    # Backup nums1's valid data
    nums1_copy = nums1[:m]

    # Standard two-pointer merge
    i = j = 0
    for k in range(m + n):
        if i >= m:
            nums1[k] = nums2[j]
            j += 1
        elif j >= n:
            nums1[k] = nums1_copy[i]
            i += 1
        elif nums1_copy[i] <= nums2[j]:
            nums1[k] = nums1_copy[i]
            i += 1
        else:
            nums1[k] = nums2[j]
            j += 1
```

**The Problem:** Creating `nums1_copy` uses O(m) extra space. For large arrays, this memory overhead is avoidable.

---

### Approach 2: Reverse Three-Pointer Merge (Optimal) ✓

```python
def merge(nums1, m, nums2, n):
    """
    Merge by filling from the end, avoiding overwrites.

    Time Complexity: O(m + n) - single pass backward
    Space Complexity: O(1) - only three pointer variables
    Key Insight: Fill rightward where empty space exists
    """
    p1 = m - 1      # Last element of nums1's valid data
    p2 = n - 1      # Last element of nums2
    p = m + n - 1   # Current fill position (rightmost)

    # Merge from end to beginning
    while p2 >= 0:  # Continue until nums2 exhausted
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
```

**Why This Works:** The empty space is at the *end* of nums1. By filling backward, we never overwrite unprocessed elements. Once p2 < 0, all nums2 elements are placed, and remaining nums1 elements are already in correct positions.

---

### Execution Trace

```python
Input: nums1 = [1,2,3,0,0,0], m=3, nums2 = [2,5,6], n=3

Initial state:
nums1 = [1, 2, 3, _, _, _]
         ↑         ↑
        p1=2      p=5
nums2 = [2, 5, 6]
               ↑
              p2=2

Step 1: Compare nums1[2]=3 vs nums2[2]=6
  6 > 3 → place 6 at nums1[5]
  [1, 2, 3, _, _, 6], p2=1, p=4

Step 2: Compare nums1[2]=3 vs nums2[1]=5
  5 > 3 → place 5 at nums1[4]
  [1, 2, 3, _, 5, 6], p2=0, p=3

Step 3: Compare nums1[2]=3 vs nums2[0]=2
  3 > 2 → place 3 at nums1[3]
  [1, 2, 3, 3, 5, 6], p1=1, p=2

Step 4: Compare nums1[1]=2 vs nums2[0]=2
  2 == 2 → place nums2[0] at nums1[2]
  [1, 2, 2, 3, 5, 6], p2=-1, p=1

Exit condition: p2 < 0 (nums2 exhausted)
Remaining nums1 elements [1,2] already in place ✓

Final: [1, 2, 2, 3, 5, 6]
```

**Invariant:** `nums1[p+1...m+n-1]` contains the largest (m+n-p-1) elements in sorted order.

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle both arrays correctly
- ✅ Edge Cases: One array empty, all elements from one array larger
- ✅ Approach: Recognize reverse iteration pattern

**Code Quality (25%)**:
- ✅ Readability: Clear pointer names (p1, p2, p)
- ✅ Efficiency: Single pass, no extra space

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(m+n) time, O(1) space
- ✅ Space Trade-off: In-place vs copy approach

**Communication (20%)**:
- ✅ Thought Process: "I'll merge from the end to avoid overwrites"
- ✅ Explanation: "Empty space at end allows safe backward filling"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Partitioning with Three Pointers

> 🔄 **When Two Pointers Aren't Enough**: Merging handles two sorted sequences. But partitioning into *three* groups (0s, 1s, 2s) requires three pointers—the Dutch National Flag algorithm.

### [Sort Colors](https://leetcode.com/problems/sort-colors/) (Medium)

**Problem**: Sort array with only 0s, 1s, and 2s in-place (Dutch National Flag problem).

```python
nums = [2,0,2,1,1,0]  →  [0,0,1,1,2,2]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: Two pointers can partition data

**New Dimension**: THREE distinct values need THREE pointers

**Progressive Insight**: Maintain invariants for three regions simultaneously

---

#### Your Next Natural Thought

"Sort array" → Use built-in sort or counting sort!

```python
# Built-in sort
nums.sort()  # O(n log n)

# Counting sort
count = [0, 0, 0]
for num in nums:
    count[num] += 1
# Rebuild array: O(n) time, O(1) space but two passes
```

**Better than O(n log n)**, but can we do ONE pass?

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Three Regions, Three Pointers!</h4>
<p><strong>Old thinking</strong>: Sort means O(n log n)</p>
<p><strong>New thinking</strong>: Known values (0,1,2) → partition into three regions in one pass!</p>
<p><strong>Key insight</strong>: Maintain invariant: [0s][1s][unsorted][2s]</p>
</div>

#### The Three-Pointer Partitioning

**Vision**: Divide array into FOUR regions
```
[0 0 0][1 1 1][? ? ?][2 2 2]
       ↑      ↑      ↑
      low    mid    high
```

**Invariants**:
- `[0...low-1]` → all 0s
- `[low...mid-1]` → all 1s
- `[mid...high]` → unsorted (to be processed)
- `[high+1...n-1]` → all 2s

**Algorithm**: Process nums[mid]
- If 0 → swap with nums[low], increment both low and mid
- If 1 → already in correct region, increment mid
- If 2 → swap with nums[high], decrement high (don't increment mid! need to check swapped value)

</div>

<div class="code-block-wrapper">

```python
# ❌ Two-Pass Counting: O(n) time, but 2 passes
def sort_colors_counting(nums):
    count = [0, 0, 0]

    # Count occurrences
    for num in nums:
        count[num] += 1

    # Rebuild array
    idx = 0
    for color in range(3):
        for _ in range(count[color]):
            nums[idx] = color
            idx += 1

# Time: O(n) - two passes
# Space: O(1)
# Problem: Not one-pass
```

```python
# ✅ One-Pass Three-Pointer: O(n)
def sort_colors(nums):
    low = 0          # Boundary for 0s
    mid = 0          # Current element
    high = len(nums) - 1  # Boundary for 2s

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1  # Already in correct region
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid! Need to check swapped value

# Time: O(n) - single pass
# Space: O(1) - in-place
# Key: Three pointers maintain three regions
```

**Example Walkthrough**:
```python
nums = [2,0,2,1,1,0]
        m     h       low=0,mid=0,high=5
       l

mid=0: nums[0]=2, swap with nums[5]=0 → [0,0,2,1,1,2], high=4
mid=0: nums[0]=0, swap with nums[0]=0 → [0,0,2,1,1,2], low=1,mid=1
mid=1: nums[1]=0, swap with nums[1]=0 → [0,0,2,1,1,2], low=2,mid=2
mid=2: nums[2]=2, swap with nums[4]=1 → [0,0,1,1,2,2], high=3
mid=2: nums[2]=1, mid++ → mid=3
mid=3: nums[3]=1, mid++ → mid=4
mid=4: mid>high, DONE

Result: [0,0,1,1,2,2]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use three pointers to partition into three regions"
- ✅ Edge Cases: All same color, already sorted
- ⭐ **Key Skill**: Recognizing when constrained values enable partitioning

**Communication (20%)**:
- ✅ Thought Process: "Known values mean I can partition instead of general sort"
- ✅ Explanation: "Maintaining invariants for three regions"
- ⭐ **Key Skill**: Articulating invariants clearly

**Time/Space (20%)**:
- ✅ Big-O: "Single pass O(n) vs O(n log n) general sort"
- ✅ Optimization: "One pass vs two-pass counting sort"
- ⭐ **Key Skill**: Understanding when constraints enable optimization

**Code Quality (25%)**:
- ✅ Implementation: Correct swap logic, especially for 2s (no mid increment)
- ✅ Efficiency: Minimal swaps, no unnecessary work

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Sorting with Custom Logic

> 🔄 **When Array Order Matters for Logic**: Partitioning works on individual elements. But *interval* problems need elements sorted by start time first, then a linear scan can merge overlapping ranges.

### [Merge Intervals](https://leetcode.com/problems/merge-intervals/) (Medium)

**Problem**: Merge all overlapping intervals.

```python
intervals = [[1,3],[2,6],[8,10],[15,18]]  →  [[1,6],[8,10],[15,18]]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: Sorting helps organize data

**New Complexity**: After sorting, apply merging logic

**Progressive Challenge**: Two-step process: sort first, then merge

---

#### The Pattern Shift

**Level 1**: Merge two pre-sorted arrays
**Level 2**: Partition known values
**Level 3**: Sort THEN merge with custom logic

**Key Insight**: Unsorted intervals are hard to merge. After sorting by start time, overlaps become obvious!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Sort Unlocks Greedy Merging!</h4>
<p><strong>Old pattern</strong>: Compare all pairs for overlap → O(n²)</p>
<p><strong>New pattern</strong>: Sort by start → check only consecutive intervals → O(n)</p>
<p><strong>Key insight</strong>: After sorting, overlapping intervals are adjacent!</p>
</div>

#### The Sort-Then-Merge Strategy

**Why Sorting Helps**:
```
Before: [[8,10],[1,3],[15,18],[2,6]]
After:  [[1,3],[2,6],[8,10],[15,18]]
         ~~~~~ ~~~~~  Overlap! Adjacent after sort
```

**Greedy Merging**:
1. Sort intervals by start time: O(n log n)
2. Iterate through sorted intervals: O(n)
3. If current overlaps with last merged interval → extend last
4. Else → add current as new interval

**Overlap Check**: `current.start <= last.end`

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force: O(n²)
def merge_brute(intervals):
    result = []
    used = [False] * len(intervals)

    for i in range(len(intervals)):
        if used[i]:
            continue

        merged = intervals[i]
        used[i] = True

        # Check all other intervals for overlap
        changed = True
        while changed:
            changed = False
            for j in range(len(intervals)):
                if used[j]:
                    continue
                if merged[1] >= intervals[j][0] and merged[0] <= intervals[j][1]:
                    merged = [min(merged[0], intervals[j][0]),
                              max(merged[1], intervals[j][1])]
                    used[j] = True
                    changed = True

        result.append(merged)

    return result

# Time: O(n²) - nested loops
# Problem: Checks all pairs repeatedly
```

```python
# ✅ Sort-Then-Merge: O(n log n)
def merge(intervals):
    if not intervals:
        return []

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current in intervals[1:]:
        last = merged[-1]

        # Check overlap: current starts before last ends
        if current[0] <= last[1]:
            # Merge: extend last interval's end
            last[1] = max(last[1], current[1])
        else:
            # No overlap: add as new interval
            merged.append(current)

    return merged

# Time: O(n log n) - dominated by sorting
# Space: O(n) - output array
# Key: Sorting makes overlaps adjacent
```

**Example Walkthrough**:
```python
intervals = [[1,3],[2,6],[8,10],[15,18]]

After sort: [[1,3],[2,6],[8,10],[15,18]]

merged = [[1,3]]

current=[2,6]: 2 <= 3 → overlap! merged = [[1,6]]
current=[8,10]: 8 > 6 → no overlap, merged = [[1,6],[8,10]]
current=[15,18]: 15 > 10 → no overlap, merged = [[1,6],[8,10],[15,18]]

Result: [[1,6],[8,10],[15,18]]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll sort by start time, then merge overlapping intervals"
- ✅ Correctness: Handle edge cases (no overlap, complete overlap, partial)
- ⭐ **Key Skill**: Two-phase approach (sort + greedy)

**Communication (20%)**:
- ✅ Thought Process: "Unsorted intervals make overlap detection hard. Sorting makes it linear."
- ✅ Explanation: "After sorting, I only need to check consecutive intervals"
- ⭐ **Key Skill**: Explaining why sorting enables optimization

**Code Quality (25%)**:
- ✅ Implementation: Clean sort key, correct overlap condition
- ✅ Efficiency: In-place modification of merged intervals

**Time/Space (20%)**:
- ✅ Analysis: "O(n log n) from sort dominates O(n) merge"
- ⭐ **Key Skill**: Understanding dominant term in complexity

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Custom Comparator with String Manipulation

> 🔄 **When Default Sorting Fails**: Standard numeric sort gives [9, 5, 34, 30, 3]. But for "largest number" we need string comparison: "9" > "534" > "34" > "3" > "30". Custom comparators define what "greater" means!

### [Largest Number](https://leetcode.com/problems/largest-number/) (Medium)

**Problem**: Arrange numbers to form the largest number.

```python
nums = [3,30,34,5,9]  →  "9534330"
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Sorting with custom key helps solve problems

**New Complexity**: Standard numeric sort fails! Need custom comparator

**Progressive Challenge**: The "correct" order isn't obvious from values alone

---

#### The Complexity Ladder

**Level 3**: Standard sort (by start time)
**Level 4**: Custom comparator (concatenation-based)

**Problem**: Sorting [3, 30, 34] numerically → [3, 30, 34]
But "34" + "3" + "30" = "34330" vs "3" + "34" + "30" = "33430" ← larger!

**Why Standard Sort Fails**:
- Numeric sort: [3, 30, 34] → "33034"
- Optimal: [34, 3, 30] → "34330"

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: Compare Concatenations!</h4>
<p><strong>Old thinking</strong>: Sort numbers numerically</p>
<p><strong>New thinking</strong>: For numbers a, b: if "ab" > "ba", then a should come before b</p>
<p><strong>Key insight</strong>: The optimal order depends on concatenation, not numeric value!</p>
</div>

#### The Custom Comparator Pattern

**Comparison Rule**: For two numbers `a` and `b`
- If `str(a) + str(b) > str(b) + str(a)` → `a` comes before `b`
- Example: `9` vs `34`: "934" > "349" → `9` comes first

**Why This Works**:
- Transitive: If A > B and B > C, then A > C (for concatenation)
- Ensures global optimal ordering
- Greedy locally optimal = globally optimal

**Implementation**:
```python
from functools import cmp_to_key

def compare(x, y):
    if x + y > y + x:
        return -1  # x comes before y
    elif x + y < y + x:
        return 1   # y comes before x
    else:
        return 0   # equal
```

</div>

<div class="code-block-wrapper">

```python
# ❌ Numeric Sort: Wrong!
def largest_number_wrong(nums):
    nums.sort(reverse=True)  # [9, 5, 34, 30, 3]
    result = ''.join(map(str, nums))  # "9534303"
    return result if result[0] != '0' else '0'

# Output: "9534303"
# Expected: "9534330"
# Problem: Numeric order ≠ concatenation order
```

```python
# ✅ Custom Comparator: O(n log n)
def largest_number(nums):
    from functools import cmp_to_key

    # Convert to strings
    nums_str = list(map(str, nums))

    # Custom comparator
    def compare(x, y):
        # Compare concatenations
        if x + y > y + x:
            return -1  # x before y (descending)
        elif x + y < y + x:
            return 1   # y before x
        else:
            return 0

    # Sort with custom comparator
    nums_str.sort(key=cmp_to_key(compare))

    # Join result
    result = ''.join(nums_str)

    # Handle all zeros case
    return '0' if result[0] == '0' else result

# Time: O(n log n) - sorting
# Space: O(n) - string conversion
# Key: Custom comparator based on concatenation
```

**Example Walkthrough**:
```python
nums = [3, 30, 34, 5, 9]

Comparisons:
- "9" vs "5": "95" > "59" → 9 before 5
- "5" vs "34": "534" > "345" → 5 before 34
- "34" vs "3": "343" > "334" → 34 before 3
- "3" vs "30": "330" > "303" → 3 before 30

Sorted: ["9", "5", "34", "3", "30"]
Result: "9534330"
```

**Edge Case**:
```python
nums = [0, 0, 0]
Without check: "000"
With check: "0"  ← correct
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use custom comparator comparing concatenations"
- ✅ Correctness: Handle all zeros, single element
- ⭐ **Key Skill**: Defining custom comparison logic

**Communication (20%)**:
- ✅ Thought Process: "Numeric sort doesn't work. I need to compare concatenations."
- ✅ Explanation: "For a and b, if 'ab' > 'ba', then a comes first"
- ⭐ **Key Skill**: Articulating non-standard comparison

**Time/Space (20%)**:
- ✅ Big-O: "O(n log n) from sort, comparison is O(1) for numbers, O(k) for strings"
- ⭐ **Key Skill**: Analyzing custom comparator complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct use of cmp_to_key, string comparison
- ✅ Edge Cases: All zeros handled elegantly
- ⭐ **Key Skill**: Using Python's comparison tools correctly

</div>
</div>

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)** → Reverse iteration for in-place merge
2. **[Valid Anagram](https://leetcode.com/problems/valid-anagram/)** → Sorting for comparison
3. **[Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/)** → Sort then two pointers

### 🟡 Medium - Core Patterns
4. **[Sort Colors](https://leetcode.com/problems/sort-colors/)** → Three-pointer partitioning
5. **[Merge Intervals](https://leetcode.com/problems/merge-intervals/)** → Sort then greedy merge
6. **[Largest Number](https://leetcode.com/problems/largest-number/)** → Custom comparator
7. **[Sort List](https://leetcode.com/problems/sort-list/)** → Merge sort on linked list
8. **[Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)** → Sort + heap for resource allocation
9. **[Insert Interval](https://leetcode.com/problems/insert-interval/)** → Merge intervals variant

### 🔴 Hard - Advanced Mastery
10. **[Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)** → Merge sort with counting
11. **[Maximum Gap](https://leetcode.com/problems/maximum-gap/)** → Bucket sort application

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Merge Sorted Array | Array basics | Reverse iteration | In-place manipulation |
| **2** | Sort Colors | Level 1 | Three-pointer partitioning | Invariant maintenance |
| **3** | Merge Intervals | Level 2 | Sort then greedy | Two-phase approach |
| **4** | Largest Number | Level 3 | Custom comparator | Non-standard ordering |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
