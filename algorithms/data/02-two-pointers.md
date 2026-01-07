# Two Pointers / Sliding Window

## Chapter Overview

The two-pointer technique represents one of the most elegant optimizations in algorithm design—transforming brute force O(n²) solutions into elegant O(n) algorithms through intelligent pointer movement. This chapter reveals the power of maintaining multiple positions in a data structure, whether converging from opposite ends, moving in tandem, or expanding and contracting a window.

**What You'll Master:**
- Recognize when space constraints require in-place pointer manipulation
- Apply convergence patterns on sorted arrays for pair/triplet problems
- Reduce problem dimensions (fix variables + pointer sweep on rest)
- Maintain sliding window state for O(n) contiguous subarray solutions
- Choose between opposite-end convergence vs same-direction sliding

## When to Recall These Techniques

Two-pointer problems involve optimizing array/string operations by tracking multiple positions simultaneously. The pattern you choose depends on whether you're modifying in-place, working with sorted data, or maintaining a validity constraint over a range.

**Quick Pattern Recognition:**
- **Must modify without extra space** → In-place modification
- **Sorted array + finding pairs** → Opposite-end pointers
- **Finding triplets/k-tuples** → 3Sum pattern (fix + two pointers)
- **Contiguous subarray constraint** → Sliding window

## The Learning Ladder

| Level | Name | Key Concept | When to Use This Pattern | Core Problem |
|-------|------|-------------|--------------------------|--------------|
| **1** | In-Place Modification | Read/write pointers | Removing/moving elements without O(n) extra space, array modification where `pop()` causes O(n²), need to compact array while preserving order | Remove Duplicates |
| **2** | Opposite-End Pointers | Converge from both ends | Sorted array + finding pairs with target sum, container/area problems where both boundaries affect result, palindrome checks (compare ends moving inward) | Container With Most Water |
| **3** | Three Pointers (3Sum) | Fix one, sweep with two | Finding triplets/quadruplets summing to target, reducing O(n³) to O(n²) by fixing one dimension, sorted array enabling pointer logic | 3Sum |
| **4** | Sliding Window | Expand right, shrink left | Longest/shortest contiguous subarray/substring satisfying constraint, window validity tracked with hash map/counters, dynamic window size based on condition | Longest Substring Without Repeating |

## Deep Dive: Pattern Recognition

### In-Place Modification
Problem requires removing/moving elements without extra space (`pop()` is too slow). Classic signals: "remove duplicates in sorted array," "move zeros to end," space complexity must be O(1). Use read/write pointers: read scans all elements, write tracks valid output position.

**When to use:** Space is constrained to O(1), you're filtering/compacting an array, or `pop()`/`remove()` would cause O(n²) due to element shifting. Read pointer finds valid elements, write pointer marks where they go.

### Opposite-End Pointers
Sorted array + need to find pairs/triplets, or checking symmetric properties (palindromes), or container problems where both boundaries matter. Pointers converge from ends, intelligently eliminating candidates based on sorted order. Reduces O(n²) pair checking to O(n) single pass.

**When to use:** Array is sorted (or can be sorted), looking for pairs with specific sum, or checking symmetry from both ends. The sorted property lets you move pointers intelligently: too large? Move right pointer left. Too small? Move left pointer right.

### 3Sum Pattern
Finding triplets/k-tuples with specific sum or relationship. Fix one element, apply two-pointer technique on remaining elements. Transforms O(n³) three-nested-loops into O(n²) by reducing dimensions. Requires sorting to enable pointer movement logic.

**When to use:** Problem asks for triplets, quadruplets, or k-tuples. Classic signal: "find three numbers that sum to target." Reduce dimensions by fixing one variable, then solve the simpler two-variable problem with opposite-end pointers.

### Sliding Window
Contiguous subarray/substring problems with constraints (longest/shortest satisfying condition, character frequency limits, sum bounds). Window expands right to explore, shrinks left to maintain validity. Maintains running state (sum, counts) instead of recalculating. Achieves O(n) instead of O(n²) substring enumeration.

**When to use:** Problem asks for contiguous subarray/substring with constraint: "longest substring with at most k distinct characters," "minimum window containing all characters." Window expands to explore, contracts to maintain validity. State (character counts, sum) updates incrementally.

