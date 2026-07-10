import React, { useState, useRef, useEffect } from 'react';
import { 
  Gauge, 
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

    /* --- Input Elements, Sliders --- */
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

    /* --- Button Triggers --- */
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

    /* --- Main Content Workspace --- */
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

    /* --- Stats Metrics Cards Panel --- */
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

    /* --- Visual Box Canvas Structure --- */
    .visualization-boxes {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 3rem 1rem 1.5rem 1rem;
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
      position: relative;
    }

    .box-wrapper.no-transition {
      transition: none;
    }

    .box-wrapper.faded {
      opacity: 0.3;
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
      position: relative;
    }

    .box-index {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-gray-400);
    }

    /* Pointers labels rendering beautifully above boxes */
    .pointer-label {
      position: absolute;
      top: -1.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.1rem 0.35rem;
      border-radius: 0.25rem;
      opacity: 0.95;
      z-index: 20;
    }

    .pointer-label.i-pointer {
      background-color: var(--yellow-400);
      color: black;
      left: -0.5rem;
    }
    .pointer-label.j-pointer {
      background-color: var(--orange-500);
      color: white;
      right: -0.5rem;
    }
    .pointer-label.pivot-pointer {
      background-color: var(--pink-500);
      color: white;
      left: 50%;
      transform: translateX(-50%);
    }

    /* States colors */
    .box.default {
      background-color: var(--bg-dark-600);
      color: white;
      border-color: var(--border-gray-500);
    }

    .box.pivot {
      background-color: var(--pink-600);
      color: white;
      border-color: var(--pink-500);
      box-shadow: 0 0 10px var(--pink-500);
    }

    .box.comparing {
      background-color: var(--cyan-500);
      color: white;
      border-color: var(--cyan-400);
      transform: scale(1.08);
    }
    
    .box.swapping {
      background-color: var(--red-500);
      color: white;
      border-color: var(--red-400);
      transform: scale(1.12);
      box-shadow: 0 0 10px var(--red-500);
    }

    .box.sorted {
      background-color: var(--green-600);
      color: white;
      border-color: var(--green-500);
      opacity: 0.85;
    }

    /* --- Interactive Playback Panel --- */
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

    /* --- Timeline Scrubber Range --- */
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

    /* --- Side-by-Side Code and Log Panels --- */
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

    /* Code highlighters */
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

    /* Log list */
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

    /* --- Exact Complexity Grid verbatim image_0c0bc2.png --- */
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

// --- Code Snippets Databases ---
const codeSnippets = {
  python: `
def quick_sort(arr, low, high):
    if low < high:
        # pi is partitioning index
        pi = partition(arr, low, high)

        # Sort elements before and after partition
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    
    # i is the index of smaller element
    i = low - 1 

    for j in range(low, high):
        # If current element is smaller than pivot
        if arr[j] < pivot:
            i += 1
            # Swap arr[i] and arr[j]
            arr[i], arr[j] = arr[j], arr[i]
            
    # Swap arr[i+1] and arr[high] (pivot)
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
`,
  javascript: `
function quickSort(arr, low, high) {
  if (low < high) {
    // pi is partitioning index
    let pi = partition(arr, low, high);

    // Sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  let pivot = arr[high];
  
  // i is the index of smaller element
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // If current element is smaller than pivot
    if (arr[j] < pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Swap arr[i+1] and arr[high] (pivot)
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
`,
  java: `
void quickSort(int arr[], int low, int high) {
  if (low < high) {
    // pi is partitioning index
    int pi = partition(arr, low, high);

    // Sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

int partition(int arr[], int low, int high) {
  // Choose the rightmost element as pivot
  int pivot = arr[high];
  
  // i is the index of smaller element
  int i = low - 1;

  for (int j = low; j < high; j++) {
    // If current element is smaller than pivot
    if (arr[j] < pivot) {
      i++;
      // Swap arr[i] and arr[j]
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  // Swap arr[i+1] and arr[high] (pivot)
  int temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}
`,
  cpp: `
void swap(int* a, int* b) {
  int t = *a; *a = *b; *b = t;
}

int partition(int arr[], int low, int high) {
  int pivot = arr[high]; // pivot
  int i = (low - 1); // Index of smaller element

  for (int j = low; j <= high - 1; j++) {
    // If current element is smaller than pivot
    if (arr[j] < pivot) {
      i++; // increment index of smaller element
      swap(&arr[i], &arr[j]);
    }
  }
  swap(&arr[i + 1], &arr[high]);
  return (i + 1);
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
`
};

