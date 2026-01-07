---
id: 07-backtracking
title: Backtracking / Combinatorics
order: 7
icon: GitBranchPlus
difficulty: Advanced
estimatedTime: 5-6 hours
description: Generate all valid combinations/permutations
summary: Master systematic exploration through 7 levels. From basic subsets and permutations to constraint satisfaction problems like N-Queens, Sudoku, and word puzzles.
keySignals:
  - All combinations
  - All permutations
  - Constraints
  - Valid configurations
  - Exhaustive search
algorithms:
  - Backtracking
  - Recursion
  - Pruning
levels:
  - name: Subsets Generation
    subtitle: Foundation - Power Set
  - name: Permutations
    subtitle: Order Matters
  - name: Combinations with Sum
    subtitle: Target-Based Selection
  - name: Constraint Satisfaction
    subtitle: N-Queens, Pruning
gradingDimensions:
  - name: Template Mastery
    weight: "30%"
    keyPoints:
      - point: Know the backtracking template
        explanation: "Base case (add result), loop through choices, make choice, recurse, undo choice. The template adapts to all backtracking problems with minor modifications."
      - point: Identify what constitutes a choice
        explanation: "For subsets: include or exclude element. For permutations: which unused element next. For N-Queens: which column in current row. Choices define the search tree."
      - point: Define when solution is complete
        explanation: "Subsets: any state is valid. Permutations: path length equals input. Combinations: current sum equals target. Base case determines what gets added to results."
  - name: Pruning Strategy
    weight: "25%"
    keyPoints:
      - point: Prune early when possible
        explanation: If current sum exceeds target, stop exploring. If remaining elements can't satisfy constraint, backtrack. Early pruning dramatically reduces search space.
      - point: Use sorted input strategically
        explanation: Sorting enables early termination (remaining elements too large), helps skip duplicates (adjacent equal elements), and produces lexicographic output.
      - point: Avoid duplicate combinations
        explanation: "Skip if current element equals previous AND previous wasn't used in this branch. For i > start and nums[i] == nums[i-1], skip. Prevents same combination via different paths."
  - name: State Tracking
    weight: "25%"
    keyPoints:
      - point: Track used elements correctly
        explanation: "For permutations: boolean array or set. Mark before recurse, unmark after. For combinations with reuse: don't track, just start from same index."
      - point: Manage the current path
        explanation: "Append before recursing, pop after returning. Path represents current exploration state. For strings: use string concatenation or list + join."
      - point: Clone before adding to results
        explanation: "Results store references, not copies. Use path[:] or list(path) to copy before appending to results. Common bug: all results point to same (empty) list."
  - name: Complexity Analysis
    weight: "20%"
    keyPoints:
      - point: Understand exponential nature
        explanation: "Subsets: O(2^n). Permutations: O(n!). These are inherent - we generate all possibilities. Pruning reduces constant factors but doesn't change Big-O."
      - point: Analyze time correctly
        explanation: "Time = number of nodes × work per node. For subsets: 2^n nodes × O(n) to copy path = O(n × 2^n). Include cost of copying solutions."
      - point: Consider space for recursion
        explanation: "Stack depth equals maximum path length (usually n). Space for results is output-dependent. Mention both recursion stack and output space."
questionTitles:
  - Subsets
  - Subsets II
  - Permutations
  - Permutations II
  - Combinations
  - Combination Sum
  - Combination Sum II
  - Combination Sum III
  - Letter Combinations of a Phone Number
  - Generate Parentheses
  - Palindrome Partitioning
  - Word Search
  - N-Queens
  - N-Queens II
  - Sudoku Solver
  - Restore IP Addresses
  - Partition to K Equal Sum Subsets
  - Word Break II
  - Expression Add Operators
  - Strobogrammatic Number II
---

# Backtracking / Combinatorics: Progressive Mastery Path

## Chapter Overview

Backtracking represents systematic brute force—exhaustively exploring possibility spaces through recursive decision-making. Unlike greedy algorithms that commit to choices, backtracking explores all paths by making choices, recursing deeper, then undoing choices (backtracking) to explore alternatives. This chapter masters the universal backtracking template and its adaptations.

