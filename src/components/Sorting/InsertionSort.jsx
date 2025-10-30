import React, { useState, useRef, useEffect } from 'react';
import { ArrowDownUp, Pause, Play, RefreshCw, Shuffle } from 'lucide-react';

// --- In-line CSS Styles ---
const InjectedStyles = () => (
  <style>{`
    /* --- Global Styles & Variables --- */
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

      --orange-500: #f97316;
      --orange-600: #ea580c;

      --purple-500: #a855f7;
      --purple-600: #9333ea;
    }

    /* Apply a base font and color to the container */
    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
    }

    * {
      box-sizing: border-box;
    }

    /* --- Main Layout --- */
    .visualizer-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    @media (min-width: 1024px) { /* lg breakpoint */
      .visualizer-container {
        flex-direction: row;
      }
    }

    /* --- Sidebar --- */
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
        min-width: 300px;
        max-width: 350px;
        min-height: 100vh;
        overflow-y: auto;
      }
    }

    .sidebar-title {
      font-size: 1.875rem; /* 30px */
      font-weight: 700;
      margin: 0 0 2rem 0;
      color: var(--cyan-400);
      display: flex;
      align-items: center;
    }

    .sidebar-title svg {
      margin-right: 0.75rem;
    }

    /* --- Form Elements --- */
    .input-group {
      margin-bottom: 1.5rem;
    }

    .input-group label {
      display: block;
      font-size: 0.875rem; /* 14px */
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-gray-300);
    }

    .input-field {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--bg-dark-700);
      border-radius: 0.5rem; /* 8px */
      border: 1px solid var(--border-gray-600);
      color: var(--text-gray-200);
      transition: border-color 0.2s, box-shadow 0.2s;
      font-size: 1rem;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--cyan-500);
      box-shadow: 0 0 0 2px var(--cyan-500);
    }

    .input-field:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .textarea-field {
      resize: vertical;
      min-height: 60px;
      font-family: inherit;
    }

    .error-message {
      color: var(--red-400);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: rgba(248, 113, 113, 0.1);
      border: 1px solid var(--red-400);
      border-radius: 0.5rem;
    }

    /* --- Buttons --- */
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .btn {
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 0.9rem;
      text-align: center;
    }

    .btn svg {
      width: 18px;
      height: 18px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      grid-column: span 2;
      background-color: var(--cyan-600);
      color: white;
    }
    .btn-primary:hover:not(:disabled) { background-color: var(--cyan-500); }

    .btn-pause {
      background-color: var(--yellow-600);
      color: black;
    }
    .btn-pause:hover:not(:disabled) { background-color: var(--yellow-500); }

    .btn-resume {
      background-color: var(--green-600);
      color: white;
    }
    .btn-resume:hover:not(:disabled) { background-color: var(--green-500); }

    .btn-secondary {
      background-color: var(--bg-dark-600);
      color: white;
    }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-500); }

    .btn-random {
      width: 100%;
      background-color: var(--purple-600);
      color: white;
      margin-bottom: 1.5rem;
    }
    .btn-random:hover:not(:disabled) { background-color: var(--purple-500); }

    /* --- Slider --- */
    .speed-slider-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .speed-slider {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 8px;
      background: var(--bg-dark-700);
      border-radius: 5px;
      outline: none;
      opacity: 0.9;
      transition: opacity .2s;
    }
    .speed-slider:hover { opacity: 1; }
    .speed-slider:disabled { opacity: 0.5; }

    .speed-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: var(--cyan-500);
      border-radius: 50%;
      cursor: pointer;
    }

    .speed-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: var(--cyan-500);
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }

    .speed-value {
      width: 5rem;
      text-align: right;
      color: var(--text-gray-400);
      font-size: 0.9rem;
    }

    /* --- Main Content --- */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }

    @media (min-width: 768px) {
      .main-content {
        padding: 2.5rem;
      }
    }

    .section-title {
      font-size: 1.5rem; /* 24px */
      font-weight: 600;
      margin: 0 0 1.5rem 0;
      color: var(--text-gray-200);
    }

    /* --- Visualization Area --- */
    .visualization-section {
      display: flex;
      flex-direction: column;
      min-height: 250px;
    }

    .status-bar {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1.5rem;
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
      text-align: center;
      min-height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-text {
      font-size: 1.125rem; /* 18px */
      font-weight: 500;
      transition: color 0.3s;
    }

    .status-default { color: var(--cyan-400); }
    .status-sorting { color: var(--yellow-400); }
    .status-sorted { color: var(--green-400); }
    .status-paused { color: var(--yellow-400); }

    .visualization-boxes {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem; /* Reduced gap for sorting */
      padding: 1rem;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-height: 150px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    }

    .box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease-in-out;
    }
    .box-wrapper.no-transition {
      transition: none;
    }

    .box {
      width: 3.5rem; /* 56px */
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem; /* 18px */
      font-weight: 700;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      border: 2px solid transparent;
    }

    .box-index {
      margin-top: 0.5rem;
      font-size: 0.875rem; /* 14px */
      color: var(--text-gray-400);
    }

    .box.default {
      background-color: var(--bg-dark-600);
      color: white;
      border-color: var(--border-gray-500);
    }

    .box.comparing {
      background-color: var(--yellow-500);
      color: black;
      border-color: var(--yellow-400);
      transform: scale(1.05);
    }
    
    .box.swapping {
      background-color: var(--orange-500);
      color: white;
      border-color: var(--orange-600);
      transform: scale(1.1);
    }

    .box.sorted {
      background-color: var(--green-600);
      color: white;
      border-color: var(--green-500);
      opacity: 0.8;
    }

    /* --- Lower Content Area --- */
    .lower-content-area {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-top: 2rem;
      flex: 1; /* Allow this area to grow */
    }

    @media (min-width: 1024px) {
      .lower-content-area {
        flex-direction: row;
      }
    }

    /* --- Code Area --- */
    .code-section {
      display: flex;
      flex-direction: column;
      flex: 1; 
      min-height: 300px;
    }

    .code-block {
      background-color: var(--bg-dark-950);
      padding: 1.5rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      height: 100%;
    }

    .code-block pre {
      margin: 0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .code-line {
      display: block;
      padding: 0 0.5rem;
      transition: background-color 0.2s;
      min-height: 1.6em; /* Ensure empty lines have height */
    }

    .code-line.highlight {
      background-color: rgba(6, 182, 212, 0.2);
      border-radius: 0.25rem;
    }

    .code-line.comment {
      color: var(--text-gray-500);
      font-style: italic;
    }
    
    /* --- Log Section --- */
    .log-section {
      display: flex;
      flex-direction: column;
      flex: 1; 
      min-height: 300px;
    }

    .log-block {
      background-color: var(--bg-dark-950);
      padding: 1.5rem;
      border-radius: 0.5rem;
      overflow-y: auto;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      height: 100%;
    }

    @media (max-width: 1023px) {
      .log-block {
        max-height: 300px; /* Give a max height on mobile */
      }
    }

    .log-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    
    .log-item {
      padding: 0.25rem 0.5rem;
      border-bottom: 1px solid var(--bg-dark-700);
      color: var(--text-gray-300);
      word-break: break-all;
    }
    
    .log-item:last-child {
      border-bottom: none; 
      color: white; /* Highlight last item */
    }
  `}</style>
);


