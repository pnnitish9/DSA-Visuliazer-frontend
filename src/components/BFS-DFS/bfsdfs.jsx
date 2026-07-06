import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  GitFork, Play, Pause, RotateCcw, ChevronRight, Volume2, VolumeX, 
  Settings, Info, Code, Terminal, BarChart3, ZoomIn, ZoomOut, Maximize2,
  Layers, Plus, Trash2, ArrowRight, HelpCircle, Activity, LayoutGrid, Eye, EyeOff
} from 'lucide-react';

// --- SOUND FEEDBACK SYNTHESIZER ---
const playAudioFeedback = (type, enabled) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'enqueue' || type === 'push') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now); // E4
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1); // A4
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'dequeue' || type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.15); // A3
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'visit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(554.37, now); // C#5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Harmonic arpeggio for target found
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'not_found') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Fail-safe for audio policy blocks
  }
};

const codeSnippets = {
  python: {
    bfs: `
def bfs(graph, start, target):
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        node = queue.pop(0) # Dequeue
        if node == target:
            return True # Found!
            
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return False
`.trim(),
    dfs: `
def dfs(graph, start, target):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop() # Pop from top
        if node not in visited:
            visited.add(node)
            if node == target:
                return True # Found!
                
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    return False
`.trim()
  },
  cpp: {
    bfs: `
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
    dfs: `
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
`.trim()
  },
  java: {
    bfs: `
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
`.trim(),
    dfs: `
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
  },
  c: {
    bfs: `
int bfs(int adj[N][N], int start, int target, int num_nodes) {
    int visited[N] = {0};
    int queue[N], front = 0, rear = 0;
    
    queue[rear++] = start;
    visited[start] = 1;
    
    while (front < rear) {
        int node = queue[front++];
        if (node == target) return 1;
        
        for (int i = 0; i < num_nodes; i++) {
            if (adj[node][i] && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
    return 0;
}
`.trim(),
    dfs: `
int dfs(int adj[N][N], int start, int target, int num_nodes) {
    int visited[N] = {0};
    int stack[N], top = 0;
    
    stack[top++] = start;
    
    while (top > 0) {
        int node = stack[--top];
        if (!visited[node]) {
            visited[node] = 1;
            if (node == target) return 1;
            
            for (int i = num_nodes - 1; i >= 0; i--) {
                if (adj[node][i] && !visited[i]) {
                    stack[top++] = i;
                }
            }
        }
    }
    return 0;
}
`.trim()
  }
};

const LINE_MAPS = {
  python: {
    bfs: {
      init: 2,
      loop_cond: 7,
      pop: 8,
      check_target: 9,
      loop_neighbors: 12,
      check_visited: 13,
      push: 15,
      return_false: 16
    },
    dfs: {
      init: 2,
      loop_cond: 6,
      pop: 7,
      check_visited: 8,
      check_target: 10,
      loop_neighbors: 13,
      push: 15,
      return_false: 16
    }
  },
  cpp: {
    bfs: {
      init: 2,
      loop_cond: 9,
      pop: 11,
      check_target: 12,
      loop_neighbors: 14,
      check_visited: 15,
      push: 17
    },
    dfs: {
      init: 2,
      loop_cond: 7,
      pop: 9,
      check_visited: 12,
      check_target: 14,
      loop_neighbors: 16,
      push: 18
    }
  },
  java: {
    bfs: {
      init: 2,
      loop_cond: 8,
      pop: 9,
      check_target: 10,
      loop_neighbors: 12,
      check_visited: 13,
      push: 15
    },
    dfs: {
      init: 2,
      loop_cond: 8,
      pop: 9,
      check_visited: 11,
      check_target: 13,
      loop_neighbors: 16,
      push: 19
    }
  },
  c: {
    bfs: {
      init: 2,
      loop_cond: 8,
      pop: 9,
      check_target: 10,
      loop_neighbors: 12,
      check_visited: 13,
      push: 14
    },
    dfs: {
      init: 2,
      loop_cond: 7,
      pop: 8,
      check_visited: 9,
      check_target: 11,
      loop_neighbors: 13,
      push: 14
    }
  }
};

const colorizeLineCode = (line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
    return <span className="text-gray-500 italic font-mono">{line}</span>;
  }
  
  const keywords = /\b(def|class|if|elif|else|return|struct|int|float|double|char|sizeof|malloc|NULL|void|public|static|class|new|this|while|for|bool|map|vector|unordered_set|queue|stack|set|HashSet|LinkedList|Queue|Stack|Map|ArrayList|List|true|false)\b/g;
  const parts = line.split(/(\W+)/);
  return (
    <span className="font-mono">
      {parts.map((part, index) => {
        if (part.match(keywords)) {
          return <span key={index} className="text-cyan-400 font-semibold">{part}</span>;
        }
        if (part.match(/^\d+$/)) {
          return <span key={index} className="text-amber-400">{part}</span>;
        }
        if (part === 'visited' || part === 'queue' || part === 'stack' || part === 'node' || part === 'neighbor' || part === 'graph' || part === 'adj') {
          return <span key={index} className="text-fuchsia-300 italic">{part}</span>;
        }
        return <span key={index} className="text-gray-200">{part}</span>;
      })}
    </span>
  );
};

