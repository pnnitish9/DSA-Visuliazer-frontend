import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, Trash2, ArrowRight, SkipBack, SkipForward, RotateCcw, Code, Settings, Map, Info, Layers } from 'lucide-react';

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

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--cyan-400); display: flex; align-items: center; gap: 0.5rem; }

    /* Forms */
    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; }
    .input-field:focus { outline: none; border-color: var(--cyan-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .row-flex { display: flex; gap: 0.5rem; align-items: center; }
    
    /* Buttons */
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
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
    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--cyan-500); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--cyan-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--cyan-400); border-color: var(--cyan-500); }
    
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
    .graph-node.visited { background: var(--bg-dark-800); border-color: var(--border-gray-600); color: var(--text-gray-400); }
    
    /* SCC Colors */
    .graph-node.scc-0 { background: rgba(239, 68, 68, 0.2); border-color: var(--red-500); color: var(--red-400); }
    .graph-node.scc-1 { background: rgba(59, 130, 246, 0.2); border-color: var(--blue-500); color: var(--blue-400); }
    .graph-node.scc-2 { background: rgba(34, 197, 94, 0.2); border-color: var(--green-500); color: var(--green-400); }
    .graph-node.scc-3 { background: rgba(249, 115, 22, 0.2); border-color: var(--orange-400); color: var(--orange-400); }
    .graph-node.scc-4 { background: rgba(168, 85, 247, 0.2); border-color: var(--purple-500); color: var(--purple-400); }
    .graph-node.scc-5 { background: rgba(244, 114, 182, 0.2); border-color: var(--pink-400); color: var(--pink-400); }
    
    .edge-line { stroke: var(--border-gray-600); stroke-width: 0.35; transition: all 0.3s ease; fill: none; }
    .edge-line.inspecting { stroke: var(--yellow-500); stroke-width: 0.5; stroke-dasharray: 1.5,1; animation: travel 1s linear infinite; }
    .edge-line.transposed { stroke: var(--purple-500); stroke-width: 0.35; stroke-dasharray: 1,1; }
    .edge-line.cross-scc { stroke: var(--border-gray-700); stroke-width: 0.15; opacity: 0.3; }
    @keyframes travel { to { stroke-dashoffset: -10; } }

    /* Tables & DS Panels */
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--cyan-400); display: flex; justify-content: space-between; }
    
    .ds-table-container { padding: 0.5rem; overflow-y: auto; flex: 1; }
    .ds-table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.8rem; }
    .ds-table th, .ds-table td { padding: 0.4rem; text-align: center; border: 1px solid var(--border-gray-700); }
    .ds-table th { background: var(--bg-dark-900); color: var(--text-gray-400); }
    .ds-table td { color: var(--text-gray-200); background: var(--bg-dark-800); }
    .ds-table td.highlight { background: rgba(234, 179, 8, 0.2); color: var(--yellow-400); font-weight: bold; }
    
    .stack-container { display: flex; flex-direction: column-reverse; gap: 2px; padding: 0.5rem; max-height: 150px; overflow-y: auto; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.25rem; }
    .stack-item { background: var(--bg-dark-700); border: 1px solid var(--border-gray-500); padding: 0.25rem; text-align: center; font-family: monospace; font-size: 0.8rem; border-radius: 2px; transition: all 0.2s; }
    .stack-item.new { background: var(--green-600); color: white; border-color: var(--green-400); }
    .stack-item.popping { background: var(--red-600); color: white; border-color: var(--red-400); transform: translateX(10px); opacity: 0.5; }

    .scc-badge-container { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem; }
    .scc-badge { padding: 0.3rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: bold; font-family: monospace; border: 1px solid; }

    /* Bottom Row: Code & Logs */
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 220px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(6, 182, 212, 0.25); border-left: 3px solid var(--cyan-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--yellow-400); border-radius: 0.25rem; border-left: 2px solid var(--yellow-400); }
  `}</style>
);

const ALGO_CODES = {
  kosaraju: {
    python: [
      "def kosaraju(graph, V):",
      "    stack, visited = [], set()",
      "    def dfs1(u):",
      "        visited.add(u)",
      "        for v in graph[u]:",
      "            if v not in visited:",
      "                dfs1(v)",
      "        stack.append(u)",
      "",
      "    for i in range(V):",
      "        if i not in visited: dfs1(i)",
      "",
      "    transposed = transpose(graph)",
      "    visited.clear()",
      "    sccs = []",
      "",
      "    def dfs2(u, component):",
      "        visited.add(u)",
      "        component.append(u)",
      "        for v in transposed[u]:",
      "            if v not in visited:",
      "                dfs2(v, component)",
      "",
      "    while stack:",
      "        node = stack.pop()",
      "        if node not in visited:",
      "            component = []",
      "            dfs2(node, component)",
      "            sccs.append(component)",
      "    return sccs"
    ],
    cpp: [
      "void dfs1(int u, vector<vector<int>>& adj, vector<bool>& vis, stack<int>& st) {",
      "    vis[u] = true;",
      "    for (int v : adj[u])",
      "        if (!vis[v]) dfs1(v, adj, vis, st);",
      "    st.push(u);",
      "}",
      "",
      "void dfs2(int u, vector<vector<int>>& transposed, vector<bool>& vis, vector<int>& comp) {",
      "    vis[u] = true;",
      "    comp.push_back(u);",
      "    for (int v : transposed[u])",
      "        if (!vis[v]) dfs2(v, transposed, vis, comp);",
      "}",
      "",
      "vector<vector<int>> kosaraju(int V, vector<vector<int>>& adj) {",
      "    vector<bool> vis(V, false); stack<int> st;",
      "    for (int i = 0; i < V; i++)",
      "        if (!vis[i]) dfs1(i, adj, vis, st);",
      "",
      "    vector<vector<int>> transposed = getTranspose(V, adj);",
      "    fill(vis.begin(), vis.end(), false);",
      "    vector<vector<int>> sccs;",
      "",
      "    while (!st.empty()) {",
      "        int node = st.top(); st.pop();",
      "        if (!vis[node]) {",
      "            vector<int> comp;",
      "            dfs2(node, transposed, vis, comp);",
      "            sccs.push_back(comp);",
      "        }",
      "    }",
      "    return sccs;",
      "}"
    ],
    java: [
      "void dfs1(int u, List<List<Integer>> adj, boolean[] vis, Stack<Integer> st) {",
      "    vis[u] = true;",
      "    for (int v : adj.get(u))",
      "        if (!vis[v]) dfs1(v, adj, vis, st);",
      "    st.push(u);",
      "}",
      "",
      "void dfs2(int u, List<List<Integer>> transposed, boolean[] vis, List<Integer> comp) {",
      "    vis[u] = true;",
      "    comp.add(u);",
      "    for (int v : transposed.get(u))",
      "        if (!vis[v]) dfs2(v, transposed, vis, comp);",
      "}",
      "",
      "List<List<Integer>> kosaraju(int V, List<List<Integer>> adj) {",
      "    boolean[] vis = new boolean[V]; Stack<Integer> st = new Stack<>();",
      "    for (int i = 0; i < V; i++)",
      "        if (!vis[i]) dfs1(i, adj, vis, st);",
      "",
      "    List<List<Integer>> transposed = getTranspose(V, adj);",
      "    Arrays.fill(vis, false);",
      "    List<List<Integer>> sccs = new ArrayList<>();",
      "",
      "    while (!st.isEmpty()) {",
      "        int node = st.pop();",
      "        if (!vis[node]) {",
      "            List<Integer> comp = new ArrayList<>();",
      "            dfs2(node, transposed, vis, comp);",
      "            sccs.add(comp);",
      "        }",
      "    }",
      "    return sccs;",
      "}"
    ]
  },
  tarjan: {
    python: [
      "def tarjan(graph, V):",
      "    ids, low = {}, {}",
      "    onStack = {i: False for i in range(V)}",
      "    stack, sccs = [], []",
      "    id_counter = [0]",
      "",
      "    def dfs(u):",
      "        stack.append(u)",
      "        onStack[u] = True",
      "        ids[u] = low[u] = id_counter[0]",
      "        id_counter[0] += 1",
      "",
      "        for v in graph[u]:",
      "            if v not in ids:",
      "                dfs(v)",
      "                low[u] = min(low[u], low[v])",
      "            elif onStack[v]:",
      "                low[u] = min(low[u], ids[v])",
      "",
      "        if ids[u] == low[u]:",
      "            component = []",
      "            while True:",
      "                node = stack.pop()",
      "                onStack[node] = False",
      "                component.append(node)",
      "                if node == u: break",
      "            sccs.append(component)",
      "",
      "    for i in range(V):",
      "        if i not in ids: dfs(i)",
      "    return sccs"
    ],
    cpp: [
      "void dfs(int u, vector<vector<int>>& adj, vector<int>& ids, vector<int>& low, ",
      "         vector<bool>& onStack, stack<int>& st, int& id, vector<vector<int>>& sccs) {",
      "    st.push(u);",
      "    onStack[u] = true;",
      "    ids[u] = low[u] = id++;",
      "",
      "    for (int v : adj[u]) {",
      "        if (ids[v] == -1) {",
      "            dfs(v, adj, ids, low, onStack, st, id, sccs);",
      "            low[u] = min(low[u], low[v]);",
      "        } else if (onStack[v]) {",
      "            low[u] = min(low[u], ids[v]);",
      "        }",
      "    }",
      "",
      "    if (ids[u] == low[u]) {",
      "        vector<int> comp;",
      "        while (true) {",
      "            int node = st.top(); st.pop();",
      "            onStack[node] = false;",
      "            comp.push_back(node);",
      "            if (node == u) break;",
      "        }",
      "        sccs.push_back(comp);",
      "    }",
      "}"
    ],
    java: [
      "void dfs(int u, List<List<Integer>> adj, int[] ids, int[] low, ",
      "         boolean[] onStack, Stack<Integer> st, int[] id, List<List<Integer>> sccs) {",
      "    st.push(u);",
      "    onStack[u] = true;",
      "    ids[u] = low[u] = id[0]++;",
      "",
      "    for (int v : adj.get(u)) {",
      "        if (ids[v] == -1) {",
      "            dfs(v, adj, ids, low, onStack, st, id, sccs);",
      "            low[u] = Math.min(low[u], low[v]);",
      "        } else if (onStack[v]) {",
      "            low[u] = Math.min(low[u], ids[v]);",
      "        }",
      "    }",
      "",
      "    if (ids[u] == low[u]) {",
      "        List<Integer> comp = new ArrayList<>();",
      "        while (true) {",
      "            int node = st.pop();",
      "            onStack[node] = false;",
      "            comp.add(node);",
      "            if (node == u) break;",
      "        }",
      "        sccs.add(comp);",
      "    }",
      "}"
    ]
  },
  gabow: {
    python: [
      "def gabow(graph, V):",
      "    pre = {}",
      "    S, B, sccs = [], [], []",
      "    preCounter = [0]",
      "",
      "    def dfs(u):",
      "        pre[u] = preCounter[0]",
      "        preCounter[0] += 1",
      "        S.append(u)",
      "        B.append(u)",
      "",
      "        for v in graph[u]:",
      "            if v not in pre:",
      "                dfs(v)",
      "            elif v not in [node for comp in sccs for node in comp]:",
      "                while pre[B[-1]] > pre[v]:",
      "                    B.pop()",
      "",
      "        if B[-1] == u:",
      "            B.pop()",
      "            component = []",
      "            while True:",
      "                node = S.pop()",
      "                component.append(node)",
      "                if node == u: break",
      "            sccs.append(component)",
      "",
      "    for i in range(V):",
      "        if i not in pre: dfs(i)",
      "    return sccs"
    ],
    cpp: [
      "void dfs(int u, vector<vector<int>>& adj, vector<int>& pre, vector<int>& sccMap, ",
      "         stack<int>& S, stack<int>& B, int& preCounter, vector<vector<int>>& sccs) {",
      "    pre[u] = preCounter++;",
      "    S.push(u); B.push(u);",
      "",
      "    for (int v : adj[u]) {",
      "        if (pre[v] == -1) {",
      "            dfs(v, adj, pre, sccMap, S, B, preCounter, sccs);",
      "        } else if (sccMap[v] == -1) {",
      "            while (pre[B.top()] > pre[v]) B.pop();",
      "        }",
      "    }",
      "",
      "    if (B.top() == u) {",
      "        B.pop();",
      "        vector<int> comp;",
      "        while (true) {",
      "            int node = S.top(); S.pop();",
      "            sccMap[node] = sccs.size();",
      "            comp.push_back(node);",
      "            if (node == u) break;",
      "        }",
      "        sccs.push_back(comp);",
      "    }",
      "}"
    ],
    java: [
      "void dfs(int u, List<List<Integer>> adj, int[] pre, int[] sccMap, ",
      "         Stack<Integer> S, Stack<Integer> B, int[] preCounter, List<List<Integer>> sccs) {",
      "    pre[u] = preCounter[0]++;",
      "    S.push(u); B.push(u);",
      "",
      "    for (int v : adj.get(u)) {",
      "        if (pre[v] == -1) {",
      "            dfs(v, adj, pre, sccMap, S, B, preCounter, sccs);",
      "        } else if (sccMap[v] == -1) {",
      "            while (pre[B.peek()] > pre[v]) B.pop();",
      "        }",
      "    }",
      "",
      "    if (B.peek() == u) {",
      "        B.pop();",
      "        List<Integer> comp = new ArrayList<>();",
      "        while (true) {",
      "            int node = S.pop();",
      "            sccMap[node] = sccs.size();",
      "            comp.add(node);",
      "            if (node == u) break;",
      "        }",
      "        sccs.add(comp);",
      "    }",
      "}"
    ]
  }
};

const LINE_MAPS = {
  kosaraju: {
    python: { callDfs1: 11, dfs1In: 4, dfs1Adj: 5, dfs1Push: 8, transpose: 13, callDfs2: 27, dfs2In: 17, dfs2Adj: 19, popStack: 24, formSCC: 28 },
    cpp: { callDfs1: 15, dfs1In: 2, dfs1Adj: 3, dfs1Push: 5, transpose: 17, callDfs2: 23, dfs2In: 9, dfs2Adj: 11, popStack: 21, formSCC: 24 },
    java: { callDfs1: 15, dfs1In: 2, dfs1Adj: 3, dfs1Push: 5, transpose: 17, callDfs2: 23, dfs2In: 9, dfs2Adj: 11, popStack: 21, formSCC: 24 }
  },
  tarjan: {
    python: { callDfs: 28, dfsIn: 8, dfsAdj: 12, dfsLowUnvis: 15, dfsLowVis: 17, checkRoot: 19, popLoop: 22, formSCC: 26 },
    cpp: { callDfs: 27, dfsIn: 3, dfsAdj: 7, dfsLowUnvis: 10, dfsLowVis: 12, checkRoot: 16, popLoop: 19, formSCC: 24 },
    java: { callDfs: 27, dfsIn: 3, dfsAdj: 7, dfsLowUnvis: 10, dfsLowVis: 12, checkRoot: 16, popLoop: 19, formSCC: 24 }
  },
  gabow: {
    python: { callDfs: 28, dfsIn: 7, dfsPush: 9, dfsAdj: 12, dfsPopB: 16, checkRoot: 18, popLoop: 22, formSCC: 25 },
    cpp: { callDfs: 26, dfsIn: 3, dfsPush: 4, dfsAdj: 6, dfsPopB: 10, checkRoot: 14, popLoop: 17, formSCC: 22 },
    java: { callDfs: 26, dfsIn: 3, dfsPush: 4, dfsAdj: 6, dfsPopB: 10, checkRoot: 14, popLoop: 17, formSCC: 22 }
  }
};

const PRESETS = {
  basicSCC: {
    nodes: [
      { id: 0, label: '0', x: 20, y: 30 }, { id: 1, label: '1', x: 50, y: 20 },
      { id: 2, label: '2', x: 40, y: 60 }, { id: 3, label: '3', x: 80, y: 30 },
      { id: 4, label: '4', x: 80, y: 70 }
    ],
    edges: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 },
      { from: 1, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 3 }
    ]
  },
  complexSCC: {
    nodes: [
      { id: 0, label: 'A', x: 15, y: 20 }, { id: 1, label: 'B', x: 35, y: 20 },
      { id: 2, label: 'C', x: 25, y: 50 }, { id: 3, label: 'D', x: 60, y: 20 },
      { id: 4, label: 'E', x: 85, y: 20 }, { id: 5, label: 'F', x: 85, y: 60 },
      { id: 6, label: 'G', x: 60, y: 60 }, { id: 7, label: 'H', x: 45, y: 85 }
    ],
    edges: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 },
      { from: 1, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 },
      { from: 5, to: 3 }, { from: 5, to: 6 }, { from: 6, to: 3 },
      { from: 2, to: 7 }, { from: 7, to: 6 }
    ]
  }
};

const generateKosarajuFrames = (nodes, edges) => {
  const frames = [];
  const visited = new Set();
  const stack = [];
  const sccs = [];
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { stack: [...stack], visited: new Set(visited), sccs: [...sccs], phase: overrides.phase || 1 },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  addFrame(null, `Phase 1: Computing finish times via DFS.`, { phase: 1 });

  const dfs1 = (u) => {
    visited.add(u);
    nodeStates[u] = 'visiting';
    addFrame('dfs1In', `DFS1 at node ${u}. Marking visited.`, { phase: 1 });

    const neighbors = edges.filter(e => e.from === u);
    for (let e of neighbors) {
      edgeStates[`${e.from}-${e.to}`] = 'inspecting';
      addFrame('dfs1Adj', `Checking edge ${u} -> ${e.to}.`, { phase: 1 });
      if (!visited.has(e.to)) {
        dfs1(e.to);
      } else {
        addFrame('dfs1Adj', `Node ${e.to} already visited.`, { phase: 1 });
      }
      edgeStates[`${e.from}-${e.to}`] = 'default';
    }
    
    stack.push(u);
    nodeStates[u] = 'visited';
    addFrame('dfs1Push', `Finished node ${u}. Pushing to stack.`, { phase: 1, action: 'push', val: u });
  };

  for (let n of nodes) {
    if (!visited.has(n.id)) {
      addFrame('callDfs1', `Node ${n.id} unvisited. Calling DFS1.`, { phase: 1 });
      dfs1(n.id);
    }
  }

  addFrame('transpose', `Phase 2: Transposing graph. Reversing all edges.`, { phase: 2, isTransposed: true });
  visited.clear();
  nodeStates = {}; // reset colors
  
  const dfs2 = (u, compId) => {
    visited.add(u);
    sccs[compId].push(u);
    nodeStates[u] = `scc-${compId % 6}`;
    addFrame('dfs2In', `DFS2 at node ${u}. Adding to current SCC.`, { phase: 2, isTransposed: true });

    // In transposed graph, neighbors are those with edge.to === u
    const incomingEdges = edges.filter(e => e.to === u);
    for (let e of incomingEdges) {
      edgeStates[`${e.from}-${e.to}`] = 'inspecting'; // Will be drawn reversed
      addFrame('dfs2Adj', `Checking reversed edge ${u} -> ${e.from}.`, { phase: 2, isTransposed: true });
      if (!visited.has(e.from)) {
        dfs2(e.from, compId);
      } else {
        addFrame('dfs2Adj', `Node ${e.from} already visited.`, { phase: 2, isTransposed: true });
      }
      edgeStates[`${e.from}-${e.to}`] = 'default';
    }
  };

  while (stack.length > 0) {
    const node = stack.pop();
    addFrame('popStack', `Popped ${node} from stack.`, { phase: 2, isTransposed: true, action: 'pop', val: node });
    
    if (!visited.has(node)) {
      sccs.push([]);
      const compId = sccs.length - 1;
      addFrame('callDfs2', `Node ${node} unvisited. Starting new SCC.`, { phase: 2, isTransposed: true });
      dfs2(node, compId);
      addFrame('formSCC', `SCC formed: [${sccs[compId].join(', ')}].`, { phase: 2, isTransposed: true });
    } else {
      addFrame('popStack', `Node ${node} already visited. Skipping.`, { phase: 2, isTransposed: true });
    }
  }

  addFrame(null, `Kosaraju's Algorithm complete. Found ${sccs.length} SCCs.`, { phase: 3 });
  return frames;
};

