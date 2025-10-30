import React, { useState, useRef, useEffect } from 'react';
import { Search, Pause, Play, RefreshCw, Shuffle } from 'lucide-react';
// import './LinearSearch.css'; // Removed this import

// --- In-line CSS Styles ---
// All styles from LinearSearch.css are now included here
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
    .status-found { color: var(--green-400); }
    .status-not-found { color: var(--red-400); }
    .status-paused { color: var(--yellow-400); }

    .visualization-boxes {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      gap: 1rem;
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
    }

    .box {
      width: 4rem; /* 64px */
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem; /* 20px */
      font-weight: 700;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      transform: scale(1);
    }

    .box-index {
      margin-top: 0.5rem;
      font-size: 0.875rem; /* 14px */
      color: var(--text-gray-400);
    }

    .box.default {
      background-color: var(--bg-dark-600);
      color: white;
      border: 2px solid var(--border-gray-500);
    }

    .box.visiting {
      background-color: var(--yellow-500);
      color: black;
      transform: scale(1.1);
      border: 2px solid var(--yellow-300);
    }

    .box.found {
      background-color: var(--green-500);
      color: white;
      transform: scale(1.1);
      border: 2px solid var(--green-300);
      box-shadow: 0 0 15px var(--green-500);
    }

    .box.visited {
      background-color: var(--bg-dark-700);
      color: var(--text-gray-400);
      opacity: 0.7;
      border: 2px solid var(--border-gray-600);
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
      /* margin-top: 2rem; */ /* Moved to lower-content-area */
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

/**
 * A map of language keys to their corresponding linear search code snippets.
 */
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
  `,
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
  `,
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
  `,
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
  `,
};

/**
 * A utility function to create a delay.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The core visualization logic for linear search.
 */
async function visualizeLinearSearch(
  arr,
  target,
  speed,
  setBoxes,
  setStatus,
  setHighlightLineNum,
  setExecutionLog, // Added this
  pausedRef,
  isCancelledRef
) {
  // Helper to check for pause
  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Press Resume to continue.");
      await sleep(100);
    }
    // Clear pause message on resume
    if (!pausedRef.current) {
      setStatus("Searching...");
    }
  };

  // 1. Initialize boxes
  let initialBoxes = arr.map((value) => ({ value, state: 'default' }));
  setBoxes(initialBoxes);
  setStatus("Starting visualization...");
  setExecutionLog(["Visualization started..."]); // Clear and add first log
  setHighlightLineNum(2); // for i in range(len(arr)):
  await sleep(speed);

  // 2. Start loop
  for (let i = 0; i < arr.length; i++) {
    if (isCancelledRef.current) {
      setStatus("Visualization cancelled.");
      setExecutionLog(prev => [...prev, "Visualization cancelled."]);
      setHighlightLineNum(-1);
      return;
    }

    await checkPause();

    // 2a. Mark current element as 'visiting'
    const visitMsg = `Checking index ${i} (Value: ${arr[i]})`;
    setStatus(visitMsg);
    setExecutionLog(prev => [...prev, visitMsg]); // Add log
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, idx) =>
        idx === i ? { ...box, state: 'visiting' } : box
      )
    );
    setHighlightLineNum(4); // if arr[i] == target:
    await sleep(speed);

    if (isCancelledRef.current) return;
    await checkPause();

    // 2b. Check for target
    if (arr[i] === target) {
      const foundMsg = `Target ${target} found at index ${i}!`;
      setStatus(foundMsg);
      setExecutionLog(prev => [...prev, foundMsg]); // Add log
      setBoxes((prevBoxes) =>
        prevBoxes.map((box, idx) =>
          idx === i ? { ...box, state: 'found' } : box
        )
      );
      setHighlightLineNum(6); // return i
      await sleep(speed * 2);
      setHighlightLineNum(-1);
      return; // Found, so exit
    }

    // 2c. Mark as 'visited' if not target
    const notFoundMsg = `Index ${i} (Value: ${arr[i]}) is not the target.`;
    setStatus(notFoundMsg);
    setExecutionLog(prev => [...prev, notFoundMsg]); // Add log
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, idx) =>
        idx === i ? { ...box, state: 'visited' } : box
      )
    );
    setHighlightLineNum(2); // Loop back to for...
    await sleep(speed);
  }

  // 3. Target not found
  if (isCancelledRef.current) return;
  
  const targetNotFoundMsg = `Target ${target} not found in the array.`;
  setStatus(targetNotFoundMsg);
  setExecutionLog(prev => [...prev, targetNotFoundMsg]); // Add log
  setHighlightLineNum(9); // return -1
  await sleep(speed * 2);
  setHighlightLineNum(-1);
}