---

<div id="learning-ladder"></div>

## The Learning Ladder

| Level | Name | Key Concept | When to Use This Pattern | Core Problem |
|-------|------|-------------|--------------------------|--------------|
| **1** | In-Place Modification | Read/write pointers | Removing/moving elements without O(n) extra space, array modification where `pop()` causes O(n²), need to compact array while preserving order | Remove Duplicates |
| **2** | Opposite-End Pointers | Converge from both ends | Sorted array + finding pairs with target sum, container/area problems where both boundaries affect result, palindrome checks (compare ends moving inward) | Container With Most Water |
| **3** | Three Pointers (3Sum) | Fix one, sweep with two | Finding triplets/quadruplets summing to target, reducing O(n³) to O(n²) by fixing one dimension, sorted array enabling pointer logic | 3Sum |
| **4** | Sliding Window | Expand right, shrink left | Longest/shortest contiguous subarray/substring satisfying constraint, window validity tracked with hash map/counters, dynamic window size based on condition | Longest Substring Without Repeating |

### Quick Decision Guide
- **"Remove/modify in-place"** → Level 1 (Read/Write Pointers)
- **"Find pair in sorted array"** → Level 2 (Opposite-End)
- **"Find triplet/quadruplet"** → Level 3 (Fix + Two Pointers)
- **"Longest/shortest subarray with condition"** → Level 4 (Sliding Window)

---

<div id="level-1"></div>

## Level 1: Foundation - In-Place Modification

> 🎯 **Starting Point**: You know basic array iteration. Now learn to modify arrays in-place using a read/write pointer pattern—no extra space needed!

### [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) (Easy)

**Problem**: Given sorted array `nums`, remove duplicates in-place. Return new length.

```python
nums = [1, 1, 2, 2, 3]  →  [1, 2, 3, _, _], length = 3
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know how to iterate through arrays

**New Concept**: Maintaining TWO positions (read vs write)

**Why It's Foundational**: Teaches the core insight of two pointers

---

#### Your Natural First Instinct

"Remove duplicates" → Use `pop()` to delete them!

**Why This Breaks**:
```
Each pop() shifts all remaining elements → O(n)
For n elements → O(n²) total
```

**The Hidden Cost**:
- `pop(1)` on `[1,1,2,2,3]` → shifts [2,2,3] left
- `pop(1)` on `[1,2,2,3]` → shifts [2,3] left
- Repeated shifting kills performance!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Don't Delete, Overwrite!</h4>
<p><strong>Old thinking</strong>: Remove bad elements (expensive)</p>
<p><strong>New thinking</strong>: Keep good elements, ignore the rest (cheap)</p>
</div>

#### The Two-Pointer Insight

Instead of deleting (which shifts), **overwrite in-place**:

**Two Positions**:
1. **`read`**: Scans every element (always moves forward)
2. **`write`**: Marks where to place next unique element (only moves when unique found)

**Intuition**: `write` creates a "compressed" version at the array's start, leaving garbage at the end (which we ignore).

</div>

<div class="code-block-wrapper">

### Approach 1: Pop Elements (Inefficient)

```python
def remove_duplicates_brute(nums):
    """
    Remove duplicates by popping repeated elements.

    Time Complexity: O(n²) - each pop shifts O(n) elements
    Space Complexity: O(1) - modifies array in-place
    Problem: Each deletion triggers array shift, causing quadratic time
    """
    i = 0
    while i < len(nums) - 1:
        if nums[i] == nums[i+1]:
            nums.pop(i+1)  # Expensive: shifts all elements right of i
        else:
            i += 1
    return len(nums)
```

**Why This Fails:** Deleting `nums[1]` from `[1,1,2,2,3]` shifts `[2,2,3]` left by one position. With many duplicates, this creates O(n²) shifts.

---

### Approach 2: Two-Pointer Overwrite (Optimal) ✓

```python
def remove_duplicates(nums):
    """
    Use read and write pointers to compact array in-place.

    Time Complexity: O(n) - single pass through array
    Space Complexity: O(1) - only two pointer variables
    Key Insight: Overwrite in-place instead of deleting
    """
    if not nums:
        return 0

    write = 1  # Next position to write a unique element

    for read in range(1, len(nums)):
        # Found a new unique element
        if nums[read] != nums[read-1]:
            nums[write] = nums[read]
            write += 1

    return write  # New length of unique elements
