---
id: 01-search-lookup
title: Search / Lookup
order: 1
icon: Search
difficulty: Beginner
estimatedTime: 3-4 hours
description: Find element(s) matching a condition
summary: Master efficient search techniques from O(1) hash table lookups to O(log n) binary search. Learn to recognize when sorted data enables optimization and how to trade space for time. Progress through 6 levels from basic hash lookups to advanced 2D search and answer-space binary search.
keySignals:
  - Sorted data
  - Repeated lookups
  - Range queries
  - Monotonic function
  - Search space reduction
algorithms:
  - Binary Search
  - Hash Table
  - Binary Search on Answer
levels:
  - name: Hash Table Complement
    subtitle: Foundation - O(1) Lookup
  - name: Binary Search Basics
    subtitle: Sorted Array Search
  - name: Boundary Binary Search
    subtitle: Find First/Last Position
  - name: Search in Rotated Array
    subtitle: Modified Binary Search
  - name: Binary Search on 2D Matrix
    subtitle: Multi-Dimensional Search
  - name: Binary Search on Answer
    subtitle: Search the Solution Space
gradingDimensions:
  - name: Pattern Recognition
    weight: "30%"
    keyPoints:
      - point: Identify O(1) lookup opportunities
        explanation: Recognize when you need to check if an element exists or find a complement. If you're doing repeated searches, consider hash tables.
      - point: Recognize sorted data → binary search
        explanation: Sorted arrays enable O(log n) search. Look for keywords like "sorted", "ordered", or when you can sort without breaking the problem.
      - point: Spot complement/pair patterns
        explanation: Problems asking for pairs summing to target, or finding elements with specific relationships, often benefit from hash-based lookups.
  - name: Space-Time Tradeoff
    weight: "25%"
    keyPoints:
      - point: "Hash table: O(n) space for O(1) lookup"
        explanation: Trading linear space to reduce time complexity from O(n²) to O(n). Essential when you need instant lookup across iterations.
      - point: "Binary search: O(1) space for O(log n) time"
        explanation: When data is sorted, no extra space needed. Logarithmic time is acceptable for single searches on large datasets.
      - point: Explain when to use each
        explanation: Hash table for multiple lookups, binary search for one-time searches on sorted data, or when space is constrained.
  - name: Implementation Quality
    weight: "25%"
    keyPoints:
      - point: Correct binary search bounds
        explanation: Use mid = left + (right - left) // 2 to avoid overflow. Handle inclusive/exclusive ranges consistently. Watch for off-by-one errors.
      - point: Handle edge cases (empty, not found)
        explanation: Check for empty arrays, single elements, targets outside range. Return appropriate values (-1, None, default) when not found.
      - point: Clean hash table logic
        explanation: Check existence before access, handle duplicates correctly, use appropriate data structures (dict vs set).
  - name: Communication
    weight: "20%"
    keyPoints:
      - point: Explain algorithm choice
        explanation: Start with "I notice the data is sorted, so binary search..." or "We need O(1) lookup, so I'll use a hash table..."
      - point: Walk through examples
        explanation: Use small concrete examples (e.g., [1,2,3,4], target=5) to demonstrate your logic before coding.
      - point: Analyze complexity clearly
        explanation: "Break down time and space: One pass O(n), hash operations O(1), total O(n) time, O(n) space for hash table."
questionTitles:
  - Two Sum
  - Search in Rotated Sorted Array
  - Find First and Last Position of Element in Sorted Array
  - Find Peak Element
  - Search Insert Position
  - Search a 2D Matrix
  - Search a 2D Matrix II
  - Median of Two Sorted Arrays
  - Koko Eating Bananas
  - Capacity To Ship Packages Within D Days
  - Split Array Largest Sum
  - Find Minimum in Rotated Sorted Array
  - Single Element in a Sorted Array
---

