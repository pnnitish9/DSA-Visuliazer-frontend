import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Plus, Trash2, ArrowRight, SkipBack, SkipForward, RotateCcw, Activity, Code, Settings, Map, Info } from 'lucide-react';

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

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--purple-400); display: flex; align-items: center; gap: 0.5rem; }

    /* Forms */
    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; }
    .input-field:focus { outline: none; border-color: var(--purple-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .row-flex { display: flex; gap: 0.5rem; align-items: center; }
    
    /* Buttons */
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }
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
    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--purple-500); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--purple-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--purple-400); border-color: var(--purple-500); }
    
    /* Main Area */
    .main-content { flex: 1; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; background-color: var(--bg-dark-950); }
    .status-bar { padding: 0.75rem 1rem; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center; }
    .status-text { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: var(--cyan-400); }
    
    /* Canvas */
    .top-layout { display: flex; flex-direction: column; gap: 1rem; flex: 2; min-height: 400px; }
    @media (min-width: 1280px) { .top-layout { flex-direction: row; } }
    
    .canvas-wrapper { flex: 2; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; overflow: hidden; min-height: 350px; }
    .info-wrapper { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Node and Edge Styling */
    .graph-node {
      position: absolute; width: 2.8rem; height: 2.8rem; background: var(--bg-dark-700); border: 2px solid var(--border-gray-500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: monospace; transform: translate(-50%, -50%); transition: all 0.3s ease; z-index: 10; cursor: grab; user-select: none; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .graph-node.start { border-color: var(--green-500); box-shadow: 0 0 10px rgba(34,197,94,0.5); }
    .graph-node.target { border-color: var(--red-500); box-shadow: 0 0 10px rgba(239,68,68,0.5); }
    .graph-node.visiting { background: var(--yellow-500); color: #000; border-color: var(--yellow-400); transform: translate(-50%, -50%) scale(1.15); box-shadow: 0 0 15px rgba(234,179,8,0.6); z-index: 12; }
    .graph-node.relaxed { background: var(--cyan-600); border-color: var(--cyan-400); color: white; transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 15px rgba(34,211,238,0.5); }
    .graph-node.visited { background: var(--bg-dark-800); border-color: var(--border-gray-600); color: var(--text-gray-400); }
    
    .edge-line { stroke: var(--border-gray-600); stroke-width: 2; transition: all 0.3s ease; fill: none; }
    .edge-line.inspecting { stroke: var(--yellow-500); stroke-width: 3; stroke-dasharray: 6,4; animation: travel 1s linear infinite; }
    .edge-line.relaxed { stroke: var(--cyan-500); stroke-width: 3; }
    @keyframes travel { to { stroke-dashoffset: -20; } }

    .edge-weight-bg { fill: var(--bg-dark-900); rx: 4; ry: 4; }
    .edge-weight-text { fill: var(--text-gray-200); font-size: 0.75rem; font-family: monospace; font-weight: bold; text-anchor: middle; dominant-baseline: central; user-select: none; }

    /* Tables & DS Panels */
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--purple-400); }
    
    .dist-table-container { padding: 0.5rem; overflow-y: auto; flex: 1; }
    .dist-table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.85rem; }
    .dist-table th, .dist-table td { padding: 0.4rem; text-align: center; border: 1px solid var(--border-gray-700); }
    .dist-table th { background: var(--bg-dark-900); color: var(--text-gray-400); }
    .dist-table td { color: var(--text-gray-200); background: var(--bg-dark-800); }
    .dist-table td.updated { background: rgba(34, 211, 238, 0.2); color: var(--cyan-400); font-weight: bold; }
    .dist-table td.inf { color: var(--text-gray-500); }

    .matrix-container { overflow: auto; padding: 0.5rem; flex: 1; }
    .matrix-table { border-collapse: collapse; font-family: monospace; font-size: 0.75rem; margin: auto; }
    .matrix-table th, .matrix-table td { padding: 0.3rem 0.5rem; text-align: center; border: 1px solid var(--border-gray-700); min-width: 35px; }
    .matrix-table th { background: var(--bg-dark-900); color: var(--text-gray-400); }
    .matrix-cell { background: var(--bg-dark-800); color: var(--text-gray-300); }
    .matrix-cell.highlight { background: rgba(234, 179, 8, 0.3); color: var(--yellow-400); font-weight: bold; border-color: var(--yellow-500); }
    .matrix-cell.updated { background: rgba(34, 211, 238, 0.3); color: var(--cyan-400); font-weight: bold; }

    .pq-container { padding: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .pq-item { background: var(--bg-dark-700); border: 1px solid var(--border-gray-500); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem; transition: transform 0.2s; }
    .pq-item.active { background: rgba(234, 179, 8, 0.2); border-color: var(--yellow-500); color: var(--yellow-400); transform: scale(1.05); }

    /* Bottom Row: Code & Logs */
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 220px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(168, 85, 247, 0.25); border-left: 3px solid var(--purple-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--cyan-400); border-radius: 0.25rem; border-left: 2px solid var(--cyan-400); }
  `}</style>
);

const ALGO_CODES = {
  dijkstra: [
    "def dijkstra(graph, start):",
    "    dist = {node: INF for node in graph}",
    "    dist[start] = 0",
    "    pq = [(0, start)]",
    "",
    "    while pq:",
    "        d, u = heapq.heappop(pq)",
    "        if d > dist[u]: continue",
    "",
    "        for v, weight in graph[u]:",
    "            if dist[u] + weight < dist[v]:",
    "                dist[v] = dist[u] + weight",
    "                heapq.heappush(pq, (dist[v], v))",
    "    return dist"
  ],
  bellmanFord: [
    "def bellman_ford(graph, V, start):",
    "    dist = {node: INF for node in range(V)}",
    "    dist[start] = 0",
    "",
    "    for _ in range(V - 1):",
    "        for u, v, weight in graph.edges:",
    "            if dist[u] + weight < dist[v]:",
    "                dist[v] = dist[u] + weight",
    "",
    "    # Optional negative cycle check omitted for brevity",
    "    return dist"
  ],
  floydWarshall: [
    "def floyd_warshall(graph, V):",
    "    dist = [[INF]*V for _ in range(V)]",
    "    for u, v, w in graph.edges: dist[u][v] = w",
    "    for i in range(V): dist[i][i] = 0",
    "",
    "    for k in range(V):",
    "        for i in range(V):",
    "            for j in range(V):",
    "                if dist[i][k] + dist[k][j] < dist[i][j]:",
    "                    dist[i][j] = dist[i][k] + dist[k][j]",
    "    return dist"
  ],
  astar: [
    "def a_star(graph, start, target):",
    "    g_score = {node: INF for node in graph}",
    "    g_score[start] = 0",
    "    pq = [(heuristic(start, target), start)]",
    "",
    "    while pq:",
    "        _, u = heapq.heappop(pq)",
    "        if u == target: return g_score[u]",
    "",
    "        for v, weight in graph[u]:",
    "            tentative_g = g_score[u] + weight",
    "            if tentative_g < g_score[v]:",
    "                g_score[v] = tentative_g",
    "                f_score = tentative_g + heuristic(v, target)",
    "                heapq.heappush(pq, (f_score, v))"
  ]
};

const LINE_MAPS = {
  dijkstra: { init: 2, loop: 6, pop: 7, skip: 8, loopNeighbors: 10, check: 11, relax: 12, push: 13 },
  bellmanFord: { init: 2, loopV: 5, loopE: 6, check: 7, relax: 8 },
  floydWarshall: { init: 2, loopK: 6, loopI: 7, loopJ: 8, check: 9, relax: 10 },
  astar: { init: 2, loop: 6, pop: 7, targetMatch: 8, loopNeighbors: 10, check: 12, relax: 13, push: 15 }
};

const PRESETS = {
  standard: {
    nodes: [
      { id: 0, label: 'A', x: 20, y: 50 }, { id: 1, label: 'B', x: 50, y: 20 },
      { id: 2, label: 'C', x: 50, y: 80 }, { id: 3, label: 'D', x: 80, y: 50 }
    ],
    edges: [
      { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 1 },
      { from: 2, to: 1, weight: 2 }, { from: 1, to: 3, weight: 1 },
      { from: 2, to: 3, weight: 5 }
    ],
    start: 0, target: 3
  },
  complex: {
    nodes: [
      { id: 0, label: '0', x: 15, y: 50 }, { id: 1, label: '1', x: 40, y: 20 },
      { id: 2, label: '2', x: 40, y: 80 }, { id: 3, label: '3', x: 70, y: 20 },
      { id: 4, label: '4', x: 70, y: 80 }, { id: 5, label: '5', x: 90, y: 50 }
    ],
    edges: [
      { from: 0, to: 1, weight: 2 }, { from: 0, to: 2, weight: 4 },
      { from: 1, to: 2, weight: 1 }, { from: 1, to: 3, weight: 7 },
      { from: 2, to: 4, weight: 3 }, { from: 4, to: 3, weight: 2 },
      { from: 3, to: 5, weight: 1 }, { from: 4, to: 5, weight: 5 }
    ],
    start: 0, target: 5
  }
};

const INF = 999;
// A* Heuristic (Euclidean Distance divided by an arbitrary scale to keep it comparable to weights)
const getHeuristic = (n1, n2) => {
  if (!n1 || !n2) return 0;
  return Math.floor(Math.hypot(n1.x - n2.x, n1.y - n2.y) / 10); 
};

const generateDijkstraFrames = (nodes, edges, startId) => {
  const frames = [];
  let dist = {}; nodes.forEach(n => dist[n.id] = INF);
  dist[startId] = 0;
  
  let pq = [{ id: startId, dist: 0 }];
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (line, msg, overrides = {}) => {
    frames.push({ dist: {...dist}, pq: [...pq], nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, line, logMsg: msg, ...overrides });
  };

  addFrame(LINE_MAPS.dijkstra.init, `Initialized distances. Set dist[${nodes.find(n=>n.id===startId).label}] = 0. Enqueued start node.`);
  
  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    addFrame(LINE_MAPS.dijkstra.loop, `Priority Queue not empty. Preparing to extract min.`);
    
    const curr = pq.shift();
    const currLabel = nodes.find(n=>n.id===curr.id).label;
    nodeStates[curr.id] = 'visiting';
    addFrame(LINE_MAPS.dijkstra.pop, `Popped node ${currLabel} with distance ${curr.dist}.`);

    if (curr.dist > dist[curr.id]) {
      addFrame(LINE_MAPS.dijkstra.skip, `Distance ${curr.dist} > dist[${currLabel}] (${dist[curr.id]}). Stale entry, skipping.`);
      nodeStates[curr.id] = 'visited';
      continue;
    }

    const neighbors = edges.filter(e => e.from === curr.id);
    addFrame(LINE_MAPS.dijkstra.loopNeighbors, `Exploring ${neighbors.length} neighbors of ${currLabel}.`);

    for (const edge of neighbors) {
      const neighborLabel = nodes.find(n=>n.id===edge.to).label;
      edgeStates[`${edge.from}-${edge.to}`] = 'inspecting';
      addFrame(LINE_MAPS.dijkstra.check, `Checking edge ${currLabel} -> ${neighborLabel} (Weight: ${edge.weight}).`);

      if (dist[curr.id] + edge.weight < dist[edge.to]) {
        const oldDist = dist[edge.to];
        dist[edge.to] = dist[curr.id] + edge.weight;
        nodeStates[edge.to] = 'relaxed';
        edgeStates[`${edge.from}-${edge.to}`] = 'relaxed';
        
        pq.push({ id: edge.to, dist: dist[edge.to] });
        addFrame(LINE_MAPS.dijkstra.relax, `Relaxed! dist[${neighborLabel}] updated from ${oldDist === INF ? '∞' : oldDist} to ${dist[edge.to]}.`, { updatedNode: edge.to });
        addFrame(LINE_MAPS.dijkstra.push, `Pushed ${neighborLabel} to Priority Queue with new distance.`);
        
        nodeStates[edge.to] = 'default';
      } else {
        addFrame(LINE_MAPS.dijkstra.check, `No improvement. dist[${currLabel}] + ${edge.weight} >= dist[${neighborLabel}].`);
      }
      edgeStates[`${edge.from}-${edge.to}`] = 'default';
    }
    nodeStates[curr.id] = 'visited';
  }
  addFrame(null, `Queue empty. Dijkstra's Algorithm finished.`);
  return frames;
};

