---
id: 04-dynamic-programming
title: Dynamic Programming
order: 4
icon: Layers
difficulty: Advanced
estimatedTime: 8-10 hours
description: Optimal value with overlapping subproblems
summary: Conquer the most challenging interview category with 8 progressive levels. Master 1D arrays, decision DP, knapsack variants, 2D grids, string DP, interval DP, state machine DP, and bitmask DP. Learn to identify patterns, derive recurrence relations, and optimize space.
keySignals:
  - Optimal substructure
  - Overlapping subproblems
  - Count ways
  - Minimize/Maximize
  - Subsequence/Substring
algorithms:
  - Dynamic Programming
  - Memoization
  - Tabulation
levels:
  - name: 1D Linear DP
    subtitle: Foundation - Fibonacci Pattern
  - name: Decision DP
    subtitle: Take or Skip Choices
  - name: Unbounded Knapsack
    subtitle: Unlimited Item Usage
  - name: 2D Grid DP
    subtitle: Path & String Problems
gradingDimensions:
  - name: Recurrence Relation
    weight: "35%"
    keyPoints:
      - point: Define correct DP state
        explanation: What does dp[i] or dp[i][j] represent? State must capture all information needed to make optimal decisions. Common states include position, remaining capacity, and previous choice.
      - point: Derive recurrence formula
        explanation: Express dp[i] in terms of smaller subproblems. For each state, consider all possible last actions (take/skip, which item, which direction). Formula encodes problem structure.
      - point: Identify base cases
        explanation: Smallest subproblems with known answers such as dp[0], dp[1], empty string, single element. Base cases anchor the recursion and must be set before filling the table.
  - name: Subproblem Recognition
    weight: "25%"
    keyPoints:
      - point: Spot overlapping subproblems
        explanation: Draw recursion tree - if same parameters appear multiple times, DP applies. Fibonacci fib(3) called twice. Without memoization exponential; with memoization polynomial.
      - point: Recognize optimal substructure
        explanation: Optimal solution contains optimal solutions to subproblems. Shortest path from A to C through B uses shortest A to B and shortest B to C. Greedy choice must be proven safe.
      - point: Choose top-down vs bottom-up
        explanation: Top-down (memoization) uses natural recursion, only computes needed states. Bottom-up (tabulation) is iterative with better cache performance and easier space optimization. Start top-down, optimize bottom-up.
  - name: Space Optimization
    weight: "20%"
    keyPoints:
      - point: Reduce 2D to 1D when possible
        explanation: If dp[i] only depends on dp[i-1], keep only previous row. Process in correct order (sometimes right-to-left to avoid overwriting needed values).
      - point: Understand rolling array technique
        explanation: Use dp[i % 2] for alternating rows, or just prev/curr variables. Reduces O(n×m) space to O(m) or even O(1) for simple recurrences like Fibonacci.
      - point: Balance clarity vs optimization
        explanation: Start with full table for correctness, then optimize. In interviews, mention optimization possibility but implement simpler version first unless space is critical.
  - name: Problem Solving
    weight: "20%"
    keyPoints:
      - point: Start with brute force recursion
        explanation: Write naive recursive solution first. This reveals the recurrence relation naturally. Then identify repeated computations to add memoization.
      - point: Add memoization systematically
        explanation: Add cache (dict or array) to store computed results. Check cache before computing, store result before returning. Transforms exponential to polynomial.
      - point: Explain DP progression
        explanation: "\"I'll start with recursion, identify overlapping subproblems, add memoization, then consider bottom-up for optimization.\" Show structured problem-solving approach."
questionTitles:
  - Climbing Stairs
  - House Robber
  - House Robber II
  - Coin Change
  - Coin Change 2
  - Longest Increasing Subsequence
  - Word Break
  - Unique Paths
  - Unique Paths II
  - Minimum Path Sum
  - Edit Distance
  - Longest Common Subsequence
  - Longest Palindromic Subsequence
  - Longest Palindromic Substring
  - Best Time to Buy and Sell Stock
  - Best Time to Buy and Sell Stock II
  - Best Time to Buy and Sell Stock III
  - Best Time to Buy and Sell Stock IV
  - Best Time to Buy and Sell Stock with Cooldown
  - Maximum Subarray
  - Maximum Product Subarray
  - Decode Ways
  - Jump Game
  - Jump Game II
  - Partition Equal Subset Sum
  - Target Sum
  - Interleaving String
  - Regular Expression Matching
  - Wildcard Matching
  - Burst Balloons
  - Palindrome Partitioning II
---