# Search / Lookup: Progressive Mastery Path

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts while adding ONE new dimension of complexity. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | Hash Table Complement | O(1) lookup with hash map | Need to find pairs/complements, repeated lookups | Two Sum |
| **2** | Binary Search Basics | O(log n) on sorted data | Array is sorted, find exact position | Search Insert Position |
| **3** | Boundary Binary Search | Find first/last occurrence | Multiple duplicates, need boundaries | Find First and Last Position |
| **4** | Search in Rotated Array | One half always sorted | Rotated sorted array, pivot unknown | Search in Rotated Sorted Array |
| **5** | Binary Search on 2D Matrix | Treat as 1D or staircase | Sorted matrix, row/column ordered | Search a 2D Matrix |
| **6** | Binary Search on Answer | Search solution space | "Minimum X such that condition" | Koko Eating Bananas |

### Quick Decision Guide
- **"Find if element exists"** → Level 1 (Hash) or Level 2 (Binary Search)
- **"Find first/last position"** → Level 3 (Boundary Search)
- **"Rotated or partially sorted"** → Level 4 (Modified Binary Search)
- **"2D matrix search"** → Level 5 (Matrix Binary Search)
- **"Minimize/maximize some value"** → Level 6 (Binary Search on Answer)

---

<div id="level-1"></div>

## Level 1: Foundation - Hash Table Complement

> 🎯 **Starting Point**: You know how to iterate through arrays and check conditions. Now learn how to turn O(n²) pair-finding into O(n) with hash tables.

### [Two Sum](https://leetcode.com/problems/two-sum/) (Easy)

**Problem**: Given array `nums` and `target`, return indices of two numbers that sum to `target`.

```python
nums = [2, 7, 11, 15], target = 9  →  [0, 1] (2 + 7 = 9)
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know how to iterate through arrays

**New Concept**: Trading space for time with hash tables

**Why It's Foundational**: Teaches O(1) lookup vs O(n) search

---

#### Your Natural First Instinct

"Find two numbers" → Check every pair!

**Why This Breaks**:
```
For each element, scan rest of array for complement
Outer loop: O(n) × Inner loop: O(n) = O(n²)
```

**The Hidden Cost**:
- For nums[0], check nums[1], nums[2], ..., nums[n-1]
- For nums[1], check nums[2], nums[3], ..., nums[n-1]
- Total: n(n-1)/2 comparisons → O(n²)

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Hash Table = O(1) Lookup!</h4>
<p><strong>Old thinking</strong>: Search linearly for complement (expensive)</p>
<p><strong>New thinking</strong>: Store seen numbers → instant complement check (cheap)</p>
</div>

#### The Hash Table Insight

Instead of searching (O(n)), **remember what you've seen**:

**Key Idea**:
- For each number, check if `target - number` was seen before
- If yes → found pair!
- If no → store current number for future lookups

**Why Hash Table**:
- Insert: O(1)
- Lookup: O(1)
- Total: O(n) single pass

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force: O(n²) time
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

# Time: O(n²) - nested loops
# Space: O(1)
# Problem: Checks every pair
```

```python
# ✅ Hash Table: O(n) time
def two_sum(nums, target):
    seen = {}  # num -> index

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []

# Time: O(n) - single pass
# Space: O(n) - hash table
# Key: O(1) lookup vs O(n) search
```

