import React, { useState, useRef, useEffect } from 'react';
import { Combine, Pause, Play, RefreshCw, Shuffle } from 'lucide-react';

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
      position: relative;
    }
    
    .merge-area-container {
      width: 100%;
      min-height: 100px;
      margin-top: 1.5rem;
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px dashed var(--border-gray-600);
      border-radius: 0.5rem;
      padding: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      visibility: hidden; /* Hide when not visible */
    }
    
    .merge-area-container.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .merge-area-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-gray-400);
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .merge-area-boxes {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem;
      min-height: 70px; /* 56px box + 14px index */
    }

    .box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: opacity 0.3s ease-in-out;
    }
    
    .box-wrapper.faded {
      opacity: 0.3;
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
    
    .box.sub-array-left {
      background-color: var(--yellow-600);
      color: black;
      border-color: var(--yellow-400);
    }
    
    .box.sub-array-right {
      background-color: var(--purple-600);
      color: white;
      border-color: var(--purple-500);
    }

    .box.comparing {
      background-color: var(--orange-500);
      color: white;
      border-color: var(--orange-600);
      transform: scale(1.1);
    }
    
    .box.placing {
      background-color: var(--green-500);
      color: white;
      border-color: var(--green-400);
      transform: scale(1.05);
    }

    .box.sorted {
      background-color: var(--green-600);
      color: white;
      border-color: var(--green-500);
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
  `,
};

/**
 * A utility function to create a delay.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The core visualization logic for Merge Sort.
 */
async function visualizeMergeSort(
  arr,
  speed,
  setBoxes,
  setMergeAreaBoxes, // For the separate merge area
  setIsMergeAreaVisible,
  setStatus,
  setHighlightLineNum,
  setExecutionLog,
  pausedRef,
  isCancelledRef
) {
  // --- Setup ---
  // Create the mutable state array. This is the single source of truth.
  let boxes = arr.map((value, index) => ({ 
    value, 
    state: 'default', 
    originalIndex: index, // To track boxes
    isFaded: false, // For focus mode
  }));
  setBoxes([...boxes]);

  // --- Pause Helper ---
  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Press Resume to continue.");
      await sleep(100);
    }
    if (!isCancelledRef.current) {
      setStatus("Sorting...");
    }
  };
  
  // --- Focus Helper ---
  const setFocus = (l, r, focus) => {
    boxes.forEach((box, i) => {
      box.isFaded = focus ? (i < l || i > r) : false;
    });
    setBoxes([...boxes]);
  };

  // --- Merge Function (Inner) ---
  async function merge(l, m, r) {
    if (isCancelledRef.current) return;
    await checkPause();
    
    // Show Merge Area
    setIsMergeAreaVisible(true);
    setMergeAreaBoxes([]); // Clear it first

    setExecutionLog(prev => [...prev, `Merging [${l}..${m}] and [${m+1}..${r}]`]);
    setHighlightLineNum(11); // merge(arr, l, m, r)

    // Highlight the sub-arrays being merged in main array
    for (let i = l; i <= r; i++) {
      boxes[i].state = (i <= m) ? 'sub-array-left' : 'sub-array-right';
    }
    setBoxes([...boxes]);
    
    // Create temp sub-arrays from the *current* state of 'boxes'
    // These are copies of the *box objects*
    let leftSubArray = boxes.slice(l, m + 1).map(b => ({...b}));
    let rightSubArray = boxes.slice(m + 1, r + 1).map(b => ({...b}));
    
    // Put copies into the merge area
    let mergeAreaVisual = [...leftSubArray, ...rightSubArray];
    setMergeAreaBoxes(mergeAreaVisual);
    
    await sleep(speed);
    
    setHighlightLineNum(13); // L, R = ...

    let i = 0, j = 0;
    let sortedSubArray = []; // Temp array to hold merge result (box objects)
    let mergeAreaIndex = 0; // To track where in the merge area we are

    setHighlightLineNum(16); // while i < n1 and j < n2:

    while (i < leftSubArray.length && j < rightSubArray.length) {
      if (isCancelledRef.current) return;
      await checkPause();

      setHighlightLineNum(17); // if L[i] <= R[j]:
      
      // Visually mark the two boxes being compared *in the merge area*
      let leftBoxVisualIndex = mergeAreaVisual.findIndex(b => b.originalIndex === leftSubArray[i].originalIndex);
      let rightBoxVisualIndex = mergeAreaVisual.findIndex(b => b.originalIndex === rightSubArray[j].originalIndex);

      if (leftBoxVisualIndex !== -1) mergeAreaVisual[leftBoxVisualIndex].state = 'comparing';
      if (rightBoxVisualIndex !== -1) mergeAreaVisual[rightBoxVisualIndex].state = 'comparing';
      setMergeAreaBoxes([...mergeAreaVisual]);
      
      const compareMsg = `Compare: ${leftSubArray[i].value} (L) and ${rightSubArray[j].value} (R)`;
      setStatus(compareMsg);
      setExecutionLog(prev => [...prev, compareMsg]);
      await sleep(speed);

      // Compare the values
      let winnerBox;
      if (leftSubArray[i].value <= rightSubArray[j].value) {
        winnerBox = leftSubArray[i];
        setHighlightLineNum(18); // arr[k] = L[i]
        i++;
      } else {
        winnerBox = rightSubArray[j];
        setHighlightLineNum(20); // arr[k] = R[j]
        j++;
      }
      
      // Mark winner as 'placing' *in merge area* and add to sorted list
      winnerBox.state = 'placing';
      sortedSubArray.push(winnerBox);
      
      // Update merge area visual: move the winner to the front
      let winnerVisualIndex = mergeAreaVisual.findIndex(b => b.originalIndex === winnerBox.originalIndex);
      mergeAreaVisual.splice(winnerVisualIndex, 1); // Remove from old spot
      mergeAreaVisual.splice(mergeAreaIndex, 0, winnerBox); // Add to sorted spot
      mergeAreaIndex++;
      
      setMergeAreaBoxes([...mergeAreaVisual]);
      await sleep(speed);
    }

    // --- Copy remaining elements (visual) ---
    while (i < leftSubArray.length) {
      if (isCancelledRef.current) return;
      await checkPause();
      setHighlightLineNum(24); // while i < n1:
      
      let winnerBox = leftSubArray[i];
      winnerBox.state = 'placing';
      sortedSubArray.push(winnerBox);
      
      let winnerVisualIndex = mergeAreaVisual.findIndex(b => b.originalIndex === winnerBox.originalIndex);
      mergeAreaVisual.splice(winnerVisualIndex, 1);
      mergeAreaVisual.splice(mergeAreaIndex, 0, winnerBox);
      mergeAreaIndex++;
      i++;
      
      setMergeAreaBoxes([...mergeAreaVisual]);
      await sleep(speed);
    }

    while (j < rightSubArray.length) {
      if (isCancelledRef.current) return;
      await checkPause();
      setHighlightLineNum(28); // while j < n2:
      
      let winnerBox = rightSubArray[j];
      winnerBox.state = 'placing';
      sortedSubArray.push(winnerBox);
      
      let winnerVisualIndex = mergeAreaVisual.findIndex(b => b.originalIndex === winnerBox.originalIndex);
      mergeAreaVisual.splice(winnerVisualIndex, 1);
      mergeAreaVisual.splice(mergeAreaIndex, 0, winnerBox);
      mergeAreaIndex++;
      j++;
      
      setMergeAreaBoxes([...mergeAreaVisual]);
      await sleep(speed);
    }
    
    // --- "Paint" the sortedSubArray back into the main boxes array ---
    setExecutionLog(prev => [...prev, `Painting merged [${l}..${r}] back to main array`]);
    await sleep(speed); // Pause to see the fully sorted merge area
    
    // Replace the slice in the main 'boxes' array with the sorted objects
    // This is the fix for the duplicate key error.
    // It removes the old objects from [l..r] and inserts the new, sorted-by-value objects.
    boxes.splice(l, r - l + 1, ...sortedSubArray);

    // Now, "paint" them one by one visually
    for(let p = 0; p < sortedSubArray.length; p++) {
      if (isCancelledRef.current) return;
      await checkPause();
      
      let sortedBox = sortedSubArray[p]; // This is now equivalent to boxes[l + p]
      sortedBox.state = 'sorted'; // Set state to sorted
      
      setBoxes([...boxes]); // Update React state to show the new 'sorted' state
      
      // Also update merge area to show it being "used"
      if (mergeAreaVisual[p]) { // Safety check
        mergeAreaVisual[p].state = 'sorted';
        setMergeAreaBoxes([...mergeAreaVisual]);
      }
      
      await sleep(speed / 2); // Faster paint-back
    }
    
    setExecutionLog(prev => [...prev, `Merge complete for [${l}..${r}]`]);
    
    // Hide Merge Area
    setIsMergeAreaVisible(false);
    setMergeAreaBoxes([]);
    await sleep(speed);
  }

  // --- Sort Function (Recursive Inner) ---
  async function sort(l, r) {
    if (l >= r) {
      // Base case: array of 1 is sorted
      if (l === r) boxes[l].state = 'sorted';
      return;
    }
    if (isCancelledRef.current) return;
    await checkPause();
    setHighlightLineNum(2); // if l < r:
    
    // --- DIVIDE ---
    setFocus(l, r, true); // Fade out non-relevant parts
    let m = Math.floor(l + (r - l) / 2);
    setHighlightLineNum(4); // m = (l + r) // 2
    setExecutionLog(prev => [...prev, `Divide: Focusing on [${l}..${r}], mid at ${m}`]);
    
    // Highlight the split
    for (let i = l; i <= r; i++) {
      boxes[i].state = (i <= m) ? 'sub-array-left' : 'sub-array-right';
    }
    setBoxes([...boxes]);
    await sleep(speed * 1.5); // Hold to see the divide
    
    // Reset state before recursive call
    for (let i = l; i <= r; i++) {
        if (boxes[i].state !== 'sorted') boxes[i].state = 'default';
    }
    setBoxes([...boxes]);

    setHighlightLineNum(7); // merge_sort(arr, l, m)
    await sort(l, m);
    if (isCancelledRef.current) return;

    setHighlightLineNum(8); // merge_sort(arr, m + 1, r)
    await sort(m + 1, r);
    if (isCancelledRef.current) return;

    // --- CONQUER ---
    setFocus(l, r, true); // Re-focus on this range for merging
    await merge(l, m, r);
    setFocus(l, r, false); // Un-focus after merge
  }
  
  // --- Start Visualization ---
  setExecutionLog(["Starting Merge Sort..."]);
  await sort(0, arr.length - 1);

  // --- Finish ---
  if (!isCancelledRef.current) {
    setStatus("Sorting complete!");
    setExecutionLog(prev => [...prev, "Sorting complete!"]);
    // Final sorted sweep
    boxes.forEach(box => {
      box.state = 'sorted';
      box.isFaded = false;
    });
    setBoxes([...boxes]);
    setHighlightLineNum(-1);
  } else {
    setStatus("Visualization cancelled.");
    setExecutionLog(prev => [...prev, "Visualization cancelled."]);
    setHighlightLineNum(-1);
  }
}

// --- Main Component ---

export default function MergeSort() {
  const [arrayStr, setArrayStr] = useState("8, 3, 1, 7, 0, 10, 2");
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Enter an array, then press Sort.");
  const [boxes, setBoxes] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [executionLog, setExecutionLog] = useState([]);
  
  // State for the separate merge area
  const [mergeAreaBoxes, setMergeAreaBoxes] = useState([]);
  const [isMergeAreaVisible, setIsMergeAreaVisible] = useState(false);
  
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
  // This effect runs when the user manually changes the array string.
  useEffect(() => {
    // Only update if not currently sorting.
    // This prevents user input from messing up an active sort.
    if (!isVisualizing) { 
      const arr = validateInputs();
      if (arr) {
        setBoxes(arr.map((value, index) => ({ 
          value, 
          state: 'default', 
          originalIndex: index,
          isFaded: false
        })));
      } else {
        setBoxes([]);
      }
    }
    // We ONLY want this to re-run when arrayStr changes.
    // Removing isVisualizing from deps prevents the array from
    // resetting after the sort completes.
  }, [arrayStr]); // ** FIX: Only depends on arrayStr **

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
    setMergeAreaBoxes([]);
    setIsMergeAreaVisible(false);

    await visualizeMergeSort(
      arr,
      speed,
      setBoxes,
      setMergeAreaBoxes,
      setIsMergeAreaVisible,
      setStatus,
      setHighlightLineNum,
      setExecutionLog,
      pausedRef,
      isCancelledRef
    );

    setIsVisualizing(false);
    setIsPaused(false);
    // Do not hide merge area, let it stay visible with the final step
    // setIsMergeAreaVisible(false);
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
    setMergeAreaBoxes([]);
    setIsMergeAreaVisible(false);

    const arr = validateInputs();
    if (arr) {
      setBoxes(arr.map((value, index) => ({ 
        value, 
        state: 'default', 
        originalIndex: index,
        isFaded: false 
      })));
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
    setMergeAreaBoxes([]);
    setIsMergeAreaVisible(false);
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
          <Combine size={30} />
          Merge Sort
        </h1>

        <div className="input-group">
          <label htmlFor="array">Array</label>
          <textarea
            id="array"
            placeholder="e.g., 8, 3, 1, 7"
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
            <Combine size={18} />
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
          
          {/* This is the main array */ }
          <div className="visualization-boxes">
            {boxes.map((box, idx) => (
              <div 
                key={box.originalIndex} 
                className={`box-wrapper ${box.isFaded ? 'faded' : ''}`}
              >
                <div
                  className={`box ${box.state}`}
                >
                  {box.value}
                </div>
                <span className="box-index">[{idx}]</span>
              </div>
            ))}
          </div>
          
          {/* This is the separate merge area */ }
          <div 
            className={`merge-area-container ${isMergeAreaVisible ? 'visible' : ''}`}
          >
            <div className="merge-area-title">Merge Area</div>
            <div className="merge-area-boxes">
              {mergeAreaBoxes.map((box, idx) => (
                <div key={box.originalIndex} className="box-wrapper">
                  <div
                    className={`box ${box.state}`}
                  >
                    {box.value}
                  </div>
                  {/* Index is not as important here, so we omit it */}
                </div>
              ))}
            </div>
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
