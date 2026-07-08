import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search, Info } from 'lucide-react';

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
    }

    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
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
      min-height: 480px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1.5rem;
    }

    .hash-circle-node {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: 50%;
      transition: background-color 0.4s, border-color 0.4s, transform 0.4s, box-shadow 0.4s;
      user-select: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .hash-circle-node.default {
      background-color: #e2f0d9;
      border: 2.5px solid #8cc07e;
      color: #385723;
    }
    .hash-circle-node.visiting {
      background-color: #fef08a;
      border: 2.5px solid #ca8a04;
      color: #854d0e;
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.6);
    }
    .hash-circle-node.pre-op {
      background-color: #fed7aa;
      border: 2.5px solid #ea580c;
      color: #7c2d12;
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(249, 115, 22, 0.6);
    }
    .hash-circle-node.found {
      background-color: #4ade80;
      border: 2.5px solid #16a34a;
      color: #ffffff;
      transform: scale(1.15);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
    .hash-circle-node.deleting {
      background-color: #fca5a5;
      border: 2.5px solid #dc2626;
      color: #7f1d1d;
      transform: scale(0.85);
      opacity: 0.7;
    }
    .hash-circle-node.tombstone {
      background-color: rgba(30, 41, 59, 0.8);
      border: 2px dashed var(--border-gray-600);
      color: var(--text-gray-500);
      font-size: 0.75rem;
      font-weight: bold;
    }

    @keyframes dash-descent {
      to { stroke-dashoffset: -20; }
    }
    @keyframes dash-ascent {
      to { stroke-dashoffset: 20; }
    }
    .trace-descent-line {
      stroke: #22c55e;
      stroke-width: 3.5;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: dash-descent 0.5s linear infinite;
      filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.8));
    }
    .trace-ascent-line {
      stroke: #ef4444;
      stroke-width: 3.5;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: dash-ascent 0.5s linear infinite;
      filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.8));
    }

    .hash-slot-row {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      position: relative;
    }
    .hash-bucket-index {
      width: 3.5rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-dark-800);
      border: 2px solid var(--border-gray-700);
      border-radius: 0.375rem;
      font-family: monospace;
      font-weight: bold;
      color: var(--cyan-400);
      font-size: 0.95rem;
      margin-right: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .hash-bucket-index.active-slot {
      border-color: var(--pink-500);
      box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
    }

    .hash-chain-connector {
      width: 1.5rem;
      height: 2px;
      background-color: var(--border-gray-600);
      position: relative;
    }
    .hash-chain-connector::after {
      content: '';
      position: absolute;
      right: 0;
      top: -3px;
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 6px solid var(--border-gray-600);
    }

    .analyzer-hud-card {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 280px;
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
  chaining: {
    python: `
def insert_chaining(table, key):
    idx = key % len(table)
    bucket = table[idx]
    for node in bucket:
        if node.value == key:
            return  # Key exists
    bucket.append(Node(key))

def search_chaining(table, key):
    idx = key % len(table)
    for node in table[idx]:
        if node.value == key:
            return True
    return False
    `.trim(),
    cpp: `
void insertChaining(vector<list<int>>& table, int key) {
    int idx = key % table.size();
    for (int val : table[idx]) {
        if (val == key) return; // Exists
    }
    table[idx].push_back(key);
}

bool searchChaining(vector<list<int>>& table, int key) {
    int idx = key % table.size();
    for (int val : table[idx]) {
        if (val == key) return true;
    }
    return false;
}
    `.trim(),
    java: `
public void insert(int key) {
    int idx = key % table.length;
    for (int val : table[idx]) {
        if (val == key) return;
    }
    table[idx].add(key);
}

public boolean search(int key) {
    int idx = key % table.length;
    return table[idx].contains(key);
}
    `.trim(),
    c: `
void insertChaining(Node* table[], int size, int key) {
    int idx = key % size;
    Node* curr = table[idx];
    while (curr != NULL) {
        if (curr->value == key) return;
        curr = curr->next;
    }
    Node* newNode = createNode(key);
    newNode->next = table[idx];
    table[idx] = newNode;
}
    `.trim()
  },
  probing: {
    python: `
def insert_probing(table, key, technique):
    h = key % len(table)
    for i in range(len(table)):
        # Linear: i, Quadratic: i*i, Double: i * h2(key)
        idx = get_probe_index(h, i, key, technique)
        if table[idx] is None or table[idx] == "DEL":
            table[idx] = key
            return True
    return False # Table full
    `.trim(),
    cpp: `
bool insertProbing(vector<int>& table, int key, int tech) {
    int h = key % table.size();
    for (int i = 0; i < table.size(); i++) {
        int idx = getProbeIdx(h, i, key, tech);
        if (table[idx] == EMPTY || table[idx] == DEL) {
            table[idx] = key;
            return true;
        }
    }
    return false;
}
    `.trim(),
    java: `
public boolean insert(int key, String technique) {
    int h = key % table.length;
    for (int i = 0; i < table.length; i++) {
        int idx = getProbeIdx(h, i, key, technique);
        if (table[idx] == null || table[idx] == DELETED) {
            table[idx] = key;
            return true;
        }
    }
    return false;
}
    `.trim(),
    c: `
int insertProbing(int table[], int size, int key, int tech) {
    int h = key % size;
    for (int i = 0; i < size; i++) {
        int idx = getProbeIdx(h, i, key, tech, size);
        if (table[idx] == EMPTY || table[idx] == TOMBSTONE) {
            table[idx] = key;
            return idx;
        }
    }
    return -1;
}
    `.trim()
  }
};