const generateBellmanFordFrames = (nodes, edges, startId) => {
  const frames = [];
  let dist = {}; nodes.forEach(n => dist[n.id] = INF);
  dist[startId] = 0;
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (line, msg, overrides = {}) => {
    frames.push({ dist: {...dist}, pq: [], nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, line, logMsg: msg, ...overrides });
  };

  addFrame(LINE_MAPS.bellmanFord.init, `Initialized distances. Set dist[${nodes.find(n=>n.id===startId).label}] = 0.`);
  
  for (let i = 0; i < nodes.length - 1; i++) {
    addFrame(LINE_MAPS.bellmanFord.loopV, `--- Iteration ${i + 1} of ${nodes.length - 1} ---`);
    
    for (const edge of edges) {
      const uLabel = nodes.find(n=>n.id===edge.from).label;
      const vLabel = nodes.find(n=>n.id===edge.to).label;
      
      edgeStates[`${edge.from}-${edge.to}`] = 'inspecting';
      nodeStates[edge.from] = 'visiting'; nodeStates[edge.to] = 'visiting';
      addFrame(LINE_MAPS.bellmanFord.loopE, `Inspecting edge ${uLabel} -> ${vLabel} (Weight: ${edge.weight}).`);

      if (dist[edge.from] !== INF && dist[edge.from] + edge.weight < dist[edge.to]) {
        const oldDist = dist[edge.to];
        dist[edge.to] = dist[edge.from] + edge.weight;
        edgeStates[`${edge.from}-${edge.to}`] = 'relaxed';
        nodeStates[edge.to] = 'relaxed';
        addFrame(LINE_MAPS.bellmanFord.relax, `Relaxed! dist[${vLabel}] updated from ${oldDist === INF ? '∞' : oldDist} to ${dist[edge.to]}.`, { updatedNode: edge.to });
      } else {
        addFrame(LINE_MAPS.bellmanFord.check, `No improvement for ${uLabel} -> ${vLabel}.`);
      }
      
      edgeStates[`${edge.from}-${edge.to}`] = 'default';
      nodeStates[edge.from] = 'default'; nodeStates[edge.to] = 'default';
    }
  }
  addFrame(null, `Bellman-Ford Algorithm completed V-1 iterations.`);
  return frames;
};