const getHighlightLine = (stepType, lang) => {
  const mappings = {
    python: {
      quicksort_call: 3,
      partition_start: 13,
      i_init: 16,
      j_loop: 18,
      compare: 20,
      i_increment: 21,
      swap_inner: 23,
      swap_inner_snap: 23,
      swap_pivot: 26,
      pivot_sorted: 27,
      sorted_single: 3
    },
    javascript: {
      quicksort_call: 3,
      partition_start: 12,
      i_init: 15,
      j_loop: 17,
      compare: 19,
      i_increment: 20,
      swap_inner: 22,
      swap_inner_snap: 22,
      swap_pivot: 27,
      pivot_sorted: 28,
      sorted_single: 3
    },
    java: {
      quicksort_call: 3,
      partition_start: 12,
      i_init: 15,
      j_loop: 17,
      compare: 19,
      i_increment: 20,
      swap_inner: 23,
      swap_inner_snap: 23,
      swap_pivot: 29,
      pivot_sorted: 32,
      sorted_single: 3
    },
    cpp: {
      quicksort_call: 23,
      partition_start: 6,
      i_init: 7,
      j_loop: 9,
      compare: 11,
      i_increment: 12,
      swap_inner: 13,
      swap_inner_snap: 13,
      swap_pivot: 16,
      pivot_sorted: 17,
      sorted_single: 23
    }
  };
  return mappings[lang]?.[stepType] ?? -1;
};