```

**Why This Works:** We never delete—just copy unique elements forward. The `write` pointer creates a "compressed" region at the array's start, leaving garbage values at the end (which we ignore).

---

### Execution Trace

```python
Input: nums = [1, 1, 2, 2, 3]

Initial: [1, 1, 2, 2, 3], write=1

read=1: nums[1]=1 == nums[0]=1 → skip (duplicate)
  [1, 1, 2, 2, 3], write=1

read=2: nums[2]=2 ≠ nums[1]=1 → unique!
  nums[write] = nums[2] → [1, 2, 2, 2, 3]
  write=2

read=3: nums[3]=2 == nums[2]=2 → skip
  [1, 2, 2, 2, 3], write=2

read=4: nums[4]=3 ≠ nums[3]=2 → unique!
  nums[write] = nums[4] → [1, 2, 3, 2, 3]
  write=3

Final: [1, 2, 3, _, _] ← first 3 elements are unique
Return: 3
```

**Pointer Invariant:** `nums[0...write-1]` always contains unique elements in sorted order.

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle sorted array correctly
- ✅ Edge Cases: Empty array, single element, all duplicates
- ✅ Approach: Recognize in-place modification pattern

**Code Quality (25%)**:
- ✅ Readability: `write` and `read` are descriptive names
- ✅ Efficiency: Single pass vs nested loops

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n) time vs O(n²) brute force
- ✅ Space: O(1) - true in-place modification

**Communication (20%)**:
- ✅ Thought Process: "I initially thought pop(), but realized shifting is expensive"
- ✅ Explanation: "Using two pointers: one to read, one to write"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Fixing One Dimension

> 🔄 **When Single Pass Isn't Enough**: Finding pairs with two pointers is O(n). But finding *triplets* with three nested loops is O(n³). The insight: fix one element, then use two pointers on the rest → O(n²).

### [3Sum](https://leetcode.com/problems/3sum/) (Medium)

**Problem**: Find all unique triplets `[a, b, c]` where `a + b + c = 0`.

```python
nums = [-1, 0, 1, 2, -1, -4]  →  [[-1, -1, 2], [-1, 0, 1]]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: Two pointers on sorted array (Level 1)

**New Dimension**: Fix one variable, apply two pointers to remaining

**Progressive Insight**: 3-variable problem → 1 fixed + 2-variable subproblem

---

#### Your Next Natural Thought

"Find three numbers" → Three nested loops!

```python
for i in range(n):
    for j in range(i+1, n):
        for k in range(j+1, n):
            if nums[i] + nums[j] + nums[k] == 0:
                # found triplet
```

**Time**: O(n³) - checks all C(n,3) combinations

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Reduce Dimensions!</h4>
<p><strong>Old thinking</strong>: Three variables = three loops</p>
<p><strong>New thinking</strong>: Fix one variable → Two-variable subproblem!</p>
<p><strong>Connection</strong>: You already know how to solve Two Sum with two pointers!</p>
</div>

#### The Dimensionality Reduction

**Insight**: `a + b + c = 0` → For fixed `a`, find `b + c = -a` (Two Sum!)

**Why Sorting Enables This**:
1. **Sorted array** → Two pointers can intelligently move
2. **If sum too small** → Move left pointer right (increases sum)
3. **If sum too large** → Move right pointer left (decreases sum)
4. **Skip duplicates** → Sorting makes this trivial

**Transform**:
- O(n³) three-variable problem
- → O(n) * O(n²) one-variable * two-variable
- → O(n²) total

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force: O(n³)
def three_sum_brute(nums):
    result = []
    n = len(nums)

    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    triplet = sorted([nums[i], nums[j], nums[k]])
                    if triplet not in result:
                        result.append(triplet)

    return result