**Example Walkthrough**:
```python
nums = [2, 7, 11, 15], target = 9

i=0, num=2: complement=7, seen={}, add seen[2]=0
i=1, num=7: complement=2, seen={2:0} ← FOUND! Return [0,1]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle basic cases correctly
- ✅ Edge Cases: Empty array, no solution, duplicate numbers
- ✅ Approach: Recognize complement pattern

**Code Quality (25%)**:
- ✅ Readability: Clear variable names (`seen`, `complement`)
- ✅ Efficiency: Single pass vs nested loops

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n) time vs O(n²) brute force
- ✅ Space Trade-off: O(n) space for O(n) time improvement

**Communication (20%)**:
- ✅ Thought Process: "I'll store seen numbers to check complements in O(1)"
- ✅ Explanation: "Hash table gives instant lookup vs linear search"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Binary Search on Sorted Data

> 🔄 **When Hash Tables Aren't Enough**: Hash tables give O(1) lookup but require O(n) space. When data is **sorted**, binary search achieves O(log n) with O(1) space—no extra memory needed!

### [Search Insert Position](https://leetcode.com/problems/search-insert-position/) (Easy)

**Problem**: Given sorted array and target, return index if found, or where it would be inserted.

```python
nums = [1, 3, 5, 6], target = 5  →  2
nums = [1, 3, 5, 6], target = 2  →  1  (insert at index 1)
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: Linear search is O(n)

**New Dimension**: Sorted data enables divide-and-conquer

**Progressive Insight**: Don't check every element—eliminate half each step

---

#### Your Next Natural Thought

"Search array" → Scan left to right!

```python
for i in range(len(nums)):
    if nums[i] >= target:
        return i
return len(nums)
```

**Time**: O(n) - checks every element

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Sorted = Binary Search!</h4>
<p><strong>Old thinking</strong>: Check every element (O(n))</p>
<p><strong>New thinking</strong>: Eliminate half with each comparison (O(log n))</p>
<p><strong>Key insight</strong>: Sorted data has structure we can exploit!</p>
</div>

#### The Binary Search Insight

**Sorted Property**: If `nums[mid] < target`, answer must be in right half

**Intuition**: Like finding a word in dictionary
- Open to middle
- If word is alphabetically after middle → right half
- If word is before middle → left half
- Repeat until found

**Why This Works**:
- Start with range [0, n-1]
- Each comparison cuts search space in half
- log₂(n) steps to find answer

</div>

<div class="code-block-wrapper">

```python
# ❌ Linear Search: O(n)
def search_insert_linear(nums, target):
    for i in range(len(nums)):
        if nums[i] >= target:
            return i
    return len(nums)

# Time: O(n) - checks every element
# Problem: Doesn't use sorted property
```

```python
# ✅ Binary Search: O(log n)
def search_insert(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half

    # If not found, left is insert position
    return left

# Time: O(log n) - halves search space each step
# Space: O(1) - only pointers
# Key: Exploits sorted property
```

**Example Walkthrough**:
```python
nums = [1, 3, 5, 6], target = 5

left=0, right=3, mid=1: nums[1]=3 < 5 → left=2
left=2, right=3, mid=2: nums[2]=5 == 5 → FOUND! Return 2
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use binary search since array is sorted"
- ✅ Correctness: Handle found/not found cases, insert position
- ⭐ **Key Skill**: Recognizing when sorted data enables optimization

**Communication (20%)**:
- ✅ Thought Process: "Sorted data means I can eliminate half each step"
- ✅ Explanation: "Mid-point comparison tells me which half has answer"
- ⭐ **Key Skill**: Articulating why binary search applies

**Time/Space (20%)**:
- ✅ Big-O: "O(log n) because I halve search space each iteration"
- ✅ Optimization: "Went from O(n) linear to O(log n) binary"
- ⭐ **Key Skill**: Understanding logarithmic complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct mid calculation, loop termination
- ✅ Edge Cases: Empty array, target smaller/larger than all elements

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Two-Pointer Binary Search

> 🔄 **When Basic Binary Search Falls Short**: Standard binary search finds *any* occurrence. But what if you need the *first* or *last* occurrence? You need to keep searching even after finding the target.

### [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) (Medium)

**Problem**: Find starting and ending position of target in sorted array.

```python
nums = [5, 7, 7, 8, 8, 10], target = 8  →  [3, 4]
nums = [5, 7, 7, 8, 8, 10], target = 6  →  [-1, -1]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: Binary search finds one occurrence

**New Complexity**: What if target appears multiple times?

**Progressive Challenge**: Find boundaries, not just any occurrence

---

#### The Pattern Shift

