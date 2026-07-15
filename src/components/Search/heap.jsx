import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, ArrowDownToLine, SkipBack, SkipForward, RotateCcw, Code, Map, Info, Shuffle, Trash2, ListTree } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      --bg-dark-950: #0c111c;
      --bg-dark-900: #111827;
      --bg-dark-800: #1f2937;
      --bg-dark-700: #374151;
      --bg-dark-600: #4b5563;
      
      --text-gray-100: #f3f4f6;
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
      --red-400: #f87171;
      --red-500: #ef4444;
      --red-600: #dc2626;
      --purple-400: #c084fc;
      --purple-500: #a855f7;
      --purple-600: #9333ea;
      --orange-400: #fb923c;
      --orange-500: #f97316;
    }

    .visualizer-container {
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; }
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
      .controls-sidebar { width: 320px; min-width: 320px; height: 100vh; }
    }

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--cyan-400); display: flex; align-items: center; gap: 0.5rem; }

    /* Complexity Box */
    .complexity-box { background: rgba(0,0,0,0.15); border: 1px dashed var(--border-gray-700); border-radius: 0.375rem; padding: 0.5rem; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .comp-item { display: flex; justify-content: space-between; align-items: center; }
    .comp-label { color: var(--text-gray-400); font-family: 'Inter', -apple-system, sans-serif; font-size: 0.65rem; text-transform: uppercase; font-weight: 700; }
    .comp-val { color: var(--cyan-400); font-family: 'Fira Code', monospace; font-weight: bold; font-size: 0.75rem; }

    /* Forms */
    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; }
    .input-field:focus { outline: none; border-color: var(--cyan-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .row-flex { display: flex; gap: 0.5rem; align-items: center; }
    
    /* Buttons */
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-orange { background-color: var(--orange-600); color: white; }
    .btn-orange:hover:not(:disabled) { background-color: var(--orange-500); }
    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }
    .btn-secondary { background-color: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-600); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-600); }

    /* Action Panels */
    .action-panel { background: rgba(0,0,0,0.15); border: 1px solid var(--border-gray-700); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem; }
    .panel-header { font-size: 0.75rem; color: var(--text-gray-300); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; }

    /* Playback Controls */
    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--cyan-500); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--cyan-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--cyan-400); border-color: var(--cyan-500); }
    
    /* Main Area */
    .main-content { flex: 1; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; background-color: var(--bg-dark-950); }
    .status-bar { padding: 0.75rem 1rem; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex: none; }
    .status-text { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: var(--yellow-400); }
    
    /* Layouts */
    .top-layout { display: flex; flex-direction: column; gap: 1rem; flex: 2; min-height: 400px; }
    .canvas-wrapper { flex: 2; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; overflow: hidden; min-height: 250px; }
    .array-wrapper { flex: none; min-height: 110px; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Bottom Row: Code & Logs */
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 220px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(34, 211, 238, 0.25); border-left: 3px solid var(--cyan-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--yellow-400); border-radius: 0.25rem; border-left: 2px solid var(--yellow-400); }
    
    /* Node and Edge Styling */
    .graph-node {
      position: absolute; width: 2.8rem; height: 2.8rem; background: var(--bg-dark-700); border: 2px solid var(--border-gray-500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: monospace; transform: translate(-50%, -50%); transition: left 0.4s ease, top 0.4s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease; z-index: 10; user-select: none;
    }
    .graph-node.highlight { background: var(--green-600); border-color: var(--green-400); color: white; box-shadow: 0 0 15px rgba(34,197,94,0.5); transform: translate(-50%, -50%) scale(1.1); z-index: 12;}
    .graph-node.comparing { background: var(--yellow-500); color: black; border-color: var(--yellow-400); box-shadow: 0 0 15px rgba(234,179,8,0.5); z-index: 11;}
    .graph-node.swapping { background: var(--cyan-600); color: white; border-color: var(--cyan-400); box-shadow: 0 0 15px rgba(34,211,238,0.5); transform: translate(-50%, -50%) scale(1.15); z-index: 13;}
    
    .edge-line { stroke: var(--border-gray-600); stroke-width: 2.5; transition: all 0.4s ease; fill: none; }
    
    /* Array DS Panels */
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--cyan-400); display: flex; justify-content: space-between; align-items: center;}
    .array-container { padding: 0.75rem 1rem; overflow-x: auto; flex: 1; display: flex; gap: 0.4rem; align-items: center; }
    .array-cell-wrapper { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
    .array-cell { width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; background: var(--bg-dark-700); border: 2px solid var(--border-gray-500); border-radius: 0.375rem; font-family: monospace; font-weight: bold; transition: all 0.4s ease; }
    .array-cell.highlight { background: var(--green-600); border-color: var(--green-400); color: white; transform: scale(1.05); }
    .array-cell.comparing { background: var(--yellow-500); color: black; border-color: var(--yellow-400); }
    .array-cell.swapping { background: var(--cyan-600); color: white; border-color: var(--cyan-400); transform: translateY(-5px); }
    .array-index { font-size: 0.65rem; color: var(--text-gray-500); font-family: monospace; }
  `}</style>
);

const ALGO_CODES = {
  min: {
    python: [
      "def insert(heap, val):",
      "    heap.append(val)",
      "    curr = len(heap) - 1",
      "    while curr > 0:",
      "        parent = (curr - 1) // 2",
      "        if heap[curr] < heap[parent]:",
      "            heap[curr], heap[parent] = heap[parent], heap[curr]",
      "            curr = parent",
      "        else:",
      "            break",
      "",
      "def extract_min(heap):",
      "    if not heap: return None",
      "    if len(heap) == 1: return heap.pop()",
      "    min_val = heap[0]",
      "    heap[0] = heap.pop()",
      "    curr = 0",
      "    while True:",
      "        left = 2 * curr + 1",
      "        right = 2 * curr + 2",
      "        smallest = curr",
      "        if left < len(heap) and heap[left] < heap[smallest]: ",
      "            smallest = left",
      "        if right < len(heap) and heap[right] < heap[smallest]: ",
      "            smallest = right",
      "        if smallest != curr:",
      "            heap[curr], heap[smallest] = heap[smallest], heap[curr]",
      "            curr = smallest",
      "        else:",
      "            break",
      "    return min_val"
    ],
    cpp: [
      "void insert(vector<int>& heap, int val) {",
      "    heap.push_back(val);",
      "    int curr = heap.size() - 1;",
      "    while (curr > 0) {",
      "        int parent = (curr - 1) / 2;",
      "        if (heap[curr] < heap[parent]) {",
      "            swap(heap[curr], heap[parent]);",
      "            curr = parent;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "}",
      "",
      "int extract_min(vector<int>& heap) {",
      "    if (heap.empty()) return -1;",
      "    if (heap.size() == 1) { int v = heap.back(); heap.pop_back(); return v; }",
      "    int min_val = heap[0];",
      "    heap[0] = heap.back(); heap.pop_back();",
      "    int curr = 0;",
      "    while (true) {",
      "        int left = 2 * curr + 1, right = 2 * curr + 2, smallest = curr;",
      "        if (left < heap.size() && heap[left] < heap[smallest]) smallest = left;",
      "        if (right < heap.size() && heap[right] < heap[smallest]) smallest = right;",
      "        if (smallest != curr) {",
      "            swap(heap[curr], heap[smallest]);",
      "            curr = smallest;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "    return min_val;",
      "}"
    ],
    java: [
      "public void insert(List<Integer> heap, int val) {",
      "    heap.add(val);",
      "    int curr = heap.size() - 1;",
      "    while (curr > 0) {",
      "        int parent = (curr - 1) / 2;",
      "        if (heap.get(curr) < heap.get(parent)) {",
      "            Collections.swap(heap, curr, parent);",
      "            curr = parent;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "}",
      "",
      "public int extractMin(List<Integer> heap) {",
      "    if (heap.isEmpty()) return -1;",
      "    if (heap.size() == 1) return heap.remove(heap.size() - 1);",
      "    int minVal = heap.get(0);",
      "    heap.set(0, heap.remove(heap.size() - 1));",
      "    int curr = 0;",
      "    while (true) {",
      "        int left = 2 * curr + 1, right = 2 * curr + 2, smallest = curr;",
      "        if (left < heap.size() && heap.get(left) < heap.get(smallest)) smallest = left;",
      "        if (right < heap.size() && heap.get(right) < heap.get(smallest)) smallest = right;",
      "        if (smallest != curr) {",
      "            Collections.swap(heap, curr, smallest);",
      "            curr = smallest;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "    return minVal;",
      "}"
    ]
  },
  max: {
    python: [
      "def insert(heap, val):",
      "    heap.append(val)",
      "    curr = len(heap) - 1",
      "    while curr > 0:",
      "        parent = (curr - 1) // 2",
      "        if heap[curr] > heap[parent]:",
      "            heap[curr], heap[parent] = heap[parent], heap[curr]",
      "            curr = parent",
      "        else:",
      "            break",
      "",
      "def extract_max(heap):",
      "    if not heap: return None",
      "    if len(heap) == 1: return heap.pop()",
      "    max_val = heap[0]",
      "    heap[0] = heap.pop()",
      "    curr = 0",
      "    while True:",
      "        left = 2 * curr + 1",
      "        right = 2 * curr + 2",
      "        largest = curr",
      "        if left < len(heap) and heap[left] > heap[largest]: ",
      "            largest = left",
      "        if right < len(heap) and heap[right] > heap[largest]: ",
      "            largest = right",
      "        if largest != curr:",
      "            heap[curr], heap[largest] = heap[largest], heap[curr]",
      "            curr = largest",
      "        else:",
      "            break",
      "    return max_val"
    ],
    cpp: [
      "void insert(vector<int>& heap, int val) {",
      "    heap.push_back(val);",
      "    int curr = heap.size() - 1;",
      "    while (curr > 0) {",
      "        int parent = (curr - 1) / 2;",
      "        if (heap[curr] > heap[parent]) {",
      "            swap(heap[curr], heap[parent]);",
      "            curr = parent;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "}",
      "",
      "int extract_max(vector<int>& heap) {",
      "    if (heap.empty()) return -1;",
      "    if (heap.size() == 1) { int v = heap.back(); heap.pop_back(); return v; }",
      "    int max_val = heap[0];",
      "    heap[0] = heap.back(); heap.pop_back();",
      "    int curr = 0;",
      "    while (true) {",
      "        int left = 2 * curr + 1, right = 2 * curr + 2, largest = curr;",
      "        if (left < heap.size() && heap[left] > heap[largest]) largest = left;",
      "        if (right < heap.size() && heap[right] > heap[largest]) largest = right;",
      "        if (largest != curr) {",
      "            swap(heap[curr], heap[largest]);",
      "            curr = largest;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "    return max_val;",
      "}"
    ],
    java: [
      "public void insert(List<Integer> heap, int val) {",
      "    heap.add(val);",
      "    int curr = heap.size() - 1;",
      "    while (curr > 0) {",
      "        int parent = (curr - 1) / 2;",
      "        if (heap.get(curr) > heap.get(parent)) {",
      "            Collections.swap(heap, curr, parent);",
      "            curr = parent;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "}",
      "",
      "public int extractMax(List<Integer> heap) {",
      "    if (heap.isEmpty()) return -1;",
      "    if (heap.size() == 1) return heap.remove(heap.size() - 1);",
      "    int maxVal = heap.get(0);",
      "    heap.set(0, heap.remove(heap.size() - 1));",
      "    int curr = 0;",
      "    while (true) {",
      "        int left = 2 * curr + 1, right = 2 * curr + 2, largest = curr;",
      "        if (left < heap.size() && heap.get(left) > heap.get(largest)) largest = left;",
      "        if (right < heap.size() && heap.get(right) > heap.get(largest)) largest = right;",
      "        if (largest != curr) {",
      "            Collections.swap(heap, curr, largest);",
      "            curr = largest;",
      "        } else {",
      "            break;",
      "        }",
      "    }",
      "    return maxVal;",
      "}"
    ]
  }
};

const LINE_MAPS = {
  python: {
    insert_push: 2, insert_compare: 6, insert_swap: 7, insert_swap_done: 8, insert_break: 10,
    ext_pop_single: 14, ext_swap_root: 16, ext_pop: 17, ext_compare: 22, ext_swap: 27, ext_break: 30, ext_return: 31
  },
  cpp: {
    insert_push: 2, insert_compare: 6, insert_swap: 7, insert_swap_done: 8, insert_break: 10,
    ext_pop_single: 17, ext_swap_root: 19, ext_pop: 19, ext_compare: 23, ext_swap: 26, ext_break: 29, ext_return: 32
  },
  java: {
    insert_push: 2, insert_compare: 6, insert_swap: 7, insert_swap_done: 8, insert_break: 10,
    ext_pop_single: 17, ext_swap_root: 19, ext_pop: 19, ext_compare: 23, ext_swap: 26, ext_break: 29, ext_return: 32
  }
};

const generateInsertFrames = (currentHeap, nextIdRef, value, type) => {
  const frames = [];
  const heap = [...currentHeap];
  let nodeStates = {};
  
  const addFrame = (msg, lineKey, overrides = {}) => {
    frames.push({ heap: [...heap], nodeStates: {...nodeStates}, logMsg: msg, lineKey, ...overrides });
  };

  heap.push({ id: nextIdRef.current++, val: value });
  let curr = heap.length - 1;
  nodeStates[curr] = 'highlight';
  addFrame(`Inserted ${value} at end of heap.`, 'insert_push');

  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2);
    nodeStates[curr] = 'comparing';
    nodeStates[parent] = 'comparing';
    addFrame(`Comparing ${heap[curr].val} with parent ${heap[parent].val}.`, 'insert_compare');

    const condition = type === 'min' ? heap[curr].val < heap[parent].val : heap[curr].val > heap[parent].val;
    
    if (condition) {
      nodeStates[curr] = 'swapping';
      nodeStates[parent] = 'swapping';
      addFrame(`Heap property violated. Swapping ${heap[curr].val} and ${heap[parent].val}.`, 'insert_swap');
      
      [heap[curr], heap[parent]] = [heap[parent], heap[curr]];
      nodeStates = {}; 
      nodeStates[parent] = 'highlight'; 
      addFrame(`Swapped.`, 'insert_swap_done');
      
      curr = parent;
    } else {
      nodeStates = { [curr]: 'highlight' };
      addFrame(`Heap property satisfied.`, 'insert_break');
      break;
    }
  }
  
  nodeStates = { [curr]: 'highlight' };
  addFrame(`Insertion complete.`, null);
  return frames;
};

const generateExtractFrames = (currentHeap, type) => {
  const frames = [];
  let heap = [...currentHeap];
  let nodeStates = {};
  
  const addFrame = (msg, lineKey, overrides = {}) => {
    frames.push({ heap: [...heap], nodeStates: {...nodeStates}, logMsg: msg, lineKey, ...overrides });
  };

  if (heap.length === 0) return frames;
  
  if (heap.length === 1) {
    const val = heap[0].val;
    nodeStates[0] = 'swapping';
    addFrame(`Extracting root ${val}.`, 'ext_pop_single');
    heap.pop();
    nodeStates = {};
    addFrame(`Heap is now empty.`, null, { extracted: val });
    return frames;
  }

  const extVal = heap[0].val;
  nodeStates[0] = 'swapping';
  nodeStates[heap.length - 1] = 'swapping';
  addFrame(`Swapping root (${heap[0].val}) with last element (${heap[heap.length - 1].val}).`, 'ext_swap_root');

  [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]];
  addFrame(`Swapped. Preparing to remove old root.`, 'ext_swap_root');

  heap.pop();
  nodeStates = { 0: 'highlight' };
  addFrame(`Extracted ${extVal}. New root is ${heap[0].val}. Heapifying down.`, 'ext_pop', { extracted: extVal });

  let curr = 0;
  while (true) {
    const left = 2 * curr + 1;
    const right = 2 * curr + 2;
    let target = curr;

    nodeStates = { [curr]: 'highlight' };
    
    if (left < heap.length) {
      nodeStates[left] = 'comparing';
      const condLeft = type === 'min' ? heap[left].val < heap[target].val : heap[left].val > heap[target].val;
      if (condLeft) target = left;
    }
    if (right < heap.length) {
      nodeStates[right] = 'comparing';
      const condRight = type === 'min' ? heap[right].val < heap[target].val : heap[right].val > heap[target].val;
      if (condRight) target = right;
    }

    if (left < heap.length || right < heap.length) {
      const childrenStrs = [left < heap.length ? heap[left].val : null, right < heap.length ? heap[right].val : null].filter(v => v !== null).join(', ');
      addFrame(`Comparing node ${heap[curr].val} with its children (${childrenStrs}).`, 'ext_compare');
    } else {
      addFrame(`Node has no children. Heapify down complete.`, 'ext_break');
      break;
    }

    if (target !== curr) {
      nodeStates[curr] = 'swapping';
      nodeStates[target] = 'swapping';
      addFrame(`Heap property violated. Swapping ${heap[curr].val} with ${heap[target].val}.`, 'ext_swap');
      
      [heap[curr], heap[target]] = [heap[target], heap[curr]];
      curr = target;
      nodeStates = { [curr]: 'highlight' };
      addFrame(`Swapped.`, 'ext_swap');
    } else {
      addFrame(`Heap property satisfied.`, 'ext_break');
      break;
    }
  }

  nodeStates = {};
  addFrame(`Extraction complete.`, 'ext_return', { extracted: extVal });
  
  return frames;
};

const getNodeCoords = (index) => {
  if (index === 0) return { x: 50, y: 15 };
  const level = Math.floor(Math.log2(index + 1));
  const levelNodes = Math.pow(2, level);
  const position = index - (levelNodes - 1);
  const widthPerNode = 100 / levelNodes;
  const x = (position * widthPerNode) + (widthPerNode / 2);
  const y = 15 + (level * 25); 
  return { x, y };
};

export default function BinaryHeapVisualizer() {
  const [heap, setHeap] = useState([]); 
  const nextId = useRef(0);
  
  const [activeAlgo, setActiveAlgo] = useState("min"); // 'min' or 'max'
  const [language, setLanguage] = useState("python");
  const [inputVal, setInputVal] = useState("");
  
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  
  const logEndRef = useRef(null);

  // Playback Engine
  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIdx(p => p + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  // Handle Algorithm Switch (Silent Re-heapify)
  useEffect(() => {
    if (heap.length > 0) {
      const newHeap = [];
      for (let i = 0; i < heap.length; i++) {
        newHeap.push(heap[i]);
        let curr = newHeap.length - 1;
        while (curr > 0) {
          let parent = Math.floor((curr - 1) / 2);
          let cond = activeAlgo === 'min' ? newHeap[curr].val < newHeap[parent].val : newHeap[curr].val > newHeap[parent].val;
          if (cond) {
            [newHeap[curr], newHeap[parent]] = [newHeap[parent], newHeap[curr]];
            curr = parent;
          } else break;
        }
      }
      setHeap(newHeap);
    }
    setFrames([]); setFrameIdx(-1); setIsPlaying(false);
  }, [activeAlgo]);

  const handleInsert = () => {
    if (isPlaying || (frames.length > 0 && frameIdx < frames.length - 1)) return;
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    if (heap.length >= 15) { setInputVal(""); return; } // Max 15 nodes
    
    const newFrames = generateInsertFrames(heap, nextId, val, activeAlgo);
    setHeap(newFrames[newFrames.length - 1].heap);
    setFrames(newFrames);
    setFrameIdx(0);
    setIsPlaying(true);
    setInputVal("");
  };

  const handleExtract = () => {
    if (isPlaying || (frames.length > 0 && frameIdx < frames.length - 1) || heap.length === 0) return;
    
    const newFrames = generateExtractFrames(heap, activeAlgo);
    if (newFrames.length > 0) {
      setHeap(newFrames[newFrames.length - 1].heap);
      setFrames(newFrames);
      setFrameIdx(0);
      setIsPlaying(true);
    }
  };
  
  const handleRandomize = () => {
    if (isPlaying || (frames.length > 0 && frameIdx < frames.length - 1)) return;
    const count = Math.floor(Math.random() * 5) + 7; // 7 to 11 nodes
    const newHeap = [];
    nextId.current = 0;
    
    const vals = Array.from({length: count}, () => Math.floor(Math.random() * 90) + 10);
    
    for (let v of vals) {
      newHeap.push({id: nextId.current++, val: v});
      let curr = newHeap.length - 1;
      while(curr > 0) {
        let parent = Math.floor((curr - 1) / 2);
        let cond = activeAlgo === 'min' ? newHeap[curr].val < newHeap[parent].val : newHeap[curr].val > newHeap[parent].val;
        if (cond) {
          [newHeap[curr], newHeap[parent]] = [newHeap[parent], newHeap[curr]];
          curr = parent;
        } else break;
      }
    }
    setHeap(newHeap);
    setFrames([]);
    setFrameIdx(-1);
    setIsPlaying(false);
  };
  
  const handleClear = () => {
    if (isPlaying || (frames.length > 0 && frameIdx < frames.length - 1)) return;
    setHeap([]);
    setFrames([]);
    setFrameIdx(-1);
    setIsPlaying(false);
    nextId.current = 0;
  };

  const isLocked = isPlaying || (frames.length > 0 && frameIdx < frames.length - 1);
  const currFrame = frames[frameIdx] || { heap: heap, nodeStates: {}, logMsg: 'Ready. Insert or Extract to visualize.', lineKey: null };
  const currHeap = currFrame.heap;
  const highlightLine = currFrame.lineKey ? LINE_MAPS[language][currFrame.lineKey] : -1;

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* Sidebar */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><ListTree size={24} /> Binary Heap</h1>
        
        <div className="playback-panel">
          <input type="range" className="slider" min="-1" max={frames.length ? frames.length-1 : 0} value={frameIdx} onChange={e => {setFrameIdx(Number(e.target.value)); setIsPlaying(false);}} disabled={frames.length === 0} />
          
          <div className="player-controls">
            <button className="ctrl-btn" onClick={() => {setFrameIdx(-1); setIsPlaying(false);}} disabled={frameIdx <= -1}><RotateCcw size={16}/></button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p-1); setIsPlaying(false);}} disabled={frameIdx <= 0}><SkipBack size={16}/></button>
            <button className="ctrl-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={frames.length === 0 || frameIdx === frames.length-1}>
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p+1); setIsPlaying(false);}} disabled={frames.length === 0 || frameIdx >= frames.length-1}><SkipForward size={16}/></button>
          </div>
          
          <div style={{marginTop: '0.75rem'}}>
            <label style={{fontSize:'0.65rem', color:'var(--cyan-400)', display:'flex', justifyContent:'space-between'}}><span>Animation Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm Variant</label>
          <select value={activeAlgo} onChange={e => setActiveAlgo(e.target.value)} className="input-field" disabled={isLocked}>
            <option value="min">Min Heap</option>
            <option value="max">Max Heap</option>
          </select>
        </div>

        <div className="complexity-box">
          <div className="comp-item"><span className="comp-label">Time (Insert/Extract)</span> <span className="comp-val">O(log N)</span></div>
          <div className="comp-item"><span className="comp-label">Space Complexity</span> <span className="comp-val">O(1)</span></div>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        {/* Action Panel */}
        <div className="action-panel" style={{background: 'var(--bg-dark-950)'}}>
          <div className="panel-header">Heap Operations</div>
          
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <input type="number" placeholder="Enter Value" value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} className="input-field" disabled={isLocked || heap.length >= 15} />
            <button onClick={handleInsert} className="btn btn-green" style={{width:'auto'}} disabled={isLocked || !inputVal || heap.length >= 15}><Plus size={16}/> Insert</button>
          </div>
          
          <div style={{marginBottom: '0.75rem'}}>
            <button onClick={handleExtract} className="btn btn-purple" disabled={isLocked || heap.length === 0}>
              <ArrowDownToLine size={16}/> Extract {activeAlgo === 'min' ? 'Min' : 'Max'}
            </button>
          </div>

          <div className="row-flex">
            <button onClick={handleRandomize} className="btn btn-cyan" disabled={isLocked}><Shuffle size={14}/> Randomize</button>
            <button onClick={handleClear} className="btn btn-red" disabled={isLocked}><Trash2 size={14}/> Clear</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
          {currFrame.extracted !== undefined && (
             <span style={{color:'var(--purple-400)', fontWeight:'bold', fontSize:'0.85rem'}}>Extracted Value: {currFrame.extracted}</span>
          )}
        </div>

        <div className="top-layout">
          {/* Canvas */}
          <div className="canvas-wrapper">
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', zIndex:5, fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold'}}>TREE VIEW (MAX 15 NODES)</div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}}>
              {Array.from({ length: currHeap.length }).map((_, i) => {
                const coords = getNodeCoords(i);
                const leftIdx = 2 * i + 1;
                const rightIdx = 2 * i + 2;
                const edges = [];
                if (leftIdx < currHeap.length) {
                  const leftCoords = getNodeCoords(leftIdx);
                  edges.push(<line key={`l-${i}`} x1={`${coords.x}%`} y1={`${coords.y}%`} x2={`${leftCoords.x}%`} y2={`${leftCoords.y}%`} className="edge-line" />);
                }
                if (rightIdx < currHeap.length) {
                  const rightCoords = getNodeCoords(rightIdx);
                  edges.push(<line key={`r-${i}`} x1={`${coords.x}%`} y1={`${coords.y}%`} x2={`${rightCoords.x}%`} y2={`${rightCoords.y}%`} className="edge-line" />);
                }
                return edges;
              })}
            </svg>

            {currHeap.map((obj, i) => {
              const coords = getNodeCoords(i);
              const state = currFrame.nodeStates[i] || 'default';
              return (
                <div key={obj.id} className={`graph-node ${state}`} style={{left: `${coords.x}%`, top: `${coords.y}%`}}>
                  {obj.val}
                </div>
              )
            })}
            
            {currHeap.length === 0 && (
               <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-gray-600)', fontStyle: 'italic', fontSize: '0.9rem'}}>Heap is empty. Insert values to begin.</div>
            )}
          </div>

          {/* Array View */}
          <div className="array-wrapper">
             <div className="ds-header">
               <span>Array Representation</span>
               <span style={{fontSize:'0.65rem', color:'var(--text-gray-500)', fontWeight:'normal'}}>Formula: Parent=(i-1)/2, Left=2i+1, Right=2i+2</span>
             </div>
             <div className="array-container">
               {currHeap.map((obj, i) => {
                 const state = currFrame.nodeStates[i] || 'default';
                 return (
                    <div key={obj.id} className="array-cell-wrapper">
                      <div className={`array-cell ${state}`}>{obj.val}</div>
                      <div className="array-index">{i}</div>
                    </div>
                 );
               })}
               {currHeap.length === 0 && (
                  <span style={{color:'var(--text-gray-600)', fontSize:'0.8rem', fontStyle:'italic', padding:'0.5rem'}}>Array is empty</span>
               )}
             </div>
          </div>
        </div>

        {/* Bottom Row: Code & Logs */}
        <div className="bottom-layout">
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center', justifyContent: 'space-between'}}>
               <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                 <Code size={14}/> Algorithm Tracker
               </div>
               <select 
                 value={language} 
                 onChange={e => setLanguage(e.target.value)} 
                 style={{ background: 'var(--bg-dark-900)', color: 'var(--cyan-400)', border: '1px solid var(--border-gray-700)', borderRadius: '0.25rem', padding: '0.1rem 0.4rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
               >
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
                 <option value="java">Java</option>
               </select>
             </div>
              <pre className="code-content"><code>
                {ALGO_CODES[activeAlgo][language].map((line, idx) => {
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
                  return (
                    <span key={idx} className={`code-line ${highlightLine === (idx + 1) ? 'highlight' : ''}`} style={isComment ? {color: 'var(--text-gray-500)', fontStyle: 'italic'} : {}}>
                      {line || '\u00A0'}
                    </span>
                  );
                })}
              </code></pre>
          </div>
          
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><Info size={14}/> Execution Log</div>
             <ul className="log-content">
               {frames.length === 0 && <li className="log-item">Awaiting execution...</li>}
               {frames.slice(0, frameIdx + 1).map((f, idx) => (
                 <li key={idx} className={`log-item ${idx === frameIdx ? 'active' : ''}`}>
                   <span style={{color:'var(--text-gray-500)', marginRight:'0.4rem'}}>[{idx}]</span> {f.logMsg}
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