const generateTarjanFrames = (nodes, edges) => {
  const frames = [];
  const ids = {}; const low = {}; const onStack = {};
  const stack = []; const sccs = [];
  let idCounter = 0;
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { ids: {...ids}, low: {...low}, onStack: {...onStack}, stack: [...stack], sccs: [...sccs] },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  addFrame(null, `Starting Tarjan's Algorithm.`);

  const dfs = (u) => {
    stack.push(u);
    onStack[u] = true;
    ids[u] = low[u] = idCounter++;
    nodeStates[u] = 'visiting';
    addFrame('dfsIn', `Visited ${u}. id=${ids[u]}, low=${low[u]}. Pushed to stack.`, { action: 'push', val: u });

    const neighbors = edges.filter(e => e.from === u);
    for (let e of neighbors) {
      const v = e.to;
      edgeStates[`${u}-${v}`] = 'inspecting';
      addFrame('dfsAdj', `Checking edge ${u} -> ${v}.`);

      if (ids[v] === undefined) {
        addFrame('dfsAdj', `Node ${v} unvisited. Recursing.`);
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
        addFrame('dfsLowUnvis', `Back from ${v}. Updating low[${u}] = min(${low[u]}, ${low[v]}) = ${low[u]}.`);
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], ids[v]);
        addFrame('dfsLowVis', `Node ${v} is on stack (Back-edge). Updating low[${u}] = min(${low[u]}, id[${v}]:${ids[v]}) = ${low[u]}.`);
      } else {
        addFrame('dfsAdj', `Node ${v} visited and off stack (Cross-edge). Ignored.`);
      }
      edgeStates[`${u}-${v}`] = 'default';
    }

    addFrame('checkRoot', `Checking if ${u} is SCC root: id[${u}] == low[${u}] (${ids[u]} == ${low[u]}).`);
    if (ids[u] === low[u]) {
      sccs.push([]);
      const compId = sccs.length - 1;
      let node;
      do {
        node = stack.pop();
        onStack[node] = false;
        sccs[compId].push(node);
        nodeStates[node] = `scc-${compId % 6}`;
        addFrame('popLoop', `Popping ${node} from stack into SCC.`, { action: 'pop', val: node });
      } while (node !== u);
      addFrame('formSCC', `SCC formed: [${sccs[compId].join(', ')}].`);
    } else {
      nodeStates[u] = 'visited';
    }
  };

  for (let n of nodes) {
    if (ids[n.id] === undefined) {
      addFrame('callDfs', `Node ${n.id} unvisited. Calling DFS.`);
      dfs(n.id);
    }
  }

  addFrame(null, `Tarjan's Algorithm complete. Found ${sccs.length} SCCs.`);
  return frames;
};