**Level 2**: Find any occurrence
**Level 3**: Find first AND last occurrence

**Naive Approach**: Find one, then expand left/right
```python
# Find target, then scan left/right for boundaries
# Worst case: All elements are target → O(n)
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Run Binary Search Twice!</h4>
<p><strong>Old pattern</strong>: One binary search finds any occurrence</p>
<p><strong>New pattern</strong>: Two searches—one for leftmost, one for rightmost</p>
<p><strong>Key insight</strong>: Modify binary search to find boundaries!</p>
</div>

#### The Boundary Search Pattern

**Two Variants**:
1. **Find Left Boundary**: When `nums[mid] == target`, keep searching left
2. **Find Right Boundary**: When `nums[mid] == target`, keep searching right

**Why Two Searches**:
- Each runs in O(log n)
- Total: O(log n) + O(log n) = O(log n)
- Better than expanding from one found element: O(n)

</div>

<div class="code-block-wrapper">

```python
# ❌ Find then expand: O(n) worst case
def search_range_naive(nums, target):
    # Binary search to find any occurrence
    idx = binary_search(nums, target)
    if idx == -1:
        return [-1, -1]

    # Expand left and right
    left = right = idx
    while left > 0 and nums[left-1] == target:
        left -= 1
    while right < len(nums)-1 and nums[right+1] == target:
        right += 1

    return [left, right]

# Worst case: All elements are target → O(n)
```

```python
# ✅ Two binary searches: O(log n)
def search_range(nums, target):
    def find_left():
        left, right = 0, len(nums) - 1
        result = -1

        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                result = mid
                right = mid - 1  # Keep searching left!
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return result

    def find_right():
        left, right = 0, len(nums) - 1
        result = -1

        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                result = mid
                left = mid + 1  # Keep searching right!
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return result

    left_pos = find_left()
    if left_pos == -1:
        return [-1, -1]

    right_pos = find_right()
    return [left_pos, right_pos]

# Time: O(log n) - two binary searches
# Space: O(1)
# Key: Modified binary search for boundaries
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll run binary search twice—once for left, once for right boundary"
- ✅ Correctness: Handle no occurrence, single occurrence, all same
- ⭐ **Key Skill**: Modifying standard algorithms for new requirements

**Communication (20%)**:
- ✅ Thought Process: "Finding one occurrence then expanding could be O(n)"
- ✅ Explanation: "Two binary searches keep it O(log n)"
- ⭐ **Key Skill**: Explaining why naive approach fails

**Code Quality (25%)**:
- ✅ Implementation: Correct boundary search logic
- ✅ Efficiency: No unnecessary work

**Time/Space (20%)**:
- ✅ Analysis: "Two O(log n) searches = O(log n) total"
- ⭐ **Key Skill**: Understanding constant factors don't affect Big-O

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Search in Rotated Array

> 🔄 **When Sorted Data Gets Disrupted**: Binary search assumes fully sorted arrays. But rotated arrays break that assumption—half is still sorted! The key insight: identify *which* half is sorted and use that to decide where to search.

### [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) (Medium)

**Problem**: Search for target in sorted array that has been rotated.

```python
nums = [4, 5, 6, 7, 0, 1, 2], target = 0  →  4
nums = [4, 5, 6, 7, 0, 1, 2], target = 3  →  -1
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Binary search on sorted array

**New Complexity**: Array is rotated—not fully sorted!

**Progressive Challenge**: One half is always sorted—exploit this

---

#### The Complexity Ladder

**Level 2**: Fully sorted `[1, 3, 5, 7, 9]`
**Level 4**: Rotated sorted `[5, 7, 9, 1, 3]`

**Problem**: Can't tell which half has target just from mid comparison

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: One Half is Always Sorted!</h4>
<p><strong>Key insight</strong>: After rotation, one half must be in order</p>
<p><strong>Strategy</strong>: Identify sorted half, check if target is there, else search other half</p>
</div>

#### The Rotated Binary Search Pattern

**Observation**: `[4,5,6,7,0,1,2]` has two sorted portions
- Left sorted: `[4,5,6,7]`
- Right sorted: `[0,1,2]`

**Algorithm**:
1. Find mid
2. Determine which half is sorted (compare `nums[left]` vs `nums[mid]`)
3. Check if target is in sorted half's range
4. If yes → search that half
5. If no → search other half

</div>

<div class="code-block-wrapper">

```python
# ❌ Linear Search: O(n)
def search_rotated_linear(nums, target):
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1

