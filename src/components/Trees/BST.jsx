import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search } from 'lucide-react';
// Using browser's crypto.randomUUID() for unique keys

// --- In-line CSS Styles ---
const InjectedStyles = () => (
  <style>{`
    /* --- Global Styles & Variables (Same as DLL) --- */
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

    /* --- Base Layout Styles (Same as DLL) --- */
    .visualizer-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: var(--bg-dark-900);
      color: var(--text-gray-200);
    }

    * { box-sizing: border-box; }

    .visualizer-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; }
    }

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
    .sidebar-title svg { margin-right: 0.75rem; }

    /* --- Form & Button Styles (Same as DLL) --- */
    .input-group { margin-bottom: 1rem; }
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
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .error-message {
      color: var(--red-400);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: rgba(248, 113, 113, 0.1);
      border: 1px solid var(--red-400);
      border-radius: 0.5rem;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .actions-single {
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
      width: 100%;
    }
    .btn svg { width: 18px; height: 18px; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
    .btn-pause { background-color: var(--yellow-600); color: black; }
    .btn-pause:hover:not(:disabled) { background-color: var(--yellow-500); }
    .btn-resume { background-color: var(--green-600); color: white; }
    .btn-resume:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-secondary { background-color: var(--bg-dark-600); color: white; }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-500); }

    /* --- Slider Styles (Same as DLL) --- */
    .speed-slider-group { display: flex; align-items: center; gap: 1rem; }
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

    /* --- Main Content (Same as DLL) --- */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }
    @media (min-width: 768px) {
      .main-content { padding: 2.5rem; }
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1.5rem 0;
      color: var(--text-gray-200);
    }

    /* --- Visualization Area (Same as DLL) --- */
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
      font-size: 1.125rem;
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
      align-items: flex-start;
      gap: 0.5rem;
      padding: 2rem;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-height: 250px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      overflow-x: auto;
    }
    
    /* --- Box Styles (Same as DLL) --- */
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

    /* --- NEW: Tree Visualization Styles --- */
    .tree-root {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    .tree-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 0.5rem;
      margin: 0 0.5rem;
      animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    .tree-node-value {
      /* This just uses the .box styles */
    }
    .tree-children {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      position: relative;
    }
    /* Vertical line from parent */
    .tree-children::before {
      content: '';
      position: absolute;
      top: -0.25rem;
      height: 1.75rem;
      width: 2px;
      background-color: var(--border-gray-600);
    }
    
    .tree-child-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 0 0.5rem;
    }
    
    /* Horizontal line to child */
    .tree-child-container::before {
      content: '';
      position: absolute;
      top: -1.75rem; /* Aligns with parent's .tree-children padding-top */
      height: 2px;
      background-color: var(--border-gray-600);
      width: 50%;
    }
    
    /* Connect to parent's vertical line */
    .tree-child-container:first-child:before {
      left: 50%;
    }
    .tree-child-container:last-child:before {
      right: 50%;
    }
    /* Handle single child */
    .tree-child-container:first-child:last-child:before {
      width: 0; /* No horizontal line if only one child */
    }

    .tree-null {
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--bg-dark-700);
      font-size: 0.9rem;
      font-weight: 700;
      margin: 0 0.5rem;
      padding: 0 0.5rem;
    }

    /* --- Lower Content (Same as DLL) --- */
    .lower-content-area {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-top: 2rem;
      flex: 1;
    }
    @media (min-width: 1024px) {
      .lower-content-area { flex-direction: row; }
    }

    .code-section, .log-section {
      display: flex;
      flex-direction: column;
      flex: 1; 
      min-height: 300px;
    }
    .code-block, .log-block {
      background-color: var(--bg-dark-950);
      padding: 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      height: 100%;
      overflow: auto;
    }
    @media (max-width: 1023px) {
      .log-block { max-height: 300px; }
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
      min-height: 1.6em;
    }
    .code-line.highlight {
      background-color: rgba(6, 182, 212, 0.2);
      border-radius: 0.25rem;
    }
    .code-line.comment {
      color: var(--text-gray-500);
      font-style: italic;
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
      color: white;
    }
  `}</style>
);


