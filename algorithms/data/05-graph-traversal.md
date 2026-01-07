---
id: 05-graph-traversal
title: Graph Traversal
order: 5
icon: Network
difficulty: Intermediate
estimatedTime: 6-8 hours
description: Visit nodes / find paths / detect properties
summary: Master graph algorithms through 8 progressive levels. From basic BFS/DFS to advanced shortest path algorithms (Dijkstra, Bellman-Ford), Union-Find for connectivity, and bi-directional BFS for optimal solutions.
keySignals:
  - Connected components
  - Shortest path
  - Cycles
  - Dependencies
  - Connectivity
algorithms:
  - Graph
  - BFS
  - DFS
  - Dijkstra
  - Union-Find
  - Topological Sort
levels:
  - name: BFS Level-Order
    subtitle: Foundation - Tree & Basic Graph
  - name: Grid BFS/DFS
    subtitle: Implicit Graph Problems
  - name: Topological Sort
    subtitle: Dependency Ordering
  - name: Shortest Path BFS
    subtitle: Multi-Source & Unweighted
gradingDimensions:
  - name: Algorithm Choice
    weight: "30%"
    keyPoints:
      - point: BFS for shortest path/level-order
        explanation: BFS explores nodes layer by layer, guaranteeing shortest path in unweighted graphs. Use queue. Perfect for "minimum steps", "nearest", "level-order" problems.
      - point: DFS for connectivity/paths
        explanation: DFS explores as deep as possible before backtracking. Use recursion or stack. Ideal for "find any path", "detect cycle", "count components", "traverse all" problems.
      - point: Topological sort for dependencies
        explanation: Order nodes so all edges point forward. Use DFS with post-order or BFS with in-degree. Essential for "course schedule", "build order", "task dependencies".
  - name: Graph Representation
    weight: "25%"
    keyPoints:
      - point: Choose adjacency list vs matrix
        explanation: "Adjacency list: O(V+E) space, good for sparse graphs, O(degree) neighbor lookup. Matrix: O(V²) space, O(1) edge lookup, good for dense graphs or when checking edge existence."
      - point: Handle implicit graphs (grids)
        explanation: "Grid cells are nodes, adjacent cells (4 or 8 directions) are edges. No need to build explicit graph - iterate neighbors with direction arrays: [(0,1),(1,0),(0,-1),(-1,0)]."
      - point: Track visited nodes correctly
        explanation: Use set or boolean array to mark visited. Mark BEFORE adding to queue/stack (not after processing) to avoid duplicates. For grids, modify in-place if allowed.
  - name: Edge Cases
    weight: "25%"
    keyPoints:
      - point: Handle disconnected components
        explanation: Single BFS/DFS from one node won't reach all nodes. Loop through all nodes, start new traversal from unvisited ones. Count components or ensure all processed.
      - point: Detect cycles
        explanation: "In undirected: visited node that isn't parent = cycle. In directed: node in current recursion stack = cycle. Track \"visiting\" vs \"visited\" states for directed graphs."
      - point: Manage visited state
        explanation: Clear visited between independent queries. For multi-source BFS, add all sources initially. For backtracking paths, unmark when returning (not typical BFS/DFS).
  - name: Complexity Understanding
    weight: "20%"
    keyPoints:
      - point: Explain O(V+E) traversal
        explanation: "Each vertex visited once (O(V)), each edge examined once (O(E)). For grids: V = rows×cols, E = ~4×V. Total O(V+E) time, O(V) space for visited and queue/stack."
      - point: Understand when BFS gives shortest path
        explanation: BFS gives shortest path only in unweighted graphs (all edges weight 1). For weighted graphs, use Dijkstra (non-negative) or Bellman-Ford (negative allowed).
      - point: Analyze space for queue/stack
        explanation: "Worst case queue/stack size: O(V) for BFS (entire level), O(V) for DFS (longest path). Recursion stack for DFS can cause stack overflow on deep graphs."