**What You'll Master:**
- Master the backtracking template (choice → recurse → undo)
- Generate all subsets, permutations, and combinations
- Apply pruning to dramatically reduce search space
- Handle duplicate avoidance in combination problems
- Solve constraint satisfaction problems (N-Queens, Sudoku)
- Analyze exponential time complexity correctly

**The Backtracking Template:**
```python
def backtrack(path, choices):
    if is_complete(path):
        result.append(path[:])  # Clone!
    for choice in choices:
        make_choice(choice)
        backtrack(path, remaining_choices)
        undo_choice(choice)  # Backtrack
```

Backtracking is systematic brute force - explore all possibilities by making choices, recursing, and undoing choices (backtracking) to try alternatives. It's essential for combinatorial problems: subsets, permutations, combinations, and constraint satisfaction puzzles.

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | Subsets Generation | Include/exclude each element | Generate all subsets, power set | Subsets |
| **2** | Permutations | Track used elements | All orderings, arrangements | Permutations |
| **3** | Combinations with Sum | Early termination on target | Find combinations summing to K | Combination Sum |
| **4** | Constraint Satisfaction | Validate before placing | N-Queens, Sudoku, valid configs | N-Queens |

### Quick Decision Guide
- **"Generate all subsets"** → Level 1 (Include/Exclude)
- **"All arrangements/orderings"** → Level 2 (Used array)
- **"Combinations summing to target"** → Level 3 (Pruning on sum)
- **"Place items with constraints"** → Level 4 (Validate + Backtrack)

---

<div id="level-1"></div>

## Level 1: Foundation - Generate All Combinations

> 🎯 **Starting Point**: You need to generate *all* possibilities. Backtracking explores each choice, makes it, recurses, then *undoes* it to try other options. It's systematic trial and error.

### [Subsets](https://leetcode.com/problems/subsets/) (Medium)

**Problem**: Given array of unique integers, return all possible subsets (power set).

```python
nums = [1, 2, 3]
Output: [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know recursion

**New Concept**: Backtracking - make choice, explore, undo choice

**Why It's Foundational**: Introduces the choose-explore-unchoose pattern

---

#### Your Natural First Instinct

"Generate all subsets" → Try to enumerate them manually?

**Why This Doesn't Scale**:
```
For [1,2,3]: 2³ = 8 subsets, manageable
For [1,2,3,4,5]: 2⁵ = 32 subsets, tedious
For [1,2,...,10]: 2¹⁰ = 1024 subsets, impossible to code manually
```

**The Challenge**: Need systematic way to explore all combinations without missing or duplicating

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Each Element Has Two Choices - Include or Exclude!</h4>
<p><strong>Old thinking</strong>: Manually enumerate all possibilities</p>
<p><strong>New thinking</strong>: For each element, recursively explore both branches (include it, exclude it)</p>
</div>

#### The Backtracking Pattern

**Key Idea**: Build subsets incrementally
- At each position, decide: include this element or skip it
- Recurse to make decision for remaining elements
- Backtrack by removing last choice to try other options

**Template**:
```
backtrack(start, current_subset):
    add current_subset to results
    for each remaining element from start:
        add element to current_subset
        backtrack(next_position, current_subset)
        remove element from current_subset  ← BACKTRACK!
```

**Why This Works**: Explores all 2ⁿ combinations systematically

</div>

<div class="code-block-wrapper">

```python
# ❌ Manual Enumeration: Doesn't scale
def subsets_manual(nums):
    if len(nums) == 3:
        return [[], [nums[0]], [nums[1]], [nums[2]],
                [nums[0],nums[1]], [nums[0],nums[2]],
                [nums[1],nums[2]], [nums[0],nums[1],nums[2]]]
    # What about len(nums) == 4? 5? 10?
    # Code becomes impossible to maintain

# Problem: Can't handle arbitrary input size
```

```python
# ✅ Backtracking: O(2ⁿ × n)
def subsets(nums):
    result = []

    def backtrack(start, path):
        # Add current subset to result
        result.append(path[:])  # Copy path!

        # Explore including each remaining element
        for i in range(start, len(nums)):
            path.append(nums[i])        # Choose
            backtrack(i + 1, path)      # Explore
            path.pop()                  # Unchoose (backtrack)

    backtrack(0, [])
    return result

