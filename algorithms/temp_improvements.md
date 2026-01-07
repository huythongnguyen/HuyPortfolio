# Chapter Improvements Summary

## Chapter 02: Two Pointers / Sliding Window

### When to Recall:
- **In-Place Modification** → Removing/moving elements without extra space, array contains unwanted elements (duplicates, zeros), space complexity must be O(1)
- **Opposite-End Pointers** → Sorted array + looking for pairs, checking palindrome properties, container/area problems where boundaries matter
- **3Sum Pattern** → Finding triplets/k-tuples summing to target, can reduce dimensions (fix one variable, solve simpler problem with remaining)
- **Sliding Window** → Contiguous subarray/substring problems, constraint on window (max length, character counts, sum), dynamic window size based on validity

---

## Chapter 03: Sorting

### When to Recall:
- **In-Place Merging** → Merging two sorted arrays/lists, have preallocated space at end, must avoid extra O(n) space
- **Three-Way Partitioning** → Known value set (like 0/1/2), need single-pass O(n) partition, Dutch National Flag pattern
- **Interval Merging** → Overlapping intervals/time ranges, scheduling problems, after sorting intervals become adjacent
- **Custom Comparator** → Non-standard ordering (concatenation for largest number), multi-key sorting, problem-specific comparison logic

---

## Chapter 04: Dynamic Programming

### When to Recall:
- **1D Linear DP** → Counting ways/paths, Fibonacci-like recurrence, current state depends on 1-2 previous states
- **Decision DP** → Include/exclude choices at each step, constraints preventing adjacent selections (House Robber), maximize with restrictions
- **Unbounded Knapsack** → Unlimited item reuse, coin change with infinite coins, optimization with repeatable choices
- **2D Grid DP** → Two sequences/strings to align, grid path problems, dp[i][j] represents subproblem on prefixes

---

## Chapter 05: Graph Traversal

### When to Recall:
- **BFS** → Shortest path in unweighted graph, level-order traversal, "minimum steps" problems, explore layer-by-layer
- **DFS** → Find any path, detect cycles, connected components, explore as deep as possible first
- **Topological Sort** → Dependency ordering (prerequisites), DAG (no cycles), build order / task scheduling
- **Shortest Path** → Multi-source BFS (multiple starting points), state-based BFS (position + keys collected), Dijkstra for weighted graphs

---

## Chapters 06-10: Similar pattern for remaining chapters...
