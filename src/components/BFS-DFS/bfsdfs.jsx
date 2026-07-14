import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Plus, Trash2, ArrowRight, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

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
    }

    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; height: 100vh; overflow: hidden; }
    }

    * { box-sizing: border-box; }

    .controls-sidebar {
      width: 100%;
      background-color: var(--bg-dark-800);
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10;
      overflow-y: auto;
    }
    @media (min-width: 1024px) {
      .controls-sidebar { width: 25%; min-width: 320px; max-width: 360px; }
    }

    .sidebar-title { font-size: 1.6rem; font-weight: 700; margin: 0 0 1.5rem 0; color: var(--cyan-400); display: flex; align-items: center; }
    .sidebar-title svg { margin-right: 0.75rem; }

    .input-group { margin-bottom: 0.85rem; }
    .input-group label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.35rem; color: var(--text-gray-300); text-transform: uppercase; letter-spacing: 0.05em; }
    .input-field { width: 100%; padding: 0.6rem 0.75rem; background-color: var(--bg-dark-700); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-200); font-size: 0.9rem; }
    .input-field:focus { outline: none; border-color: var(--cyan-500); box-shadow: 0 0 0 2px var(--cyan-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .editor-section { background-color: var(--bg-dark-950); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-gray-700); margin-bottom: 1.25rem; }
    .error-message { color: var(--red-400); font-size: 0.8rem; margin-bottom: 1rem; padding: 0.6rem; background-color: rgba(248, 113, 113, 0.1); border: 1px solid var(--red-400); border-radius: 0.375rem; }
    
    .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem; }
    
    .btn { padding: 0.6rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s; cursor: pointer; border: none; font-size: 0.85rem; width: 100%; }
    .btn svg { width: 16px; height: 16px; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }

    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
    .btn-secondary { background-color: var(--bg-dark-600); color: white; }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-500); }

    /* Player Controls */
    .player-panel { background: rgba(6, 182, 212, 0.1); border: 1px solid var(--cyan-600); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
    .player-controls { display: flex; justify-content: space-between; gap: 0.5rem; margin-top: 0.75rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-700); border: 1px solid var(--border-gray-600); color: white; padding: 0.5rem; border-radius: 0.375rem; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-600); color: var(--cyan-400); border-color: var(--cyan-500); }
    .ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .slider { width: 100%; -webkit-appearance: none; height: 6px; background: var(--bg-dark-700); border-radius: 3px; outline: none; margin-bottom: 0.5rem; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: var(--cyan-500); border-radius: 50%; cursor: pointer; }

    .main-content { flex: 1; display: flex; flex-direction: column; padding: 1.5rem; overflow-y: auto; }
    @media (min-width: 768px) { .main-content { padding: 2rem; } }
    .section-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 1rem 0; color: var(--text-gray-200); }

    .status-bar { width: 100%; padding: 0.75rem; margin-bottom: 1rem; background-color: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.375rem; text-align: center; min-height: 46px; display: flex; align-items: center; justify-content: center; }
    .status-text { font-size: 1rem; font-weight: 500; }
    .status-default { color: var(--cyan-400); }
    .status-found { color: var(--green-400); }
    .status-not-found { color: var(--yellow-400); }

    .visualization-layout { display: flex; flex-direction: row; flex: 1; width: 100%; background-color: rgba(0, 0, 0, 0.2); border-radius: 0.5rem; border: 1px solid var(--border-gray-700); overflow: hidden; min-height: 380px; }
    .visualization-boxes { flex: 1; display: flex; justify-content: center; align-items: flex-start; gap: 0.5rem; padding: 2rem; position: relative; overflow: hidden; }

    .ds-sidebar { width: 140px; background-color: rgba(0, 0, 0, 0.4); border-left: 1px solid var(--border-gray-700); display: flex; flex-direction: column; align-items: center; padding: 1rem 0.5rem; overflow-y: auto; }
    .ds-title { font-size: 0.8rem; font-weight: 700; color: var(--cyan-400); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; }
    .ds-list { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
    .ds-list.stack-mode { flex-direction: column-reverse; justify-content: flex-end; }
    .ds-item { background-color: var(--bg-dark-700); border: 1px solid var(--border-gray-600); color: white; padding: 0.5rem; text-align: center; border-radius: 0.375rem; font-weight: 600; font-size: 0.85rem; }
    
    .box { width: 3.2rem; height: 3.2rem; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 700; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: border-color 0.2s, background-color 0.2s, transform 0.2s; border: 2px solid transparent; position: relative; user-select: none; }
    .box.default { background-color: var(--bg-dark-600); color: white; border-color: var(--border-gray-500); }
    .box.visiting { background-color: var(--yellow-500); color: black; transform: scale(1.1); border-color: var(--yellow-400); }
    .box.pre-op { background-color: var(--orange-500); color: white; transform: scale(1.1); border-color: var(--orange-600); }
    .box.found { background-color: var(--green-500); color: white; transform: scale(1.1); border-color: var(--green-400); box-shadow: 0 0 15px var(--green-500); }

    .lower-content-area { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; flex: 1; }
    @media (min-width: 1024px) { .lower-content-area { flex-direction: row; } }

    .code-section, .log-section { display: flex; flex-direction: column; flex: 1; min-height: 250px; }
    .code-block, .log-block { background-color: var(--bg-dark-950); padding: 1.25rem; border-radius: 0.5rem; border: 1px solid var(--border-gray-700); height: 100%; overflow: auto; }
    @media (max-width: 1023px) { .log-block { max-height: 250px; } }

    .code-block pre { margin: 0; font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.85rem; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; transition: background-color 0.2s; }
    .code-line.highlight { background-color: rgba(6, 182, 212, 0.2); border-radius: 0.25rem; }
    .code-line.comment { color: var(--text-gray-500); font-style: italic; }
    
    .log-list { margin: 0; padding: 0; list-style-type: none; font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.85rem; line-height: 1.5; }
    .log-item { padding: 0.2rem 0.5rem; border-bottom: 1px solid var(--bg-dark-700); color: var(--text-gray-300); }
    .log-item:last-child { border-bottom: none; color: white; }
  `}</style>
);

const codeSnippets = {
  bfs: {
    python: `def bfs(graph, start, target=None):
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        node = queue.pop(0)
        if target is not None and node == target:
            return True # Found!
            
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return False`,
    c: `int bfs(int adj[N][N], int start, int target, int n) {
    int visited[N] = {0};
    int queue[N], front = 0, rear = 0;
    
    queue[rear++] = start;
    visited[start] = 1;
    
    while (front < rear) {
        int node = queue[front++];
        if (target != -1 && node == target) return 1;
        
        for (int i = 0; i < n; i++) {
            if (adj[node][i] && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
    return 0;
}`,
    cpp: `bool bfs(map<int, vector<int>>& adj, int start, int target) {
    unordered_set<int> visited;
    queue<int> q;
    
    q.push(start);
    visited.insert(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        if (target != -1 && node == target) return true;
        
        for (int neighbor : adj[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return false;
}`,
    java: `public boolean bfs(Map<Integer, List<Integer>> adj, int start, Integer target) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> q = new LinkedList<>();
    
    q.add(start);
    visited.add(start);
    
    while (!q.isEmpty()) {
        int node = q.poll();
        if (target != null && node == target) return true;
        
        for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                q.add(neighbor);
            }
        }
    }
    return false;
}`
  },
  dfs: {
    python: `def dfs(graph, start, target=None):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            if target is not None and node == target:
                return True # Found!
                
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    return False`,
    c: `int dfs(int adj[N][N], int start, int target, int n) {
    int visited[N] = {0};
    int stack[N], top = 0;
    
    stack[top++] = start;
    
    while (top > 0) {
        int node = stack[--top];
        if (!visited[node]) {
            visited[node] = 1;
            if (target != -1 && node == target) return 1;
            
            for (int i = n - 1; i >= 0; i--) {
                if (adj[node][i] && !visited[i]) {
                    stack[top++] = i;
                }
            }
        }
    }
    return 0;
}`,
    cpp: `bool dfs(map<int, vector<int>>& adj, int start, int target) {
    unordered_set<int> visited;
    stack<int> s;
    
    s.push(start);
    
    while (!s.empty()) {
        int node = s.top();
        s.pop();
        
        if (visited.find(node) == visited.end()) {
            visited.insert(node);
            if (target != -1 && node == target) return true;
            
            for (auto it = adj[node].rbegin(); it != adj[node].rend(); ++it) {
                if (visited.find(*it) == visited.end()) {
                    s.push(*it);
                }
            }
        }
    }
    return false;
}`,
    java: `public boolean dfs(Map<Integer, List<Integer>> adj, int start, Integer target) {
    Set<Integer> visited = new HashSet<>();
    Stack<Integer> s = new Stack<>();
    
    s.push(start);
    
    while (!s.isEmpty()) {
        int node = s.pop();
        
        if (!visited.contains(node)) {
            visited.add(node);
            if (target != null && node == target) return true;
            
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
}`
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
      { id: 1, label: 'C1', x: 50, y: 15 }, { id: 2, label: 'C2', x: 75, y: 35 },
      { id: 3, label: 'C3', x: 75, y: 65 }, { id: 4, label: 'C4', x: 50, y: 85 },
      { id: 5, label: 'C5', x: 25, y: 65 }, { id: 6, label: 'C6', x: 25, y: 35 }
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 1 }, { from: 1, to: 4 }
    ],
    start: 1, target: null
  },
  tree: {
    nodes: [
      { id: 1, label: 'T1', x: 50, y: 15 }, { id: 2, label: 'T2', x: 30, y: 45 },
      { id: 3, label: 'T3', x: 70, y: 45 }, { id: 4, label: 'T4', x: 15, y: 75 },
      { id: 5, label: 'T5', x: 45, y: 75 }, { id: 6, label: 'T6', x: 55, y: 75 }, { id: 7, label: 'T7', x: 85, y: 75 }
    ],
    edges: [
      { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 },
      { from: 2, to: 5 }, { from: 3, to: 6 }, { from: 3, to: 7 }
    ],
    start: 1, target: 7
  },
  grid: {
    nodes: [
      { id: 1, label: 'G1', x: 25, y: 25 }, { id: 2, label: 'G2', x: 50, y: 25 }, { id: 3, label: 'G3', x: 75, y: 25 },
      { id: 4, label: 'G4', x: 25, y: 50 }, { id: 5, label: 'G5', x: 50, y: 50 }, { id: 6, label: 'G6', x: 75, y: 50 },
      { id: 7, label: 'G7', x: 25, y: 75 }, { id: 8, label: 'G8', x: 50, y: 75 }, { id: 9, label: 'G9', x: 75, y: 75 }
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 5 }, { from: 3, to: 6 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 4, to: 7 }, { from: 5, to: 8 }, { from: 6, to: 9 },
      { from: 7, to: 8 }, { from: 8, to: 9 }
    ],
    start: 1, target: null
  }
};

export default function BFSDFSGraphVisualizer() {
  const [activePresetKey, setActivePresetKey] = useState("ring");
  const [nodes, setNodes] = useState(PRESETS.ring.nodes);
  const [edges, setEdges] = useState(PRESETS.ring.edges);
  const [startNodeId, setStartNodeId] = useState(PRESETS.ring.start);
  const [targetNodeId, setTargetNodeId] = useState(PRESETS.ring.target);

  const [activeAlgo, setActiveAlgo] = useState("bfs"); 
  const [language, setLanguage] = useState("python");
  
  // Playback & Frame Engine
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [edgeFromId, setEdgeFromId] = useState("");
  const [edgeToId, setEdgeToId] = useState("");
  const [nodeToDeleteId, setNodeToDeleteId] = useState("");
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);
  const logContainerRef = useRef(null);

  // Auto-advance frames when playing
  useEffect(() => {
    let timer;
    if (isPlaying && frameIdx < frames.length - 1) {
      timer = setTimeout(() => {
        setFrameIdx(prev => prev + 1);
      }, speed);
    } else if (frameIdx >= frames.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames.length, speed]);

  // Keep logs scrolled to bottom
  useEffect(() => {
    if (logContainerRef.current) logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [frameIdx]);

  const clearFrames = () => {
    setFrames([]);
    setFrameIdx(-1);
    setIsPlaying(false);
  };

  const generateBFSFrames = () => {
    let currFrames = [];
    let q = [startNodeId];
    let vis = new Set([startNodeId]);
    
    let nodeStates = {}; nodes.forEach(n => nodeStates[n.id] = 'default');
    let edgeStates = {}; edges.forEach(e => edgeStates[`${e.from}-${e.to}`] = 'default');
    
    const lines = LINE_MAPS.bfs[language];
    let currentLogs = [`--- Initiating BFS from ${nodes.find(n => n.id === startNodeId)?.label} ---`];

    const addFrame = (lineNum, status, newLog) => {
      if (newLog) currentLogs = [...currentLogs, newLog];
      currFrames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        ds: [...q],
        highlightLineNum: lineNum,
        status,
        logs: [...currentLogs]
      });
    };

    nodeStates[startNodeId] = 'visiting';
    addFrame(lines.init, `Enqueuing start node ${nodes.find(n => n.id === startNodeId)?.label}.`, null);

    while (q.length > 0) {
      addFrame(lines.loop_cond, `Queue contents: [ ${q.map(id => nodes.find(n => n.id === id)?.label).join(', ')} ]`, null);

      const current = q.shift();
      nodeStates[current] = 'pre-op';
      addFrame(lines.pop, `Dequeued node ${nodes.find(n => n.id === current)?.label}.`, null);

      addFrame(lines.check_target, `Checking if ${nodes.find(n => n.id === current)?.label} is the target.`, null);
      if (targetNodeId && current === targetNodeId) {
        nodeStates[current] = 'found';
        addFrame(lines.check_target, `Search successful! Found node ${nodes.find(n => n.id === current)?.label}`, `BFS Success: Target reached at ${nodes.find(n => n.id === current)?.label}`);
        return currFrames; // Stop generation
      }

      nodeStates[current] = 'found';
      addFrame(lines.check_target, `Visited Node: ${nodes.find(n => n.id === current)?.label}`, `Visited Node: ${nodes.find(n => n.id === current)?.label}`);

      const neighbors = edges.filter(e => e.from === current).map(e => e.to);
      addFrame(lines.loop_neighbors, `Scanning neighbors of ${nodes.find(n => n.id === current)?.label}.`, null);

      for (let neighbor of neighbors) {
        const hasBeenVisited = vis.has(neighbor);
        addFrame(lines.check_visited, `Checking neighbor ${nodes.find(n => n.id === neighbor)?.label}. Visited? ${hasBeenVisited ? 'Yes' : 'No'}`, null);

        if (!hasBeenVisited) {
          vis.add(neighbor);
          q.push(neighbor);
          edgeStates[`${current}-${neighbor}`] = 'traversed';
          nodeStates[neighbor] = 'visiting';
          
          addFrame(lines.push, `Enqueued node ${nodes.find(n => n.id === neighbor)?.label}.`, `Enqueued neighbor: ${nodes.find(n => n.id === neighbor)?.label}`);
        }
      }
    }

    if (targetNodeId) {
      addFrame(lines.return_false, "Queue exhausted. Target node unreachable.", "BFS Completed: Target not reached.");
    } else {
      addFrame(lines.return_false, "Queue exhausted. Full Traversal complete.", "BFS Completed: All reachable nodes visited.");
    }
    
    return currFrames;
  };

  const generateDFSFrames = () => {
    let currFrames = [];
    let stack = [startNodeId];
    let vis = new Set();
    
    let nodeStates = {}; nodes.forEach(n => nodeStates[n.id] = 'default');
    let edgeStates = {}; edges.forEach(e => edgeStates[`${e.from}-${e.to}`] = 'default');
    
    const lines = LINE_MAPS.dfs[language];
    let currentLogs = [`--- Initiating DFS from ${nodes.find(n => n.id === startNodeId)?.label} ---`];

    const addFrame = (lineNum, status, newLog) => {
      if (newLog) currentLogs = [...currentLogs, newLog];
      currFrames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        ds: [...stack],
        highlightLineNum: lineNum,
        status,
        logs: [...currentLogs]
      });
    };

    nodeStates[startNodeId] = 'visiting';
    addFrame(lines.init, `Stacking start node ${nodes.find(n => n.id === startNodeId)?.label}.`, null);

    while (stack.length > 0) {
      addFrame(lines.loop_cond, `Stack contents: [ ${stack.map(id => nodes.find(n => n.id === id)?.label).join(', ')} ]`, null);

      const current = stack.pop();
      nodeStates[current] = 'pre-op';
      addFrame(lines.pop, `Popped node ${nodes.find(n => n.id === current)?.label} from stack.`, null);

      if (!vis.has(current)) {
        vis.add(current);

        addFrame(lines.check_target, `Checking if ${nodes.find(n => n.id === current)?.label} is the target.`, null);
        if (targetNodeId && current === targetNodeId) {
          nodeStates[current] = 'found';
          addFrame(lines.check_target, `Search successful! Found node ${nodes.find(n => n.id === current)?.label}`, `DFS Success: Target reached at ${nodes.find(n => n.id === current)?.label}`);
          return currFrames;
        }

        nodeStates[current] = 'found';
        addFrame(lines.check_target, `Visited Node: ${nodes.find(n => n.id === current)?.label}`, `Visited Node: ${nodes.find(n => n.id === current)?.label}`);

        const neighbors = edges.filter(e => e.from === current).map(e => e.to);
        addFrame(lines.loop_neighbors, `Scanning neighbors of ${nodes.find(n => n.id === current)?.label}.`, null);

        for (let neighbor of neighbors) {
          const hasBeenVisited = vis.has(neighbor);
          addFrame(lines.check_visited, `Checking neighbor ${nodes.find(n => n.id === neighbor)?.label}. Visited? ${hasBeenVisited ? 'Yes' : 'No'}`, null);

          if (!hasBeenVisited) {
            stack.push(neighbor);
            edgeStates[`${current}-${neighbor}`] = 'traversed';
            nodeStates[neighbor] = 'visiting';
            addFrame(lines.push, `Pushed node ${nodes.find(n => n.id === neighbor)?.label} to stack.`, `Pushed neighbor: ${nodes.find(n => n.id === neighbor)?.label}`);
          }
        }
      }
    }

    if (targetNodeId) {
      addFrame(lines.return_false, "Stack exhausted. Target node unreachable.", "DFS Completed: Target not reached.");
    } else {
      addFrame(lines.return_false, "Stack exhausted. Full Traversal complete.", "DFS Completed: All reachable nodes visited.");
    }

    return currFrames;
  };

  const handleExecute = () => {
    if (!startNodeId) return setError("Please specify a Start Node.");
    setError(null);
    const generated = activeAlgo === 'bfs' ? generateBFSFrames() : generateDFSFrames();
    setFrames(generated);
    setFrameIdx(0);
    setIsPlaying(true);
  };

  const loadPreset = (presetKey) => {
    clearFrames(); setActivePresetKey(presetKey);
    const p = PRESETS[presetKey];
    setNodes(p.nodes); setEdges(p.edges); setStartNodeId(p.start); setTargetNodeId(p.target);
  };

  const handleClearAll = () => {
    clearFrames(); setNodes([]); setEdges([]); setStartNodeId(null); setTargetNodeId(null); setError(null);
  };

  const handleReset = () => {
    clearFrames();
    const p = PRESETS[activePresetKey] || PRESETS.ring;
    setNodes(p.nodes); setEdges(p.edges); setStartNodeId(p.start); setTargetNodeId(p.target); setError(null);
  };

  const handleMouseDown = (e, nodeId) => { if (frames.length === 0) { e.preventDefault(); setDraggedNodeId(nodeId); } };
  const handleMouseMove = (e) => {
    if (draggedNodeId === null || !canvasRef.current || frames.length > 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100, y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(5, Math.min(95, x)); y = Math.max(5, Math.min(95, y));
    setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(x), y: Math.round(y) } : n));
  };
  
  const handleAddNode = () => {
    clearFrames(); const label = newNodeLabel.trim();
    if (!label) return setError("Specify label.");
    if (nodes.some(n => n.label.toLowerCase() === label.toLowerCase())) return setError("Node exists.");
    const nextId = nodes.length > 0 ? Math.max(...nodes.map(n => Number(n.id) || 0)) + 1 : 1;
    const offset = (nodes.length % 5) * 5;
    setNodes(prev => [...prev, { id: nextId, label: label.toUpperCase(), x: 50 + (nodes.length % 2 === 0 ? offset : -offset), y: 50 + (nodes.length % 2 === 1 ? offset : -offset) }]);
    setNewNodeLabel(""); setError(null);
  };

  const handleDeleteNode = () => {
    clearFrames(); const idToDelete = Number(nodeToDeleteId);
    if (!idToDelete) return setError("Select node.");
    setNodes(prev => prev.filter(n => n.id !== idToDelete));
    setEdges(prev => prev.filter(e => e.from !== idToDelete && e.to !== idToDelete));
    if (startNodeId === idToDelete) setStartNodeId(null);
    if (targetNodeId === idToDelete) setTargetNodeId(null);
    setNodeToDeleteId(""); setError(null);
  };

  const handleAddEdge = () => {
    clearFrames(); const fromId = Number(edgeFromId), toId = Number(edgeToId);
    if (!fromId || !toId) return setError("Select nodes.");
    if (fromId === toId) return setError("No self-loops.");
    if (edges.some(e => e.from === fromId && e.to === toId)) return setError("Edge exists.");
    setEdges(prev => [...prev, { from: fromId, to: toId }]);
    setEdgeFromId(""); setEdgeToId(""); setError(null);
  };

  const isTimeTraveling = frames.length > 0;
  const currentFrame = isTimeTraveling && frameIdx >= 0 ? frames[frameIdx] : null;

  // Determine what to display based on whether we are playing/time-traveling or editing
  const displayNodes = isTimeTraveling && currentFrame
    ? nodes.map(n => ({ ...n, state: currentFrame.nodeStates[n.id] || 'default' }))
    : nodes.map(n => ({ ...n, state: 'default' }));
    
  const displayEdges = isTimeTraveling && currentFrame
    ? edges.map(e => ({ ...e, state: currentFrame.edgeStates[`${e.from}-${e.to}`] || 'default' }))
    : edges.map(e => ({ ...e, state: 'default' }));

  const displayStatus = isTimeTraveling && currentFrame ? currentFrame.status : "Graph loaded. Drag nodes, adjust presets, or set start & optional target.";
  const displayLogs = isTimeTraveling && currentFrame ? currentFrame.logs : ["[System] Graph initialized. Ready to execute."];
  const displayLineNum = isTimeTraveling && currentFrame ? currentFrame.highlightLineNum : -1;
  const displayDs = isTimeTraveling && currentFrame ? currentFrame.ds : [];

  const codeLines = codeSnippets[activeAlgo][language].trim().split('\n');
  const statusColor = displayStatus.includes("successful") || displayStatus.includes("Traversal complete") ? "status-found" : displayStatus.includes("unreachable") ? "status-not-found" : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><GitFork size={26} style={{ transform: 'rotate(180deg)' }} /> BFS & DFS Graph</h1>

        {/* --- Playback Controls --- */}
        <div className="player-panel">
          <button onClick={handleExecute} disabled={isTimeTraveling || !startNodeId} className="btn btn-green" style={{marginBottom: '1rem'}}>
            <Play size={16} /> Execute {activeAlgo.toUpperCase()}
          </button>
          
          <label style={{fontSize: '0.75rem', color: 'var(--text-gray-400)', fontWeight: 'bold'}}>TIMELINE</label>
          <input 
            type="range" 
            min="0" 
            max={frames.length > 0 ? frames.length - 1 : 0} 
            value={frameIdx >= 0 ? frameIdx : 0} 
            onChange={(e) => { setIsPlaying(false); setFrameIdx(Number(e.target.value)); }} 
            className="slider" 
            disabled={!isTimeTraveling}
          />
          
          <div className="player-controls">
            <button onClick={() => { setIsPlaying(false); setFrameIdx(0); }} disabled={!isTimeTraveling || frameIdx <= 0} className="ctrl-btn" title="Restart"><RotateCcw size={16}/></button>
            <button onClick={() => { setIsPlaying(false); setFrameIdx(p => p - 1); }} disabled={!isTimeTraveling || frameIdx <= 0} className="ctrl-btn" title="Previous Step"><SkipBack size={16}/></button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={!isTimeTraveling || frameIdx >= frames.length - 1} className="ctrl-btn" title="Play/Pause">
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button onClick={() => { setIsPlaying(false); setFrameIdx(p => p + 1); }} disabled={!isTimeTraveling || frameIdx >= frames.length - 1} className="ctrl-btn" title="Next Step"><SkipForward size={16}/></button>
          </div>
        </div>

        <div className="input-group">
          <label>Select Algorithm</label>
          <select value={activeAlgo} onChange={(e) => { setActiveAlgo(e.target.value); clearFrames(); }} className="input-field" disabled={isTimeTraveling}>
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
          </select>
        </div>

        <div className="actions-grid">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-400)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Start Node</span>
            <select value={startNodeId || ""} onChange={(e) => { setStartNodeId(Number(e.target.value)); clearFrames(); }} disabled={isTimeTraveling} className="input-field">
              <option value="">Choose...</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-400)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Target (Optional)</span>
            <select value={targetNodeId || ""} onChange={(e) => { setTargetNodeId(e.target.value ? Number(e.target.value) : null); clearFrames(); }} disabled={isTimeTraveling} className="input-field">
              <option value="">None...</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Graph Preset</label>
          <select value={activePresetKey} onChange={(e) => loadPreset(e.target.value)} disabled={isTimeTraveling} className="input-field">
            <option value="ring">Ring Cycle (6 Nodes)</option>
            <option value="tree">Binary Tree (7 Nodes)</option>
            <option value="grid">Grid Network (9 Nodes)</option>
          </select>
        </div>

        <div className="editor-section">
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--cyan-400)', display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase' }}>Graph Editor (Interactive)</span>
          <div className="input-group"><div style={{ display: 'flex', gap: '0.4rem' }}><input type="text" placeholder="Node Name (e.g., A)" value={newNodeLabel} onChange={(e) => setNewNodeLabel(e.target.value)} disabled={isTimeTraveling} className="input-field" style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }} /><button onClick={handleAddNode} disabled={isTimeTraveling} className="btn btn-green" style={{ padding: '0.4rem 0.75rem', width: 'auto' }}><Plus size={16} /></button></div></div>
          <div className="input-group" style={{ marginBottom: '0.5rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><select value={edgeFromId} onChange={(e) => setEdgeFromId(e.target.value)} disabled={isTimeTraveling} className="input-field" style={{ padding: '0.4rem', fontSize: '0.8rem' }}><option value="">From</option>{nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}</select><ArrowRight size={14} style={{ color: 'var(--text-gray-500)' }} /><select value={edgeToId} onChange={(e) => setEdgeToId(e.target.value)} disabled={isTimeTraveling} className="input-field" style={{ padding: '0.4rem', fontSize: '0.8rem' }}><option value="">To</option>{nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}</select><button onClick={handleAddEdge} disabled={isTimeTraveling} className="btn btn-cyan" style={{ padding: '0.4rem', width: 'auto' }}>Link</button></div></div>
          <div className="input-group" style={{ marginBottom: '0' }}><div style={{ display: 'flex', gap: '0.4rem' }}><select value={nodeToDeleteId} onChange={(e) => setNodeToDeleteId(e.target.value)} disabled={isTimeTraveling} className="input-field" style={{ padding: '0.4rem', fontSize: '0.85rem' }}><option value="">Select Node to Delete</option>{nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}</select><button onClick={handleDeleteNode} disabled={isTimeTraveling} className="btn btn-red" style={{ padding: '0.4rem', width: 'auto' }}><Trash2 size={16} /></button></div></div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleReset} className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }}><RefreshCw size={14} /> Reset</button>
            <button onClick={handleClearAll} disabled={isTimeTraveling} className="btn btn-red" style={{ padding: '0.4rem', fontSize: '0.8rem' }}><Trash2 size={14} /> Clear</button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        <div className="input-group">
          <label>Code Language</label>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); clearFrames(); }} className="input-field">
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>
        </div>

        <div className="input-group">
          <label>Auto-Play Speed</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="slider" style={{marginBottom: 0}} />
            <span style={{ width: '4rem', textAlign: 'right', color: 'var(--text-gray-400)', fontSize: '0.85rem' }}>{speed} ms</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <section className="visualization-section">
          <h2 className="section-title">Visualization {isTimeTraveling && <span style={{fontSize: '0.85rem', color: 'var(--cyan-400)', marginLeft: '1rem'}}>(Frame {frameIdx + 1} of {frames.length})</span>}</h2>
          
          <div className="status-bar"><span className={`status-text ${statusColor}`}>{displayStatus}</span></div>
          
          <div className="visualization-layout">
            <div className="visualization-boxes" ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={() => setDraggedNodeId(null)} onMouseLeave={() => setDraggedNodeId(null)}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-gray-600)" /></marker>
                  <marker id="arrow-traversed" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--cyan-400)" /></marker>
                </defs>
                {displayEdges.map((edge, idx) => {
                  const fromNode = nodes.find(n => n.id === edge.from), toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  const isTraversed = edge.state === 'traversed';
                  return (
                    <line key={idx} x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                      stroke={isTraversed ? "var(--cyan-400)" : "var(--border-gray-700)"} strokeWidth={isTraversed ? "3.5" : "1.5"}
                      markerEnd={`url(#${isTraversed ? 'arrow-traversed' : 'arrow'})`} style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                    />
                  );
                })}
              </svg>

              {nodes.length === 0 && <span style={{ color: 'var(--text-gray-500)', zIndex: 1, margin: 'auto' }}>Graph is empty.</span>}

              {displayNodes.map(node => (
                <div key={node.id} className={`box ${node.state}`}
                  style={{ position: 'absolute', left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)', zIndex: 1, cursor: isTimeTraveling ? 'default' : 'grab' }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  {node.label}
                  {node.id === startNodeId && <span style={{ position: 'absolute', top: '-1.25rem', fontSize: '0.6rem', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--green-400)', color: 'var(--green-400)', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>START</span>}
                  {node.id === targetNodeId && <span style={{ position: 'absolute', bottom: '-1.25rem', fontSize: '0.6rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--red-400)', color: 'var(--red-400)', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>TARGET</span>}
                </div>
              ))}
            </div>

            {/* Live Data Structure Sidebar (Beside the graph) */}
            <div className="ds-sidebar">
              <h3 className="ds-title">{activeAlgo === 'bfs' ? 'Queue' : 'Stack'}</h3>
              <div className={`ds-list ${activeAlgo === 'dfs' ? 'stack-mode' : ''}`}>
                {displayDs.map((id, index) => {
                  const node = nodes.find(n => n.id === id);
                  return <div key={`${id}-${index}`} className="ds-item" style={{animation: 'slideIn 0.2s ease-out'}}>{node?.label}</div>;
                })}
              </div>
              {displayDs.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-500)', marginTop: '1rem', textAlign: 'center' }}>Empty</span>}
              {displayDs.length > 0 && activeAlgo === 'bfs' && <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--text-gray-500)', fontWeight: 'bold' }}>(Back)</div>}
              {displayDs.length > 0 && activeAlgo === 'dfs' && <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--text-gray-500)', fontWeight: 'bold' }}>(Bottom)</div>}
            </div>
          </div>
        </section>

        <div className="lower-content-area">
          <section className="code-section">
            <h2 className="section-title">Code</h2>
            <div className="code-block">
              <pre><code>
                {codeLines.map((line, idx) => (
                  <span key={idx} className={`code-line ${displayLineNum === (idx + 1) ? 'highlight' : ''} ${(line.trim().startsWith('#') || line.trim().startsWith('//')) ? 'comment' : ''}`}>
                    {line || '\u00A0'}
                  </span>
                ))}
              </code></pre>
            </div>
          </section>

          <section className="log-section">
            <h2 className="section-title">Execution Log</h2>
            <div className="log-block" ref={logContainerRef}>
              <ul className="log-list">
                {displayLogs.map((log, idx) => <li key={idx} className="log-item">{log}</li>)}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}