---
id: 08-greedy
title: Greedy
order: 8
icon: TrendingUp
difficulty: Intermediate
estimatedTime: 4-5 hours
description: Build optimal solution via local choices
summary: Master greedy algorithms through 6 levels. Learn when local optimal leads to global optimal, interval scheduling, activity selection, and how to prove greedy correctness.
keySignals:
  - Optimal selection
  - Interval scheduling
  - Local choice leads to global optimum
  - Minimum/Maximum selection
  - Activity selection
algorithms:
  - Greedy
  - Interval Scheduling
  - Activity Selection
levels:
  - name: Greedy Reachability
    subtitle: Foundation - Jump Game
  - name: Interval Scheduling
    subtitle: Non-Overlapping Selection
  - name: Sort + Greedy
    subtitle: Ordering Enables Optimal
  - name: Two-Pass Greedy
    subtitle: Left-to-Right, Right-to-Left
gradingDimensions:
  - name: Greedy Choice Property
    weight: "30%"
    keyPoints:
      - point: Identify the greedy choice
        explanation: "What local decision leads to global optimum? For intervals: pick earliest ending. For jumps: maximize reach. The greedy choice should be clearly stated and justified."
      - point: Prove greedy works (or doesn't)
        explanation: "Exchange argument: show swapping greedy choice for any other doesn't improve solution. Or show counterexample if greedy fails. Not all problems have greedy solutions."
      - point: Recognize when greedy fails
        explanation: "Coin change with arbitrary denominations, 0/1 knapsack, longest path. If locally optimal can lead to globally suboptimal, DP or other approaches needed."
  - name: Problem Transformation
    weight: "25%"
    keyPoints:
      - point: Sort to enable greedy
        explanation: "Many greedy algorithms require sorted input. Intervals by end time, tasks by deadline, items by ratio. Sorting creates order that makes greedy choice obvious."
      - point: Preprocess to support decisions
        explanation: "Build auxiliary structures (heaps, prefix sums, hash maps) to make greedy choices efficient. Balance preprocessing cost with per-decision speedup."
      - point: Choose right greedy metric
        explanation: "Maximize end time? Minimize weight/value ratio? The metric defines your greedy choice. Wrong metric → wrong algorithm. Test on examples before committing."
  - name: Implementation Quality
    weight: "25%"
    keyPoints:
      - point: Handle edge cases
        explanation: Empty input, single element, all same values. Greedy often has subtle edge cases at boundaries. Test with minimal inputs.
      - point: Maintain invariants correctly
        explanation: "If tracking max reach: update before checking. If counting intervals: check overlap before incrementing. Order of operations matters."
      - point: Use appropriate data structures
        explanation: "Heap for dynamic min/max. Sorted list for interval problems. Hash map for frequency counting. Right structure makes greedy implementation clean."
  - name: Comparison with DP
    weight: "20%"
    keyPoints:
      - point: Know when DP is needed instead
        explanation: "If local choice affects future options in complex ways, DP explores all possibilities. Greedy commits; DP considers. Recognize the difference."
      - point: Greedy as DP optimization
        explanation: "Some DP solutions simplify to greedy when optimal substructure is strong enough. Prove greedy choice property to safely simplify."
      - point: Explain your choice
        explanation: "\"Greedy works because earliest-ending interval leaves maximum room for others\" or \"Greedy fails because local optimal can block global optimal.\" Show reasoning."
questionTitles:
  - Jump Game
  - Jump Game II
  - Gas Station
  - Candy
  - Non-overlapping Intervals
  - Minimum Number of Arrows to Burst Balloons
  - Task Scheduler
  - Partition Labels
  - Queue Reconstruction by Height
  - Lemonade Change
  - Assign Cookies
  - Boats to Save People
  - Reorganize String
  - Minimum Deletions to Make Character Frequencies Unique
  - Maximum Units on a Truck
  - Video Stitching
  - Minimum Cost to Connect Sticks
  - IPO
---

# Greedy Algorithms: Progressive Mastery Path

## Chapter Overview

Greedy algorithms commit to locally optimal choices at each step, wagering that local optimization yields global optimization. Unlike dynamic programming (which hedges bets by exploring all options), greedy algorithms make irrevocable decisions. The intellectual challenge: proving your greedy choice is actually optimal—not all problems admit greedy solutions.

**What You'll Master:**
- Identify when greedy choice property holds
- Apply exchange arguments to prove greedy correctness
- Recognize when greedy fails (requiring DP instead)
- Sort input to enable greedy selection
- Handle interval scheduling and activity selection
- Implement two-pass greedy strategies

**Greedy vs DP Decision Framework:**
- **Greedy works when:** Local optimal choice never blocks global optimal
- **DP needed when:** Local choice affects future options in complex ways
- **Proof technique:** Exchange argument (swapping greedy choice doesn't improve solution)

**Classic Greedy Patterns:**
- Interval scheduling: sort by end time, select earliest-ending non-overlapping
- Activity selection: maximize selections by picking shortest/earliest
- Reachability: track maximum reach, commit when achievable

Greedy algorithms make locally optimal choices at each step, hoping to find a global optimum. Unlike DP (which explores all options), greedy commits to each choice immediately. The challenge is proving the greedy choice is actually optimal - not all problems have greedy solutions.

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | Greedy Reachability | Track maximum reach | Can reach end? Minimum jumps | Jump Game |
| **2** | Interval Scheduling | Sort by end time | Non-overlapping intervals | Non-overlapping Intervals |
| **3** | Sort + Greedy | Sorting enables greedy | Activity selection, scheduling | Meeting Rooms II |
| **4** | Two-Pass Greedy | Left-to-right, then right-to-left | Candy distribution, ratings | Candy |

### Quick Decision Guide
- **"Can reach destination?"** → Level 1 (Track max reach)
- **"Maximum non-overlapping"** → Level 2 (Sort by end, greedy select)
- **"Assign resources optimally"** → Level 3 (Sort + Greedy)
- **"Satisfy neighbors' constraints"** → Level 4 (Two-Pass)

---

<div id="level-1"></div>

## Level 1: Foundation - Greedy Reachability

> 🎯 **Starting Point**: Greedy makes the locally optimal choice at each step, hoping it leads to a global optimum. For reachability, track the farthest point you *can* reach.

### [Jump Game](https://leetcode.com/problems/jump-game/) (Medium)

**Problem**: Given array where `nums[i]` = max jump length from position `i`. Can you reach the last index starting from index 0?

```python
nums = [2, 3, 1, 1, 4]
Output: True
# Jump: 0→1 (jump 1 step), then 1→4 (jump 3 steps)

nums = [3, 2, 1, 0, 4]
Output: False
# Can't get past index 3 (which has 0 jump power)
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know recursion and DP

**New Concept**: Greedy - make locally optimal choice (maximize reach)

**Why It's Foundational**: Introduces greedy property - local optimum → global optimum

---

#### Your Natural First Instinct

"Can reach end?" → Try all possible jump paths recursively!

**Why This Is Too Slow**:
```python
# At each position, branch into multiple paths
# Position 0 with jump=2: try jump 1 OR jump 2
# Position 1 with jump=3: try jump 1 OR jump 2 OR jump 3
# Creates exponential branching: O(2^n)
```

**The Hidden Cost**: O(2^n) - exploring all possible paths when we only need one!

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Track Max Reach, Not All Paths!</h4>
<p><strong>Old thinking</strong>: Try all jump combinations (exponential)</p>
<p><strong>New thinking</strong>: Only care about farthest reachable position (linear)</p>
</div>

#### The Greedy Reachability Pattern

**Key Insight**: If we can reach position `i`, we can reach any position `j < i`

**Greedy Choice**: At each position, extend maximum reach as far as possible
- Don't need to track exact path
- Only need to know: "Can I reach the end?"

**Algorithm**:
1. Track `max_reach` = farthest index we can reach
2. For each position `i`:
   - If `i > max_reach` → can't reach i, return False
   - Update `max_reach = max(max_reach, i + nums[i])`
3. If `max_reach >= last_index` → return True

**Why This Works**: Greedy locally optimal (max reach) guarantees global reachability

</div>

<div class="code-block-wrapper">

```python
# ❌ Brute Force Recursion: O(2^n)
def can_jump_brute(nums):
    def can_reach(pos):
        if pos >= len(nums) - 1:
            return True

        # Try all possible jump lengths
        max_jump = nums[pos]
        for jump in range(1, max_jump + 1):
            if can_reach(pos + jump):
                return True
        return False

    return can_reach(0)

# Time: O(2^n) - exponential branching
# Space: O(n) - recursion stack
# Problem: Explores all paths, massive redundancy
```

```python
# ✅ Greedy Reachability: O(n)
def can_jump(nums):
    max_reach = 0

    for i in range(len(nums)):
        # Can't reach position i
        if i > max_reach:
            return False

        # Update max reachable position
        max_reach = max(max_reach, i + nums[i])

        # Early exit if we can reach the end
        if max_reach >= len(nums) - 1:
            return True

    return False

# Time: O(n) - single pass
# Space: O(1) - only track max_reach
# Key: Greedy choice (maximize reach) is optimal
```

**Example Walkthrough**:
```python
nums = [2, 3, 1, 1, 4]

i=0: max_reach = max(0, 0+2) = 2
i=1: 1 <= 2 ✓, max_reach = max(2, 1+3) = 4
i=2: 2 <= 4 ✓, max_reach = max(4, 2+1) = 4
max_reach=4 >= len-1=4 → return True

nums = [3, 2, 1, 0, 4]

i=0: max_reach = max(0, 0+3) = 3
i=1: 1 <= 3 ✓, max_reach = max(3, 1+2) = 3
i=2: 2 <= 3 ✓, max_reach = max(3, 2+1) = 3
i=3: 3 <= 3 ✓, max_reach = max(3, 3+0) = 3
i=4: 4 > 3 → return False
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle unreachable positions, early exit
- ✅ Approach: Recognize greedy pattern
- ✅ Edge Cases: Single element, all zeros, large jumps

**Code Quality (25%)**:
- ✅ Readability: Clear max_reach tracking
- ✅ Efficiency: Single-pass, no unnecessary computation

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n) vs O(2^n) brute force
- ✅ Space: O(1) constant space

**Communication (20%)**:
- ✅ Thought Process: "Only need to track farthest reach, not all paths"
- ✅ Explanation: "Greedy choice (maximize reach) guarantees we find path if one exists"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - Interval Scheduling

> 🔄 **When Choices Conflict**: Jump Game has no conflicts—just maximize reach. But intervals can *overlap*. The greedy insight: always pick the interval that ends earliest—it leaves maximum room for future choices.

### [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) (Medium)

**Problem**: Minimum intervals to remove to make all intervals non-overlapping.

```python
intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1  # Remove [1,3]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: Greedy choice for optimization

**New Dimension**: Sorting enables greedy choice! Order matters

**Progressive Insight**: Sort by end time → greedy selection

---

#### Your Next Natural Thought

"Remove minimum intervals" → Try all combinations and pick best?

**Why This Doesn't Work**:
```python
# With n intervals, there are 2^n ways to remove subsets
# Need to check all combinations to find minimum
# O(2^n) - too slow!
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: Sort by End Time, Greedily Select!</h4>
<p><strong>Old thinking</strong>: Try all removal combinations</p>
<p><strong>New thinking</strong>: Sort by end time, keep intervals that end earliest</p>
<p><strong>Key insight</strong>: Earliest-ending interval leaves most room for future intervals!</p>
</div>

#### The Activity Selection Pattern

**Classic Problem**: Select maximum non-overlapping activities

**Greedy Choice**: Always pick activity that ends earliest
- Leaves maximum time for remaining activities
- Locally optimal → globally optimal

**For Minimum Removals**:
```
max_kept = max non-overlapping intervals
min_removed = total - max_kept
```

**Why Sort by End Time**:
- If we keep interval ending at time 5
- Better than keeping interval ending at time 10
- More room for future intervals!

</div>

<div class="code-block-wrapper">

```python
# ❌ Try All Combinations: O(2^n)
def erase_overlap_intervals_brute(intervals):
    # Try all 2^n subsets
    # Find largest non-overlapping subset
    # Return total - largest
    # Way too slow!
    pass

# Problem: Exponential time complexity
```

```python
# ✅ Greedy with Sort: O(n log n)
def erase_overlap_intervals(intervals):
    if not intervals:
        return 0

    # Sort by end time (greedy choice!)
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for i in range(1, len(intervals)):
        start, end = intervals[i]

        if start < prev_end:
            # Overlaps! Remove this interval
            count += 1
        else:
            # No overlap, keep this interval
            prev_end = end

    return count

# Time: O(n log n) - dominated by sorting
# Space: O(1) - excluding sort space
# Key: Greedy choice (earliest end) is optimal
```

**Alternative: Track Max Non-overlapping**:
```python
def erase_overlap_intervals_alt(intervals):
    if not intervals:
        return 0

    intervals.sort(key=lambda x: x[1])

    kept = 1  # Keep first interval
    prev_end = intervals[0][1]

    for i in range(1, len(intervals)):
        if intervals[i][0] >= prev_end:
            # Non-overlapping, keep it
            kept += 1
            prev_end = intervals[i][1]

    return len(intervals) - kept
```

**Example Walkthrough**:
```python
intervals = [[1,2],[2,3],[3,4],[1,3]]

After sort by end time:
[[1,2], [2,3], [1,3], [3,4]]

Keep [1,2], prev_end=2
Check [2,3]: 2 >= 2 ✓ no overlap, keep it, prev_end=3
Check [1,3]: 1 < 3 ✗ overlap! count=1, remove [1,3]
Check [3,4]: 3 >= 3 ✓ no overlap, keep it

Result: 1 removal
```

**Why Greedy Works**:
```
Two overlapping intervals: [1,5] and [2,3]
Which to keep?
- Keep [1,5]: ends at 5, less room for future
- Keep [2,3]: ends at 3, MORE room for future ✓
Greedy choice (earliest end) is always optimal!
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll sort by end time and greedily select non-overlapping intervals"
- ✅ Correctness: Handle edge cases (no intervals, no overlaps, all overlap)
- ⭐ **Key Skill**: Recognizing need to sort first

**Communication (20%)**:
- ✅ Thought Process: "Sorting by end time enables greedy selection"
- ✅ Explanation: "Earliest-ending interval leaves most room for future intervals"
- ⭐ **Key Skill**: Explaining why this greedy choice is optimal

**Time/Space (20%)**:
- ✅ Big-O: "O(n log n) from sorting dominates O(n) greedy selection"
- ⭐ **Key Skill**: Understanding sorting impact on complexity

**Code Quality (25%)**:
- ✅ Implementation: Clean sort key, clear overlap check
- ✅ Efficiency: Single pass after sorting

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Greedy with Two-Pointer

> 🔄 **When You Need Pre-Processing**: Interval scheduling sorts by end time. But Partition Labels needs to know the *last occurrence* of each character first. Preprocess, then greed!

### [Partition Labels](https://leetcode.com/problems/partition-labels/) (Medium)

**Problem**: Partition string into maximum parts where each letter appears in only one part.

```python
s = "ababcbacadefegdehijhklij"
Output: [9, 7, 8]
# "ababcbaca", "defegde", "hijhklij"
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: Greedy with sorting

**New Complexity**: Track last occurrence + extend partition greedily

**Progressive Challenge**: Two-phase: preprocessing + greedy partitioning

---

#### The Pattern Shift

**Level 1**: Simple greedy (track one value)
**Level 2**: Sort + greedy (order enables choice)
**Level 3**: Preprocessing + greedy (last occurrence tracking)

**Key Difference**: Need auxiliary data structure to make greedy decisions

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Extend Partition to Include All Occurrences!</h4>
<p><strong>Old thinking</strong>: Try all possible partitions</p>
<p><strong>New thinking</strong>: Track last occurrence of each char, extend partition greedily</p>
<p><strong>Key insight</strong>: Can't partition until we've seen ALL occurrences of every char in current partition!</p>
</div>

#### The Greedy Partitioning Pattern

**Algorithm**:
1. **Preprocessing**: Store last index of each character
2. **Greedy Partition**:
   - Track current partition end
   - For each character, extend partition to include its last occurrence
   - When current index = partition end → cut here!

**Why This Works**:
- If partition includes char 'a', must extend to last 'a'
- If that last 'a' is at index 5, and 'b' appears at index 3, we see last 'b' too
- Keep extending until all chars in partition are complete

**Example**:
```
s = "ababcbaca"
last = {a:8, b:5, c:7}

i=0 (a): end = 8
i=1 (b): end = max(8, 5) = 8
i=2 (a): end = max(8, 8) = 8
...
i=8: i == end → partition! length=9
```

</div>

<div class="code-block-wrapper">

```python
# ❌ Try All Partitions: Exponential
def partition_labels_brute(s):
    # Try all possible partition points
    # Check if each partition is valid
    # Too slow for long strings!
    pass

# Problem: Exponential partitioning possibilities
```

```python
# ✅ Greedy with Last Occurrence: O(n)
def partition_labels(s):
    # Preprocessing: store last occurrence
    last = {c: i for i, c in enumerate(s)}

    result = []
    start = 0
    end = 0

    for i, char in enumerate(s):
        # Extend partition to include last occurrence
        end = max(end, last[char])

        # Reached end of partition
        if i == end:
            result.append(end - start + 1)
            start = i + 1

    return result

# Time: O(n) - two passes (last + partition)
# Space: O(1) - at most 26 letters
# Key: Greedy extension ensures valid partitions
```

**Example Walkthrough**:
```python
s = "ababcbacadefegdehijhklij"
last = {a:8, b:5, c:7, d:14, e:15, f:11, g:13, h:19, i:22, j:23, k:20, l:21}

Partition 1:
i=0 (a): end = 8
i=1 (b): end = max(8, 5) = 8
i=2 (a): end = max(8, 8) = 8
i=3 (b): end = max(8, 5) = 8
i=4 (c): end = max(8, 7) = 8
i=5 (b): end = max(8, 5) = 8
i=6 (a): end = max(8, 8) = 8
i=7 (c): end = max(8, 7) = 8
i=8 (a): end = max(8, 8) = 8
i=8 == end → partition! length = 9

Partition 2:
i=9 (d): start=9, end = 14
i=10 (e): end = max(14, 15) = 15
...
i=15 == end → partition! length = 7

Partition 3:
i=16 (h): start=16, end = 19
...
i=23 == end → partition! length = 8

Result: [9, 7, 8]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll track last occurrence, then greedily extend partitions"
- ✅ Correctness: Handle single char, all same char, all different chars
- ⭐ **Key Skill**: Two-phase approach (preprocess + greedy)

**Communication (20%)**:
- ✅ Thought Process: "Partition must include all occurrences of each character it contains"
- ✅ Explanation: "Extend partition end to last occurrence of each seen char"
- ⭐ **Key Skill**: Explaining why this guarantees valid partitions

**Time/Space (20%)**:
- ✅ Big-O: "O(n) for two passes, O(1) space for at most 26 letters"
- ⭐ **Key Skill**: Understanding preprocessing cost

**Code Quality (25%)**:
- ✅ Implementation: Clean last occurrence dict, clear partition logic
- ✅ Efficiency: Single pass partitioning

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Gas Station (Circular Array)

> 🔄 **When the Array Is Circular**: Linear greedy scans left-to-right. But Gas Station wraps around! The insight: if total gas ≥ total cost, a solution exists. Find the starting point where running sum never goes negative.

### [Gas Station](https://leetcode.com/problems/gas-station/) (Medium)

**Problem**: Find starting gas station to complete circular route. Return -1 if impossible.

```python
gas = [1,2,3,4,5]
cost = [3,4,5,1,2]
Output: 3
# Start at station 3:
# 3→4: gas=4, cost=1 → net=3
# 4→0: gas=3+5=8, cost=2 → net=6
# 0→1: gas=6+1=7, cost=3 → net=4
# 1→2: gas=4+2=6, cost=4 → net=2
# 2→3: gas=2+3=5, cost=5 → net=0 ✓
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: Greedy with preprocessing

**New Complexity**: Circular array + mathematical insight

**Progressive Challenge**: Prove greedy choice works for circular traversal

---

#### The Complexity Ladder

**Level 1**: Linear greedy
**Level 2**: Sort + greedy
**Level 3**: Preprocess + greedy
**Level 4**: Mathematical proof + greedy

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: If You Fail at i, Start Can't Be Before i!</h4>
<p><strong>Old thinking</strong>: Try starting from each position O(n²)</p>
<p><strong>New thinking</strong>: If starting from s fails at i, any start in [s, i] also fails! Skip to i+1</p>
<p><strong>Key insight</strong>: Mathematical proof eliminates need to try all starts!</p>
</div>

#### The Gas Station Pattern

**Mathematical Insights**:
1. **Total Gas Check**: If `sum(gas) < sum(cost)` → impossible (not enough total gas)
2. **Failure Point**: If starting from `s` fails at position `i`:
   - Any start in range `[s, i]` also fails
   - Why? Each position adds/subtracts from tank. If `s` with full accumulation fails, any position in between (with less accumulation) also fails
3. **Greedy Choice**: Try next start at `i+1`

**Algorithm**:
1. Check if `sum(gas) < sum(cost)` → return -1
2. Track `total_tank` and `current_tank`
3. If `current_tank < 0` at position `i` → reset start to `i+1`
4. Return starting position

</div>

<div class="code-block-wrapper">

```python
# ❌ Try Every Start: O(n²)
def can_complete_circuit_brute(gas, cost):
    n = len(gas)

    for start in range(n):
        tank = 0
        valid = True

        for i in range(n):
            pos = (start + i) % n
            tank += gas[pos] - cost[pos]
            if tank < 0:
                valid = False
                break

        if valid:
            return start

    return -1

# Time: O(n²) - try each start, simulate circuit
# Problem: Redundant simulation
```

```python
# ✅ Greedy with Mathematical Insight: O(n)
def can_complete_circuit(gas, cost):
    # Check if solution exists
    if sum(gas) < sum(cost):
        return -1  # Impossible

    total_tank = 0
    current_tank = 0
    start = 0

    for i in range(len(gas)):
        total_tank += gas[i] - cost[i]
        current_tank += gas[i] - cost[i]

        # If current_tank < 0, start can't be before i
        if current_tank < 0:
            start = i + 1
            current_tank = 0

    return start

# Time: O(n) - single pass
# Space: O(1)
# Key: Mathematical proof eliminates redundant checks
```

**Example Walkthrough**:
```python
gas = [1,2,3,4,5]
cost = [3,4,5,1,2]

Check: sum(gas)=15, sum(cost)=15 → possible ✓

i=0: current_tank = 1-3 = -2 < 0
     → start = 1, current_tank = 0

i=1: current_tank = 0 + 2-4 = -2 < 0
     → start = 2, current_tank = 0

i=2: current_tank = 0 + 3-5 = -2 < 0
     → start = 3, current_tank = 0

i=3: current_tank = 0 + 4-1 = 3
i=4: current_tank = 3 + 5-2 = 6

Return: 3

Why this works:
- Starting from 0,1,2 all fail
- Starting from 3 accumulates positive tank
- Since total gas = total cost, we can complete from 3
```

**Why Greedy Works**:
```
If starting from position s fails at position i:
  tank[s→i] = sum(gas[s:i+1]) - sum(cost[s:i+1]) < 0

For any position k in [s, i]:
  tank[k→i] = sum(gas[k:i+1]) - sum(cost[k:i+1])
            ⊆ sum(gas[s:i+1]) - sum(cost[s:i+1])
            < 0

Therefore, k also fails at i or earlier!
Skip to i+1 as next candidate.
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use greedy with mathematical insight to skip invalid starts"
- ✅ Correctness: Handle impossible case, circular traversal
- ⭐ **Key Skill**: Understanding mathematical proof

**Communication (20%)**:
- ✅ Thought Process: "If starting from s fails at i, any start in [s,i] also fails"
- ✅ Explanation: "Total gas check + greedy start selection"
- ⭐ **Key Skill**: Explaining why O(n) is sufficient

**Time/Space (20%)**:
- ✅ Big-O: "O(n) single pass vs O(n²) brute force"
- ⭐ **Key Skill**: Understanding optimization from mathematical insight

**Code Quality (25%)**:
- ✅ Implementation: Clean greedy logic, clear reset condition
- ✅ Efficiency: Early exit for impossible case

</div>
</div>

---

<div id="grading-success"></div>

## Grading Success Across Levels

**What Matters Most**: Interviewers grade greedy algorithms on your ability to **identify the greedy choice**, **explain why it's optimal** (not just that it works), and **recognize when greedy fails** (some problems need DP instead).

**Common Pitfalls to Avoid**:
- ❌ Assuming greedy works without proof/justification
- ❌ Not sorting first when order matters (intervals, scheduling)
- ❌ Forgetting to preprocess (last occurrence, frequency counts)
- ❌ Missing mathematical insight that eliminates redundant work

**Interview Success Formula**:
1. **State greedy choice** → "At each step, I'll choose [earliest ending time / most frequent / ...]"
2. **Justify optimality** → "This works because [local choice doesn't block better global solution]"
3. **Identify preprocessing** → "I'll sort by [X] first to enable greedy selection"
4. **Prove with example** → Show why other choices would be worse

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)** → Track min price greedily
2. **[Assign Cookies](https://leetcode.com/problems/assign-cookies/)** → Sort + greedy matching
3. **[Lemonade Change](https://leetcode.com/problems/lemonade-change/)** → Greedy change-making

### 🟡 Medium - Core Patterns
4. **[Jump Game](https://leetcode.com/problems/jump-game/)** → Greedy reachability
5. **[Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)** → Activity selection
6. **[Partition Labels](https://leetcode.com/problems/partition-labels/)** → Greedy partitioning
7. **[Gas Station](https://leetcode.com/problems/gas-station/)** → Circular array greedy
8. **[Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)** → Min rooms greedy
9. **[Task Scheduler](https://leetcode.com/problems/task-scheduler/)** → Greedy scheduling

### 🔴 Hard - Advanced Mastery
10. **[Jump Game II](https://leetcode.com/problems/jump-game-ii/)** → Minimum jumps greedy
11. **[Candy](https://leetcode.com/problems/candy/)** → Two-pass greedy
12. **[Minimum Number of Arrows](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)** → Interval greedy

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Jump Game | Basic optimization | Greedy reachability | Local optimum → global |
| **2** | Non-overlapping Intervals | Level 1 | Sort + greedy selection | Activity selection pattern |
| **3** | Partition Labels | Level 2 | Preprocessing + greedy | Last occurrence tracking |
| **4** | Gas Station | Level 3 | Mathematical proof + greedy | Circular array reasoning |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