questionTitles:
  - Binary Tree Level Order Traversal
  - Number of Islands
  - Clone Graph
  - Course Schedule
  - Course Schedule II
  - Pacific Atlantic Water Flow
  - Surrounded Regions
  - Rotting Oranges
  - Word Ladder
  - Word Ladder II
  - Walls and Gates
  - Shortest Path in Binary Matrix
  - Open the Lock
  - Network Delay Time
  - Cheapest Flights Within K Stops
  - Graph Valid Tree
  - Number of Connected Components in an Undirected Graph
  - Redundant Connection
  - Accounts Merge
  - Alien Dictionary
  - Evaluate Division
  - Is Graph Bipartite
  - Minimum Height Trees
---

# Graph Traversal: Progressive Mastery Path

## Chapter Overview

Graph algorithms form the backbone of system design, social networks, routing, and dependency management. This chapter progresses from basic tree traversal to advanced shortest-path algorithms, teaching you when BFS guarantees optimal paths, when DFS reveals connectivity, and when specialized algorithms (Dijkstra, Union-Find, topological sort) become essential.

**What You'll Master:**
- Apply BFS for level-order traversal and shortest unweighted paths
- Use DFS for connectivity, cycle detection, and path finding
- Handle implicit graphs (2D grids as graphs)
- Implement topological sorting for dependency ordering
- Optimize with Union-Find for dynamic connectivity
- Apply Dijkstra's algorithm for weighted shortest paths

**Core Decision Framework:**
- **BFS:** Layer-by-layer, shortest path in unweighted graphs, queue-based
- **DFS:** Depth-first exploration, connectivity/cycles, stack/recursion-based
- **Topological Sort:** DAG ordering where edges point forward
- **Dijkstra:** Shortest path with non-negative weights, priority queue

**Common Pitfalls:**
- Forgetting to mark nodes as visited *before* adding to queue (causes duplicates)
- Using BFS for weighted graphs (use Dijkstra instead)
- Missing disconnected components (need outer loop)
- Incorrect cycle detection in directed vs undirected graphs

This chapter transforms abstract graph theory into concrete interview patterns.

---

<div id="learning-ladder"></div>

## The Learning Ladder

Each level builds on previous concepts. **Click any level to jump directly to that section.**

| Level | Name | Key Concept | When to Use | Core Problem |
|-------|------|-------------|-------------|--------------|
| **1** | BFS Level-Order | Queue-based layer traversal | Level order, shortest unweighted path | Binary Tree Level Order |
| **2** | Grid BFS/DFS | 4-directional neighbors | Islands, flood fill, maze | Number of Islands |
| **3** | Topological Sort | Dependency ordering | Course prerequisites, build order | Course Schedule |
| **4** | Shortest Path BFS | Multi-source, state BFS | Minimum steps, rotting oranges | Word Ladder |

### Quick Decision Guide
- **"Level by level traversal"** → Level 1 (BFS with Queue)
- **"Connected regions in grid"** → Level 2 (DFS/BFS on Grid)
- **"Order with dependencies"** → Level 3 (Topological Sort)
- **"Minimum steps/transformations"** → Level 4 (BFS Shortest Path)

---

<div id="level-1"></div>

## Level 1: Foundation - BFS on Tree

> 🎯 **Starting Point**: You know recursive DFS on trees. BFS uses a queue to visit nodes *level by level*—essential when order of discovery matters.

### [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) (Medium)

**Problem**: Return level-order traversal of binary tree (level by level, left to right).

```python
    3
   / \
  9  20
    /  \
   15   7
Output: [[3], [9,20], [15,7]]
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 What Makes This "Level 1"?

**Starting Point**: You know tree recursion (DFS)

**New Concept**: BFS uses a queue to traverse level-by-level

**Why It's Foundational**: Introduces the BFS pattern with queue

---

#### Your Natural First Instinct

"Traverse tree" → Use recursion (DFS)!

**Why This Isn't Ideal**:
```python
# DFS visits in depth-first order: 3 → 9 → 20 → 15 → 7
# But we need level-order: [[3], [9,20], [15,7]]
# DFS doesn't naturally group by level
```

**The Challenge**: DFS explores depth first, not breadth first

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #1: Use Queue for Level-by-Level!</h4>
<p><strong>Old thinking</strong>: Recursion for tree traversal (depth-first)</p>
<p><strong>New thinking</strong>: Queue processes nodes level-by-level (breadth-first)</p>
</div>

#### The BFS Queue Pattern

**Key Idea**: Queue maintains nodes at current level

**Algorithm**:
1. Start with root in queue
2. While queue not empty:
   - Process all nodes at current level
   - Add their children to queue (next level)
3. Each iteration processes one complete level

**Why Queue**:
- FIFO: First nodes added (left) are processed first
- Natural level grouping: all nodes at level k added before level k+1

</div>

<div class="code-block-wrapper">

```python
# ❌ DFS: Doesn't naturally group by level
def level_order_dfs(root):
    result = []

    def dfs(node, level):
        if not node:
            return
        if len(result) == level:
            result.append([])
        result[level].append(node.val)
        dfs(node.left, level + 1)
        dfs(node.right, level + 1)

    dfs(root, 0)
    return result