// --- Helper Functions & Data ---

const codeSnippets = {
  python: `
def insertion_sort(arr):
  # Traverse from 1 to len(arr)
  for i in range(1, len(arr)):
    j = i
    # Move arr[i] to its correct position
    # by swapping with elements to its left
    while j > 0 and arr[j-1] > arr[j]:
      # Compare elements
      arr[j-1], arr[j] = arr[j], arr[j-1]
      # Swap
      j -= 1
  `,
  javascript: `
function insertionSort(arr) {
  let n = arr.length;
  // Traverse from 1 to n
  for (let i = 1; i < n; i++) {
    let j = i;
    // Move arr[i] to its correct position
    // by swapping with elements to its left
    while (j > 0 && arr[j - 1] > arr[j]) {
      // Compare elements
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      // Swap
      j--;
    }
  }
}
  `,
  java: `
void insertionSort(int arr[]) {
  int n = arr.length;
  // Traverse from 1 to n
  for (int i = 1; i < n; i++) {
    int j = i;
    // Move arr[i] to its correct position
    // by swapping with elements to its left
    while (j > 0 && arr[j - 1] > arr[j]) {
      // Compare elements
      int temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
      // Swap
      j--;
    }
  }
}
  `,
  cpp: `
void insertionSort(int arr[], int n) {
  // Traverse from 1 to n
  for (int i = 1; i < n; i++) {
    int j = i;
    // Move arr[i] to its correct position
    // by swapping with elements to its left
    while (j > 0 && arr[j - 1] > arr[j]) {
      // Compare elements
      swap(arr[j - 1], arr[j]);
      // Swap
      j--;
    }
  }
}
  `,
};

/**
 * A utility function to create a delay.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The core visualization logic for Insertion Sort (swap variant).
 */