# Time: O(n)
# Problem: Doesn't exploit partial sorting
```

```python
# ✅ Modified Binary Search: O(log n)
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Determine which half is sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            # Check if target is in sorted left half
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half is sorted
            # Check if target is in sorted right half
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1

# Time: O(log n) - still binary search
# Space: O(1)
# Key: Identify sorted half, use range check
```

**Example Walkthrough**:
```python
nums = [4, 5, 6, 7, 0, 1, 2], target = 0

left=0, right=6, mid=3:
  nums[3]=7, nums[0]=4 ≤ nums[3] → left half sorted [4,5,6,7]
  target=0 not in [4,7] → search right half
  left=4

left=4, right=6, mid=5:
  nums[5]=1, nums[4]=0 > nums[5] → right half sorted [1,2]
  target=0 not in [1,2] → search left half
  right=4

left=4, right=4, mid=4:
  nums[4]=0 == target → FOUND! Return 4
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll identify the sorted half and check if target is there"
- ✅ Correctness: Handle rotation point, no rotation, target not found
- ⭐ **Key Skill**: Adapting algorithms to constraints

**Communication (20%)**:
- ✅ Thought Process: "Rotation breaks full sorting, but one half is always sorted"
- ✅ Explanation: "Range check determines which half to search"
- ⭐ **Key Skill**: Breaking down complex logic clearly

**Time/Space (20%)**:
- ✅ Big-O: "Still O(log n) because we eliminate half each step"
- ⭐ **Key Skill**: Understanding variant maintains complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct sorted-half identification
- ✅ Edge Cases: No rotation, rotation at different points

</div>
</div>

---

<div id="level-5"></div>

## Level 5: Binary Search on 2D Matrix

> 🔄 **When Data is Multi-Dimensional**: 1D binary search is powerful, but matrices add complexity. The insight: treat a sorted 2D matrix as a flattened 1D array, or use the "staircase" approach from top-right corner.

### [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) (Medium)

**Problem**: Search for target in m×n matrix where each row is sorted and first element of each row > last element of previous row.

```python
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3  →  True
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13  →  False
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 4

**What You Know**: Binary search on 1D arrays with modifications

**New Complexity**: 2D structure—but it's actually 1D in disguise!

**Progressive Challenge**: Map 2D coordinates to 1D index

---

#### The Pattern Shift

**Level 4**: Modified binary search on rotated 1D array
**Level 5**: Binary search on 2D matrix (treat as flattened 1D)

**Key Insight**: Matrix is essentially a sorted 1D array wrapped into rows

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #5: 2D Matrix = Flattened 1D Array!</h4>
<p><strong>Old thinking</strong>: Search row by row O(m × n)</p>
<p><strong>New thinking</strong>: Treat as single sorted array O(log(m × n))</p>
<p><strong>Key formula</strong>: index → row = index // cols, col = index % cols</p>
</div>

#### The 2D to 1D Mapping

**Given**: m×n matrix with total `m*n` elements
**Virtual 1D array**: indices 0 to m*n-1

**Conversion**:
- `row = mid // n` (which row)
- `col = mid % n` (which column)

</div>

<div class="code-block-wrapper">

```python
# ✅ Treat as 1D array: O(log(m*n))
def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = (left + right) // 2
        # Convert 1D index to 2D coordinates
        row, col = mid // n, mid % n
        val = matrix[row][col]
        
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False

# Time: O(log(m*n)) - binary search on virtual 1D
# Space: O(1)
# Key: 2D → 1D index mapping
```

