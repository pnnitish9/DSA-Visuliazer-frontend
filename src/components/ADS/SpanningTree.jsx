import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, Trash2, ArrowRight, SkipBack, SkipForward, RotateCcw, Code, Settings, Map, Info, Share2, Component, GitCommit } from 'lucide-react';

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
      --orange-500: #f97316;
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

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--orange-400); display: flex; align-items: center; gap: 0.5rem; }

    /* Complexity Box */
    .complexity-box { background: rgba(0,0,0,0.15); border: 1px dashed var(--border-gray-700); border-radius: 0.375rem; padding: 0.5rem; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .comp-item { display: flex; justify-content: space-between; align-items: center; }
    .comp-label { color: var(--text-gray-400); font-family: 'Inter', -apple-system, sans-serif; font-size: 0.65rem; text-transform: uppercase; font-weight: 700; }
    .comp-val { color: var(--orange-400); font-family: 'Fira Code', monospace; font-weight: bold; font-size: 0.75rem; }

    /* Forms */
    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; }
    .input-field:focus { outline: none; border-color: var(--orange-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .row-flex { display: flex; gap: 0.5rem; align-items: center; }
    
    /* Buttons */
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-orange { background-color: var(--orange-600); color: white; }
    .btn-orange:hover:not(:disabled) { background-color: var(--orange-500); }
    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
    .btn-secondary { background-color: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-600); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-600); }

    /* Action Panels */
    .action-panel { background: rgba(0,0,0,0.15); border: 1px solid var(--border-gray-700); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem; }
    .panel-header { font-size: 0.75rem; color: var(--text-gray-300); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; }

    /* Playback Controls */
    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--orange-500); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--orange-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--orange-400); border-color: var(--orange-500); }
    
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
    .graph-node.visited { background: var(--bg-dark-600); border-color: var(--border-gray-400); color: var(--text-gray-100); }
    .graph-node.mst { background: var(--cyan-600); border-color: var(--cyan-400); color: white; box-shadow: 0 0 10px rgba(34,211,238,0.5); }
    
    .edge-line { stroke: var(--border-gray-600); stroke-width: 3; transition: all 0.3s ease; fill: none; }
    .edge-line.inspecting { stroke: var(--yellow-500); stroke-width: 5; stroke-dasharray: 6,4; animation: dash 1s linear infinite; }
    .edge-line.mst { stroke: var(--cyan-500); stroke-width: 5; }
    .edge-line.discarded { stroke: var(--border-gray-700); stroke-width: 2; opacity: 0.5; }
    @keyframes dash { to { stroke-dashoffset: -20; } }

    .edge-weight-bg { fill: var(--bg-dark-900); rx: 4; ry: 4; transition: all 0.3s ease;}
    .edge-weight-text { fill: var(--text-gray-200); font-size: 0.75rem; font-family: monospace; font-weight: bold; text-anchor: middle; dominant-baseline: central; user-select: none; transition: all 0.3s ease;}
    
    /* Specific edge weight coloring */
    .edge-weight-bg.inspecting { fill: var(--yellow-500); }
    .edge-weight-text.inspecting { fill: #000; }
    .edge-weight-bg.mst { fill: var(--cyan-600); stroke: var(--cyan-400); stroke-width: 1px;}
    .edge-weight-text.mst { fill: white; }
    .edge-weight-bg.discarded { fill: var(--bg-dark-800); opacity: 0.5; }
    .edge-weight-text.discarded { fill: var(--text-gray-500); }

    /* Tables & DS Panels */
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--orange-400); display: flex; justify-content: space-between; }
    .ds-content-area { padding: 0.75rem; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 1rem; }
    
    .linear-ds-container { display: flex; flex-wrap: wrap; gap: 0.25rem; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); padding: 0.5rem; border-radius: 0.375rem; min-height: 3.5rem; }
    .ds-item { background: var(--bg-dark-700); border: 1px solid var(--border-gray-500); padding: 0.35rem 0.6rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--text-gray-200); }
    .ds-item.highlight { background: var(--yellow-500); color: black; border-color: var(--yellow-400); transform: scale(1.05); }
    .ds-item.mst-item { background: var(--cyan-600); color: white; border-color: var(--cyan-400); }
    .ds-item.discarded { opacity: 0.4; text-decoration: line-through; }
    
    .dsu-table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.8rem; }
    .dsu-table th, .dsu-table td { padding: 0.4rem; text-align: center; border: 1px solid var(--border-gray-700); }
    .dsu-table th { background: var(--bg-dark-900); color: var(--text-gray-400); }
    .dsu-table td { color: var(--text-gray-200); background: var(--bg-dark-800); }
    .dsu-table td.highlight { background: rgba(234, 179, 8, 0.2); color: var(--yellow-400); font-weight: bold; border: 1px solid var(--yellow-500); }

    /* Bottom Row: Code & Logs */
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 220px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(249, 115, 22, 0.25); border-left: 3px solid var(--orange-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--yellow-400); border-radius: 0.25rem; border-left: 2px solid var(--yellow-400); }
  `}</style>
);

const ALGO_CODES = {
  prim: {
    python: [
      "def prim(graph, V, start):",
      "    visited = {start}",
      "    mst_edges = []",
      "    pq = [(w, start, v) for v, w in graph[start]]",
      "    heapq.heapify(pq)",
      "",
      "    while pq and len(visited) < V:",
      "        weight, u, v = heapq.heappop(pq)",
      "        if v in visited:",
      "            continue",
      "",
      "        visited.add(v)",
      "        mst_edges.append((u, v, weight))",
      "",
      "        for next_v, w in graph[v]:",
      "            if next_v not in visited:",
      "                heapq.heappush(pq, (w, v, next_v))",
      "",
      "    return mst_edges"
    ],
    cpp: [
      "vector<Edge> prim(int V, vector<vector<pair<int, int>>>& adj, int start) {",
      "    vector<bool> visited(V, false);",
      "    visited[start] = true;",
      "    priority_queue<Edge, vector<Edge>, greater<Edge>> pq;",
      "    for (auto& edge : adj[start]) pq.push({edge.weight, start, edge.to});",
      "",
      "    vector<Edge> mst_edges;",
      "    while (!pq.empty() && mst_edges.size() < V - 1) {",
      "        auto [weight, u, v] = pq.top(); pq.pop();",
      "        if (visited[v]) continue;",
      "",
      "        visited[v] = true;",
      "        mst_edges.push_back({weight, u, v});",
      "",
      "        for (auto& edge : adj[v]) {",
      "            if (!visited[edge.to]) pq.push({edge.weight, v, edge.to});",
      "        }",
      "    }",
      "    return mst_edges;",
      "}"
    ],
    java: [
      "public List<Edge> prim(int V, List<List<Edge>> adj, int start) {",
      "    boolean[] visited = new boolean[V];",
      "    visited[start] = true;",
      "    PriorityQueue<Edge> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e.weight));",
      "    pq.addAll(adj.get(start));",
      "",
      "    List<Edge> mstEdges = new ArrayList<>();",
      "    while (!pq.isEmpty() && mstEdges.size() < V - 1) {",
      "        Edge curr = pq.poll();",
      "        if (visited[curr.to]) continue;",
      "",
      "        visited[curr.to] = true;",
      "        mstEdges.add(curr);",
      "",
      "        for (Edge edge : adj.get(curr.to)) {",
      "            if (!visited[edge.to]) pq.offer(new Edge(curr.to, edge.to, edge.weight));",
      "        }",
      "    }",
      "    return mstEdges;",
      "}"
    ]
  },
  kruskal: {
    python: [
      "def kruskal(V, edges):",
      "    parent = {i: i for i in range(V)}",
      "    rank = {i: 0 for i in range(V)}",
      "",
      "    def find(i):",
      "        if parent[i] == i: return i",
      "        parent[i] = find(parent[i]) # Path compression",
      "        return parent[i]",
      "",
      "    def union(i, j):",
      "        root_i = find(i)",
      "        root_j = find(j)",
      "        if root_i != root_j:",
      "            if rank[root_i] < rank[root_j]: parent[root_i] = root_j",
      "            elif rank[root_i] > rank[root_j]: parent[root_j] = root_i",
      "            else: parent[root_j] = root_i; rank[root_i] += 1",
      "",
      "    mst_edges = []",
      "    edges.sort(key=lambda x: x.weight)",
      "",
      "    for edge in edges:",
      "        if find(edge.u) != find(edge.v):",
      "            union(edge.u, edge.v)",
      "            mst_edges.append(edge)",
      "",
      "    return mst_edges"
    ],
    cpp: [
      "struct DSU { ... }; // Contains find(i) and union(i, j) with path compression and rank",
      "",
      "vector<Edge> kruskal(int V, vector<Edge>& edges) {",
      "    DSU dsu(V);",
      "    vector<Edge> mst_edges;",
      "",
      "    sort(edges.begin(), edges.end()); // Sort by weight",
      "",
      "    for (auto& edge : edges) {",
      "        if (dsu.find(edge.u) != dsu.find(edge.v)) {",
      "            dsu.unite(edge.u, edge.v);",
      "            mst_edges.push_back(edge);",
      "        }",
      "    }",
      "",
      "    return mst_edges;",
      "}"
    ],
    java: [
      "class DSU { /* Contains find(i) and union(i, j) with path compression and rank */ }",
      "",
      "public List<Edge> kruskal(int V, List<Edge> edges) {",
      "    DSU dsu = new DSU(V);",
      "    List<Edge> mstEdges = new ArrayList<>();",
      "",
      "    edges.sort(Comparator.comparingInt(e -> e.weight));",
      "",
      "    for (Edge edge : edges) {",
      "        if (dsu.find(edge.u) != dsu.find(edge.v)) {",
      "            dsu.union(edge.u, edge.v);",
      "            mstEdges.add(edge);",
      "        }",
      "    }",
      "",
      "    return mstEdges;",
      "}"
    ]
  }
};

const LINE_MAPS = {
  prim: {
    python: { init: 2, initPq: 4, loop: 7, pop: 8, checkVis: 9, skip: 10, markVis: 12, pushMst: 13, loopAdj: 15, pushNew: 17 },
    cpp: { init: 2, initPq: 4, loop: 8, pop: 9, checkVis: 10, skip: 10, markVis: 12, pushMst: 13, loopAdj: 15, pushNew: 16 },
    java: { init: 2, initPq: 4, loop: 8, pop: 9, checkVis: 10, skip: 10, markVis: 12, pushMst: 13, loopAdj: 15, pushNew: 16 }
  },
  kruskal: {
    python: { initDsu: 2, sort: 19, loop: 21, checkFind: 22, union: 23, pushMst: 24 },
    cpp: { initDsu: 4, sort: 7, loop: 9, checkFind: 10, union: 11, pushMst: 12 },
    java: { initDsu: 4, sort: 7, loop: 9, checkFind: 10, union: 11, pushMst: 12 }
  }
};

const COMPLEXITY = {
  prim: { time: 'O(E log V)', space: 'O(V + E)' },
  kruskal: { time: 'O(E log E)', space: 'O(V + E)' }
};

const PRESETS = {
  standard: {
    nodes: [
      { id: 0, label: 'A', x: 20, y: 50 }, { id: 1, label: 'B', x: 50, y: 20 },
      { id: 2, label: 'C', x: 50, y: 80 }, { id: 3, label: 'D', x: 80, y: 50 },
      { id: 4, label: 'E', x: 35, y: 50 }, { id: 5, label: 'F', x: 65, y: 50 }
    ],
    edges: [
      { id: 0, from: 0, to: 4, weight: 1 }, { id: 1, from: 0, to: 1, weight: 4 },
      { id: 2, from: 0, to: 2, weight: 3 }, { id: 3, from: 4, to: 1, weight: 2 },
      { id: 4, from: 4, to: 2, weight: 2 }, { id: 5, from: 1, to: 5, weight: 4 },
      { id: 6, from: 2, to: 5, weight: 5 }, { id: 7, from: 5, to: 3, weight: 1 },
      { id: 8, from: 1, to: 3, weight: 6 }
    ],
    start: 0
  },
  disconnect: {
    nodes: [
      { id: 0, label: '0', x: 20, y: 30 }, { id: 1, label: '1', x: 20, y: 70 },
      { id: 2, label: '2', x: 50, y: 50 }, { id: 3, label: '3', x: 80, y: 30 },
      { id: 4, label: '4', x: 80, y: 70 }
    ],
    edges: [
      { id: 0, from: 0, to: 1, weight: 5 }, { id: 1, from: 0, to: 2, weight: 2 },
      { id: 2, from: 1, to: 2, weight: 2 }, { id: 3, from: 3, to: 4, weight: 1 }
    ],
    start: 0
  }
};

const getUndirectedEdges = (edges, u) => {
  return edges.filter(e => e.from === u || e.to === u).map(e => ({
    ...e,
    neighbor: e.from === u ? e.to : e.from
  }));
};

const getEdgeKey = (u, v) => u < v ? `${u}-${v}` : `${v}-${u}`;

const generatePrimFrames = (nodes, edges, startId) => {
  const frames = [];
  const visited = new Set();
  const mstEdges = [];
  let pq = []; // Array of { edgeId, from, to, weight }
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { visited: new Set(visited), pq: [...pq], mstEdges: [...mstEdges] },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  visited.add(startId);
  nodeStates[startId] = 'mst';
  
  const startEdges = getUndirectedEdges(edges, startId);
  for (let e of startEdges) {
    pq.push({ edgeId: e.id, from: startId, to: e.neighbor, weight: e.weight });
  }
  pq.sort((a, b) => a.weight - b.weight); // Min-heap behavior
  
  addFrame('initPq', `Initialized visited set with start node ${nodes.find(n=>n.id===startId).label}. Pushed adjacent edges to PQ.`);

  while (pq.length > 0 && visited.size < nodes.length) {
    addFrame('loop', `PQ has ${pq.length} items. Visited ${visited.size}/${nodes.length} nodes.`);
    
    pq.sort((a, b) => a.weight - b.weight);
    const curr = pq.shift();
    const uLabel = nodes.find(n=>n.id===curr.from).label;
    const vLabel = nodes.find(n=>n.id===curr.to).label;
    
    edgeStates[curr.edgeId] = 'inspecting';
    addFrame('pop', `Popped min-edge (${uLabel}-${vLabel}, w:${curr.weight}) from PQ.`);

    addFrame('checkVis', `Checking if target node ${vLabel} is already visited.`);
    if (visited.has(curr.to)) {
      edgeStates[curr.edgeId] = 'discarded';
      addFrame('skip', `Node ${vLabel} is already visited. Edge forms a cycle. Discarding.`);
      continue;
    }

    visited.add(curr.to);
    nodeStates[curr.to] = 'mst';
    mstEdges.push(curr);
    edgeStates[curr.edgeId] = 'mst';
    
    addFrame('markVis', `Node ${vLabel} is unvisited. Adding to visited set.`);
    addFrame('pushMst', `Added edge (${uLabel}-${vLabel}) to Minimum Spanning Tree.`);

    const nextEdges = getUndirectedEdges(edges, curr.to);
    let addedCount = 0;
    addFrame('loopAdj', `Looking for unvisited neighbors of ${vLabel}.`);
    
    for (let e of nextEdges) {
      if (!visited.has(e.neighbor)) {
        pq.push({ edgeId: e.id, from: curr.to, to: e.neighbor, weight: e.weight });
        addedCount++;
      }
    }
    if (addedCount > 0) {
      pq.sort((a, b) => a.weight - b.weight);
      addFrame('pushNew', `Pushed ${addedCount} new candidate edges to PQ.`);
    }
  }

  if (visited.size === nodes.length) {
    addFrame(null, `All nodes visited! Minimum Spanning Tree complete. Total weight: ${mstEdges.reduce((acc, e) => acc + e.weight, 0)}`);
  } else {
    addFrame(null, `PQ empty but only ${visited.size}/${nodes.length} nodes visited. Graph is disconnected.`);
  }

  return frames;
};

const generateKruskalFrames = (nodes, edges) => {
  const frames = [];
  const parent = {};
  const rank = {};
  nodes.forEach(n => { parent[n.id] = n.id; rank[n.id] = 0; });
  
  const mstEdges = [];
  let nodeStates = {}; let edgeStates = {};
  
  // Sorted copy of edges
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { parent: {...parent}, rank: {...rank}, sortedEdges: [...sortedEdges], mstEdges: [...mstEdges] },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  addFrame('initDsu', `Initialized Disjoint Set Union (DSU) arrays: Parent and Rank.`);
  addFrame('sort', `Sorted all edges by weight in ascending order.`);

  const find = (i) => {
    if (parent[i] === i) return i;
    // Path compression - for visualization we'll just show the final state, 
    // but in a real deep-dive we'd animate the recursive find.
    parent[i] = find(parent[i]); 
    return parent[i];
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
      return true;
    }
    return false;
  };

  for (let idx = 0; idx < sortedEdges.length; idx++) {
    const edge = sortedEdges[idx];
    const uLabel = nodes.find(n=>n.id===edge.from).label;
    const vLabel = nodes.find(n=>n.id===edge.to).label;
    
    edgeStates[edge.id] = 'inspecting';
    if(nodeStates[edge.from] !== 'mst') nodeStates[edge.from] = 'visiting';
    if(nodeStates[edge.to] !== 'mst') nodeStates[edge.to] = 'visiting';
    
    addFrame('loop', `Inspecting next smallest edge (${uLabel}-${vLabel}, w:${edge.weight}).`, { currEdgeIdx: idx });

    const rootU = find(edge.from);
    const rootV = find(edge.to);
    
    addFrame('checkFind', `Find(${uLabel}) -> Root ${nodes.find(n=>n.id===rootU).label}. Find(${vLabel}) -> Root ${nodes.find(n=>n.id===rootV).label}.`, { currEdgeIdx: idx });

    if (rootU !== rootV) {
      union(edge.from, edge.to);
      nodeStates[edge.from] = 'mst';
      nodeStates[edge.to] = 'mst';
      edgeStates[edge.id] = 'mst';
      mstEdges.push(edge);
      addFrame('union', `Roots differ! Union sets containing ${uLabel} and ${vLabel}.`, { currEdgeIdx: idx, highlightDSU: [rootU, rootV, edge.from, edge.to] });
      addFrame('pushMst', `Added edge (${uLabel}-${vLabel}) to Minimum Spanning Tree.`, { currEdgeIdx: idx });
    } else {
      if(nodeStates[edge.from] === 'visiting') nodeStates[edge.from] = 'default';
      if(nodeStates[edge.to] === 'visiting') nodeStates[edge.to] = 'default';
      edgeStates[edge.id] = 'discarded';
      addFrame('checkFind', `Roots are the same (${nodes.find(n=>n.id===rootU).label}). Adding this edge would form a cycle. Discarding.`, { currEdgeIdx: idx });
    }
  }

  addFrame(null, `Kruskal's Algorithm complete. Total MST weight: ${mstEdges.reduce((acc, e) => acc + e.weight, 0)}`);
  return frames;
};