# Works, but less intuitive for level-order
# Need to track level manually
```

```python
# ✅ BFS with Queue: O(n)
def level_order(root):
    if not root:
        return []

    result = []
    queue = [root]

    while queue:
        level_size = len(queue)
        current_level = []

        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.pop(0)
            current_level.append(node.val)

            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)

    return result

# Time: O(n) - visit each node once
# Space: O(w) where w = max width of tree
# Key: Queue maintains level order
```

**Example Walkthrough**:
```python
    3
   / \
  9  20
    /  \
   15   7

queue=[3], level=[]
Pop 3, add to level, queue=[9,20], level=[3]
Result: [[3]]

queue=[9,20], level=[]
Pop 9, add to level, queue=[20], level=[9]
Pop 20, add children, queue=[15,7], level=[9,20]
Result: [[3], [9,20]]

queue=[15,7], level=[]
Pop 15, queue=[7], level=[15]
Pop 7, queue=[], level=[15,7]
Result: [[3], [9,20], [15,7]]
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Correctness: Handle empty tree, single node
- ✅ Approach: Recognize BFS pattern for level-order
- ✅ Edge Cases: Unbalanced tree, only left/right children

**Code Quality (25%)**:
- ✅ Readability: Clear queue operations, level grouping
- ✅ Efficiency: Clean iteration over level

**Time/Space (20%)**:
- ✅ Big-O Analysis: O(n) time, O(w) space for queue
- ✅ Space: Queue size = max width, not depth

**Communication (20%)**:
- ✅ Thought Process: "BFS naturally groups by level using queue"
- ✅ Explanation: "Process all nodes at current level before moving to next"

</div>
</div>

---

<div id="level-2"></div>

## Level 2: Adding Constraint - BFS/DFS on Grid

> 🔄 **When Graphs Are Implicit**: Tree BFS has explicit nodes and edges. But a 2D grid is also a graph—cells are nodes, 4-directional neighbors are edges. Same algorithms, different representation!

### [Number of Islands](https://leetcode.com/problems/number-of-islands/) (Medium)

**Problem**: Count number of islands in 2D grid ('1' = land, '0' = water).

```python
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 1

**What You Already Know**: BFS with queue

**New Dimension**: Graph is a 2D grid, need to mark visited cells

**Progressive Insight**: Each island = one connected component

---

#### Your Next Natural Thought

"Count components" → Check every cell!

**Naive Approach**:
```python
# Check every cell, but how to avoid counting same island twice?
# Need to mark visited cells!
```

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #2: BFS/DFS Floods an Island!</h4>
<p><strong>Old pattern</strong>: BFS on tree structure</p>
<p><strong>New pattern</strong>: BFS/DFS on grid marks entire connected component</p>
<p><strong>Key insight</strong>: Each BFS/DFS marks one island → count number of BFS/DFS calls!</p>
</div>

#### The Connected Component Pattern

**Algorithm**:
1. Scan grid for unvisited land ('1')
2. When found → start BFS/DFS to mark entire island
3. Increment island count
4. Repeat until all cells checked

**Why Mark Visited**:
- Prevents counting same island multiple times
- Can modify grid in-place or use visited set

**4-Directional Movement**: Up, down, left, right (not diagonals)

</div>

<div class="code-block-wrapper">

```python
# ✅ DFS Approach: O(m×n)
def num_islands_dfs(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # Boundary check or water or visited
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] != '1'):
            return

        # Mark as visited
        grid[r][c] = '0'

        # Explore 4 directions
        dfs(r+1, c)  # Down
        dfs(r-1, c)  # Up
        dfs(r, c+1)  # Right
        dfs(r, c-1)  # Left

    # Scan entire grid
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)  # Flood this island
                count += 1  # Found new island

    return count