# Dynamic Programming: Progressive Mastery Path

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | 1D Linear DP | dp[i] depends on dp[i-1], dp[i-2] | Counting ways, simple sequences | Climbing Stairs |
| **2** | Decision DP | Take or skip at each step | Can't take adjacent, max sum | House Robber |
| **3** | Unbounded Knapsack | Items can be reused | Coin change, unlimited supply | Coin Change |
| **4** | 2D Grid DP | dp[i][j] for two dimensions | Paths in grid, string matching | Edit Distance |

### Quick Decision Guide
- **"Count ways to reach end"** → Level 1 (Fibonacci-like)
- **"Max value with constraints"** → Level 2 (Decision at each step)
- **"Minimum coins/items (unlimited)"** → Level 3 (Unbounded Knapsack)
- **"Two strings/sequences"** → Level 4 (2D DP Table)

---

<div id="level-1"></div>

## Level 1: Foundation - 1D DP Array

> 🎯 **Starting Point**: You can solve problems recursively but hit time limits. DP stores subproblem results—compute each answer once, reuse it many times.

### [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) (Easy)

**Problem**: You can climb 1 or 2 steps at a time. How many distinct ways to climb `n` steps?

```python
n = 5  →  8 ways
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know recursion

**New Concept**: Caching results to avoid redundant computation

**Why It's Foundational**: Introduces memoization and bottom-up DP

---

#### Your Natural First Instinct

"Count ways" → Try all possibilities recursively!

**Why This Breaks**:
```
climb(5) calls climb(4) and climb(3)
climb(4) calls climb(3) and climb(2)
climb(3) is calculated TWICE (and grows exponentially)

Tree of calls:
                    climb(5)
                   /        \
              climb(4)      climb(3)
             /      \       /      \
        climb(3) climb(2) climb(2) climb(1)
        /     \
   climb(2) climb(1)
```

**The Hidden Cost**: O(2^n) - exponential! For n=40, that's ~1 trillion calls!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Remember What You've Computed!</h4>
<p><strong>Old thinking</strong>: Recalculate same subproblems (exponential)</p>
<p><strong>New thinking</strong>: Cache results → O(1) lookup for repeat problems (linear)</p>
</div>

#### The Memoization Insight

Instead of recomputing, **store and reuse**:

**Key Idea**:
- To reach step n, you came from step n-1 (one step) or n-2 (two steps)
- Formula: `dp[n] = dp[n-1] + dp[n-2]`
- Base cases: `dp[1] = 1`, `dp[2] = 2`

**Two Approaches**:
1. **Top-Down (Memoization)**: Recursion + cache
2. **Bottom-Up (Tabulation)**: Iteratively fill array

</div>

<div class="code-block-wrapper">

```python
# ❌ Naive Recursion: O(2^n)
def climb_stairs_brute(n):
    if n <= 2:
        return n
    return climb_stairs_brute(n-1) + climb_stairs_brute(n-2)

# Time: O(2^n) - exponential branching
# Space: O(n) - recursion stack
# Problem: Recalculates same values repeatedly
```

```python
# ✅ Top-Down DP (Memoization): O(n)
def climb_stairs_memo(n):
    memo = {}

    def dp(i):
        if i <= 2:
            return i
        if i in memo:
            return memo[i]

        memo[i] = dp(i-1) + dp(i-2)
        return memo[i]

    return dp(n)

# Time: O(n) - each subproblem computed once
# Space: O(n) - memo + recursion stack
```

```python
# ✅ Bottom-Up DP (Tabulation): O(n)
def climb_stairs(n):
    if n <= 2:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2

    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]

# Time: O(n) - single pass
# Space: O(n) - dp array
# Key: Build solution bottom-up from base cases
```

**Space Optimization**:
```python
# O(1) space - only need last two values
def climb_stairs_optimized(n):
    if n <= 2:
        return n

    prev2, prev1 = 1, 2

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1

# Time: O(n), Space: O(1)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle base cases, general formula
- ✅ Approach: Recognize DP pattern from recursion
- ✅ Edge Cases: n=1, n=2

**Code Quality (25%)**:
- ✅ Readability: Clear variable names (dp, prev1, prev2)
- ✅ Efficiency: Bottom-up vs recursive

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n) vs O(2^n) naive
- ✅ Space Optimization: O(1) space possible

**Communication (20%)**:
- ✅ Thought Process: "I'll cache results to avoid recomputation"
- ✅ Explanation: "Each step depends on previous two steps"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Decision DP

> 🔄 **When Simple Accumulation Fails**: Climbing stairs adds all paths. But House Robber has *constraints*—can't take adjacent. Now each state needs a decision: take this item or skip it?