// --- NEW: Code Snippets for Binary Search Tree ---
const codeSnippets = {
  python: `
class Node:
  def __init__(self, key):
    self.left = None
    self.right = None
    self.val = key

def insert(root, key):
  if root is None:
    return Node(key)
  else:
    if root.val == key:
      return root
    elif root.val < key:
      root.right = insert(root.right, key)
    else:
      root.left = insert(root.left, key)
  return root

def search(root, key):
  if root is None or root.val == key:
    return root
  
  if root.val < key:
    return search(root.right, key)
  
  return search(root.left, key)
  `,
  c: `
#include <stdio.h>
#include <stdlib.h>

struct node {
  int key;
  struct node *left, *right;
};

struct node *newNode(int item) {
  struct node *temp = (struct node *)malloc(sizeof(struct node));
  temp->key = item;
  temp->left = temp->right = NULL;
  return temp;
}

struct node *insert(struct node *node, int key) {
  if (node == NULL) return newNode(key);

  if (key < node->key)
    node->left = insert(node->left, key);
  else if (key > node->key)
    node->right = insert(node.right, key);

  return node;
}

struct node *search(struct node *root, int key) {
  if (root == NULL || root->key == key)
    return root;
  
  if (root->key < key)
    return search(root->right, key);
  
  return search(root->left, key);
}
  `,
  cpp: `
#include <iostream>

struct Node {
  int data;
  Node *left, *right;
  Node(int data) {
    this->data = data;
    left = right = NULL;
  }
};

Node* insert(Node* root, int data) {
  if (root == NULL) {
    return new Node(data);
  }
  if (data < root->data) {
    root->left = insert(root->left, data);
  } else if (data > root->data) {
    root->right = insert(root->right, data);
  }
  return root;
}

Node* search(Node* root, int data) {
  if (root == NULL || root->data == data)
    return root;
  
  if (root->data < data)
    return search(root->right, data);
  
  return search(root->left, data);
}
  `,
  java: `
class Node {
  int key;
  Node left, right;

  public Node(int item) {
    key = item;
    left = right = null;
  }
}

class BinaryTree {
  Node root;

  Node insertRec(Node root, int key) {
    if (root == null) {
      root = new Node(key);
      return root;
    }
    if (key < root.key)
      root.left = insertRec(root.left, key);
    else if (key > root.key)
      root.right = insertRec(root.right, key);
    
    return root;
  }

  Node search(Node root, int key) {
    if (root == null || root.key == key)
      return root;
    
    if (root.key > key)
      return search(root.left, key);
    
    return search(root.right, key);
  }
}
  `,
};

/**
  * A utility function to create a delay.
  */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// --- NEW: Recursive <TreeNode> Component ---
const TreeNode = ({ node }) => {
  // Render a null placeholder to maintain tree structure
  if (!node) {
    return (
      <div className="tree-child-container">
          <div className="tree-null">NULL</div>
      </div>
    );
  }

  const hasChildren = node.left || node.right;

  return (
    <div className="tree-child-container">
      {/* This node's value box */}
      <div className={`box ${node.state || 'default'}`}>
        {node.value}
      </div>

      {/* Render children recursively */}
      {hasChildren && (
        <div className="tree-children">
          <TreeNode node={node.left} />
          <TreeNode node={node.right} />
        </div>
      )}
    </div>
  );
};