// --- Main Component ---

export default function LinearSearch() {
  const [arrayStr, setArrayStr] = useState("5, 12, 3, 8, 1, 9, 4");
  const [targetStr, setTargetStr] = useState("9");
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Enter an array and target, then press Search.");
  const [boxes, setBoxes] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [executionLog, setExecutionLog] = useState([]); // State for log
  
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  const pausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const logContainerRef = useRef(null); // Ref for log auto-scroll

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  /**
   * Cleans and validates the input array and target.
   */
  const validateInputs = () => {
    setError(null);
    const arr = arrayStr
      .split(/[, ]+/) // Split by comma or space
      .map(Number)
      .filter((num) => !isNaN(num));

    if (!arr.length) {
      setError("Please enter a valid, non-empty array of numbers.");
      return null;
    }

    const targetVal = Number(targetStr);
    if (isNaN(targetVal)) {
      setError("Please enter a valid number for the target.");
      return null;
    }

    return { arr, targetVal };
  };
  
  // When boxes update, create a default state if not visualizing
  // This useEffect initializes the boxes on first load and when arrayStr changes
  useEffect(() => {
    if (!isVisualizing) {
      const inputs = validateInputs();
      if (inputs) {
        setBoxes(inputs.arr.map(value => ({ value, state: 'default' })));
      } else {
        setBoxes([]);
      }
    }
  }, [arrayStr, isVisualizing]); // Re-run if array string changes

  /**
   * Starts the visualization process.
   */
  const handleStart = async () => {
    const inputs = validateInputs();
    if (!inputs) return;

    const { arr, targetVal } = inputs;

    // Reset state for a new run
    isCancelledRef.current = false;
    pausedRef.current = false;
    setIsPaused(false);
    setIsVisualizing(true);
    setStatus("Starting...");
    setHighlightLineNum(-1);
    setExecutionLog([]); // Clear log on start

    await visualizeLinearSearch(
      arr,
      targetVal,
      speed,
      setBoxes,
      setStatus,
      setHighlightLineNum,
      setExecutionLog, // Pass setter
      pausedRef,
      isCancelledRef
    );

    setIsVisualizing(false);
    setIsPaused(false);
  };

  /**
   * Toggles the pause state of the visualization.
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
   * Resets the entire visualizer to its initial state.
   */
  const handleReset = () => {
    isCancelledRef.current = true; // Signal any running viz to stop
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    
    setError(null);
    setStatus("Enter an array and target, then press Search.");
    setHighlightLineNum(-1);
    setExecutionLog([]); // Clear log on reset

    // Re-initialize boxes from the current array string
    const inputs = validateInputs();
    if (inputs) {
      setBoxes(inputs.arr.map(value => ({ value, state: 'default' })));
    } else {
      setBoxes([]);
    }
  };

  /**
   * Generates a random array and sets it.
   */
  const handleRandomArray = () => {
    if (isVisualizing) return;
    const size = Math.floor(Math.random() * 10) + 8; // 8-17 elements
    const arr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    const newTarget = arr[Math.floor(Math.random() * size)]; // Pick a random target from the new array
    
    setArrayStr(arr.join(", "));
    setTargetStr(String(newTarget));
    setExecutionLog([]); // Clear log
    // The useEffect will handle resetting the boxes
  };

  // Get code snippet lines
  const codeLines = codeSnippets[language].trim().split('\n');
  
  // Dynamic status text color
  const statusColor = status.includes("found")
    ? "status-found"
    : status.includes("not found")
    ? "status-not-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles /> {/* This injects all the CSS */}
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <Search size={30} />
          Linear Search
        </h1>

        {/* --- Inputs --- */}
        <div className="input-group">
          <label htmlFor="array">Array</label>
          <textarea
            id="array"
            placeholder="e.g., 5, 12, 3, 8"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isVisualizing}
            rows="3"
            className="input-field textarea-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="target">Target</label>
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

        {/* --- Actions --- */}
        <div className="actions-grid">
          <button
            onClick={handleStart}
            disabled={isVisualizing}
            className="btn btn-primary"
          >
            <Search size={18} />
            Search
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
              min="100"
              max="2000"
              step="100"
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
          
          {/* Status Bar */}
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>
          
          {/* Array Boxes */}
          <div className="visualization-boxes">
            {boxes.map((box, idx) => (
              <div key={idx} className="box-wrapper">
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
                      {/* Add a non-breaking space for empty lines to ensure height */}
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