# Time: O(n³) - three nested loops
# Problem: Checks all combinations, inefficient duplicate handling
```

```python
# ✅ Optimized: O(n²)
def three_sum(nums):
    nums.sort()  # O(n log n)
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicate first elements
        if i > 0 and nums[i] == nums[i-1]:
            continue

        # Two Sum for target = -nums[i]
        left, right = i + 1, len(nums) - 1
        target = -nums[i]

        while left < right:
            current_sum = nums[left] + nums[right]

            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])

                # Skip duplicates for second and third elements
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1

                left += 1
                right -= 1
            elif current_sum < target:
                left += 1  # Need larger sum
            else:
                right -= 1  # Need smaller sum

    return result

# Time: O(n²) - n iterations * n two-pointer search
# Space: O(1) excluding output
# Key: Reduce 3-var to 1-fixed + 2-var
```

**Why Sorting Helps**:
```python
# Sorted: [-4, -1, -1, 0, 1, 2]
# Fix nums[1]=-1, find two numbers summing to 1
# left=2 (-1), right=5 (2): -1+2=1 ✓
# Pointers can move intelligently based on comparison!
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll fix first element, then solve Two Sum for remaining"
- ✅ Edge Cases: All negatives, all positives, duplicates in result
- ⭐ **Key Skill**: Problem decomposition (3-var → 1-var + 2-var)

**Communication (20%)**:
- ✅ Thought Process: "This is similar to Two Sum, but with one extra dimension"
- ✅ Explanation: "Sorting allows me to skip duplicates and move pointers intelligently"
- ⭐ **Key Skill**: Connecting to known patterns

**Time/Space (20%)**:
- ✅ Big-O: "Sorting is O(n log n), then O(n) outer * O(n) inner = O(n²)"
- ✅ Optimization: "Went from O(n³) brute force to O(n²)"
- ⭐ **Key Skill**: Recognizing when sorting enables optimization

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Directional Sliding

> 🔄 **When Pointers Move Same Direction**: Opposite-end pointers work for sorted arrays. But for *contiguous subarrays*, both pointers move right—expand to explore, shrink to satisfy constraints.

### [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (Medium)

**Problem**: Find length of longest substring without repeating characters.

```python
s = "abcabcbb"  →  3  (substring "abc")
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Levels 1 & 2

**What You Know**:
- Level 1: Two pointers at different speeds
- Level 2: Pointers move toward each other

**New Pattern**: What if pointers NEVER go backwards?
**New Problem Type**: Contiguous subarray (not pairs/triplets)

---

#### The Pattern Shift

**Previous Levels**: Pointers converge
```
    ←         →
[1, 2, 3, 4, 5]
```

**This Level**: Window slides right
```
[a, b, c, a, b, c]
 ↑     ↑           left=0, right=3, window="abca"
    ↑     ↑        left=1, right=4, window="bca" (shrunk!)
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Windows Can Slide!</h4>
<p><strong>Old pattern</strong>: Pointers meet in the middle</p>
<p><strong>New pattern</strong>: Window expands right, contracts left when invalid</p>
<p><strong>Key insight</strong>: For subarrays, we never need to move right pointer backwards!</p>
</div>

#### The Sliding Window Mental Model

**Think of it as a camera viewfinder**:
1. **Pan right** (expand): Include new character
2. **Adjust left edge** (contract): Remove violating character
3. **Track best frame** (max length): Remember best window seen

**Why This Works**:
- Right pointer scans each character once: O(n)
- Left pointer only moves forward (never back): O(n) total
- Each character processed at most twice: O(n)

**Invariant**: Window ALWAYS valid (no repeats)

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force: O(n²) or O(n³)
def longest_substring_brute(s):
    max_len = 0

    # Check all substrings
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break  # Found duplicate
            seen.add(s[j])
            max_len = max(max_len, j - i + 1)

    return max_len

# Time: O(n²) - nested loops, set operations are O(1)
# Problem: Rechecks many overlapping windows
```

```python
# ✅ Sliding Window: O(n)
def longest_substring_without_repeating(s):
    seen = {}  # char -> last seen index
    left = 0
    max_len = 0

    for right in range(len(s)):
        # If character seen AND within current window
        if s[right] in seen and seen[s[right]] >= left:
            left = seen[s[right]] + 1  # Shrink from left

        seen[s[right]] = right
        max_len = max(max_len, right - left + 1)

    return max_len