**Example Walkthrough**:
```python
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
m=3, n=4, total=12

left=0, right=11, mid=5: row=5//4=1, col=5%4=1 → matrix[1][1]=11 > 3 → right=4
left=0, right=4, mid=2: row=2//4=0, col=2%4=2 → matrix[0][2]=5 > 3 → right=1
left=0, right=1, mid=0: row=0//4=0, col=0%4=0 → matrix[0][0]=1 < 3 → left=1
left=1, right=1, mid=1: row=1//4=0, col=1%4=1 → matrix[0][1]=3 == 3 → FOUND!
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll treat the matrix as a flattened sorted array"
- ✅ Correctness: Handle empty matrix, single element
- ⭐ **Key Skill**: Dimensional transformation insight

**Communication (20%)**:
- ✅ Thought Process: "Since rows are continuous, this is really a 1D problem"
- ✅ Explanation: "I map mid index to row/col using division and modulo"

**Time/Space (20%)**:
- ✅ Big-O: "O(log(m×n)) for binary search on m×n elements"
- ⭐ **Key Skill**: Recognizing combined dimensions

**Code Quality (25%)**:
- ✅ Implementation: Correct index conversion formula
- ✅ Edge Cases: Empty matrix, single row/column

</div>
</div>

---

<div id="level-6"></div>

## Level 6: Binary Search on Answer

> 🔄 **When You're Not Searching Data, But Solutions**: Sometimes the answer itself lies in a range (e.g., "minimum speed to finish in time"). Instead of searching an array, binary search the *solution space* and validate each candidate.

### [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (Medium)

**Problem**: Koko can eat `k` bananas/hour. Given piles and `h` hours, find minimum `k` to finish all bananas.

```python
piles = [3,6,7,11], h = 8  →  4
# At speed 4: ceil(3/4)=1 + ceil(6/4)=2 + ceil(7/4)=2 + ceil(11/4)=3 = 8 hours ✓
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 5

**What You Know**: Binary search on explicit arrays

**New Complexity**: No array! Search an implicit range of possible answers

**Progressive Challenge**: Binary search on the SOLUTION SPACE

---

#### The Paradigm Shift

**Previous Levels**: Search for element in given array
**Level 6**: Search for optimal value in range of possibilities

**Key Pattern**: "Find minimum X such that condition(X) is true"

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #6: Binary Search the Answer!</h4>
<p><strong>Old thinking</strong>: Binary search needs an array to search</p>
<p><strong>New thinking</strong>: Binary search on any MONOTONIC function!</p>
<p><strong>Key insight</strong>: If speed k works, all speeds > k also work (monotonic!)</p>
</div>

#### The Binary Search on Answer Pattern

**When to Use**:
- "Find minimum/maximum X such that..."
- There's a monotonic property (if X works, X+1 also works, or vice versa)
- Can verify if a candidate answer works in O(n) or O(n log n)

**Template**:
1. Define search range: [minimum possible, maximum possible]
2. Binary search for the boundary
3. For each mid, check if it satisfies the condition

</div>

<div class="code-block-wrapper">

```python
# ✅ Binary Search on Answer: O(n log m)
def min_eating_speed(piles, h):
    def can_finish(speed):
        # Calculate hours needed at this speed
        hours = 0
        for pile in piles:
            hours += (pile + speed - 1) // speed  # Ceiling division
        return hours <= h
    
    # Search range: 1 to max(piles)
    left, right = 1, max(piles)
    
    while left < right:
        mid = (left + right) // 2
        
        if can_finish(mid):
            right = mid  # Try smaller speed
        else:
            left = mid + 1  # Need faster speed
    
    return left

# Time: O(n log m) where n=piles, m=max(piles)
# Space: O(1)
# Key: Binary search on answer space, not array
```

