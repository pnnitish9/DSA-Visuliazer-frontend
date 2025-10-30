import React, { useState, useRef, useEffect } from 'react';
import { Gauge, Pause, Play, RefreshCw, Shuffle } from 'lucide-react';

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
      
      --pink-500: #ec4899;
      --pink-600: #db2777;
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
    
    .box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease-in-out;
      /* Style for swapping animation */
      position: relative;
      z-index: 1;
    }

    .box-wrapper.swapping {
      z-index: 10; /* Bring to front */
    }
    
    .box-wrapper.faded {
      opacity: 0.3;
    }
    
    /* No-transition class for snapping */
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
      position: relative; /* For pointer labels */
    }

    .box-index {
      margin-top: 0.5rem;
      font-size: 0.875rem; /* 14px */
      color: var(--text-gray-400);
    }
    
    /* Pointer Labels */
    .pointer-label {
      position: absolute;
      top: -1.75rem; /* Position above the box */
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.1rem 0.4rem;
      border-radius: 0.25rem;
      color: black;
      opacity: 0.9;
    }
    
    .pointer-label.i-pointer {
      background-color: var(--yellow-400);
      color: black;
    }
    .pointer-label.j-pointer {
      background-color: var(--orange-500);
      color: white;
    }

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
      transform: scale(1.05);
    }

    .box.swapping {
      background-color: var(--red-500);
      color: white;
      border-color: var(--red-400);
      transform: scale(1.1);
      box-shadow: 0 0 10px var(--red-500);
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
  `,
};

/**
 * A utility function to create a delay.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The core visualization logic for Quick Sort.
 */
async function visualizeQuickSort(
  arr,
  speed,
  setBoxes,
  setStatus,
  setHighlightLineNum,
  setExecutionLog,
  pausedRef,
  isCancelledRef,
  boxElementsRef // <-- Added ref
) {
  // --- Setup ---
  let boxes = arr.map((value, index) => ({ 
    value, 
    id: `box-${index}`, // Unique ID for key
    state: 'default',
    isPivot: false,
    isIPointer: false,
    isJPointer: false,
    isFaded: false,
  }));
  setBoxes([...boxes]);

  // const boxElementsRef = {}; // <-- Removed local declaration

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
  const setFocus = (low, high, focus) => {
    boxes.forEach((box, i) => {
      box.isFaded = focus ? (i < low || i > high) : false;
    });
  };
  
  // --- Swap Animation Helper ---
  const animateSwap = async (boxA, boxB) => {
    // 1. Get DOM elements
    const elemA = boxElementsRef.current[boxA.id]; // <-- Use .current
    const elemB = boxElementsRef.current[boxB.id]; // <-- Use .current
    
    if (!elemA || !elemB) {
      console.error("Could not find elements for swap");
      return;
    }
    
    // 2. Add swapping class for styles
    boxA.state = 'swapping';
    boxB.state = 'swapping';
    setBoxes([...boxes]);

    // 3. Calculate distance
    const rectA = elemA.getBoundingClientRect();
    const rectB = elemB.getBoundingClientRect();
    const deltaX = rectA.left - rectB.left;

    // 4. Apply transforms to move them
    elemA.style.transform = `translateX(${-deltaX}px)`;
    elemB.style.transform = `translateX(${deltaX}px)`;
    elemA.classList.add('swapping');
    elemB.classList.add('swapping');
    
    await sleep(speed * 0.7); // Wait for animation

    // 5. Remove transforms and classes (will be handled by state update)
    elemA.style.transform = '';
    elemB.style.transform = '';
    elemA.classList.remove('swapping');
    elemB.classList.remove('swapping');
    elemA.classList.add('no-transition'); // Prevent snapping animation
    elemB.classList.add('no-transition');

    // 6. Swap in the actual 'boxes' array
    const indexA = boxes.findIndex(b => b.id === boxA.id);
    const indexB = boxes.findIndex(b => b.id === boxB.id);
    [boxes[indexA], boxes[indexB]] = [boxes[indexB], boxes[indexA]];
    
    // 7. Reset states
    boxA.state = 'default';
    boxB.state = 'default';
    
    setBoxes([...boxes]);

    // 8. Force browser repaint
    void elemA.offsetWidth;
    void elemB.offsetWidth;
    
    // 9. Re-enable transitions
    elemA.classList.remove('no-transition');
    elemB.classList.remove('no-transition');
  };
  
  // --- Clear Pointers Helper ---
  const clearPointers = (low, high) => {
     for(let i = low; i <= high; i++) {
        if (boxes[i]) {
            boxes[i].isPivot = false;
            boxes[i].isIPointer = false;
            boxes[i].isJPointer = false;
            if (boxes[i].state !== 'sorted') boxes[i].state = 'default';
        }
     }
  };

  // --- Partition Function (Inner) ---
  async function partition(low, high) {
    setHighlightLineNum(11); // partition(...)
    await checkPause();
    
    // 1. Select pivot
    let pivotBox = boxes[high];
    pivotBox.isPivot = true;
    setBoxes([...boxes]);
    const pivotValue = pivotBox.value;
    
    setExecutionLog(prev => [...prev, `Partitioning [${low}..${high}]. Pivot is ${pivotValue} at index ${high}.`]);
    setHighlightLineNum(13); // pivot = arr[high]
    await sleep(speed);

    // 2. Initialize i (low pointer)
    let i = low - 1;
    setHighlightLineNum(16); // i = low - 1
    await sleep(speed);

    // 3. Loop j from low to high - 1
    for (let j = low; j < high; j++) {
      if (isCancelledRef.current) return { pivotIndex: -1, error: 'cancelled' };
      await checkPause();
      
      setHighlightLineNum(18); // for j in range(low, high):
      
      // Set j pointer
      boxes[j].isJPointer = true;
      if (i >= low) boxes[i].isIPointer = true;
      setBoxes([...boxes]);
      
      const compareMsg = `Comparing j (val: ${boxes[j].value}) with pivot (val: ${pivotValue})`;
      setStatus(compareMsg);
      setExecutionLog(prev => [...prev, compareMsg]);
      setHighlightLineNum(20); // if arr[j] < pivot:
      
      // Visual comparison
      boxes[j].state = 'comparing';
      pivotBox.state = 'comparing'; // Keep pivot comparing
      setBoxes([...boxes]);
      await sleep(speed);
      
      if (boxes[j].value < pivotValue) {
        setHighlightLineNum(21); // i += 1
        i++;
        
        // Move i pointer
        if (i > low && (i-1) < boxes.length) boxes[i-1].isIPointer = false;
        boxes[i].isIPointer = true;
        setBoxes([...boxes]);
        
        setExecutionLog(prev => [...prev, `  ${boxes[j].value} < ${pivotValue}. Increment i to ${i}. Swapping i and j.`]);
        setHighlightLineNum(23); // Swap arr[i] and arr[j]
        
        // Don't swap if i and j are the same
        if (i !== j) {
            await animateSwap(boxes[i], boxes[j]);
        }
        
        // Pointers might have moved, so re-set them
        if (i < boxes.length) boxes[i].isIPointer = true;
      }
      
      // Clear j pointer and comparison state
      boxes[j].isJPointer = false;
      if (boxes[j].state !== 'sorted') boxes[j].state = 'default';
      pivotBox.state = 'default'; // Back to just being pivot
      pivotBox.isPivot = true;
    }
    
    // Clear last j pointer
    if (high > 0 && (high-1) < boxes.length) boxes[high-1].isJPointer = false;

    // 4. Swap pivot to final position
    const pivotFinalIndex = i + 1;
    setExecutionLog(prev => [...prev, `Partition done. Swapping pivot to final index ${pivotFinalIndex}.`]);
    setHighlightLineNum(26); // Swap arr[i+1] and arr[high]
    
    // Ensure boxes[pivotFinalIndex] exists
    if (pivotFinalIndex >= boxes.length) {
        console.error("Pivot final index out of bounds");
        return { pivotIndex: -1, error: 'out_of_bounds' };
    }
    
    // Don't swap if pivot is already in place
    if (pivotFinalIndex !== high) {
        await animateSwap(boxes[pivotFinalIndex], boxes[high]);
    }
    
    // 5. Mark pivot as sorted
    boxes[pivotFinalIndex].state = 'sorted';
    boxes[pivotFinalIndex].isPivot = false;
    if (i >= low && i < boxes.length) boxes[i].isIPointer = false;
    
    setBoxes([...boxes]);
    setHighlightLineNum(27); // return i + 1
    
    return { pivotIndex: pivotFinalIndex, error: null };
  }

  // --- Sort Function (Recursive Inner) ---
  async function quickSort(low, high) {
    if (low < high) {
      if (isCancelledRef.current) return;
      await checkPause();
      
      setHighlightLineNum(2); // if low < high:
      setExecutionLog(prev => [...prev, `QuickSort call on [${low}..${high}]`]);
      setFocus(low, high, true);
      setBoxes([...boxes]);
      await sleep(speed);

      setHighlightLineNum(4); // pi = partition(...)
      const { pivotIndex, error } = await partition(low, high);
      
      if (error) return; // Stop if cancelled or error

      // Clear all pointers for this partition
      clearPointers(low, high);
      setBoxes([...boxes]);

      setFocus(low, high, false);
      setBoxes([...boxes]);
      
      setHighlightLineNum(7); // quick_sort(arr, low, pi - 1)
      await quickSort(low, pivotIndex - 1);
      
      if (isCancelledRef.current) return;

      setHighlightLineNum(8); // quick_sort(arr, pi + 1, high)
      await quickSort(pivotIndex + 1, high);
    } else if (low === high) {
       // Base case: array of 1 is sorted
       if (boxes[low]) {
         boxes[low].state = 'sorted';
         boxes[low].isFaded = false; // Make sure it's not faded
       }
       setBoxes([...boxes]);
    }
  }
  
  // --- Start Visualization ---
  setExecutionLog(["Starting Quick Sort..."]);
  await quickSort(0, arr.length - 1);

  // --- Finish ---
  if (!isCancelledRef.current) {
    setStatus("Sorting complete!");
    setExecutionLog(prev => [...prev, "Sorting complete!"]);
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

export default function QuickSort() {
  const [arrayStr, setArrayStr] = useState("7, 2, 1, 6, 8, 5, 3, 4");
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
  
  // Ref to store box DOM element references
  const boxElementsRef = useRef({});
  useEffect(() => {
    boxElementsRef.current = boxes.reduce((acc, box) => {
      acc[box.id] = document.getElementById(box.id);
      return acc;
    }, {});
  }, [boxes]); // Update refs whenever boxes re-render

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
    // THIS IS THE FIX:
    // Only run if the user is not visualizing
    // and the array string is the *source* of the change.
    // Changed dependencies from [arrayStr, isVisualizing] to [arrayStr]
    if (!isVisualizing) {
      const arr = validateInputs();
      if (arr) {
        setBoxes(arr.map((value, index) => ({ 
          value, 
          id: `box-${index}`,
          state: 'default',
          isPivot: false,
          isIPointer: false,
          isJPointer: false,
          isFaded: false,
        })));
      } else {
        setBoxes([]);
      }
    }
  }, [arrayStr]); // <-- Dependency changed

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

    await visualizeQuickSort(
      arr,
      speed,
      setBoxes,
      setStatus,
      setHighlightLineNum,
      setExecutionLog,
      pausedRef,
      isCancelledRef,
      boxElementsRef // <-- Pass the ref
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
      setBoxes(arr.map((value, index) => ({ 
          value, 
          id: `box-${index}`,
          state: 'default',
          isPivot: false,
          isIPointer: false,
          isJPointer: false,
          isFaded: false,
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
          <Gauge size={30} />
          Quick Sort
        </h1>

        <div className="input-group">
          <label htmlFor="array">Array</label>
          <textarea
            id="array"
            placeholder="e.g., 7, 2, 1, 6, 8"
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
            <Gauge size={18} />
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
              <div 
                key={box.id} 
                id={box.id} // This ID is used for the animation swap
                className={`box-wrapper ${box.isFaded ? 'faded' : ''}`}
              >
                <div
                  className={`box ${box.state} ${box.isPivot ? 'pivot' : ''}`}
                >
                  {box.isIPointer && <span className="pointer-label i-pointer">i</span>}
                  {box.isJPointer && <span className="pointer-label j-pointer">j</span>}
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

