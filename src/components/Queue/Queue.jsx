import React, { useState, useRef, useEffect } from 'react';
import { List, Pause, Play, RefreshCw, ArrowRightToLine, ArrowLeftFromLine, Eye } from 'lucide-react';
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
      min-height: 450px;
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
      justify-content: center;
      align-items: center;
      padding: 2rem;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-height: 350px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      overflow-x: auto;
    }
    
    .queue-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100px;
    }
    
    .queue-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: enqueueAnimation 0.5s ease-out;
    }
    
    @keyframes enqueueAnimation {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .queue-item.deleting {
        animation: dequeueAnimation 0.5s ease-in forwards;
    }
    
    @keyframes dequeueAnimation {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.5); }
    }
    
    .pointer {
      color: var(--pink-500);
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .pointer.front {
      color: var(--cyan-400);
      margin-right: 1rem;
    }
    
    .pointer.rear {
      color: var(--pink-500);
      margin-left: 1rem;
    }
    
    .pointer .arrow {
        font-size: 1.5rem;
    }

    .box {
      width: 4rem; /* 64px */
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem; /* 20px */
      font-weight: 700;
      border: 2px solid var(--border-gray-500);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      border-radius: 0.5rem;
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

    .box.visiting {
      background-color: var(--yellow-500);
      color: black;
      transform: scale(1.1);
      border-color: var(--yellow-400);
    }
    
    .box.found {
      background-color: var(--green-500);
      color: white;
      transform: scale(1.1);
      border-color: var(--green-400);
      box-shadow: 0 0 15px var(--green-500);
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
class Queue:
  def __init__(self):
    self.items = []

  def is_empty(self):
    return len(self.items) == 0

  def enqueue(self, item):
    self.items.append(item)

  def dequeue(self):
    if not self.is_empty():
      return self.items.pop(0)
    else:
      return "Queue is empty"

  def peek(self):
    if not self.is_empty():
      return self.items[0]
    else:
      return "Queue is empty"
  `,
  c: `
#include <stdio.h>
#define MAX_SIZE 100

int queue[MAX_SIZE];
int front = -1;
int rear = -1;

void enqueue(int value) {
  if (rear < MAX_SIZE - 1) {
    if (front == -1) front = 0;
    queue[++rear] = value;
  } else {
    printf("Queue Overflow\\n");
  }
}

int dequeue() {
  if (front != -1 && front <= rear) {
    return queue[front++];
  } else {
    printf("Queue Underflow\\n");
    front = rear = -1;
    return -1;
  }
}

int peek() {
  if (front != -1 && front <= rear) {
    return queue[front];
  } else {
    printf("Queue is empty\\n");
    return -1;
  }
}
  `,
  cpp: `
#include <iostream>
#include <queue>

std::queue<int> q;

void enqueue_item(int value) {
  q.push(value);
}

int dequeue_item() {
  if (!q.empty()) {
    int value = q.front();
    q.pop();
    return value;
  }
  return -1; // Error
}

int peek_item() {
  if (!q.empty()) {
    return q.front();
  }
  return -1; // Error
}
  `,
  java: `
import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> queue = new LinkedList<>();

public void enqueueItem(int value) {
  queue.add(value);
}

public int dequeueItem() {
  if (!queue.isEmpty()) {
    return queue.poll();
  }
  return -1; // Error
}

public int peekItem() {
  if (!queue.isEmpty()) {
    return queue.peek();
  }
  return -1; // Error
}
  `,
};

/**
 * A utility function to create a delay.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Main Component ---

export default function Queue() {
  const [queue, setQueue] = useState([]);
  const [value, setValue] = useState("");
  
  const [language, setLanguage] = useState("c");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Queue is empty. Enqueue a value to start.");
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
  
  // --- Helper: Validate Value ---
  const getVal = () => {
      const num = parseInt(value);
      if (isNaN(num)) {
          setError("Please enter a valid number for 'Value'.");
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
  
  // --- Operation: Enqueue ---
  const handleEnqueue = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    await checkPause();
    
    setExecutionLog(prev => [...prev, `Enqueuing ${val} to the REAR.`]);
    setStatus(`Enqueuing ${val}...`);
    
    const newNode = { value: val, id: uuidv4(), state: 'found' };
    setQueue(prev => [...prev, newNode]);
    
    await sleep(speed);
    
    if (isCancelledRef.current) return;
    
    setQueue(prev => prev.map(n => n.id === newNode.id ? { ...n, state: 'default' } : n));
    setStatus(`Enqueued ${val}.`);
    setIsVisualizing(false);
    setValue("");
  };
  
  // --- Operation: Dequeue ---
  const handleDequeue = async () => {
    if (queue.length === 0) {
        setError("Queue is empty. Cannot dequeue.");
        return;
    }
    
    setError(null);
    setIsVisualizing(true);
    await checkPause();
    
    const itemToDequeue = queue[0];
    setExecutionLog(prev => [...prev, `Dequeuing ${itemToDequeue.value} from the FRONT.`]);
    setStatus(`Dequeuing ${itemToDequeue.value}...`);
    
    // Set 'deleting' state for animation
    setQueue(prev => prev.map(n => n.id === itemToDequeue.id ? { ...n, state: 'deleting' } : n));
    
    await sleep(speed); // Wait for animation
    
    if (isCancelledRef.current) return;
    
    setQueue(prev => prev.filter(n => n.id !== itemToDequeue.id));
    setStatus(`Dequeued ${itemToDequeue.value}.`);
    setIsVisualizing(false);
  };
  
  // --- Operation: Peek ---
  const handlePeek = async () => {
    if (queue.length === 0) {
        setError("Queue is empty. Cannot peek.");
        return;
    }
    
    setError(null);
    setIsVisualizing(true);
    await checkPause();
    
    const itemToPeek = queue[0];
    setExecutionLog(prev => [...prev, `Peeking at FRONT value: ${itemToPeek.value}`]);
    setStatus(`Peeking... FRONT value is ${itemToPeek.value}`);
    
    setQueue(prev => prev.map(n => n.id === itemToPeek.id ? { ...n, state: 'visiting' } : n));
    
    await sleep(speed * 2); // Hold highlight longer
    
    if (isCancelledRef.current) return;
    
    setQueue(prev => prev.map(n => n.id === itemToPeek.id ? { ...n, state: 'default' } : n));
    setStatus(`Peeked ${itemToPeek.value}.`);
    setIsVisualizing(false);
  };

  /**
   * Resets the entire visualizer.
   */
  const handleReset = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    
    setQueue([]);
    setValue("");
    setError(null);
    setStatus("Queue is empty. Enqueue a value to start.");
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
  
  const statusColor = status.includes("Dequeued") || status.includes("empty")
    ? "status-not-found"
    : status.includes("Enqueued") || status.includes("Peeked")
    ? "status-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <List size={30} />
          Queue
        </h1>

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
        
        {error && <div className="error-message">{error}</div>}

        {/* --- Actions --- */}
        <div className="actions-grid">
            <button onClick={handleEnqueue} disabled={isVisualizing} className="btn btn-green">
                <ArrowRightToLine size={18} />
                Enqueue
            </button>
            <button onClick={handleDequeue} disabled={isVisualizing || queue.length === 0} className="btn btn-red">
                <ArrowLeftFromLine size={18} />
                Dequeue
            </button>
        </div>
        <div className="actions-grid">
            <button onClick={handlePeek} disabled={isVisualizing || queue.length === 0} className="btn btn-cyan">
                <Eye size={18} />
                Peek
            </button>
             <button
                onClick={handleReset}
                className="btn btn-secondary"
            >
                <RefreshCw size={18} />
                Reset Queue
            </button>
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
          
          <div className="input-group" style={{marginBottom: 0}}>
            <label htmlFor="speed" style={{marginBottom: '0.5rem'}}>Visualization Speed</label>
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
            </div>
          </div>
        </div>
        <span className="speed-value" style={{display: 'block', textAlign: 'right', marginTop: '-0.5rem'}}>{speed} ms</span>


        {/* --- Settings --- */}
        <div className="input-group" style={{marginTop: '1.5rem'}}>
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
            {queue.length === 0 && <span style={{color: 'var(--text-gray-500)', alignSelf: 'center'}}>Queue is empty.</span>}
            
            <div className="queue-container">
                {queue.length > 0 && 
                    <div className="pointer front">
                        <span>FRONT</span>
                        <span className="arrow">&darr;</span>
                    </div>
                }
                
                {queue.map((node, idx) => (
                  <div 
                    className={`queue-item ${node.state === 'deleting' ? 'deleting' : ''}`} 
                    key={node.id}
                    style={{ zIndex: queue.length - idx }} // Ensure proper layering
                  >
                    <div className="box-wrapper" style={{marginLeft: idx > 0 ? '1rem' : '0'}}>
                        <div
                            className={`box ${node.state}`}
                        >
                            {node.value}
                        </div>
                        <span className="box-index">[{idx}]</span>
                    </div>
                  </div>
                ))}
                
                {queue.length > 0 && 
                    <div className="pointer rear">
                        <span>REAR</span>
                        <span className="arrow">&darr;</span>
                    </div>
                }
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