const generateGabowFrames = (nodes, edges) => {
  const frames = [];
  const pre = {}; const sccMap = {};
  const S = []; const B = []; const sccs = [];
  let preCounter = 0;
  let nodeStates = {}; let edgeStates = {};
  
  const addFrame = (lineKey, msg, overrides = {}) => {
    frames.push({ 
      ds: { pre: {...pre}, sccMap: {...sccMap}, S: [...S], B: [...B], sccs: [...sccs] },
      nodeStates: {...nodeStates}, edgeStates: {...edgeStates}, lineKey, logMsg: msg, ...overrides 
    });
  };

  addFrame(null, `Starting Gabow's Algorithm.`);

  const dfs = (u) => {
    pre[u] = preCounter++;
    nodeStates[u] = 'visiting';
    addFrame('dfsIn', `Visited ${u}. pre[${u}]=${pre[u]}.`);
    
    S.push(u); B.push(u);
    addFrame('dfsPush', `Pushed ${u} to Stack S and Boundary Stack B.`, { actionS: 'push', actionB: 'push', val: u });

    const neighbors = edges.filter(e => e.from === u);
    for (let e of neighbors) {
      const v = e.to;
      edgeStates[`${u}-${v}`] = 'inspecting';
      addFrame('dfsAdj', `Checking edge ${u} -> ${v}.`);

      if (pre[v] === undefined) {
        addFrame('dfsAdj', `Node ${v} unvisited. Recursing.`);
        dfs(v);
      } else if (sccMap[v] === undefined) {
        addFrame('dfsAdj', `Node ${v} visited but not assigned SCC. Popping boundaries > pre[${v}] (${pre[v]}).`);
        while (B.length > 0 && pre[B[B.length - 1]] > pre[v]) {
          const popped = B.pop();
          addFrame('dfsPopB', `Popped boundary ${popped} (pre=${pre[popped]}).`, { actionB: 'pop', val: popped });
        }
      } else {
        addFrame('dfsAdj', `Node ${v} already in an SCC (Cross-edge). Ignored.`);
      }
      edgeStates[`${u}-${v}`] = 'default';
    }

    addFrame('checkRoot', `Checking if ${u} is an SCC root (Top of B == ${u}). Top: ${B[B.length-1]}.`);
    if (B.length > 0 && B[B.length - 1] === u) {
      B.pop();
      addFrame('checkRoot', `Boundary matched. Popped ${u} from B.`, { actionB: 'pop', val: u });
      
      sccs.push([]);
      const compId = sccs.length - 1;
      let node;
      do {
        node = S.pop();
        sccMap[node] = compId;
        sccs[compId].push(node);
        nodeStates[node] = `scc-${compId % 6}`;
        addFrame('popLoop', `Popping ${node} from S into SCC.`, { actionS: 'pop', val: node });
      } while (node !== u);
      addFrame('formSCC', `SCC formed: [${sccs[compId].join(', ')}].`);
    } else {
      nodeStates[u] = 'visited';
    }
  };

  for (let n of nodes) {
    if (pre[n.id] === undefined) {
      addFrame('callDfs', `Node ${n.id} unvisited. Calling DFS.`);
      dfs(n.id);
    }
  }

  addFrame(null, `Gabow's Algorithm complete. Found ${sccs.length} SCCs.`);
  return frames;
};