async function visualizeInsertionSort(
  arr,
  speed,
  setBoxes,
  setStatus,
  setHighlightLineNum,
  setExecutionLog,
  pausedRef,
  isCancelledRef
) {
  // Helper to check for pause
  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Press Resume to continue.");
      await sleep(100);
    }
    if (!isCancelledRef.current) {
      setStatus("Sorting...");
    }
  };

  let n = arr.length;
  let boxes = arr.map((value, index) => ({ value, state: 'default', index, translateX: 0, noTransition: false }));
  
  // Mark first element as sorted
  if (boxes.length > 0) {
    boxes[0].state = 'sorted';
  }
  setBoxes([...boxes]);
  setStatus("Starting Insertion Sort...");
  setExecutionLog(["Visualization started...", "Element at index 0 is sorted."]);
  await sleep(speed);

  // Outer loop
  for (let i = 1; i < n; i++) {
    if (isCancelledRef.current) break;
    setHighlightLineNum(3); // for i in range(1, len(arr)):
    await checkPause();
    
    let j = i;
    setHighlightLineNum(4); // j = i
    setExecutionLog(prev => [...prev, `Starting pass ${i}. Key is ${boxes[j].value} at [${j}]`]);
    await checkPause();
    await sleep(speed);

    // Inner loop (swapping backwards)
    while (j > 0 && boxes[j - 1].value > boxes[j].value) {
      if (isCancelledRef.current) break;
      setHighlightLineNum(7); // while j > 0 and arr[j-1] > arr[j]:
      await checkPause();

      // 1. Mark as comparing
      const compareMsg = `Comparing: [${j-1}] ${boxes[j-1].value} and [${j}] ${boxes[j].value}`;
      setStatus(compareMsg);
      setExecutionLog(prev => [...prev, compareMsg]);
      boxes[j-1].state = 'comparing';
      boxes[j].state = 'comparing';
      boxes[j-1].translateX = 0; 
      boxes[j].translateX = 0;
      setBoxes([...boxes]);
      await sleep(speed);
      
      if (isCancelledRef.current) break;
      await checkPause();

      // 2. Perform Swap
      setHighlightLineNum(9); // arr[j-1], arr[j] = arr[j], arr[j-1]
        
      // 2a. Mark as swapping & set translations
      const swapMsg = `Swap: ${boxes[j-1].value} with ${boxes[j].value}`;
      setStatus(swapMsg);
      setExecutionLog(prev => [...prev, swapMsg]);
      boxes[j-1].state = 'swapping';
      boxes[j].state = 'swapping';
      boxes[j-1].translateX = '4rem'; // 3.5rem box + 0.5rem gap
      boxes[j].translateX = '-4rem';
      boxes[j-1].noTransition = false;
      boxes[j].noTransition = false;
      setBoxes([...boxes]);
      await sleep(300); // Wait for CSS animation (hardcoded 300ms)

      if (isCancelledRef.current) break;
      await checkPause();

      // 2b. Swap data and "snap" to new position instantly
      [boxes[j-1], boxes[j]] = [boxes[j], boxes[j-1]];
      boxes[j-1].translateX = 0;
      boxes[j].translateX = 0;
      boxes[j-1].noTransition = true; // Disable transition
      boxes[j].noTransition = true; // Disable transition
      setBoxes([...boxes]);
      
      // Force a re-render to apply the snap, then wait
      await sleep(speed < 100 ? speed : 100); 

      // 2c. Reset state to default and re-enable transition
      boxes[j-1].state = 'default';
      boxes[j].state = 'default';
      boxes[j-1].noTransition = false;
      boxes[j].noTransition = false;
      setBoxes([...boxes]);
      
      await sleep(speed); // Wait for user-defined step speed

      j -= 1;
      setHighlightLineNum(11); // j -= 1
      await checkPause();
      await sleep(speed);
    }
    
    if (j > 0) {
      setExecutionLog(prev => [...prev, `Comparison [${j-1}]${boxes[j-1].value} <= [${j}]${boxes[j].value} ended pass.`]);
    } else {
      setExecutionLog(prev => [...prev, `Element ${boxes[j].value} reached start of array.`]);
    }

    // Mark the sorted part
    for(let k = 0; k <= i; k++) {
      if (boxes[k]) boxes[k].state = 'sorted';
    }
    setBoxes([...boxes]);
    setExecutionLog(prev => [...prev, `Pass ${i} complete. [0..${i}] is sorted.`]);
    await sleep(speed);

    if (isCancelledRef.current) break;
  }

  // Mark all as sorted if not cancelled
  if (!isCancelledRef.current) {
    setStatus("Sorting complete!");
    setExecutionLog(prev => [...prev, "Sorting complete!"]);
    setBoxes(boxes.map(box => ({ ...box, state: 'sorted' })));
    setHighlightLineNum(-1);
  } else {
    setStatus("Visualization cancelled.");
    setExecutionLog(prev => [...prev, "Visualization cancelled."]);
    setHighlightLineNum(-1);
  }
}

