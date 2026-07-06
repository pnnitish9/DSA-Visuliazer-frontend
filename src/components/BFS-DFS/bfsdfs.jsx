import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Plus, Trash2, ArrowRight } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      --bg-dark-950: #0c111c;
      --bg-dark-900: #111827;
      --bg-dark-800: #1f2937;
      --bg-dark-700: #374151;
      --bg-dark-600: #4b5563;
      --bg-dark-500: #6b7280;
      
      --text-gray-200: #e5e7eb;
      --text-gray-300: #d1d5db;
      --text-gray-400: #9ca3af;
      --text-gray-500: #6b7280;

      --border-gray-600: #4b5563;
      --border-gray-700: #374151;

      --cyan-400: #22d3ee;
      --cyan-500: #06b6d4;
      --cyan-600: #0891b2;
      
      --green-400: #4ade80;
      --green-500: #22c55e;
      --green-600: #16a34a;
      
      --yellow-400: #facc15;
      --yellow-500: #eab308;
      --yellow-600: #ca8a04;
      
      --red-400: #f87171;
      --red-500: #ef4444;
      --red-600: #dc2626;

      --orange-500: #f97316;
      --orange-600: #ea580c;

      --purple-500: #a855f7;
      --purple-600: #9333ea;
      
      --pink-500: #ec4899;
      --pink-600: #db2777;
    }

    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; }
    }

    * { box-sizing: border-box; }

    .controls-sidebar {
      width: 100%;
      background-color: var(--bg-dark-800);
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 10;
    }
    @media (min-width: 1024px) {
      .controls-sidebar {
        width: 25%;
        min-width: 320px;
        max-width: 360px;
        min-height: 100vh;
        overflow-y: auto;
      }
    }

    .sidebar-title {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      color: var(--cyan-400);
      display: flex;
      align-items: center;
    }
    .sidebar-title svg { margin-right: 0.75rem; }

    .input-group { margin-bottom: 0.85rem; }
    .input-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      color: var(--text-gray-300);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .input-field {
      width: 100%;
      padding: 0.6rem 0.75rem;
      background-color: var(--bg-dark-700);
      border-radius: 0.375rem;
      border: 1px solid var(--border-gray-600);
      color: var(--text-gray-200);
      transition: border-color 0.2s, box-shadow 0.2s;
      font-size: 0.9rem;
    }
    .input-field:focus {
      outline: none;
      border-color: var(--cyan-500);
      box-shadow: 0 0 0 2px var(--cyan-500);
    }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .editor-section {
      background-color: var(--bg-dark-950);
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      margin-bottom: 1.25rem;
    }

    .error-message {
      color: var(--red-400);
      font-size: 0.8rem;
      margin-bottom: 1rem;
      padding: 0.6rem;
      background-color: rgba(248, 113, 113, 0.1);
      border: 1px solid var(--red-400);
      border-radius: 0.375rem;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .actions-single {
      margin-bottom: 0.75rem;
    }
    
    .btn {
      padding: 0.6rem;
      border-radius: 0.375rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 0.85rem;
      text-align: center;
      width: 100%;
    }
    .btn svg { width: 16px; height: 16px; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
    .btn-pause { background-color: var(--yellow-600); color: black; }
    .btn-pause:hover:not(:disabled) { background-color: var(--yellow-500); }
    .btn-resume { background-color: var(--green-600); color: white; }
    .btn-resume:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-secondary { background-color: var(--bg-dark-600); color: white; }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-500); }

    .speed-slider-group { display: flex; align-items: center; gap: 1rem; }
    .speed-slider {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: var(--bg-dark-700);
      border-radius: 3px;
      outline: none;
      opacity: 0.9;
    }
    .speed-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: var(--cyan-500);
      border-radius: 50%;
      cursor: pointer;
    }
    .speed-value {
      width: 4rem;
      text-align: right;
      color: var(--text-gray-400);
      font-size: 0.85rem;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }
    @media (min-width: 768px) {
      .main-content { padding: 2rem; }
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: var(--text-gray-200);
    }

    .visualization-section {
      display: flex;
      flex-direction: column;
      min-height: 250px;
    }
    .status-bar {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.375rem;
      text-align: center;
      min-height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .status-text {
      font-size: 1rem;
      font-weight: 500;
      transition: color 0.3s;
    }
    .status-default { color: var(--cyan-400); }
    .status-found { color: var(--green-400); }
    .status-not-found { color: var(--red-400); }
    .status-paused { color: var(--yellow-400); }

    .visualization-boxes {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 2rem;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-height: 380px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }
    
    .box {
      width: 3.2rem;
      height: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: border-color 0.2s, background-color 0.2s, transform 0.2s;
      border: 2px solid transparent;
      position: relative;
      user-select: none;
    }
    .box.default {
      background-color: var(--bg-dark-600);
      color: white;
      border-color: var(--border-gray-500);
    }
    .box.visiting {
      background-color: var(--yellow-500);
      color: black;
      transform: scale(1.1);
      border-color: var(--yellow-400);
    }
    .box.pre-op {
      background-color: var(--orange-500);
      color: white;
      transform: scale(1.1);
      border-color: var(--orange-600);
    }
    .box.found {
      background-color: var(--green-500);
      color: white;
      transform: scale(1.1);
      border-color: var(--green-400);
      box-shadow: 0 0 15px var(--green-500);
    }

    .lower-content-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1.5rem;
      flex: 1;
    }
    @media (min-width: 1024px) {
      .lower-content-area { flex-direction: row; }
    }

    .code-section, .log-section {
      display: flex;
      flex-direction: column;
      flex: 1; 
      min-height: 250px;
    }
    .code-block, .log-block {
      background-color: var(--bg-dark-950);
      padding: 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      height: 100%;
      overflow: auto;
    }
    @media (max-width: 1023px) {
      .log-block { max-height: 250px; }
    }

    .code-block pre {
      margin: 0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .code-line {
      display: block;
      padding: 0 0.5rem;
      transition: background-color 0.2s;
    }
    .code-line.highlight {
      background-color: rgba(6, 182, 212, 0.2);
      border-radius: 0.25rem;
    }
    .code-line.comment {
      color: var(--text-gray-500);
      font-style: italic;
    }
    
    .log-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .log-item {
      padding: 0.2rem 0.5rem;
      border-bottom: 1px solid var(--bg-dark-700);
      color: var(--text-gray-300);
    }
    .log-item:last-child {
      border-bottom: none; 
      color: white;
    }
  `}</style>
);

const codeSnippets = {
  bfs: {
    python: `
def bfs(graph, start, target):
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        node = queue.pop(0)
        if node == target:
            return True # Found!
            
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return False
    `.trim(),
    c: `
int bfs(int adj[N][N], int start, int target, int n) {
    int visited[N] = {0};
    int queue[N], front = 0, rear = 0;
    
    queue[rear++] = start;
    visited[start] = 1;
    
    while (front < rear) {
        int node = queue[front++];
        if (node == target) return 1;
        
        for (int i = 0; i < n; i++) {
            if (adj[node][i] && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
    return 0;
}
    `.trim(),
    cpp: `
bool bfs(map<int, vector<int>>& adj, int start, int target) {
    unordered_set<int> visited;
    queue<int> q;
    
    q.push(start);
    visited.insert(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        if (node == target) return true;
        
        for (int neighbor : adj[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return false;
}
    `.trim(),
    java: `
public boolean bfs(Map<Integer, List<Integer>> adj, int start, int target) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> q = new LinkedList<>();
    
    q.add(start);
    visited.add(start);
    
    while (!q.isEmpty()) {
        int node = q.poll();
        if (node == target) return true;
        
        for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                q.add(neighbor);
            }
        }
    }
    return false;
}
    `.trim()
  },
  dfs: {
    python: `
def dfs(graph, start, target):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            if node == target:
                return True # Found!
                
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    return False
    `.trim(),
    c: `
int dfs(int adj[N][N], int start, int target, int n) {
    int visited[N] = {0};
    int stack[N], top = 0;
    
    stack[top++] = start;
    
    while (top > 0) {
        int node = stack[--top];
        if (!visited[node]) {
            visited[node] = 1;
            if (node == target) return 1;
            
            for (int i = n - 1; i >= 0; i--) {
                if (adj[node][i] && !visited[i]) {
                    stack[top++] = i;
                }
            }
        }
    }
    return 0;
}
    `.trim(),
    cpp: `
bool dfs(map<int, vector<int>>& adj, int start, int target) {
    unordered_set<int> visited;
    stack<int> s;
    
    s.push(start);
    
    while (!s.empty()) {
        int node = s.top();
        s.pop();
        
        if (visited.find(node) == visited.end()) {
            visited.insert(node);
            if (node == target) return true;
            
            for (auto it = adj[node].rbegin(); it != adj[node].rend(); ++it) {
                if (visited.find(*it) == visited.end()) {
                    s.push(*it);
                }
            }
        }
    }
    return false;
}
    `.trim(),
    java: `
public boolean dfs(Map<Integer, List<Integer>> adj, int start, int target) {
    Set<Integer> visited = new HashSet<>();
    Stack<Integer> s = new Stack<>();
    
    s.push(start);
    
    while (!s.isEmpty()) {
        int node = s.pop();
        
        if (!visited.contains(node)) {
            visited.add(node);
            if (node == target) return true;
            
            List<Integer> neighbors = adj.getOrDefault(node, new ArrayList<>());
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                int neighbor = neighbors.get(i);
                if (!visited.contains(neighbor)) {
                    s.push(neighbor);
                }
            }
        }
    }
    return false;
}
    `.trim()
  }
};

const LINE_MAPS = {
  bfs: {
    python: { init: 2, loop_cond: 6, pop: 7, check_target: 8, loop_neighbors: 11, check_visited: 12, push: 13, return_false: 15 },
    c: { init: 2, loop_cond: 8, pop: 9, check_target: 10, loop_neighbors: 12, check_visited: 13, push: 14, return_false: 18 },
    cpp: { init: 2, loop_cond: 8, pop: 10, check_target: 11, loop_neighbors: 13, check_visited: 14, push: 16, return_false: 20 },
    java: { init: 2, loop_cond: 8, pop: 9, check_target: 10, loop_neighbors: 12, check_visited: 13, push: 15, return_false: 19 }
  },
  dfs: {
    python: { init: 2, loop_cond: 5, pop: 6, check_target: 9, loop_neighbors: 11, check_visited: 12, push: 13, return_false: 14 },
    c: { init: 2, loop_cond: 7, pop: 8, check_target: 11, loop_neighbors: 13, check_visited: 14, push: 15, return_false: 19 },
    cpp: { init: 2, loop_cond: 7, pop: 8, check_target: 13, loop_neighbors: 16, check_visited: 17, push: 18, return_false: 23 },
    java: { init: 2, loop_cond: 8, pop: 9, check_target: 12, loop_neighbors: 15, check_visited: 16, push: 18, return_false: 23 }
  }
};

const PRESETS = {
  ring: {
    nodes: [
      { id: 1, label: 'C1', x: 50, y: 15, state: 'default' },
      { id: 2, label: 'C2', x: 75, y: 35, state: 'default' },
      { id: 3, label: 'C3', x: 75, y: 65, state: 'default' },
      { id: 4, label: 'C4', x: 50, y: 85, state: 'default' },
      { id: 5, label: 'C5', x: 25, y: 65, state: 'default' },
      { id: 6, label: 'C6', x: 25, y: 35, state: 'default' }
    ],
    edges: [
      { from: 1, to: 2, state: 'default' },
      { from: 2, to: 3, state: 'default' },
      { from: 3, to: 4, state: 'default' },
      { from: 4, to: 5, state: 'default' },
      { from: 5, to: 6, state: 'default' },
      { from: 6, to: 1, state: 'default' },
      { from: 1, to: 4, state: 'default' }
    ],
    start: 1,
    target: 4
  },
  tree: {
    nodes: [
      { id: 1, label: 'T1', x: 50, y: 15, state: 'default' },
      { id: 2, label: 'T2', x: 30, y: 45, state: 'default' },
      { id: 3, label: 'T3', x: 70, y: 45, state: 'default' },
      { id: 4, label: 'T4', x: 15, y: 75, state: 'default' },
      { id: 5, label: 'T5', x: 45, y: 75, state: 'default' },
      { id: 6, label: 'T6', x: 55, y: 75, state: 'default' },
      { id: 7, label: 'T7', x: 85, y: 75, state: 'default' }
    ],
    edges: [
      { from: 1, to: 2, state: 'default' },
      { from: 1, to: 3, state: 'default' },
      { from: 2, to: 4, state: 'default' },
      { from: 2, to: 5, state: 'default' },
      { from: 3, to: 6, state: 'default' },
      { from: 3, to: 7, state: 'default' }
    ],
    start: 1,
    target: 7
  },
  grid: {
    nodes: [
      { id: 1, label: 'G1', x: 25, y: 25, state: 'default' },
      { id: 2, label: 'G2', x: 50, y: 25, state: 'default' },
      { id: 3, label: 'G3', x: 75, y: 25, state: 'default' },
      { id: 4, label: 'G4', x: 25, y: 50, state: 'default' },
      { id: 5, label: 'G5', x: 50, y: 50, state: 'default' },
      { id: 6, label: 'G6', x: 75, y: 50, state: 'default' },
      { id: 7, label: 'G7', x: 25, y: 75, state: 'default' },
      { id: 8, label: 'G8', x: 50, y: 75, state: 'default' },
      { id: 9, label: 'G9', x: 75, y: 75, state: 'default' }
    ],
    edges: [
      { from: 1, to: 2, state: 'default' },
      { from: 2, to: 3, state: 'default' },
      { from: 1, to: 4, state: 'default' },
      { from: 2, to: 5, state: 'default' },
      { from: 3, to: 6, state: 'default' },
      { from: 4, to: 5, state: 'default' },
      { from: 5, to: 6, state: 'default' },
      { from: 4, to: 7, state: 'default' },
      { from: 5, to: 8, state: 'default' },
      { from: 6, to: 9, state: 'default' },
      { from: 7, to: 8, state: 'default' },
      { from: 8, to: 9, state: 'default' }
    ],
    start: 1,
    target: 9
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function BFSDFSGraphVisualizer() {
  const [activePresetKey, setActivePresetKey] = useState("ring");
  const [nodes, setNodes] = useState(PRESETS.ring.nodes);
  const [edges, setEdges] = useState(PRESETS.ring.edges);
  
  const [startNodeId, setStartNodeId] = useState(PRESETS.ring.start);
  const [targetNodeId, setTargetNodeId] = useState(PRESETS.ring.target);

  const [activeAlgo, setActiveAlgo] = useState("bfs"); 
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Graph loaded. Drag nodes, adjust presets, or set start & target.");
  const [executionLog, setExecutionLog] = useState(["[System] Circular Ring Preset loaded. Drag nodes directly on the canvas to reorganize."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic Custom Graph States
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [edgeFromId, setEdgeFromId] = useState("");
  const [edgeToId, setEdgeToId] = useState("");
  const [nodeToDeleteId, setNodeToDeleteId] = useState("");

  // Dragging States
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  const pausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const logContainerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  const handleClearAll = () => {
    if (isVisualizing) return;
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;

    setNodes([]);
    setEdges([]);
    setStartNodeId(null);
    setTargetNodeId(null);
    setError(null);
    setStatus("Graph cleared. Add nodes and edges to begin.");
    setHighlightLineNum(-1);
    setExecutionLog(["[System] Cleared all nodes and edges. Canvas is empty."]);

    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };

  const loadPreset = (presetKey) => {
    if (isVisualizing) return;
    setActivePresetKey(presetKey);
    const p = PRESETS[presetKey];
    setNodes(p.nodes);
    setEdges(p.edges);
    setStartNodeId(p.start);
    setTargetNodeId(p.target);
    setExecutionLog([`[Preset] Loaded ${presetKey.toUpperCase()} graph network layout.`]);
    setStatus("Ready.");
    setError(null);
  };

  const updateNodeState = (nodesList, id, stateName) => {
    return nodesList.map(n => n.id === id ? { ...n, state: stateName } : n);
  };

  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Press Resume to continue.");
      await sleep(100);
    }
  };

  const cleanup = () => {
    setIsVisualizing(false);
    setTimeout(() => {
      if (!isCancelledRef.current) {
        setNodes(prev => prev.map(n => ({ ...n, state: 'default' })));
        setEdges(prev => prev.map(e => ({ ...e, state: 'default' })));
        setStatus("Ready.");
      }
    }, speed * 2);
  };

  const handleReset = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;

    const p = PRESETS[activePresetKey] || PRESETS.ring;
    setNodes(p.nodes.map(n => ({ ...n, state: 'default' })));
    setEdges(p.edges.map(e => ({ ...e, state: 'default' })));
    setStartNodeId(p.start);
    setTargetNodeId(p.target);
    setError(null);
    setStatus("Graph reset to preset layout.");
    setHighlightLineNum(-1);
    setExecutionLog(["[System] Restored preset graph dimensions."]);

    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    pausedRef.current = nextPaused;
    if (nextPaused) {
      setExecutionLog(prev => [...prev, "Paused visual walk."]);
    } else {
      setExecutionLog(prev => [...prev, "Resuming search..."]);
    }
  };

  const handleNodeClick = (id) => {
    if (isVisualizing) return;
    setError(null);
    if (startNodeId === id) {
      setStartNodeId(null);
      setExecutionLog(prev => [...prev, `Deselected Start Node.`]);
    } else if (targetNodeId === id) {
      setTargetNodeId(null);
      setExecutionLog(prev => [...prev, `Deselected Target Node.`]);
    } else if (!startNodeId) {
      setStartNodeId(id);
      setExecutionLog(prev => [...prev, `Set Start Node: ${nodes.find(n => n.id === id)?.label}`]);
    } else {
      setTargetNodeId(id);
      setExecutionLog(prev => [...prev, `Set Target Node: ${nodes.find(n => n.id === id)?.label}`]);
    }
  };

  const handleMouseDown = (e, nodeId) => {
    if (isVisualizing) return;
    e.preventDefault();
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e) => {
    if (draggedNodeId === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Convert client coordinates to canvas percentage offset
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Boundary constraints
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(x), y: Math.round(y) } : n));
  };

  const handleMouseUpOrLeave = () => {
    setDraggedNodeId(null);
  };

  const handleTouchMove = (e) => {
    if (draggedNodeId === null || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    
    let x = ((touch.clientX - rect.left) / rect.width) * 100;
    let y = ((touch.clientY - rect.top) / rect.height) * 100;

    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(x), y: Math.round(y) } : n));
  };

  const handleAddNode = () => {
    if (isVisualizing) return;
    const label = newNodeLabel.trim();
    if (!label) {
      setError("Please specify a valid label to add a Node.");
      return;
    }
    if (nodes.some(n => n.label.toLowerCase() === label.toLowerCase())) {
      setError(`Node with label "${label}" already exists.`);
      return;
    }

    // Place new node near center with standard offsets
    const nextId = nodes.length > 0 ? Math.max(...nodes.map(n => Number(n.id) || 0)) + 1 : 1;
    const offset = (nodes.length % 5) * 5;
    const newNode = {
      id: nextId,
      label: label.toUpperCase(),
      x: 50 + (nodes.length % 2 === 0 ? offset : -offset),
      y: 50 + (nodes.length % 2 === 1 ? offset : -offset),
      state: 'default'
    };

    setNodes(prev => [...prev, newNode]);
    setExecutionLog(prev => [...prev, `[Editor] Created Node ${label.toUpperCase()} at center. Drag to reposition.`]);
    setNewNodeLabel("");
    setError(null);
  };

  const handleDeleteNode = () => {
    if (isVisualizing) return;
    const idToDelete = Number(nodeToDeleteId);
    if (!idToDelete) {
      setError("Please select a valid node to delete.");
      return;
    }

    // Filter nodes and all associated connecting edges
    setNodes(prev => prev.filter(n => n.id !== idToDelete));
    setEdges(prev => prev.filter(e => e.from !== idToDelete && e.to !== idToDelete));
    
    // Clean up selected targets if they were deleted
    if (startNodeId === idToDelete) setStartNodeId(null);
    if (targetNodeId === idToDelete) setTargetNodeId(null);

    setExecutionLog(prev => [...prev, `[Editor] Deleted Node ID: ${idToDelete} and its incoming/outgoing connections.`]);
    setNodeToDeleteId("");
    setError(null);
  };

  const handleAddEdge = () => {
    if (isVisualizing) return;
    const fromId = Number(edgeFromId);
    const toId = Number(edgeToId);

    if (!fromId || !toId) {
      setError("Select both source and destination nodes to draw an edge.");
      return;
    }
    if (fromId === toId) {
      setError("Self-loops are not allowed in this visualizer.");
      return;
    }
    if (edges.some(e => e.from === fromId && e.to === toId)) {
      setError("This directional connection already exists.");
      return;
    }

    const newEdge = { from: fromId, to: toId, state: 'default' };
    setEdges(prev => [...prev, newEdge]);
    setExecutionLog(prev => [...prev, `[Editor] Created directed edge from ${nodes.find(n => n.id === fromId)?.label} to ${nodes.find(n => n.id === toId)?.label}`]);
    setEdgeFromId("");
    setEdgeToId("");
    setError(null);
  };

  const runAlgorithm = async () => {
    if (isVisualizing) return;
    if (!startNodeId || !targetNodeId) {
      setError("Please specify both a Start and Target Node to execute.");
      return;
    }
    if (startNodeId === targetNodeId) {
      setError("Start and Target nodes must be different.");
      return;
    }

    setError(null);
    setIsVisualizing(true);
    isCancelledRef.current = false;

    let currNodes = nodes.map(n => ({ ...n, state: 'default' }));
    let currEdges = edges.map(e => ({ ...e, state: 'default' }));
    setNodes(currNodes);
    setEdges(currEdges);

    if (activeAlgo === 'bfs') {
      await runBFS();
    } else {
      await runDFS();
    }
  };

  const runBFS = async () => {
    setExecutionLog(prev => [...prev, `--- Initiating BFS from ${nodes.find(n => n.id === startNodeId)?.label} ---`]);
    let queue = [startNodeId];
    let visited = new Set([startNodeId]);

    setHighlightLineNum(LINE_MAPS.bfs[language].init);
    setStatus(`Enqueuing start node ${nodes.find(n => n.id === startNodeId)?.label}.`);
    setNodes(prev => updateNodeState(prev, startNodeId, 'visiting'));
    await sleep(speed);

    while (queue.length > 0) {
      if (isCancelledRef.current) return cleanup();
      await checkPause();

      setHighlightLineNum(LINE_MAPS.bfs[language].loop_cond);
      setStatus(`Queue contents: [ ${queue.map(id => nodes.find(n => n.id === id)?.label).join(', ')} ]`);
      await sleep(speed);

      const current = queue.shift();
      setHighlightLineNum(LINE_MAPS.bfs[language].pop);
      setStatus(`Dequeued node ${nodes.find(n => n.id === current)?.label}.`);
      setNodes(prev => updateNodeState(prev, current, 'pre-op')); 
      await sleep(speed);

      setHighlightLineNum(LINE_MAPS.bfs[language].check_target);
      if (current === targetNodeId) {
        setNodes(prev => updateNodeState(prev, current, 'found')); 
        setStatus(`Search successful! Found node ${nodes.find(n => n.id === current)?.label}`);
        setExecutionLog(prev => [...prev, `BFS Success: Target reached at ${nodes.find(n => n.id === current)?.label}`]);
        setIsVisualizing(false);
        return;
      }

      setNodes(prev => updateNodeState(prev, current, 'found'));
      setExecutionLog(prev => [...prev, `Visited Node: ${nodes.find(n => n.id === current)?.label}`]);

      const neighbors = edges.filter(e => e.from === current).map(e => e.to);
      setHighlightLineNum(LINE_MAPS.bfs[language].loop_neighbors);
      setStatus(`Scanning neighbors of ${nodes.find(n => n.id === current)?.label}.`);
      await sleep(speed);

      for (let neighbor of neighbors) {
        if (isCancelledRef.current) return cleanup();
        await checkPause();

        setHighlightLineNum(LINE_MAPS.bfs[language].check_visited);
        const hasBeenVisited = visited.has(neighbor);
        setStatus(`Checking neighbor ${nodes.find(n => n.id === neighbor)?.label}. Visited? ${hasBeenVisited ? 'Yes' : 'No'}`);
        await sleep(speed);

        if (!hasBeenVisited) {
          visited.add(neighbor);
          queue.push(neighbor);

          setEdges(prev => prev.map(e => e.from === current && e.to === neighbor ? { ...e, state: 'traversed' } : e));
          setNodes(prev => updateNodeState(prev, neighbor, 'visiting'));

          setHighlightLineNum(LINE_MAPS.bfs[language].push);
          setStatus(`Enqueued node ${nodes.find(n => n.id === neighbor)?.label}.`);
          setExecutionLog(prev => [...prev, `Enqueued neighbor: ${nodes.find(n => n.id === neighbor)?.label}`]);
          await sleep(speed);
        }
      }
    }

    setHighlightLineNum(LINE_MAPS.bfs[language].return_false);
    setStatus("Queue exhausted. Target node unreachable.");
    setExecutionLog(prev => [...prev, `BFS Completed: Target not reached.`]);
    cleanup();
  };

  const runDFS = async () => {
    setExecutionLog(prev => [...prev, `--- Initiating DFS from ${nodes.find(n => n.id === startNodeId)?.label} ---`]);
    let stack = [startNodeId];
    let visited = new Set();

    setHighlightLineNum(LINE_MAPS.dfs[language].init);
    setStatus(`Stacking start node ${nodes.find(n => n.id === startNodeId)?.label}.`);
    setNodes(prev => updateNodeState(prev, startNodeId, 'visiting'));
    await sleep(speed);

    while (stack.length > 0) {
      if (isCancelledRef.current) return cleanup();
      await checkPause();

      setHighlightLineNum(LINE_MAPS.dfs[language].loop_cond);
      setStatus(`Stack contents: [ ${stack.map(id => nodes.find(n => n.id === id)?.label).join(', ')} ]`);
      await sleep(speed);

      const current = stack.pop();
      setHighlightLineNum(LINE_MAPS.dfs[language].pop);
      setStatus(`Popped node ${nodes.find(n => n.id === current)?.label} from stack.`);
      setNodes(prev => updateNodeState(prev, current, 'pre-op')); 
      await sleep(speed);

      if (!visited.has(current)) {
        visited.add(current);

        setHighlightLineNum(LINE_MAPS.dfs[language].check_target);
        if (current === targetNodeId) {
          setNodes(prev => updateNodeState(prev, current, 'found')); 
          setStatus(`Search successful! Found node ${nodes.find(n => n.id === current)?.label}`);
          setExecutionLog(prev => [...prev, `DFS Success: Target reached at ${nodes.find(n => n.id === current)?.label}`]);
          setIsVisualizing(false);
          return;
        }

        setNodes(prev => updateNodeState(prev, current, 'found'));
        setExecutionLog(prev => [...prev, `Visited Node: ${nodes.find(n => n.id === current)?.label}`]);

        const neighbors = edges.filter(e => e.from === current).map(e => e.to);
        setHighlightLineNum(LINE_MAPS.dfs[language].loop_neighbors);
        setStatus(`Scanning neighbors of ${nodes.find(n => n.id === current)?.label}.`);
        await sleep(speed);

        for (let neighbor of neighbors) {
          if (isCancelledRef.current) return cleanup();
          await checkPause();

          setHighlightLineNum(LINE_MAPS.dfs[language].check_visited);
          const hasBeenVisited = visited.has(neighbor);
          setStatus(`Checking neighbor ${nodes.find(n => n.id === neighbor)?.label}. Visited? ${hasBeenVisited ? 'Yes' : 'No'}`);
          await sleep(speed);

          if (!hasBeenVisited) {
            stack.push(neighbor);

            setEdges(prev => prev.map(e => e.from === current && e.to === neighbor ? { ...e, state: 'traversed' } : e));
            setNodes(prev => updateNodeState(prev, neighbor, 'visiting'));

            setHighlightLineNum(LINE_MAPS.dfs[language].push);
            setStatus(`Pushed node ${nodes.find(n => n.id === neighbor)?.label} to stack.`);
            setExecutionLog(prev => [...prev, `Pushed neighbor: ${nodes.find(n => n.id === neighbor)?.label}`]);
            await sleep(speed);
          }
        }
      }
    }

    setHighlightLineNum(LINE_MAPS.dfs[language].return_false);
    setStatus("Stack exhausted. Target node unreachable.");
    setExecutionLog(prev => [...prev, `DFS Completed: Target not reached.`]);
    cleanup();
  };

  const codeLines = codeSnippets[activeAlgo][language].trim().split('\n');
  const statusColor = status.includes("successful")
    ? "status-found"
    : status.includes("unreachable")
    ? "status-not-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <GitFork size={26} style={{ transform: 'rotate(180deg)' }} />
          BFS & DFS Graph
        </h1>

        {/* Dynamic Preset Switcher */}
        <div className="input-group">
          <label htmlFor="preset">Graph Preset</label>
          <select
            id="preset"
            value={activePresetKey}
            onChange={(e) => loadPreset(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          >
            <option value="ring">Ring Cycle (6 Nodes)</option>
            <option value="tree">Binary Tree (7 Nodes)</option>
            <option value="grid">Grid Network (9 Nodes)</option>
          </select>
        </div>

        {/* --- Custom Graph Builder Panel --- */}
        <div className="editor-section">
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--cyan-400)', display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
            Graph Editor (Interactive)
          </span>

          {/* Add Node Tool */}
          <div className="input-group">
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                placeholder="Node Name (e.g., A)"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
                style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
              />
              <button
                onClick={handleAddNode}
                disabled={isVisualizing}
                className="btn btn-green"
                style={{ padding: '0.4rem 0.75rem', width: 'auto' }}
                title="Add custom node to visualizer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add Edge Tool */}
          <div className="input-group" style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <select
                value={edgeFromId}
                onChange={(e) => setEdgeFromId(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
                style={{ padding: '0.4rem', fontSize: '0.8rem' }}
              >
                <option value="">From</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
              <ArrowRight size={14} style={{ color: 'var(--text-gray-500)' }} />
              <select
                value={edgeToId}
                onChange={(e) => setEdgeToId(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
                style={{ padding: '0.4rem', fontSize: '0.8rem' }}
              >
                <option value="">To</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
              <button
                onClick={handleAddEdge}
                disabled={isVisualizing}
                className="btn btn-cyan"
                style={{ padding: '0.4rem', width: 'auto' }}
              >
                Connect
              </button>
            </div>
          </div>

          {/* Delete Node Tool */}
          <div className="input-group" style={{ marginBottom: '0' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <select
                value={nodeToDeleteId}
                onChange={(e) => setNodeToDeleteId(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
                style={{ padding: '0.4rem', fontSize: '0.85rem' }}
              >
                <option value="">Select Node to Delete</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
              <button
                onClick={handleDeleteNode}
                disabled={isVisualizing}
                className="btn btn-red"
                style={{ padding: '0.4rem', width: 'auto' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={handleClearAll}
              disabled={isVisualizing}
              className="btn btn-red"
              style={{ padding: '0.4rem', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <Trash2 size={14} /> Delete All Nodes
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Start / Target Pickers */}
        <div className="actions-grid">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-400)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Start Node</span>
            <select
              value={startNodeId || ""}
              onChange={(e) => setStartNodeId(Number(e.target.value))}
              disabled={isVisualizing}
              className="input-field"
            >
              <option value="">Choose...</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-400)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Target Node</span>
            <select
              value={targetNodeId || ""}
              onChange={(e) => setTargetNodeId(Number(e.target.value))}
              disabled={isVisualizing}
              className="input-field"
            >
              <option value="">Choose...</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
        </div>

        {/* Algorithm Picker */}
        <div className="input-group">
          <label htmlFor="algoSelect">Select Algorithm</label>
          <select
            id="algoSelect"
            value={activeAlgo}
            onChange={(e) => setActiveAlgo(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          >
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
          </select>
        </div>

        <div className="actions-single">
          <button 
            onClick={runAlgorithm} 
            disabled={isVisualizing || !startNodeId || !targetNodeId} 
            className="btn btn-green"
          >
            Execute {activeAlgo.toUpperCase()}
          </button>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        <div className="actions-grid">
          <button
            onClick={togglePause}
            disabled={!isVisualizing}
            className={`btn ${isPaused ? 'btn-resume' : 'btn-pause'}`}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          
          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} />
            Reset Tree
          </button>
        </div>

        {/* --- Language Choice --- */}
        <div className="input-group">
          <label htmlFor="language">Code Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>
        </div>

        {/* --- Speed Range --- */}
        <div className="input-group">
          <label htmlFor="speed">Visualization Speed</label>
          <div className="speed-slider-group">
            <input
              id="speed"
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="speed-slider"
            />
            <span className="speed-value">{speed} ms</span>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="main-content">
        
        {/* --- Visualization Canvas --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>
          
          <div 
            className="visualization-boxes"
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
          >
            {/* SVG Connection Edge Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="25"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-gray-600)" />
                </marker>
                <marker
                  id="arrow-traversed"
                  viewBox="0 0 10 10"
                  refX="25"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--cyan-400)" />
                </marker>
              </defs>

              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const isTraversed = edge.state === 'traversed';
                return (
                  <line
                    key={idx}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={isTraversed ? "var(--cyan-400)" : "var(--border-gray-700)"}
                    strokeWidth={isTraversed ? "3.5" : "1.5"}
                    markerEnd={`url(#${isTraversed ? 'arrow-traversed' : 'arrow'})`}
                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                  />
                );
              })}
            </svg>

            {/* Render Draggable Nodes */}
            {nodes.length === 0 && (
              <span style={{ color: 'var(--text-gray-500)', zIndex: 1, margin: 'auto' }}>
                Graph is empty. Use the editor to add nodes and create connections.
              </span>
            )}

            {nodes.map(node => (
              <div
                key={node.id}
                className={`box ${node.state || 'default'}`}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  cursor: isVisualizing ? 'not-allowed' : 'grab',
                  width: '3.1rem',
                  height: '3.1rem',
                  fontSize: '0.9rem'
                }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onTouchStart={(e) => handleMouseDown(e, node.id)}
                onClick={() => handleNodeClick(node.id)}
              >
                {node.label}
                {node.id === startNodeId && (
                  <span style={{ position: 'absolute', top: '-1.25rem', fontSize: '0.6rem', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--green-400)', color: 'var(--green-400)', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>START</span>
                )}
                {node.id === targetNodeId && (
                  <span style={{ position: 'absolute', bottom: '-1.25rem', fontSize: '0.6rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--red-400)', color: 'var(--red-400)', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>TARGET</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- Lower Content (Code + Logs) --- */}
        <div className="lower-content-area">
          {/* --- Code Trace Window --- */}
          <section className="code-section">
            <h2 className="section-title">Code</h2>
            <div className="code-block">
              <pre>
                <code>
                  {codeLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`code-line
                        ${highlightLineNum === (idx + 1) ? 'highlight' : ''}
                        ${(line.trim().startsWith('#') || line.trim().startsWith('//')) ? 'comment' : ''}
                      `}
                    >
                      {line || '\u00A0'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </section>

          {/* --- Output Log Window --- */}
          <section className="log-section">
            <h2 className="section-title">Execution Log</h2>
            <div className="log-block" ref={logContainerRef}>
              <ul className="log-list">
                {executionLog.map((log, idx) => (
                  <li key={idx} className="log-item">
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}