# Time: O(n) - each char visited at most twice
# Space: O(min(n, m)) where m = character set size
# Key: Window slides right, never backtracks
```

**Detailed Walkthrough**:
```python
s = "abcabcbb"

right=0: 'a' → seen={'a':0}, left=0, len=1
right=1: 'b' → seen={'a':0,'b':1}, left=0, len=2
right=2: 'c' → seen={'a':0,'b':1,'c':2}, left=0, len=3
right=3: 'a' seen at 0! → left=1, seen={'a':3,...}, len=3
right=4: 'b' seen at 1! → left=2, seen={'b':4,...}, len=3
right=5: 'c' seen at 2! → left=3, seen={'c':5,...}, len=3
right=6: 'b' seen at 4! → left=5, seen={'b':6,...}, len=2
right=7: 'b' seen at 6! → left=7, seen={'b':7,...}, len=1

Answer: 3 (window "abc")
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use sliding window to maintain valid substring"
- ✅ Correctness: Track character positions, handle duplicates
- ⭐ **Key Skill**: Pattern recognition (contiguous → sliding window)

**Communication (20%)**:
- ✅ Thought Process: "This is different from 3Sum - we need contiguous elements, not any pair"
- ✅ Explanation: "Window expands right always, shrinks left when constraint violated"
- ⭐ **Key Skill**: Articulating why different pattern needed

**Code Quality (25%)**:
- ✅ Efficiency: Using hashmap for O(1) char lookup
- ✅ Readability: `left`, `right`, `seen` are clear variable names
- ⭐ **Key Skill**: Choosing appropriate data structures

**Time/Space (20%)**:
- ✅ Analysis: "Each char visited at most twice, so O(n) despite nested structure"
- ⭐ **Key Skill**: Recognizing amortized O(n) despite while loop inside for loop

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Complex State Management

> 🔄 **When Simple Counters Aren't Enough**: Basic sliding window tracks one thing (sum, length). But what if you need to track *multiple character frequencies* and know when all requirements are satisfied? State management becomes critical.

### [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) (Hard)

**Problem**: Find minimum window in `s` containing all characters of `t`.

```python
s = "ADOBECODEBANC", t = "ABC"  →  "BANC"
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Sliding window (expand right, contract left)
**New Complexity**: How do you know when window is "valid"?
**Progressive Challenge**: Level 3 tracked ONE constraint (no duplicates). Level 4 tracks MULTIPLE constraints (character counts).

---

#### The Complexity Ladder

**Level 3**: Simple validity check
```python
if s[right] in seen:  # Boolean check
    # handle duplicate
```

**Level 4**: Complex validity tracking
```python
need = {'A': 1, 'B': 1, 'C': 1}  # Multiple requirements
missing = 3  # Track completeness
# Window valid when missing == 0
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: Track Completeness as State!</h4>
<p><strong>Level 3 complexity</strong>: Binary valid/invalid (yes/no)</p>
<p><strong>Level 4 complexity</strong>: Degree of completeness (how many chars still needed?)</p>
<p><strong>Key insight</strong>: Maintain a "missing count" that decrements/increments as window changes!</p>
</div>

#### The State Management Pattern

**Two-Part State**:
1. **`need` counter**: Tracks how many of each character we need
   - `need['A'] > 0` → still need more A's
   - `need['A'] = 0` → have enough A's
   - `need['A'] < 0` → have extra A's (OK!)

2. **`missing` count**: Total characters still needed for validity
   - `missing = 0` → window is valid
   - `missing > 0` → window incomplete

**Why This Works**:
- Instead of checking all characters each iteration (O(|t|))
- We maintain state that updates in O(1)
- `missing` gives instant validity check!

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force: O(|s|² · |t|)
def min_window_brute(s, t):
    from collections import Counter
    need = Counter(t)
    min_len = float('inf')
    result = ""

    # Check all substrings
    for i in range(len(s)):
        for j in range(i, len(s)):
            window = Counter(s[i:j+1])
            # Check if window contains all of t
            if all(window[c] >= need[c] for c in need):
                if j - i + 1 < min_len:
                    min_len = j - i + 1
                    result = s[i:j+1]

    return result