const generateFloydWarshallFrames = (nodes, edges) => {
  const frames = [];
  let matrix = {}; 
  nodes.forEach(u => {
    matrix[u.id] = {};
    nodes.forEach(v => matrix[u.id][v.id] = u.id === v.id ? 0 : INF);
  });
  edges.forEach(e => matrix[e.from][e.to] = e.weight);
  
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (line, msg, overrides = {}) => {
    // Deep copy matrix
    const matCopy = {};
    Object.keys(matrix).forEach(k => matCopy[k] = {...matrix[k]});
    frames.push({ dist: {}, pq: [], matrix: matCopy, nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, line, logMsg: msg, ...overrides });
  };

  addFrame(LINE_MAPS.floydWarshall.init, `Initialized APSP Matrix with edge weights and 0s on diagonal.`);
  
  for (let k = 0; k < nodes.length; k++) {
    const kLabel = nodes[k].label;
    nodeStates[nodes[k].id] = 'visiting'; // Intermediate node
    addFrame(LINE_MAPS.floydWarshall.loopK, `--- Using ${kLabel} as intermediate node ---`, { kId: nodes[k].id });
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const iLabel = nodes[i].label; const jLabel = nodes[j].label;
        
        const currentPath = matrix[nodes[i].id][nodes[j].id];
        const viaPath = matrix[nodes[i].id][nodes[k].id] + matrix[nodes[k].id][nodes[j].id];
        
        addFrame(LINE_MAPS.floydWarshall.check, `Checking path ${iLabel}→${jLabel} via ${kLabel}. Current: ${currentPath===INF?'∞':currentPath}, Via ${kLabel}: ${viaPath>=INF?'∞':viaPath}`, { kId: nodes[k].id, iId: nodes[i].id, jId: nodes[j].id });

        if (viaPath < currentPath) {
          matrix[nodes[i].id][nodes[j].id] = viaPath;
          edgeStates[`${nodes[i].id}-${nodes[k].id}`] = 'relaxed';
          edgeStates[`${nodes[k].id}-${nodes[j].id}`] = 'relaxed';
          addFrame(LINE_MAPS.floydWarshall.relax, `Path improved! Updating matrix[${iLabel}][${jLabel}] to ${viaPath}.`, { kId: nodes[k].id, iId: nodes[i].id, jId: nodes[j].id, updated: true });
          edgeStates[`${nodes[i].id}-${nodes[k].id}`] = 'default';
          edgeStates[`${nodes[k].id}-${nodes[j].id}`] = 'default';
        }
      }
    }
    nodeStates[nodes[k].id] = 'default';
  }
  addFrame(null, `Floyd-Warshall All-Pairs Shortest Path completed.`);
  return frames;
};