# Time: O(2ⁿ × n) - 2ⁿ subsets, each takes O(n) to copy
# Space: O(n) - recursion depth
# Key: Systematic exploration of all combinations
```

**Alternative: Include/Exclude Tree**:
```python
# ✅ Binary Tree Approach
def subsets_tree(nums):
    result = []

    def backtrack(index, path):
        if index == len(nums):
            result.append(path[:])
            return

        # Exclude nums[index]
        backtrack(index + 1, path)

        # Include nums[index]
        path.append(nums[index])
        backtrack(index + 1, path)
        path.pop()

    backtrack(0, [])
    return result

# Same complexity, different perspective
```

**Example Walkthrough**:
```python
nums = [1, 2, 3]

Backtracking tree:
                    []
        /                      \
      [1]                      []
    /     \                  /    \
 [1,2]   [1]              [2]     []
 /  \    /  \            /  \    /  \
[1,2,3] [1,2] [1,3] [1] [2,3] [2] [3] []

Result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Generate all 2ⁿ subsets, no duplicates
- ✅ Approach: Recognize backtracking pattern
- ✅ Edge Cases: Empty array, single element

**Code Quality (25%)**:
- ✅ Readability: Clear backtracking structure (choose-explore-unchoose)
- ✅ Efficiency: Proper path copying

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(2ⁿ × n) time, O(n) space for recursion
- ✅ Understanding: Output size dominates complexity

**Communication (20%)**:
- ✅ Thought Process: "Each element has two choices - include or exclude"
- ✅ Explanation: "Backtrack to explore other branches"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Permutations

> 🔄 **When Order Matters**: Subsets don't care about order ([1,2] = [2,1]). But permutations are *orderings*—each element used exactly once. Track "used" elements to avoid repeats.

### [Permutations](https://leetcode.com/problems/permutations/) (Medium)

**Problem**: Given array of distinct integers, return all possible permutations.

```python
nums = [1, 2, 3]
Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: Backtracking to explore choices

**New Dimension**: Order matters! Need to track which elements are used

**Progressive Insight**: Can't reuse elements - need to mark them as visited

---

#### Your Next Natural Thought

"Generate permutations" → Similar to subsets, just use all elements!

**Why This Needs More**:
```python
# Subsets: [1], [1,2], [2,1] are different but include same elements
# Permutations: [1,2,3] and [1,3,2] are DIFFERENT orderings
# Need to explore ALL orderings, not just combinations
```

**The Difference**:
- Subsets: 2ⁿ (include/exclude)
- Permutations: n! (all orderings)

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Fix One Position at a Time!</h4>
<p><strong>Old pattern</strong>: Include/exclude decisions (combinations)</p>
<p><strong>New pattern</strong>: Choose which element goes in current position (permutations)</p>
<p><strong>Key insight</strong>: Track used elements to avoid reusing!</p>
</div>

#### The Permutation Pattern

**Two Approaches**:

**1. Track Used Elements**:
- Maintain set of used indices
- At each position, try all unused elements
- Backtrack by removing from used set

**2. Swap Elements**:
- Fix position 0, permute rest
- Fix position 1, permute rest
- Use swapping to avoid extra space

**Why This Works**: Each position gets each element exactly once

</div>

<div class="code-block-wrapper">

```python
# ❌ Subsets Approach: Wrong for permutations!
def permutations_wrong(nums):
    result = []

    def backtrack(start, path):
        if len(path) == len(nums):
            result.append(path[:])
            return

        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)  # Bug: skips elements!
            path.pop()

    backtrack(0, [])
    return result

# Output for [1,2,3]: [[1,2,3]] only
# Problem: Can't revisit earlier elements for different positions
```

```python
# ✅ With Used Set: O(n! × n)
def permutations(nums):
    result = []

    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return

        for i in range(len(nums)):
            if i in used:
                continue  # Already used

            path.append(nums[i])
            used.add(i)
            backtrack(path, used)
            used.remove(i)  # Backtrack
            path.pop()

    backtrack([], set())
    return result

# Time: O(n! × n) - n! permutations, O(n) to copy each
# Space: O(n) - recursion depth + used set
# Key: Track which indices are used
```

```python
# ✅ Swap Approach: O(n! × n), more space efficient
def permutations_swap(nums):
    result = []

    def backtrack(first):
        if first == len(nums):
            result.append(nums[:])
            return

        for i in range(first, len(nums)):
            # Swap to fix nums[first]
            nums[first], nums[i] = nums[i], nums[first]
            backtrack(first + 1)
            # Backtrack: restore original order
            nums[first], nums[i] = nums[i], nums[first]

    backtrack(0)
    return result

