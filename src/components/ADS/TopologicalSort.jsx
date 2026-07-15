import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, Trash2, ArrowRight, SkipBack, SkipForward, RotateCcw, Code, Settings, Map, Info, Layers, ListOrdered } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      --bg-dark-950: #0c111c;
      --bg-dark-900: #111827;
      --bg-dark-800: #1f2937;
      --bg-dark-700: #374151;
      --bg-dark-600: #4b5563;
      
      --text-gray-100: #f3f4f6;
      --text-gray-200: #e5e7eb;
      --text-gray-300: #d1d5db;
      --text-gray-400: #9ca3af;
      --text-gray-500: #6b7280;

      --border-gray-600: #4b5563;
      --border-gray-700: #374151;

      --cyan-400: #22d3ee;
      --cyan-500: #06b6d4;
      --green-400: #4ade80;
      --green-500: #22c55e;
      --yellow-400: #facc15;
      --yellow-500: #eab308;
      --red-400: #f87171;
      --red-500: #ef4444;
      --purple-400: #c084fc;
      --purple-500: #a855f7;
      --blue-400: #60a5fa;
      --blue-500: #3b82f6;
      --orange-400: #fb923c;
      --pink-400: #f472b6;
    }

    .visualizer-container {
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; }
    }

    * { box-sizing: border-box; }

    /* Sidebar Layout */
    .controls-sidebar {
      width: 100%;
      background-color: var(--bg-dark-800);
      padding: 1.25rem;
      border-right: 1px solid var(--border-gray-700);
      z-index: 10;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    @media (min-width: 1024px) {
      .controls-sidebar { width: 320px; min-width: 320px; height: 100vh; }
    }

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--green-400); display: flex; align-items: center; gap: 0.5rem; }

    /* Forms */
    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; }
    .input-field:focus { outline: none; border-color: var(--green-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .row-flex { display: flex; gap: 0.5rem; align-items: center; }
    
    /* Buttons */
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
    .btn-secondary { background-color: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-600); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-600); }

    /* Action Panels */
    .action-panel { background: rgba(0,0,0,0.15); border: 1px solid var(--border-gray-700); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem; }
    .panel-header { font-size: 0.75rem; color: var(--text-gray-300); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; }

    /* Playback Controls */
    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--green-500); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--green-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--green-400); border-color: var(--green-500); }
    
    /* Main Area */
    .main-content { flex: 1; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; background-color: var(--bg-dark-950); }
    .status-bar { padding: 0.75rem 1rem; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center; }
    .status-text { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: var(--yellow-400); }
    
    /* Canvas */
    .top-layout { display: flex; flex-direction: column; gap: 1rem; flex: 2; min-height: 400px; }
    @media (min-width: 1280px) { .top-layout { flex-direction: row; } }
    
    .canvas-wrapper { flex: 2; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; overflow: hidden; min-height: 350px; }
    .info-wrapper { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; min-width: 300px; }
    
    /* Node and Edge Styling */
    .graph-node {
      position: absolute; width: 2.8rem; height: 2.8rem; background: var(--bg-dark-700); border: 2px solid var(--border-gray-500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: monospace; transform: translate(-50%, -50%); transition: all 0.3s ease; z-index: 10; cursor: grab; user-select: none; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .graph-node.visiting { background: var(--yellow-500); color: #000; border-color: var(--yellow-400); transform: translate(-50%, -50%) scale(1.15); box-shadow: 0 0 15px rgba(234,179,8,0.6); z-index: 12; }
    .graph-node.visited { background: var(--cyan-600); border-color: var(--cyan-400); color: white; }
    .graph-node.finished { background: var(--green-600); border-color: var(--green-400); color: white; }
    .graph-node.error { background: var(--red-600); border-color: var(--red-400); color: white; animation: shake 0.5s; }
    
    @keyframes shake {
      0%, 100% { transform: translate(-50%, -50%); }
      25% { transform: translate(-55%, -50%); }
      75% { transform: translate(-45%, -50%); }
    }

    .edge-line { stroke: var(--border-gray-600); stroke-width: 0.35; transition: all 0.3s ease; fill: none; }
    .edge-line.inspecting { stroke: var(--yellow-500); stroke-width: 0.5; stroke-dasharray: 1.5,1; animation: travel 1s linear infinite; }
    .edge-line.processed { stroke: var(--green-500); stroke-width: 0.4; opacity: 0.6; }
    .edge-line.error { stroke: var(--red-500); stroke-width: 0.6; stroke-dasharray: 1,1; }
    @keyframes travel { to { stroke-dashoffset: -10; } }

    /* Tables & DS Panels */
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--green-400); display: flex; justify-content: space-between; }
    
    .ds-content-area { padding: 0.75rem; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 1rem; }
    
    .linear-ds-container { display: flex; flex-wrap: wrap; gap: 0.25rem; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); padding: 0.5rem; border-radius: 0.375rem; min-height: 3.5rem; }
    .ds-item { background: var(--bg-dark-700); border: 1px solid var(--border-gray-500); padding: 0.35rem 0.6rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; justify-content: center; min-width: 2rem; transition: all 0.2s; }
    .ds-item.highlight { background: var(--yellow-500); color: black; border-color: var(--yellow-400); transform: scale(1.1); }
    .ds-item.done { background: var(--green-600); color: white; border-color: var(--green-400); }
    
    .in-degree-table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.8rem; }
    .in-degree-table th, .in-degree-table td { padding: 0.4rem; text-align: center; border: 1px solid var(--border-gray-700); }
    .in-degree-table th { background: var(--bg-dark-900); color: var(--text-gray-400); }
    .in-degree-table td { color: var(--text-gray-200); background: var(--bg-dark-800); }
    .in-degree-table td.highlight { background: rgba(234, 179, 8, 0.2); color: var(--yellow-400); font-weight: bold; }
    .in-degree-table td.zero { background: rgba(34, 197, 94, 0.2); color: var(--green-400); font-weight: bold; }

    /* Bottom Row: Code & Logs */
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 220px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(34, 197, 94, 0.25); border-left: 3px solid var(--green-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--yellow-400); border-radius: 0.25rem; border-left: 2px solid var(--yellow-400); }
    .log-item.error { color: var(--red-400); border-left-color: var(--red-500); }
  `}</style>
);

const ALGO_CODES = {
  kahn: {
    python: [
      "def kahn_topological_sort(graph, V):",
      "    in_degree = {i: 0 for i in range(V)}",
      "    for u in range(V):",
      "        for v in graph[u]:",
      "            in_degree[v] += 1",
      "",
      "    queue = deque([i for i in range(V) if in_degree[i] == 0])",
      "    result = []",
      "",
      "    while queue:",
      "        u = queue.popleft()",
      "        result.append(u)",
      "",
      "        for v in graph[u]:",
      "            in_degree[v] -= 1",
      "            if in_degree[v] == 0:",
      "                queue.append(v)",
      "",
      "    if len(result) != V:",
      "        return 'Cycle detected!'",
      "    return result"
    ],
    cpp: [
      "vector<int> kahnTopologicalSort(int V, vector<vector<int>>& adj) {",
      "    vector<int> in_degree(V, 0);",
      "    for (int u = 0; u < V; u++) {",
      "        for (int v : adj[u]) {",
      "            in_degree[v]++;",
      "        }",
      "    }",
      "",
      "    queue<int> q;",
      "    for (int i = 0; i < V; i++) {",
      "        if (in_degree[i] == 0) q.push(i);",
      "    }",
      "",
      "    vector<int> result;",
      "    while (!q.empty()) {",
      "        int u = q.front(); q.pop();",
      "        result.push_back(u);",
      "",
      "        for (int v : adj[u]) {",
      "            in_degree[v]--;",
      "            if (in_degree[v] == 0) q.push(v);",
      "        }",
      "    }",
      "",
      "    if (result.size() != V) return {}; // Cycle",
      "    return result;",
      "}"
    ],
    java: [
      "public List<Integer> kahnTopologicalSort(int V, List<List<Integer>> adj) {",
      "    int[] inDegree = new int[V];",
      "    for (int u = 0; u < V; u++) {",
      "        for (int v : adj.get(u)) {",
      "            inDegree[v]++;",
      "        }",
      "    }",
      "",
      "    Queue<Integer> q = new LinkedList<>();",
      "    for (int i = 0; i < V; i++) {",
      "        if (inDegree[i] == 0) q.add(i);",
      "    }",
      "",
      "    List<Integer> result = new ArrayList<>();",
      "    while (!q.isEmpty()) {",
      "        int u = q.poll();",
      "        result.add(u);",
      "",
      "        for (int v : adj.get(u)) {",
      "            inDegree[v]--;",
      "            if (inDegree[v] == 0) q.add(v);",
      "        }",
      "    }",
      "",
      "    if (result.size() != V) return new ArrayList<>(); // Cycle",
      "    return result;",
      "}"
    ]
  },
  dfs: {
    python: [
      "def dfs_topological_sort(graph, V):",
      "    visited = set()",
      "    path = set() # For cycle detection",
      "    stack = []",
      "",
      "    def dfs(u):",
      "        visited.add(u)",
      "        path.add(u)",
      "        for v in graph[u]:",
      "            if v in path:",
      "                return False # Cycle detected",
      "            if v not in visited:",
      "                if not dfs(v): return False",
      "        path.remove(u)",
      "        stack.append(u)",
      "        return True",
      "",
      "    for i in range(V):",
      "        if i not in visited:",
      "            if not dfs(i): return 'Cycle detected!'",
      "",
      "    return stack[::-1] # Return reversed stack"
    ],
    cpp: [
      "bool dfs(int u, vector<vector<int>>& adj, vector<bool>& vis, ",
      "         vector<bool>& path, vector<int>& st) {",
      "    vis[u] = true; path[u] = true;",
      "    for (int v : adj[u]) {",
      "        if (path[v]) return false; // Cycle",
      "        if (!vis[v]) {",
      "            if (!dfs(v, adj, vis, path, st)) return false;",
      "        }",
      "    }",
      "    path[u] = false;",
      "    st.push_back(u);",
      "    return true;",
      "}",
      "",
      "vector<int> dfsTopologicalSort(int V, vector<vector<int>>& adj) {",
      "    vector<bool> vis(V, false), path(V, false);",
      "    vector<int> st;",
      "    for (int i = 0; i < V; i++) {",
      "        if (!vis[i]) {",
      "            if (!dfs(i, adj, vis, path, st)) return {};",
      "        }",
      "    }",
      "    reverse(st.begin(), st.end());",
      "    return st;",
      "}"
    ],
    java: [
      "boolean dfs(int u, List<List<Integer>> adj, boolean[] vis, ",
      "            boolean[] path, Stack<Integer> st) {",
      "    vis[u] = true; path[u] = true;",
      "    for (int v : adj.get(u)) {",
      "        if (path[v]) return false; // Cycle",
      "        if (!vis[v]) {",
      "            if (!dfs(v, adj, vis, path, st)) return false;",
      "        }",
      "    }",
      "    path[u] = false;",
      "    st.push(u);",
      "    return true;",
      "}",
      "",
      "List<Integer> dfsTopologicalSort(int V, List<List<Integer>> adj) {",
      "    boolean[] vis = new boolean[V]; boolean[] path = new boolean[V];",
      "    Stack<Integer> st = new Stack<>();",
      "    for (int i = 0; i < V; i++) {",
      "        if (!vis[i]) {",
      "            if (!dfs(i, adj, vis, path, st)) return new ArrayList<>();",
      "        }",
      "    }",
      "    List<Integer> result = new ArrayList<>();",
      "    while (!st.isEmpty()) result.add(st.pop());",
      "    return result;",
      "}"
    ]
  }
};

const LINE_MAPS = {
  kahn: {
    python: { initIn: 2, compIn: 5, initQ: 7, initRes: 8, loop: 10, pop: 11, pushRes: 12, loopAdj: 14, decIn: 15, checkZero: 16, pushQ: 17, cycleCheck: 19 },
    cpp: { initIn: 2, compIn: 5, initQ: 9, initRes: 13, loop: 14, pop: 15, pushRes: 16, loopAdj: 18, decIn: 19, checkZero: 20, pushQ: 20, cycleCheck: 23 },
    java: { initIn: 2, compIn: 5, initQ: 9, initRes: 14, loop: 15, pop: 16, pushRes: 17, loopAdj: 19, decIn: 20, checkZero: 21, pushQ: 21, cycleCheck: 25 }
  },
  dfs: {
    python: { callDfs: 19, dfsIn: 7, loopAdj: 9, cycleCheck: 11, recDfs: 13, pathRem: 14, pushStack: 15, reverse: 21 },
    cpp: { callDfs: 16, dfsIn: 3, loopAdj: 4, cycleCheck: 5, recDfs: 7, pathRem: 10, pushStack: 11, reverse: 20 },
    java: { callDfs: 17, dfsIn: 3, loopAdj: 4, cycleCheck: 5, recDfs: 7, pathRem: 10, pushStack: 11, reverse: 22 }
  }
};

const PRESETS = {
  dag1: {
    nodes: [
      { id: 0, label: '0', x: 20, y: 30 }, { id: 1, label: '1', x: 20, y: 70 },
      { id: 2, label: '2', x: 50, y: 50 }, { id: 3, label: '3', x: 80, y: 30 },
      { id: 4, label: '4', x: 80, y: 70 }, { id: 5, label: '5', x: 50, y: 20 }
    ],
    edges: [
      { from: 5, to: 0 }, { from: 5, to: 2 }, { from: 4, to: 0 },
      { from: 4, to: 1 }, { from: 2, to: 3 }, { from: 3, to: 1 }
    ] // Standard DAG
  },
  dependencies: {
    nodes: [
      { id: 0, label: 'UI', x: 80, y: 20 }, { id: 1, label: 'API', x: 50, y: 40 },
      { id: 2, label: 'DB', x: 20, y: 60 }, { id: 3, label: 'Auth', x: 50, y: 80 },
      { id: 4, label: 'Config', x: 20, y: 20 }
    ],
    edges: [
      { from: 4, to: 1 }, { from: 4, to: 2 }, { from: 2, to: 1 },
      { from: 3, to: 1 }, { from: 1, to: 0 }
    ]
  },
  cycle: {
    nodes: [
      { id: 0, label: 'A', x: 30, y: 50 }, { id: 1, label: 'B', x: 70, y: 20 },
      { id: 2, label: 'C', x: 70, y: 80 }
    ],
    edges: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }
    ] // Has a cycle
  }
};

const generateKahnFrames = (nodes, edges) => {
  const frames = [];
  const inDegree = {};
  nodes.forEach(n => inDegree[n.id] = 0);
  let nodeStates = {}; let edgeStates = {};
  const queue = [];
  const result = [];
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { inDegree: {...inDegree}, queue: [...queue], result: [...result] },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  addFrame('initIn', `Initialized in-degree array to 0 for all nodes.`);

  // Compute In-degrees
  edges.forEach(e => {
    inDegree[e.to]++;
    edgeStates[`${e.from}-${e.to}`] = 'inspecting';
    addFrame('compIn', `Edge ${nodes.find(n=>n.id===e.from).label} -> ${nodes.find(n=>n.id===e.to).label}. Incremented in-degree of ${nodes.find(n=>n.id===e.to).label}.`);
    edgeStates[`${e.from}-${e.to}`] = 'default';
  });

  // Initialize Queue
  nodes.forEach(n => {
    if (inDegree[n.id] === 0) {
      queue.push(n.id);
      nodeStates[n.id] = 'visiting';
    }
  });
  addFrame('initQ', `Enqueued all nodes with in-degree 0: [${queue.map(id => nodes.find(n=>n.id===id).label).join(', ')}].`);
  addFrame('initRes', `Initialized empty result list.`);

  while (queue.length > 0) {
    addFrame('loop', `Queue is not empty.`);
    const u = queue.shift();
    const uLabel = nodes.find(n=>n.id===u).label;
    nodeStates[u] = 'finished';
    
    addFrame('pop', `Dequeued node ${uLabel}.`);
    
    result.push(u);
    addFrame('pushRes', `Appended ${uLabel} to result array.`);

    const neighbors = edges.filter(e => e.from === u);
    for (let e of neighbors) {
      const v = e.to;
      const vLabel = nodes.find(n=>n.id===v).label;
      edgeStates[`${u}-${v}`] = 'processed';
      
      addFrame('loopAdj', `Exploring neighbor ${vLabel} of ${uLabel}.`);
      
      inDegree[v]--;
      addFrame('decIn', `Decremented in-degree of ${vLabel} to ${inDegree[v]}.`, { highlightInDegree: v });
      
      addFrame('checkZero', `Checking if in-degree of ${vLabel} is 0.`);
      if (inDegree[v] === 0) {
        queue.push(v);
        nodeStates[v] = 'visiting';
        addFrame('pushQ', `In-degree is 0! Enqueued ${vLabel}.`);
      }
    }
  }

  if (result.length !== nodes.length) {
    nodes.forEach(n => {
      if (!result.includes(n.id)) nodeStates[n.id] = 'error';
    });
    addFrame('cycleCheck', `Result size (${result.length}) != Total Nodes (${nodes.length}). Cycle detected! Topological sort impossible.`, { isError: true });
  } else {
    addFrame('cycleCheck', `Result size matches Total Nodes. Topological Sort Complete!`);
  }

  return frames;
};

const generateDFSFrames = (nodes, edges) => {
  const frames = [];
  const visited = new Set();
  const path = new Set(); // Recursion stack for cycle detection
  const stack = [];
  let nodeStates = {}; let edgeStates = {};
  let cycleFound = false;
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { visited: new Set(visited), path: new Set(path), stack: [...stack], result: cycleFound ? [] : [...stack].reverse() },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  addFrame(null, `Initialized Visited set, Path set (for cycles), and output Stack.`);

  const dfs = (u) => {
    visited.add(u);
    path.add(u);
    nodeStates[u] = 'visiting';
    const uLabel = nodes.find(n=>n.id===u).label;
    addFrame('dfsIn', `DFS visiting ${uLabel}. Added to Visited and Path sets.`);

    const neighbors = edges.filter(e => e.from === u);
    for (let e of neighbors) {
      if (cycleFound) return false;
      const v = e.to;
      const vLabel = nodes.find(n=>n.id===v).label;
      edgeStates[`${u}-${v}`] = 'inspecting';
      
      addFrame('loopAdj', `Checking neighbor ${vLabel} of ${uLabel}.`);
      
      if (path.has(v)) {
        cycleFound = true;
        nodeStates[v] = 'error';
        edgeStates[`${u}-${v}`] = 'error';
        addFrame('cycleCheck', `Node ${vLabel} is already in the current path! Cycle detected (Back-edge).`, { isError: true });
        return false;
      }
      
      if (!visited.has(v)) {
        addFrame('recDfs', `Node ${vLabel} is unvisited. Recursively calling DFS(${vLabel}).`);
        if (!dfs(v)) return false;
      } else {
        addFrame('loopAdj', `Node ${vLabel} is already fully visited (Cross/Forward-edge). Skipping.`);
      }
      edgeStates[`${u}-${v}`] = 'processed';
    }

    if (cycleFound) return false;
    
    path.delete(u);
    addFrame('pathRem', `Finished exploring neighbors of ${uLabel}. Removed from Path set.`);
    
    stack.push(u);
    nodeStates[u] = 'finished';
    addFrame('pushStack', `Pushed ${uLabel} to Stack.`);
    return true;
  };

  for (let n of nodes) {
    if (cycleFound) break;
    if (!visited.has(n.id)) {
      addFrame('callDfs', `Node ${n.label} unvisited. Starting DFS.`);
      dfs(n.id);
    }
  }

  if (!cycleFound) {
    addFrame('reverse', `All nodes visited. Stack is reversed to produce final Topological Order.`);
  }

  return frames;
};


export default function TopologicalSortVisualizer() {
  const [nodes, setNodes] = useState(PRESETS.dag1.nodes);
  const [edges, setEdges] = useState(PRESETS.dag1.edges);
  const [activeAlgo, setActiveAlgo] = useState("kahn");
  const [language, setLanguage] = useState("python");
  
  const [nodeLabel, setNodeLabel] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  
  const canvasRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIdx(p => p + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  const resetSim = () => { setFrames([]); setFrameIdx(-1); setIsPlaying(false); };

  const handleAddNode = () => {
    if (frames.length > 0) return;
    const label = nodeLabel.trim() || `${nodes.length}`;
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    setNodes([...nodes, { id: newId, label: label.substring(0,3), x: 50, y: 50 }]);
    setNodeLabel(""); resetSim();
  };

  const handleAddEdge = () => {
    if (frames.length > 0) return;
    const f = parseInt(edgeFrom), t = parseInt(edgeTo);
    if (isNaN(f) || isNaN(t) || f === t) return;
    if (edges.some(e => e.from === f && e.to === t)) return;
    setEdges([...edges, { from: f, to: t }]);
    setEdgeFrom(""); setEdgeTo(""); resetSim();
  };

  const handleClear = () => { if (frames.length > 0) return; setNodes([]); setEdges([]); resetSim(); };
  const loadPreset = (key) => { if (frames.length > 0) return; const p = PRESETS[key]; setNodes(p.nodes); setEdges(p.edges); resetSim(); };

  const handleMouseMove = (e) => {
    if (draggedNodeId === null || !canvasRef.current || frames.length > 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    setNodes(nodes.map(n => n.id === draggedNodeId ? { ...n, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : n));
  };

  const executeAlgorithm = () => {
    resetSim();
    if (nodes.length === 0) return;
    let newFrames = [];
    if (activeAlgo === 'kahn') newFrames = generateKahnFrames(nodes, edges);
    if (activeAlgo === 'dfs') newFrames = generateDFSFrames(nodes, edges);
    
    setFrames(newFrames); setFrameIdx(0); setIsPlaying(true);
  };

  const currFrame = frames[frameIdx] || { ds: {}, nodeStates: {}, edgeStates: {}, logMsg: 'Ready. Compile & Run to visualize.', lineKey: null };
  const highlightLine = currFrame.lineKey ? LINE_MAPS[activeAlgo][language][currFrame.lineKey] : -1;
  const isLocked = frames.length > 0;

  const renderEdge = (edge, idx) => {
    const fn = nodes.find(n=>n.id===edge.from), tn = nodes.find(n=>n.id===edge.to);
    if(!fn || !tn) return null;
    
    const isBidi = edges.some(e => e.from === edge.to && e.to === edge.from);
    const state = currFrame.edgeStates[`${edge.from}-${edge.to}`] || 'default';
    
    const cssClass = `edge-line ${state}`;
    const marker = `url(#arrow${state!=='default'?'-'+state:''})`;

    if (isBidi) {
      const dx = tn.x - fn.x; const dy = tn.y - fn.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const nx = -dy / dist; const ny = dx / dist;
      const offset = 8; 
      const cx = (fn.x + tn.x)/2 + nx * offset;
      const cy = (fn.y + tn.y)/2 + ny * offset;
      return <path key={idx} d={`M ${fn.x} ${fn.y} Q ${cx} ${cy} ${tn.x} ${tn.y}`} className={cssClass} markerEnd={marker} />;
    } else {
      return <line key={idx} x1={`${fn.x}%`} y1={`${fn.y}%`} x2={`${tn.x}%`} y2={`${tn.y}%`} className={cssClass} markerEnd={marker} />;
    }
  };

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><ListOrdered size={24} /> Topo Sort Vis</h1>
        
        <div className="playback-panel">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button onClick={executeAlgorithm} className="btn btn-green" disabled={isLocked || !nodes.length}>
              <Play size={16}/> Compile
            </button>
            <button onClick={resetSim} className="btn btn-secondary" disabled={!isLocked} title="Reset Simulation">
              <RefreshCw size={16}/> Reset
            </button>
          </div>
          
          <input type="range" className="slider" min="-1" max={frames.length ? frames.length-1 : 0} value={frameIdx} onChange={e => {setFrameIdx(Number(e.target.value)); setIsPlaying(false);}} disabled={!isLocked} />
          
          <div className="player-controls">
            <button className="ctrl-btn" onClick={() => {setFrameIdx(-1); setIsPlaying(false);}} disabled={frameIdx <= -1}><RotateCcw size={16}/></button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p-1); setIsPlaying(false);}} disabled={frameIdx <= 0}><SkipBack size={16}/></button>
            <button className="ctrl-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={!isLocked || frameIdx === frames.length-1}>
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p+1); setIsPlaying(false);}} disabled={!isLocked || frameIdx >= frames.length-1}><SkipForward size={16}/></button>
          </div>
          
          <div style={{marginTop: '0.75rem'}}>
            <label style={{fontSize:'0.65rem', color:'var(--green-400)', display:'flex', justifyContent:'space-between'}}><span>Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm</label>
          <select value={activeAlgo} onChange={e => {setActiveAlgo(e.target.value); resetSim();}} className="input-field" disabled={isLocked}>
            <option value="kahn">Kahn's Algorithm (BFS)</option>
            <option value="dfs">DFS-Based Approach</option>
          </select>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        <div className="action-panel" style={{background: 'var(--bg-dark-950)'}}>
          <div className="panel-header" style={{display:'flex', justifyContent:'space-between'}}>
            <span>DAG Editor</span>
            <select onChange={e => loadPreset(e.target.value)} className="input-field" style={{width:'auto', padding:'0.2rem', fontSize:'0.7rem'}} disabled={isLocked}>
              <option value="dag1">Preset: DAG</option>
              <option value="dependencies">Preset: Dependencies</option>
              <option value="cycle">Preset: Cycle (Error)</option>
            </select>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="text" placeholder="Node Name" value={nodeLabel} onChange={e=>setNodeLabel(e.target.value)} className="input-field" disabled={isLocked} />
            <button onClick={handleAddNode} className="btn btn-cyan" style={{width:'auto'}} disabled={isLocked}><Plus size={16}/></button>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <select value={edgeFrom} onChange={e=>setEdgeFrom(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={isLocked}><option value="">From</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <ArrowRight size={14} style={{color:'var(--text-gray-500)', flexShrink:0}}/>
            <select value={edgeTo} onChange={e=>setEdgeTo(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={isLocked}><option value="">To</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <button onClick={handleAddEdge} className="btn btn-green" style={{width:'auto'}} disabled={isLocked}>Add</button>
          </div>

          <div className="row-flex">
            <button onClick={handleClear} className="btn btn-red" disabled={isLocked}><Trash2 size={14}/> Clear Nodes</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
          {currFrame.isError && <span style={{fontSize:'0.75rem', padding:'0.2rem 0.5rem', background:'var(--red-500)', color:'white', borderRadius:'1rem', fontWeight:'bold'}}>ERROR: CYCLE</span>}
        </div>

        <div className="top-layout">
          <div className="canvas-wrapper" ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={()=>setDraggedNodeId(null)} onMouseLeave={()=>setDraggedNodeId(null)}>
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', zIndex:5, fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold'}}>GRAPH CANVAS</div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}} preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                {/* Fixed arrows: smaller scale relative to 0.35 line width, precise refX */}
                <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-gray-600)"/></marker>
                <marker id="arrow-inspecting" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--yellow-500)"/></marker>
                <marker id="arrow-processed" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--green-500)" opacity="0.6"/></marker>
                <marker id="arrow-error" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--red-500)"/></marker>
              </defs>
              {edges.map((edge, idx) => renderEdge(edge, idx))}
            </svg>

            {nodes.map(node => (
              <div key={node.id} className={`graph-node ${currFrame.nodeStates[node.id] || 'default'}`}
                   style={{left:`${node.x}%`, top:`${node.y}%`, cursor: isLocked ? 'default' : 'grab'}} onMouseDown={e => {if(!isLocked) { e.preventDefault(); setDraggedNodeId(node.id); }}}>
                {node.label}
              </div>
            ))}
          </div>

          <div className="info-wrapper">
            <div className="ds-header">
              <span>Data Structures</span>
            </div>
            
            <div className="ds-content-area">
              {/* Kahn Data Structures */}
              {activeAlgo === 'kahn' && (
                <>
                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>IN-DEGREE ARRAY</div>
                    <table className="in-degree-table">
                      <thead><tr>{nodes.map(n => <th key={n.id}>{n.label}</th>)}</tr></thead>
                      <tbody>
                        <tr>
                          {nodes.map(n => {
                            const val = currFrame.ds.inDegree?.[n.id] ?? '-';
                            return <td key={n.id} className={`${val===0?'zero':''} ${currFrame.highlightInDegree===n.id?'highlight':''}`}>{val}</td>;
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>QUEUE</div>
                    <div className="linear-ds-container">
                      {currFrame.ds.queue?.map((id, i) => (
                         <div key={i} className={`ds-item ${i===0 ? 'highlight' : ''}`}>{nodes.find(n=>n.id===id)?.label}</div>
                      ))}
                      {!currFrame.ds.queue?.length && <div style={{color:'var(--text-gray-600)', margin:'auto', fontSize:'0.8rem', fontStyle:'italic'}}>Empty</div>}
                    </div>
                  </div>
                </>
              )}

              {/* DFS Data Structures */}
              {activeAlgo === 'dfs' && (
                <>
                  <div style={{display:'flex', gap:'1rem'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>VISITED SET</div>
                      <div className="linear-ds-container" style={{minHeight: '2.5rem'}}>
                        {Array.from(currFrame.ds.visited || []).map((id, i) => (
                           <div key={i} className="ds-item" style={{background:'var(--bg-dark-800)', borderColor:'var(--cyan-600)'}}>{nodes.find(n=>n.id===id)?.label}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>PATH SET (Recursion)</div>
                      <div className="linear-ds-container" style={{minHeight: '2.5rem'}}>
                        {Array.from(currFrame.ds.path || []).map((id, i) => (
                           <div key={i} className="ds-item highlight">{nodes.find(n=>n.id===id)?.label}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>STACK</div>
                    <div className="linear-ds-container">
                      {currFrame.ds.stack?.map((id, i) => (
                         <div key={i} className="ds-item" style={{background:'var(--bg-dark-800)'}}>{nodes.find(n=>n.id===id)?.label}</div>
                      ))}
                      {!currFrame.ds.stack?.length && <div style={{color:'var(--text-gray-600)', margin:'auto', fontSize:'0.8rem', fontStyle:'italic'}}>Empty</div>}
                    </div>
                  </div>
                </>
              )}

              {/* Shared Result Output */}
              <div style={{marginTop: 'auto'}}>
                 <div style={{fontSize:'0.7rem', color:'var(--green-400)', marginBottom:'0.3rem', fontWeight:'bold'}}>TOPOLOGICAL ORDER (RESULT)</div>
                 <div className="linear-ds-container" style={{background:'var(--bg-dark-950)', border:'1px solid var(--green-600)'}}>
                   {currFrame.ds.result?.map((id, i) => (
                      <div key={i} className="ds-item done">{nodes.find(n=>n.id===id)?.label}</div>
                   ))}
                   {!currFrame.ds.result?.length && <div style={{color:'var(--text-gray-600)', margin:'auto', fontSize:'0.8rem', fontStyle:'italic'}}>{currFrame.isError ? "Impossible (Cycle)" : "Awaiting..."}</div>}
                 </div>
              </div>

            </div>
          </div>
        </div>

        <div className="bottom-layout">
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center', justifyContent: 'space-between', borderBottom:'1px solid var(--border-gray-700)'}}>
               <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                 <Code size={14}/> Algorithm Tracker
               </div>
               <select 
                 value={language} 
                 onChange={e => setLanguage(e.target.value)} 
                 style={{ background: 'var(--bg-dark-900)', color: 'var(--green-400)', border: '1px solid var(--border-gray-700)', borderRadius: '0.25rem', padding: '0.1rem 0.4rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
               >
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
                 <option value="java">Java</option>
               </select>
             </div>
              <pre className="code-content"><code>
                {ALGO_CODES[activeAlgo][language].map((line, idx) => {
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
                  return (
                    <span key={idx} className={`code-line ${highlightLine === (idx + 1) ? 'highlight' : ''}`} style={isComment ? {color: 'var(--text-gray-500)', fontStyle: 'italic'} : {}}>
                      {line || '\u00A0'}
                    </span>
                  );
                })}
              </code></pre>
          </div>
          
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><Info size={14}/> Execution Log</div>
             <ul className="log-content">
               {frames.length === 0 && <li className="log-item">Awaiting execution...</li>}
               {frames.slice(0, frameIdx + 1).map((f, idx) => (
                 <li key={idx} className={`log-item ${idx === frameIdx ? 'active' : ''} ${f.isError ? 'error' : ''}`}>
                   <span style={{color:'var(--text-gray-500)', marginRight:'0.4rem'}}>[{idx}]</span> {f.logMsg}
                 </li>
               ))}
               <div ref={logEndRef} />
             </ul>
          </div>
        </div>
      </main>
    </div>
  );
}