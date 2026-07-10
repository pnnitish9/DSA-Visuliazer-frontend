import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowDownUp, 
  Pause, 
  Play, 
  RefreshCw, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  BookOpen
} from 'lucide-react';

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

    * {
      box-sizing: border-box;
    }

    @media (min-width: 1024px) {
      .visualizer-container {
        flex-direction: row;
      }
    }

    /* --- Sidebar Controls Styling --- */
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
        max-width: 380px;
        min-height: 100vh;
        overflow-y: auto;
      }
    }

    .sidebar-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      color: var(--cyan-400);
      display: flex;
      align-items: center;
    }

    .sidebar-title svg {
      margin-right: 0.75rem;
    }

    /* --- Forms, Input Elements, Sliders --- */
    .input-group {
      margin-bottom: 1.25rem;
    }

    .input-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-gray-300);
    }

    .input-field {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--bg-dark-700);
      border-radius: 0.5rem;
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
      min-height: 55px;
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

    /* --- Button and Trigger Layouts --- */
    .actions-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
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
      margin-bottom: 1.25rem;
    }
    .btn-random:hover:not(:disabled) { background-color: var(--purple-500); }

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
      width: 5.5rem;
      text-align: right;
      color: var(--text-gray-400);
      font-size: 0.9rem;
    }

    /* --- Main Workspace layout --- */
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
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: var(--text-gray-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .status-bar {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1rem;
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
      font-size: 1.125rem;
      font-weight: 500;
      transition: color 0.3s;
    }

    .status-default { color: var(--cyan-400); }
    .status-sorting { color: var(--yellow-400); }
    .status-sorted { color: var(--green-400); }
    .status-paused { color: var(--yellow-400); }

    /* --- Stats Dashboard Widget --- */
    .stats-dashboard {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-card {
      background-color: var(--bg-dark-950);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
      padding: 0.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-gray-500);
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--cyan-400);
    }

    /* --- Visualizer Box Elements --- */
    .visualization-boxes {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 2.5rem 1rem;
      background-color: rgba(0, 0, 0, 0.25);
      border-radius: 0.5rem;
      min-height: 180px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      position: relative;
    }

    .box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    }

    .box-wrapper.no-transition {
      transition: none;
    }

    .box {
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      font-weight: 700;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      border: 2px solid transparent;
    }

    .box-index {
      margin-top: 0.5rem;
      font-size: 0.875rem;
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
      transform: scale(1.08);
    }
    
    .box.swapping {
      background-color: var(--orange-500);
      color: white;
      border-color: var(--orange-600);
      transform: scale(1.12);
    }

    .box.sorted {
      background-color: var(--green-600);
      color: white;
      border-color: var(--green-500);
      opacity: 0.85;
    }

    /* --- Interactive Playback underneath Canvas --- */
    .canvas-playback-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
    }

    .btn-icon {
      background-color: var(--bg-dark-700);
      color: white;
      border: 1px solid var(--border-gray-600);
      padding: 0.6rem;
      border-radius: 0.375rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-icon:hover:not(:disabled) {
      background-color: var(--bg-dark-600);
      border-color: var(--cyan-400);
    }

    .btn-icon:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .playback-tracker {
      font-size: 0.9rem;
      color: var(--text-gray-300);
      min-width: 6rem;
      text-align: center;
      font-family: monospace;
    }

    /* --- Timeline Scrubber UI --- */
    .scrub-timeline-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.75rem;
    }

    .scrub-timeline {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: var(--bg-dark-950);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    }

    .scrub-timeline::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: var(--cyan-400);
      border-radius: 50%;
    }

    /* --- Clean 2-Column lower area for Code and Logs --- */
    .lower-content-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    @media (min-width: 1024px) {
      .lower-content-area {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }

    .workspace-section {
      display: flex;
      flex-direction: column;
      min-height: 280px;
    }

    .panel-block {
      background-color: var(--bg-dark-950);
      padding: 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      height: 100%;
      overflow-y: auto;
    }

    /* --- Code Line highlights --- */
    .code-block pre {
      margin: 0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.6;
    }

    .code-line {
      display: block;
      padding: 0 0.5rem;
      transition: background-color 0.2s;
      min-height: 1.6em;
    }

    .code-line.highlight {
      background-color: rgba(6, 182, 212, 0.25);
      border-left: 3px solid var(--cyan-400);
      border-radius: 0 0.25rem 0.25rem 0;
    }

    .code-line.comment {
      color: var(--text-gray-500);
      font-style: italic;
    }

    /* --- Execution Logs Stream --- */
    .log-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.825rem;
      line-height: 1.5;
    }
    
    .log-item {
      padding: 0.25rem 0.5rem;
      border-bottom: 1px solid var(--bg-dark-800);
      color: var(--text-gray-300);
      word-break: break-all;
    }
    
    .log-item:last-child {
      border-bottom: none; 
      color: white;
      background-color: rgba(6, 182, 212, 0.1);
    }

    /* --- EXACT BUBBLE SORT / AUXILIARY SPACE Complexity cards matching image_0c0bc2.png --- */
    .image-complexity-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }

    @media (min-width: 640px) {
      .image-complexity-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .image-complexity-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .image-complexity-card {
      background-color: #111827;
      border: 1px solid #1f2937;
      border-radius: 0.5rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 110px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .image-card-header {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #9ca3af;
      text-transform: uppercase;
    }

    .image-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .image-card-complexity {
      font-family: monospace;
      font-size: 0.9rem;
      font-weight: 600;
      color: #38bdf8;
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
            # Compare elements
            if arr[j] > arr[j + 1]:
                # Swap
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
`,
  javascript: `
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Compare elements
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}
`,
  java: `
void bubbleSort(int arr[]) {
  int n = arr.length;
  for (int i = 0; i < n; i++) {
    boolean swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      // Compare elements
      if (arr[j] > arr[j + 1]) {
        // Swap
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}
`,
  cpp: `
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n; i++) {
    bool swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      // Compare elements
      if (arr[j] > arr[j + 1]) {
        // Swap
        swap(arr[j], arr[j + 1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}
`
};

const getHighlightLine = (stepType, lang) => {
  const mappings = {
    python: { outer: 4, init: 5, inner: 6, compare: 8, swap: 10, swapped_true: 11, check_swapped: 12 },
    javascript: { outer: 4, init: 5, inner: 6, compare: 8, swap: 10, swapped_true: 11, check_swapped: 13 },
    java: { outer: 4, init: 5, inner: 6, compare: 8, swap: 11, swapped_true: 14, check_swapped: 17 },
    cpp: { outer: 3, init: 4, inner: 5, compare: 7, swap: 9, swapped_true: 10, check_swapped: 13 }
  };
  return mappings[lang]?.[stepType] ?? -1;
};

export default function App() {
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [randomSize, setRandomSize] = useState(8);
  const [arrayStr, setArrayStr] = useState("7, 2, 9, 1, 5, 4, 8");
  const [error, setError] = useState(null);

  // Precomputed Multi-Step States
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const logContainerRef = useRef(null);
  const timerRef = useRef(null);

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
      setError("Please use 20 elements or less for optimum visual clarity.");
      return null;
    }

    return arr;
  };

  const buildVisualizationSteps = (arr) => {
    const stepsList = [];
    const logs = ["Visualization compiled. Ready to run."];
    const deepCopy = (items) => items.map(item => ({ ...item }));

    let boxes = arr.map((value, index) => ({
      value,
      state: 'default',
      index,
      translateX: 0,
      noTransition: false
    }));

    let n = boxes.length;
    let swapsCount = 0;
    let comparisonsCount = 0;

    // Step 0: Ready Idle state
    stepsList.push({
      boxes: deepCopy(boxes),
      status: "Enter an array, then press Play or Step Forward.",
      stepType: 'idle',
      logs: [...logs],
      swaps: 0,
      comparisons: 0
    });

    for (let i = 0; i < n; i++) {
      logs.push(`Pass ${i + 1}: Starting pass over unsorted elements.`);
      
      // Step Type: Outer loop boundary initialization
      stepsList.push({
        boxes: deepCopy(boxes),
        status: `Starting pass ${i + 1}. Preparing to bubble up element.`,
        stepType: 'outer',
        logs: [...logs],
        swaps: swapsCount,
        comparisons: comparisonsCount
      });

      // swapped = False
      logs.push(`Pass ${i + 1}: Initialized swapped = False.`);
      stepsList.push({
        boxes: deepCopy(boxes),
        status: `Initialized swapped tracker to False.`,
        stepType: 'init',
        logs: [...logs],
        swaps: swapsCount,
        comparisons: comparisonsCount
      });

      let swappedInThisPass = false;

      for (let j = 0; j < n - i - 1; j++) {
        // Step Type: Inner loop pointer initialization
        stepsList.push({
          boxes: deepCopy(boxes),
          status: `Inner loop indexing element j = ${j}.`,
          stepType: 'inner',
          logs: [...logs],
          swaps: swapsCount,
          comparisons: comparisonsCount
        });

        comparisonsCount++;
        const leftBox = boxes[j];
        const rightBox = boxes[j + 1];
        const needsSwap = leftBox.value > rightBox.value;

        // Visual State: Comparing elements
        const compareBoxes = deepCopy(boxes);
        compareBoxes[j].state = 'comparing';
        compareBoxes[j + 1].state = 'comparing';
        logs.push(`Compare: Is [${j}] (${leftBox.value}) > [${j + 1}] (${rightBox.value})? ${needsSwap ? "Yes" : "No"}`);

        stepsList.push({
          boxes: compareBoxes,
          status: `Comparing: ${leftBox.value} > ${rightBox.value}? ${needsSwap ? "Yes" : "No"}`,
          stepType: 'compare',
          logs: [...logs],
          swaps: swapsCount,
          comparisons: comparisonsCount
        });

        if (needsSwap) {
          swapsCount++;
          swappedInThisPass = true;

          // Visual State: Swap Displacement Animation
          const displaceBoxes = deepCopy(boxes);
          displaceBoxes[j].state = 'swapping';
          displaceBoxes[j + 1].state = 'swapping';
          displaceBoxes[j].translateX = '4rem'; 
          displaceBoxes[j + 1].translateX = '-4rem';
          logs.push(`Swap: Shifting ${leftBox.value} to index [${j + 1}] and ${rightBox.value} to index [${j}].`);

          stepsList.push({
            boxes: displaceBoxes,
            status: `Swapping ${leftBox.value} and ${rightBox.value}`,
            stepType: 'swap',
            logs: [...logs],
            swaps: swapsCount,
            comparisons: comparisonsCount
          });

          // Visual State: Snapping instantly inside memory
          const snapBoxes = deepCopy(boxes);
          [snapBoxes[j], snapBoxes[j + 1]] = [snapBoxes[j + 1], snapBoxes[j]];
          snapBoxes[j].translateX = 0;
          snapBoxes[j + 1].translateX = 0;
          snapBoxes[j].noTransition = true;
          snapBoxes[j + 1].noTransition = true;
          snapBoxes[j].state = 'swapping';
          snapBoxes[j + 1].state = 'swapping';

          stepsList.push({
            boxes: snapBoxes,
            status: `Elements swapped in memory array.`,
            stepType: 'swap',
            logs: [...logs],
            swaps: swapsCount,
            comparisons: comparisonsCount
          });

          // Mutating the main copy for subsequent iterations
          [boxes[j], boxes[j + 1]] = [boxes[j + 1], boxes[j]];

          // Visual State: swapped = True
          const trackingState = deepCopy(boxes);
          trackingState[j].state = 'default';
          trackingState[j + 1].state = 'default';
          logs.push(`Tracking: Set swapped = True.`);
          stepsList.push({
            boxes: trackingState,
            status: `Set swapped flag to True because a swap occurred.`,
            stepType: 'swapped_true',
            logs: [...logs],
            swaps: swapsCount,
            comparisons: comparisonsCount
          });
        } else {
          logs.push(`No Swap: Elements already in relative order.`);
        }
      }

      // Bubble sort guarantees the element at (n - i - 1) reaches its sorted spot
      boxes[n - i - 1].state = 'sorted';
      logs.push(`Pass ${i + 1} complete. Element ${boxes[n - i - 1].value} is bubbled and fully sorted.`);

      // Check if optimized break should trigger
      stepsList.push({
        boxes: deepCopy(boxes),
        status: `Evaluating early termination optimization check: swapped = ${swappedInThisPass ? "True" : "False"}.`,
        stepType: 'check_swapped',
        logs: [...logs],
        swaps: swapsCount,
        comparisons: comparisonsCount
      });

      if (!swappedInThisPass) {
        logs.push("Optimization triggered: No swaps occurred in this pass. Array is fully sorted early!");
        break;
      }
    }

    // Mark everything sorted at the end
    boxes.forEach(box => box.state = 'sorted');
    logs.push("Sorting complete! Bubble Sort succeeded.");
    stepsList.push({
      boxes: deepCopy(boxes),
      status: `Sorting complete! Total Swaps: ${swapsCount}, Total Comparisons: ${comparisonsCount}.`,
      stepType: 'idle',
      logs: [...logs],
      swaps: swapsCount,
      comparisons: comparisonsCount
    });

    return stepsList;
  };

  useEffect(() => {
    const arr = validateInputs();
    if (arr) {
      const compiledSteps = buildVisualizationSteps(arr);
      setSteps(compiledSteps);
      setCurrentStepIdx(0);
    } else {
      setSteps([]);
    }
    setIsPlaying(false);
  }, [arrayStr]);

  // Cleanup active timer on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prevIdx) => {
          if (prevIdx >= steps.length - 1) {
            setIsPlaying(false);
            return prevIdx;
          }
          return prevIdx + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isPlaying, steps, speed]);

  // Keep logs window scrolled to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStepIdx, steps]);

  const toggleAutoplay = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleRandomArrayGeneration = () => {
    setIsPlaying(false);
    const arr = Array.from({ length: randomSize }, () =>
      Math.floor(Math.random() * 95) + 5
    );
    setArrayStr(arr.join(", "));
  };

  const currentStep = steps[currentStepIdx] || {
    boxes: [],
    status: "No steps loaded.",
    stepType: 'idle',
    logs: [],
    swaps: 0,
    comparisons: 0
  };

  const statusColor = currentStep.status.includes("complete")
    ? "status-sorted"
    : (currentStep.status.includes("Preparing") || currentStep.status.includes("Comparing") || currentStep.status.includes("Swapping"))
    ? "status-sorting"
    : isPlaying
    ? "status-sorting"
    : "status-default";

  const rawCode = codeSnippets[language] || "";
  const codeLines = rawCode.trim().split('\n');
  const activeLine = getHighlightLine(currentStep.stepType, language);

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Sidebar Configuration Panels --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <ArrowDownUp size={30} />
          Bubble Sort
        </h1>

        {/* Custom Array Inputs */}
        <div className="input-group">
          <label htmlFor="array">Custom Array Values</label>
          <textarea
            id="array"
            placeholder="e.g., 7, 2, 9, 1, 5"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isPlaying}
            rows="3"
            className="input-field textarea-field"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* Autoplay & Playback Triggers */}
        <div className="actions-grid">
          <button
            onClick={toggleAutoplay}
            className={`btn ${isPlaying ? 'btn-pause' : 'btn-resume'} w-full`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause Sorting" : "Play Autoplay"}
          </button>
          
          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Reset Sorting
          </button>
        </div>

        {/* Dynamic Size Slider */}
        <div className="input-group">
          <label htmlFor="random-size-slider">Random Array Size</label>
          <div className="speed-slider-group">
            <input
              id="random-size-slider"
              type="range"
              min="3"
              max="15"
              step="1"
              value={randomSize}
              onChange={(e) => setRandomSize(Number(e.target.value))}
              disabled={isPlaying}
              className="speed-slider"
            />
            <span className="speed-value">{randomSize} items</span>
          </div>
        </div>

        {/* Generation Button */}
        <button
          onClick={handleRandomArrayGeneration}
          disabled={isPlaying}
          className="btn btn-random"
        >
          <Shuffle size={18} />
          Generate Random Array
        </button>

        {/* Target Language Selector */}
        <div className="input-group">
          <label htmlFor="language">Sync Code Snippet Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        {/* Speed Adjustment panel */}
        <div className="input-group">
          <label htmlFor="speed">Autoplay Speed Delay</label>
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

      {/* --- STREAMING_CHUNK:Rendering the main content... */}
      <main className="main-content">
        
        {/* Dynamic Visualization Arena */}
        <section className="visualization-section">
          <h2 className="section-title">
            Sorting Workspace
            <span className="text-xs text-gray-500 font-mono">
              Step Mode Ready
            </span>
          </h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {currentStep.status}
            </span>
          </div>

          {/* Performance Metrices widgets */}
          <div className="stats-dashboard">
            <div className="stat-card">
              <span className="stat-label">Comparisons Done</span>
              <span className="stat-value">{currentStep.comparisons}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Swaps Executed</span>
              <span className="stat-value">{currentStep.swaps}</span>
            </div>
          </div>
          
          {/* Custom Element Box Grid Canvas */}
          <div className="visualization-boxes">
            {currentStep.boxes.map((box, idx) => (
              <div 
                key={`${box.index}-${idx}`} 
                className={`box-wrapper ${box.noTransition ? 'no-transition' : ''}`} 
                style={{ transform: `translateX(${box.translateX || 0})` }}
              >
                <div className={`box ${box.state}`}>
                  {box.value}
                </div>
                <span className="box-index">[{idx}]</span>
              </div>
            ))}
          </div>

          {/* Stepping Playback Control layout */}
          <div className="canvas-playback-controls">
            <button 
              className="btn-icon" 
              onClick={handleStepBackward} 
              disabled={currentStepIdx === 0}
              title="Step Backward"
            >
              <ChevronLeft size={20} />
              <span className="text-xs font-semibold ml-1">Prev</span>
            </button>

            <span className="playback-tracker">
              Step {currentStepIdx}
            </span>

            <button 
              className="btn-icon" 
              onClick={handleStepForward} 
              disabled={currentStepIdx >= steps.length - 1}
              title="Step Forward"
            >
              <span className="text-xs font-semibold mr-1">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Scrubbing timeline Slider bar */}
          {steps.length > 1 && (
            <div className="scrub-timeline-group">
              <input 
                type="range"
                min="0"
                max={steps.length - 1}
                value={currentStepIdx}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIdx(Number(e.target.value));
                }}
                className="scrub-timeline"
                title="Drag to Scrub Timeline Steps"
              />
            </div>
          )}
        </section>

        {/* --- STREAMING_CHUNK: Rendering Complexity Cards from image_0c0bc2.png --- */}
        <section className="image-complexity-grid">
          
          {/* Best Case Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Bubble Sort</span>
            <span className="image-card-title">Best Case</span>
            <span className="image-card-complexity">O(n)</span>
          </div>

          {/* Average Case Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Bubble Sort</span>
            <span className="image-card-title">Average Case</span>
            <span className="image-card-complexity">O(n²)</span>
          </div>

          {/* Worst Case Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Bubble Sort</span>
            <span className="image-card-title">Worst Case</span>
            <span className="image-card-complexity">O(n²)</span>
          </div>

          {/* Memory / Auxiliary Space Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Auxiliary Space</span>
            <span className="image-card-title">Memory</span>
            <span className="image-card-complexity">O(1)</span>
          </div>

        </section>

        {/* --- Multi-Column Lower Workspace Panels (Code & Execution Logs) --- */}
        <div className="lower-content-area">
          
          {/* Left Block: Dynamic Synchronized Code Highlighter */}
          <section className="workspace-section">
            <h2 className="section-title">
              <span className="flex items-center gap-1.5">
                <BookOpen size={18} className="text-cyan-400" /> Code Highlight
              </span>
            </h2>
            <div className="panel-block code-block">
              <pre>
                <code>
                  {codeLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`code-line
                        ${activeLine === (idx + 1) ? 'highlight' : ''}
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

          {/* Right Block: Live Log Streams Terminal */}
          <section className="workspace-section">
            <h2 className="section-title">
              <span className="flex items-center gap-1.5">
                <Activity size={18} className="text-cyan-400" /> Log Streams
              </span>
            </h2>
            <div className="panel-block" ref={logContainerRef}>
              <ul className="log-list">
                {currentStep.logs.length === 0 && (
                  <li className="log-item text-gray-500">Awaiting steps to build...</li>
                )}
                {currentStep.logs.map((log, idx) => (
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