# Time: O(m×n) - visit each cell once
# Space: O(m×n) - recursion stack in worst case
# Key: Each DFS marks one complete island
```

```python
# ✅ BFS Approach: O(m×n)
def num_islands_bfs(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r, c):
        queue = [(r, c)]
        grid[r][c] = '0'  # Mark visited

        while queue:
            row, col = queue.pop(0)
            # Check 4 directions
            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == '1'):
                    queue.append((nr, nc))
                    grid[nr][nc] = '0'  # Mark visited

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                bfs(r, c)
                count += 1

    return count

# Time: O(m×n)
# Space: O(min(m,n)) - queue size
# Key: BFS iteratively marks island
```

**Example Walkthrough**:
```python
grid = [
  ["1","1","0"],
  ["1","0","0"],
  ["0","0","1"]
]

(0,0): '1' found → DFS marks (0,0), (0,1), (1,0) → count=1
(0,1): Already '0', skip
...
(2,2): '1' found → DFS marks (2,2) → count=2

Result: 2 islands
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use DFS/BFS to mark each island, counting starts"
- ✅ Correctness: Handle edge cases (all water, all land, single cell)
- ⭐ **Key Skill**: Recognizing connected components problem

**Communication (20%)**:
- ✅ Thought Process: "Each island is a connected component of 1s"
- ✅ Explanation: "DFS/BFS floods entire island, marking it visited"
- ⭐ **Key Skill**: Explaining why marking prevents double-counting

**Time/Space (20%)**:
- ✅ Big-O: "O(m×n) because we visit each cell at most once"
- ⭐ **Key Skill**: Understanding grid traversal complexity

**Code Quality (25%)**:
- ✅ Implementation: Correct boundary checks, 4-directional movement
- ✅ Efficiency: In-place modification vs visited set trade-off

</div>
</div>

---

<div id="level-3"></div>

## Level 3: New Pattern - Topological Sort

> 🔄 **When Order Has Dependencies**: BFS/DFS explore connected regions. But *dependency* problems (A must come before B) need topological sort—process nodes only when all prerequisites are done.

### [Course Schedule](https://leetcode.com/problems/course-schedule/) (Medium)

**Problem**: Can you finish all courses given prerequisites? (Detect cycle in directed graph)

```python
numCourses = 2, prerequisites = [[1,0]]
# Take course 0 before course 1
Output: true
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 2

**What You Know**: BFS/DFS on graphs

**New Complexity**: Directed graph with cycles (dependency cycle = impossible)

**Progressive Challenge**: Detect cycles OR perform topological sort

---

#### The Pattern Shift

**Level 2**: Undirected grid (find components)
**Level 3**: Directed graph (detect cycles, order dependencies)

**Key Difference**: Edge direction matters! `[1,0]` means 0→1, not 1→0

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #3: Cycle Detection via DFS States!</h4>
<p><strong>Old pattern</strong>: Mark visited to avoid revisiting</p>
<p><strong>New pattern</strong>: Track THREE states: unvisited, visiting, visited</p>
<p><strong>Key insight</strong>: If we encounter a "visiting" node, there's a cycle!</p>
</div>

#### The Cycle Detection Pattern

**Three States**:
1. **Unvisited** (0): Not processed yet
2. **Visiting** (1): Currently in recursion stack
3. **Visited** (2): Completely processed

**DFS Logic**:
- Start DFS from unvisited node → mark "visiting"
- Explore neighbors:
  - If neighbor is "visiting" → **cycle detected!**
  - If neighbor is "visited" → safe, skip
  - If neighbor is "unvisited" → recurse
- After exploring all neighbors → mark "visited"

**Alternative: Kahn's Algorithm (BFS + In-Degree)**

</div>

<div class="code-block-wrapper">

```python
# ✅ DFS Cycle Detection: O(V+E)
def can_finish(numCourses, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)  # prereq → course

    # States: 0=unvisited, 1=visiting, 2=visited
    state = [0] * numCourses

    def has_cycle(course):
        if state[course] == 1:
            return True  # Cycle detected!
        if state[course] == 2:
            return False  # Already processed

        state[course] = 1  # Mark visiting

        for neighbor in graph[course]:
            if has_cycle(neighbor):
                return True

        state[course] = 2  # Mark visited
        return False

    # Check all courses
    for course in range(numCourses):
        if has_cycle(course):
            return False

    return True