### [House Robber](https://leetcode.com/problems/house-robber/) (Medium)

**Problem**: Rob houses for max money. Can't rob adjacent houses (alarm triggers).

```python
nums = [2,7,9,3,1]  →  12  (rob houses 0, 2, 4: 2+9+1=12)
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: 1D DP with dependency on previous states

**New Dimension**: CHOICE at each step (rob or skip)

**Progressive Insight**: Track best result considering constraints

---

#### Your Next Natural Thought

"Maximize sum" → Take every other house!

```python
# Greedy: Take indices 0, 2, 4... or 1, 3, 5...
max(sum(nums[::2]), sum(nums[1::2]))
```

**Why This Fails**: `[2,1,1,2]` → greedy gives `max(2+1, 1+2)=3`, but optimal is `2+2=4`

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Track Best Decision at Each House!</h4>
<p><strong>Old pattern</strong>: Linear dependency (n-1, n-2)</p>
<p><strong>New pattern</strong>: CHOICE: max(rob current + dp[n-2], skip current + dp[n-1])</p>
<p><strong>Key insight</strong>: At each house, decide based on previous optimal choices!</p>
</div>

#### The Decision DP Pattern

**At house i, two choices**:
1. **Rob house i**: Get `nums[i] + dp[i-2]` (can't rob i-1)
2. **Skip house i**: Get `dp[i-1]` (keep previous best)

**Formula**: `dp[i] = max(nums[i] + dp[i-2], dp[i-1])`

**Why This Works**:
- Each decision is optimal given previous decisions
- Can't rob adjacent → explicitly encode in recurrence
- Optimal substructure: best for house i uses best for i-2

</div>

<div class="code-block-wrapper">

```python
# ❌ Greedy: Fails on many cases
def rob_greedy(nums):
    # Take every other house starting from 0 or 1
    return max(sum(nums[::2]), sum(nums[1::2]))

# Example: [2,1,1,2]
# Greedy: max(2+1, 1+2) = 3
# Optimal: 2+2 = 4
# Problem: Doesn't consider all valid combinations
```

```python
# ✅ Dynamic Programming: O(n)
def rob(nums):
    if not nums:
        return 0
    if len(nums) <= 2:
        return max(nums)

    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])

    for i in range(2, len(nums)):
        # Choice: rob current + dp[i-2] OR skip + dp[i-1]
        dp[i] = max(nums[i] + dp[i-2], dp[i-1])

    return dp[-1]

# Time: O(n) - single pass
# Space: O(n) - dp array
# Key: Decision at each step based on previous optimal
```

**Space Optimization**:
```python
# O(1) space
def rob_optimized(nums):
    if not nums:
        return 0
    if len(nums) <= 2:
        return max(nums)

    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])

    for i in range(2, len(nums)):
        current = max(nums[i] + prev2, prev1)
        prev2 = prev1
        prev1 = current

    return prev1

# Time: O(n), Space: O(1)
```

**Example Walkthrough**:
```python
nums = [2,7,9,3,1]

dp[0] = 2
dp[1] = max(2, 7) = 7

i=2: dp[2] = max(9+2, 7) = 11  (rob house 2)
i=3: dp[3] = max(3+7, 11) = 11 (skip house 3)
i=4: dp[4] = max(1+11, 11) = 12 (rob house 4)

Result: 12 (houses 0,2,4: 2+9+1)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "At each house, I choose max of rob or skip"
- ✅ Correctness: Handle edge cases (empty, 1 house, 2 houses)
- ⭐ **Key Skill**: Identifying choice-based DP

**Communication (20%)**:
- ✅ Thought Process: "Greedy fails because it doesn't consider all combinations"
- ✅ Explanation: "DP tracks best decision considering constraint"
- ⭐ **Key Skill**: Explaining why greedy fails

**Time/Space (20%)**:
- ✅ Big-O: "O(n) time with O(1) space optimization"
- ⭐ **Key Skill**: Space optimization from O(n) to O(1)

**Code Quality (25%)**:
- ✅ Implementation: Clear decision logic in max()
- ✅ Efficiency: Space-optimized version

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Unbounded Knapsack

> 🔄 **When Items Can Be Reused**: House Robber uses each house once. But Coin Change lets you use each coin *unlimited* times. The recurrence changes: consider using same item again!

### [Coin Change](https://leetcode.com/problems/coin-change/) (Medium)

**Problem**: Fewest coins to make amount. Coins can be reused.

