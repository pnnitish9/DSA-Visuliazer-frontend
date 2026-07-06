import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search, ArrowUp, ArrowDown, Info } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      --bg-dark-950: #0a0f1d;
      --bg-dark-900: #0f172a;
      --bg-dark-800: #1e293b;
      --bg-dark-700: #334155;
      --bg-dark-600: #475569;
      --bg-dark-500: #64748b;
      
      --text-gray-200: #f1f5f9;
      --text-gray-300: #cbd5e1;
      --text-gray-400: #94a3b8;
      --text-gray-500: #64748b;

      --border-gray-600: #475569;
      --border-gray-700: #334155;

      --cyan-400: #38bdf8;
      --cyan-500: #0ea5e9;
      --cyan-600: #0284c7;
      
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

      --pink-500: #ec4899;
      --pink-600: #db2777;

      --purple-400: #c084fc;
      --purple-500: #a855f7;
      --purple-600: #9333ea;
    }

    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-smoothing: grayscale;
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
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
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
      position: relative;
      flex: 1;
      background-color: rgba(5, 5, 10, 0.4);
      border-radius: 0.5rem;
      min-height: 380px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }

    /* Verbatim green circular nodes from image_eed3d6.png */
    .tree-circle-node {
      width: 3.25rem;
      height: 3.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      font-weight: 600;
      border-radius: 50%;
      transition: left 1.6s cubic-bezier(0.25, 1, 0.5, 1), 
                  top 1.6s cubic-bezier(0.25, 1, 0.5, 1), 
                  background-color 0.6s, border-color 0.6s, transform 0.6s, box-shadow 0.6s;
      user-select: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    /* Verbatim coloring scheme aligning with image_eed3d6.png */
    .tree-circle-node.default {
      background-color: #e2f0d9;
      border: 2.5px solid #8cc07e;
      color: #385723;
    }

    .tree-circle-node.visiting {
      background-color: #fef08a;
      border: 2.5px solid #ca8a04;
      color: #854d0e;
      transform: translate(-50%, -50%) scale(1.12);
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.6);
    }
    .tree-circle-node.pre-op {
      background-color: #fed7aa;
      border: 2.5px solid #ea580c;
      color: #7c2d12;
      transform: translate(-50%, -50%) scale(1.12);
      box-shadow: 0 0 15px rgba(249, 115, 22, 0.6);
    }
    .tree-circle-node.found {
      background-color: #4ade80;
      border: 2.5px solid #16a34a;
      color: #ffffff;
      transform: translate(-50%, -50%) scale(1.18);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
    .tree-circle-node.deleting {
      background-color: #fca5a5;
      border: 2.5px solid #dc2626;
      color: #7f1d1d;
      transform: translate(-50%, -50%) scale(0.85);
      opacity: 0.7;
    }

    /* Heap index node tracker badge */
    .idx-badge {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      background-color: var(--bg-dark-800);
      border: 1.5px solid var(--border-gray-600);
      border-radius: 50%;
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      color: var(--text-gray-300);
    }

    @keyframes flow-descent {
      to { stroke-dashoffset: -20; }
    }
    @keyframes flow-ascent {
      to { stroke-dashoffset: 20; }
    }
    
    .traversal-descent-line {
      stroke: #22c55e;
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-descent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.8));
      opacity: 0.95;
    }
    
    .traversal-ascent-line {
      stroke: #ef4444;
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-ascent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
      opacity: 0.95;
    }

    /* Persistent HUD Analyzer card verbatim layout of image_fab0bf.png */
    .rotation-analyzer-hud {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 270px;
      background-color: rgba(15, 23, 42, 0.95);
      border: 1.5px solid var(--pink-600);
      border-radius: 0.5rem;
      padding: 0.85rem;
      font-size: 0.8rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      z-index: 20;
      animation: slideInHUD 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideInHUD {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Array view container elements */
    .array-representation-container {
      margin-top: 1rem;
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .array-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .array-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 3rem;
    }
    .array-box {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 0.375rem;
      border: 2px solid var(--border-gray-600);
      background-color: var(--bg-dark-700);
      transition: all 0.3s;
    }
    .array-box.visiting {
      background-color: #fef08a;
      border-color: #ca8a04;
      color: #854d0e;
    }
    .array-box.swap {
      background-color: #fed7aa;
      border-color: #ea580c;
      color: #7c2d12;
    }
    .array-idx {
      font-size: 0.725rem;
      color: var(--text-gray-500);
      margin-top: 0.25rem;
      font-weight: bold;
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
      min-height: 280px;
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
  insert: {
    python: `
def insert(heap, key):
    heap.append(key)
    heapify_up(len(heap) - 1)

def heapify_up(index):
    parent = (index - 1) // 2
    if index > 0 and compare(heap[index], heap[parent]):
        swap(index, parent)
        heapify_up(parent)
    `.trim(),
    cpp: `
void insert(vector<int>& heap, int key) {
    heap.push_back(key);
    heapifyUp(heap.size() - 1);
}

void heapifyUp(int index) {
    int parent = (index - 1) / 2;
    if (index > 0 && compare(heap[index], heap[parent])) {
        swap(heap[index], heap[parent]);
        heapifyUp(parent);
    }
}
    `.trim(),
    java: `
public void insert(int key) {
    heap.add(key);
    heapifyUp(heap.size() - 1);
}

private void heapifyUp(int index) {
    int parent = (index - 1) / 2;
    if (index > 0 && compare(heap.get(index), heap.get(parent))) {
        swap(index, parent);
        heapifyUp(parent);
    }
}
    `.trim(),
    c: `
void insert(int heap[], int* size, int key) {
    heap[*size] = key;
    (*size)++;
    heapifyUp(heap, *size - 1);
}

void heapifyUp(int heap[], int index) {
    int parent = (index - 1) / 2;
    if (index > 0 && compare(heap[index], heap[parent])) {
        swap(&heap[index], &heap[parent]);
        heapifyUp(heap, parent);
    }
}
    `.trim()
  },
  extract: {
    python: `
def extract(heap):
    if len(heap) == 0: return None
    root_val = heap[0]
    heap[0] = heap.pop()
    heapify_down(0)
    return root_val

def heapify_down(index):
    left = 2 * index + 1
    right = 2 * index + 2
    target = index
    
    if left < len(heap) and compare(heap[left], heap[target]):
        target = left
    if right < len(heap) and compare(heap[right], heap[target]):
        target = right
        
    if target != index:
        swap(index, target)
        heapify_down(target)
    `.trim(),
    cpp: `
int extract(vector<int>& heap) {
    if (heap.empty()) return -1;
    int rootVal = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    heapifyDown(0);
    return rootVal;
}

void heapifyDown(int index) {
    int left = 2 * index + 1;
    int right = 2 * index + 2;
    int target = index;
    
    if (left < heap.size() && compare(heap[left], heap[target]))
        target = left;
    if (right < heap.size() && compare(heap[right], heap[target]))
        target = right;
        
    if (target != index) {
        swap(heap[index], heap[target]);
        heapifyDown(target);
    }
}
    `.trim(),
    java: `
public int extract() {
    if (heap.isEmpty()) return -1;
    int rootVal = heap.get(0);
    heap.set(0, heap.remove(heap.size() - 1));
    heapifyDown(0);
    return rootVal;
}

private void heapifyDown(int index) {
    int left = 2 * index + 1;
    int right = 2 * index + 2;
    int target = index;
    
    if (left < heap.size() && compare(heap.get(left), heap.get(target)))
        target = left;
    if (right < heap.size() && compare(heap.get(right), heap.get(target)))
        target = right;
        
    if (target != index) {
        swap(index, target);
        heapifyDown(target);
    }
}
    `.trim(),
    c: `
int extract(int heap[], int* size) {
    if (*size == 0) return -1;
    int rootVal = heap[0];
    heap[0] = heap[*size - 1];
    (*size)--;
    heapifyDown(heap, *size, 0);
    return rootVal;
}

void heapifyDown(int heap[], int size, int index) {
    int left = 2 * index + 1;
    int right = 2 * index + 2;
    int target = index;
    
    if (left < size && compare(heap[left], heap[target]))
        target = left;
    if (right < size && compare(heap[right], heap[target]))
        target = right;
        
    if (target != index) {
        swap(&heap[index], &heap[target]);
        heapifyDown(heap, size, target);
    }
}
    `.trim()
  }
};

const LINE_MAPS = {
  insert: {
    python: { init: 2, heapify: 6, swap: 8 },
    cpp: { init: 2, heapify: 7, swap: 9 },
    java: { init: 2, heapify: 7, swap: 9 },
    c: { init: 2, heapify: 8, swap: 10 }
  },
  extract: {
    python: { init: 3, replace: 4, left_check: 12, right_check: 14, swap: 18 },
    cpp: { init: 3, replace: 4, left_check: 15, right_check: 17, swap: 21 },
    java: { init: 3, replace: 4, left_check: 13, right_check: 15, swap: 18 },
    c: { init: 3, replace: 4, left_check: 14, right_check: 16, swap: 19 }
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const playTone = (frequency, duration) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fail silently if Web Audio is blocked or unsupported
  }
};

export default function HeapVisualizer() {
  const [heap, setHeap] = useState([]); // List of node objects: { value, id, state }
  const [value, setValue] = useState("");
  const [isMaxHeap, setIsMaxHeap] = useState(true); // Toggle between Max Heap & Min Heap
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(1000);
  const [status, setStatus] = useState("Ready. Add a value to build the complete binary tree structure.");
  const [executionLog, setExecutionLog] = useState(["[System] Heap Sandbox loaded. Standard array indices map to binary tree coordinates."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [activeConcept, setActiveConcept] = useState("insert"); 

  const [activeDescentLine, setActiveDescentLine] = useState(null); // { fromIdx, toIdx }
  const [activeAscentLine, setActiveAscentLine] = useState(null); // { fromIdx, toIdx }

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  // Persistent HUD analyzer state verbatim to image_fab0bf.png
  const [heapifyDiagnostic, setHeapifyDiagnostic] = useState(null);

  const pausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  const getLayoutPositions = (nodes) => {
    const computedNodes = [];
    const computedEdges = [];
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const levelIndex = i - (Math.pow(2, level) - 1);
      const levelCount = Math.pow(2, level);
      
      const x = (levelIndex + 0.5) * (100 / levelCount);
      const y = 50 + level * 75;

      computedNodes.push({
        ...nodes[i],
        x,
        y,
        idx: i
      });

      // Connect with parent
      if (i > 0) {
        const parentIdx = Math.floor((i - 1) / 2);
        computedEdges.push({
          fromIdx: parentIdx,
          toIdx: i
        });
      }
    }
    return { computedNodes, computedEdges };
  };

  const resetNodeStates = (nodeList) => {
    return nodeList.map(n => ({ ...n, state: 'default' }));
  };

  const getVal = () => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setError("Please enter a valid number.");
      return null;
    }
    return num;
  };

  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Click Resume to continue.");
      await sleep(100);
    }
  };

  const cleanup = () => {
    setIsVisualizing(false);
    setValue("");
    setTimeout(() => {
      if (!isCancelledRef.current) {
        setHeap(prev => resetNodeStates(prev));
        setStatus("Ready.");
        setHighlightLineNum(-1);
        setActiveDescentLine(null);
        setActiveAscentLine(null);
      }
    }, speed * 1.5);
  };

  const highlightLine = (concept, key) => {
    if (LINE_MAPS[concept] && LINE_MAPS[concept][language]) {
      setHighlightLineNum(LINE_MAPS[concept][language][key] ?? -1);
    } else {
      setHighlightLineNum(-1);
    }
  };

  const heapifyUp = async (currIndex, currentHeap) => {
    let tempHeap = [...currentHeap];
    
    while (currIndex > 0) {
      if (isCancelledRef.current) return tempHeap;
      await checkPause();

      const parentIndex = Math.floor((currIndex - 1) / 2);
      
      // Update tracer line
      setActiveAscentLine({ fromIdx: currIndex, toIdx: parentIndex });
      
      // Mark as visiting
      tempHeap[currIndex].state = 'visiting';
      tempHeap[parentIndex].state = 'visiting';
      setHeap(tempHeap);
      
      highlightLine("insert", "heapify");
      const parentVal = tempHeap[parentIndex].value;
      const childVal = tempHeap[currIndex].value;
      
      setStatus(`Comparing node ${childVal} (index ${currIndex}) with parent ${parentVal} (index ${parentIndex})...`);
      playTone(440, 0.15);
      await sleep(speed);

      let violation = false;
      if (isMaxHeap) {
        violation = childVal > parentVal;
      } else {
        violation = childVal < parentVal;
      }

      if (violation) {
        // Violates, swap
        setStatus(`Violation detected! Swapping node ${childVal} with parent ${parentVal}.`);
        setExecutionLog(prev => [...prev, `[Swap] Key ${childVal} swaped with parent ${parentVal}`]);
        playTone(330, 0.2);

        setHeapifyDiagnostic({
          type: isMaxHeap ? 'Max-Heap Swapping' : 'Min-Heap Swapping',
          parentIdx: parentIndex,
          parentVal,
          childIdx: currIndex,
          childVal,
          status: 'Violation Found - Swapping',
          phase: `Up-Heapify Swapping indices [${currIndex}] <-> [${parentIndex}]`
        });

        tempHeap[currIndex].state = 'pre-op';
        tempHeap[parentIndex].state = 'pre-op';
        setHeap(tempHeap);
        await sleep(speed * 0.5);

        // Perform standard swap
        const tempNode = tempHeap[currIndex];
        tempHeap[currIndex] = tempHeap[parentIndex];
        tempHeap[parentIndex] = tempNode;

        setHeap(tempHeap);
        highlightLine("insert", "swap");
        await sleep(speed * 1.5);

        // Reset state & descend upwards
        tempHeap[currIndex].state = 'default';
        tempHeap[parentIndex].state = 'default';
        currIndex = parentIndex;
      } else {
        setStatus(`Heap property validated at index ${currIndex}. No swap needed.`);
        setExecutionLog(prev => [...prev, `[Success] Heap condition verified for key ${childVal}.`]);
        tempHeap[currIndex].state = 'found';
        tempHeap[parentIndex].state = 'found';
        setHeap(tempHeap);
        
        setHeapifyDiagnostic({
          type: isMaxHeap ? 'Max-Heap Heapify' : 'Min-Heap Heapify',
          parentIdx: parentIndex,
          parentVal,
          childIdx: currIndex,
          childVal,
          status: 'Balanced',
          phase: 'Heap properties resolved successfully.'
        });

        await sleep(speed);
        break;
      }
    }
    
    // Clear trace connections
    setActiveAscentLine(null);
    return tempHeap;
  };

  const heapifyDown = async (currIndex, currentHeap) => {
    let tempHeap = [...currentHeap];
    const len = tempHeap.length;

    while (currIndex < len) {
      if (isCancelledRef.current) return tempHeap;
      await checkPause();

      const left = 2 * currIndex + 1;
      const right = 2 * currIndex + 2;
      let target = currIndex;

      // Mark current state as visiting
      tempHeap[currIndex].state = 'visiting';
      setHeap(tempHeap);

      highlightLine("extract", "left_check");
      if (left < len) {
        tempHeap[left].state = 'visiting';
        setHeap(tempHeap);
        setActiveDescentLine({ fromIdx: currIndex, toIdx: left });
        setStatus(`Checking left child ${tempHeap[left].value} (index ${left})...`);
        playTone(400, 0.15);
        await sleep(speed);

        if (isMaxHeap) {
          if (tempHeap[left].value > tempHeap[target].value) target = left;
        } else {
          if (tempHeap[left].value < tempHeap[target].value) target = left;
        }
      }

      highlightLine("extract", "right_check");
      if (right < len) {
        tempHeap[right].state = 'visiting';
        setHeap(tempHeap);
        setActiveDescentLine({ fromIdx: currIndex, toIdx: right });
        setStatus(`Checking right child ${tempHeap[right].value} (index ${right})...`);
        playTone(420, 0.15);
        await sleep(speed);

        if (isMaxHeap) {
          if (tempHeap[right].value > tempHeap[target].value) target = right;
        } else {
          if (tempHeap[right].value < tempHeap[target].value) target = right;
        }
      }

      if (target !== currIndex) {
        setStatus(`Violation detected! Swapping index ${currIndex} (${tempHeap[currIndex].value}) with child ${tempHeap[target].value} (index ${target}).`);
        setExecutionLog(prev => [...prev, `[Swap] Heapify down index ${currIndex} and child ${target}`]);
        playTone(330, 0.2);

        setHeapifyDiagnostic({
          type: isMaxHeap ? 'Max-Heap Bubbling Down' : 'Min-Heap Bubbling Down',
          parentIdx: currIndex,
          parentVal: tempHeap[currIndex].value,
          childIdx: target,
          childVal: tempHeap[target].value,
          status: 'Violation Found - Swapping',
          phase: `Down-Heapify Swapping indices [${currIndex}] <-> [${target}]`
        });

        tempHeap[currIndex].state = 'pre-op';
        tempHeap[target].state = 'pre-op';
        setHeap(tempHeap);
        await sleep(speed * 0.5);

        // Perform swap
        const tempNode = tempHeap[currIndex];
        tempHeap[currIndex] = tempHeap[target];
        tempHeap[target] = tempNode;

        setHeap(tempHeap);
        highlightLine("extract", "swap");
        await sleep(speed * 1.5);

        // Reset states
        tempHeap[currIndex].state = 'default';
        tempHeap[target].state = 'default';
        if (left < len) tempHeap[left].state = 'default';
        if (right < len) tempHeap[right].state = 'default';

        currIndex = target;
      } else {
        setStatus(`Heap property validated at index ${currIndex}. Sifting complete.`);
        setExecutionLog(prev => [...prev, `[Success] Down-Heapify verified heap structural safety.`]);
        tempHeap[currIndex].state = 'found';
        setHeap(tempHeap);

        setHeapifyDiagnostic({
          type: isMaxHeap ? 'Max-Heap Heapify' : 'Min-Heap Heapify',
          parentIdx: currIndex,
          parentVal: tempHeap[currIndex].value,
          childIdx: target,
          childVal: tempHeap[target].value,
          status: 'Balanced',
          phase: 'Sifting completed cleanly.'
        });

        await sleep(speed);
        break;
      }
    }

    setActiveDescentLine(null);
    return tempHeap;
  };

  const handleInsert = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setActiveConcept("insert");
    setActiveDescentLine(null);
    setActiveAscentLine(null);
    setExecutionLog(prev => [...prev, `[Insert] Appending node with value ${val} to end of complete tree.`]);

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const newNode = { value: val, id: uniqueId, state: 'found' };

    let currentHeap = [...heap, newNode];
    setHeap(currentHeap);
    highlightLine("insert", "init");
    setStatus(`Inserted node ${val} at the standard array leaf index ${currentHeap.length - 1}.`);
    playTone(523.25, 0.25); // C5 tone
    await sleep(speed * 1.5);

    currentHeap = await heapifyUp(currentHeap.length - 1, currentHeap);
    
    if (!isCancelledRef.current) {
      setHeap(currentHeap);
    }
    cleanup();
  };

  const handleExtract = async () => {
    if (heap.length === 0) {
      setError("Heap is empty. Insert elements first.");
      return;
    }

    setError(null);
    setIsVisualizing(true);
    setActiveConcept("extract");
    setActiveDescentLine(null);
    setActiveAscentLine(null);

    const extremeName = isMaxHeap ? "Max" : "Min";
    setExecutionLog(prev => [...prev, `[Extract] Extracting root value (${heap[0].value})`]);
    highlightLine("extract", "init");

    let currentHeap = [...heap];
    currentHeap[0].state = 'deleting';
    setHeap(currentHeap);
    setStatus(`Extracting root value ${currentHeap[0].value}. Preparing array replacements...`);
    playTone(261.63, 0.35); // C4 tone
    await sleep(speed * 1.5);

    if (currentHeap.length === 1) {
      setHeap([]);
      cleanup();
      return;
    }

    // Replace root with the last element
    const lastNode = currentHeap[currentHeap.length - 1];
    setStatus(`Swapping root with the last leaf element ${lastNode.value} (index ${currentHeap.length - 1}).`);
    setExecutionLog(prev => [...prev, `[Swap] Replaced index 0 with index ${currentHeap.length - 1}`]);
    playTone(293.66, 0.2); // D4

    highlightLine("extract", "replace");
    currentHeap[0] = { ...lastNode, state: 'pre-op' };
    currentHeap.pop(); // Remove the last item
    setHeap(currentHeap);
    await sleep(speed * 1.5);

    currentHeap = await heapifyDown(0, currentHeap);

    if (!isCancelledRef.current) {
      setHeap(currentHeap);
    }
    cleanup();
  };

  const handleToggleHeapMode = async (nextIsMax) => {
    if (isVisualizing) return;
    setIsMaxHeap(nextIsMax);
    setExecutionLog(prev => [...prev, `[System] Switched to ${nextIsMax ? 'Max-Heap' : 'Min-Heap'} rules. Rebuilding tree structure...`]);

    if (heap.length <= 1) return;

    // Convert existing elements to the chosen heap dynamically using Floyd's heap construction
    setIsVisualizing(true);
    let currentHeap = heap.map(n => ({ ...n, state: 'default' }));
    
    setStatus(`Initiating array heapify algorithm starting from middle parents upwards...`);
    await sleep(speed);

    for (let i = Math.floor(currentHeap.length / 2) - 1; i >= 0; i--) {
      currentHeap = await heapifyDown(i, currentHeap);
      if (isCancelledRef.current) {
        setIsVisualizing(false);
        return;
      }
    }

    setHeap(currentHeap);
    setIsVisualizing(false);
    setStatus(`Successfully transformed complete binary tree structure!`);
    playTone(587.33, 0.3); // E5
  };

  const handleReset = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    
    setHeap([]);
    setValue("");
    setError(null);
    setStatus("Tree is empty. Add a value to build the complete binary tree structure.");
    setHighlightLineNum(-1);
    setExecutionLog(["[System] Heap Sandbox cleared."]);
    setActiveDescentLine(null);
    setActiveAscentLine(null);
    setHeapifyDiagnostic(null);
    
    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    pausedRef.current = nextPaused;
    if (nextPaused) {
      setExecutionLog(prev => [...prev, "Paused heap balance visualizer."]);
    } else {
      setExecutionLog(prev => [...prev, "Resuming heap sifting..."]);
    }
  };

  const codeLines = codeSnippets[activeConcept][language].trim().split('\n');
  const statusColor = status.includes("Violation") || status.includes("Swapping") || status.includes("Comparing")
    ? "status-paused"
    : status.includes("validated") || status.includes("Successfully") || status.includes("verified")
    ? "status-found"
    : "status-default";

  const { computedNodes, computedEdges } = getLayoutPositions(heap);

  return (
    <div className="visualizer-container">
      <InjectedStyles />

      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <GitFork size={30} style={{ transform: 'rotate(180deg)' }} />
          Binary Heap
        </h1>

        {/* Dynamic Heap Rule Switcher */}
        <div className="input-group">
          <label>Heap Constraint Mode</label>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
            <button
              onClick={() => handleToggleHeapMode(true)}
              disabled={isVisualizing}
              className={`btn ${isMaxHeap ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              title="Parent values must always be greater than or equal to child values."
            >
              <ArrowUp size={16} /> Max-Heap
            </button>
            <button
              onClick={() => handleToggleHeapMode(false)}
              disabled={isVisualizing}
              className={`btn ${!isMaxHeap ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              title="Parent values must always be less than or equal to child values."
            >
              <ArrowDown size={16} /> Min-Heap
            </button>
          </div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-gray-400)', display: 'block', marginTop: '0.35rem', lineHeight: '1.3' }}>
            {isMaxHeap 
              ? "Max-Heap: Root holds the absolute maximum value. Parent >= Child." 
              : "Min-Heap: Root holds the absolute minimum value. Parent <= Child."}
          </span>
        </div>

        <div className="input-group">
          <label htmlFor="value">Node Key Value</label>
          <input
            id="value"
            type="text"
            placeholder="e.g., 25"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Operations */}
        <div className="actions-single">
          <button onClick={handleInsert} disabled={isVisualizing} className="btn btn-green">Insert Element</button>
        </div>
        <div className="actions-single">
          <button 
            onClick={handleExtract} 
            disabled={isVisualizing || heap.length === 0} 
            className="btn btn-red"
          >
            Extract Root ({isMaxHeap ? "Max" : "Min"})
          </button>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1.5rem 0' }} />

        {/* Runtime Debugger Control Set */}
        <div className="actions-grid">
          <button
            onClick={togglePause}
            disabled={!isVisualizing}
            className={`btn ${isPaused ? 'btn-resume' : 'btn-pause'}`}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          
          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Reset Heap
          </button>
        </div>

        {/* Code language tracking controls */}
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
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

        <div className="input-group">
          <label htmlFor="speed">Visualization Speed</label>
          <div className="speed-slider-group">
            <input
              id="speed"
              type="range"
              min="200"
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
        {/* --- Visualization Canvas Section --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>

          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="visualization-boxes">
            {heap.length === 0 && (
              <span style={{ color: 'var(--text-gray-500)', margin: 'auto' }}>
                Heap tree is currently empty. Insert key values on the left sidebar to generate binary tree.
              </span>
            )}

            {heap.length > 0 && (
              <>
                {/* HUD: Persistent Heapify Analyzer details card matching image_fab0bf.png verbatim */}
                {heapifyDiagnostic && (
                  <div className="rotation-analyzer-hud">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pink-500)', fontWeight: 'bold', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      <Info size={14} /> Heapify Analyzer Active
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                      Constraint: {heapifyDiagnostic.type}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.2rem', color: 'var(--text-gray-300)', fontSize: '0.75rem' }}>
                      <span>Parent Value:</span><span style={{ color: 'var(--pink-500)', fontWeight: 'bold' }}>{heapifyDiagnostic.parentVal} <span style={{ color: 'var(--text-gray-500)' }}>[idx {heapifyDiagnostic.parentIdx}]</span></span>
                      <span>Target Child:</span><span style={{ color: 'var(--cyan-400)' }}>{heapifyDiagnostic.childVal} <span style={{ color: 'var(--text-gray-500)' }}>[idx {heapifyDiagnostic.childIdx}]</span></span>
                      <span>Status:</span><span style={{ color: heapifyDiagnostic.status.includes('Violation') ? 'var(--red-400)' : 'var(--green-400)' }}>{heapifyDiagnostic.status}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-gray-700)', marginTop: '0.4rem', paddingTop: '0.4rem', fontSize: '0.725rem', color: 'var(--yellow-400)', fontStyle: 'italic' }}>
                      {heapifyDiagnostic.phase}
                    </div>
                  </div>
                )}

                {/* SVG connection overlay drawing verbatim direct diagonal branch lines of image_eed3d6.png */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  {computedEdges.map((edge, idx) => {
                    const fromNode = computedNodes[edge.fromIdx];
                    const toNode = computedNodes[edge.toIdx];

                    const isDescentActive = activeDescentLine && 
                      ((activeDescentLine.fromIdx === edge.fromIdx && activeDescentLine.toIdx === edge.toIdx) ||
                       (activeDescentLine.fromIdx === edge.toIdx && activeDescentLine.toIdx === edge.fromIdx));

                    const isAscentActive = activeAscentLine &&
                      ((activeAscentLine.fromIdx === edge.fromIdx && activeAscentLine.toIdx === edge.toIdx) ||
                       (activeAscentLine.fromIdx === edge.toIdx && activeAscentLine.toIdx === edge.fromIdx));

                    return (
                      <g key={idx}>
                        <line
                          x1={`${fromNode.x}%`}
                          y1={`${fromNode.y}px`}
                          x2={`${toNode.x}%`}
                          y2={`${toNode.y}px`}
                          stroke="#8cc07e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          style={{ transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                        />

                        {isDescentActive && (
                          <line
                            x1={`${fromNode.x}%`}
                            y1={`${fromNode.y}px`}
                            x2={`${toNode.x}%`}
                            y2={`${toNode.y}px`}
                            className="traversal-descent-line"
                          />
                        )}

                        {isAscentActive && (
                          <line
                            x1={`${fromNode.x}%`}
                            y1={`${fromNode.y}px`}
                            x2={`${toNode.x}%`}
                            y2={`${toNode.y}px`}
                            className="traversal-ascent-line"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Dynamic circular nodes matching visual design of image_eed3d6.png */}
                {computedNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`tree-circle-node ${node.state || 'default'}`}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                    }}
                  >
                    {node.value}
                    
                    {/* Array index indicator badge */}
                    <span className="idx-badge" title={`Array index index: ${node.idx}`}>
                      {node.idx}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Dynamic 1D Array tracker representation block */}
          {heap.length > 0 && (
            <div className="array-representation-container">
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1D Array Layout Representation [Index mapping 0 to N-1]
              </span>
              <div className="array-grid">
                {heap.map((node, i) => {
                  let customBoxState = "";
                  if (node.state === 'visiting') customBoxState = "visiting";
                  else if (node.state === 'pre-op') customBoxState = "swap";

                  return (
                    <div key={node.id} className="array-item">
                      <div className={`array-box ${customBoxState}`}>
                        {node.value}
                      </div>
                      <span className="array-idx">[{i}]</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* --- Lower Content Area (Code & Logs) --- */}
        <div className="lower-content-area">
          <section className="code-section">
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Code Tracker</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                {activeConcept}
              </span>
            </h2>
            <div className="code-block">
              <pre>
                <code>
                  {codeLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`code-line
                        ${highlightLineNum === (idx + 1) ? 'highlight' : ''}
                        ${(line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('def ') || line.trim().startsWith('void ')) ? 'comment' : ''}
                      `}
                    >
                      {line || '\u00A0'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </section>

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