# Time: O(V+E) - visit each node and edge once
# Space: O(V+E) - graph + recursion stack
# Key: Three states track DFS progress
```

```python
# ✅ Kahn's Algorithm (BFS): O(V+E)
def can_finish_bfs(numCourses, prerequisites):
    from collections import deque

    # Build graph and in-degree
    graph = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    # Start with courses having no prerequisites
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    processed = 0

    while queue:
        course = queue.popleft()
        processed += 1

        for neighbor in graph[course]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return processed == numCourses

# Time: O(V+E)
# Space: O(V+E)
# Key: Process courses with no dependencies first
```

**Example Walkthrough**:
```python
numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]

Graph: 0→1→3
       0→2→3

DFS from 0: visiting[0] → visiting[1] → visiting[3] → visited[3,1,0]
DFS from 2: visiting[2] → 3 already visited → visited[2]

No cycle found → return True
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use DFS with three states to detect cycles"
- ✅ Correctness: Handle disconnected graph, self-loops
- ⭐ **Key Skill**: Cycle detection in directed graph

**Communication (20%)**:
- ✅ Thought Process: "Cycle in dependency graph means impossible to finish"
- ✅ Explanation: "Three states distinguish recursion stack from finished nodes"
- ⭐ **Key Skill**: Explaining directed vs undirected cycle detection

**Time/Space (20%)**:
- ✅ Big-O: "O(V+E) because we visit each node and edge once"
- ⭐ **Key Skill**: Graph complexity analysis

**Code Quality (25%)**:
- ✅ Implementation: Correct graph building, state management
- ✅ Efficiency: Early cycle detection

</div>
</div>

---

<div id="level-4"></div>

## Level 4: Mastery - Shortest Path BFS

> 🔄 **When You Need Minimum Steps**: Topological sort finds valid orderings. But Word Ladder needs the *shortest* transformation. BFS naturally finds shortest paths in unweighted graphs—first time you reach a node is optimal!

### [Word Ladder](https://leetcode.com/problems/word-ladder/) (Hard)

**Problem**: Transform `beginWord` to `endWord`, changing one letter at a time (words must be in dictionary). Return shortest transformation length.

```python
beginWord = "hit", endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5  ("hit"→"hot"→"dot"→"dog"→"cog")
```

<div class="code-section">
<div class="solution-explanation">

#### 🎯 Connection to Level 3

**What You Know**: BFS for graph traversal

**New Complexity**: Implicit graph (edges = one letter difference), shortest path

**Progressive Challenge**: Build graph on-the-fly, track path length

---

#### The Complexity Ladder

**Level 1**: Explicit tree
**Level 2**: Explicit grid graph
**Level 3**: Explicit directed graph
**Level 4**: Implicit graph (edges defined by transformation rules)

---

<div class="aha-moment">
<h4>💡 AHA MOMENT #4: BFS Finds Shortest Path!</h4>
<p><strong>Old pattern</strong>: BFS for level-order or connectivity</p>
<p><strong>New pattern</strong>: BFS guarantees shortest path in unweighted graph!</p>
<p><strong>Key insight</strong>: First time we reach target = shortest path!</p>
</div>

#### The Shortest Path BFS Pattern

**Why BFS for Shortest Path**:
- Explores in layers (distance 1, then 2, then 3...)
- First time we reach target = minimum steps
- Works for unweighted graphs

**Graph Construction**:
- Nodes = words
- Edge = words differ by exactly one letter
- Can generate neighbors on-the-fly OR precompute

**Optimization**: Use word patterns (e.g., `"hit"` → `"*it", "h*t", "hi*"`)

</div>

<div class="code-block-wrapper">

```python
# ✅ BFS Shortest Path: O(n × m²)
def ladder_length(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0

    wordSet = set(wordList)
    queue = [(beginWord, 1)]  # (word, length)
    visited = {beginWord}

    while queue:
        word, length = queue.pop(0)

        if word == endWord:
            return length

        # Try changing each position
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]

                if next_word in wordSet and next_word not in visited:
                    visited.add(next_word)
                    queue.append((next_word, length + 1))

    return 0  # No path found

# Time: O(n × m²) where n=words, m=word length
# Space: O(n) - queue + visited
# Key: BFS guarantees shortest path
```

