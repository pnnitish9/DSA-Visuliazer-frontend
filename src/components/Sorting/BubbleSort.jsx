import React, { useState, useRef, useEffect } from 'react';
import { SortAsc, Pause, Play, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

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

      --purple-500: #a855f7;
      --purple-600: #9333ea;
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

    /* --- Sidebar layout --- */
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

    /* --- Forms & Inputs --- */
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

    .textarea-field {
      resize: vertical;
      min-height: 50px;
      font-family: monospace;
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

    /* --- Custom Action Buttons --- */
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
    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }

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

    /* --- Content Frame --- */
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

    /* --- Visual Canvas --- */
    .visualization-section {
      display: flex;
      flex-direction: column;
      min-height: 250px;
    }
    .status-bar {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 2rem;
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
    .status-sorting { color: var(--yellow-400); }
    .status-sorted { color: var(--green-400); }
    .status-paused { color: var(--yellow-400); }

    .visualization-boxes {
      position: relative;
      flex: 1;
      background-color: rgba(5, 5, 10, 0.4);
      border-radius: 0.5rem;
      min-height: 240px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      padding: 4rem 2rem 4rem 2rem;
    }

    /* --- Stabilized Position Transformers --- */
    .box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition: transform var(--swap-speed, 400ms) cubic-bezier(0.25, 0.8, 0.25, 1);
      transform: translate(0, 0);
    }

    @keyframes popIn {
      from { transform: scale(0.7) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    /* Verbatim green circular pastel aesthetics aligning with preceding files */
    .box {
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, color 0.3s;
      border: 2.5px solid transparent;
      user-select: none;
    }
    .box.default {
      background-color: #e2f0d9;
      border-color: #8cc07e;
      color: #385723;
    }
    .box.comparing {
      background-color: #fef08a; /* Yellow */
      border-color: #ca8a04;
      color: #854d0e;
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
    }
    .box.swapping {
      background-color: #fed7aa; /* Orange */
      border-color: #ea580c;
      color: #7c2d12;
      box-shadow: 0 0 15px rgba(249, 115, 22, 0.5);
    }
    .box.sorted {
      background-color: #4ade80; /* Green */
      border-color: #16a34a;
      color: white;
      opacity: 0.95;
    }

    .box-index {
      margin-top: 0.4rem;
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--text-gray-400);
      font-weight: bold;
    }

    /* --- Complexity HUD Diagnostic Cards --- */
    .complexity-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .complexity-card {
      background-color: var(--bg-dark-800);
      border: 1.5px solid var(--border-gray-700);
      border-radius: 0.5rem;
      padding: 0.6rem 0.85rem;
      transition: all 0.3s ease;
      position: relative;
    }
    .complexity-card.active-best {
      border-color: var(--green-500);
      background-color: rgba(34, 197, 94, 0.08);
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.25);
    }
    .complexity-card.active-avg {
      border-color: var(--cyan-500);
      background-color: rgba(14, 165, 233, 0.08);
      box-shadow: 0 0 12px rgba(14, 165, 233, 0.25);
    }
    .complexity-card.active-worst {
      border-color: var(--orange-500);
      background-color: rgba(249, 115, 22, 0.08);
      box-shadow: 0 0 12px rgba(249, 115, 22, 0.25);
    }
    .complexity-label {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-gray-400);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .complexity-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: white;
      margin: 0.15rem 0;
    }
    .complexity-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-family: monospace;
      color: var(--cyan-400);
      font-weight: bold;
    }

    /* --- Sidebar Stat metrics tracker --- */
    .metric-stats-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      background-color: rgba(15, 23, 42, 0.4);
      padding: 0.6rem;
      border-radius: 0.375rem;
      border: 1px solid var(--border-gray-700);
      margin-bottom: 0.85rem;
    }
    .metric-stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .metric-stat-val {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--cyan-400);
      font-family: monospace;
    }
    .metric-stat-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-gray-400);
      font-weight: 600;
    }

    /* --- Multi-Pane Log & Code Split --- */
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
  python: `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            # Comparing adjacent elements
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
  `.trim(),
  cpp: `
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // Comparing adjacent elements
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
  `.trim(),
  java: `
public void bubbleSort(int[] arr) {
    n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // Comparing adjacent elements
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
  `.trim(),
  javascript: `
function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Comparing adjacent elements
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
  `.trim()
};

