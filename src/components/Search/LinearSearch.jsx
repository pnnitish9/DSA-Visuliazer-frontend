import React, { useState, useRef, useEffect } from 'react';
import { Search, Pause, Play, RefreshCw, Shuffle, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';

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

    /* --- Sidebar styling matching Image_ed7203 layout --- */
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

    /* --- Form and Input components --- */
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

    /* --- High quality buttons matching theme standards --- */
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

    /* --- Content Pane Framework --- */
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

    /* --- Interactive array containers and status blocks --- */
    .visualization-section {
      display: flex;
      flex-direction: column;
      min-height: 250px;
    }
    .status-bar {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1.25rem;
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
      min-height: 180px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1.25rem;
      padding: 2rem;
    }

    .box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: scale(0.7); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Green pastel circular style nodes aligning with Image_eed3d6.png structure */
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
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      border: 2.5px solid transparent;
      user-select: none;
    }
    .box.default {
      background-color: #e2f0d9;
      border-color: #8cc07e;
      color: #385723;
    }
    .box.visiting {
      background-color: #fef08a;
      border-color: #ca8a04;
      color: #854d0e;
      transform: scale(1.15);
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
    }
    .box.found {
      background-color: #4ade80;
      border-color: #16a34a;
      color: white;
      transform: scale(1.2);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
    }
    .box.visited {
      background-color: #f3f4f6;
      border-color: #d1d5db;
      color: #9ca3af;
      opacity: 0.65;
      transform: scale(0.95);
    }

    .box-index {
      margin-top: 0.4rem;
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--text-gray-400);
      font-weight: bold;
    }

    /* --- Interactive Complexity HUD Cards --- */
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

    /* --- Sidebar stat metric tracker panel --- */
    .metric-stats-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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

    /* --- Code and execution log split layout --- */
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
def linear_search(arr, target):
    for i in range(len(arr)):
        # Checking current element
        if arr[i] == target:
            # Target found
            return i
    # Target not found
    return -1
  `.trim(),
  cpp: `
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        // Checking current element
        if (arr[i] == target) {
            // Target found
            return i;
        }
    }
    // Target not found
    return -1;
}
  `.trim(),
  java: `