**Optimized with Patterns**:
```python
# ✅ Pattern-Based BFS: O(n × m²)
def ladder_length_optimized(beginWord, endWord, wordList):
    from collections import defaultdict, deque

    if endWord not in wordList:
        return 0

    # Build pattern map: "*it" → ["hit", "bit"]
    pattern_map = defaultdict(list)
    wordList.append(beginWord)

    for word in wordList:
        for i in range(len(word)):
            pattern = word[:i] + '*' + word[i+1:]
            pattern_map[pattern].append(word)

    # BFS
    queue = deque([(beginWord, 1)])
    visited = {beginWord}

    while queue:
        word, length = queue.popleft()

        if word == endWord:
            return length

        # Find neighbors via patterns
        for i in range(len(word)):
            pattern = word[:i] + '*' + word[i+1:]
            for neighbor in pattern_map[pattern]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, length + 1))

    return 0

# Time: O(n × m²) - preprocessing + BFS
# Space: O(n × m²) - pattern map
```

**Example Walkthrough**:
```python
beginWord="hit", endWord="cog"
wordList=["hot","dot","dog","lot","log","cog"]

BFS:
Level 1: "hit" (length=1)
Level 2: "hot" (length=2) - changed 'i'→'o'
Level 3: "dot", "lot" (length=3) - changed 'h'→'d'/'l'
Level 4: "dog", "log" (length=4) - changed 't'→'g'
Level 5: "cog" (length=5) - changed 'd'/'l'→'c'

Return: 5
```

</div>

<div class="grading-criteria">

#### 📊 Grading Criteria

**Problem Solving (35%)**:
- ✅ Approach Quality: "I'll use BFS to find shortest transformation path"
- ✅ Correctness: Handle no path, word not in list
- ⭐ **Key Skill**: Recognizing BFS for shortest path

**Communication (20%)**:
- ✅ Thought Process: "BFS explores by distance, guarantees shortest path"
- ✅ Explanation: "Graph is implicit - edges are one-letter transformations"
- ⭐ **Key Skill**: Explaining implicit graph construction

**Time/Space (20%)**:
- ✅ Big-O: "O(n×m²) for n words of length m"
- ✅ Optimization: "Pattern map reduces neighbor generation cost"
- ⭐ **Key Skill**: Analyzing implicit graph complexity

**Code Quality (25%)**:
- ✅ Implementation: Clean BFS, correct neighbor generation
- ✅ Efficiency: Pattern-based optimization

</div>
</div>

---

<div id="practice-progression"></div>

## Complete Practice Progression

### 🟢 Easy - Build Foundation
1. **[Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)** → BFS basics
2. **[Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)** → DFS/BFS on tree
3. **[Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)** → Tree manipulation

### 🟡 Medium - Core Patterns
4. **[Number of Islands](https://leetcode.com/problems/number-of-islands/)** → Connected components
5. **[Course Schedule](https://leetcode.com/problems/course-schedule/)** → Cycle detection
6. **[Clone Graph](https://leetcode.com/problems/clone-graph/)** → Graph traversal with copying
7. **[Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)** → Multi-source BFS/DFS
8. **[Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)** → Cycle + connectivity check

### 🔴 Hard - Advanced Mastery
9. **[Word Ladder](https://leetcode.com/problems/word-ladder/)** → Shortest path BFS
10. **[Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)** → Topological sort
11. **[Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)** → BFS shortest path on grid

---

<div id="learning-path"></div>

## The Progressive Learning Path

| Level | Problem | Builds On | New Concept | Grading Focus |
|-------|---------|-----------|-------------|---------------|
| **1** | Binary Tree Level Order | Tree basics | BFS with queue | Queue-based traversal |
| **2** | Number of Islands | Level 1 | Grid traversal, marking visited | Connected components |
| **3** | Course Schedule | Level 2 | Directed graph, cycle detection | Three-state DFS |
| **4** | Word Ladder | Level 3 | Implicit graph, shortest path | BFS for shortest path |

**Key Insight**: Each level adds exactly ONE new dimension of complexity. Master each before moving to the next!