# Time: O(n! × n)
# Space: O(n) - recursion only, no extra set
# Key: Swap to avoid tracking used elements
```

**Example Walkthrough**:
```python
nums = [1, 2, 3]

Used set approach:
Start: path=[], used={}

Try 1: path=[1], used={0}
  Try 2: path=[1,2], used={0,1}
    Try 3: path=[1,2,3], used={0,1,2} → save!
  Back to [1], try 3: path=[1,3], used={0,2}
    Try 2: path=[1,3,2], used={0,1,2} → save!

Try 2: path=[2], used={1}
  Try 1: path=[2,1], used={0,1}
    Try 3: path=[2,1,3], used={0,1,2} → save!
  Try 3: path=[2,3], used={1,2}
    Try 1: path=[2,3,1], used={0,1,2} → save!

... and so on

Result: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll track used elements to generate all orderings"
- ✅ Correctness: Generate all n! permutations
- ⭐ **Key Skill**: Understanding permutations vs combinations

**Communication (20%)**:
- ✅ Thought Process: "Order matters, so I need to try each element in each position"
- ✅ Explanation: "Track which elements are used to avoid duplicates"
- ⭐ **Key Skill**: Explaining difference from subsets

**Time/Space (20%)**:
- ✅ Big-O: "O(n!) permutations, each takes O(n) to build"
- ⭐ **Key Skill**: Understanding factorial complexity

**Code Quality (25%)**:
- ✅ Implementation: Clean used tracking or swapping
- ✅ Efficiency: Proper backtracking

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Constraint Satisfaction

> 🔄 **When Placements Have Rules**: Permutations just avoid reusing elements. N-Queens adds *constraints*—queens can't attack each other. Check validity *before* placing to prune impossible branches early.

### [N-Queens](https://leetcode.com/problems/n-queens/) (Hard)

**Problem**: Place n queens on n×n chessboard so no two queens attack each other.

```python
n = 4
Output: [
  [".Q..",
   "...Q",
   "Q...",
   "..Q."],
  ["..Q.",
   "Q...",
   "...Q",
   ".Q.."]
]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: Backtracking to explore choices

**New Complexity**: Constraints! Can't place queens that attack each other

**Progressive Challenge**: Prune invalid choices early (constraint checking)

---

#### The Pattern Shift

**Level 1**: All combinations (no constraints)
**Level 2**: All orderings (no reuse constraint)
**Level 3**: Valid configurations only (attack constraint)

**Key Difference**: Need to check validity before making choice

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Check Constraints Before Recursing!</h4>
<p><strong>Old pattern</strong>: Explore all possibilities, check validity at end</p>
<p><strong>New pattern</strong>: Prune invalid branches early - don't recurse if constraint violated!</p>
<p><strong>Key insight</strong>: Early pruning dramatically reduces search space!</p>
</div>

#### The Constraint Satisfaction Pattern

**N-Queens Constraints**:
- One queen per row (implicit - place one queen per row)
- One queen per column
- One queen per diagonal (/)
- One queen per anti-diagonal (\)

**Efficient Constraint Checking**:
- Use sets to track occupied columns and diagonals
- Diagonal: row - col (constant for each /)
- Anti-diagonal: row + col (constant for each \)

**Pruning**: Skip positions that violate any constraint

</div>

<div class="code-block-wrapper">

```python
# ❌ Generate All, Then Filter: O(n^n) - way too slow!
def solve_n_queens_brute(n):
    # Try all possible board configurations
    # Then filter out invalid ones
    # Exponentially slow! Most configurations are invalid
    pass

# Problem: Doesn't prune early, explores invalid branches
```

```python
# ✅ Backtracking with Pruning: O(n!)
def solve_n_queens(n):
    result = []
    board = [['.'] * n for _ in range(n)]

    # Track occupied columns and diagonals
    cols = set()
    diag1 = set()  # row - col
    diag2 = set()  # row + col

    def backtrack(row):
        if row == n:
            # Found valid solution
            result.append([''.join(r) for r in board])
            return

        for col in range(n):
            # Check all constraints
            if (col in cols or
                (row - col) in diag1 or
                (row + col) in diag2):
                continue  # Prune this branch!

            # Place queen
            board[row][col] = 'Q'
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)

            backtrack(row + 1)

            # Backtrack: remove queen
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    backtrack(0)
    return result