/* Precise Multi-Language line highlight mappings to match steps exactly */
const LINE_MAPS = {
  python: { outer_loop: 3, swapped_init: 4, inner_loop: 5, compare: 7, swap: 8, early_break: 10 },
  cpp: { outer_loop: 2, swapped_init: 3, inner_loop: 4, compare: 6, swap: 7, early_break: 11 },
  java: { outer_loop: 3, swapped_init: 4, inner_loop: 5, compare: 7, swap: 8, early_break: 14 },
  javascript: { outer_loop: 3, swapped_init: 4, inner_loop: 5, compare: 7, swap: 8, early_break: 12 }
};

export default function BubbleSortVisualizer() {
  const [arrayStr, setArrayStr] = useState("8, 3, 1, 6, 4, 10, 2");
  const [randomSize, setRandomSize] = useState(8);
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(1000);

  // Core Visual State Tracking
  const [boxes, setBoxes] = useState([]);
  const [status, setStatus] = useState("Ready. Specify elements, then press Sort.");
  const [executionLog, setExecutionLog] = useState(["[System] Sandbox loaded. Hashing inputs."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [error, setError] = useState(null);

  // Time-frame Pre-computed Simulation states
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [simulationSteps, setSimulationSteps] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Live HUD metrics
  const [liveComparisons, setLiveComparisons] = useState(0);
  const [liveSwaps, setLiveSwaps] = useState(0);
  const [evaluatedCase, setEvaluatedCase] = useState(null); // 'best' | 'avg' | 'worst'

  const timerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  /* STREAMING_CHUNK: Initializing rich box state models... */
  // Clean initial boxes render on parameter updates
  useEffect(() => {
    if (!isVisualizing) {
      const arr = validateAndParse();
      if (arr) {
        setBoxes(arr.map((v, idx) => ({
          value: v,
          state: 'default',
          id: `node-${idx}-${v}-${Math.random()}`,
          initialIdx: idx,
          currentIdx: idx,
          translateX: '0rem',
          translateY: '0rem'
        })));
        setEvaluatedCase(null);
        setLiveComparisons(0);
        setLiveSwaps(0);
      }
    }
  }, [arrayStr, isVisualizing]);

  /* Control Playback state effects */
  useEffect(() => {
    if (isPlaying) {
      isPlayingRef.current = true;
      runAutoPlayback();
    } else {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, simulationSteps]);

  const validateAndParse = () => {
    setError(null);
    const arr = arrayStr
      .split(/[, ]+/)
      .map(Number)
      .filter((num) => !isNaN(num));

    if (!arr.length) {
      setError("Array cannot be empty.");
      return null;
    }

    if (arr.length > 25) {
      setError("Maximum limit is 25 elements for visualization clarity.");
      return null;
    }

    return arr;
  };

  /* STREAMING_CHUNK: Compiling absolute positioning simulation frames for straight swap tracks... */
  const buildSimulationSteps = (richBoxes) => {
    const steps = [];
    let initialLog = ["[Simulation] Compiling Bubble Sort state frames..."];

    let comparisonsCount = 0;
    let swapsCount = 0;
    let n = richBoxes.length;

    // Use a physical working list that gets modified during sorting passes to track index shifts
    let workingArray = richBoxes.map((b, idx) => ({
      ...b,
      initialIdx: idx,
      currentIdx: idx,
      state: 'default'
    }));

    // Helper map of visual translations tied uniquely to unchanging DOM order
    const generateFrameBoxes = (stateModifierFn) => {
      workingArray.forEach((node, currentPos) => {
        node.currentIdx = currentPos;
      });

      return richBoxes.map((originalNode) => {
        const activeNode = workingArray.find(b => b.id === originalNode.id);
        
        let state = activeNode.state;
        let translateX = (activeNode.currentIdx - activeNode.initialIdx) * 5.0; // center-to-center standard distance (3.5rem + 1.5rem gap)
        let translateY = 0;

        if (stateModifierFn) {
          const overrides = stateModifierFn(activeNode);
          if (overrides) {
            if (overrides.state !== undefined) state = overrides.state;
            if (overrides.translateX !== undefined) translateX = overrides.translateX;
            if (overrides.translateY !== undefined) translateY = overrides.translateY;
          }
        }

        return {
          ...originalNode,
          state,
          currentIdx: activeNode.currentIdx,
          translateX: `${translateX}rem`,
          translateY: `${translateY}rem`
        };
      });
    };

    // Step 0: Initial Frame
    steps.push({
      boxes: generateFrameBoxes(),
      status: `Initializing Bubble Sort workflow. Total elements: ${n}`,
      log: [...initialLog, `[Init] Process started with array: [${workingArray.map(b => b.value).join(', ')}]`],
      lineKey: 'outer_loop',
      comparisons: 0,
      swaps: 0,
      matchedCase: null
    });

    for (let i = 0; i < n; i++) {
      let swapped = false;
      const passLog = [...steps[steps.length - 1].log];

      // Outer Loop Entry Frame
      steps.push({
        boxes: generateFrameBoxes((node) => {
          if (node.currentIdx >= n - i) {
            return { state: 'sorted' };
          }
          return { state: 'default' };
        }),
        status: `Outer Loop iteration i = ${i}. Setting swapped = false.`,
        log: [...passLog, `[Pass ${i + 1}] Commencing inner comparisons scans.`],
        lineKey: 'swapped_init',
        comparisons: comparisonsCount,
        swaps: swapsCount,
        matchedCase: null
      });

      for (let j = 0; j < n - i - 1; j++) {
        const compareLog = [...steps[steps.length - 1].log];

        // 1. Comparison Highlight Frame
        comparisonsCount++;
        steps.push({
          boxes: generateFrameBoxes((node) => {
            if (node.currentIdx >= n - i) {
              return { state: 'sorted' };
            }
            if (node.currentIdx === j || node.currentIdx === j + 1) {
              return { state: 'comparing' };
            }
            return { state: 'default' };
          }),
          status: `Comparing index ${j} (${workingArray[j].value}) and index ${j + 1} (${workingArray[j + 1].value}).`,
          log: [...compareLog, `[Compare] Checking if ${workingArray[j].value} > ${workingArray[j+1].value}`],
          lineKey: 'compare',
          comparisons: comparisonsCount,
          swaps: swapsCount,
          matchedCase: null
        });

        if (workingArray[j].value > workingArray[j + 1].value) {
          swapped = true;
          swapsCount++;
          const swapLog = [...steps[steps.length - 1].log];

          // 2. Parallel Horizontal Straight Swap Tracks Frame (image_3a26c0.png)
          steps.push({
            boxes: generateFrameBoxes((node) => {
              if (node.currentIdx >= n - i) {
                return { state: 'sorted' };
              }
              // Left node moves right on upper track pointing right
              if (node.currentIdx === j) {
                return {
                  state: 'swapping',
                  translateX: (j + 1 - node.initialIdx) * 5.0,
                  translateY: -0.4
                };
              }
              // Right node moves left on lower track pointing left
              if (node.currentIdx === j + 1) {
                return {
                  state: 'swapping',
                  translateX: (j - node.initialIdx) * 5.0,
                  translateY: 0.4
                };
              }
              return { state: 'default' };
            }),
            status: `Swapping values: Node ${workingArray[j].value} slides right on upper track, and Node ${workingArray[j + 1].value} slides left on lower track parallelly.`,
            log: [...swapLog, `[Swap] Swapping values: ${workingArray[j].value} <-> ${workingArray[j+1].value}`],
            lineKey: 'swap',
            comparisons: comparisonsCount,
            swaps: swapsCount,
            matchedCase: null
          });

          // Physically swap within coordinate memory
          let temp = workingArray[j];
          workingArray[j] = workingArray[j + 1];
          workingArray[j + 1] = temp;

          // 3. Post-Swap Frame (Align coordinates with standard center line)
          steps.push({
            boxes: generateFrameBoxes((node) => {
              if (node.currentIdx >= n - i) {
                return { state: 'sorted' };
              }
              if (node.currentIdx === j || node.currentIdx === j + 1) {
                return { state: 'swapping' };
              }
              return { state: 'default' };
            }),
            status: `Coordinates synchronized cleanly. No layout blinking.`,
            log: [...swapLog, `[Swap Resolved] Physical elements swapped inside memory matrix.`],
            lineKey: 'inner_loop',
            comparisons: comparisonsCount,
            swaps: swapsCount,
            matchedCase: null
          });

        } else {
          // No swap frame
          steps.push({
            boxes: generateFrameBoxes((node) => {
              if (node.currentIdx >= n - i) {
                return { state: 'sorted' };
              }
              if (node.currentIdx === j || node.currentIdx === j + 1) {
                return { state: 'comparing' };
              }
              return { state: 'default' };
            }),
            status: `No swap needed: ${workingArray[j].value} is not greater than ${workingArray[j+1].value}.`,
            log: [...compareLog, `[No Swap] Condition false. Skipping swap logic.`],
            lineKey: 'inner_loop',
            comparisons: comparisonsCount,
            swaps: swapsCount,
            matchedCase: null
          });
        }
      }

      // Mark bubble-end element as sorted
      let finalSortedIdx = n - i - 1;
      workingArray[finalSortedIdx].state = 'sorted';

      steps.push({
        boxes: generateFrameBoxes((node) => {
          if (node.currentIdx >= finalSortedIdx) {
            return { state: 'sorted' };
          }
          return { state: 'default' };
        }),
        status: `Pass completed. Element ${workingArray[finalSortedIdx].value} placed at terminal sorted index.`,
        log: [...steps[steps.length - 1].log, `[Pass Completed] element ${workingArray[finalSortedIdx].value} guaranteed sorted.`],
        lineKey: 'outer_loop',
        comparisons: comparisonsCount,
        swaps: swapsCount,
        matchedCase: null
      });

      if (!swapped) {
        // Optimization: Early termination triggered
        steps.push({
          boxes: generateFrameBoxes(() => ({ state: 'sorted' })),
          status: "Early exit! Zero swaps executed in this pass. Array is fully sorted.",
          log: [...steps[steps.length - 1].log, `[Optimization Trigger] Early exit executed. Array already sorted.`],
          lineKey: 'early_break',
          comparisons: comparisonsCount,
          swaps: swapsCount,
          matchedCase: 'best'
        });
        break;
      }
    }

    // Standard complete frame
    let finalLog = [...steps[steps.length - 1].log, `[Complete] Sort finished successfully.`];
    let finalCase = 'avg';
    if (swapsCount === 0) finalCase = 'best';
    else if (swapsCount === (n * (n - 1)) / 2) finalCase = 'worst';

    steps.push({
      boxes: generateFrameBoxes(() => ({ state: 'sorted' })),
      status: "Sorting finalized! All elements resolved into ascending order.",
      log: finalLog,
      lineKey: 'done',
      comparisons: comparisonsCount,
      swaps: swapsCount,
      matchedCase: finalCase
    });

    return steps;
  };

  /* PLAYBACK CONTROLLERS */
  const runAutoPlayback = async () => {
    if (currentStepIdx < simulationSteps.length - 1) {
      timerRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          applyStepFrame(currentStepIdx + 1);
        }
      }, speed);
    } else {
      setIsPlaying(false);
    }
  };

  const applyStepFrame = (idx) => {
    if (idx < 0 || idx >= simulationSteps.length) return;

    const frame = simulationSteps[idx];
    setBoxes(frame.boxes);
    setStatus(frame.status);
    setExecutionLog(frame.log);
    setLiveComparisons(frame.comparisons);
    setLiveSwaps(frame.swaps);
    if (frame.matchedCase) {
      setEvaluatedCase(frame.matchedCase);
    }

    // Syncing code-tracker highlight
    const key = frame.lineKey;
    const mapping = LINE_MAPS[language];
    if (mapping && mapping[key]) {
      setHighlightLineNum(mapping[key]);
    } else {
      setHighlightLineNum(-1);
    }

    setCurrentStepIdx(idx);
  };

  const handleStartSort = () => {
    const arr = validateAndParse();
    if (!arr) return;

    const richBoxes = arr.map((v, idx) => ({
      value: v,
      state: 'default',
      id: `node-${idx}-${v}-${Math.random()}`,
      initialIdx: idx,
      currentIdx: idx,
      translateX: '0rem',
      translateY: '0rem'
    }));

    const steps = buildSimulationSteps(richBoxes);
    setSimulationSteps(steps);
    setIsVisualizing(true);
    setCurrentStepIdx(0);
    setEvaluatedCase(null);
    setIsPlaying(true);
  };

  const handleNextStep = () => {
    if (!isVisualizing) {
      const arr = validateAndParse();
      if (!arr) return;
      const richBoxes = arr.map((v, idx) => ({
        value: v,
        state: 'default',
        id: `node-${idx}-${v}-${Math.random()}`,
        initialIdx: idx,
        currentIdx: idx,
        translateX: '0rem',
        translateY: '0rem'
      }));
      const steps = buildSimulationSteps(richBoxes);
      setSimulationSteps(steps);
      setIsVisualizing(true);
      applyStepFrame(0);
    } else {
      setIsPlaying(false); 
      if (currentStepIdx < simulationSteps.length - 1) {
        applyStepFrame(currentStepIdx + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (!isVisualizing || currentStepIdx === 0) return;
    setIsPlaying(false);
    applyStepFrame(currentStepIdx - 1);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setIsVisualizing(false);
    setCurrentStepIdx(0);
    setHighlightLineNum(-1);
    setEvaluatedCase(null);
    setLiveComparisons(0);
    setLiveSwaps(0);
    setError(null);

    const arr = validateAndParse();
    if (arr) {
      setBoxes(arr.map((v, idx) => ({
        value: v,
        state: 'default',
        id: `node-${idx}-${v}-${Math.random()}`,
        initialIdx: idx,
        currentIdx: idx,
        translateX: '0rem',
        translateY: '0rem'
      })));
      setExecutionLog(["[System] Canvas reset. Press Sort to run compilation."]);
      setStatus("Ready.");
    }
  };

  const handleGenerateRandom = (mode = 'normal') => {
    if (isVisualizing) handleReset();

    const size = Math.max(3, Math.min(25, randomSize));
    let arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);

    if (mode === 'sorted') {
      arr = [...arr].sort((a, b) => a - b);
    } else if (mode === 'reverse') {
      arr = [...arr].sort((a, b) => b - a);
    }

    setArrayStr(arr.join(", "));
    setError(null);
    setBoxes(arr.map((v, idx) => ({
      value: v,
      state: 'default',
      id: `node-${idx}-${v}-${Math.random()}`,
      initialIdx: idx,
      currentIdx: idx,
      translateX: '0rem',
      translateY: '0rem'
    })));
    setExecutionLog([`[System] Generated ${arr.length} elements. Mode: ${mode.toUpperCase()}`]);
    setStatus("Random elements ready.");
  };

  const codeLines = codeSnippets[language].trim().split('\n');
  const statusColor = status.includes("finalized") || status.includes("complete")
    ? "status-sorted"
    : status.includes("Swapping") || status.includes("Comparing")
    ? "status-sorting"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  // Force render boxes sorted by their stable initial rendering index to completely bypass DOM relocation jumps
  const stableRenderedBoxes = [...boxes].sort((a, b) => a.initialIdx - b.initialIdx);

  return (
    <div className="visualizer-container">
      <InjectedStyles />

      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <SortAsc size={30} />
          Bubble Sort
        </h1>

        {/* Real-time Metric Displays */}
        <div className="metric-stats-bar">
          <div className="metric-stat-item">
            <span className="metric-stat-val">{liveComparisons}</span>
            <span className="metric-stat-label">Comparisons</span>
          </div>
          <div className="metric-stat-item">
            <span className="metric-stat-val">{liveSwaps}</span>
            <span className="metric-stat-label">Swaps</span>
          </div>
        </div>

        {/* Input parameters */}
        <div className="input-group">
          <label htmlFor="array">Array Elements</label>
          <textarea
            id="array"
            placeholder="e.g., 8, 3, 1, 6"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isVisualizing}
            rows="2"
            className="input-field textarea-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Dynamic Capacity List Generator */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '0.375rem',
          padding: '0.75rem',
          border: '1px solid var(--border-gray-700)',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--cyan-400)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Array Generator
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-gray-300)' }}>Capacity:</span>
            <input
              type="range"
              min="3"
              max="25"
              value={randomSize}
              onChange={(e) => setRandomSize(Number(e.target.value))}
              disabled={isVisualizing}
              className="speed-slider"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.8rem', width: '1.5rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--cyan-400)' }}>
              {randomSize}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => handleGenerateRandom('normal')}
              disabled={isVisualizing}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.35rem 0', minHeight: '1.75rem', fontSize: '0.7rem' }}
              title="Generate random unsorted array"
            >
              🎲 Random
            </button>
            <button
              onClick={() => handleGenerateRandom('sorted')}
              disabled={isVisualizing}
              className="btn btn-purple"
              style={{ flex: 1, padding: '0.35rem 0', minHeight: '1.75rem', fontSize: '0.7rem' }}
              title="Generate sorted array (Ideal for Best Case tests)"
            >
              ✨ Best
            </button>
          </div>
        </div>

        {/* Primary controllers */}
        <div className="actions-single">
          <button
            onClick={handleStartSort}
            className="btn btn-green"
          >
            <SortAsc size={18} /> Sort Array
          </button>
        </div>
        <div className="actions-grid">
          <button
            onClick={handlePrevStep}
            disabled={!isVisualizing || currentStepIdx === 0}
            className="btn btn-secondary"
            title="Step Backward"
          >
            <ArrowLeft size={16} /> Prev
          </button>
          <button
            onClick={handleNextStep}
            disabled={isVisualizing && currentStepIdx === simulationSteps.length - 1}
            className="btn btn-cyan"
            title="Step Forward"
          >
            Next <ArrowRight size={16} />
          </button>
        </div>

        <div className="actions-grid">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!isVisualizing}
            className={`btn ${isPlaying ? 'btn-pause' : 'btn-resume'}`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} /> Reset
          </button>
        </div>

        {/* Configurations */}
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
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="speed">Playback Speed</label>
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

      {/* --- Main Content workspace --- */}
      <main className="main-content">
        
        {/* --- Visual Element Grid --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>

          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="visualization-boxes">
            {stableRenderedBoxes.length === 0 ? (
              <span style={{ color: 'var(--text-gray-500)', fontSize: '0.9rem' }}>
                Provide inputs to display elements on the board.
              </span>
            ) : (
              stableRenderedBoxes.map((box) => {
                // Ensure dynamic transform durations cleanly match user selected play speeds
                const customSwapSpeed = `${speed * 0.45}ms`;
                const styleObj = {
                  '--swap-speed': customSwapSpeed,
                  transform: `translate(${box.translateX || '0rem'}, ${box.translateY || '0rem'})`
                };

                return (
                  <div
                    key={box.id}
                    className="box-wrapper"
                    style={styleObj}
                  >
                    <div className={`box ${box.state}`}>
                      {box.value}
                    </div>
                    {/* Index tags update live reflecting logical coordinates */}
                    <span className="box-index">[{box.currentIdx}]</span>
                  </div>
                );
              })
            )}
          </div>

          {/* --- Interactive Complexity Case Diagnostics --- */}
          <div className="complexity-cards-grid">
            
            <div className={`complexity-card ${evaluatedCase === 'best' ? 'active-best' : ''}`}>
              <div className="complexity-label">Bubble Sort</div>
              <div className="complexity-title">Best Case</div>
              <div className="complexity-badge">O(n)</div>
              {evaluatedCase === 'best' && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', fontSize: '0.6rem', padding: '1px 4px', background: 'var(--green-600)', borderRadius: '3px', fontWeight: 'bold' }}>ACTIVE</span>
              )}
            </div>

            <div className={`complexity-card ${evaluatedCase === 'avg' ? 'active-avg' : ''}`}>
              <div className="complexity-label">Bubble Sort</div>
              <div className="complexity-title">Average Case</div>
              <div className="complexity-badge">O(n²)</div>
              {evaluatedCase === 'avg' && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', fontSize: '0.6rem', padding: '1px 4px', background: 'var(--cyan-600)', borderRadius: '3px', fontWeight: 'bold' }}>ACTIVE</span>
              )}
            </div>

            <div className={`complexity-card ${evaluatedCase === 'worst' ? 'active-worst' : ''}`}>
              <div className="complexity-label">Bubble Sort</div>
              <div className="complexity-title">Worst Case</div>
              <div className="complexity-badge">O(n²)</div>
              {evaluatedCase === 'worst' && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', fontSize: '0.6rem', padding: '1px 4px', background: 'var(--orange-600)', borderRadius: '3px', fontWeight: 'bold' }}>ACTIVE</span>
              )}
            </div>

            <div className="complexity-card">
              <div className="complexity-label">Auxiliary Space</div>
              <div className="complexity-title">Memory</div>
              <div className="complexity-badge">O(1)</div>
            </div>

          </div>
        </section>

        {/* --- Log & Tracer Splits --- */}
        <div className="lower-content-area">
          
          <section className="code-section">
            <h2 className="section-title">Code Tracker</h2>
            <div className="code-block">
              <pre>
                <code>
                  {codeLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`code-line
                        ${highlightLineNum === (idx + 1) ? 'highlight' : ''}
                        ${(line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('def ') || line.trim().startsWith('function ')) ? 'comment' : ''}
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