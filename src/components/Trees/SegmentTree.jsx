import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Plus, Zap, ArrowRight, SkipBack, SkipForward, RotateCcw, Activity, Code, Settings } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      /* Competitive Programming Dark Theme */
      --bg-dark-950: #0a0e17;
      --bg-dark-900: #111827;
      --bg-dark-800: #1e293b;
      --bg-dark-700: #334155;
      --bg-dark-600: #475569;
      
      --text-gray-100: #f1f5f9;
      --text-gray-200: #e2e8f0;
      --text-gray-300: #cbd5e1;
      --text-gray-400: #94a3b8;
      
      --border-gray-600: #475569;
      --border-gray-700: #334155;

      /* Highlights */
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
      --orange-400: #fb923c;
      --orange-500: #f97316;
    }

    .visualizer-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow-x: hidden;
    }
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; height: 100vh; overflow: hidden; }
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
      .controls-sidebar { width: 300px; min-width: 300px; height: 100vh; }
    }

    .sidebar-title {
      font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--cyan-400); display: flex; align-items: center; gap: 0.5rem; letter-spacing: -0.02em;
    }

    /* Forms & Inputs */
    .input-group { margin-bottom: 1rem; }
    .input-group label {
      display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-gray-400); text-transform: uppercase; letter-spacing: 0.05em;
    }
    .input-field {
      width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); transition: all 0.2s; font-size: 0.85rem; font-family: 'Fira Code', monospace;
    }
    .input-field:focus { outline: none; border-color: var(--cyan-500); box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .row-flex { display: flex; gap: 0.5rem; align-items: center; }
    
    /* Buttons */
    .btn {
      padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%;
    }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
    .btn:active:not(:disabled) { transform: scale(0.98); }

    .btn-cyan { background-color: var(--cyan-500); color: #000; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-400); }
    .btn-purple { background-color: var(--purple-500); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-400); }
    .btn-green { background-color: var(--green-500); color: #000; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-400); }
    .btn-red { background-color: var(--red-500); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-400); }
    .btn-secondary { background-color: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-600); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-600); }

    /* Action Panels */
    .action-panel {
      background: rgba(255,255,255,0.03); border: 1px solid var(--border-gray-700); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;
    }
    .panel-header { font-size: 0.75rem; color: var(--cyan-400); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; }

    /* Playback Controls */
    .playback-panel {
      background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--cyan-500); margin-bottom: 1rem;
    }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--cyan-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--cyan-400); border-color: var(--cyan-500); }
    .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    /* Main Area */
    .main-content {
      flex: 1; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; height: 100vh; overflow-y: auto; background-color: var(--bg-dark-950);
    }
    
    .status-bar {
      padding: 0.75rem 1rem; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center;
    }
    .status-text { font-family: 'Fira Code', monospace; font-size: 0.9rem; color: var(--cyan-400); }
    
    /* Tree Canvas */
    .tree-canvas-wrapper {
      flex: 3; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; min-height: 400px; display: flex; flex-direction: column; overflow: auto;
    }
    .tree-canvas { flex: 1; position: relative; width: 100%; height: 100%; }
    
    /* SVG Edges */
    .edge { transition: stroke 0.3s, stroke-width 0.3s; fill: none; }
    .edge.default { stroke: var(--border-gray-700); stroke-width: 2; }
    .edge.visiting { stroke: var(--yellow-500); stroke-width: 3; stroke-dasharray: 6,4; animation: travel 1s linear infinite; }
    .edge.returning { stroke: var(--cyan-500); stroke-width: 3; }
    .edge.partial { stroke: var(--orange-500); stroke-width: 3; }
    @keyframes travel { to { stroke-dashoffset: -20; } }

    /* Tree Node */
    .st-node {
      position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-dark-800); border: 2px solid var(--border-gray-600); border-radius: 0.5rem; padding: 0.25rem 0.5rem; min-width: 60px; font-family: 'Fira Code', monospace; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
    }
    .st-node-range { font-size: 0.6rem; color: var(--text-gray-400); margin-bottom: 0.1rem; }
    .st-node-val { font-size: 0.95rem; font-weight: 700; color: var(--text-gray-100); }
    .st-node-lazy { position: absolute; top: -10px; right: -10px; background: var(--purple-500); color: white; font-size: 0.65rem; font-weight: bold; padding: 0.1rem 0.4rem; border-radius: 999px; border: 2px solid var(--bg-dark-900); animation: pulse 2s infinite; }
    
    /* Node States */
    .st-node.uninitialized { border-style: dashed; opacity: 0.6; }
    .st-node-val.uninitialized { color: var(--text-gray-500); }
    .st-node.visiting { border-color: var(--yellow-500); background: rgba(234, 179, 8, 0.1); transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 15px rgba(234, 179, 8, 0.4); z-index: 5; }
    .st-node.overlap-full { border-color: var(--green-500); background: rgba(34, 197, 94, 0.15); transform: translate(-50%, -50%) scale(1.15); box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); z-index: 5; }
    .st-node.overlap-partial { border-color: var(--orange-500); background: rgba(249, 115, 22, 0.1); }
    .st-node.out-of-bounds { border-color: var(--red-500); opacity: 0.6; background: rgba(239, 68, 68, 0.05); }
    .st-node.returning { border-color: var(--cyan-400); background: rgba(6, 182, 212, 0.15); box-shadow: 0 0 15px rgba(6, 182, 212, 0.5); }
    .st-node.lazy-prop { border-color: var(--purple-500); background: rgba(168, 85, 247, 0.2); transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 15px rgba(168, 85, 247, 0.6); z-index: 6;}

    /* Base Array Display */
    .base-array-container {
      display: block; height: 85px; background: var(--bg-dark-950); border-top: 1px solid var(--border-gray-700); position: relative; z-index: 3; width: 100%;
    }
    .array-cell-wrapper { display: flex; flex-direction: column; align-items: center; width: 45px; position: absolute; transform: translateX(-50%); top: 12px; }
    .array-idx { font-size: 0.65rem; color: var(--text-gray-400); margin-bottom: 0.2rem; font-family: 'Fira Code', monospace; }
    .array-cell {
      width: 100%; height: 40px; display: flex; justify-content: center; align-items: center; background: var(--bg-dark-800); border: 2px solid var(--border-gray-600); border-radius: 0.375rem; font-family: 'Fira Code', monospace; font-weight: 700; font-size: 0.9rem; transition: all 0.3s;
    }
    .array-cell.active { border-color: var(--cyan-400); background: rgba(6,182,212,0.1); transform: translateY(-3px); box-shadow: 0 4px 10px rgba(6,182,212,0.3); }

    /* Bottom Row: Code & Logs */
    .bottom-row { display: flex; flex-direction: column; gap: 1rem; flex: 2; min-height: 250px; }
    @media (min-width: 1024px) { .bottom-row { flex-direction: row; } }

    .panel-box {
      flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden;
    }
    .panel-box-header {
      padding: 0.5rem 1rem; background: var(--bg-dark-900); border-bottom: 1px solid var(--border-gray-700); font-size: 0.8rem; font-weight: 700; color: var(--text-gray-300); text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;
    }
    
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.5; margin: 0; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; transition: background 0.2s; white-space: pre; }
    .code-line.highlight { background: rgba(6, 182, 212, 0.2); border-left: 3px solid var(--cyan-400); color: white; }
    .code-line.comment { color: var(--text-gray-500); font-style: italic; }
    .code-line.keyword { color: var(--purple-400); }
    .code-line.func { color: var(--cyan-400); }

    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; list-style: none; margin: 0; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); line-height: 1.4; }
    .log-item.active { background: var(--bg-dark-700); color: var(--cyan-400); border-radius: 0.25rem; border-left: 2px solid var(--cyan-400); }
    .log-item:last-child { border-bottom: none; }
  `}</style>
);

const cppCode = `
// Segment Tree (C++ Competitive Programming Template)
const int MAXN = 100005;
int tree[4 * MAXN], lazy[4 * MAXN], arr[MAXN];