# Time: O(n!) - much better than O(n^n)
# Space: O(n²) - board + recursion
# Key: Early pruning via constraint checking
```

**Example Walkthrough**:
```python
n = 4

Row 0: Try col 0
  Place Q at (0,0), cols={0}, diag1={0}, diag2={0}

Row 1:
  col 0? blocked (col)
  col 1? blocked (diag1: 1-1=0)
  col 2? OK! Place Q at (1,2)
  cols={0,2}, diag1={0,-1}, diag2={0,3}

Row 2:
  col 0? blocked (col)
  col 1? blocked (diag2: 2+1=3)
  col 2? blocked (col)
  col 3? blocked (diag1: 2-3=-1)
  DEAD END! Backtrack to row 1

Row 1: Try col 3
  Place Q at (1,3)
  Continue...

This pruning saves massive amounts of work!
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use backtracking with early pruning via constraint sets"
- ✅ Correctness: Find all valid solutions
- ⭐ **Key Skill**: Efficient constraint checking

**Communication (20%)**:
- ✅ Thought Process: "Check constraints before placing queen to prune invalid branches"
- ✅ Explanation: "Use sets to track columns and diagonals in O(1)"
- ⭐ **Key Skill**: Explaining pruning benefits

**Time/Space (20%)**:
- ✅ Big-O: "O(n!) with pruning vs O(n^n) without"
- ⭐ **Key Skill**: Understanding impact of pruning

**Code Quality (25%)**:
- ✅ Implementation: Clean constraint checking
- ✅ Efficiency: Set-based lookups

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Combination Sum with Duplicates

> 🔄 **When Input Has Duplicates**: N-Queens handles distinct placements. But what if the input array has *duplicate* values? Sort first, then skip consecutive duplicates at the same decision level to avoid duplicate results.

### [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) (Medium)

**Problem**: Find all unique combinations that sum to target. Each number used at most once. Array may contain duplicates.

```python
candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6], [1,2,5], [1,7], [2,6]]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Backtracking with constraints

**New Complexity**: Handling duplicates in input! Need to avoid duplicate solutions

**Progressive Challenge**: Skip duplicate choices without missing valid combinations

---

#### The Complexity Ladder

**Level 1**: Generate all (no constraints)
**Level 2**: Track used (no reuse)
**Level 3**: Check validity (constraints)
**Level 4**: Handle duplicates (skip duplicate branches)

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: Sort First, Skip Duplicates at Same Level!</h4>
<p><strong>Old pattern</strong>: Try all choices, deduplicate results at end</p>
<p><strong>New pattern</strong>: Sort input, skip duplicate values at same recursion level</p>
<p><strong>Key insight</strong>: If we skip a value, skip all identical values at same level!</p>
</div>

#### The Duplicate Handling Pattern

**Strategy**:
1. **Sort** array first (brings duplicates together)
2. At each recursion level, **skip duplicate values**:
   - `if i > start and candidates[i] == candidates[i-1]: continue`
3. This prevents generating duplicate combinations

**Why Sorting Helps**:
```
Unsorted: [1, 2, 1] - hard to detect duplicates
Sorted: [1, 1, 2] - duplicates are adjacent!
```

**Why This Works**:
- At same recursion level, choosing duplicate values leads to same subtree
- Skip duplicates to avoid redundant exploration

</div>

<div class="code-block-wrapper">

```python
# ❌ Without Duplicate Handling: Duplicate solutions!
def combination_sum2_wrong(candidates, target):
    result = []

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i + 1, path, remaining - candidates[i])
            path.pop()

    backtrack(0, [], target)
    return result

# For [1,1,2], target=3:
# Gets [1,2] twice (from different 1s)
# Problem: Doesn't skip duplicate values
```

```python
# ✅ With Duplicate Skipping: O(2ⁿ)
def combination_sum2(candidates, target):
    candidates.sort()  # Sort to group duplicates!
    result = []

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i-1]:
                continue  # Skip this duplicate!

            path.append(candidates[i])
            backtrack(i + 1, path, remaining - candidates[i])
            path.pop()

    backtrack(0, [], target)
    return result