export default function SpanningTreeVisualizer() {
  const [nodes, setNodes] = useState(PRESETS.standard.nodes);
  const [edges, setEdges] = useState(PRESETS.standard.edges);
  const [activeAlgo, setActiveAlgo] = useState("prim");
  const [language, setLanguage] = useState("python");
  const [startId, setStartId] = useState(PRESETS.standard.start);
  
  const [nodeLabel, setNodeLabel] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("1");
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
    if (frames.length > 0 || !nodeLabel.trim()) return;
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    setNodes([...nodes, { id: newId, label: nodeLabel.toUpperCase().substring(0,2), x: 50, y: 50 }]);
    setNodeLabel(""); resetSim();
  };

  const handleAddEdge = () => {
    if (frames.length > 0) return;
    const f = parseInt(edgeFrom), t = parseInt(edgeTo), w = parseInt(edgeWeight);
    if (isNaN(f) || isNaN(t) || isNaN(w) || f === t) return;
    
    // Check if undirected edge already exists
    if (edges.some(e => (e.from === f && e.to === t) || (e.from === t && e.to === f))) return; 
    
    const newId = edges.length > 0 ? Math.max(...edges.map(e => e.id)) + 1 : 0;
    setEdges([...edges, { id: newId, from: f, to: t, weight: w }]);
    setEdgeFrom(""); setEdgeTo(""); setEdgeWeight("1"); resetSim();
  };

  const handleClear = () => { 
    if (frames.length > 0) return;
    setNodes([]); setEdges([]); setStartId(""); resetSim(); 
  };
  
  const loadPreset = (key) => { 
    if (frames.length > 0) return;
    const p = PRESETS[key]; setNodes(p.nodes); setEdges(p.edges); setStartId(p.start); resetSim(); 
  };

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
    if (activeAlgo === 'prim') {
      if (startId === "" || startId === null) return;
      newFrames = generatePrimFrames(nodes, edges, startId);
    }
    if (activeAlgo === 'kruskal') {
      newFrames = generateKruskalFrames(nodes, edges);
    }
    
    setFrames(newFrames); setFrameIdx(0); setIsPlaying(true);
  };

  const currFrame = frames[frameIdx] || { ds: {}, nodeStates: {}, edgeStates: {}, logMsg: 'Ready. Compile & Run to visualize.', lineKey: null };
  const highlightLine = currFrame.lineKey ? LINE_MAPS[activeAlgo][language][currFrame.lineKey] : -1;
  const isLocked = frames.length > 0;

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><Component size={24} /> Spanning Trees</h1>
        
        <div className="playback-panel">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button onClick={executeAlgorithm} className="btn btn-orange" disabled={isLocked || !nodes.length || (activeAlgo==='prim' && startId==="")}>
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
            <label style={{fontSize:'0.65rem', color:'var(--orange-400)', display:'flex', justifyContent:'space-between'}}><span>Animation Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm</label>
          <select value={activeAlgo} onChange={e => {setActiveAlgo(e.target.value); resetSim();}} className="input-field" disabled={isLocked}>
            <option value="prim">Prim's Algorithm</option>
            <option value="kruskal">Kruskal's Algorithm (DSU)</option>
          </select>
        </div>

        <div className="complexity-box">
          <div className="comp-item"><span className="comp-label">Time Complexity</span> <span className="comp-val">{COMPLEXITY[activeAlgo].time}</span></div>
          <div className="comp-item"><span className="comp-label">Space Complexity</span> <span className="comp-val">{COMPLEXITY[activeAlgo].space}</span></div>
        </div>

        {activeAlgo === 'prim' && (
          <div className="input-group">
            <label>Start Node</label>
            <select value={startId} onChange={e => {setStartId(Number(e.target.value)); resetSim();}} className="input-field" disabled={isLocked}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
        )}

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        <div className="action-panel" style={{background: 'var(--bg-dark-950)'}}>
          <div className="panel-header" style={{display:'flex', justifyContent:'space-between'}}>
            <span>Undirected Graph</span>
            <select onChange={e => loadPreset(e.target.value)} className="input-field" style={{width:'auto', padding:'0.2rem', fontSize:'0.7rem'}} disabled={isLocked}>
              <option value="standard">Preset: Standard</option>
              <option value="disconnect">Preset: Disconnected</option>
            </select>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="text" placeholder="Node" value={nodeLabel} onChange={e=>setNodeLabel(e.target.value)} className="input-field" disabled={isLocked} />
            <button onClick={handleAddNode} className="btn btn-green" style={{width:'auto'}} disabled={isLocked}><Plus size={16}/></button>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <select value={edgeFrom} onChange={e=>setEdgeFrom(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={isLocked}><option value="">U</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <span style={{color:'var(--text-gray-500)', fontSize:'0.8rem'}}>—</span>
            <select value={edgeTo} onChange={e=>setEdgeTo(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={isLocked}><option value="">V</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
          </div>
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <input type="number" placeholder="Weight" value={edgeWeight} onChange={e=>setEdgeWeight(e.target.value)} className="input-field" disabled={isLocked}/>
            <button onClick={handleAddEdge} className="btn btn-cyan" style={{width:'80px'}} disabled={isLocked}>Add</button>
          </div>

          <div className="row-flex">
            <button onClick={handleClear} className="btn btn-red" disabled={isLocked}><Trash2 size={14}/> Clear</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
        </div>

        <div className="top-layout">
          <div className="canvas-wrapper" ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={()=>setDraggedNodeId(null)} onMouseLeave={()=>setDraggedNodeId(null)}>
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', zIndex:5, fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold'}}>GRAPH CANVAS</div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}} preserveAspectRatio="none" viewBox="0 0 100 100">
              {edges.map((edge) => {
                const fn = nodes.find(n=>n.id===edge.from), tn = nodes.find(n=>n.id===edge.to);
                if(!fn || !tn) return null;
                const state = currFrame.edgeStates[edge.id] || 'default';
                const midX = (fn.x + tn.x)/2; const midY = (fn.y + tn.y)/2;
                
                return (
                  <g key={edge.id}>
                    <line x1={`${fn.x}%`} y1={`${fn.y}%`} x2={`${tn.x}%`} y2={`${tn.y}%`} className={`edge-line ${state}`} vectorEffect="non-scaling-stroke" />
                    <rect x={`${midX}%`} y={`${midY}%`} width="5" height="4" transform="translate(-2.5, -2)" className={`edge-weight-bg ${state}`} />
                    <text x={`${midX}%`} y={`${midY}%`} className={`edge-weight-text ${state}`} fontSize="2.5">{edge.weight}</text>
                  </g>
                );
              })}
            </svg>

            {nodes.map(node => (
              <div key={node.id} className={`graph-node ${currFrame.nodeStates[node.id] || 'default'}`}
                   style={{left:`${node.x}%`, top:`${node.y}%`, cursor: isLocked ? 'default' : 'grab'}} onMouseDown={e => {if(!isLocked) { e.preventDefault(); setDraggedNodeId(node.id); }}}>
                {node.label}
              </div>
            ))}
          </div>

          {/* Data Structures Panel */}
          <div className="info-wrapper">
            <div className="ds-header">
              <span>Data Structures</span>
            </div>
            <div className="ds-content-area">
              
              {activeAlgo === 'prim' && (
                <>
                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>VISITED SET</div>
                    <div className="linear-ds-container">
                      {Array.from(currFrame.ds.visited || []).map((id, i) => (
                         <div key={i} className="ds-item" style={{background:'var(--bg-dark-800)', borderColor:'var(--cyan-600)'}}>{nodes.find(n=>n.id===id)?.label}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>PRIORITY QUEUE (Min-Heap of Edges)</div>
                    <div className="linear-ds-container" style={{flexDirection: 'column', gap:'0.25rem', overflow:'hidden'}}>
                      {currFrame.ds.pq?.slice(0, 5).map((edge, i) => (
                         <div key={i} className={`ds-item ${i===0?'highlight':''}`} style={{justifyContent:'flex-start', fontFamily:'monospace', padding:'0.2rem 0.5rem'}}>
                           Weight: <span style={{color:'var(--yellow-400)', fontWeight:'bold', margin:'0 0.5rem'}}>{edge.weight}</span> 
                           ({nodes.find(n=>n.id===edge.from)?.label}-{nodes.find(n=>n.id===edge.to)?.label})
                         </div>
                      ))}
                      {currFrame.ds.pq?.length > 5 && <div style={{textAlign:'center', fontSize:'0.75rem', color:'var(--text-gray-500)'}}>+{currFrame.ds.pq.length - 5} more edges...</div>}
                      {!currFrame.ds.pq?.length && <div style={{color:'var(--text-gray-600)', margin:'auto', fontSize:'0.8rem', fontStyle:'italic'}}>Empty</div>}
                    </div>
                  </div>
                </>
              )}

              {activeAlgo === 'kruskal' && (
                <>
                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>DISJOINT SET UNION (DSU)</div>
                    <table className="dsu-table">
                      <thead>
                        <tr>
                          <th>Node</th>
                          {nodes.map(n => <th key={`h-${n.id}`}>{n.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Parent</th>
                          {nodes.map(n => {
                            const pId = currFrame.ds.parent?.[n.id] ?? n.id;
                            const isHighlight = currFrame.highlightDSU?.includes(n.id);
                            return <td key={`p-${n.id}`} className={isHighlight?'highlight':''}>{nodes.find(node=>node.id===pId)?.label}</td>;
                          })}
                        </tr>
                        <tr>
                          <th>Rank</th>
                          {nodes.map(n => {
                            const isHighlight = currFrame.highlightDSU?.includes(n.id);
                            return <td key={`r-${n.id}`} className={isHighlight?'highlight':''}>{currFrame.ds.rank?.[n.id] ?? 0}</td>;
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.3rem'}}>SORTED EDGES (Weight Ascending)</div>
                    <div className="linear-ds-container" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.25rem', overflow:'hidden'}}>
                      {currFrame.ds.sortedEdges?.map((edge, i) => {
                         const uL = nodes.find(n=>n.id===edge.from)?.label;
                         const vL = nodes.find(n=>n.id===edge.to)?.label;
                         const isCurrent = currFrame.currEdgeIdx === i;
                         const isMst = currFrame.ds.mstEdges?.some(e => e.id === edge.id);
                         const isDiscarded = i < currFrame.currEdgeIdx && !isMst;
                         
                         let classes = "ds-item";
                         if (isCurrent) classes += " highlight";
                         else if (isMst) classes += " mst-item";
                         else if (isDiscarded) classes += " discarded";
                         
                         return (
                           <div key={i} className={classes} style={{fontSize:'0.75rem', padding:'0.1rem 0.3rem'}}>
                             {uL}-{vL} (w: {edge.weight})
                           </div>
                         )
                      })}
                    </div>
                  </div>
                </>
              )}
              
              <div style={{marginTop: 'auto'}}>
                 <div style={{fontSize:'0.7rem', color:'var(--cyan-400)', marginBottom:'0.3rem', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}>
                   <span>MST EDGES</span>
                   {currFrame.ds.mstEdges?.length > 0 && <span>Total W: {currFrame.ds.mstEdges.reduce((sum, e) => sum + e.weight, 0)}</span>}
                 </div>
                 <div className="linear-ds-container" style={{background:'var(--bg-dark-950)', border:'1px solid var(--cyan-600)'}}>
                   {currFrame.ds.mstEdges?.map((edge, i) => (
                      <div key={i} className="ds-item mst-item">
                        {nodes.find(n=>n.id===edge.from)?.label}-{nodes.find(n=>n.id===edge.to)?.label}
                      </div>
                   ))}
                   {!currFrame.ds.mstEdges?.length && <div style={{color:'var(--text-gray-600)', margin:'auto', fontSize:'0.8rem', fontStyle:'italic'}}>No edges selected yet</div>}
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
                 style={{ background: 'var(--bg-dark-900)', color: 'var(--orange-400)', border: '1px solid var(--border-gray-700)', borderRadius: '0.25rem', padding: '0.1rem 0.4rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
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
                 <li key={idx} className={`log-item ${idx === frameIdx ? 'active' : ''}`}>
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