export default function BFSDFSVisualizer() {
  // Graph structure states
  const [nodes, setNodes] = useState([
    { id: 0, label: 'A', x: 200, y: 120, state: 'default' },
    { id: 1, label: 'B', x: 100, y: 220, state: 'default' },
    { id: 2, label: 'C', x: 300, y: 220, state: 'default' },
    { id: 3, label: 'D', x: 60, y: 340, state: 'default' },
    { id: 4, label: 'E', x: 180, y: 340, state: 'default' },
    { id: 5, label: 'F', x: 340, y: 340, state: 'default' }
  ]);

  const [edges, setEdges] = useState([
    { from: 0, to: 1, type: 'undirected', state: 'default' },
    { from: 0, to: 2, type: 'undirected', state: 'default' },
    { from: 1, to: 3, type: 'undirected', state: 'default' },
    { from: 1, to: 4, type: 'undirected', state: 'default' },
    { from: 2, to: 5, type: 'undirected', state: 'default' },
    { from: 4, to: 5, type: 'undirected', state: 'default' }
  ]);

  // Operational Settings
  const [algo, setAlgo] = useState("bfs"); // bfs | dfs
  const [startNodeId, setStartNodeId] = useState(0);
  const [targetNodeId, setTargetNodeId] = useState(5);
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(700);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showNodeCoords, setShowNodeCoords] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState("debugger"); // debugger | analysis | logs
  const [activePreset, setActivePreset] = useState("tree");

  // Custom addition states
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeDirected, setEdgeDirected] = useState(false);

  // Visualization Runtime States
  const [status, setStatus] = useState("Choose configurations and press Run Algorithm.");
  const [statusType, setStatusType] = useState("default"); // default | visiting | success | error
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightLine, setHighlightLine] = useState(-1);
  const [activeDS, setActiveDS] = useState([]); // Visual simulation of Queue or Stack
  const [visitedNodesSet, setVisitedNodesSet] = useState([]); // Keeps chronological visited path
  const [systemLogs, setSystemLogs] = useState(["[System] Sandbox loaded with Tree Graph preset."]);
  const [maxDSSize, setMaxDSSize] = useState(0);

  // Drag node state
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const canvasRef = useRef(null);

  // Debugging control references
  const isCancelledRef = useRef(false);
  const pausedRef = useRef(false);
  const stepModeRef = useRef(false);
  const stepSignalRef = useRef(null);
  const speedRef = useRef(speed);
  const logsEndRef = useRef(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [systemLogs]);

  const logMessage = (msg) => {
    setSystemLogs(prev => [...prev, msg]);
  };

  const loadPreset = (preset) => {
    setActivePreset(preset);
    logMessage(`[Preset] Loading graph layout: ${preset}`);
    
    if (preset === 'tree') {
      setNodes([
        { id: 0, label: 'A', x: 250, y: 80, state: 'default' },
        { id: 1, label: 'B', x: 130, y: 180, state: 'default' },
        { id: 2, label: 'C', x: 370, y: 180, state: 'default' },
        { id: 3, label: 'D', x: 70, y: 280, state: 'default' },
        { id: 4, label: 'E', x: 190, y: 280, state: 'default' },
        { id: 5, label: 'F', x: 310, y: 280, state: 'default' },
        { id: 6, label: 'G', x: 430, y: 280, state: 'default' }
      ]);
      setEdges([
        { from: 0, to: 1, type: 'undirected', state: 'default' },
        { from: 0, to: 2, type: 'undirected', state: 'default' },
        { from: 1, to: 3, type: 'undirected', state: 'default' },
        { from: 1, to: 4, type: 'undirected', state: 'default' },
        { from: 2, to: 5, type: 'undirected', state: 'default' },
        { from: 2, to: 6, type: 'undirected', state: 'default' }
      ]);
      setStartNodeId(0);
      setTargetNodeId(6);
    } 
    else if (preset === 'mesh') {
      setNodes([
        { id: 0, label: 'N1', x: 100, y: 100, state: 'default' },
        { id: 1, label: 'N2', x: 250, y: 100, state: 'default' },
        { id: 2, label: 'N3', x: 400, y: 100, state: 'default' },
        { id: 3, label: 'N4', x: 100, y: 250, state: 'default' },
        { id: 4, label: 'N5', x: 250, y: 250, state: 'default' },
        { id: 5, label: 'N6', x: 400, y: 250, state: 'default' },
        { id: 6, label: 'N7', x: 250, y: 380, state: 'default' }
      ]);
      setEdges([
        { from: 0, to: 1, type: 'undirected', state: 'default' },
        { from: 1, to: 2, type: 'undirected', state: 'default' },
        { from: 0, to: 3, type: 'undirected', state: 'default' },
        { from: 1, to: 4, type: 'undirected', state: 'default' },
        { from: 2, to: 5, type: 'undirected', state: 'default' },
        { from: 3, to: 4, type: 'undirected', state: 'default' },
        { from: 4, to: 5, type: 'undirected', state: 'default' },
        { from: 3, to: 6, type: 'undirected', state: 'default' },
        { from: 5, to: 6, type: 'undirected', state: 'default' }
      ]);
      setStartNodeId(0);
      setTargetNodeId(6);
    }
    else if (preset === 'cycle') {
      setNodes([
        { id: 0, label: 'C1', x: 250, y: 60, state: 'default' },
        { id: 1, label: 'C2', x: 380, y: 150, state: 'default' },
        { id: 2, label: 'C3', x: 380, y: 300, state: 'default' },
        { id: 3, label: 'C4', x: 250, y: 380, state: 'default' },
        { id: 4, label: 'C5', x: 120, y: 300, state: 'default' },
        { id: 5, label: 'C6', x: 120, y: 150, state: 'default' }
      ]);
      setEdges([
        { from: 0, to: 1, type: 'directed', state: 'default' },
        { from: 1, to: 2, type: 'directed', state: 'default' },
        { from: 2, to: 3, type: 'directed', state: 'default' },
        { from: 3, to: 4, type: 'directed', state: 'default' },
        { from: 4, to: 5, type: 'directed', state: 'default' },
        { from: 5, to: 0, type: 'directed', state: 'default' }
      ]);
      setStartNodeId(0);
      setTargetNodeId(3);
    }
  };

  const addCustomNode = () => {
    if (!newNodeLabel.trim()) return;
    const existingNode = nodes.find(n => n.label.toLowerCase() === newNodeLabel.trim().toLowerCase());
    if (existingNode) {
      logMessage(`[Error] Node labeled "${newNodeLabel}" already exists.`);
      return;
    }
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    const newNode = {
      id: newId,
      label: newNodeLabel.trim().toUpperCase(),
      x: 100 + Math.random() * 250,
      y: 100 + Math.random() * 200,
      state: 'default'
    };
    setNodes(prev => [...prev, newNode]);
    logMessage(`[Build] Added Node: ${newNode.label}`);
    setNewNodeLabel("");
  };

  const addCustomEdge = () => {
    const fromId = parseInt(edgeFrom);
    const toId = parseInt(edgeTo);
    if (isNaN(fromId) || isNaN(toId)) return;
    if (fromId === toId) {
      logMessage(`[Error] Self-loops are not visually supported.`);
      return;
    }

    const edgeExists = edges.some(e => 
      (e.from === fromId && e.to === toId) || 
      (e.type === 'undirected' && e.from === toId && e.to === fromId)
    );

    if (edgeExists) {
      logMessage(`[Error] Link between selected nodes already exists.`);
      return;
    }

    const newEdge = {
      from: fromId,
      to: toId,
      type: edgeDirected ? 'directed' : 'undirected',
      state: 'default'
    };

    setEdges(prev => [...prev, newEdge]);
    const fNode = nodes.find(n => n.id === fromId)?.label;
    const tNode = nodes.find(n => n.id === toId)?.label;
    logMessage(`[Build] Connected: ${fNode} ${edgeDirected ? '→' : '—'} ${tNode}`);
    setEdgeFrom("");
    setEdgeTo("");
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setStartNodeId(null);
    setTargetNodeId(null);
    logMessage(`[System] Canvas cleared. Design your own network.`);
  };

  const handleNodeMouseDown = (e, nodeId) => {
    if (isVisualizing) return;
    setDraggingNodeId(nodeId);
    e.stopPropagation();
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingNodeId === null || isVisualizing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(30, (e.clientX - rect.left) * (100 / zoom)), 570);
    const y = Math.min(Math.max(30, (e.clientY - rect.top) * (100 / zoom)), 470);
    
    setNodes(prev => prev.map(node => 
      node.id === draggingNodeId ? { ...node, x, y } : node
    ));
  };

  const handleCanvasMouseUpOrLeave = () => {
    setDraggingNodeId(null);
  };

  const checkPauseState = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const handleNextStep = () => {
    if (stepSignalRef.current) {
      const resolve = stepSignalRef.current;
      stepSignalRef.current = null;
      resolve();
    }
  };

  const awaitStepper = async (logicalStep, message, soundEffect = 'visit') => {
    if (isCancelledRef.current) throw new Error("cancelled");
    setHighlightLine(LINE_MAPS[language]?.[algo]?.[logicalStep] || -1);
    setStatus(message);
    logMessage(`[Trace] ${message}`);
    
    if (soundEffect) {
      playAudioFeedback(soundEffect, audioEnabled);
    }

    if (pausedRef.current) {
      setStatus(`[Paused] ${message}`);
      return new Promise((resolve) => {
        stepSignalRef.current = resolve;
      });
    } else {
      await new Promise(resolve => setTimeout(resolve, speedRef.current));
    }
  };

  const togglePausePlay = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    pausedRef.current = nextPaused;
    if (nextPaused) {
      logMessage(`[Control] Visualization paused.`);
    } else {
      logMessage(`[Control] Visualization resumed.`);
      handleNextStep();
    }
  };

  const toggleStepMode = () => {
    const nextMode = !stepModeRef.current;
    stepModeRef.current = nextMode;
    if (nextMode) {
      logMessage(`[Control] Step-through debugger mode enabled. Manually step forward.`);
      setIsPaused(true);
      pausedRef.current = true;
    } else {
      logMessage(`[Control] Step-through disabled. Automated interval play resumed.`);
      setIsPaused(false);
      pausedRef.current = false;
      handleNextStep();
    }
  };

  const resetSimulationStates = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    stepModeRef.current = false;
    setHighlightLine(-1);
    setActiveDS([]);
    setVisitedNodesSet([]);
    setMaxDSSize(0);
    setNodes(prev => prev.map(n => ({ ...n, state: 'default' })));
    setEdges(prev => prev.map(e => ({ ...e, state: 'default' })));
    setStatus("Sandbox reset. Configure nodes and play.");
    setStatusType("default");
    setTimeout(() => {
      isCancelledRef.current = false;
    }, 150);
  };

  const runBFS = async () => {
    if (startNodeId === null || targetNodeId === null) {
      setStatus("Error: Start and Target nodes must be set.");
      setStatusType("error");
      return;
    }

    isCancelledRef.current = false;
    setIsVisualizing(true);
    setStatusType("visiting");
    setVisitedNodesSet([]);
    setMaxDSSize(0);
    
    // Clear styles
    let workingNodes = nodes.map(n => ({ ...n, state: 'default' }));
    let workingEdges = edges.map(e => ({ ...e, state: 'default' }));
    setNodes(workingNodes);
    setEdges(workingEdges);

    logMessage(`--- Starting Breadth-First Search (BFS) sequence from [${nodes.find(n=>n.id===startNodeId)?.label}] ---`);

    try {
      // 1. Init
      const queue = [startNodeId];
      const visited = new Set([startNodeId]);
      setActiveDS([...queue]);
      setVisitedNodesSet([startNodeId]);
      
      workingNodes = workingNodes.map(n => n.id === startNodeId ? { ...n, state: 'visiting' } : n);
      setNodes(workingNodes);
      setMaxDSSize(1);
      
      await awaitStepper('init', `Initialized queue with start node: ${nodes.find(n=>n.id===startNodeId)?.label}`, 'enqueue');

      while (queue.length > 0) {
        await checkPauseState();

        // 2. Loop check
        await awaitStepper('loop_cond', `Checking queue. Queue length is: ${queue.length}`);
        
        // 3. Dequeue
        const currentId = queue.shift();
        setActiveDS([...queue]);
        workingNodes = workingNodes.map(n => n.id === currentId ? { ...n, state: 'active' } : n);
        setNodes(workingNodes);
        
        await awaitStepper('pop', `Dequeued node ${nodes.find(n=>n.id===currentId)?.label}`, 'dequeue');

        // 4. Target check
        if (currentId === targetNodeId) {
          workingNodes = workingNodes.map(n => n.id === currentId ? { ...n, state: 'found' } : n);
          setNodes(workingNodes);
          await awaitStepper('check_target', `Target node ${nodes.find(n=>n.id===currentId)?.label} found!`, 'success');
          setStatus(`Search successful! Found node ${nodes.find(n=>n.id===currentId)?.label}`);
          setStatusType("success");
          setIsVisualizing(false);
          return;
        }

        // Set to visited (green background)
        workingNodes = workingNodes.map(n => n.id === currentId ? { ...n, state: 'visited' } : n);
        setNodes(workingNodes);

        // 5. Query neighbors
        await awaitStepper('loop_neighbors', `Retrieving unvisited neighbors for node ${nodes.find(n=>n.id===currentId)?.label}`);
        
        // Build adjacency
        const neighbors = [];
        edges.forEach(e => {
          if (e.from === currentId) neighbors.push(e.to);
          else if (e.type === 'undirected' && e.to === currentId) neighbors.push(e.from);
        });

        for (const neighborId of neighbors) {
          await checkPauseState();

          if (!visited.has(neighborId)) {
            // Check visit step
            await awaitStepper('check_visited', `Neighbor node ${nodes.find(n=>n.id===neighborId)?.label} is unvisited.`);
            
            visited.add(neighborId);
            queue.push(neighborId);
            
            // Mark edge as traversed
            workingEdges = workingEdges.map(e => {
              if ((e.from === currentId && e.to === neighborId) || (e.type === 'undirected' && e.from === neighborId && e.to === currentId)) {
                return { ...e, state: 'traversed' };
              }
              return e;
            });
            setEdges(workingEdges);

            workingNodes = workingNodes.map(n => n.id === neighborId ? { ...n, state: 'visiting' } : n);
            setNodes(workingNodes);
            
            setVisitedNodesSet(prev => [...prev, neighborId]);
            setActiveDS([...queue]);
            setMaxDSSize(prev => Math.max(prev, queue.length));

            await awaitStepper('push', `Pushed ${nodes.find(n=>n.id===neighborId)?.label} to Queue.`, 'enqueue');
          }
        }
      }

      await awaitStepper('return_false', `Queue empty. Target node not reachable.`, 'not_found');
      setStatus("BFS Finished: Target node was not found.");
      setStatusType("error");
    } catch (e) {
      logMessage("[System] Run terminated.");
    }
    setIsVisualizing(false);
  };

  const runDFS = async () => {
    if (startNodeId === null || targetNodeId === null) {
      setStatus("Error: Start and Target nodes must be set.");
      setStatusType("error");
      return;
    }

    isCancelledRef.current = false;
    setIsVisualizing(true);
    setStatusType("visiting");
    setVisitedNodesSet([]);
    setMaxDSSize(0);

    let workingNodes = nodes.map(n => ({ ...n, state: 'default' }));
    let workingEdges = edges.map(e => ({ ...e, state: 'default' }));
    setNodes(workingNodes);
    setEdges(workingEdges);

    logMessage(`--- Starting Depth-First Search (DFS) sequence from [${nodes.find(n=>n.id===startNodeId)?.label}] ---`);

    try {
      const stack = [startNodeId];
      const visited = new Set();
      setActiveDS([...stack]);
      setMaxDSSize(1);

      await awaitStepper('init', `Initialized stack with start node: ${nodes.find(n=>n.id===startNodeId)?.label}`, 'push');

      while (stack.length > 0) {
        await checkPauseState();

        await awaitStepper('loop_cond', `Checking stack. Stack depth is: ${stack.length}`);

        const currentId = stack.pop();
        setActiveDS([...stack]);
        
        if (!visited.has(currentId)) {
          // Dequeue sound fits pop
          await awaitStepper('pop', `Popped ${nodes.find(n=>n.id===currentId)?.label} from Stack top.`, 'dequeue');
          
          visited.add(currentId);
          setVisitedNodesSet(prev => [...prev, currentId]);
          
          workingNodes = workingNodes.map(n => n.id === currentId ? { ...n, state: 'active' } : n);
          setNodes(workingNodes);

          await awaitStepper('check_visited', `Marking node ${nodes.find(n=>n.id===currentId)?.label} as visited.`);

          if (currentId === targetNodeId) {
            workingNodes = workingNodes.map(n => n.id === currentId ? { ...n, state: 'found' } : n);
            setNodes(workingNodes);
            await awaitStepper('check_target', `Target node found!`, 'success');
            setStatus(`Search successful! Found node ${nodes.find(n=>n.id===currentId)?.label}`);
            setStatusType("success");
            setIsVisualizing(false);
            return;
          }

          workingNodes = workingNodes.map(n => n.id === currentId ? { ...n, state: 'visited' } : n);
          setNodes(workingNodes);

          // Get neighbors
          await awaitStepper('loop_neighbors', `Scanning neighbors for node ${nodes.find(n=>n.id===currentId)?.label}`);
          const neighbors = [];
          edges.forEach(e => {
            if (e.from === currentId) neighbors.push(e.to);
            else if (e.type === 'undirected' && e.to === currentId) neighbors.push(e.from);
          });

          // Stack neighbors in reverse order (to traverse in left-to-right or indexed alignment)
          const reversedNeighbors = [...neighbors].reverse();

          for (const neighborId of reversedNeighbors) {
            await checkPauseState();

            if (!visited.has(neighborId)) {
              stack.push(neighborId);
              
              // Visualise queuing edge
              workingEdges = workingEdges.map(e => {
                if ((e.from === currentId && e.to === neighborId) || (e.type === 'undirected' && e.from === neighborId && e.to === currentId)) {
                  return { ...e, state: 'traversed' };
                }
                return e;
              });
              setEdges(workingEdges);

              workingNodes = workingNodes.map(n => n.id === neighborId && n.state !== 'visited' ? { ...n, state: 'visiting' } : n);
              setNodes(workingNodes);

              setActiveDS([...stack]);
              setMaxDSSize(prev => Math.max(prev, stack.length));

              await awaitStepper('push', `Pushed neighbor ${nodes.find(n=>n.id===neighborId)?.label} to Stack.`, 'push');
            }
          }
        } else {
          // Node is already visited
          await awaitStepper('check_visited', `Node ${nodes.find(n=>n.id===currentId)?.label} was already visited. Skipping.`);
        }
      }

      await awaitStepper('return_false', `Stack empty. Target unreachable.`, 'not_found');
      setStatus("DFS Finished: Target node was not found.");
      setStatusType("error");
    } catch (e) {
      logMessage("[System] Run terminated.");
    }
    setIsVisualizing(false);
  };

  const graphAnalytics = useMemo(() => {
    if (nodes.length === 0) return { totalNodes: 0, totalEdges: 0, isConnected: false, maxDegree: 0 };
    
    // Degrees check
    const degrees = {};
    nodes.forEach(n => degrees[n.id] = 0);
    edges.forEach(e => {
      degrees[e.from] = (degrees[e.from] || 0) + 1;
      degrees[e.to] = (degrees[e.to] || 0) + 1;
    });

    const maxDegree = Math.max(...Object.values(degrees), 0);

    // Connected components using quick local BFS
    const visited = new Set();
    let components = 0;

    nodes.forEach(start => {
      if (!visited.has(start.id)) {
        components++;
        const q = [start.id];
        visited.add(start.id);
        while (q.length > 0) {
          const node = q.shift();
          edges.forEach(e => {
            let neighbor = null;
            if (e.from === node) neighbor = e.to;
            else if (e.type === 'undirected' && e.to === node) neighbor = e.from;
            
            if (neighbor !== null && !visited.has(neighbor)) {
              visited.add(neighbor);
              q.push(neighbor);
            }
          });
        }
      }
    });

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      isConnected: components === 1,
      components,
      maxDegree
    };
  }, [nodes, edges]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      
      {/* Dynamic styles injected inline */}
      <style>{`
        .scroll-smooth { scrollbar-width: thin; scrollbar-color: rgba(74, 85, 104, 0.5) rgba(15, 23, 42, 0.5); }
        .grid-bg { background-image: radial-gradient(#1e293b 1.5px, transparent 1.5px); background-size: 20px 20px; }
        @keyframes flow-dash { to { stroke-dashoffset: -20; } }
        .animate-flow { stroke-dasharray: 8; animation: flow-dash 1s linear infinite; }
      `}</style>

      {/* --- SIDEBAR PANEL --- */}
      <aside className="w-full lg:w-80 xl:w-96 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-5 flex flex-col shrink-0 gap-5 select-none scroll-smooth overflow-y-auto max-h-screen">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400 shadow-md">
            <Layers size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Traverse Sandbox</h1>
            <p className="text-xs text-slate-400 font-medium">BFS & DFS Visual Machine</p>
          </div>
        </div>

        {/* ALGORITHM SELECTOR SWITCH */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 grid grid-cols-2">
          <button
            onClick={() => setAlgo("bfs")}
            disabled={isVisualizing}
            className={`py-2 text-xs font-black rounded-lg transition-all ${algo === 'bfs' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}
          >
            Breadth-First (BFS)
          </button>
          <button
            onClick={() => setAlgo("dfs")}
            disabled={isVisualizing}
            className={`py-2 text-xs font-black rounded-lg transition-all ${algo === 'dfs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}
          >
            Depth-First (DFS)
          </button>
        </div>

        {/* CANVAS LAYOUT CONFIGS */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Settings size={13} className="text-cyan-400" /> Source & Target
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Start Node</span>
              <select
                value={startNodeId ?? ""}
                onChange={(e) => setStartNodeId(parseInt(e.target.value))}
                disabled={isVisualizing}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:border-cyan-500"
              >
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Target Node</span>
              <select
                value={targetNodeId ?? ""}
                onChange={(e) => setTargetNodeId(parseInt(e.target.value))}
                disabled={isVisualizing}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:border-cyan-500"
              >
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={algo === 'bfs' ? runBFS : runDFS}
            disabled={isVisualizing || nodes.length === 0}
            className={`w-full py-2.5 mt-1 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg text-white ${
              algo === 'bfs' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/40' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/40'
            } disabled:opacity-40`}
          >
            <Play size={14} fill="white" /> Execute {algo.toUpperCase()} Run
          </button>
        </div>

        {/* STEP-BY-STEP DEBUGGER CONTROLS */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Runtime Debugger</span>
            <button
              onClick={toggleStepMode}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${stepModeRef.current ? 'bg-cyan-900 border-cyan-700 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
            >
              {stepModeRef.current ? "STEP MODE: ON" : "STEP MODE: OFF"}
            </button>
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={togglePausePlay}
              disabled={!isVisualizing}
              className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                !isVisualizing ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500' :
                isPaused ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900' : 'bg-amber-950 text-amber-400 border-amber-800 hover:bg-amber-900'
              }`}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleNextStep}
              disabled={!isVisualizing || !isPaused}
              className="py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ChevronRight size={14} /> Step Next
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Step Delay:</span>
              <span className="text-cyan-400 font-mono">{speed}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* CUSTOM GRAPH BUILDER TOOLS */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Activity size={13} /> Custom Graph Builder
          </span>

          {/* Add Node */}
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Node Node (e.g. H)"
              maxLength={3}
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs outline-none focus:border-cyan-500"
            />
            <button
              onClick={addCustomNode}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1 rounded text-xs shrink-0 flex items-center gap-1"
            >
              <Plus size={12} /> Node
            </button>
          </div>

          {/* Add Edge */}
          <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={edgeFrom}
                onChange={(e) => setEdgeFrom(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-300"
              >
                <option value="">From...</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
              <select
                value={edgeTo}
                onChange={(e) => setEdgeTo(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-300"
              >
                <option value="">To...</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={edgeDirected}
                  onChange={(e) => setEdgeDirected(e.target.checked)}
                  className="rounded text-cyan-600 bg-slate-900 border-slate-800 focus:ring-0"
                />
                Directed Edge (Arrow)
              </label>
              <button
                onClick={addCustomEdge}
                disabled={edgeFrom === "" || edgeTo === ""}
                className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded hover:bg-cyan-900 text-[10px] font-bold disabled:opacity-50"
              >
                Create Edge
              </button>
            </div>
          </div>
        </div>

        {/* GRAPH PRESET TEMPLATES */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <LayoutGrid size={13} /> Grid Layout Templates
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'tree', label: 'Binary Tree' },
              { id: 'mesh', label: 'Mesh Grid' },
              { id: 'cycle', label: 'Ring Cycle' }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id)}
                disabled={isVisualizing}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition-all text-center truncate ${
                  activePreset === preset.id
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800/80 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 disabled:opacity-40'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER SYSTEM AUDIO AND CLEAR */}
        <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 text-slate-500">
          <div className="flex gap-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg transition-colors border ${audioEnabled ? 'bg-cyan-950/50 text-cyan-400 border-cyan-900' : 'bg-slate-950 text-slate-600 border-slate-800 hover:bg-slate-900'}`}
              title={audioEnabled ? "Mute Tones" : "Unmute Tones"}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={() => setShowNodeCoords(!showNodeCoords)}
              className={`p-2 rounded-lg transition-colors border ${showNodeCoords ? 'bg-cyan-950/50 text-cyan-400 border-cyan-900' : 'bg-slate-950 text-slate-600 border-slate-800 hover:bg-slate-900'}`}
              title={showNodeCoords ? "Hide Coordinates" : "Show Coordinates"}
            >
              {showNodeCoords ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <button
            onClick={resetSimulationStates}
            className="px-3 py-1.5 bg-slate-950 hover:bg-red-950/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/60 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all"
          >
            <RotateCcw size={13} /> Reset Graph
          </button>
        </div>
      </aside>

      {/* --- MAIN DISPLAY WORKSPACE --- */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-950">
        
        {/* RUNTIME GLOWING STATUS BAR */}
        <section className="bg-slate-900/40 p-4 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              statusType === 'error' ? 'bg-rose-500 shadow-rose-500/50 shadow-md' :
              statusType === 'success' ? 'bg-emerald-500 shadow-emerald-500/50 shadow-md animate-pulse' :
              isVisualizing ? 'bg-cyan-400 shadow-cyan-400/50 shadow-md animate-ping' : 'bg-slate-500'
            }`} />
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Operational status</span>
              <p className={`text-sm font-semibold tracking-wide ${
                statusType === 'error' ? 'text-rose-400' :
                statusType === 'success' ? 'text-emerald-400' : 'text-slate-200'
              }`}>{status}</p>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Scale Canvas:</span>
            <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-slate-400">
              <button onClick={() => setZoom(Math.max(60, zoom - 10))} className="p-1 hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={14} /></button>
              <span className="text-[10px] font-mono px-1 min-w-[36px] text-center text-slate-300 font-bold">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(130, zoom + 10))} className="p-1 hover:text-white transition-colors" title="Zoom In"><ZoomIn size={14} /></button>
              <div className="h-4 w-[1px] bg-slate-800 mx-1" />
              <button onClick={() => setZoom(100)} className="p-1 hover:text-white text-xs font-bold transition-colors">Reset</button>
            </div>
          </div>
        </section>

        {/* --- GRAPH GRAPHIC CANVAS PANEL --- */}
        <section className="flex-1 min-h-[350px] relative overflow-auto bg-slate-950 flex items-start justify-center p-6 select-none grid-bg">
          {nodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-32 gap-3">
              <Layers size={48} className="text-slate-800" />
              <div className="text-center">
                <p className="font-bold text-slate-400">Your network graph is empty.</p>
                <p className="text-xs text-slate-600 mt-1">Add custom nodes and edges, or apply a preset layout template.</p>
              </div>
            </div>
          ) : (
            <div
              ref={canvasRef}
              style={{
                width: '600px',
                height: '500px',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center'
              }}
              className="relative border border-slate-900 rounded-2xl bg-slate-950/80 p-2 shadow-2xl transition-transform duration-100"
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUpOrLeave}
              onMouseLeave={handleCanvasMouseUpOrLeave}
            >
              {/* SVG Link Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  {/* Arrow marker for directed edges */}
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="20"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                  </marker>
                  <marker
                    id="arrowhead-traversed"
                    markerWidth="10"
                    markerHeight="7"
                    refX="20"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
                  </marker>
                </defs>

                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isTraversed = edge.state === 'traversed';
                  const strokeColor = isTraversed 
                    ? (algo === 'bfs' ? '#22d3ee' : '#a855f7') 
                    : '#475569';
                  const strokeWidth = isTraversed ? '3' : '2';

                  return (
                    <g key={index}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        markerEnd={edge.type === 'directed' ? `url(#${isTraversed ? 'arrowhead-traversed' : 'arrowhead'})` : undefined}
                        className={isTraversed ? 'animate-flow' : ''}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Node Layer */}
              {nodes.map(node => {
                const isStart = node.id === startNodeId;
                const isTarget = node.id === targetNodeId;

                let borderStyle = "border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400";
                if (node.state === 'visiting') {
                  borderStyle = "bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 animate-pulse border-amber-300";
                } else if (node.state === 'active') {
                  borderStyle = "bg-sky-400 text-slate-950 ring-4 ring-sky-300/40 border-sky-300";
                } else if (node.state === 'visited') {
                  borderStyle = algo === 'bfs' 
                    ? "bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950/30"
                    : "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-950/30";
                } else if (node.state === 'found') {
                  borderStyle = "bg-emerald-500 text-white ring-4 ring-emerald-300 border-emerald-400";
                }

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      transform: 'translate(-50%, -50%)',
                      cursor: isVisualizing ? 'not-allowed' : 'move'
                    }}
                    className={`absolute w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-black select-none transition-all duration-300 z-10 ${borderStyle}`}
                  >
                    <span className="text-sm">{node.label}</span>
                    
                    {/* Start/Target small badges */}
                    {isStart && (
                      <span className="absolute -top-3.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[8px] px-1 py-0.5 rounded font-black">
                        START
                      </span>
                    )}
                    {isTarget && (
                      <span className="absolute -bottom-3.5 bg-rose-950 text-rose-400 border border-rose-800 text-[8px] px-1 py-0.5 rounded font-black">
                        TARGET
                      </span>
                    )}

                    {showNodeCoords && (
                      <span className="absolute top-10 text-[8px] font-mono text-slate-500 bg-slate-950/80 px-1 rounded">
                        {Math.round(node.x)},{Math.round(node.y)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- LIVE STACK / QUEUE HUD TRACKER --- */}
        <section className="bg-slate-950 px-6 py-4 border-t border-slate-900 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={14} className="text-cyan-400" /> Live Data Structure Monitor: {algo === 'bfs' ? 'Queue (FIFO)' : 'Stack (LIFO)'}
            </span>
            <span className="text-[11px] text-slate-500">
              Peak Size: <strong className="text-slate-300 font-mono">{maxDSSize}</strong> elements
            </span>
          </div>

          <div className="min-h-[50px] bg-slate-900/50 rounded-xl border border-slate-900 flex items-center p-3 gap-2 overflow-x-auto scroll-smooth">
            {activeDS.length === 0 ? (
              <span className="text-slate-500 font-mono text-xs italic">Data structure is empty. Initiate simulation.</span>
            ) : (
              <div className="flex items-center gap-2">
                {algo === 'bfs' ? (
                  // Queue flow left to right (Front of queue on left)
                  activeDS.map((id, index) => {
                    const label = nodes.find(n => n.id === id)?.label;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {index === 0 && <span className="text-[10px] text-cyan-400 font-bold uppercase shrink-0">Front &rarr;</span>}
                        <div className="bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-lg px-3 py-1 font-mono text-xs font-bold shadow-md">
                          {label}
                        </div>
                        {index < activeDS.length - 1 && <span className="text-slate-600 font-mono">&mdash;</span>}
                      </div>
                    );
                  })
                ) : (
                  // Stack Flow left to right (Top of stack on right)
                  activeDS.map((id, index) => {
                    const label = nodes.find(n => n.id === id)?.label;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className="bg-indigo-950 text-indigo-300 border border-indigo-800/80 rounded-lg px-3 py-1 font-mono text-xs font-bold shadow-md">
                          {label}
                        </div>
                        {index === activeDS.length - 1 && <span className="text-[10px] text-indigo-400 font-bold uppercase shrink-0">&larr; Top</span>}
                        {index < activeDS.length - 1 && <span className="text-slate-600 font-mono">|</span>}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </section>

        {/* --- LOWER TRACE COMPILER & CONSOLE LOGS --- */}
        <section className="h-72 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row select-none">
          
          {/* Debug Code Compiler */}
          <div className="flex-1 border-r border-slate-800 flex flex-col min-w-0">
            <div className="bg-slate-950 p-2 px-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={15} className="text-cyan-400" />
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Dynamic Trace Compiler</span>
              </div>
              
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg">
                {['python', 'cpp', 'java', 'c'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 text-[10px] font-black uppercase rounded transition-colors ${language === lang ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-slate-400 hover:text-white'}`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto scroll-smooth p-4 bg-slate-950/80 text-xs">
              <pre className="font-mono text-slate-300 leading-relaxed">
                <code>
                  {codeSnippets[language][algo].split('\n').map((line, idx) => {
                    const lineNum = idx + 1;
                    const isHighlighted = highlightLine === lineNum;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 px-2 py-0.5 -mx-2 transition-all duration-150 ${
                          isHighlighted ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-white font-extrabold' : 'opacity-85'
                        }`}
                      >
                        <span className="w-5 text-right text-slate-600 font-mono text-[10px] pr-1">{lineNum}</span>
                        <div className="flex-1 whitespace-pre">
                          {colorizeLineCode(line)}
                        </div>
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
          </div>

          {/* Tab Control (Logs & Stats) */}
          <div className="w-full md:w-80 xl:w-96 flex flex-col min-w-0">
            <div className="bg-slate-950 px-2 border-b border-slate-800 flex justify-between">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("debugger")}
                  className={`p-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${activeTab === 'debugger' ? 'border-cyan-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  <Terminal size={14} /> Output logs
                </button>
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={`p-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${activeTab === 'analysis' ? 'border-cyan-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  <BarChart3 size={14} /> Analytics
                </button>
              </div>
            </div>

            {/* TAB CONTENT: LOG CONSOLE */}
            {activeTab === 'debugger' ? (
              <div ref={logsEndRef} className="flex-1 overflow-auto bg-slate-950 p-4 scroll-smooth flex flex-col gap-1 font-mono">
                {systemLogs.map((log, index) => (
                  <div key={index} className="text-[11px] text-slate-400 leading-normal flex items-start gap-1">
                    <span className="text-slate-600">&gt;</span>
                    <span className={
                      log.includes('[Trace]') ? 'text-cyan-400 font-medium' :
                      log.includes('successful') ? 'text-emerald-400 font-bold' :
                      log.includes('[Error]') ? 'text-rose-400' :
                      log.includes('[Preset]') ? 'text-amber-400' : 'text-slate-400'
                    }>{log}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* TAB CONTENT: ANALYTICS PANEL */
              <div className="flex-1 overflow-auto bg-slate-950 p-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Nodes</span>
                    <span className="text-lg font-bold font-mono text-white">{graphAnalytics.totalNodes}</span>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Edges</span>
                    <span className="text-lg font-bold font-mono text-white">{graphAnalytics.totalEdges}</span>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Connectivity</span>
                    <span className="text-xs font-bold font-mono text-cyan-400">{graphAnalytics.isConnected ? "CONNECTED" : `DISCONNECTED (${graphAnalytics.components} components)`}</span>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Max degree</span>
                    <span className="text-lg font-bold font-mono text-indigo-400">{graphAnalytics.maxDegree}</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chronological Visited Sequence</span>
                  <div className="text-xs font-bold font-mono text-emerald-400 overflow-x-auto whitespace-nowrap scroll-smooth">
                    {visitedNodesSet.length === 0 ? 'No sequence recorded.' : visitedNodesSet.map(id => nodes.find(n=>n.id===id)?.label).join(' → ')}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/20 border border-slate-800/80 rounded-lg flex gap-2 items-start text-slate-400 text-[10px] leading-relaxed">
                  <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p>In standard adjacency graph implementations, both BFS and DFS achieve linear time complexity <span className="text-cyan-400 font-mono">O(V + E)</span>, requiring <span className="text-indigo-400 font-mono">O(V)</span> auxiliary space allocation.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}