# Time: O(|s|² · |t|) - two loops * validity check
# Problem: Rechecks overlapping windows, inefficient
```

```python
# ✅ Sliding Window: O(|s| + |t|)
def min_window(s, t):
    from collections import Counter

    if not s or not t:
        return ""

    # Build character requirements
    need = Counter(t)
    missing = len(t)  # Total chars needed

    left = 0
    min_len = float('inf')
    min_start = 0

    for right in range(len(s)):
        # Expand: include s[right]
        if s[right] in need:
            if need[s[right]] > 0:
                missing -= 1  # Got a needed character!
            need[s[right]] -= 1

        # Contract: shrink while window is valid
        while missing == 0:  # Window is complete!
            # Update minimum
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_start = left

            # Try to shrink from left
            if s[left] in need:
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1  # Lost a needed character

            left += 1

    return "" if min_len == float('inf') else s[min_start:min_start + min_len]

# Time: O(|s| + |t|) - build counter + scan s once
# Space: O(|t|) - counter storage
# Key: Maintain validity state instead of rechecking
```

**State Tracking Example**:
```python
s = "ADOBECODEBANC", t = "ABC"
need = {'A':1, 'B':1, 'C':1}, missing = 3

right=0 'A': need['A']=0, missing=2
right=1 'D': not in need, skip
right=2 'O': skip
right=3 'B': need['B']=0, missing=1
right=4 'E': skip
right=5 'C': need['C']=0, missing=0 ← VALID!

Now shrink:
left=0 'A': need['A']=1, missing=1 ← INVALID!
Continue expanding...
Eventually find "BANC" as minimum.
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll track character counts and a 'missing' counter for validity"
- ✅ Correctness: Handle duplicates in `t`, characters not in `t`
- ⭐ **Key Skill**: Managing complex state efficiently

**Communication (20%)**:
- ✅ Explanation: "When we include a needed character, we decrement `missing`. When we remove one, we increment it"
- ✅ Collaboration: "Should I handle the case where `t` has duplicate characters?" (asks clarifying question)
- ⭐ **Key Skill**: Breaking down complex logic clearly

**Time/Space (20%)**:
- ✅ Big-O: "O(|s| + |t|) because we build the counter once, then scan `s` once"
- ✅ Space: "O(|t|) for the counter, O(1) for other variables"
- ⭐ **Key Skill**: Analyzing complex two-pointer problems

**Code Quality (25%)**:
- ✅ Efficiency: Maintaining state vs recalculating each iteration
- ✅ Best Practices: Using Counter for initial setup, clear variable names
- ⭐ **Key Skill**: Optimizing without sacrificing readability

</div>
</div>

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)** → Two pointers basics
2. **[Remove Element](https://leetcode.com/problems/remove-element/)** → Same pattern, slight variation
3. **[Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)** → Pointers from end (reverse iteration)

### 🟡 Medium - Core Patterns
4. **[3Sum](https://leetcode.com/problems/3sum/)** → Fix one + two pointers
5. **[Container With Most Water](https://leetcode.com/problems/container-with-most-water/)** → Greedy pointer movement
6. **[Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)** → Sliding window intro
7. **[3Sum Closest](https://leetcode.com/problems/3sum-closest/)** → 3Sum variant
8. **[Remove Nth Node From End](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)** → Fast-slow pointers
9. **[Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)** → Expand from center
10. **[Sort Colors](https://leetcode.com/problems/sort-colors/)** → Three pointers (Dutch flag)
11. **[4Sum](https://leetcode.com/problems/4sum/)** → Extend 3Sum logic

### 🔴 Hard - Advanced Mastery
12. **[Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)** → Two pointers with height tracking
13. **[Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)** → Complex sliding window
14. **[Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/)** → Advanced window management

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Remove Duplicates | Array basics | Two pointers at different speeds | Approach quality, Big-O |
| **2** | 3Sum | Level 1 | Reduce dimensions (fix one var) | Problem decomposition, optimization |
| **3** | Longest Substring | Level 1 | Directional sliding (window) | Pattern recognition, data structures |
| **4** | Minimum Window | Level 3 | Complex state management | State management, amortized analysis |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