// --- Main Component ---

export default function InsertionSort() {
  const [arrayStr, setArrayStr] = useState("7, 2, 9, 1, 5, 4, 8");
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Enter an array, then press Sort.");
  const [boxes, setBoxes] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [executionLog, setExecutionLog] = useState([]);
  
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  const pausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const logContainerRef = useRef(null);

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  /**
   * Cleans and validates the input array.
   */
  const validateInputs = () => {
    setError(null);
    const arr = arrayStr
      .split(/[, ]+/)
      .map(Number)
      .filter((num) => !isNaN(num));

    if (!arr.length) {
      setError("Please enter a valid, non-empty array of numbers.");
      return null;
    }
    
    if (arr.length > 20) {
      setError("Please use 20 elements or less for a better visualization.");
      return null;
    }

    return arr;
  };
  
  // Effect to update boxes on arrayStr change (when not visualizing)
  useEffect(() => {
    if (!isVisualizing) {
      const arr = validateInputs();
      if (arr) {
        setBoxes(arr.map((value, index) => ({ value, state: 'default', index, translateX: 0, noTransition: false })));
      } else {
        setBoxes([]);
      }
    }
  }, [arrayStr, isVisualizing]);

  /**
   * Starts the visualization process.
   */
  const handleStart = async () => {
    const arr = validateInputs();
    if (!arr) return;

    isCancelledRef.current = false;
    pausedRef.current = false;
    setIsPaused(false);
    setIsVisualizing(true);
    setStatus("Starting...");
    setHighlightLineNum(-1);
    setExecutionLog([]);

    await visualizeInsertionSort(
      arr,
      speed,
      setBoxes,
      setStatus,
      setHighlightLineNum,
      setExecutionLog,
      pausedRef,
      isCancelledRef
    );

    setIsVisualizing(false);
    setIsPaused(false);
  };

  /**
   * Toggles the pause state.
   */
  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    pausedRef.current = newPausedState;
    if (newPausedState) {
      setExecutionLog(prev => [...prev, "Paused."]);
    } else {
      setExecutionLog(prev => [...prev, "Resuming..."]);
    }
  };

  /**
   * Resets the visualizer.
   */
  const handleReset = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    
    setError(null);
    setStatus("Enter an array, then press Sort.");
    setHighlightLineNum(-1);
    setExecutionLog([]);

    const arr = validateInputs();
    if (arr) {
      setBoxes(arr.map((value, index) => ({ value, state: 'default', index, translateX: 0, noTransition: false })));
    } else {
      setBoxes([]);
    }
  };

  /**
   * Generates a random array.
   */
  const handleRandomArray = () => {
    if (isVisualizing) return;
    const size = Math.floor(Math.random() * 10) + 8; // 8-17 elements
    const arr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    
    setArrayStr(arr.join(", "));
    setExecutionLog([]);
  };

  const codeLines = codeSnippets[language].trim().split('\n');
  
  const statusColor = status.includes("complete")
    ? "status-sorted"
    : status.includes("Sorting")
    ? "status-sorting"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <ArrowDownUp size={30} />
          Insertion Sort
        </h1>

        <div className="input-group">
          <label htmlFor="array">Array</label>
          <textarea
            id="array"
            placeholder="e.g., 7, 2, 9, 1"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isVisualizing}
            rows="3"
            className="input-field textarea-field"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* --- Actions --- */}
        <div className="actions-grid">
          <button
            onClick={handleStart}
            disabled={isVisualizing}
            className="btn btn-primary"
          >
            <ArrowDownUp size={18} />
            Sort
          </button>

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
            Reset
          </button>
        </div>

        <button
            onClick={handleRandomArray}
            disabled={isVisualizing}
            className="btn btn-random"
          >
            <Shuffle size={18} />
            Generate Random Array
        </button>

        {/* --- Settings --- */}
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
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="speed">Visualization Speed</label>
          <div className="speed-slider-group">
            <input
              id="speed"
              type="range"
              min="50"
              max="1500"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isVisualizing}
              className="speed-slider"
            />
            <span className="speed-value">{speed} ms</span>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="main-content">
        
        {/* --- Visualization Area --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>
          
          <div className="visualization-boxes">
            {boxes.map((box, idx) => (
              <div key={box.index} className={`box-wrapper ${box.noTransition ? 'no-transition' : ''}`} style={{ transform: `translateX(${box.translateX || 0})` }}>
                <div
                  className={`box ${box.state}`}
                >
                  {box.value}
                </div>
                <span className="box-index">[{idx}]</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- Lower Content Area (Code & Log) --- */}
        <div className="lower-content-area">
          {/* --- Code Area --- */}
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

          {/* --- Execution Log --- */}
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