# Time: O(2ⁿ) - each element in/out
# Space: O(n) - recursion depth
# Key: Sort + skip duplicates at same level
```

**Example Walkthrough**:
```python
candidates = [10,1,2,7,6,1,5], target = 8
After sort: [1,1,2,5,6,7,10]

Recursion tree:
                    []
    /     /     |      \     \    \    \
  [1]   [1]   [2]    [5]   [6]  [7] [10]
        skip!  (dup at same level)

From [1]:
  Try [1,1] → remaining=6
    Try [1,1,6] → remaining=0 ✓ FOUND!
  Try [1,2] → remaining=5
    Try [1,2,5] → remaining=0 ✓ FOUND!
  Try [1,7] → remaining=0 ✓ FOUND!

From [2]:
  Try [2,6] → remaining=0 ✓ FOUND!

Result: [[1,1,6], [1,2,5], [1,7], [2,6]]
No duplicates!
```

**Why Skip Logic Works**:
```python
At same level: [1₁, 1₂, 2, 5, ...]
               ↑   ↑
If we already tried 1₁, trying 1₂ gives same subtree!
So: if i > start and arr[i] == arr[i-1]: skip!
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll sort first, then skip duplicates at same recursion level"
- ✅ Correctness: No duplicate solutions, find all valid combinations
- ⭐ **Key Skill**: Understanding duplicate handling

**Communication (20%)**:
- ✅ Thought Process: "Sorting groups duplicates so I can skip them"
- ✅ Explanation: "Skip duplicate values at same level to avoid duplicate solutions"
- ⭐ **Key Skill**: Explaining `i > start` check

**Time/Space (20%)**:
- ✅ Big-O: "O(n log n) for sort + O(2ⁿ) for backtracking"
- ⭐ **Key Skill**: Understanding pruning impact

**Code Quality (25%)**:
- ✅ Implementation: Clean duplicate skipping logic
- ✅ Efficiency: Early termination when remaining < 0

</div>
</div>

---

<div id="grading-success"></div>

## Grading Success Across Levels

**What Matters Most**: Interviewers grade backtracking on your ability to **identify the choice** at each step, **implement choose-explore-unchoose** correctly, and **prune invalid branches early** (not generate everything then filter).

**Common Pitfalls to Avoid**:
- ❌ Forgetting to backtrack (remove choice after exploring)
- ❌ Not copying paths/subsets when saving (stores references to mutating lists)
- ❌ Generating all possibilities then filtering (instead of pruning early)
- ❌ Not handling duplicates with sort + skip pattern

**Interview Success Formula**:
1. **Identify choices** → "At each position, I can choose from..."
2. **State the pattern** → "I'll choose, recurse, then unchoose (backtrack)"
3. **Explain pruning** → "I'll skip this branch early if [constraint violated]"
4. **Handle duplicates** → "Sort first, then skip duplicate values at same level"

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Subsets](https://leetcode.com/problems/subsets/)** → Basic backtracking (combinations)
2. **[Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/)** → Binary choices per character
3. **[Combinations](https://leetcode.com/problems/combinations/)** → Choose k from n

### 🟡 Medium - Core Patterns
4. **[Permutations](https://leetcode.com/problems/permutations/)** → Track used elements
5. **[Combination Sum](https://leetcode.com/problems/combination-sum/)** → Reusable elements
6. **[Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)** → Handle duplicates
7. **[Letter Combinations of Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)** → Multi-choice per position
8. **[Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)** → Substring backtracking
9. **[Word Search](https://leetcode.com/problems/word-search/)** → 2D grid backtracking

### 🔴 Hard - Advanced Mastery
10. **[N-Queens](https://leetcode.com/problems/n-queens/)** → Constraint satisfaction
11. **[Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)** → Complex constraints
12. **[Expression Add Operators](https://leetcode.com/problems/expression-add-operators/)** → Expression building

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Subsets | Basic recursion | Choose-explore-unchoose pattern | Systematic exploration |
| **2** | Permutations | Level 1 | Track used elements | Ordering vs combinations |
| **3** | N-Queens | Level 2 | Constraint checking with pruning | Early constraint validation |
| **4** | Combination Sum II | Level 3 | Handling duplicates via sorting | Duplicate elimination |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