```python
coins = [1,2,5], amount = 11  →  3  (5+5+1)
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: 1D DP with decisions

**New Complexity**: MULTIPLE choices per state (different coin values)

**Progressive Challenge**: Minimize count, can reuse items (unbounded)

---

#### The Pattern Shift

**Level 1**: Linear dependency (previous 1-2 states)
**Level 2**: Binary choice (rob or skip)
**Level 3**: Multiple choices (try each coin type)

**Key Difference**: Same item can be used multiple times!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Try Every Coin, Take Minimum!</h4>
<p><strong>Old pattern</strong>: Two choices (rob/skip, n-1/n-2)</p>
<p><strong>New pattern</strong>: For each coin denomination, try using it → take minimum</p>
<p><strong>Key insight</strong>: Unbounded = can revisit same choice!</p>
</div>

#### The Unbounded Knapsack Pattern

**For amount i, try each coin c**:
- If `i >= c`: Can use coin c → `dp[i] = min(dp[i], dp[i-c] + 1)`
- Check ALL coins, take minimum

**Formula**: `dp[i] = min(dp[i-coin] + 1 for all coins where i >= coin)`

**Why Unbounded**:
- After using coin c at amount i, we can use c again
- Example: amount=6, coins=[1,3] → can use coin 3 twice (dp[6] uses dp[3], which also used 3)

</div>

<div class="code-block-wrapper">

```python
# ❌ Greedy: Fails!
def coin_change_greedy(coins, amount):
    coins.sort(reverse=True)
    count = 0
    for coin in coins:
        count += amount // coin
        amount %= coin
    return count if amount == 0 else -1

# Example: coins=[1,3,4], amount=6
# Greedy: 4+1+1 = 3 coins
# Optimal: 3+3 = 2 coins
# Problem: Greedy doesn't explore all combinations
```

```python
# ✅ Dynamic Programming: O(n × amount)
def coin_change(coins, amount):
    # dp[i] = min coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                # Try using this coin
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Time: O(n × amount) where n = len(coins)
# Space: O(amount)
# Key: Try all coins for each amount, take minimum
```

**Example Walkthrough**:
```python
coins = [1,2,5], amount = 11

dp = [0, inf, inf, ..., inf]

i=1: Try coins: dp[1] = min(dp[0]+1) = 1
i=2: Try coins: dp[2] = min(dp[1]+1, dp[0]+1) = 1
i=3: dp[3] = min(dp[2]+1, dp[1]+1) = 2
i=4: dp[4] = min(dp[3]+1, dp[2]+1) = 2
i=5: dp[5] = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1
i=6: dp[6] = min(dp[5]+1, dp[4]+1, dp[1]+1) = 2
...
i=11: dp[11] = min(dp[10]+1, dp[9]+1, dp[6]+1) = 3

Result: 3 (coins: 5+5+1)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll try each coin for each amount, taking minimum"
- ✅ Correctness: Handle impossible cases (return -1)
- ⭐ **Key Skill**: Recognizing unbounded knapsack pattern

**Communication (20%)**:
- ✅ Thought Process: "Greedy fails because larger coins don't always lead to optimal solution"
- ✅ Explanation: "DP explores all combinations systematically"
- ⭐ **Key Skill**: Explaining nested loop logic clearly

**Code Quality (25%)**:
- ✅ Implementation: Correct initialization (inf), base case (0)
- ✅ Efficiency: Minimization logic in inner loop

**Time/Space (20%)**:
- ✅ Analysis: "O(coins × amount) because we check each coin for each amount"
- ⭐ **Key Skill**: Understanding 2D complexity in 1D DP

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - 2D DP Grid

> 🔄 **When One Dimension Isn't Enough**: Coin Change tracks one variable (amount). But comparing two *strings* needs two indices—dp[i][j] represents solving for first i chars of word1 and first j chars of word2.

### [Edit Distance](https://leetcode.com/problems/edit-distance/) (Medium)

**Problem**: Minimum operations (insert, delete, replace) to convert word1 to word2.