const generateAStarFrames = (nodes, edges, startId, targetId) => {
  const frames = [];
  let gScore = {}; nodes.forEach(n => gScore[n.id] = INF);
  gScore[startId] = 0;
  
  const targetNode = nodes.find(n => n.id === targetId);
  const startNode = nodes.find(n => n.id === startId);
  
  let pq = [{ id: startId, f: getHeuristic(startNode, targetNode), g: 0 }];
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (line, msg, overrides = {}) => {
    frames.push({ dist: {...gScore}, pq: [...pq], nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, line, logMsg: msg, ...overrides });
  };

  addFrame(LINE_MAPS.astar.init, `Initialized g_scores. Calculated initial heuristic for Start. Enqueued.`);
  
  while (pq.length > 0) {
    pq.sort((a, b) => a.f - b.f);
    addFrame(LINE_MAPS.astar.loop, `Priority Queue sorted by f_score (g_score + heuristic).`);
    
    const curr = pq.shift();
    const currLabel = nodes.find(n=>n.id===curr.id).label;
    nodeStates[curr.id] = 'visiting';
    addFrame(LINE_MAPS.astar.pop, `Popped node ${currLabel} (f_score: ${curr.f}).`);

    if (curr.id === targetId) {
      nodeStates[curr.id] = 'target';
      addFrame(LINE_MAPS.astar.targetMatch, `Target ${currLabel} reached! Optimal path found.`);
      return frames;
    }

    const neighbors = edges.filter(e => e.from === curr.id);
    addFrame(LINE_MAPS.astar.loopNeighbors, `Exploring ${neighbors.length} neighbors of ${currLabel}.`);

    for (const edge of neighbors) {
      const neighborNode = nodes.find(n=>n.id===edge.to);
      const neighborLabel = neighborNode.label;
      edgeStates[`${edge.from}-${edge.to}`] = 'inspecting';
      
      const tentativeG = gScore[curr.id] + edge.weight;
      addFrame(LINE_MAPS.astar.check, `Checking ${currLabel} -> ${neighborLabel}. Tentative g_score: ${tentativeG}.`);

      if (tentativeG < gScore[edge.to]) {
        gScore[edge.to] = tentativeG;
        const h = getHeuristic(neighborNode, targetNode);
        const f = tentativeG + h;
        
        nodeStates[edge.to] = 'relaxed';
        edgeStates[`${edge.from}-${edge.to}`] = 'relaxed';
        
        pq.push({ id: edge.to, f, g: tentativeG });
        addFrame(LINE_MAPS.astar.relax, `Path improved! g_score[${neighborLabel}] = ${tentativeG}. Heuristic = ${h}. f_score = ${f}.`, { updatedNode: edge.to });
        addFrame(LINE_MAPS.astar.push, `Pushed ${neighborLabel} to Priority Queue with f_score ${f}.`);
        
        nodeStates[edge.to] = 'default';
      } else {
        addFrame(LINE_MAPS.astar.check, `No improvement. Existing g_score is better or equal.`);
      }
      edgeStates[`${edge.from}-${edge.to}`] = 'default';
    }
    nodeStates[curr.id] = 'visited';
  }
  addFrame(null, `Queue empty. Target is unreachable.`);
  return frames;
};