public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        // Checking current element
        if (arr[i] == target) {
            // Target found
            return i;
        }
    }
    // Target not found
    return -1;
}
  `.trim(),
  javascript: `
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        // Checking current element
        if (arr[i] === target) {
            // Target found
            return i;
        }
    }
    // Target not found
    return -1;
}
  `.trim()
};

/* Maps current execution state to specific line indices of multi-language snippets */
const LINE_MAPS = {
  python: { init: 1, loop: 2, checking: 4, found: 6, not_found: 8 },
  cpp: { init: 1, loop: 2, checking: 4, found: 6, not_found: 10 },
  java: { init: 1, loop: 2, checking: 4, found: 6, not_found: 10 },
  javascript: { init: 1, loop: 2, checking: 4, found: 6, not_found: 10 }
};

/* Helper sleep routine for automatic stepping */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LinearSearchVisualizer() {
  const [arrayStr, setArrayStr] = useState("12, 45, 8, 23, 19, 31, 5, 42");
  const [targetStr, setTargetStr] = useState("19");
  const [randomSize, setRandomSize] = useState(10);
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  
  // Custom step metrics and simulation state machines
  const [boxes, setBoxes] = useState([]);
  const [status, setStatus] = useState("Ready. Enter custom values or specify size and generate elements.");
  const [executionLog, setExecutionLog] = useState(["[System] Visualizer loaded. Press Search or manual Next Step."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [error, setError] = useState(null);

  // Active step indices
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [simulationSteps, setSimulationSteps] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Live Metric Panel indicators
  const [liveIterations, setLiveIterations] = useState(0);
  const [liveComparisons, setLiveComparisons] = useState(0);
  const [livePasses, setLivePasses] = useState(0);
  const [evaluatedCase, setEvaluatedCase] = useState(null); // 'best' | 'avg' | 'worst' | null

  // References for handling async looping cycles safely
  const timerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const logContainerRef = useRef(null);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  // Clean initial boxes configuration on startup or change
  useEffect(() => {
    if (!isVisualizing) {
      const parsed = validateAndParse();
      if (parsed) {
        setBoxes(parsed.arr.map(val => ({ value: val, state: 'default' })));
        setEvaluatedCase(null);
        setLiveIterations(0);
        setLiveComparisons(0);
        setLivePasses(0);
      }
    }
  }, [arrayStr, isVisualizing]);

  /* Loop step visual playback handler */
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
      setError("Please specify a valid, non-empty list of numeric values.");
      return null;
    }

    const targetVal = Number(targetStr);
    if (isNaN(targetVal)) {
      setError("Please enter a valid numeric target value.");
      return null;
    }

    return { arr, targetVal };
  };

  const buildSimulationSteps = (arr, target) => {
    const steps = [];
    let initialLog = ["[Simulation] Building search frame indices..."];
    
    // Step 0: Initialization Frame
    steps.push({
      boxes: arr.map(val => ({ value: val, state: 'default' })),
      status: `Initializing linear scan for target ${target}...`,
      log: [...initialLog, `[Init] Searching for target: ${target} in array of length ${arr.length}.`],
      lineKey: 'init',
      iterations: 0,
      comparisons: 0,
      passes: 1,
      matchedCase: null
    });

    let foundIdx = -1;
    let comparisonsCount = 0;

    for (let i = 0; i < arr.length; i++) {
      comparisonsCount++;
      const currentVal = arr[i];

      // Frame A: Target checking/visiting comparison frame
      const currentLog = [...steps[steps.length - 1].log, `[Step ${i}] Visiting index ${i} (Value: ${currentVal})`];
      steps.push({
        boxes: arr.map((val, idx) => {
          if (idx === i) return { value: val, state: 'visiting' };
          if (idx < i) return { value: val, state: 'visited' };
          return { value: val, state: 'default' };
        }),
        status: `Checking index ${i} (Value: ${currentVal}): does it equal target ${target}?`,
        log: currentLog,
        lineKey: 'checking',
        iterations: i + 1,
        comparisons: comparisonsCount,
        passes: 1,
        matchedCase: null
      });

      // Frame B: Decision frame
      if (currentVal === target) {
        foundIdx = i;
        const successLog = [...currentLog, `[Success] Target ${target} verified matching index ${i}!`];
        
        let caseType = 'avg';
        if (i === 0) caseType = 'best';
        else if (i === arr.length - 1) caseType = 'worst';

        steps.push({
          boxes: arr.map((val, idx) => {
            if (idx === i) return { value: val, state: 'found' };
            if (idx < i) return { value: val, state: 'visited' };
            return { value: val, state: 'default' };
          }),
          status: `Match found! Value ${currentVal} at index ${i} matches target.`,
          log: successLog,
          lineKey: 'found',
          iterations: i + 1,
          comparisons: comparisonsCount,
          passes: 1,
          matchedCase: caseType
        });
        break;
      } else {
        // Frame C: Visited mismatch update
        const mismatchLog = [...currentLog, `[Mismatch] Value ${currentVal} != ${target}. Continuing search.`];
        steps.push({
          boxes: arr.map((val, idx) => {
            if (idx <= i) return { value: val, state: 'visited' };
            return { value: val, state: 'default' };
          }),
          status: `Index ${i} (${currentVal}) does not match target. Stepping to next index...`,
          log: mismatchLog,
          lineKey: 'loop',
          iterations: i + 1,
          comparisons: comparisonsCount,
          passes: 1,
          matchedCase: null
        });
      }
    }

    // Step Final: Target missing completely frame
    if (foundIdx === -1) {
      const finalLog = [...steps[steps.length - 1].log, `[Completed] Scan complete. Target not found.`];
      steps.push({
        boxes: arr.map(val => ({ value: val, state: 'visited' })),
        status: `Search complete. Target value ${target} is missing from the list.`,
        log: finalLog,
        lineKey: 'not_found',
        iterations: arr.length,
        comparisons: comparisonsCount,
        passes: 1,
        matchedCase: 'worst'
      });
    }

    return steps;
  };

  /* Playback control loop sequence */
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
    setLiveIterations(frame.iterations);
    setLiveComparisons(frame.comparisons);
    setLivePasses(frame.passes);
    if (frame.matchedCase) {
      setEvaluatedCase(frame.matchedCase);
    }

    // Highlighting multi-language code lines accurately
    const lineKey = frame.lineKey;
    const mapping = LINE_MAPS[language];
    if (mapping && mapping[lineKey]) {
      setHighlightLineNum(mapping[lineKey]);
    } else {
      setHighlightLineNum(-1);
    }

    setCurrentStepIdx(idx);
  };

  /* Triggers and starts the simulation sequence builder */
  const handleStartSearch = () => {
    const parsed = validateAndParse();
    if (!parsed) return;

    const { arr, targetVal } = parsed;
    const steps = buildSimulationSteps(arr, targetVal);

    setSimulationSteps(steps);
    setIsVisualizing(true);
    setCurrentStepIdx(0);
    setEvaluatedCase(null);
    applyStepFrame(0);

    // Auto trigger playback
    setIsPlaying(true);
  };

  const handleNextStep = () => {
    if (!isVisualizing) {
      // Build simulation frames first if not run before
      const parsed = validateAndParse();
      if (!parsed) return;
      const steps = buildSimulationSteps(parsed.arr, parsed.targetVal);
      setSimulationSteps(steps);
      setIsVisualizing(true);
      applyStepFrame(0);
    } else {
      setIsPlaying(false); // Stop auto playing on manual trigger
      if (currentStepIdx < simulationSteps.length - 1) {
        applyStepFrame(currentStepIdx + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (!isVisualizing || currentStepIdx === 0) return;
    setIsPlaying(false); // Stop autoplay
    applyStepFrame(currentStepIdx - 1);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setIsVisualizing(false);
    setCurrentStepIdx(0);
    setHighlightLineNum(-1);
    setEvaluatedCase(null);
    setLiveIterations(0);
    setLiveComparisons(0);
    setLivePasses(0);
    setError(null);
    
    const parsed = validateAndParse();
    if (parsed) {
      setBoxes(parsed.arr.map(val => ({ value: val, state: 'default' })));
      setExecutionLog(["[System] Canvas reset. Press Search to begin scanning."]);
      setStatus("Ready.");
    }
  };

  const handleGenerateRandom = (mode = 'normal') => {
    if (isVisualizing) handleReset();

    const size = Math.max(3, Math.min(25, randomSize));
    const generated = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    
    let target = Math.floor(Math.random() * 99) + 1;
    if (mode === 'guaranteed') {
      // Choose an element present in the array
      target = generated[Math.floor(Math.random() * generated.length)];
    } else if (mode === 'missing') {
      // Ensure target isn't anywhere in generated list
      while (generated.includes(target)) {
        target = Math.floor(Math.random() * 99) + 1;
      }
    }

    setArrayStr(generated.join(", "));
    setTargetStr(String(target));
    setError(null);
    setBoxes(generated.map(val => ({ value: val, state: 'default' })));
    setExecutionLog([`[System] Generated ${size} elements. Mode: ${mode.toUpperCase()}. target: ${target}`]);
    setStatus("Random array ready.");
  };

  const codeLines = codeSnippets[language].trim().split('\n');
  const statusColor = status.includes("Match found") || status.includes("successful")
    ? "status-found"
    : status.includes("missing") || status.includes("not found")
    ? "status-not-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles />

      {/* --- Left Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <Search size={30} />
          Linear Search
        </h1>

        {/* Dynamic Metric Display Panels */}
        <div className="metric-stats-bar">
          <div className="metric-stat-item">
            <span className="metric-stat-val">{liveIterations}</span>
            <span className="metric-stat-label">Iterations</span>
          </div>
          <div className="metric-stat-item">
            <span className="metric-stat-val">{liveComparisons}</span>
            <span className="metric-stat-label">Comparisons</span>
          </div>
          <div className="metric-stat-item">
            <span className="metric-stat-val">{livePasses}</span>
            <span className="metric-stat-label">Passes</span>
          </div>
        </div>

        {/* Input specifications */}
        <div className="input-group">
          <label htmlFor="array">Array elements</label>
          <textarea
            id="array"
            placeholder="e.g., 5, 12, 3, 8"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isVisualizing}
            rows="2"
            className="input-field textarea-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="target">Target Value</label>
          <input
            id="target"
            type="text"
            placeholder="e.g., 8"
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Dynamic Custom Generator Panel */}
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
              style={{ flex: 1, fontSize: '0.7rem', padding: '0.35rem 0' }}
              title="Generate a completely random target value"
            >
              🎲 Random Target
            </button>
            <button
              onClick={() => handleGenerateRandom('guaranteed')}
              disabled={isVisualizing}
              className="btn btn-purple"
              style={{ flex: 1, fontSize: '0.7rem', padding: '0.35rem 0' }}
              title="Ensure target value exists in array"
            >
              ✨ Guaranteed Match
            </button>
          </div>
        </div>

        {/* Step Visualizer Controllers */}
        <div className="actions-single">
          <button
            onClick={handleStartSearch}
            className="btn btn-green"
          >
            <Search size={18} /> Run Auto Search
          </button>
        </div>

        {/* PREV, NEXT, PAUSE, RESET Controls */}
        <div className="actions-grid">
          <button
            onClick={handlePrevStep}
            disabled={!isVisualizing || currentStepIdx === 0}
            className="btn btn-secondary"
            title="Step Back"
          >
            <ArrowLeft size={16} /> Prev Step
          </button>

          <button
            onClick={handleNextStep}
            disabled={isVisualizing && currentStepIdx === simulationSteps.length - 1}
            className="btn btn-cyan"
            title="Step Forward"
          >
            Next Step <ArrowRight size={16} />
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

        {/* Lang specifications */}
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

      {/* --- Main Contents Panel --- */}
      <main className="main-content">
        
        {/* --- Visual Array Display Canvas --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>

          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="visualization-boxes">
            {boxes.length === 0 ? (
              <span style={{ color: 'var(--text-gray-500)', fontSize: '0.9rem' }}>
                Specify an array to paint elements on the canvas.
              </span>
            ) : (
              boxes.map((box, idx) => (
                <div key={idx} className="box-wrapper">
                  <div className={`box ${box.state}`}>
                    {box.value}
                  </div>
                  <span className="box-index">[{idx}]</span>
                </div>
              ))
            )}
          </div>

          {/* --- Interactive Complexity and Case Diagnostic Cards --- */}
          <div className="complexity-cards-grid">
            
            <div className={`complexity-card ${evaluatedCase === 'best' ? 'active-best' : ''}`}>
              <div className="complexity-label">Linear Search</div>
              <div className="complexity-title">Best Case</div>
              <div className="complexity-badge">O(1)</div>
              {evaluatedCase === 'best' && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', fontSize: '0.6rem', padding: '1px 4px', background: 'var(--green-600)', borderRadius: '3px', fontWeight: 'bold' }}>ACTIVE</span>
              )}
            </div>

            <div className={`complexity-card ${evaluatedCase === 'avg' ? 'active-avg' : ''}`}>
              <div className="complexity-label">Linear Search</div>
              <div className="complexity-title">Average Case</div>
              <div className="complexity-badge">O(n)</div>
              {evaluatedCase === 'avg' && (
                <span style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', fontSize: '0.6rem', padding: '1px 4px', background: 'var(--cyan-600)', borderRadius: '3px', fontWeight: 'bold' }}>ACTIVE</span>
              )}
            </div>

            <div className={`complexity-card ${evaluatedCase === 'worst' ? 'active-worst' : ''}`}>
              <div className="complexity-label">Linear Search</div>
              <div className="complexity-title">Worst Case</div>
              <div className="complexity-badge">O(n)</div>
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

        {/* --- Code Tracer and Logging Panels --- */}
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