export default function App() {
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [randomSize, setRandomSize] = useState(8);
  const [arrayStr, setArrayStr] = useState("7, 2, 1, 6, 8, 5, 3, 4");
  const [error, setError] = useState(null);

  // Precomputed Step states
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
      setError("Please use 20 elements or less for optimal visual mapping.");
      return null;
    }

    return arr;
  };

  const buildQuickSortSteps = (arr) => {
    const stepsList = [];
    const logs = ["Visualization compiled. Ready to run."];
    const deepCopy = (items) => items.map(item => ({ ...item }));

    let boxes = arr.map((value, index) => ({
      value,
      id: `box-${index}`,
      state: 'default',
      isPivot: false,
      isIPointer: false,
      isJPointer: false,
      isFaded: false,
      translateX: 0,
      noTransition: false
    }));

    let swapsCount = 0;
    let comparisonsCount = 0;

    // Push initial step 0
    stepsList.push({
      boxes: deepCopy(boxes),
      status: "Enter an array, then press Play or Step Forward.",
      stepType: 'idle',
      logs: [...logs],
      swaps: 0,
      comparisons: 0
    });

    const runQuickSort = (low, high) => {
      logs.push(`QuickSort call on range [${low}..${high}]`);
      
      // Set Focus faded states
      let focusBoxes = deepCopy(boxes);
      focusBoxes.forEach((b, idx) => {
        b.isFaded = (idx < low || idx > high);
      });

      stepsList.push({
        boxes: focusBoxes,
        status: `QuickSort recursion check: low (${low}) < high (${high})?`,
        stepType: 'quicksort_call',
        logs: [...logs],
        swaps: swapsCount,
        comparisons: comparisonsCount
      });

      if (low < high) {
        // Selection of pivot element
        let pivotBoxes = deepCopy(boxes);
        pivotBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
        pivotBoxes[high].isPivot = true;
        logs.push(`Partition: choosing pivot index [${high}] (value: ${boxes[high].value}).`);

        stepsList.push({
          boxes: pivotBoxes,
          status: `Partition: Choosing rightmost element ${boxes[high].value} as pivot.`,
          stepType: 'partition_start',
          logs: [...logs],
          swaps: swapsCount,
          comparisons: comparisonsCount
        });

        const pivotValue = boxes[high].value;
        let i = low - 1;

        // Initialize i index pointer
        let iInitBoxes = deepCopy(boxes);
        iInitBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
        iInitBoxes[high].isPivot = true;
        if (i >= 0 && i < iInitBoxes.length) {
          iInitBoxes[i].isIPointer = true;
        }
        logs.push(`Initialized element tracker index i = ${i}.`);

        stepsList.push({
          boxes: iInitBoxes,
          status: `Initializing smaller element pointer i to index: low - 1 (${i}).`,
          stepType: 'i_init',
          logs: [...logs],
          swaps: swapsCount,
          comparisons: comparisonsCount
        });

        for (let j = low; j < high; j++) {
          // Loop pointers update
          let jLoopBoxes = deepCopy(boxes);
          jLoopBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
          jLoopBoxes[high].isPivot = true;
          if (i >= low && i < jLoopBoxes.length) jLoopBoxes[i].isIPointer = true;
          jLoopBoxes[j].isJPointer = true;

          stepsList.push({
            boxes: jLoopBoxes,
            status: `Looping variable j at index [${j}] (value: ${boxes[j].value}).`,
            stepType: 'j_loop',
            logs: [...logs],
            swaps: swapsCount,
            comparisons: comparisonsCount
          });

          // Comparison step
          comparisonsCount++;
          let compareBoxes = deepCopy(boxes);
          compareBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
          compareBoxes[high].isPivot = true;
          if (i >= low && i < compareBoxes.length) compareBoxes[i].isIPointer = true;
          compareBoxes[j].isJPointer = true;
          compareBoxes[j].state = 'comparing';
          compareBoxes[high].state = 'comparing';
          logs.push(`Compare: is index [${j}] (${boxes[j].value}) < pivot (${pivotValue})?`);

          stepsList.push({
            boxes: compareBoxes,
            status: `Comparing: Is ${boxes[j].value} < pivot ${pivotValue}? ${boxes[j].value < pivotValue ? 'Yes' : 'No'}.`,
            stepType: 'compare',
            logs: [...logs],
            swaps: swapsCount,
            comparisons: comparisonsCount
          });

          if (boxes[j].value < pivotValue) {
            i++;
            // Increment pointer i
            let iIncBoxes = deepCopy(boxes);
            iIncBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
            iIncBoxes[high].isPivot = true;
            if (i >= low && i < iIncBoxes.length) iIncBoxes[i].isIPointer = true;
            iIncBoxes[j].isJPointer = true;
            logs.push(`Condition met. Incrementing pointer i to index ${i}.`);

            stepsList.push({
              boxes: iIncBoxes,
              status: `Incremented smaller element index pointer i to ${i}.`,
              stepType: 'i_increment',
              logs: [...logs],
              swaps: swapsCount,
              comparisons: comparisonsCount
            });

            if (i !== j) {
              swapsCount++;
              // Swap translation animation step
              let swapDispBoxes = deepCopy(boxes);
              swapDispBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
              swapDispBoxes[high].isPivot = true;
              swapDispBoxes[i].isIPointer = true;
              swapDispBoxes[j].isJPointer = true;
              swapDispBoxes[i].state = 'swapping';
              swapDispBoxes[j].state = 'swapping';
              
              const gapVal = (j - i) * 4; // computed horizontal shift mapping
              swapDispBoxes[i].translateX = `${gapVal}rem`;
              swapDispBoxes[j].translateX = `-${gapVal}rem`;
              logs.push(`Swap: swapping element arr[${i}] (${boxes[i].value}) and arr[${j}] (${boxes[j].value}).`);

              stepsList.push({
                boxes: swapDispBoxes,
                status: `Swapping element arr[${i}] (${boxes[i].value}) and arr[${j}] (${boxes[j].value}).`,
                stepType: 'swap_inner',
                logs: [...logs],
                swaps: swapsCount,
                comparisons: comparisonsCount
              });

              // Swap in logical array
              [boxes[i], boxes[j]] = [boxes[j], boxes[i]];

              // Instant visual snap step
              let snappedBoxes = deepCopy(boxes);
              snappedBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
              snappedBoxes[high].isPivot = true;
              snappedBoxes[i].isIPointer = true;
              snappedBoxes[j].isJPointer = true;
              snappedBoxes[i].state = 'swapping';
              snappedBoxes[j].state = 'swapping';
              snappedBoxes[i].noTransition = true;
              snappedBoxes[j].noTransition = true;

              stepsList.push({
                boxes: snappedBoxes,
                status: `Completed swap inside memory array.`,
                stepType: 'swap_inner_snap',
                logs: [...logs],
                swaps: swapsCount,
                comparisons: comparisonsCount
              });
            }
          }
        }

        // Swap pivot with i + 1 element
        const pi = i + 1;
        swapsCount++;

        let pivotSwapBoxes = deepCopy(boxes);
        pivotSwapBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
        pivotSwapBoxes[high].isPivot = true;
        if (i >= low && i < pivotSwapBoxes.length) pivotSwapBoxes[i].isIPointer = true;
        pivotSwapBoxes[pi].state = 'swapping';
        pivotSwapBoxes[high].state = 'swapping';

        const gapVal = (high - pi) * 4;
        pivotSwapBoxes[pi].translateX = `${gapVal}rem`;
        pivotSwapBoxes[high].translateX = `-${gapVal}rem`;
        logs.push(`Swap: placing pivot at correct sorted index. Swapping arr[${pi}] (${boxes[pi].value}) and pivot (${pivotValue}).`);

        stepsList.push({
          boxes: pivotSwapBoxes,
          status: `Placing pivot to its final position: Swap arr[${pi}] (${boxes[pi].value}) and pivot (${pivotValue}).`,
          stepType: 'swap_pivot',
          logs: [...logs],
          swaps: swapsCount,
          comparisons: comparisonsCount
        });

        // Swap logically
        [boxes[pi], boxes[high]] = [boxes[high], boxes[pi]];

        // Mark pivot index as permanently sorted
        boxes[pi].state = 'sorted';
        boxes[pi].isPivot = false;

        let pivotSortedBoxes = deepCopy(boxes);
        pivotSortedBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
        pivotSortedBoxes[pi].noTransition = true;
        pivotSortedBoxes[high].noTransition = true;
        logs.push(`Pivot element ${pivotValue} is now placed in its sorted index [${pi}].`);

        stepsList.push({
          boxes: pivotSortedBoxes,
          status: `Pivot element ${pivotValue} is now placed in its sorted index [${pi}].`,
          stepType: 'pivot_sorted',
          logs: [...logs],
          swaps: swapsCount,
          comparisons: comparisonsCount
        });

        // Recurse left
        runQuickSort(low, pi - 1);
        // Recurse right
        runQuickSort(pi + 1, high);
      } else {
        // Base single element sorted
        if (low === high && low < boxes.length) {
          boxes[low].state = 'sorted';
          let sortedSingleBoxes = deepCopy(boxes);
          sortedSingleBoxes.forEach((b, idx) => b.isFaded = (idx < low || idx > high));
          logs.push(`Sub-array of size 1 at index [${low}] is trivially sorted.`);

          stepsList.push({
            boxes: sortedSingleBoxes,
            status: `Trivial subarray index [${low}] contains single element. Sorted.`,
            stepType: 'sorted_single',
            logs: [...logs],
            swaps: swapsCount,
            comparisons: comparisonsCount
          });
        }
      }
    };

    runQuickSort(0, boxes.length - 1);

    // Clean up final sorted state
    let finalSortedBoxes = deepCopy(boxes);
    finalSortedBoxes.forEach(b => {
      b.state = 'sorted';
      b.isPivot = false;
      b.isIPointer = false;
      b.isJPointer = false;
      b.isFaded = false;
    });
    logs.push("Sorting complete! Quick Sort visualization successfully completed.");

    stepsList.push({
      boxes: finalSortedBoxes,
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
      const compiledSteps = buildQuickSortSteps(arr);
      setSteps(compiledSteps);
      setCurrentStepIdx(0);
    } else {
      setSteps([]);
    }
    setIsPlaying(false);
  }, [arrayStr]);

  // Cleanup autoplay active timer
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

  // Dynamic autoscroll stream log panel
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
    : (currentStep.status.includes("Comparing") || currentStep.status.includes("Swapping") || currentStep.status.includes("Partition"))
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
      
      {/* --- Controls Configuration Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <Gauge size={30} />
          Quick Sort
        </h1>

        {/* Custom Array Value Entries */}
        <div className="input-group">
          <label htmlFor="array">Custom Array Values</label>
          <textarea
            id="array"
            placeholder="e.g., 7, 2, 1, 6, 8"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isPlaying}
            rows="3"
            className="input-field textarea-field"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* Playback action items */}
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

        {/* Custom Random Size Slider */}
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

        {/* Random Generator */}
        <button
          onClick={handleRandomArrayGeneration}
          disabled={isPlaying}
          className="btn btn-random"
        >
          <Shuffle size={18} />
          Generate Random Array
        </button>

        {/* Synced Target Language Mirror */}
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

        {/* Autoplay Delay Control */}
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

      {/* --- STREAMING_CHUNK: Rendering workspace visualization panels... */}
      <main className="main-content">
        
        {/* Workspace Canvas Arena */}
        <section className="visualization-section">
          <h2 className="section-title">
            Sorting Workspace
            <span className="text-xs text-gray-500 font-mono">
              Step Mode Active
            </span>
          </h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {currentStep.status}
            </span>
          </div>

          {/* Centered statistics done widgets */}
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
          
          {/* Custom Array Elements Grid */}
          <div className="visualization-boxes">
            {currentStep.boxes.map((box, idx) => (
              <div 
                key={`${box.id}-${idx}`} 
                id={box.id}
                className={`box-wrapper ${box.noTransition ? 'no-transition' : ''} ${box.isFaded ? 'faded' : ''}`} 
                style={{ transform: `translateX(${box.translateX || 0})` }}
              >
                <div className={`box ${box.state} ${box.isPivot ? 'pivot' : ''}`}>
                  {box.isIPointer && <span className="pointer-label i-pointer">i</span>}
                  {box.isJPointer && <span className="pointer-label j-pointer">j</span>}
                  {box.isPivot && <span className="pointer-label pivot-pointer">pivot</span>}
                  {box.value}
                </div>
                <span className="box-index">[{idx}]</span>
              </div>
            ))}
          </div>

          {/* Stepping Playback Control panel */}
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

          {/* Range Slider Scrubber timeline */}
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

        {/* --- STREAMING_CHUNK: Rendering verbatim complexity grid cards from image_0c0bc2.png --- */}
        <section className="image-complexity-grid">
          
          {/* Best Case Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Quick Sort</span>
            <span className="image-card-title">Best Case</span>
            <span className="image-card-complexity">O(n log n)</span>
          </div>

          {/* Average Case Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Quick Sort</span>
            <span className="image-card-title">Average Case</span>
            <span className="image-card-complexity">O(n log n)</span>
          </div>

          {/* Worst Case Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Quick Sort</span>
            <span className="image-card-title">Worst Case</span>
            <span className="image-card-complexity">O(n²)</span>
          </div>

          {/* Memory Complexity Card */}
          <div className="image-complexity-card">
            <span className="image-card-header">Auxiliary Space</span>
            <span className="image-card-title">Memory</span>
            <span className="image-card-complexity">O(log n)</span>
          </div>

        </section>

        {/* --- Side-by-Side Multi-column workspace panels (Code Mirror & Execution Logs) --- */}
        <div className="lower-content-area">
          
          {/* Interactive Code Highlighter panel */}
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

          {/* Live stream logs panel */}
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