export default function ShortestPathVisualizer() {
  // Core State
  const [nodes, setNodes] = useState(PRESETS.standard.nodes);
  const [edges, setEdges] = useState(PRESETS.standard.edges);
  const [activeAlgo, setActiveAlgo] = useState("dijkstra");
  const [startId, setStartId] = useState(PRESETS.standard.start);
  const [targetId, setTargetId] = useState(PRESETS.standard.target);
  
  // Editor State
  const [nodeLabel, setNodeLabel] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  
  // Execution State
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  
  const canvasRef = useRef(null);
  const logEndRef = useRef(null);

  // Playback Engine
  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIdx(p => p + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  const resetSim = () => { setFrames([]); setFrameIdx(-1); setIsPlaying(false); };

  // Editor Handlers
  const handleAddNode = () => {
    if (!nodeLabel.trim()) return;
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    setNodes([...nodes, { id: newId, label: nodeLabel.toUpperCase().substring(0,2), x: 50, y: 50 }]);
    setNodeLabel(""); resetSim();
  };

  const handleAddEdge = () => {
    const f = parseInt(edgeFrom), t = parseInt(edgeTo), w = parseInt(edgeWeight);
    if (isNaN(f) || isNaN(t) || isNaN(w) || f === t) return;
    if (edges.some(e => e.from === f && e.to === t)) return; // Prevent duplicate directed edges
    setEdges([...edges, { from: f, to: t, weight: w }]);
    setEdgeFrom(""); setEdgeTo(""); setEdgeWeight("1"); resetSim();
  };

  const handleClear = () => { setNodes([]); setEdges([]); setStartId(""); setTargetId(""); resetSim(); };
  const loadPreset = (key) => { const p = PRESETS[key]; setNodes(p.nodes); setEdges(p.edges); setStartId(p.start); setTargetId(p.target); resetSim(); };

  const handleMouseMove = (e) => {
    if (draggedNodeId === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    setNodes(nodes.map(n => n.id === draggedNodeId ? { ...n, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : n));
  };

  const executeAlgorithm = () => {
    resetSim();
    if (nodes.length === 0) return;
    let newFrames = [];
    if (activeAlgo === 'dijkstra') newFrames = generateDijkstraFrames(nodes, edges, startId);
    if (activeAlgo === 'bellmanFord') newFrames = generateBellmanFordFrames(nodes, edges, startId);
    if (activeAlgo === 'floydWarshall') newFrames = generateFloydWarshallFrames(nodes, edges);
    if (activeAlgo === 'astar') newFrames = generateAStarFrames(nodes, edges, startId, targetId);
    
    setFrames(newFrames); setFrameIdx(0); setIsPlaying(true);
  };

  const currFrame = frames[frameIdx] || { dist: {}, pq: [], matrix: null, nodeStates: {}, edgeStates: {}, logMsg: 'Ready. Compile & Run to visualize.', line: -1 };
  const isFW = activeAlgo === 'floydWarshall';

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* Sidebar */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><Map size={24} /> Shortest Paths</h1>
        
        <div className="playback-panel">
          <button onClick={executeAlgorithm} className="btn btn-purple" style={{marginBottom:'0.75rem'}} disabled={!nodes.length || (startId==="" && !isFW)}>
            <Play size={16}/> Compile & Run
          </button>
          
          <input type="range" className="slider" min="-1" max={frames.length ? frames.length-1 : 0} value={frameIdx} onChange={e => {setFrameIdx(Number(e.target.value)); setIsPlaying(false);}} disabled={!frames.length} />
          
          <div className="player-controls">
            <button className="ctrl-btn" onClick={() => {setFrameIdx(-1); setIsPlaying(false);}} disabled={frameIdx <= -1}><RotateCcw size={16}/></button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p-1); setIsPlaying(false);}} disabled={frameIdx <= 0}><SkipBack size={16}/></button>
            <button className="ctrl-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={!frames.length || frameIdx === frames.length-1}>
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p+1); setIsPlaying(false);}} disabled={!frames.length || frameIdx >= frames.length-1}><SkipForward size={16}/></button>
          </div>
          
          <div style={{marginTop: '0.75rem'}}>
            <label style={{fontSize:'0.65rem', color:'var(--purple-400)', display:'flex', justifyContent:'space-between'}}><span>Animation Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm</label>
          <select value={activeAlgo} onChange={e => {setActiveAlgo(e.target.value); resetSim();}} className="input-field" disabled={frames.length > 0}>
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="bellmanFord">Bellman-Ford</option>
            <option value="floydWarshall">Floyd-Warshall (APSP)</option>
            <option value="astar">A* Search</option>
          </select>
        </div>

        <div className="actions-grid">
          <div>
            <label style={{fontSize:'0.65rem'}}>Start Node</label>
            <select value={startId} onChange={e => {setStartId(Number(e.target.value)); resetSim();}} className="input-field" disabled={frames.length > 0 || isFW}>
              <option value="">--</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:'0.65rem'}}>Target Node {activeAlgo!=='astar'&&'(Opt)'}</label>
            <select value={targetId} onChange={e => {setTargetId(Number(e.target.value)); resetSim();}} className="input-field" disabled={frames.length > 0 || isFW || activeAlgo==='bellmanFord'}>
              <option value="">--</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        {/* Graph Editor */}
        <div className="action-panel" style={{background: 'var(--bg-dark-950)'}}>
          <div className="panel-header" style={{display:'flex', justifyContent:'space-between'}}>
            <span>Graph Editor</span>
            <select onChange={e => loadPreset(e.target.value)} className="input-field" style={{width:'auto', padding:'0.2rem', fontSize:'0.7rem'}} disabled={frames.length>0}>
              <option value="standard">Preset: Standard</option>
              <option value="complex">Preset: Complex</option>
            </select>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="text" placeholder="Node Name" value={nodeLabel} onChange={e=>setNodeLabel(e.target.value)} className="input-field" disabled={frames.length>0} />
            <button onClick={handleAddNode} className="btn btn-green" style={{width:'auto'}} disabled={frames.length>0}><Plus size={16}/></button>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <select value={edgeFrom} onChange={e=>setEdgeFrom(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={frames.length>0}><option value="">From</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <ArrowRight size={14} style={{color:'var(--text-gray-500)', flexShrink:0}}/>
            <select value={edgeTo} onChange={e=>setEdgeTo(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={frames.length>0}><option value="">To</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
          </div>
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <input type="number" placeholder="Weight (e.g. 5)" value={edgeWeight} onChange={e=>setEdgeWeight(e.target.value)} className="input-field" disabled={frames.length>0}/>
            <button onClick={handleAddEdge} className="btn btn-cyan" style={{width:'80px'}} disabled={frames.length>0}>Add</button>
          </div>

          <div className="row-flex">
            <button onClick={handleClear} className="btn btn-red" disabled={frames.length>0}><Trash2 size={14}/> Clear</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
        </div>

        <div className="top-layout">
          {/* Canvas */}
          <div className="canvas-wrapper" ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={()=>setDraggedNodeId(null)} onMouseLeave={()=>setDraggedNodeId(null)}>
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', zIndex:5, fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold'}}>GRAPH CANVAS</div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-gray-500)"/></marker>
                <marker id="arrow-inspecting" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--yellow-500)"/></marker>
                <marker id="arrow-relaxed" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--cyan-500)"/></marker>
              </defs>
              
              {edges.map((edge, idx) => {
                const fn = nodes.find(n=>n.id===edge.from), tn = nodes.find(n=>n.id===edge.to);
                if(!fn || !tn) return null;
                const state = currFrame.edgeStates[`${edge.from}-${edge.to}`] || 'default';
                const midX = (fn.x + tn.x)/2; const midY = (fn.y + tn.y)/2;
                return (
                  <g key={idx}>
                    <line x1={`${fn.x}%`} y1={`${fn.y}%`} x2={`${tn.x}%`} y2={`${tn.y}%`} className={`edge-line ${state}`} markerEnd={`url(#arrow${state!=='default'?'-'+state:''})`} />
                    <rect x={`${midX}%`} y={`${midY}%`} width="20" height="14" transform="translate(-10, -7)" className="edge-weight-bg" />
                    <text x={`${midX}%`} y={`${midY}%`} className="edge-weight-text" fill={state==='inspecting'?'var(--yellow-400)':state==='relaxed'?'var(--cyan-400)':'var(--text-gray-300)'}>{edge.weight}</text>
                  </g>
                );
              })}
            </svg>

            {nodes.map(node => (
              <div key={node.id} className={`graph-node ${currFrame.nodeStates[node.id] || 'default'} ${node.id === startId && !isFW ? 'start' : ''} ${node.id === targetId && activeAlgo==='astar' ? 'target' : ''}`}
                   style={{left:`${node.x}%`, top:`${node.y}%`, cursor: frames.length?'default':'grab'}} onMouseDown={e => {if(!frames.length) { e.preventDefault(); setDraggedNodeId(node.id); }}}>
                {node.label}
              </div>
            ))}
          </div>

          {/* Data Structures Panel */}
          <div className="info-wrapper">
            {isFW ? (
              <>
                <div className="ds-header">Distance Matrix (O(V²))</div>
                <div className="matrix-container">
                  {currFrame.matrix && (
                    <table className="matrix-table">
                      <thead>
                        <tr><th></th>{nodes.map(n=><th key={`h-${n.id}`}>{n.label}</th>)}</tr>
                      </thead>
                      <tbody>
                        {nodes.map(u => (
                          <tr key={`r-${u.id}`}>
                            <th>{u.label}</th>
                            {nodes.map(v => {
                              const val = currFrame.matrix[u.id][v.id];
                              const isK = currFrame.kId === u.id || currFrame.kId === v.id;
                              const isHighlight = currFrame.iId === u.id && currFrame.jId === v.id;
                              const isUpdated = isHighlight && currFrame.updated;
                              return <td key={`c-${v.id}`} className={`matrix-cell ${isHighlight?'highlight':''} ${isUpdated?'updated':''} ${isK?'k-node':''}`}>{val === INF ? '∞' : val}</td>
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {!currFrame.matrix && <div style={{padding:'1rem', color:'var(--text-gray-500)', textAlign:'center', fontSize:'0.8rem'}}>Matrix will populate upon execution.</div>}
                </div>
              </>
            ) : (
              <>
                <div className="ds-header">Distance Array</div>
                <div className="dist-table-container">
                  <table className="dist-table">
                    <thead><tr><th>Node</th><th>Distance (g_score)</th></tr></thead>
                    <tbody>
                      {nodes.map(n => (
                        <tr key={n.id}>
                          <td>{n.label}</td>
                          <td className={`${currFrame.dist[n.id] === INF ? 'inf' : ''} ${currFrame.updatedNode === n.id ? 'updated' : ''}`}>
                            {currFrame.dist[n.id] === undefined ? '-' : currFrame.dist[n.id] === INF ? '∞' : currFrame.dist[n.id]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {(activeAlgo === 'dijkstra' || activeAlgo === 'astar') && (
                  <>
                    <div className="ds-header" style={{borderTop:'1px solid var(--border-gray-700)'}}>Priority Queue</div>
                    <div className="pq-container">
                      {currFrame.pq.length === 0 && <span style={{fontSize:'0.75rem', color:'var(--text-gray-500)'}}>Queue is empty</span>}
                      {currFrame.pq.map((item, i) => (
                        <div key={i} className={`pq-item ${i===0?'active':''}`}>
                          <span style={{color:'var(--purple-400)'}}>{nodes.find(n=>n.id===item.id).label}</span>
                          <span style={{color:'var(--text-gray-400)'}}>|</span>
                          <span>{activeAlgo==='astar'?item.f:item.dist}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-layout">
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><Code size={14}/> Algorithm Tracker (Python)</div>
              <pre className="code-content"><code>
                {ALGO_CODES[activeAlgo].map((line, idx) => (
                  <span key={idx} className={`code-line ${currFrame.line === (idx + 1) ? 'highlight' : ''}`}>{line || '\u00A0'}</span>
                ))}
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