export default function SCCVisualizer() {
  const [nodes, setNodes] = useState(PRESETS.basicSCC.nodes);
  const [edges, setEdges] = useState(PRESETS.basicSCC.edges);
  const [activeAlgo, setActiveAlgo] = useState("tarjan");
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
    if (activeAlgo === 'kosaraju') newFrames = generateKosarajuFrames(nodes, edges);
    if (activeAlgo === 'tarjan') newFrames = generateTarjanFrames(nodes, edges);
    if (activeAlgo === 'gabow') newFrames = generateGabowFrames(nodes, edges);
    
    setFrames(newFrames); setFrameIdx(0); setIsPlaying(true);
  };

  const currFrame = frames[frameIdx] || { ds: {}, nodeStates: {}, edgeStates: {}, logMsg: 'Ready. Compile & Run to visualize.', lineKey: null };
  const highlightLine = currFrame.lineKey ? LINE_MAPS[activeAlgo][language][currFrame.lineKey] : -1;
  const isLocked = frames.length > 0;

  // Path generator for curved or straight edges
  const renderEdge = (edge, idx) => {
    const fn = nodes.find(n=>n.id===edge.from), tn = nodes.find(n=>n.id===edge.to);
    if(!fn || !tn) return null;
    
    const isTransposed = currFrame.isTransposed;
    const visualFrom = isTransposed ? tn : fn;
    const visualTo = isTransposed ? fn : tn;
    
    const isBidi = edges.some(e => e.from === edge.to && e.to === edge.from);
    const state = currFrame.edgeStates[`${edge.from}-${edge.to}`] || 'default';
    
    // Cross SCC dimming logic
    let crossScc = false;
    if (currFrame.ds.sccs && state === 'default') {
      const fromScc = currFrame.ds.sccs.findIndex(comp => comp.includes(visualFrom.id));
      const toScc = currFrame.ds.sccs.findIndex(comp => comp.includes(visualTo.id));
      if (fromScc !== -1 && toScc !== -1 && fromScc !== toScc) crossScc = true;
    }

    const cssClass = `edge-line ${state} ${isTransposed ? 'transposed' : ''} ${crossScc ? 'cross-scc' : ''}`;
    const marker = `url(#arrow${state!=='default'?'-'+state:''})`;

    if (isBidi) {
      // Calculate curve control point
      const dx = visualTo.x - visualFrom.x;
      const dy = visualTo.y - visualFrom.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Normal vector
      const nx = -dy / dist;
      const ny = dx / dist;
      // offset amount
      const offset = 10;
      const cx = (visualFrom.x + visualTo.x)/2 + nx * offset;
      const cy = (visualFrom.y + visualTo.y)/2 + ny * offset;
      
      return <path key={idx} d={`M ${visualFrom.x} ${visualFrom.y} Q ${cx} ${cy} ${visualTo.x} ${visualTo.y}`} className={cssClass} markerEnd={marker} />;
    } else {
      return <line key={idx} x1={`${visualFrom.x}%`} y1={`${visualFrom.y}%`} x2={`${visualTo.x}%`} y2={`${visualTo.y}%`} className={cssClass} markerEnd={marker} />;
    }
  };

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><Layers size={24} /> SCC Vis</h1>
        
        <div className="playback-panel">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button onClick={executeAlgorithm} className="btn btn-cyan" disabled={isLocked || !nodes.length}>
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
            <label style={{fontSize:'0.65rem', color:'var(--cyan-400)', display:'flex', justifyContent:'space-between'}}><span>Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm</label>
          <select value={activeAlgo} onChange={e => {setActiveAlgo(e.target.value); resetSim();}} className="input-field" disabled={isLocked}>
            <option value="kosaraju">Kosaraju's Algorithm</option>
            <option value="tarjan">Tarjan's Algorithm</option>
            <option value="gabow">Gabow's Algorithm</option>
          </select>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        <div className="action-panel" style={{background: 'var(--bg-dark-950)'}}>
          <div className="panel-header" style={{display:'flex', justifyContent:'space-between'}}>
            <span>Graph Editor</span>
            <select onChange={e => loadPreset(e.target.value)} className="input-field" style={{width:'auto', padding:'0.2rem', fontSize:'0.7rem'}} disabled={isLocked}>
              <option value="basicSCC">Basic SCC</option>
              <option value="complexSCC">Complex Map</option>
            </select>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="text" placeholder="Node Name" value={nodeLabel} onChange={e=>setNodeLabel(e.target.value)} className="input-field" disabled={isLocked} />
            <button onClick={handleAddNode} className="btn btn-green" style={{width:'auto'}} disabled={isLocked}><Plus size={16}/></button>
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <select value={edgeFrom} onChange={e=>setEdgeFrom(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={isLocked}><option value="">From</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <ArrowRight size={14} style={{color:'var(--text-gray-500)', flexShrink:0}}/>
            <select value={edgeTo} onChange={e=>setEdgeTo(e.target.value)} className="input-field" style={{padding:'0.4rem'}} disabled={isLocked}><option value="">To</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <button onClick={handleAddEdge} className="btn btn-cyan" style={{width:'auto'}} disabled={isLocked}>Add</button>
          </div>

          <div className="row-flex">
            <button onClick={handleClear} className="btn btn-red" disabled={isLocked}><Trash2 size={14}/> Clear Nodes</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
          {currFrame.ds.phase && <span style={{fontSize:'0.75rem', padding:'0.2rem 0.5rem', background:'var(--purple-500)', color:'white', borderRadius:'1rem', fontWeight:'bold'}}>PHASE {currFrame.ds.phase}</span>}
        </div>

        <div className="top-layout">
          <div className="canvas-wrapper" ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={()=>setDraggedNodeId(null)} onMouseLeave={()=>setDraggedNodeId(null)}>
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', zIndex:5, fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold'}}>DIRECTED GRAPH {currFrame.isTransposed && <span style={{color:'var(--purple-400)'}}>(TRANSPOSED)</span>}</div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}} preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="14" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-gray-600)"/></marker>
                <marker id="arrow-inspecting" viewBox="0 0 10 10" refX="14" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--yellow-500)"/></marker>
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
              <span>{activeAlgo === 'kosaraju' ? 'Visited & Stack' : activeAlgo === 'tarjan' ? 'Discovery & Low' : 'Preorder & Stacks'}</span>
            </div>
            
            <div className="ds-table-container" style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              {/* Tarjan Table */}
              {activeAlgo === 'tarjan' && currFrame.ds.ids && (
                <table className="ds-table">
                  <thead><tr><th>Node</th><th>id</th><th>low</th><th>onStack</th></tr></thead>
                  <tbody>
                    {nodes.map(n => {
                      const id = currFrame.ds.ids[n.id];
                      const low = currFrame.ds.low[n.id];
                      const os = currFrame.ds.onStack[n.id];
                      return (
                        <tr key={n.id}>
                          <td>{n.label}</td>
                          <td>{id !== undefined ? id : '-'}</td>
                          <td className={currFrame.logMsg.includes(`low[${n.id}]`) ? 'highlight' : ''}>{low !== undefined ? low : '-'}</td>
                          <td>{os ? 'true' : 'false'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Gabow Table */}
              {activeAlgo === 'gabow' && currFrame.ds.pre && (
                <table className="ds-table">
                  <thead><tr><th>Node</th><th>pre (order)</th><th>SCC ID</th></tr></thead>
                  <tbody>
                    {nodes.map(n => {
                      const pre = currFrame.ds.pre[n.id];
                      const sccMap = currFrame.ds.sccMap[n.id];
                      return (
                        <tr key={n.id}>
                          <td>{n.label}</td>
                          <td>{pre !== undefined ? pre : '-'}</td>
                          <td>{sccMap !== undefined ? sccMap : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Kosaraju Visited */}
              {activeAlgo === 'kosaraju' && currFrame.ds.visited && (
                <div style={{fontSize:'0.8rem', padding:'0.5rem', background:'var(--bg-dark-900)', borderRadius:'0.25rem', border:'1px solid var(--border-gray-700)'}}>
                  <strong style={{color:'var(--text-gray-400)'}}>Visited Set:</strong><br/>
                  {Array.from(currFrame.ds.visited).map(id => nodes.find(n=>n.id===id)?.label).join(', ') || 'Empty'}
                </div>
              )}

              {/* Stacks Rendering */}
              <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                {currFrame.ds.stack && (
                  <div style={{flex:1}}>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.2rem'}}>STACK (top first)</div>
                    <div className="stack-container">
                      {currFrame.ds.stack.map((id, idx) => {
                        const isTop = idx === currFrame.ds.stack.length - 1;
                        let itemClass = 'stack-item';
                        if (isTop && currFrame.action === 'push' && currFrame.val === id) itemClass += ' new';
                        if (isTop && currFrame.action === 'pop' && currFrame.val === id) itemClass += ' popping';
                        return <div key={idx} className={itemClass}>{nodes.find(n=>n.id===id)?.label}</div>;
                      })}
                      {currFrame.ds.stack.length === 0 && <div style={{textAlign:'center', color:'var(--text-gray-600)', fontSize:'0.7rem'}}>Empty</div>}
                    </div>
                  </div>
                )}
                
                {currFrame.ds.S && (
                  <div style={{flex:1}}>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.2rem'}}>STACK S (Nodes)</div>
                    <div className="stack-container">
                      {currFrame.ds.S.map((id, idx) => {
                        const isTop = idx === currFrame.ds.S.length - 1;
                        let itemClass = 'stack-item';
                        if (isTop && currFrame.actionS === 'push') itemClass += ' new';
                        if (isTop && currFrame.actionS === 'pop' && currFrame.val === id) itemClass += ' popping';
                        return <div key={`s-${idx}`} className={itemClass}>{nodes.find(n=>n.id===id)?.label}</div>;
                      })}
                    </div>
                  </div>
                )}

                {currFrame.ds.B && (
                  <div style={{flex:1}}>
                    <div style={{fontSize:'0.7rem', color:'var(--text-gray-400)', marginBottom:'0.2rem'}}>STACK B (Bounds)</div>
                    <div className="stack-container">
                      {currFrame.ds.B.map((id, idx) => {
                        const isTop = idx === currFrame.ds.B.length - 1;
                        let itemClass = 'stack-item';
                        if (isTop && currFrame.actionB === 'push') itemClass += ' new';
                        if (isTop && currFrame.actionB === 'pop' && currFrame.val === id) itemClass += ' popping';
                        return <div key={`b-${idx}`} className={itemClass}>{nodes.find(n=>n.id===id)?.label}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Formed SCCs */}
              {currFrame.ds.sccs && (
                <div style={{marginTop:'1rem'}}>
                  <div style={{fontSize:'0.7rem', color:'var(--cyan-400)', fontWeight:'bold', marginBottom:'0.25rem'}}>FORMED COMPONENTS</div>
                  <div className="scc-badge-container" style={{background:'var(--bg-dark-900)', minHeight:'50px', borderRadius:'0.25rem', border:'1px solid var(--border-gray-700)'}}>
                    {currFrame.ds.sccs.map((comp, idx) => {
                       if (comp.length === 0) return null;
                       return (
                         <div key={idx} className={`scc-badge graph-node scc-${idx % 6}`} style={{position:'relative', transform:'none', width:'auto', height:'auto', borderRadius:'0.25rem'}}>
                           SCC {idx}: [{comp.map(id => nodes.find(n=>n.id===id)?.label).join(', ')}]
                         </div>
                       );
                    })}
                  </div>
                </div>
              )}
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
                 style={{ background: 'var(--bg-dark-900)', color: 'var(--cyan-400)', border: '1px solid var(--border-gray-700)', borderRadius: '0.25rem', padding: '0.1rem 0.4rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
               >
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
                 <option value="java">Java</option>
               </select>
             </div>
              <pre className="code-content"><code>
                {ALGO_CODES[activeAlgo][language].map((line, idx) => {
                  return (
                    <span key={idx} className={`code-line ${highlightLine === (idx + 1) ? 'highlight' : ''}`}>
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