void push(int node, int L, int R) {
    if (lazy[node] != 0) {
        tree[node] += lazy[node] * (R - L + 1); // For Sum
        if (L != R) {
            lazy[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
        }
        lazy[node] = 0;
    }
}

void build(int node, int L, int R) {
    if (L == R) {
        tree[node] = arr[L];
        return;
    }
    int mid = (L + R) / 2;
    build(2 * node, L, mid);
    build(2 * node + 1, mid + 1, R);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}

void update(int node, int L, int R, int qL, int qR, int val) {
    push(node, L, R);
    if (qL > R || qR < L) return; // Out of bounds
    if (qL <= L && R <= qR) { // Full overlap
        lazy[node] += val;
        push(node, L, R);
        return;
    }
    int mid = (L + R) / 2;
    update(2 * node, L, mid, qL, qR, val);
    update(2 * node + 1, mid + 1, R, qL, qR, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}

int query(int node, int L, int R, int qL, int qR) {
    push(node, L, R);
    if (qL > R || qR < L) return 0; // Null value
    if (qL <= L && R <= qR) return tree[node]; // Full overlap
    
    int mid = (L + R) / 2;
    int leftAns = query(2 * node, L, mid, qL, qR);
    int rightAns = query(2 * node + 1, mid + 1, R, qL, qR);
    return leftAns + rightAns;
}
`.trim().split('\n');

const LINE_MAP = {
  push: { check: 4, apply: 6, propagate: 8, clear: 11 },
  build: { baseCheck: 16, baseSet: 17, recursive: 21, merge: 23 },
  update: { push: 27, outOfBounds: 28, fullOverlapCheck: 29, fullOverlapApply: 30, recursive: 35, merge: 37 },
  query: { push: 41, outOfBounds: 42, fullOverlap: 43, recursive: 46, merge: 48 }
};

// Math utilities
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
const NULL_VALUES = { sum: 0, min: Infinity, max: -Infinity, gcd: 0, xor: 0 };

const applyOperation = (a, b, type) => {
  if (a === null || a === undefined || a === '?') return b;
  if (b === null || b === undefined || b === '?') return a;
  switch (type) {
    case 'sum': return a + b;
    case 'min': return Math.min(a, b);
    case 'max': return Math.max(a, b);
    case 'gcd': return gcd(a, b);
    case 'xor': return a ^ b;
    default: return a + b;
  }
};

export default function SegmentTreeVisualizer() {
  const [arrayInput, setArrayInput] = useState("5, 2, 7, 3, 4, 1, 8, 6");
  const [baseArray, setBaseArray] = useState([5, 2, 7, 3, 4, 1, 8, 6]);
  const [treeType, setTreeType] = useState('sum');
  
  // Forms
  const [pointIdx, setPointIdx] = useState("3");
  const [pointVal, setPointVal] = useState("10");
  const [queryL, setQueryL] = useState("1");
  const [queryR, setQueryR] = useState("5");
  const [updL, setUpdL] = useState("1");
  const [updR, setUpdR] = useState("4");
  const [updVal, setUpdVal] = useState("5");

  // Playback & Frames
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const logEndRef = useRef(null);
  
  const MAX_ELEMENTS = 16;

  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIndex(prev => prev + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames.length, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  const runSimulation = (operationType) => {
    let currentArray = [...baseArray];
    const N = currentArray.length;
    let st = Array(4 * N + 1).fill(null).map(() => ({ val: '?', lazy: 0, L: 0, R: 0, exists: false }));
    
    let simFrames = [];
    let logs = [];
    
    // Helper to deeply copy tree state for a frame
    const captureFrame = (line, msg, nodeStates, edgeStates, highlightArr = []) => {
      logs.push(msg);
      simFrames.push({
        tree: st.map(n => ({ ...n })),
        array: [...currentArray],
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        highlightArr: [...highlightArr],
        line,
        logMsg: msg,
        logs: [...logs]
      });
    };

    // Pre-calculate L and R for all nodes via a dummy build
    const initTreeLimits = (node, L, R) => {
      st[node] = { val: '?', lazy: 0, L, R, exists: true };
      if (L === R) return;
      const mid = Math.floor((L + R) / 2);
      initTreeLimits(2 * node, L, mid);
      initTreeLimits(2 * node + 1, mid + 1, R);
    };
    initTreeLimits(1, 0, N - 1);

    // Engine variables for tracking UI states during recursion
    let nState = {};
    let eState = {};

    // 1. PUSH DOWN (Lazy Prop)
    const push = (node, L, R) => {
      if (st[node].lazy !== 0) {
        captureFrame(LINE_MAP.push.check, `Node [${L}, ${R}] has lazy value ${st[node].lazy}. Propagating...`, nState, eState);
        
        let lazyVal = st[node].lazy;
        nState[node] = 'lazy-prop';
        
        if (treeType === 'sum') {
           st[node].val += lazyVal * (R - L + 1);
        } else if (treeType === 'min' || treeType === 'max') {
           st[node].val += lazyVal;
        } else if (treeType === 'xor') {
           st[node].val ^= ((R - L + 1) % 2 !== 0 ? lazyVal : 0);
        }
        
        captureFrame(LINE_MAP.push.apply, `Applied lazy value to Node [${L}, ${R}]. New val: ${st[node].val}`, nState, eState);
        
        if (L !== R) {
          st[2 * node].lazy += lazyVal;
          st[2 * node + 1].lazy += lazyVal;
          captureFrame(LINE_MAP.push.propagate, `Passed lazy value ${lazyVal} down to children.`, nState, eState);
        }
        
        st[node].lazy = 0;
        nState[node] = 'visiting'; // revert visual
        captureFrame(LINE_MAP.push.clear, `Cleared lazy value at Node [${L}, ${R}].`, nState, eState);
      }
    };

    // 2. BUILD
    const build = (node, L, R) => {
      nState[node] = 'visiting';
      if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'visiting';
      
      captureFrame(LINE_MAP.build.baseCheck, `Visiting Node [${L}, ${R}]. Checking base case.`, nState, eState);
      
      if (L === R) {
        st[node].val = currentArray[L];
        nState[node] = 'overlap-full';
        captureFrame(LINE_MAP.build.baseSet, `Leaf reached. Setting Node [${L}, ${L}] = Array[${L}] = ${currentArray[L]}`, nState, eState, [L]);
        nState[node] = 'default';
        if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'returning';
        return;
      }
      
      const mid = Math.floor((L + R) / 2);
      captureFrame(LINE_MAP.build.recursive, `Dividing range [${L}, ${R}] at ${mid}.`, nState, eState);
      
      build(2 * node, L, mid);
      eState[`${node}-${2*node}`] = 'default'; // Clean up left edge returning state
      
      build(2 * node + 1, mid + 1, R);
      
      nState[node] = 'returning';
      st[node].val = applyOperation(st[2 * node].val, st[2 * node + 1].val, treeType);
      
      eState[`${node}-${2*node}`] = 'returning';
      eState[`${node}-${2*node+1}`] = 'returning';
      if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'returning';
      
      captureFrame(LINE_MAP.build.merge, `Merged children to update Node [${L}, ${R}]. Value = ${st[node].val}`, nState, eState);
      
      nState[node] = 'default';
      eState[`${node}-${2*node}`] = 'default';
      eState[`${node}-${2*node+1}`] = 'default';
    };

    // 3. RANGE UPDATE
    const update = (node, L, R, qL, qR, val) => {
      nState[node] = 'visiting';
      if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'visiting';
      captureFrame(LINE_MAP.update.push, `Updating Node [${L}, ${R}] for query [${qL}, ${qR}]. Checking pending lazy...`, nState, eState);
      
      push(node, L, R);

      captureFrame(LINE_MAP.update.outOfBounds, `Checking bounds overlap...`, nState, eState);
      if (qL > R || qR < L) {
        nState[node] = 'out-of-bounds';
        captureFrame(LINE_MAP.update.outOfBounds, `Node [${L}, ${R}] is completely outside [${qL}, ${qR}]. Aborting branch.`, nState, eState);
        nState[node] = 'default';
        if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'default';
        return;
      }

      captureFrame(LINE_MAP.update.fullOverlapCheck, `Checking full overlap...`, nState, eState);
      if (qL <= L && R <= qR) {
        nState[node] = 'overlap-full';
        st[node].lazy += val;
        captureFrame(LINE_MAP.update.fullOverlapApply, `Node [${L}, ${R}] is fully inside [${qL}, ${qR}]. Added ${val} to lazy. Propagating immediately.`, nState, eState);
        push(node, L, R); // Apply immediately to current node
        
        nState[node] = 'default';
        if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'returning';
        return;
      }

      nState[node] = 'overlap-partial';
      const mid = Math.floor((L + R) / 2);
      captureFrame(LINE_MAP.update.recursive, `Partial overlap. Splitting at ${mid}.`, nState, eState);
      
      let pState = { ...nState }; // Save state for visual consistency
      
      update(2 * node, L, mid, qL, qR, val);
      nState = { ...pState }; // Restore after left recursion
      update(2 * node + 1, mid + 1, R, qL, qR, val);
      
      nState[node] = 'returning';
      st[node].val = applyOperation(st[2 * node].val, st[2 * node + 1].val, treeType);
      
      eState[`${node}-${2*node}`] = 'returning';
      eState[`${node}-${2*node+1}`] = 'returning';
      captureFrame(LINE_MAP.update.merge, `Rebuilding Node [${L}, ${R}] from children. New val = ${st[node].val}`, nState, eState);
      
      nState[node] = 'default';
      eState[`${node}-${2*node}`] = 'default';
      eState[`${node}-${2*node+1}`] = 'default';
      if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'returning';
    };

    // 4. RANGE QUERY
    const query = (node, L, R, qL, qR) => {
      nState[node] = 'visiting';
      if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'visiting';
      
      captureFrame(LINE_MAP.query.push, `Querying Node [${L}, ${R}]. Applying pending lazy updates if any...`, nState, eState);
      push(node, L, R);

      captureFrame(LINE_MAP.query.outOfBounds, `Checking bounds...`, nState, eState);
      if (qL > R || qR < L) {
        nState[node] = 'out-of-bounds';
        captureFrame(LINE_MAP.query.outOfBounds, `Out of bounds. Returning null value (${NULL_VALUES[treeType]}).`, nState, eState);
        nState[node] = 'default';
        if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'default';
        return NULL_VALUES[treeType];
      }

      captureFrame(LINE_MAP.query.fullOverlap, `Checking full overlap...`, nState, eState);
      if (qL <= L && R <= qR) {
        nState[node] = 'overlap-full';
        captureFrame(LINE_MAP.query.fullOverlap, `Full overlap! Returning value ${st[node].val}.`, nState, eState);
        nState[node] = 'default';
        if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'returning';
        return st[node].val;
      }

      nState[node] = 'overlap-partial';
      const mid = Math.floor((L + R) / 2);
      captureFrame(LINE_MAP.query.recursive, `Partial overlap. Branching to children...`, nState, eState);
      
      let pState = { ...nState };
      let leftAns = query(2 * node, L, mid, qL, qR);
      nState = { ...pState };
      let rightAns = query(2 * node + 1, mid + 1, R, qL, qR);
      
      nState[node] = 'returning';
      let merged = applyOperation(leftAns, rightAns, treeType);
      
      eState[`${node}-${2*node}`] = 'returning';
      eState[`${node}-${2*node+1}`] = 'returning';
      captureFrame(LINE_MAP.query.merge, `Merged answers from children: ${leftAns} & ${rightAns} -> ${merged}. Returning...`, nState, eState);
      
      nState[node] = 'default';
      eState[`${node}-${2*node}`] = 'default';
      eState[`${node}-${2*node+1}`] = 'default';
      if (node > 1) eState[`${Math.floor(node/2)}-${node}`] = 'returning';
      
      return merged;
    };

    // Execution Trigger
    if (operationType === 'build') {
      // Build requires a fresh tree mapping
      st = Array(4 * N + 1).fill(null).map(() => ({ val: '?', lazy: 0, L: 0, R: 0, exists: false }));
      initTreeLimits(1, 0, N - 1);
      build(1, 0, N - 1);
      captureFrame(-1, `Build Complete! Segment tree is ready.`, {}, {});
    } else {
      // For updates/queries, we need to pre-build instantly without animation
      buildSilently(1, 0, N - 1, st, currentArray);
      
      if (operationType === 'update_pt') {
        const idx = parseInt(pointIdx), val = parseInt(pointVal);
        currentArray[idx] = val; // Also update base array for visual consistency later
        update(1, 0, N - 1, idx, idx, val);
        captureFrame(-1, `Point Update Complete!`, {}, {});
      } else if (operationType === 'update_rng') {
        const ql = parseInt(updL), qr = parseInt(updR), val = parseInt(updVal);
        update(1, 0, N - 1, ql, qr, val);
        captureFrame(-1, `Range Update (Lazy) Complete!`, {}, {});
      } else if (operationType === 'query') {
        const ql = parseInt(queryL), qr = parseInt(queryR);
        let ans = query(1, 0, N - 1, ql, qr);
        captureFrame(-1, `Query Complete! Final Answer for Range [${ql}, ${qr}] = ${ans}`, {}, {});
      }
    }

    setFrames(simFrames);
    setFrameIndex(0);
    setIsPlaying(true);
  };

  const buildSilently = (node, L, R, tr, arr) => {
    tr[node].L = L; tr[node].R = R; tr[node].exists = true;
    if (L === R) { tr[node].val = arr[L]; return; }
    const mid = Math.floor((L + R) / 2);
    buildSilently(2 * node, L, mid, tr, arr);
    buildSilently(2 * node + 1, mid + 1, R, tr, arr);
    tr[node].val = applyOperation(tr[2 * node].val, tr[2 * node + 1].val, treeType);
  };

  const handleLoadArray = () => {
    const arr = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length === 0 || arr.length > MAX_ELEMENTS) return alert(`Please enter between 1 and ${MAX_ELEMENTS} valid numbers.`);
    setBaseArray(arr);
    setFrames([]); setFrameIndex(-1); setIsPlaying(false);
  };

  const currFrame = frames[frameIdx] || { 
    tree: [], array: baseArray, nodeStates: {}, edgeStates: {}, highlightArr: [], line: -1, logMsg: 'Ready to build or query.', logs: [] 
  };

  // Tree Visual Layout Calculation
  const N = currFrame.array.length;
  const MAX_DEPTH = Math.ceil(Math.log2(N)) + 1;
  const ROW_HEIGHT = 80;
  const minCanvasHeight = MAX_DEPTH * ROW_HEIGHT + 40;
  const minCanvasWidth = Math.max(100, N * 65);
  
  // To draw correctly, X position is based on the midpoint of the range [L, R]
  const getNodePos = (L, R, depth) => {
    const leftX = (L / N) * 100;
    const rightX = ((R + 1) / N) * 100;
    return { x: (leftX + rightX) / 2, y: depth * ROW_HEIGHT + 40 };
  };

  // Generate Renderable Nodes and Edges
  let renderNodes = [];
  let renderEdges = [];
  
  const computeRenderTree = (node, L, R, depth) => {
    if (L > R) return;
    const pos = getNodePos(L, R, depth);
    const data = currFrame.tree[node];
    if (data && data.exists) {
        renderNodes.push({ id: node, L, R, pos, data, state: currFrame.nodeStates[node] || 'default' });
        
        if (L !== R) {
            const mid = Math.floor((L + R) / 2);
            const leftPos = getNodePos(L, mid, depth + 1);
            const rightPos = getNodePos(mid + 1, R, depth + 1);
            
            // Check if children actually exist/were explored
            if (currFrame.tree[2*node] && currFrame.tree[2*node].exists) {
                renderEdges.push({ 
                    key: `${node}-${2*node}`, x1: pos.x, y1: pos.y, x2: leftPos.x, y2: leftPos.y, 
                    state: currFrame.edgeStates[`${node}-${2*node}`] || 'default' 
                });
                computeRenderTree(2 * node, L, mid, depth + 1);
            }
            if (currFrame.tree[2*node+1] && currFrame.tree[2*node+1].exists) {
                renderEdges.push({ 
                    key: `${node}-${2*node+1}`, x1: pos.x, y1: pos.y, x2: rightPos.x, y2: rightPos.y, 
                    state: currFrame.edgeStates[`${node}-${2*node+1}`] || 'default' 
                });
                computeRenderTree(2 * node + 1, mid + 1, R, depth + 1);
            }
        }
    }
  };
  
  if (frames.length > 0) computeRenderTree(1, 0, N - 1, 0);

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><Zap size={20} /> Segment Tree</h1>
        
        <div className="playback-panel">
          <div className="panel-header" style={{margin:0}}>Time Travel Controls</div>
          <input type="range" className="slider" min="-1" max={frames.length > 0 ? frames.length - 1 : 0} value={frameIdx} onChange={e => { setFrameIndex(Number(e.target.value)); setIsPlaying(false); }} disabled={frames.length === 0} />
          <div className="player-controls">
            <button className="ctrl-btn" onClick={() => {setFrameIndex(-1); setIsPlaying(false);}} disabled={frameIdx <= -1}><RotateCcw size={16}/></button>
            <button className="ctrl-btn" onClick={() => {setFrameIndex(p => p - 1); setIsPlaying(false);}} disabled={frameIdx <= 0}><SkipBack size={16}/></button>
            <button className="ctrl-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={frames.length === 0 || frameIdx === frames.length - 1}>
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button className="ctrl-btn" onClick={() => {setFrameIndex(p => p + 1); setIsPlaying(false);}} disabled={frames.length === 0 || frameIdx >= frames.length - 1}><SkipForward size={16}/></button>
          </div>
          <div className="row-flex" style={{marginTop: '0.75rem', justifyContent: 'space-between'}}>
             <span style={{fontSize:'0.65rem', color:'var(--text-gray-400)'}}>SPEED: {speed}ms</span>
             <input type="range" min="50" max="1500" step="50" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{width:'60%'}} />
          </div>
        </div>

        <div className="action-panel">
          <div className="panel-header">Array Setup</div>
          <div className="input-group">
            <input type="text" value={arrayInput} onChange={e => setArrayInput(e.target.value)} className="input-field" disabled={isPlaying} />
          </div>
          <div className="input-group" style={{marginBottom: '0.5rem'}}>
            <select value={treeType} onChange={e => {setTreeType(e.target.value); setFrames([]);}} className="input-field" disabled={isPlaying}>
              <option value="sum">Range Sum</option>
              <option value="min">Range Minimum</option>
              <option value="max">Range Maximum</option>
              <option value="gcd">Range GCD</option>
              <option value="xor">Range XOR</option>
            </select>
          </div>
          <div className="row-flex">
             <button className="btn btn-secondary" onClick={handleLoadArray} disabled={isPlaying}>Load</button>
             <button className="btn btn-cyan" onClick={() => runSimulation('build')} disabled={isPlaying}>Build Tree</button>
          </div>
        </div>

        <div className="action-panel">
          <div className="panel-header">Range Query</div>
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="number" min="0" max={N-1} placeholder="L" value={queryL} onChange={e => setQueryL(e.target.value)} className="input-field" disabled={isPlaying}/>
            <input type="number" min="0" max={N-1} placeholder="R" value={queryR} onChange={e => setQueryR(e.target.value)} className="input-field" disabled={isPlaying}/>
          </div>
          <button className="btn btn-green" onClick={() => runSimulation('query')} disabled={isPlaying}>Execute Query</button>
        </div>

        <div className="action-panel">
          <div className="panel-header">Point Update</div>
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="number" min="0" max={N-1} placeholder="Idx" value={pointIdx} onChange={e => setPointIdx(e.target.value)} className="input-field" disabled={isPlaying}/>
            <input type="number" placeholder="Val" value={pointVal} onChange={e => setPointVal(e.target.value)} className="input-field" disabled={isPlaying}/>
          </div>
          <button className="btn btn-purple" onClick={() => runSimulation('update_pt')} disabled={isPlaying}>Update Point</button>
        </div>
        
        {['sum', 'min', 'max', 'xor'].includes(treeType) && (
        <div className="action-panel" style={{border: '1px dashed var(--purple-500)'}}>
          <div className="panel-header" style={{color: 'var(--purple-400)'}}>Lazy Range Update</div>
          <div className="row-flex" style={{marginBottom: '0.5rem'}}>
            <input type="number" min="0" max={N-1} placeholder="L" value={updL} onChange={e => setUpdL(e.target.value)} className="input-field" disabled={isPlaying}/>
            <input type="number" min="0" max={N-1} placeholder="R" value={updR} onChange={e => setUpdR(e.target.value)} className="input-field" disabled={isPlaying}/>
            <input type="number" placeholder="+Val" value={updVal} onChange={e => setUpdVal(e.target.value)} className="input-field" disabled={isPlaying}/>
          </div>
          <button className="btn btn-purple" onClick={() => runSimulation('update_rng')} disabled={isPlaying}>Add to Range (Lazy)</button>
        </div>
        )}
      </aside>

      {}
      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
          <span style={{fontSize:'0.75rem', color:'var(--text-gray-500)'}}>OP: {treeType.toUpperCase()} | N = {N}</span>
        </div>

        <div className="tree-canvas-wrapper" style={{ overflow: 'auto' }}>
          <div style={{ minWidth: `${Math.max(800, minCanvasWidth)}px`, display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '2rem' }}>
            <div className="tree-canvas" style={{ minHeight: `${minCanvasHeight}px`, position: 'relative' }}>
              {}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', minHeight: `${minCanvasHeight}px` }}>
                {renderEdges.map(edge => (
                  <line
                    key={edge.key}
                    x1={`${edge.x1}%`}
                    y1={edge.y1}
                    x2={`${edge.x2}%`}
                    y2={edge.y2}
                    className={`edge ${edge.state}`}
                  />
                ))}
              </svg>
              
              {}
              {renderNodes.map(n => (
                <div key={n.id} className={`st-node ${n.state} ${n.data.val === '?' ? 'uninitialized' : ''}`} style={{ left: `${n.pos.x}%`, top: `${n.pos.y}px` }}>
                  <span className="st-node-range">[{n.L},{n.R}]</span>
                  <span className={`st-node-val ${n.data.val === '?' ? 'uninitialized' : ''}`}>{n.data.val}</span>
                  {n.data.lazy !== 0 && <div className="st-node-lazy">L:{n.data.lazy}</div>}
                </div>
              ))}
              {frames.length === 0 && <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'var(--text-gray-600)'}}>No data to display. Generate a tree.</div>}
            </div>
            
            {}
            <div className="base-array-container" style={{ width: '100%', marginTop: '1rem' }}>
              {currFrame.array.map((val, idx) => {
                const isActive = currFrame.highlightArr.includes(idx);
                const cellCenter = ((idx + 0.5) / N) * 100;
                return (
                  <div key={idx} className="array-cell-wrapper" style={{ left: `${cellCenter}%` }}>
                    <span className="array-idx">{idx}</span>
                    <div className={`array-cell ${isActive ? 'active' : ''}`}>{val}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row: Code & Logs */}
        <div className="bottom-row">
          <div className="panel-box">
             <div className="panel-box-header"><Code size={14}/> C++ Logic Tracker</div>
              <pre className="code-content">
                {cppCode.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlight = currFrame.line === lineNum;
                  
                  // Simple syntax highlighting classes
                  let styleClass = '';
                  if (line.includes('//')) styleClass = 'comment';
                  else if (line.match(/(void|int)\s+\w+\(/)) styleClass = 'func';
                  else if (line.match(/(if|else|return|const)/)) styleClass = 'keyword';
                  
                  return (
                    <span key={idx} className={`code-line ${isHighlight ? 'highlight' : ''} ${styleClass}`}>
                      {line || ' '}
                    </span>
                  );
                })}
              </pre>
          </div>
          
          <div className="panel-box">
             <div className="panel-box-header"><Settings size={14}/> Execution Trace</div>
             <ul className="log-content">
               {frames.length === 0 && <li className="log-item">Awaiting execution...</li>}
               {currFrame.logs.map((log, idx) => (
                 <li key={idx} className={`log-item ${idx === currFrame.logs.length - 1 ? 'active' : ''}`}>
                   <span style={{color:'var(--text-gray-600)', marginRight:'0.5rem'}}>[{idx}]</span> {log}
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