const LINE_MAPS = {
  chaining: {
    python: { init: 2, loop: 4, insert: 6, success: 5 },
    cpp: { init: 2, loop: 3, insert: 5, success: 4 },
    java: { init: 2, loop: 4, insert: 5, success: 4 },
    c: { init: 2, loop: 4, insert: 7, success: 5 }
  },
  probing: {
    python: { init: 2, loop: 3, probe: 5, insert: 6, success: 7 },
    cpp: { init: 2, loop: 3, probe: 4, insert: 5, success: 6 },
    java: { init: 2, loop: 3, probe: 4, insert: 5, success: 6 },
    c: { init: 2, loop: 3, probe: 4, insert: 5, success: 6 }
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
    
    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fail silently if Web Audio is unsupported
  }
};

const isPrimeNumber = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

export default function HashTableVisualizer() {
  const [tableSize, setTableSize] = useState(10);
  const [hashMode, setHashMode] = useState("chaining"); // "chaining" | "probing"
  const [probingMode, setProbingMode] = useState("linear"); // "linear" | "quadratic" | "double"
  const [table, setTable] = useState(Array(10).fill(null).map(() => [])); // Holds arrays for chaining or items for probing
  
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(600);
  const [status, setStatus] = useState("Select a mode and add numeric keys to observe collision resolution paths.");
  const [executionLog, setExecutionLog] = useState(["[System] Sandbox loaded. Hashing formulas map as slot = key % size."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [activeConcept, setActiveConcept] = useState("chaining");

  // Dynamic visual trace states
  const [activeSlotIdx, setActiveSlotIdx] = useState(null);
  const [visitingChainIdx, setVisitingChainIdx] = useState(null);
  const [collisionPositions, setCollisionPositions] = useState([]);
  const [traceLines, setTraceLines] = useState([]);

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  // Persistent HUD diagnostic card layout
  const [hashDiagnostic, setHashDiagnostic] = useState(null);

  const pausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  useEffect(() => {
    handleResetTable(tableSize, hashMode);
  }, [tableSize, hashMode]);

  const handleResetTable = (size, mode) => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;

    if (mode === "chaining") {
      setTable(Array(size).fill(null).map(() => []));
    } else {
      setTable(Array(size).fill(null));
    }

    setValue("");
    setError(null);
    setStatus("Table reset and initialized. Ready for operations.");
    setHighlightLineNum(-1);
    setExecutionLog([`[System] Hash Table reconstructed. Size: ${size}. Mode: ${mode === 'chaining' ? 'Separate Chaining' : 'Open Addressing'}.`]);
    setHashDiagnostic(null);
    setActiveSlotIdx(null);
    setVisitingChainIdx(null);
    setCollisionPositions([]);
    setTraceLines([]);

    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };

  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Click Resume to continue.");
      await sleep(100);
    }
  };

  const getVal = () => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
      setError("Please enter a valid non-negative number.");
      return null;
    }
    return num;
  };

  const highlightLine = (concept, key) => {
    if (LINE_MAPS[concept] && LINE_MAPS[concept][language]) {
      setHighlightLineNum(LINE_MAPS[concept][language][key] ?? -1);
    } else {
      setHighlightLineNum(-1);
    }
  };

  const getSecondaryHash = (key) => {
    return 7 - (key % 7);
  };

  const getProbeOffset = (i, key) => {
    if (probingMode === "linear") {
      return i;
    } else if (probingMode === "quadratic") {
      return i * i;
    } else {
      return i * getSecondaryHash(key);
    }
  };

  const cleanup = () => {
    setIsVisualizing(false);
    setValue("");
    setTimeout(() => {
      if (!isCancelledRef.current) {
        setStatus("Ready.");
        setHighlightLineNum(-1);
        setActiveSlotIdx(null);
        setVisitingChainIdx(null);
        setCollisionPositions([]);
        setTraceLines([]);
      }
    }, speed * 1.5);
  };

  const handleInsert = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setTraceLines([]);
    setCollisionPositions([]);
    setActiveConcept(hashMode);

    const keyHash = val % tableSize;
    setExecutionLog(prev => [...prev, `[Operation] Requesting insertion of key ${val}. Hash = ${val} % ${tableSize} = ${keyHash}`]);

    if (hashMode === "chaining") {
      let currentTable = [...table];
      // Ensure it is structurally sound
      if (!Array.isArray(currentTable[keyHash])) {
        currentTable[keyHash] = [];
      }
      let bucket = [...currentTable[keyHash]];
      setActiveSlotIdx(keyHash);
      highlightLine("chaining", "init");
      setStatus(`Calculating hash slot for ${val}: Slot ${keyHash}`);
      playTone(440, 0.15);
      await sleep(speed);

      let collisionOccurred = bucket.length > 0;
      let alreadyExists = false;

      for (let j = 0; j < bucket.length; j++) {
        if (isCancelledRef.current) return;
        await checkPause();

        setVisitingChainIdx(j);
        highlightLine("chaining", "loop");
        setStatus(`Traversing chain at index ${keyHash}. Checking node value ${bucket[j].value}...`);
        playTone(440, 0.15);
        await sleep(speed);

        if (bucket[j].value === val) {
          alreadyExists = true;
          bucket[j] = { ...bucket[j], state: 'found' };
          setTable(currentTable);
          highlightLine("chaining", "success");
          setStatus(`Value ${val} already exists at index ${keyHash}. Aborting duplicate insertion.`);
          setExecutionLog(prev => [...prev, `[Duplicate] Key ${val} already in hash map.`]);
          playTone(330, 0.25);
          await sleep(speed * 1.5);
          break;
        }
      }

      if (!alreadyExists) {
        if (collisionOccurred) {
          setExecutionLog(prev => [...prev, `[Collision] Slot ${keyHash} is occupied! Appending node to the list chain.`]);
          setCollisionPositions([keyHash]);
          setHashDiagnostic({
            type: "Separate Chaining (List Collision)",
            key: val,
            hash: keyHash,
            status: "Collision Detected",
            step: `Slot ${keyHash} occupied. Appending key ${val} to back of chain list.`
          });
          playTone(280, 0.2);
          await sleep(speed);
        }

        const uniqueId = Math.random().toString(36).substring(2, 9);
        const newNode = { value: val, id: uniqueId, state: 'found' };
        bucket.push(newNode);
        currentTable[keyHash] = bucket;
        setTable(currentTable);
        highlightLine("chaining", "insert");
        setStatus(`Successfully appended key ${val} into slot list chain ${keyHash}.`);
        setExecutionLog(prev => [...prev, `[Success] Inserted ${val} in chain slot ${keyHash}`]);
        playTone(523.25, 0.25);
        await sleep(speed * 1.5);
      }
    } else {
      let currentTable = [...table];
      let foundSpot = -1;
      let collisionTracker = [];

      for (let i = 0; i < tableSize; i++) {
        if (isCancelledRef.current) return;
        await checkPause();

        const offset = getProbeOffset(i, val);
        const probeIdx = (keyHash + offset) % tableSize;
        setActiveSlotIdx(probeIdx);
        highlightLine("probing", "loop");
        setStatus(`Probe sequence step ${i}: Checking slot ${probeIdx} (Base Hash ${keyHash} + Offset ${offset})...`);
        
        if (i > 0) {
          const prevOffset = getProbeOffset(i - 1, val);
          const prevIdx = (keyHash + prevOffset) % tableSize;
          setTraceLines(prev => [...prev, { from: prevIdx, to: probeIdx }]);
        }

        playTone(400 + i * 25, 0.15);
        await sleep(speed * 1.2);

        const slotValue = currentTable[probeIdx];

        if (slotValue === null || slotValue === "DEL") {
          foundSpot = probeIdx;
          highlightLine("probing", "insert");
          currentTable[probeIdx] = val;
          setTable(currentTable);
          setStatus(`Slot ${probeIdx} is free (${slotValue === 'DEL' ? 'Tombstone slot' : 'Empty slot'}). Storing key ${val} here.`);
          setExecutionLog(prev => [...prev, `[Success] Placed key ${val} at slot ${probeIdx} on probe count ${i}`]);
          playTone(523.25, 0.25);
          
          setHashDiagnostic({
            type: `${probingMode.toUpperCase()} Probing Active`,
            key: val,
            hash: keyHash,
            status: "Balanced/Placed",
            step: `Found empty spot at slot ${probeIdx} on probe sequence step ${i}`
          });
          
          await sleep(speed * 1.5);
          break;
        } else if (slotValue === val) {
          setStatus(`Key ${val} is already stored at slot ${probeIdx}. Skipping insert to avoid duplicate.`);
          setExecutionLog(prev => [...prev, `[Duplicate] Key ${val} already in table at index ${probeIdx}`]);
          playTone(330, 0.25);
          await sleep(speed * 1.5);
          foundSpot = -2;
          break;
        } else {
          collisionTracker.push(probeIdx);
          setCollisionPositions([...collisionTracker]);
          setStatus(`Collision at slot ${probeIdx} (occupied by ${slotValue})! Activating re-probe calculation...`);
          setExecutionLog(prev => [...prev, `[Collision] Probe index ${probeIdx} occupied by ${slotValue}`]);
          
          setHashDiagnostic({
            type: `${probingMode.toUpperCase()} Probing Active`,
            key: val,
            hash: keyHash,
            status: "Collision Found",
            step: `Slot ${probeIdx} is occupied. Computing next offset probe...`
          });

          playTone(300, 0.2);
          await sleep(speed * 1.2);
        }
      }

      if (foundSpot === -1) {
        setError("Table Overflow! Hash Table is completely full.");
        setExecutionLog(prev => [...prev, `[Error] Insertion failed. Open addressing table is saturated.`]);
        playTone(200, 0.35);
      }
    }

    cleanup();
  };

  const handleSearch = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setTraceLines([]);
    setCollisionPositions([]);
    setActiveConcept(hashMode);

    const keyHash = val % tableSize;
    setExecutionLog(prev => [...prev, `[Search] Searching for key ${val}. Base slot index: ${keyHash}`]);

    if (hashMode === "chaining") {
      let currentTable = [...table];
      if (!Array.isArray(currentTable[keyHash])) {
        currentTable[keyHash] = [];
      }
      let bucket = [...currentTable[keyHash]];
      setActiveSlotIdx(keyHash);
      setStatus(`Hashing lookup index for key ${val}: Slot ${keyHash}`);
      playTone(440, 0.15);
      await sleep(speed);

      let found = false;
      for (let j = 0; j < bucket.length; j++) {
        if (isCancelledRef.current) return;
        await checkPause();

        setVisitingChainIdx(j);
        setStatus(`Searching chain at slot ${keyHash}. Matching node ${bucket[j].value}...`);
        playTone(440, 0.15);
        await sleep(speed);

        if (bucket[j].value === val) {
          found = true;
          bucket[j] = { ...bucket[j], state: 'found' };
          setTable(currentTable);
          setStatus(`Key ${val} found successfully at bucket slot ${keyHash}, chain offset index ${j}!`);
          setExecutionLog(prev => [...prev, `[Found] Target ${val} located in separate chain index ${keyHash}`]);
          playTone(523.25, 0.3);
          
          setHashDiagnostic({
            type: "Separate Chaining Lookup",
            key: val,
            hash: keyHash,
            status: "Key Found",
            step: `Target located inside slot ${keyHash} list at chain position ${j}`
          });

          await sleep(speed * 1.8);
          break;
        }
      }

      if (!found) {
        setStatus(`Key ${val} is not present in separate chain slot ${keyHash}.`);
        setExecutionLog(prev => [...prev, `[Not Found] Key ${val} is missing.`]);
        playTone(220, 0.3);
        await sleep(speed * 1.5);
      }
    } else {
      let foundIdx = -1;
      let collisionTracker = [];

      for (let i = 0; i < tableSize; i++) {
        if (isCancelledRef.current) return;
        await checkPause();

        const offset = getProbeOffset(i, val);
        const probeIdx = (keyHash + offset) % tableSize;
        setActiveSlotIdx(probeIdx);
        setStatus(`Probe lookup ${i}: Scanning slot ${probeIdx}...`);

        if (i > 0) {
          const prevOffset = getProbeOffset(i - 1, val);
          const prevIdx = (keyHash + prevOffset) % tableSize;
          setTraceLines(prev => [...prev, { from: prevIdx, to: probeIdx }]);
        }

        playTone(400 + i * 25, 0.15);
        await sleep(speed * 1.2);

        const slotValue = table[probeIdx];

        if (slotValue === val) {
          foundIdx = probeIdx;
          setStatus(`Key ${val} successfully found in probed slot ${probeIdx}!`);
          setExecutionLog(prev => [...prev, `[Found] Key ${val} located in probed slot ${probeIdx}`]);
          playTone(523.25, 0.3);
          
          setHashDiagnostic({
            type: `${probingMode.toUpperCase()} Probe Search`,
            key: val,
            hash: keyHash,
            status: "Key Found",
            step: `Target key located in probed slot ${probeIdx} on step count ${i}`
          });

          await sleep(speed * 1.8);
          break;
        } else if (slotValue === null) {
          setStatus(`Hit completely empty slot at index ${probeIdx}. Terminating search sequence.`);
          setExecutionLog(prev => [...prev, `[Not Found] Hit null slot ${probeIdx}. Key ${val} not in hash map.`]);
          playTone(220, 0.3);
          await sleep(speed * 1.5);
          break;
        } else {
          collisionTracker.push(probeIdx);
          setCollisionPositions([...collisionTracker]);
          if (slotValue === "DEL") {
            setStatus(`Slot ${probeIdx} is marked as Tombstone ("DEL"). Jumping past to continue search probe chain...`);
            setExecutionLog(prev => [...prev, `[Skip] Probe slot ${probeIdx} contains tombstone 'DEL'.`]);
          } else {
            setStatus(`Value at slot ${probeIdx} (${slotValue}) doesn't match target key ${val}. Probing onwards...`);
          }
          await sleep(speed);
        }
      }

      if (foundIdx === -1 && isVisualizing) {
        setStatus(`Target key ${val} is not present in the probing table.`);
        playTone(220, 0.3);
      }
    }

    cleanup();
  };

  const handleDelete = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setTraceLines([]);
    setCollisionPositions([]);
    setActiveConcept(hashMode);

    const keyHash = val % tableSize;
    setExecutionLog(prev => [...prev, `[Delete] Requesting removal of key ${val}. Hash index: ${keyHash}`]);

    if (hashMode === "chaining") {
      let currentTable = [...table];
      if (!Array.isArray(currentTable[keyHash])) {
        currentTable[keyHash] = [];
      }
      let bucket = [...currentTable[keyHash]];
      setActiveSlotIdx(keyHash);
      setStatus(`Calculating hash slot for deleting ${val}: Slot ${keyHash}`);
      playTone(440, 0.15);
      await sleep(speed);

      let foundIdx = -1;
      for (let j = 0; j < bucket.length; j++) {
        if (isCancelledRef.current) return;
        await checkPause();

        setVisitingChainIdx(j);
        setStatus(`Checking chain index ${j} in slot ${keyHash} for key ${val}...`);
        playTone(440, 0.15);
        await sleep(speed);

        if (bucket[j].value === val) {
          foundIdx = j;
          bucket[j] = { ...bucket[j], state: 'deleting' };
          currentTable[keyHash] = bucket;
          setTable(currentTable);
          setStatus(`Target found. Visualizing node deletion.`);
          playTone(260, 0.35);
          await sleep(speed * 1.5);
          break;
        }
      }

      if (foundIdx !== -1) {
        bucket.splice(foundIdx, 1);
        currentTable[keyHash] = bucket.map(n => ({ ...n, state: 'default' }));
        setTable(currentTable);
        setStatus(`Key ${val} successfully deleted and list pointers rewired.`);
        setExecutionLog(prev => [...prev, `[Success] Key ${val} removed from separate chain bucket ${keyHash}`]);
        playTone(440, 0.15);
        
        setHashDiagnostic({
          type: "Separate Chaining Truncate",
          key: val,
          hash: keyHash,
          status: "Key Removed",
          step: `Deleted key ${val} and updated slot list pointers dynamically.`
        });

        await sleep(speed);
      } else {
        setStatus(`Deletion aborted. Key ${val} is not present in bucket slot ${keyHash}.`);
        setExecutionLog(prev => [...prev, `[Not Found] Key ${val} is missing.`]);
        playTone(220, 0.35);
        await sleep(speed);
      }
    } else {
      let currentTable = [...table];
      let deletedIdx = -1;
      let collisionTracker = [];

      for (let i = 0; i < tableSize; i++) {
        if (isCancelledRef.current) return;
        await checkPause();

        const offset = getProbeOffset(i, val);
        const probeIdx = (keyHash + offset) % tableSize;
        setActiveSlotIdx(probeIdx);
        setStatus(`Probe lookup ${i}: Scanning slot ${probeIdx} for deletion...`);

        if (i > 0) {
          const prevOffset = getProbeOffset(i - 1, val);
          const prevIdx = (keyHash + prevOffset) % tableSize;
          setTraceLines(prev => [...prev, { from: prevIdx, to: probeIdx }]);
        }

        playTone(400 + i * 25, 0.15);
        await sleep(speed * 1.2);

        const slotValue = currentTable[probeIdx];

        if (slotValue === val) {
          deletedIdx = probeIdx;
          currentTable[probeIdx] = "DEL";
          setTable(currentTable);
          setStatus(`Key ${val} located in probed slot ${probeIdx}. Inserting Tombstone ("DEL") to preserve probing chain integrity.`);
          setExecutionLog(prev => [...prev, `[Deleted] Replaced key ${val} at slot ${probeIdx} with Tombstone 'DEL'`]);
          playTone(261.63, 0.35);
          
          setHashDiagnostic({
            type: `${probingMode.toUpperCase()} Probe Delete`,
            key: val,
            hash: keyHash,
            status: "Key Removed (Tombstone)",
            step: `Key cleared from probed slot ${probeIdx}. Placed DEL tombstone to retain chaining structure.`
          });

          await sleep(speed * 1.8);
          break;
        } else if (slotValue === null) {
          setStatus(`Hit raw empty slot at slot ${probeIdx}. Search chain is broken. Key ${val} does not exist in table.`);
          setExecutionLog(prev => [...prev, `[Not Found] Deletion target ${val} is not present in probed sequence.`]);
          playTone(220, 0.35);
          await sleep(speed * 1.5);
          break;
        } else {
          collisionTracker.push(probeIdx);
          setCollisionPositions([...collisionTracker]);
          if (slotValue === "DEL") {
            setStatus(`Slot ${probeIdx} contains Tombstone ("DEL"). Skipping to search further...`);
          } else {
            setStatus(`Value at probed slot ${probeIdx} is ${slotValue}. Probing further...`);
          }
          await sleep(speed);
        }
      }

      if (deletedIdx === -1 && isVisualizing) {
        setStatus(`Key ${val} not found in the table. Deletion canceled.`);
        playTone(220, 0.35);
      }
    }

    cleanup();
  };

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    pausedRef.current = nextPaused;
    if (nextPaused) {
      setExecutionLog(prev => [...prev, "[System] Hashed visualization paused."]);
    } else {
      setExecutionLog(prev => [...prev, "[System] Resuming visual frames..."]);
    }
  };

  const activeSnippetsSet = codeSnippets[hashMode] || codeSnippets.chaining;
  const currentSnippet = activeSnippetsSet[language] || activeSnippetsSet.python;
  const codeLines = currentSnippet.trim().split('\n');

  const statusColor = status.includes("successful") || status.includes("Found") || status.includes("success") || status.includes("Inserting")
    ? "status-found"
    : status.includes("not found")
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
          <GitFork size={30} style={{ transform: 'rotate(270deg)' }} />
          Hash Table
        </h1>

        <div className="input-group">
          <label>Collision Resolution</label>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
            <button
              onClick={() => { setHashMode("chaining"); handleResetTable(tableSize, "chaining"); }}
              disabled={isVisualizing}
              className={`btn ${hashMode === "chaining" ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '0.75rem' }}
              title="Resolves collisions by maintaining linked lists at each array bucket slot."
            >
              Chaining
            </button>
            <button
              onClick={() => { setHashMode("probing"); handleResetTable(tableSize, "probing"); }}
              disabled={isVisualizing}
              className={`btn ${hashMode === "probing" ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '0.75rem' }}
              title="Resolves collisions by checking alternative slots in the array."
            >
              Open Addressing
            </button>
          </div>
        </div>

        {hashMode === "probing" && (
          <div className="input-group" style={{ animation: 'popIn 0.25s' }}>
            <label>Probing Strategy</label>
            <select
              value={probingMode}
              onChange={(e) => setProbingMode(e.target.value)}
              disabled={isVisualizing}
              className="input-field"
            >
              <option value="linear">Linear Probing (h + i) % m</option>
              <option value="quadratic">Quadratic Probing (h + i²) % m</option>
              <option value="double">Double Hashing (h1 + i * h2) % m</option>
            </select>
            {probingMode === "double" && (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-gray-400)', display: 'block', marginTop: '0.35rem', lineHeight: '1.3' }}>
                Secondary step: h₂(k) = 7 - (k % 7)
              </span>
            )}
          </div>
        )}

        {/* --- Dynamic, Highly Interactive Table Capacity Controller --- */}
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label htmlFor="tableSize" style={{ marginBottom: 0 }}>Table Capacity (M)</label>
            <span style={{
              fontSize: '0.675rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              backgroundColor: isPrimeNumber(tableSize) ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              color: isPrimeNumber(tableSize) ? 'var(--green-400)' : 'var(--yellow-400)',
              border: `1px solid ${isPrimeNumber(tableSize) ? 'var(--green-600)' : 'var(--yellow-600)'}`
            }}>
              {isPrimeNumber(tableSize) ? '✨ PRIME SIZE' : '⚠️ COMPOSITE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <input
              id="tableSizeRange"
              type="range"
              min="3"
              max="20"
              value={tableSize}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTableSize(val);
                handleResetTable(val, hashMode);
              }}
              disabled={isVisualizing}
              className="speed-slider"
              style={{ flex: 1 }}
            />
            <input
              id="tableSize"
              type="number"
              min="3"
              max="20"
              value={tableSize}
              onChange={(e) => {
                const val = Math.max(3, Math.min(20, Number(e.target.value) || 3));
                setTableSize(val);
                handleResetTable(val, hashMode);
              }}
              disabled={isVisualizing}
              className="input-field"
              style={{ width: '4.5rem', padding: '0.4rem 0.5rem', textAlign: 'center', fontSize: '0.95rem' }}
            />
          </div>

          {/* Quick-Set Prime Value Shortcuts */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.4rem' }}>
            {[5, 7, 11, 13, 17, 19].map((prime) => (
              <button
                key={prime}
                onClick={() => {
                  setTableSize(prime);
                  handleResetTable(prime, hashMode);
                }}
                disabled={isVisualizing}
                className={`btn ${tableSize === prime ? 'btn-cyan' : 'btn-secondary'}`}
                style={{
                  flex: 1,
                  padding: '0.15rem 0',
                  fontSize: '0.7rem',
                  borderRadius: '0.25rem',
                  minHeight: '1.5rem'
                }}
                title={`Set capacity size to Prime (${prime})`}
              >
                {prime}
              </button>
            ))}
          </div>

          {/* Probing Warning Trigger */}
          {!isPrimeNumber(tableSize) && hashMode === "probing" && (
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--yellow-400)',
              lineHeight: '1.25',
              backgroundColor: 'rgba(234, 179, 8, 0.05)',
              padding: '0.45rem 0.6rem',
              borderRadius: '0.375rem',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              marginTop: '0.4rem',
              animation: 'popIn 0.2s'
            }}>
              💡 <strong>Probing Alert:</strong> Non-prime sizes like {tableSize} can limit probing cycles. Switch to a Prime size to ensure complete slot accessibility!
            </div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="value">Node Value Key</label>
          <input
            id="value"
            type="text"
            placeholder="e.g., 42"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="actions-single">
          <button onClick={handleInsert} disabled={isVisualizing} className="btn btn-green">Insert Key</button>
        </div>
        <div className="actions-grid">
          <button onClick={handleDelete} disabled={isVisualizing} className="btn btn-red">Delete Key</button>
          <button onClick={handleSearch} disabled={isVisualizing} className="btn btn-cyan">
            <Search size={16} /> Search Table
          </button>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1.25rem 0' }} />

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
            onClick={() => handleResetTable(tableSize, hashMode)}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Reset Table
          </button>
        </div>

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
        
        {/* --- Visualization Canvas Block --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>

          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="visualization-boxes">
            
            {hashDiagnostic && (
              <div className="analyzer-hud-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pink-500)', fontWeight: 'bold', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  <Info size={14} /> Hash Analyzer Active
                </div>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                  Formula: h(k) = k % {tableSize}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.2rem', color: 'var(--text-gray-300)', fontSize: '0.75rem' }}>
                  <span>Target Key:</span><span style={{ color: 'var(--pink-500)', fontWeight: 'bold' }}>{hashDiagnostic.key}</span>
                  <span>Calculated:</span><span style={{ color: 'var(--cyan-400)' }}>Slot {hashDiagnostic.hash}</span>
                  <span>Status:</span><span style={{ color: hashDiagnostic.status.includes('Collision') ? 'var(--red-400)' : 'var(--green-400)' }}>{hashDiagnostic.status}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-gray-700)', marginTop: '0.4rem', paddingTop: '0.4rem', fontSize: '0.725rem', color: 'var(--yellow-400)', fontStyle: 'italic' }}>
                  {hashDiagnostic.step}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0, minHeight: '500px' }}>
                {traceLines.map((line, idx) => {
                  const stepPercent = 100 / tableSize;
                  const fromY = (line.from + 0.5) * stepPercent;
                  const toY = (line.to + 0.5) * stepPercent;
                  const isCollision = collisionPositions.includes(line.to);

                  return (
                    <path
                      key={idx}
                      d={`M 28,${fromY}% Q 10,${(fromY + toY) / 2}% 28,${toY}%`}
                      fill="none"
                      className={isCollision ? "trace-ascent-line" : "trace-descent-line"}
                    />
                  );
                })}
              </svg>

              {Array(tableSize).fill(null).map((_, idx) => {
                const isSlotActive = activeSlotIdx === idx;
                const isCollisionActive = collisionPositions.includes(idx);
                const currentSlotData = table[idx];

                return (
                  <div key={idx} className="hash-slot-row" style={{ zIndex: 1 }}>
                    
                    <div className={`hash-bucket-index ${isSlotActive ? 'active-slot' : ''}`}>
                      [{idx}]
                    </div>

                    {/* Highly safe type-checked layout dispatcher to handle state delays */}
                    {Array.isArray(currentSlotData) ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {currentSlotData.length === 0 ? (
                          <span style={{ color: 'var(--text-gray-500)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                            [EMPTY]
                          </span>
                        ) : (
                          currentSlotData.map((node, cIdx) => {
                            const isNodeVisiting = isSlotActive && visitingChainIdx === cIdx;
                            const customNodeState = isNodeVisiting ? 'visiting' : node.state;

                            return (
                              <React.Fragment key={node.id}>
                                {cIdx > 0 && <div className="hash-chain-connector" />}
                                <div className={`hash-circle-node ${customNodeState || 'default'}`}>
                                  {node.value}
                                </div>
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div>
                        {currentSlotData === null ? (
                          <span style={{ color: 'var(--text-gray-500)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                            [EMPTY]
                          </span>
                        ) : currentSlotData === "DEL" ? (
                          <div className="hash-circle-node tombstone">
                            DEL
                          </div>
                        ) : (
                          <div className={`hash-circle-node ${isSlotActive ? (isCollisionActive ? 'pre-op' : 'found') : 'default'}`}>
                            {currentSlotData}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          </div>
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