```python
# Similar Pattern: Capacity to Ship Packages
def ship_within_days(weights, days):
    def can_ship(capacity):
        day_count, current_load = 1, 0
        for w in weights:
            if current_load + w > capacity:
                day_count += 1
                current_load = w
            else:
                current_load += w
        return day_count <= days
    
    left, right = max(weights), sum(weights)
    
    while left < right:
        mid = (left + right) // 2
        if can_ship(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

**Example Walkthrough**:
```python
piles = [3,6,7,11], h = 8

Search range: [1, 11]

left=1, right=11, mid=6: can_finish(6)? 1+1+2+2=6 ≤ 8 ✓ → right=6
left=1, right=6, mid=3: can_finish(3)? 1+2+3+4=10 > 8 ✗ → left=4
left=4, right=6, mid=5: can_finish(5)? 1+2+2+3=8 ≤ 8 ✓ → right=5
left=4, right=5, mid=4: can_finish(4)? 1+2+2+3=8 ≤ 8 ✓ → right=4
left=4, right=4: Return 4
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll binary search on the answer space"
- ✅ Correctness: Handle edge cases, correct boundary conditions
- ⭐ **Key Skill**: Recognizing "binary search on answer" pattern

**Communication (20%)**:
- ✅ Thought Process: "The answer has monotonic property—if k works, k+1 works too"
- ✅ Explanation: "I binary search for the minimum k that satisfies the constraint"

**Time/Space (20%)**:
- ✅ Big-O: "O(n log m) - log m for binary search, n for each verification"
- ⭐ **Key Skill**: Analyzing nested complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct helper function, boundary handling
- ✅ Edge Cases: Single pile, h equals number of piles

</div>
</div>

---

<div id="practice-progression"></div>

## Complete Practice Progression

Practice problems organized by difficulty. Each problem links to LeetCode and includes a brief description of the technique used.

<div class="practice-grid">

### 🟢 Easy - Build Foundation

| Problem | Level | Technique | Why Practice This |
|---------|-------|-----------|-------------------|
| [Two Sum](https://leetcode.com/problems/two-sum/) | L1 | Hash Table | Foundation: O(1) complement lookup |
| [Search Insert Position](https://leetcode.com/problems/search-insert-position/) | L2 | Binary Search | Learn basic binary search template |
| [Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/) | L2 | Binary Search | Practice with math-based search |

### 🟡 Medium - Core Patterns

| Problem | Level | Technique | Why Practice This |
|---------|-------|-----------|-------------------|
| [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | L3 | Boundary BS | Master left/right boundary search |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | L4 | Modified BS | Handle partially sorted arrays |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | L4 | Modified BS | Find pivot in rotated arrays |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | L5 | 2D Binary Search | Flatten 2D to 1D conceptually |
| [Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/) | L5 | Staircase | Row/column elimination technique |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | L6 | BS on Answer | Classic "search the solution space" |
| [Capacity To Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | L6 | BS on Answer | Greedy feasibility check |

### 🔴 Hard - Advanced Mastery

| Problem | Level | Technique | Why Practice This |
|---------|-------|-----------|-------------------|
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | L6+ | Partition BS | Interview classic, O(log(min(m,n))) |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | L6 | BS + Greedy | Binary search on max sum |
| [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/) | L6+ | BS + Counting | Advanced counting with BS |

</div>

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Two Sum | Array basics | Hash table O(1) lookup | Space-time trade-off |
| **2** | Search Insert Position | Level 1 | Binary search on sorted data | Recognizing sorted property |
| **3** | Find First and Last | Level 2 | Boundary binary search | Algorithm modification |
| **4** | Search Rotated Array | Level 3 | Partial sorting exploitation | Adaptive binary search |
| **5** | Search a 2D Matrix | Level 4 | 2D to 1D index mapping | Dimensional transformation |
| **6** | Koko Eating Bananas | Level 5 | Binary search on answer space | Monotonic function recognition |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
