import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Pause, Play, Shuffle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

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
      
      --pink-500: #ec4899;
      --pink-600: #db2777;
    }

    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
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

    /* --- Visual Flowchart Canvas --- */
    .visualization-canvas-wrapper {
      background-color: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-x: auto;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      position: relative;
    }

    .visual-tree-svg {
      width: 100%;
      max-width: 800px;
      height: auto;
      min-height: 520px;
    }

    /* --- Node Block Styling --- */
    .tree-node-group {
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    }

    .tree-node-box {
      stroke: var(--border-gray-600);
      stroke-width: 1.5;
      rx: 4;
      ry: 4;
      transition: fill 0.3s, stroke 0.3s, filter 0.3s;
    }

    .tree-node-box.state-default {
      fill: #4e8ff3; /* Classic blue from image_78161c */
      stroke: #3b82f6;
    }

    .tree-node-box.state-inactive {
      fill: rgba(31, 41, 55, 0.4);
      stroke: var(--border-gray-600);
      stroke-dasharray: 4,4;
    }

    .tree-node-box.state-active {
      fill: #3b82f6;
      stroke: var(--cyan-400);
      filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.6));
    }

    .tree-node-box.state-comparing {
      fill: var(--orange-500);
      stroke: var(--orange-600);
      filter: drop-shadow(0 0 4px var(--orange-500));
    }

    .tree-node-box.state-placing {
      fill: var(--green-500);
      stroke: var(--green-400);
      filter: drop-shadow(0 0 6px var(--green-400));
    }

    .tree-node-box.state-sorted {
      fill: var(--green-600);
      stroke: var(--green-500);
    }

    .tree-node-box.state-faded {
      fill: rgba(78, 143, 243, 0.35);
      stroke: rgba(59, 130, 246, 0.3);
    }

    .tree-node-text {
      font-size: 13px;
      font-weight: 700;
      fill: white;
      text-anchor: middle;
      dominant-baseline: middle;
      user-select: none;
    }

    .tree-node-text.state-inactive {
      fill: var(--text-gray-500);
    }

    /* --- Flow Connectors --- */
    .connector-line {
      stroke: #cbd5e1; /* Smooth grey arrow from diagram */
      stroke-width: 1.5;
      fill: none;
      transition: stroke 0.3s, stroke-width 0.3s;
    }

    .connector-line.active {
      stroke: var(--cyan-400);
      stroke-width: 2.2;
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

/* --- Code Snippets Databases --- */
const codeSnippets = {
  python: `
def merge_sort(arr, l, r):
    if l < r:
        # Find the middle point
        m = (l + r) // 2

        # Sort first and second halves
        merge_sort(arr, l, m)
        merge_sort(arr, m + 1, r)

        # Merge the sorted halves
        merge(arr, l, m, r)

def merge(arr, l, m, r):
    n1 = m - l + 1
    n2 = r - m
    L, R = arr[l : m+1], arr[m+1 : r+1]

    i = j = 0
    k = l
    while i < n1 and j < n2:
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1

    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1

    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1
`,
  javascript: `
function mergeSort(arr, l, r) {
  if (l < r) {
    // Find the middle point
    let m = Math.floor(l + (r - l) / 2);

    // Sort first and second halves
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);

    // Merge the sorted halves
    merge(arr, l, m, r);
  }
}

function merge(arr, l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = arr.slice(l, m + 1);
  let R = arr.slice(m + 1, r + 1);

  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    i++; k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    j++; k++;
  }
}
`,
  java: `
void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    // Find the middle point
    int m = (l + r) / 2;

    // Sort first and second halves
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);

    // Merge the sorted halves
    merge(arr, l, m, r);
  }
}

void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;
  int L[] = new int[n1];
  int R[] = new int[n2];
  System.arraycopy(arr, l, L, 0, n1);
  System.arraycopy(arr, m + 1, R, 0, n2);

  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    i++; k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    j++; k++;
  }
}
`,
  cpp: `
void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;
  int* L = new int[n1];
  int* R = new int[n2];
  for(int i=0; i<n1; i++) L[i] = arr[l + i];
  for(int j=0; j<n2; j++) R[j] = arr[m + 1 + j];

  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  while (i < n1) {
    arr[k] = L[i];
    i++; k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    j++; k++;
  }
  delete[] L;
  delete[] R;
}

void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}
`
};

const getHighlightLine = (stepType, lang) => {
  const mappings = {
    python: {
      idle: -1,
      sorted_single: 3,
      divide: 5,
      merge_start: 11,
      merge_init: 15,
      compare: 21,
      place: 22,
      place_left: 30,
      place_right: 35,
      paint_back: 11,
      merge_done: 11
    },
    javascript: {
      idle: -1,
      sorted_single: 3,
      divide: 5,
      merge_start: 11,
      merge_init: 17,
      compare: 21,
      place: 22,
      place_left: 31,
      place_right: 35,
      paint_back: 11,
      merge_done: 11
    },
    java: {
      idle: -1,
      sorted_single: 2,
      divide: 4,
      merge_start: 10,
      merge_init: 16,
      compare: 22,
      place: 23,
      place_left: 32,
      place_right: 36,
      paint_back: 10,
      merge_done: 10
    },
    cpp: {
      idle: -1,
      sorted_single: 34,
      divide: 35,
      merge_start: 38,
      merge_init: 8,
      compare: 11,
      place: 12,
      place_left: 20,
      place_right: 24,
      paint_back: 38,
      merge_done: 38
    }
  };
  return mappings[lang]?.[stepType] ?? -1;
};

const buildSplitNodes = (l, r, maxDepth) => {
  const nodes = [];
  const traverse = (currL, currR, level) => {
    nodes.push({
      l: currL,
      r: currR,
      level,
      id: `split-${level}-${currL}-${currR}`,
      type: 'split'
    });
    if (currL < currR) {
      let m = Math.floor(currL + (currR - currL) / 2);
      traverse(currL, m, level + 1);
      traverse(m + 1, currR, level + 1);
    } else if (level < maxDepth) {
      traverse(currL, currR, level + 1);
    }
  };
  traverse(l, r, 0);
  return nodes;
};

const buildMergeNodes = (splitNodes, maxDepth) => {
  return splitNodes
    .filter(n => n.level < maxDepth)
    .map(n => ({
      ...n,
      id: `merge-${n.level}-${n.l}-${n.r}`,
      type: 'merge'
    }));
};

const calculateMaxDepth = (l, r, depth = 0) => {
  if (l >= r) return depth;
  let m = Math.floor(l + (r - l) / 2);
  return Math.max(
    calculateMaxDepth(l, m, depth + 1),
    calculateMaxDepth(m + 1, r, depth + 1)
  );
};

export default function App() {
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [randomSize, setRandomSize] = useState(6);
  // Prefilled array string matching image_78161c exactly for initial impact
  const [arrayStr, setArrayStr] = useState("6, 5, 12, 10, 9, 1");
  const [error, setError] = useState(null);

  // Precomputed Step States
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Structural details
  const [splitTree, setSplitTree] = useState([]);
  const [mergeTree, setMergeTree] = useState([]);
  const [maxDepthVal, setMaxDepthVal] = useState(0);

  const logContainerRef = useRef(null);
  const timerRef = useRef(null);

  const buildMergeSortFlowSteps = (arr) => {
    const maxDepth = calculateMaxDepth(0, arr.length - 1);
    const splitNodes = buildSplitNodes(0, arr.length - 1, maxDepth);
    const mergeNodes = buildMergeNodes(splitNodes, maxDepth);

    const stepsList = [];
    const logs = ["Tree compiled. Ready to simulate."];

    // Build absolute initial states for each node
    const currentSplitStates = {};
    const currentMergeStates = {};

    splitNodes.forEach(node => {
      currentSplitStates[node.id] = {
        values: arr.slice(node.l, node.r + 1),
        state: 'default',
        activeIndices: []
      };
    });

    mergeNodes.forEach(node => {
      currentMergeStates[node.id] = {
        values: [],
        state: 'inactive',
        activeIndices: []
      };
    });

    let comparisonsCount = 0;
    let placementsCount = 0;

    const deepCopyStates = (splits, merges) => {
      const spCopy = {};
      const mrCopy = {};
      Object.keys(splits).forEach(k => {
        spCopy[k] = { ...splits[k], values: [...splits[k].values], activeIndices: [...splits[k].activeIndices] };
      });
      Object.keys(merges).forEach(k => {
        mrCopy[k] = { ...merges[k], values: [...merges[k].values], activeIndices: [...merges[k].activeIndices] };
      });
      return { spCopy, mrCopy };
    };

    const pushStep = (status, stepType, activeNodeId = null) => {
      const { spCopy, mrCopy } = deepCopyStates(currentSplitStates, currentMergeStates);
      stepsList.push({
        splitStates: spCopy,
        mergeStates: mrCopy,
        activeNodeId,
        status,
        stepType,
        logs: [...logs],
        comparisons: comparisonsCount,
        swaps: placementsCount
      });
    };

    // First static step
    pushStep("Input loaded. Press Play or Step Forward to visualize.", "idle");

    const runFlowMergeSort = (l, r, level) => {
      const splitId = `split-${level}-${l}-${r}`;
      currentSplitStates[splitId].state = 'active';
      logs.push(`Split Phase: Focusing range [${l}..${r}] at level ${level}.`);
      pushStep(`Splitting range [${l}..${r}]...`, 'divide', splitId);

      if (l >= r) {
        currentSplitStates[splitId].state = 'default';
        return;
      }

      let m = Math.floor(l + (r - l) / 2);
      currentSplitStates[splitId].state = 'default';

      runFlowMergeSort(l, m, level + 1);
      runFlowMergeSort(m + 1, r, level + 1);

      // Sourcing pointers for merge
      const leftSrcId = (level + 1 === maxDepth) ? `split-${maxDepth}-${l}-${m}` : `merge-${level+1}-${l}-${m}`;
      const rightSrcId = (level + 1 === maxDepth) ? `split-${maxDepth}-${m+1}-${r}` : `merge-${level+1}-${m+1}-${r}`;
      const targetMergeId = `merge-${level}-${l}-${r}`;

      // Mark sources as focused and target as active empty container
      if (currentSplitStates[leftSrcId]) currentSplitStates[leftSrcId].state = 'active';
      if (currentSplitStates[rightSrcId]) currentSplitStates[rightSrcId].state = 'active';
      if (currentMergeStates[leftSrcId]) currentMergeStates[leftSrcId].state = 'active';
      if (currentMergeStates[rightSrcId]) currentMergeStates[rightSrcId].state = 'active';

      currentMergeStates[targetMergeId].state = 'active';
      currentMergeStates[targetMergeId].values = [];

      logs.push(`Conquer Phase: Merging sub-arrays [${l}..${m}] and [${m+1}..${r}] into target merge node.`);
      pushStep(`Conquer: Preparing to merge Left [${l}..${m}] and Right [${m+1}..${r}]...`, 'merge_start', targetMergeId);

      const leftVals = (level + 1 === maxDepth) ? currentSplitStates[leftSrcId].values : currentMergeStates[leftSrcId].values;
      const rightVals = (level + 1 === maxDepth) ? currentSplitStates[rightSrcId].values : currentMergeStates[rightSrcId].values;

      let i = 0, j = 0;
      const tempSorted = [];

      while (i < leftVals.length && j < rightVals.length) {
        comparisonsCount++;

        // Visual comparing indicators
        if (currentSplitStates[leftSrcId]) currentSplitStates[leftSrcId].activeIndices = [i];
        if (currentSplitStates[rightSrcId]) currentSplitStates[rightSrcId].activeIndices = [j];
        if (currentMergeStates[leftSrcId]) currentMergeStates[leftSrcId].activeIndices = [i];
        if (currentMergeStates[rightSrcId]) currentMergeStates[rightSrcId].activeIndices = [j];

        if (currentSplitStates[leftSrcId]) currentSplitStates[leftSrcId].state = 'comparing';
        if (currentSplitStates[rightSrcId]) currentSplitStates[rightSrcId].state = 'comparing';
        if (currentMergeStates[leftSrcId]) currentMergeStates[leftSrcId].state = 'comparing';
        if (currentMergeStates[rightSrcId]) currentMergeStates[rightSrcId].state = 'comparing';

        logs.push(`Compare: Left value ${leftVals[i]} vs Right value ${rightVals[j]}.`);
        pushStep(`Comparing elements: ${leftVals[i]} (Left) and ${rightVals[j]} (Right).`, 'compare', targetMergeId);

        let winner;
        if (leftVals[i] <= rightVals[j]) {
          winner = leftVals[i];
          i++;
        } else {
          winner = rightVals[j];
          j++;
        }

        placementsCount++;
        tempSorted.push(winner);
        currentMergeStates[targetMergeId].values = [...tempSorted];
        currentMergeStates[targetMergeId].activeIndices = [tempSorted.length - 1];

        // Reset compare state
        if (currentSplitStates[leftSrcId]) currentSplitStates[leftSrcId].state = 'active';
        if (currentSplitStates[rightSrcId]) currentSplitStates[rightSrcId].state = 'active';
        if (currentMergeStates[leftSrcId]) currentMergeStates[leftSrcId].state = 'active';
        if (currentMergeStates[rightSrcId]) currentMergeStates[rightSrcId].state = 'active';

        if (currentSplitStates[leftSrcId]) currentSplitStates[leftSrcId].activeIndices = [];
        if (currentSplitStates[rightSrcId]) currentSplitStates[rightSrcId].activeIndices = [];
        if (currentMergeStates[leftSrcId]) currentMergeStates[leftSrcId].activeIndices = [];
        if (currentMergeStates[rightSrcId]) currentMergeStates[rightSrcId].activeIndices = [];

        logs.push(`Placed smaller element ${winner} into target sorted sub-array.`);
        pushStep(`Selected ${winner} and placed it into the sorted sub-array.`, 'place', targetMergeId);
        currentMergeStates[targetMergeId].activeIndices = [];
      }

      while (i < leftVals.length) {
        placementsCount++;
        let winner = leftVals[i];
        tempSorted.push(winner);
        currentMergeStates[targetMergeId].values = [...tempSorted];
        currentMergeStates[targetMergeId].activeIndices = [tempSorted.length - 1];
        i++;

        logs.push(`Copy Left remaining element ${winner} to target sub-array.`);
        pushStep(`Moving remaining Left element ${winner} to the sorted sub-array.`, 'place_left', targetMergeId);
        currentMergeStates[targetMergeId].activeIndices = [];
      }

      while (j < rightVals.length) {
        placementsCount++;
        let winner = rightVals[j];
        tempSorted.push(winner);
        currentMergeStates[targetMergeId].values = [...tempSorted];
        currentMergeStates[targetMergeId].activeIndices = [tempSorted.length - 1];
        j++;

        logs.push(`Copy Right remaining element ${winner} to target sub-array.`);
        pushStep(`Moving remaining Right element ${winner} to the sorted sub-array.`, 'place_right', targetMergeId);
        currentMergeStates[targetMergeId].activeIndices = [];
      }

      // Restore backgrounds to sorted
      if (currentSplitStates[leftSrcId]) currentSplitStates[leftSrcId].state = 'default';
      if (currentSplitStates[rightSrcId]) currentSplitStates[rightSrcId].state = 'default';
      if (currentMergeStates[leftSrcId]) currentMergeStates[leftSrcId].state = 'default';
      if (currentMergeStates[rightSrcId]) currentMergeStates[rightSrcId].state = 'default';

      currentMergeStates[targetMergeId].state = 'sorted';
      logs.push(`Successfully merged segment covering indexes [${l}..${r}].`);
      pushStep(`Successfully merged range [${l}..${r}].`, 'merge_done', targetMergeId);
    };

    runFlowMergeSort(0, arr.length - 1, 0);

    // Final complete sorted step
    logs.push("Sorting fully completed! All nodes in merge tree solved.");
    const finalSplitCopy = {};
    const finalMergeCopy = {};
    splitNodes.forEach(node => {
      finalSplitCopy[node.id] = { values: arr.slice(node.l, node.r + 1), state: 'default', activeIndices: [] };
    });
    mergeNodes.forEach(node => {
      finalMergeCopy[node.id] = { values: arr.slice(node.l, node.r + 1), state: 'sorted', activeIndices: [] };
    });
    stepsList.push({
      splitStates: finalSplitCopy,
      mergeStates: finalMergeCopy,
      activeNodeId: null,
      status: `Sorting complete! Total Comparisons: ${comparisonsCount}, Placements: ${placementsCount}.`,
      stepType: 'idle',
      logs: [...logs],
      comparisons: comparisonsCount,
      swaps: placementsCount
    });

    return { stepsList, splitNodes, mergeNodes, maxDepth };
  };

  useEffect(() => {
    setError(null);
    const arr = arrayStr
      .split(/[, ]+/)
      .map(Number)
      .filter((num) => !isNaN(num));

    if (!arr.length) {
      setError("Please enter a valid, non-empty array of numbers.");
      setSteps([]);
      return;
    }
    
    if (arr.length > 8) {
      setError("Please use 8 elements or less for clear flowchart visualization.");
      setSteps([]);
      return;
    }

    // Safely generate flowchart sequence steps
    const { stepsList, splitNodes, mergeNodes, maxDepth } = buildMergeSortFlowSteps(arr);
    setSplitTree(splitNodes);
    setMergeTree(mergeNodes);
    setMaxDepthVal(maxDepth);
    setSteps(stepsList);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [arrayStr]);

  // Autoplay handler cleanup
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
    splitStates: {},
    mergeStates: {},
    status: "No steps loaded.",
    stepType: 'idle',
    logs: [],
    swaps: 0,
    comparisons: 0
  };

  const statusColor = currentStep.status.includes("complete")
    ? "status-sorted"
    : (currentStep.status.includes("Comparing") || currentStep.status.includes("Placing") || currentStep.status.includes("Splitting"))
    ? "status-sorting"
    : isPlaying
    ? "status-sorting"
    : "status-default";

  const rawCode = codeSnippets[language] || "";
  const codeLines = rawCode.trim().split('\n');
  const activeLine = getHighlightLine(currentStep.stepType, language);

  // Pure SVG scaling width parameters
  const svgWidth = 800;
  const levelHeight = 75; 
  const topMargin = 40;
  const leftMargin = 55;
  const rightMargin = 55;
  const boxWidth = 32;
  const boxHeight = 28;

  // Pure state reading without mutating or setting values
  const parsedArray = arrayStr
    .split(/[, ]+/)
    .map(Number)
    .filter((num) => !isNaN(num));
  const N = parsedArray.length || 1;

  const getX = (l, r) => {
    const frac = N > 1 ? (l + r) / (2 * (N - 1)) : 0.5;
    return leftMargin + frac * (svgWidth - leftMargin - rightMargin);
  };

  const getY = (rowIdx) => {
    return topMargin + rowIdx * levelHeight;
  };

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <BookOpen size={30} />
          Merge Sort
        </h1>

        <div className="input-group">
          <label htmlFor="array">Custom Array Values</label>
          <textarea
            id="array"
            placeholder="e.g., 6, 5, 12, 10, 9, 1"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            disabled={isPlaying}
            rows="3"
            className="input-field textarea-field"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <div className="actions-grid">
          <button
            onClick={toggleAutoplay}
            disabled={!!error}
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

        <div className="input-group">
          <label htmlFor="random-size-slider">Random Array Size</label>
          <div className="speed-slider-group">
            <input
              id="random-size-slider"
              type="range"
              min="3"
              max="8"
              step="1"
              value={randomSize}
              onChange={(e) => setRandomSize(Number(e.target.value))}
              disabled={isPlaying}
              className="speed-slider"
            />
            <span className="speed-value">{randomSize} items</span>
          </div>
        </div>

        <button
          onClick={handleRandomArrayGeneration}
          disabled={isPlaying}
          className="btn btn-random"
        >
          <Shuffle size={18} />
          Generate Random Array
        </button>

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

      {/* --- Main Content Workspace --- */}
      <main className="main-content">
        
        <section className="visualization-section">
          <h2 className="section-title">
            Sorting Workspace
            <span className="text-xs text-gray-500 font-mono">
              Flowchart Mode Active
            </span>
          </h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {currentStep.status}
            </span>
          </div>

          <div className="stats-dashboard">
            <div className="stat-card">
              <span className="stat-label">Comparisons Done</span>
              <span className="stat-value">{currentStep.comparisons}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Placements Executed</span>
              <span className="stat-value">{currentStep.swaps}</span>
            </div>
          </div>
          
          {}
          <div className="visualization-canvas-wrapper">
            <svg 
              className="visual-tree-svg" 
              viewBox={`0 0 ${svgWidth} ${(maxDepthVal * 2 * levelHeight) + topMargin + 50}`}
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker 
                  id="arrow" 
                  viewBox="0 0 10 10" 
                  refX="6" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#cbd5e1" />
                </marker>
                <marker 
                  id="arrow-active" 
                  viewBox="0 0 10 10" 
                  refX="6" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--cyan-400)" />
                </marker>
              </defs>

              {/* --- Flow Connector Lines --- */}
              <g className="tree-connectors">
                {/* 1. Split Tree Connectors */}
                {splitTree.map((node) => {
                  if (node.level >= maxDepthVal) return null;
                  
                  const startX = getX(node.l, node.r);
                  const startY = getY(node.level) + boxHeight / 2;

                  if (node.l < node.r) {
                    const m = Math.floor(node.l + (node.r - node.l) / 2);
                    const leftX = getX(node.l, m);
                    const leftY = getY(node.level + 1) - boxHeight / 2;
                    const isLeftActive = currentStep.activeNodeId === `split-${node.level + 1}-${node.l}-${m}`;
                    
                    const rightX = getX(m + 1, node.r);
                    const rightY = getY(node.level + 1) - boxHeight / 2;
                    const isRightActive = currentStep.activeNodeId === `split-${node.level + 1}-${m + 1}-${node.r}`;

                    return (
                      <g key={`split-conns-${node.id}`}>
                        <line 
                          x1={startX} y1={startY} x2={leftX} y2={leftY} 
                          className={`connector-line ${isLeftActive ? 'active' : ''}`}
                          markerEnd={`url(#${isLeftActive ? 'arrow-active' : 'arrow'})`}
                        />
                        <line 
                          x1={startX} y1={startY} x2={rightX} y2={rightY} 
                          className={`connector-line ${isRightActive ? 'active' : ''}`}
                          markerEnd={`url(#${isRightActive ? 'arrow-active' : 'arrow'})`}
                        />
                      </g>
                    );
                  } else {
                    const targetX = getX(node.l, node.r);
                    const targetY = getY(node.level + 1) - boxHeight / 2;
                    const isChildActive = currentStep.activeNodeId === `split-${node.level + 1}-${node.l}-${node.r}`;
                    
                    return (
                      <line 
                        key={`split-vertical-${node.id}`}
                        x1={startX} y1={startY} x2={targetX} y2={targetY} 
                        className={`connector-line ${isChildActive ? 'active' : ''}`}
                        markerEnd={`url(#${isChildActive ? 'arrow-active' : 'arrow'})`}
                      />
                    );
                  }
                })}

                {/* 2. Merge Tree Connectors */}
                {mergeTree.map((node) => {
                  const targetRow = maxDepthVal + (maxDepthVal - node.level);
                  const endX = getX(node.l, node.r);
                  const endY = getY(targetRow) - boxHeight / 2;

                  if (node.l < node.r) {
                    const m = Math.floor(node.l + (node.r - node.l) / 2);
                    const sourceRow = targetRow - 1;

                    const leftX = getX(node.l, m);
                    const leftY = getY(sourceRow) + boxHeight / 2;

                    const rightX = getX(m + 1, node.r);
                    const rightY = getY(sourceRow) + boxHeight / 2;

                    // Declare targetMergeId FIRST to prevent Temporal Dead Zone Reference Errors
                    const targetMergeId = `merge-${node.level}-${node.l}-${node.r}`;
                    const isTargetActive = currentStep.activeNodeId === targetMergeId;

                    return (
                      <g key={`merge-conns-${node.id}`}>
                        <line 
                          x1={leftX} y1={leftY} x2={endX} y2={endY} 
                          className={`connector-line ${isTargetActive ? 'active' : ''}`}
                          markerEnd={`url(#${isTargetActive ? 'arrow-active' : 'arrow'})`}
                        />
                        <line 
                          x1={rightX} y1={rightY} x2={endX} y2={endY} 
                          className={`connector-line ${isTargetActive ? 'active' : ''}`}
                          markerEnd={`url(#${isTargetActive ? 'arrow-active' : 'arrow'})`}
                        />
                      </g>
                    );
                  } else {
                    const targetRow = maxDepthVal + (maxDepthVal - node.level);
                    const sourceRow = targetRow - 1;
                    const startX = getX(node.l, node.r);
                    const startY = getY(sourceRow) + boxHeight / 2;
                    const endX = getX(node.l, node.r);
                    const endY = getY(targetRow) - boxHeight / 2;
                    
                    const isChildActive = currentStep.activeNodeId && currentStep.activeNodeId.includes(`-${node.l}-${node.r}`);

                    return (
                      <line 
                        key={`merge-vertical-${node.id}`}
                        x1={startX} y1={startY} x2={endX} y2={endY} 
                        className={`connector-line ${isChildActive ? 'active' : ''}`}
                        markerEnd={`url(#${isChildActive ? 'arrow-active' : 'arrow'})`}
                      />
                    );
                  }
                })}
              </g>

              {/* --- Flow Nodes Render (Split & Merge Layers) --- */}
              <g className="tree-nodes">
                {/* 1. Upper Split Tree Layer */}
                {splitTree.map((node) => {
                  const nodeState = currentStep.splitStates[node.id] || { values: [], state: 'inactive', activeIndices: [] };
                  const K = nodeState.values.length;
                  const centerX = getX(node.l, node.r);
                  const centerY = getY(node.level);
                  const startX = centerX - (K * boxWidth) / 2;

                  return (
                    <g key={node.id} className="tree-node-group">
                      {nodeState.values.map((val, idx) => {
                        const boxX = startX + idx * boxWidth;
                        const boxY = centerY - boxHeight / 2;
                        const isElemComparing = nodeState.activeIndices.includes(idx);
                        
                        let currentBoxStateClass = `state-${nodeState.state}`;
                        if (isElemComparing) currentBoxStateClass = 'state-comparing';

                        return (
                          <g key={`${node.id}-box-${idx}`}>
                            <rect 
                              x={boxX} y={boxY} 
                              width={boxWidth} height={boxHeight} 
                              className={`tree-node-box ${currentBoxStateClass}`}
                            />
                            <text 
                              x={boxX + boxWidth / 2} y={boxY + boxHeight / 2} 
                              className="tree-node-text"
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* 2. Lower Merge Tree Layer */}
                {mergeTree.map((node) => {
                  const nodeState = currentStep.mergeStates[node.id] || { values: [], state: 'inactive', activeIndices: [] };
                  const targetRow = maxDepthVal + (maxDepthVal - node.level);
                  
                  const K = node.r - node.l + 1;
                  const centerX = getX(node.l, node.r);
                  const centerY = getY(targetRow);
                  const startX = centerX - (K * boxWidth) / 2;

                  return (
                    <g key={node.id} className="tree-node-group">
                      {Array.from({ length: K }).map((_, idx) => {
                        const boxX = startX + idx * boxWidth;
                        const boxY = centerY - boxHeight / 2;
                        const hasVal = nodeState.values[idx] !== undefined;
                        const isPlacedJustNow = nodeState.activeIndices.includes(idx);

                        let currentBoxStateClass = `state-${nodeState.state}`;
                        if (!hasVal) currentBoxStateClass = 'state-inactive';
                        if (isPlacedJustNow) currentBoxStateClass = 'state-placing';

                        return (
                          <g key={`${node.id}-box-${idx}`}>
                            <rect 
                              x={boxX} y={boxY} 
                              width={boxWidth} height={boxHeight} 
                              className={`tree-node-box ${currentBoxStateClass}`}
                            />
                            <text 
                              x={boxX + boxWidth / 2} y={boxY + boxHeight / 2} 
                              className={`tree-node-text ${!hasVal ? 'state-inactive' : ''}`}
                            >
                              {hasVal ? nodeState.values[idx] : '?'}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            </svg>
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

        {}
        <section className="image-complexity-grid">
          <div className="image-complexity-card">
            <span className="image-card-header">Merge Sort</span>
            <span className="image-card-title">Best Case</span>
            <span className="image-card-complexity">O(n log n)</span>
          </div>

          <div className="image-complexity-card">
            <span className="image-card-header">Merge Sort</span>
            <span className="image-card-title">Average Case</span>
            <span className="image-card-complexity">O(n log n)</span>
          </div>

          <div className="image-complexity-card">
            <span className="image-card-header">Merge Sort</span>
            <span className="image-card-title">Worst Case</span>
            <span className="image-card-complexity">O(n log n)</span>
          </div>

          <div className="image-complexity-card">
            <span className="image-card-header">Auxiliary Space</span>
            <span className="image-card-title">Memory</span>
            <span className="image-card-complexity">O(n)</span>
          </div>
        </section>

        {}
        <div className="lower-content-area">
          <section className="workspace-section">
            <h2 className="section-title">
              <span className="flex items-center gap-1.5">
                Merge Sort Code Highlight
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

          <section className="workspace-section">
            <h2 className="section-title">
              <span className="flex items-center gap-1.5">
                Log Streams
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