// --- Main Component ---
export default function BST() {
  // --- STATE ---
  const [tree, setTree] = useState(null); // Use null for empty tree
  const [value, setValue] = useState("");
  
  const [language, setLanguage] = useState("c");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Tree is empty. Insert a node.");
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
  
  // --- HELPERS ---

  /**
    * Resets the state of all nodes in the tree to 'default'.
    * Returns a new tree object (immutable).
    */
  const resetAllStates = (node) => {
    if (!node) return null;
    return {
      ...node,
      state: 'default',
      left: resetAllStates(node.left),
      right: resetAllStates(node.right)
    };
  };

  /**
    * Updates the state of a single node by its value.
    * Returns a new tree object (immutable).
    */
  const updateNodeByValue = (node, targetValue, newState) => {
    if (!node) return null;
    
    let newNode = { ...node }; // Copy current node
    if (node.value === targetValue) {
      newNode.state = newState;
    }
    
    // Recurse down
    if (targetValue < node.value) {
      newNode.left = updateNodeByValue(node.left, targetValue, newState);
    } else if (targetValue > node.value) {
      newNode.right = updateNodeByValue(node.right, targetValue, newState);
    }
    
    return newNode;
  };
  
  const getVal = () => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setError("Please enter a valid number for 'Value'.");
      return null;
    }
    return num;
  };
  
  const checkPause = async () => {
    while (pausedRef.current && !isCancelledRef.current) {
      setStatus("Paused. Press Resume to continue.");
      await sleep(100);
    }
  };

  const cleanup = () => {
    setIsVisualizing(false);
    setValue("");
    setTimeout(() => {
        if (!isCancelledRef.current) {
            setTree(prev => resetAllStates(prev));
            setStatus("Ready.");
        }
    }, speed * 2);
  };
  
  // --- OPERATIONS ---

  /**
    * Inserts a new value into the BST.
    */
  const handleInsert = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Inserting ${val}...`]);
    
    const newNode = { value: val, id: crypto.randomUUID(), left: null, right: null, state: 'found' };
    
    if (tree === null) {
      setStatus(`Inserting ${val} as root.`);
      await sleep(speed);
      setTree(newNode);
      cleanup();
      return;
    }

    let current = tree;
    let parent = null;
    let found = false;

    // 1. Traverse and visualize to find insertion point
    while (current) {
      if (isCancelledRef.current) return cleanup();
      await checkPause();
      
      const currentValue = current.value;
      setStatus(`Checking ${currentValue}...`);
      setTree(prev => updateNodeByValue(prev, currentValue, 'visiting'));
      await sleep(speed);

      if (currentValue === val) {
        setStatus(`Value ${val} already exists.`);
        setTree(prev => updateNodeByValue(prev, currentValue, 'found'));
        found = true;
        break;
      }
      
      parent = current;
      setTree(prev => updateNodeByValue(prev, currentValue, 'default'));
      
      if (val < currentValue) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    if (found) return cleanup();
    if (isCancelledRef.current) return cleanup();

    // 2. Not found, so insert
    setStatus(`Inserting ${val} as child of ${parent.value}.`);
    setTree(prev => updateNodeByValue(prev, parent.value, 'pre-op'));
    await sleep(speed);

    // Recursive helper to build the new tree immutably
    const insertNode = (node) => {
      if (!node) return null;
      
      // Found the parent, add the new node
      if (node.id === parent.id) {
        let newNodeWithChild = { ...node, state: 'default' }; // Reset parent state
        if (val < parent.value) {
          newNodeWithChild.left = newNode;
        } else {
          newNodeWithChild.right = newNode;
        }
        return newNodeWithChild;
      }
      
      // Recurse
      let newNodeCopy = { ...node };
      if (val < node.value) {
        newNodeCopy.left = insertNode(node.left);
      } else {
        newNodeCopy.right = insertNode(node.right);
      }
      return newNodeCopy;
    };
    
    setTree(prev => insertNode(prev)); // One final update
    
    cleanup();
  };

  /**
    * Deletes a value from the BST.
    */
  const handleDelete = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Deleting ${val}...`]);
    
    // Helper to find the smallest value node in a subtree
    const findMin = (node) => {
      let current = node;
      while (current && current.left) {
        current = current.left;
      }
      return current;
    };

    // Recursive delete function
    const deleteRecursive = async (node, value) => {
      if (isCancelledRef.current) return node;
      if (!node) {
        setStatus(`Value ${val} not found.`);
        return null;
      }
      
      await checkPause();
      
      // Highlight current node
      setStatus(`Searching for ${val}... checking ${node.value}`);
      setTree(prev => updateNodeByValue(prev, node.value, 'visiting'));
      await sleep(speed);

      if (val < node.value) {
        setTree(prev => updateNodeByValue(prev, node.value, 'default'));
        const newLeft = await deleteRecursive(node.left, val);
        return { ...node, left: newLeft };
      } else if (val > node.value) {
        setTree(prev => updateNodeByValue(prev, node.value, 'default'));
        const newRight = await deleteRecursive(node.right, val);
        return { ...node, right: newRight };
      } else {
        // --- NODE FOUND ---
        setStatus(`Found ${val}. Preparing to delete.`);
        setTree(prev => updateNodeByValue(prev, node.value, 'deleting'));
        await sleep(speed);

        // Case 1: No children
        if (!node.left && !node.right) {
          setStatus(`Deleting node ${val} (0 children).`);
          return null;
        }
        
        // Case 2: One child
        if (!node.left) {
          setStatus(`Deleting node ${val} (1 right child).`);
          return node.right;
        }
        if (!node.right) {
          setStatus(`Deleting node ${val} (1 left child).`);
          return node.left;
        }

        // Case 3: Two children
        setStatus(`Node ${val} has 2 children. Finding successor...`);
        const successor = findMin(node.right);
        
        // Highlight successor
        setTree(prev => updateNodeByValue(prev, successor.value, 'pre-op'));
        setStatus(`Successor is ${successor.value}. Copying value.`);
        await sleep(speed);

        // Create a new node with successor's value
        const newNode = { ...node, value: successor.value, state: 'default' };
        
        // Delete the successor from the right subtree
        setStatus(`Deleting original successor node ${successor.value}...`);
        newNode.right = await deleteRecursive(node.right, successor.value);
        
        return newNode;
      }
    };

    const newTree = await deleteRecursive(tree, val);
    
    if (!isCancelledRef.current) {
      setTree(newTree);
    }
    
    cleanup();
  };

  /**
    * Searches for a value in the BST.
    */
  const handleSearch = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setExecutionLog(prev => [...prev, `Searching for ${val}...`]);
    
    let current = tree;
    let found = false;

    while (current) {
      if (isCancelledRef.current) return cleanup();
      await checkPause();
      
      const currentValue = current.value;
      setStatus(`Checking ${currentValue}...`);
      setTree(prev => updateNodeByValue(prev, currentValue, 'visiting'));
      await sleep(speed);

      if (currentValue === val) {
        setStatus(`Found ${val}!`);
        setTree(prev => updateNodeByValue(prev, currentValue, 'found'));
        found = true;
        break;
      }
      
      setTree(prev => updateNodeByValue(prev, currentValue, 'default'));
      
      if (val < currentValue) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    if (!found && !isCancelledRef.current) {
      setStatus(`Value ${val} not found.`);
      setExecutionLog(prev => [...prev, `Value ${val} not found.`]);
    }
    
    cleanup();
  };

  const handleReset = () => {
    isCancelledRef.current = true;
    setIsVisualizing(false);
    setIsPaused(false);
    pausedRef.current = false;
    
    setTree(null);
    setValue("");
    setError(null);
    setStatus("Tree is empty. Insert a node.");
    setHighlightLineNum(-1);
    setExecutionLog([]);
    
    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };
  
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
          <GitFork size={30} />
          Binary Search Tree
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
        <div className="actions-single">
          <button onClick={handleInsert} disabled={isVisualizing} className="btn btn-green">Insert</button>
        </div>
        <div className="actions-grid">
          <button onClick={handleDelete} disabled={isVisualizing || !tree} className="btn btn-red">Delete</button>
          <button onClick={handleSearch} disabled={isVisualizing || !tree} className="btn btn-cyan">Search</button>
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
            Reset Tree
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
            {tree === null && <span style={{color: 'var(--text-gray-500)'}}>Tree is empty.</span>}
            
            {tree !== null && (
              <div className="tree-root">
                <TreeNode node={tree} />
              </div>
            )}
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