```python
word1 = "horse", word2 = "ros"  →  3
# horse → rorse (replace h→r)
# rorse → rose (delete r)
# rose → ros (delete e)
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: 1D DP with multiple choices

**New Complexity**: 2D DP (two sequences)

**Progressive Challenge**: Track TWO indices simultaneously

---

#### The Complexity Ladder

**Level 1-3**: 1D DP (single sequence/amount)
**Level 4**: 2D DP (two sequences)

**Why 2D**:
- State = position in BOTH strings
- `dp[i][j]` = min operations to convert word1[0:i] → word2[0:j]

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: Grid Represents Alignment!</h4>
<p><strong>Old pattern</strong>: Single dimension (one sequence)</p>
<p><strong>New pattern</strong>: Grid where dp[i][j] = best alignment up to positions i,j</p>
<p><strong>Key insight</strong>: At each cell, consider THREE operations!</p>
</div>

#### The 2D DP Pattern

**State**: `dp[i][j]` = edit distance for word1[0:i] → word2[0:j]

**Transitions at dp[i][j]**:
1. **Characters match** (`word1[i-1] == word2[j-1]`):
   - No operation needed → `dp[i][j] = dp[i-1][j-1]`

2. **Characters differ**:
   - **Replace**: `dp[i-1][j-1] + 1` (replace word1[i-1] with word2[j-1])
   - **Insert**: `dp[i][j-1] + 1` (insert word2[j-1])
   - **Delete**: `dp[i-1][j] + 1` (delete word1[i-1])
   - Take minimum of three

**Base Cases**:
- `dp[0][j] = j` (insert j characters)
- `dp[i][0] = i` (delete i characters)

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force Recursion: Exponential
def edit_distance_brute(word1, word2, i, j):
    if i == 0:
        return j  # Insert j chars
    if j == 0:
        return i  # Delete i chars

    if word1[i-1] == word2[j-1]:
        return edit_distance_brute(word1, word2, i-1, j-1)

    # Try all three operations
    return 1 + min(
        edit_distance_brute(word1, word2, i-1, j-1),  # Replace
        edit_distance_brute(word1, word2, i, j-1),    # Insert
        edit_distance_brute(word1, word2, i-1, j)     # Delete
    )

# Time: O(3^(m+n)) - three choices at each step
# Problem: Massive redundant computation
```

```python
# ✅ 2D DP: O(m × n)
def min_distance(word1, word2):
    m, n = len(word1), len(word2)

    # dp[i][j] = edit distance for word1[0:i] → word2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete i characters
    for j in range(n + 1):
        dp[0][j] = j  # Insert j characters

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # No operation
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j-1],  # Replace
                    dp[i][j-1],    # Insert
                    dp[i-1][j]     # Delete
                )

    return dp[m][n]

# Time: O(m × n)
# Space: O(m × n)
# Key: Build 2D table bottom-up
```

**Example Walkthrough**:
```python
word1 = "horse", word2 = "ros"

    ""  r  o  s
""   0  1  2  3
h    1  1  2  3
o    2  2  1  2
r    3  2  2  2
s    4  3  3  2
e    5  4  4  3

dp[5][3] = 3 (minimum operations)
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use 2D DP to track alignment of both strings"
- ✅ Correctness: Handle empty strings, same strings
- ⭐ **Key Skill**: Defining 2D state correctly

**Communication (20%)**:
- ✅ Thought Process: "State represents progress in BOTH strings"
- ✅ Explanation: "Three operations map to three transitions in DP"
- ⭐ **Key Skill**: Explaining 2D DP clearly

**Time/Space (20%)**:
- ✅ Big-O: "O(m×n) because we fill entire grid"
- ✅ Space: "Can optimize to O(n) using rolling array"
- ⭐ **Key Skill**: 2D complexity analysis

**Code Quality (25%)**:
- ✅ Implementation: Correct base cases, clear transition logic
- ✅ Efficiency: Clean nested loops

</div>
</div>

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)** → Basic 1D DP
2. **[Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)** → 1D DP with cost
3. **[Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)** → Classic DP

### 🟡 Medium - Core Patterns
4. **[House Robber](https://leetcode.com/problems/house-robber/)** → Decision DP
5. **[Coin Change](https://leetcode.com/problems/coin-change/)** → Unbounded knapsack
6. **[Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)** → LIS pattern
7. **[Word Break](https://leetcode.com/problems/word-break/)** → String DP
8. **[Unique Paths](https://leetcode.com/problems/unique-paths/)** → 2D grid DP
9. **[Jump Game](https://leetcode.com/problems/jump-game/)** → Greedy vs DP

### 🔴 Hard - Advanced Mastery
10. **[Edit Distance](https://leetcode.com/problems/edit-distance/)** → 2D string DP
11. **[Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/)** → Complex 2D DP
12. **[Burst Balloons](https://leetcode.com/problems/burst-balloons/)** → Interval DP

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Climbing Stairs | Recursion | Memoization/tabulation | Caching vs recomputation |
| **2** | House Robber | Level 1 | Decision DP | Choice-based transitions |
| **3** | Coin Change | Level 2 | Unbounded knapsack | Multiple choices, minimize |
| **4** | Edit Distance | Level 3 | 2D DP | Two-sequence alignment |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
