import React, { useState, useRef, useEffect } from 'react';
import { List, Pause, Play, RefreshCw, Search, ArrowLeftRight, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // We need a UUID library for stable keys

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
      --red-600: #dc2626;

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
      margin-bottom: 1rem;
    }
    
    .input-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
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
      margin-bottom: 1rem;
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

    .btn-cyan {
      background-color: var(--cyan-600);
      color: white;
    }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    
    .btn-green {
      background-color: var(--green-600);
      color: white;
    }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    
    .btn-red {
      background-color: var(--red-600);
      color: white;
    }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }

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
      justify-content: flex-start; /* Align nodes to the start */
      align-items: center;
      gap: 0.5rem;
      padding: 2rem;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-height: 150px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      overflow-x: auto;
    }
    
    .node-container {
        display: flex;
        align-items: center;
        animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .node-wrapper {
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
      border: 2px solid transparent;
      position: relative;
    }
    
    .head-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--cyan-400);
      margin-bottom: 0.25rem;
    }

    .tail-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--pink-500);
      margin-bottom: 0.25rem;
    }

    .box-index {
      margin-top: 0.5rem;
      font-size: 0.875rem; /* 14px */
      color: var(--text-gray-400);
    }
    
    .pointer-arrow {
        color: var(--cyan-500);
        margin: 0 0.5rem;
        flex-shrink: 0;
    }
    
    .null-node {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-gray-500);
        padding: 0 1rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .box.default {
      background-color: var(--bg-dark-600);
      color: white;
      border-color: var(--border-gray-500);
    }

    .box.visiting {
      background-color: var(--yellow-500);
      color: black;
      transform: scale(1.1);
      border-color: var(--yellow-400);
    }
    
    .box.pre-op {
      background-color: var(--orange-500);
      color: white;
      transform: scale(1.1);
      border-color: var(--orange-600);
    }

    .box.found {
      background-color: var(--green-500);
      color: white;
      transform: scale(1.1);
      border-color: var(--green-400);
      box-shadow: 0 0 15px var(--green-500);
    }

    .box.deleting {
      background-color: var(--red-600);
      color: white;
      transform: scale(0.8);
      opacity: 0.5;
      border-color: var(--red-400);
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
class Node:
  def __init__(self, value):
    self.value = value
    self.next = None
    self.prev = None

class DoublyLinkedList:
  def __init__(self):
    self.head = None
    self.tail = None

  def add_head(self, value):
    # ...
  
  def add_tail(self, value):
    # ...

  def delete_value(self, value):
    # ...
  
  def search(self, value):
    current = self.head
    while current:
      if current.value == value:
        return True
      current = current.next
    return False
  `,
  c: `
#include <stdio.h>
#include <stdlib.h>

struct Node {
  int value;
  struct Node* next;
  struct Node* prev;
};

struct Node* head = NULL;
struct Node* tail = NULL;

void addHead(int value) {
  // ...
}

void addTail(int value) {
  // ...
}

void deleteValue(int value) {
  // ...
}

bool search(int value) {
  struct Node* current = head;
  while (current != NULL) {
    if (current->value == value) {
      return true;
    }
    current = current->next;
  }
  return false;
}
  `,
  cpp: `
#include <iostream>

class Node {
public:
  int value;
  Node* next;
  Node* prev;
  Node(int val) : value(val), next(nullptr), prev(nullptr) {}
};

class DoublyLinkedList {
public:
  Node* head;
  Node* tail;
  DoublyLinkedList() : head(nullptr), tail(nullptr) {}

  void addHead(int value) {
    // ...
  }

  void addTail(int value) {
    // ...
  }

  void deleteValue(int value) {
    // ...
  }

  bool search(int value) {
    Node* current = head;
    while (current) {
      if (current->value == value) {
        return true;
      }
      current = current->next;
    }
    return false;
  }
};
  `,
  java: `
class Node {
  int value;
  Node next;
  Node prev;

  Node(int value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  Node head;
  Node tail;

  public void addHead(int value) {
    // ...
  }

  public void addTail(int value) {
    // ...
  }

  public void deleteValue(int value) {
    // ...
  }

  public boolean search(int value) {
    Node current = head;
    while (current != null) {
      if (current.value == value) {
        return true;
      }
      current = current.next;
    }
    return false;
  }
}
  `,
};

/**
 * A utility function to create a delay.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Main Component ---

export default function DoublyLinkedList() {
  // We use an array to represent the linked list for easier state management
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  
  const [language, setLanguage] = useState("c");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Create a new list or add a node.");
  const [executionLog, setExecutionLog] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  
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
  
  // --- Helper: Animate List Changes ---
  // This helper highlights nodes one by one
  const traverseTo = async (targetIndex, startState, endState) => {
    for (let i = 0; i < targetIndex; i++) {
        if (isCancelledRef.current) return;
        await checkPause();
        
        setList(prev => prev.map((n, idx) => ({
            ...n,
            state: idx === i ? startState : n.state
        })));
        await sleep(speed);
        setList(prev => prev.map((n, idx) => ({
            ...n,
            state: idx === i ? endState : n.state
        })));
    }
  };
  
  // --- Helper: Reset All Node States ---
  const resetNodeStates = (delay = 0) => {
    setTimeout(() => {
        setList(prev => prev.map(n => ({ ...n, state: 'default' })));
    }, delay);
  };
  
  // --- Helper: Validate Value/Index ---
  const getVal = () => {
      const num = parseInt(value);
      if (isNaN(num)) {
          setError("Please enter a valid number for 'Value'.");
          return null;
      }
      return num;
  };
  
  const getIdx = () => {
      const num = parseInt(index);
      if (isNaN(num) || num < 0) {
          setError("Please enter a valid, non-negative number for 'Index'.");
          return null;
      }
      return num;
  };
  
  // --- Pause Helper ---
  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Press Resume to continue.");
      await sleep(100);
    }
  };
  
  // --- Operation: Add Head ---
  const handleAddHead = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Adding ${val} to HEAD`]);
    setStatus(`Adding ${val} to HEAD...`);
    
    const newNode = { value: val, id: uuidv4(), state: 'found' };
    
    await sleep(speed);
    setList(prev => [newNode, ...prev]);
    
    resetNodeStates(speed);
    setIsVisualizing(false);
    setValue("");
  };
  
  // --- Operation: Add Tail ---
  const handleAddTail = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Adding ${val} to TAIL`]);
    setStatus(`Traversing to TAIL...`);
    
    await traverseTo(list.length, 'visiting', 'default');
    
    if (isCancelledRef.current) {
        setIsVisualizing(false);
        return;
    }
    
    setStatus(`Adding ${val} to TAIL...`);
    const newNode = { value: val, id: uuidv4(), state: 'found' };
    
    setList(prev => [...prev, newNode]);
    
    resetNodeStates(speed);
    setIsVisualizing(false);
    setValue("");
  };
  
  // --- Operation: Add At Index ---
  const handleAddAtIndex = async () => {
    const val = getVal();
    const idx = getIdx();
    if (val === null || idx === null) return;
    
    if (idx > list.length) {
        setError(`Index ${idx} is out of bounds for insertion.`);
        return;
    }
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Inserting ${val} at index ${idx}`]);
    
    if (idx === 0) {
        await handleAddHead(); // Re-use head logic
        setIndex("");
        return;
    }
    
    setStatus(`Traversing to index ${idx - 1}...`);
    await traverseTo(idx, 'visiting', 'default');
    
    if (isCancelledRef.current) {
        setIsVisualizing(false);
        return;
    }
    
    // Highlight the node *before* insertion
    setList(prev => prev.map((n, i) => ({ ...n, state: i === idx - 1 ? 'pre-op' : 'default' })));
    setStatus(`Inserting ${val} at index ${idx}`);
    await sleep(speed);
    
    const newNode = { value: val, id: uuidv4(), state: 'found' };
    setList(prev => {
        const newList = [...prev];
        newList.splice(idx, 0, newNode);
        return newList;
    });
    
    resetNodeStates(speed);
    setIsVisualizing(false);
    setValue("");
    setIndex("");
  };

  // --- Operation: Delete Head ---
  const handleDeleteHead = async () => {
    if (list.length === 0) {
        setError("List is already empty.");
        return;
    }
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Deleting HEAD (Value: ${list[0].value})`]);
    setStatus(`Deleting HEAD...`);
    
    setList(prev => prev.map((n, i) => ({ ...n, state: i === 0 ? 'deleting' : 'default' })));
    await sleep(speed);
    
    setList(prev => prev.slice(1));
    
    setStatus(`Deleted HEAD node.`);
    resetNodeStates();
    setIsVisualizing(false);
  };
  
  // --- Operation: Delete Tail ---
  const handleDeleteTail = async () => {
    if (list.length === 0) {
        setError("List is already empty.");
        return;
    }
    
    if (list.length === 1) {
        await handleDeleteHead();
        return;
    }
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Deleting TAIL (Value: ${list[list.length - 1].value})`]);
    setStatus(`Traversing to node before TAIL...`);
    
    await traverseTo(list.length - 1, 'visiting', 'default');
    
    if (isCancelledRef.current) {
        setIsVisualizing(false);
        return;
    }
    
    setStatus(`Deleting TAIL...`);
    setList(prev => prev.map((n, i) => ({
        ...n,
        state: i === list.length - 2 ? 'pre-op' : (i === list.length - 1 ? 'deleting' : 'default')
    })));
    
    await sleep(speed);
    setList(prev => prev.slice(0, -1));
    
    setStatus(`Deleted TAIL node.`);
    resetNodeStates();
    setIsVisualizing(false);
  };
  
  // --- Operation: Delete At Index ---
  const handleDeleteAtIndex = async () => {
    const idx = getIdx();
    if (idx === null) return;
    
    if (idx >= list.length) {
        setError(`Index ${idx} is out of bounds.`);
        return;
    }
    
    if (idx === 0) {
        await handleDeleteHead();
        setIndex("");
        return;
    }
    
    if (idx === list.length - 1) {
        await handleDeleteTail();
        setIndex("");
        return;
    }
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Deleting node at index ${idx}`]);
    setStatus(`Traversing to index ${idx - 1}...`);
    
    await traverseTo(idx, 'visiting', 'default');
    
    if (isCancelledRef.current) {
        setIsVisualizing(false);
        return;
    }
    
    setStatus(`Deleting node at index ${idx}...`);
    setList(prev => prev.map((n, i) => ({
        ...n,
        state: i === idx - 1 ? 'pre-op' : (i === idx ? 'deleting' : 'default')
    })));
    
    await sleep(speed);
    setList(prev => prev.filter((_, i) => i !== idx));
    
    setStatus(`Deleted node at index ${idx}.`);
    resetNodeStates();
    setIsVisualizing(false);
    setIndex("");
  };
  
  // --- Operation: Delete By Value ---
  const handleDeleteByValue = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Deleting first occurrence of value ${val}`]);
    
    let foundIndex = -1;
    for (let i = 0; i < list.length; i++) {
        if (isCancelledRef.current) {
            setIsVisualizing(false);
            return;
        }
        await checkPause();
        
        setStatus(`Searching for ${val}... checking index ${i}`);
        setList(prev => prev.map((n, idx) => ({
            ...n,
            state: idx === i ? 'visiting' : 'default'
        })));
        await sleep(speed);
        
        if (list[i].value === val) {
            foundIndex = i;
            break;
        }
    }
    
    if (foundIndex === -1) {
        setStatus(`Value ${val} not found in list.`);
        setExecutionLog(prev => [...prev, `Value ${val} not found.`]);
        resetNodeStates();
        setIsVisualizing(false);
        setValue("");
        return;
    }
    
    // Found it, now delete it using index logic
    setIndex(String(foundIndex)); // Set index state for deletion
    if (foundIndex === 0) {
        await handleDeleteHead();
    } else if (foundIndex === list.length - 1) {
        await handleDeleteTail();
    } else {
        // We already traversed, so just do the delete part
        setStatus(`Deleting node at index ${foundIndex}...`);
        setList(prev => prev.map((n, i) => ({
            ...n,
            state: i === foundIndex - 1 ? 'pre-op' : (i === foundIndex ? 'deleting' : 'default')
        })));
        
        await sleep(speed);
        setList(prev => prev.filter((_, i) => i !== foundIndex));
        
        setStatus(`Deleted node at index ${foundIndex}.`);
        resetNodeStates();
    }
    
    setIsVisualizing(false);
    setValue("");
    setIndex("");
  };
  
  // --- Operation: Search ---
  const handleSearch = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Searching for value ${val}`]);
    
    let found = false;
    for (let i = 0; i < list.length; i++) {
        if (isCancelledRef.current) {
            setIsVisualizing(false);
            return;
        }
        await checkPause();
        
        setStatus(`Searching... checking index ${i} (Value: ${list[i].value})`);
        setList(prev => prev.map((n, idx) => ({
            ...n,
            state: idx === i ? 'visiting' : 'default'
        })));
        await sleep(speed);
        
        if (list[i].value === val) {
            setStatus(`Found ${val} at index ${i}!`);
            setExecutionLog(prev => [...prev, `Found ${val} at index ${i}!`]);
            setList(prev => prev.map((n, idx) => ({
                ...n,
                state: idx === i ? 'found' : 'default'
            })));
            found = true;
            break;
        }
    }
    
    if (!found) {
        setStatus(`Value ${val} not found in the list.`);
        setExecutionLog(prev => [...prev, `Value ${val} not found.`]);
    }
    
    resetNodeStates(speed * 2);
    setIsVisualizing(false);
    setValue("");
  };

  /**
   * Resets the entire visualizer.
   */
  const handleReset = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    
    setList([]);
    setValue("");
    setIndex("");
    setError(null);
    setStatus("Create a new list or add a node.");
    setHighlightLineNum(-1);
    setExecutionLog([]);
    
    // Short delay to allow async processes to cancel
    setTimeout(() => {
        isCancelledRef.current = false;
    }, 100);
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


  const codeLines = codeSnippets[language].trim().split('\n');
  
  const statusColor = status.includes("Found")
    ? "status-found"
    : status.includes("not found")
    ? "status-not-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <ArrowLeftRight size={30} />
          Doubly Linked List
        </h1>

        <div className="input-grid">
            <div className="input-group">
              <label htmlFor="value">Value</label>
              <input
                id="value"
                type="text"
                placeholder="e.g., 10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="index">Index</label>
              <input
                id="index"
                type="text"
                placeholder="e.g., 2"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
              />
            </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* --- Actions --- */}
        <div className="actions-grid">
            <button onClick={handleAddHead} disabled={isVisualizing} className="btn btn-green">Add Head</button>
            <button onClick={handleAddTail} disabled={isVisualizing} className="btn btn-green">Add Tail</button>
        </div>
        <div className="actions-grid">
            <button onClick={handleDeleteHead} disabled={isVisualizing || list.length === 0} className="btn btn-red">Del Head</button>
            <button onClick={handleDeleteTail} disabled={isVisualizing || list.length === 0} className="btn btn-red">Del Tail</button>
        </div>
        <div className="actions-grid">
            <button onClick={handleAddAtIndex} disabled={isVisualizing} className="btn btn-green">Add at Idx</button>
            <button onClick={handleDeleteAtIndex} disabled={isVisualizing || list.length === 0} className="btn btn-red">Del at Idx</button>
        </div>
        
        <div className="actions-grid">
             <button onClick={handleDeleteByValue} disabled={isVisualizing || list.length === 0} className="btn btn-red">Del by Val</button>
             <button onClick={handleSearch} disabled={isVisualizing || list.length === 0} className="btn btn-cyan">Search</button>
        </div>
        
        <hr style={{borderColor: 'var(--border-gray-700)', margin: '1.5rem 0'}} />

        <div className="actions-grid">
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
            Reset List
          </button>
        </div>

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
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
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
            {list.length === 0 && <span style={{color: 'var(--text-gray-500)'}}>List is empty.</span>}
            
            {list.length > 0 && <div className="null-node">NULL</div>}
            
            {list.map((node, idx) => (
              <div className="node-container" key={node.id}>
                <ArrowLeftRight className="pointer-arrow" size={30} />
                <div className="node-wrapper">
                  {idx === 0 && <span className="head-label">HEAD</span>}
                  {idx === list.length - 1 && <span className="tail-label">TAIL</span>}
                  <div
                    className={`box ${node.state}`}
                  >
                    {node.value}
                  </div>
                  <span className="box-index">[{idx}]</span>
                </div>
              </div>
            ))}
            {list.length > 0 && 
                <div className="null-node">
                    <ArrowLeftRight className="pointer-arrow" size={30} />
                    NULL
                </div>
            }
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
