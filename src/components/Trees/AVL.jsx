import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search, Info, HelpCircle, X, Shuffle, BarChart2, StepForward, StepBack } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      --bg-dark-950: #0a0f1d;
      --bg-dark-900: #0f172a;
      --bg-dark-800: #1e293b;
      --bg-dark-700: #334155;
      --bg-dark-600: #475569;
      --bg-dark-500: #64748b;
      
      --text-gray-200: #f1f5f9;
      --text-gray-300: #cbd5e1;
      --text-gray-400: #94a3b8;
      --text-gray-500: #64748b;

      --border-gray-600: #475569;
      --border-gray-700: #334155;

      --cyan-400: #38bdf8;
      --cyan-500: #0ea5e9;
      --cyan-600: #0284c7;
      
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

      --pink-500: #ec4899;
      --pink-600: #db2777;
      --pink-700: #be185d;

      --purple-400: #c084fc;
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
    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; }
    }

    * { box-sizing: border-box; }

    .controls-sidebar {
      width: 100%;
      background-color: var(--bg-dark-800);
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
    @media (min-width: 1024px) {
      .controls-sidebar {
        width: 25%;
        min-width: 320px;
        max-width: 360px;
        min-height: 100vh;
        overflow-y: auto;
      }
    }

    .sidebar-title {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      color: var(--cyan-400);
      display: flex;
      align-items: center;
    }
    .sidebar-title svg { margin-right: 0.75rem; }

    .input-group { margin-bottom: 0.85rem; }
    .input-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      color: var(--text-gray-300);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .input-field {
      width: 100%;
      padding: 0.6rem 0.75rem;
      background-color: var(--bg-dark-700);
      border-radius: 0.375rem;
      border: 1px solid var(--border-gray-600);
      color: var(--text-gray-200);
      transition: border-color 0.2s, box-shadow 0.2s;
      font-size: 0.9rem;
    }
    .input-field:focus {
      outline: none;
      border-color: var(--cyan-500);
      box-shadow: 0 0 0 2px var(--cyan-500);
    }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .error-message {
      color: var(--red-400);
      font-size: 0.8rem;
      margin-bottom: 1rem;
      padding: 0.6rem;
      background-color: rgba(248, 113, 113, 0.1);
      border: 1px solid var(--red-400);
      border-radius: 0.375rem;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .actions-single {
      margin-bottom: 0.75rem;
    }
    
    .btn {
      padding: 0.6rem;
      border-radius: 0.375rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 0.85rem;
      text-align: center;
      width: 100%;
    }
    .btn svg { width: 16px; height: 16px; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }

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

    .speed-slider-group { display: flex; align-items: center; gap: 1rem; }
    .speed-slider {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: var(--bg-dark-700);
      border-radius: 3px;
      outline: none;
      opacity: 0.9;
    }
    .speed-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: var(--cyan-500);
      border-radius: 50%;
      cursor: pointer;
    }
    .speed-value {
      width: 4rem;
      text-align: right;
      color: var(--text-gray-400);
      font-size: 0.85rem;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }
    @media (min-width: 768px) {
      .main-content { padding: 2rem; }
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: var(--text-gray-200);
    }

    /* --- Stats Bar --- */
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    @media (min-width: 768px) {
      .stats-bar {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .stat-card {
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.375rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    }
    .stat-title {
      font-size: 0.75rem;
      color: var(--text-gray-400);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--cyan-400);
      font-family: 'Fira Code', 'Courier New', monospace;
    }

    .visualization-section {
      display: flex;
      flex-direction: column;
      min-height: 250px;
    }
    .status-bar {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.375rem;
      text-align: center;
      min-height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .status-text {
      font-size: 1rem;
      font-weight: 500;
      transition: color 0.3s;
    }
    .status-default { color: var(--cyan-400); }
    .status-found { color: var(--green-400); }
    .status-not-found { color: var(--red-400); }
    .status-paused { color: var(--yellow-400); }

    .visualization-boxes {
      position: relative;
      flex: 1;
      background-color: rgba(5, 5, 10, 0.4);
      border-radius: 0.5rem;
      min-height: 420px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }

    /* --- GORGEOUS CIRCLE NODES MIRRORING image_eed3d6.png --- */
    .tree-circle-node {
      width: 3.25rem;
      height: 3.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      font-weight: 600;
      border-radius: 50%;
      transition: left 1.6s cubic-bezier(0.25, 1, 0.5, 1), 
                  top 1.6s cubic-bezier(0.25, 1, 0.5, 1), 
                  background-color 0.6s, border-color 0.6s, transform 0.6s, box-shadow 0.6s;
      user-select: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    .tree-circle-node.default {
      background-color: #e2f0d9;
      border: 2.5px solid #8cc07e;
      color: #385723;
    }

    .tree-circle-node.visiting {
      background-color: #fef08a;
      border: 2.5px solid #ca8a04;
      color: #854d0e;
      transform: translate(-50%, -50%) scale(1.12);
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.6);
    }
    .tree-circle-node.pre-op {
      background-color: #fed7aa;
      border: 2.5px solid #ea580c;
      color: #7c2d12;
      transform: translate(-50%, -50%) scale(1.12);
      box-shadow: 0 0 15px rgba(249, 115, 22, 0.6);
    }
    .tree-circle-node.found {
      background-color: #4ade80;
      border: 2.5px solid #16a34a;
      color: #ffffff;
      transform: translate(-50%, -50%) scale(1.18);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
    .tree-circle-node.deleting {
      background-color: #fca5a5;
      border: 2.5px solid #dc2626;
      color: #7f1d1d;
      transform: translate(-50%, -50%) scale(0.85);
      opacity: 0.7;
    }

    .tree-circle-node.pivot {
      background-color: #fce7f3;
      border: 2.5px solid #db2777;
      color: #831843;
      transform: translate(-50%, -50%) scale(1.15);
      box-shadow: 0 0 20px rgba(219, 39, 119, 0.75);
    }
    .tree-circle-node.detached {
      background-color: #f3e8ff;
      border: 2.5px dashed #a855f7;
      color: #581c87;
      transform: translate(-50%, -50%) scale(0.92);
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.5);
    }

    /* --- Balance Factor Badge --- */
    .bf-badge {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      background-color: var(--bg-dark-800);
      border: 1.5px solid var(--border-gray-600);
      border-radius: 50%;
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      color: var(--text-gray-300);
    }
    .bf-badge.imbalanced {
      background-color: var(--red-600);
      border-color: var(--red-400);
      color: white;
      animation: pulseAlert 1s infinite alternate;
    }
    @keyframes pulseAlert {
      from { transform: scale(1); }
      to { transform: scale(1.15); }
    }

    /* --- SVG Connection Lines --- */
    @keyframes flow-descent {
      to { stroke-dashoffset: -20; }
    }
    @keyframes flow-ascent {
      to { stroke-dashoffset: 20; }
    }
    
    .traversal-descent-line {
      stroke: #22c55e;
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-descent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.8));
      opacity: 0.95;
    }
    
    .traversal-ascent-line {
      stroke: #ef4444;
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-ascent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
      opacity: 0.95;
    }

    /* Rotation diagnostic overlay hud */
    .rotation-analyzer-hud {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 260px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1.5px solid var(--pink-600);
      border-radius: 0.5rem;
      padding: 0.75rem;
      font-size: 0.8rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      z-index: 20;
      animation: slideInHUD 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideInHUD {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .hud-close-btn {
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      background: transparent;
      border: none;
      color: var(--text-gray-400);
      cursor: pointer;
      padding: 0.2rem;
      border-radius: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .hud-close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    /* --- Playback Controls Bar --- */
    .playback-controls-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--bg-dark-800);
      border-radius: 0.375rem;
      margin-top: 1rem;
      border: 1px solid var(--border-gray-700);
    }

    .playback-controls-bar .btn {
      min-width: 90px;
    }

    .step-indicator {
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-gray-200);
      min-width: 80px;
      text-align: center;
    }

    .lower-content-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1.5rem;
      flex: 1;
    }
    @media (min-width: 1024px) {
      .lower-content-area { flex-direction: row; }
    }

    .code-section, .log-section {
      display: flex;
      flex-direction: column;
      flex: 1; 
      min-height: 280px;
    }
    .code-block, .log-block {
      background-color: var(--bg-dark-950);
      padding: 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      height: 100%;
      overflow: auto;
    }
    @media (max-width: 1023px) {
      .log-block { max-height: 250px; }
    }

    .code-block pre {
      margin: 0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .code-line {
      display: block;
      padding: 0 0.5rem;
      transition: background-color 0.2s;
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
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .log-item {
      padding: 0.2rem 0.5rem;
      border-bottom: 1px solid var(--bg-dark-700);
      color: var(--text-gray-300);
    }
    .log-item:last-child {
      border-bottom: none; 
      color: white;
    }
  `}</style>
);

const codeSnippets = {
  insert: {
    python: `
def insert(node, key):
    if not node:
        return Node(key)
    if key < node.val:
        node.left = insert(node.left, key)
    else:
        node.right = insert(node.right, key)
        
    node.height = 1 + max(getHeight(node.left), getHeight(node.right))
    balance = getBalance(node)
    
    # Left Left Case
    if balance > 1 and key < node.left.val:
        return rightRotate(node)
    # Right Right Case
    if balance < -1 and key > node.right.val:
        return leftRotate(node)
    # Left Right Case
    if balance > 1 and key > node.left.val:
        node.left = leftRotate(node.left)
        return rightRotate(node)
    # Right Left Case
    if balance < -1 and key < node.right.val:
        node.right = rightRotate(node.right)
        return leftRotate(node)
        
    return node
    `.trim(),
    cpp: `
Node* insert(Node* node, int key) {
    if (node == NULL)
        return(newNode(key));
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
        
    node->height = 1 + max(height(node->left), height(node->right));
    int balance = getBalance(node);
    
    if (balance > 1 && key < node->left->key)
        return rightRotate(node);
    if (balance < -1 && key > node->right->key)
        return leftRotate(node);
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}
    `.trim(),
    java: `
Node insert(Node node, int key) {
    if (node == null)
        return (new Node(key));
    if (key < node.key)
        node.left = insert(node.left, key);
    else if (key > node.key)
        node.right = insert(node.right, key);

    node.height = 1 + max(height(node.left), height(node.right));
    int balance = getBalance(node);

    if (balance > 1 && key < node.left.key)
        return rightRotate(node);
    if (balance < -1 && key > node.right.key)
        return leftRotate(node);
    if (balance > 1 && key > node.left.key) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }
    if (balance < -1 && key < node.right.key) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }
    return node;
}
    `.trim(),
    c: `
struct Node* insert(struct Node* node, int key) {
    if (node == NULL)
        return(newNode(key));
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);

    node->height = 1 + max(height(node->left), height(node->right));
    int balance = getBalance(node);

    if (balance > 1 && key < node->left->key)
        return rightRotate(node);
    if (balance < -1 && key > node->right->key)
        return leftRotate(node);
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}
    `.trim()
  },
  search: {
    python: `
def search(root, key):
    if root is None or root.val == key:
        return root
    if key < root.val:
        return search(root.left, key)
    return search(root.right, key)
    `.trim(),
    cpp: `
Node* search(Node* root, int key) {
    if (root == NULL || root->data == key)
        return root;
    if (root->data < key)
        return search(root->right, key);
    return search(root->left, key);
}
    `.trim(),
    java: `
Node search(Node root, int key) {
    if (root == null || root.key == key)
        return root;
    if (root.key > key)
        return search(root.left, key);
    return search(root.right, key);
}
    `.trim(),
    c: `
struct Node* search(struct Node* root, int key) {
    if (root == NULL || root->key == key)
        return root;
    if (root->key < key)
        return search(root->right, key);
    return search(root->left, key);
}
    `.trim()
  },
  delete: {
    python: `
def deleteNode(root, key):
    if not root:
        return root
    if key < root.val:
        root.left = deleteNode(root.left, key)
    elif key > root.val:
        root.right = deleteNode(root.right, key)
    else:
        if not root.left:
            return root.right
        elif not root.right:
            return root.left
        temp = getMinValueNode(root.right)
        root.val = temp.val
        root.right = deleteNode(root.right, temp.val)

    root.height = 1 + max(getHeight(root.left), getHeight(root.right))
    balance = getBalance(root)

    # Balance Checks (Rotations)
    if balance > 1 and getBalance(root.left) >= 0:
        return rightRotate(root)
    if balance < -1 and getBalance(root.right) <= 0:
        return leftRotate(root)
    if balance > 1 and getBalance(root.left) < 0:
        root.left = leftRotate(root.left)
        return rightRotate(root)
    if balance < -1 and getBalance(root.right) > 0:
        root.right = rightRotate(root.right)
        return leftRotate(root)

    return root
    `.trim(),
    cpp: `
Node* deleteNode(Node* root, int key) {
    if (root == NULL) return root;
    if (key < root->key)
        root->left = deleteNode(root->left, key);
    else if (key > root->key)
        root->right = deleteNode(root->right, key);
    else {
        if ((root->left == NULL) || (root->right == NULL)) {
            Node *temp = root->left ? root->left : root->right;
            if (temp == NULL) {
                temp = root; root = NULL;
            } else *root = *temp;
            free(temp);
        } else {
            Node* temp = minValueNode(root->right);
            root->key = temp->key;
            root->right = deleteNode(root->right, temp->key);
        }
    }
    if (root == NULL) return root;

    root->height = 1 + max(height(root->left), height(root->right));
    int balance = getBalance(root);

    if (balance > 1 && getBalance(root->left) >= 0)
        return rightRotate(root);
    if (balance > 1 && getBalance(root->left) < 0) {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }
    if (balance < -1 && getBalance(root->right) <= 0)
        return leftRotate(root);
    if (balance < -1 && getBalance(root->right) > 0) {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }
    return root;
}
    `.trim(),
    java: `
Node deleteNode(Node root, int key) {
    if (root == null) return root;
    if (key < root.key)
        root.left = deleteNode(root.left, key);
    else if (key > root.key)
        root.right = deleteNode(root.right, key);
    else {
        if ((root.left == null) || (root.right == null)) {
            Node temp = (root.left != null) ? root.left : root.right;
            if (temp == null) {
                temp = root; root = null;
            } else root = temp;
        } else {
            Node temp = minValueNode(root.right);
            root.key = temp.key;
            root.right = deleteNode(root.right, temp.key);
        }
    }
    if (root == null) return root;

    root.height = max(height(root.left), height(root.right)) + 1;
    int balance = getBalance(root);

    if (balance > 1 && getBalance(root.left) >= 0)
        return rightRotate(root);
    if (balance > 1 && getBalance(root.left) < 0) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }
    if (balance < -1 && getBalance(root.right) <= 0)
        return leftRotate(root);
    if (balance < -1 && getBalance(root.right) > 0) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }
    return root;
}
    `.trim(),
    c: `
struct Node* deleteNode(struct Node* root, int key) {
    if (root == NULL) return root;
    if (key < root->key)
        root->left = deleteNode(root->left, key);
    else if (key > root->key)
        root->right = deleteNode(root->right, key);
    else {
        if ((root->left == NULL) || (root->right == NULL)) {
            struct Node *temp = root->left ? root->left : root->right;
            if (temp == NULL) {
                temp = root; root = NULL;
            } else *root = *temp;
            free(temp);
        } else {
            struct Node* temp = minValueNode(root->right);
            root->key = temp->key;
            root->right = deleteNode(root->right, temp->key);
        }
    }
    if (root == NULL) return root;

    root->height = 1 + max(height(root->left), height(root->right));
    int balance = getBalance(root);

    if (balance > 1 && getBalance(root->left) >= 0)
        return rightRotate(root);
    if (balance > 1 && getBalance(root->left) < 0) {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }
    if (balance < -1 && getBalance(root->right) <= 0)
        return leftRotate(root);
    if (balance < -1 && getBalance(root->right) > 0) {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }
    return root;
}
    `.trim()
  }
};

const LINE_MAPS = {
  insert: {
    python: { check_null: 2, recurse_left: 5, recurse_right: 7, height: 9, check_balance: 10, LL: 13, RR: 16, LR: 18, RL: 22 },
    cpp: { check_null: 2, recurse_left: 4, recurse_right: 6, height: 9, check_balance: 10, LL: 12, RR: 14, LR: 16, RL: 20 },
    java: { check_null: 2, recurse_left: 4, recurse_right: 6, height: 8, check_balance: 9, LL: 11, RR: 13, LR: 15, RL: 19 },
    c: { check_null: 2, recurse_left: 4, recurse_right: 6, height: 8, check_balance: 9, LL: 11, RR: 13, LR: 15, RL: 19 }
  },
  search: {
    python: { check_target: 2, recurse_left: 4, recurse_right: 5 },
    cpp: { check_target: 2, recurse_left: 6, recurse_right: 4 },
    java: { check_target: 2, recurse_left: 5, recurse_right: 7 },
    c: { check_target: 2, recurse_left: 5, recurse_right: 4 }
  },
  delete: {
    python: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 9, one_child: 9, find_min: 13, copy_val: 14, delete_min: 15, rebalance: 17 },
    cpp: { check_null: 2, recurse_left: 3, recurse_right: 5, leaf: 8, one_child: 8, find_min: 14, copy_val: 15, delete_min: 16, rebalance: 21 },
    java: { check_null: 2, recurse_left: 3, recurse_right: 5, leaf: 8, one_child: 8, find_min: 13, copy_val: 14, delete_min: 15, rebalance: 19 },
    c: { check_null: 2, recurse_left: 3, recurse_right: 5, leaf: 8, one_child: 8, find_min: 14, copy_val: 15, delete_min: 16, rebalance: 21 }
  }
};


// ---------------------------------------------------------
// Global Helper Functions (Accessible by components and classes)
// ---------------------------------------------------------
const getNodeHeight = (node) => {
  return node ? (node.height || 1) : 0;
};

const getBalanceFactor = (node) => {
  return node ? getNodeHeight(node.left) - getNodeHeight(node.right) : 0;
};

// ---------------------------------------------------------
// Frame Generator Engine (Synchronously builds animation steps)
// ---------------------------------------------------------
class FrameGenerator {
  constructor(initialTree, initialLog, initialStats, concept, language) {
    this.tree = this.cloneTree(initialTree);
    this.log = [...initialLog];
    this.stats = { ...initialStats };
    this.status = "";
    this.callStackEdges = [];
    this.backtrackEdge = null;
    this.rotationDiagnostic = null;
    this.highlightLineNum = -1;
    this.concept = concept;
    this.language = language;
    this.frames = [];
  }

  cloneTree(node) {
    if (!node) return null;
    return {
      ...node,
      left: this.cloneTree(node.left),
      right: this.cloneTree(node.right)
    };
  }

  pushFrame() {
    this.frames.push({
      tree: this.cloneTree(this.tree),
      log: [...this.log],
      stats: { ...this.stats },
      status: this.status,
      callStackEdges: [...this.callStackEdges],
      backtrackEdge: this.backtrackEdge ? { ...this.backtrackEdge } : null,
      rotationDiagnostic: this.rotationDiagnostic ? { ...this.rotationDiagnostic } : null,
      highlightLineNum: this.highlightLineNum,
      activeConcept: this.concept
    });
  }

  addLog(msg) {
    this.log.push(msg);
  }

  setHighlight(key) {
    if (LINE_MAPS[this.concept] && LINE_MAPS[this.concept][this.language]) {
      this.highlightLineNum = LINE_MAPS[this.concept][this.language][key] ?? -1;
    } else {
      this.highlightLineNum = -1;
    }
  }

  updateNodeByValue(node, targetValue, newState) {
    if (!node) return null;
    let newNode = { ...node };
    if (node.value === targetValue) {
      newNode.state = newState;
    }
    newNode.left = this.updateNodeByValue(node.left, targetValue, newState);
    newNode.right = this.updateNodeByValue(node.right, targetValue, newState);
    return newNode;
  }

  replaceSubtree(node, targetId, replacement) {
    if (!node) return null;
    if (node.id === targetId) return replacement;
    return {
      ...node,
      left: this.replaceSubtree(node.left, targetId, replacement),
      right: this.replaceSubtree(node.right, targetId, replacement)
    };
  }

  pushStack(fromId, toId) {
    this.callStackEdges.push({ from: fromId, to: toId });
  }

  popStack(fromId, toId) {
    this.callStackEdges = this.callStackEdges.filter(e => !(e.from === fromId && e.to === toId));
    this.backtrackEdge = { from: toId, to: fromId };
  }
  
  clearBacktrack() {
    this.backtrackEdge = null;
  }

  getNodeHeight(node) {
    return node ? (node.height || 1) : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getNodeHeight(node.left) - this.getNodeHeight(node.right) : 0;
  }
  
  resetAllStates(node) {
    if (!node) return null;
    return {
      ...node,
      state: 'default',
      left: this.resetAllStates(node.left),
      right: this.resetAllStates(node.right)
    };
  }

  performRightRotation(y) {
    this.stats.rightRotations += 1;
    this.stats.totalRotations += 1;
    let x = y.left;
    let T2 = x ? x.right : null;

    this.status = `Imbalance detected! Initiating Right Rotation. Stage 1: Identifying Pivot node ${y.value} (pink) and child ${x?.value || ''}.`;
    this.addLog(`[Rotation Phase 1] Pivot: ${y.value}, Left Child: ${x?.value || ''}`);
    
    this.rotationDiagnostic = {
      type: 'Right Rotation (Single R)',
      pivot: y.value,
      target: x?.value,
      orphan: T2 ? T2.value : 'None',
      phase: 'Step 1: Identifying Pivot and Subtrees'
    };

    const highlightPivotNode = {
      ...y,
      state: 'pivot',
      left: x ? {
        ...x,
        state: 'visiting',
        right: T2 ? { ...T2, state: 'default' } : null
      } : null
    };
    this.tree = this.replaceSubtree(this.tree, y.id, highlightPivotNode);
    this.pushFrame();
    this.pushFrame(); 

    if (T2) {
      this.status = `Stage 2: Isolating orphan subtree under node ${T2.value} (purple) before pointer shifts...`;
      this.rotationDiagnostic.phase = 'Step 2: Detaching and Isolating Orphan T2';
      const isolateOrphanNode = {
        ...y,
        state: 'pivot',
        left: x ? {
          ...x,
          state: 'visiting',
          right: { ...T2, state: 'detached' }
        } : null
      };
      this.tree = this.replaceSubtree(this.tree, y.id, isolateOrphanNode);
      this.pushFrame();
    }

    this.status = `Stage 3: Swinging pivot node ${y.value} down, and sliding child node ${x?.value || ''} upwards.`;
    this.rotationDiagnostic.phase = 'Step 3: Swinging Pivot node down';

    let intermediateX = {
      ...x,
      state: 'pre-op',
      right: {
        ...y,
        state: 'visiting',
        left: null 
      }
    };
    this.tree = this.replaceSubtree(this.tree, y.id, intermediateX);
    this.pushFrame();

    if (T2) {
      this.status = `Stage 4: Reattaching isolated orphan subtree ${T2.value} as left child of pivot node ${y.value}.`;
      this.rotationDiagnostic.phase = 'Step 4: Re-attaching isolated subtrees';
      let attachedX = {
        ...x,
        state: 'pre-op',
        right: {
          ...y,
          state: 'visiting',
          left: { ...T2, state: 'default' }
        }
      };
      this.tree = this.replaceSubtree(this.tree, y.id, attachedX);
      this.pushFrame();
    }

    this.status = `Stage 5: Recalculation complete. Settling node placement coordinates.`;
    this.addLog(`[Rotation Success] Completed Right Rotation under parent node ${x?.value || ''}`);

    let finalX = {
      ...x,
      state: 'default',
      right: {
        ...y,
        state: 'default',
        left: T2 ? { ...T2, state: 'default' } : null
      }
    };

    finalX.right.height = 1 + Math.max(this.getNodeHeight(finalX.right.left), this.getNodeHeight(finalX.right.right));
    finalX.height = 1 + Math.max(this.getNodeHeight(finalX.left), this.getNodeHeight(finalX.right));

    return finalX;
  }

  performLeftRotation(x) {
    this.stats.leftRotations += 1;
    this.stats.totalRotations += 1;
    let y = x.right;
    let T2 = y ? y.left : null;

    this.status = `Imbalance detected! Initiating Left Rotation. Stage 1: Identifying Pivot node ${x.value} (pink) and child ${y?.value || ''}.`;
    this.addLog(`[Rotation Phase 1] Pivot: ${x.value}, Right Child: ${y?.value || ''}`);

    this.rotationDiagnostic = {
      type: 'Left Rotation (Single L)',
      pivot: x.value,
      target: y?.value,
      orphan: T2 ? T2.value : 'None',
      phase: 'Step 1: Identifying Pivot and Subtrees'
    };

    const highlightPivotNode = {
      ...x,
      state: 'pivot',
      right: y ? {
        ...y,
        state: 'visiting',
        left: T2 ? { ...T2, state: 'default' } : null
      } : null
    };
    this.tree = this.replaceSubtree(this.tree, x.id, highlightPivotNode);
    this.pushFrame();
    this.pushFrame();

    if (T2) {
      this.status = `Stage 2: Isolating orphan subtree under node ${T2.value} (purple) before pointer shifts...`;
      this.rotationDiagnostic.phase = 'Step 2: Detaching and Isolating Orphan T2';
      const isolateOrphanNode = {
        ...x,
        state: 'pivot',
        right: y ? {
          ...y,
          state: 'visiting',
          left: { ...T2, state: 'detached' }
        } : null
      };
      this.tree = this.replaceSubtree(this.tree, x.id, isolateOrphanNode);
      this.pushFrame();
    }

    this.status = `Stage 3: Swinging pivot node ${x.value} down, and sliding child node ${y?.value || ''} upwards.`;
    this.rotationDiagnostic.phase = 'Step 3: Swinging Pivot node down';

    let intermediateY = {
      ...y,
      state: 'pre-op',
      left: {
        ...x,
        state: 'visiting',
        right: null
      }
    };
    this.tree = this.replaceSubtree(this.tree, x.id, intermediateY);
    this.pushFrame();

    if (T2) {
      this.status = `Stage 4: Reattaching isolated orphan subtree ${T2.value} as right child of pivot node ${x.value}.`;
      this.rotationDiagnostic.phase = 'Step 4: Re-attaching isolated subtrees';
      let attachedY = {
        ...y,
        state: 'pre-op',
        left: {
          ...x,
          state: 'visiting',
          right: { ...T2, state: 'default' }
        }
      };
      this.tree = this.replaceSubtree(this.tree, x.id, attachedY);
      this.pushFrame();
    }

    this.status = `Stage 5: Recalculation complete. Settling node placement coordinates.`;
    this.addLog(`[Rotation Success] Completed Left Rotation under parent node ${y?.value || ''}`);

    let finalY = {
      ...y,
      state: 'default',
      left: {
        ...x,
        state: 'default',
        right: T2 ? { ...T2, state: 'default' } : null
      }
    };

    finalY.left.height = 1 + Math.max(this.getNodeHeight(finalY.left.left), this.getNodeHeight(finalY.left.right));
    finalY.height = 1 + Math.max(this.getNodeHeight(finalY.left), this.getNodeHeight(finalY.right));

    return finalY;
  }
}

// ---------------------------------------------------------
// Main React Component
// ---------------------------------------------------------
export default function AVLTreeVisualizer() {
  const [tree, setTree] = useState(null);
  const [value, setValue] = useState("");
  const [randomSize, setRandomSize] = useState("10");
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(1000);
  const [status, setStatus] = useState("Tree is empty. Insert a node to begin self-balancing visualization.");
  const [executionLog, setExecutionLog] = useState(["[System] AVL visualizer active. All nodes auto-balance upon insert/delete."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [activeConcept, setActiveConcept] = useState("insert"); 
  const [stats, setStats] = useState({ leftRotations: 0, rightRotations: 0, totalRotations: 0 });
  const [isHudVisible, setIsHudVisible] = useState(true);

  const [callStackEdges, setCallStackEdges] = useState([]); 
  const [backtrackEdge, setBacktrackEdge] = useState(null); 
  const [rotationDiagnostic, setRotationDiagnostic] = useState(null);

  const [error, setError] = useState(null);
  const logContainerRef = useRef(null);

  // --- Frame Based Playback State ---
  const [frames, setFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const isVisualizing = frames.length > 0 && currentFrameIdx < frames.length - 1;

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  // --- Playback Engine ---
  useEffect(() => {
    let timer;
    if (isPlaying && currentFrameIdx < frames.length - 1) {
        timer = setTimeout(() => {
            setCurrentFrameIdx(prev => prev + 1);
        }, speed);
    } else if (isPlaying && currentFrameIdx >= frames.length - 1) {
        setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, frames.length, speed]);

  // Apply current frame to UI
  useEffect(() => {
    if (frames.length > 0 && currentFrameIdx >= 0 && currentFrameIdx < frames.length) {
        const frame = frames[currentFrameIdx];
        setTree(frame.tree);
        setStatus(frame.status);
        setExecutionLog(frame.log);
        setCallStackEdges(frame.callStackEdges);
        setBacktrackEdge(frame.backtrackEdge);
        setRotationDiagnostic(frame.rotationDiagnostic);
        setHighlightLineNum(frame.highlightLineNum);
        setStats(frame.stats);
        setActiveConcept(frame.activeConcept);
    }
  }, [currentFrameIdx, frames]);

  const togglePlay = () => {
    if (frames.length === 0) return;
    if (currentFrameIdx >= frames.length - 1) {
        setCurrentFrameIdx(0);
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentFrameIdx < frames.length - 1) {
        setCurrentFrameIdx(p => p + 1);
        setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentFrameIdx > 0) {
        setCurrentFrameIdx(p => p - 1);
        setIsPlaying(false);
    }
  };

  const runOperation = (opName, newFrames) => {
      setFrames(newFrames);
      setCurrentFrameIdx(0);
      setIsPlaying(true);
      setValue("");
  };

  const getLayoutElements = (root) => {
    const nodesList = [];
    const edgesList = [];

    const assignCoords = (node, x, y, dx) => {
      if (!node) return;
      node.x = x;
      node.y = y;
      nodesList.push(node);

      if (node.left) {
        edgesList.push({ from: node, to: node.left });
        assignCoords(node.left, x - dx, y + 80, dx * 0.48);
      }
      if (node.right) {
        edgesList.push({ from: node, to: node.right });
        assignCoords(node.right, x + dx, y + 80, dx * 0.48);
      }
    };

    assignCoords(root, 50, 45, 24);
    return { nodesList, edgesList };
  };

  const updateHeightsAndBFs = (node) => {
    if (!node) return null;
    const leftUpdated = updateHeightsAndBFs(node.left);
    const rightUpdated = updateHeightsAndBFs(node.right);
    const height = 1 + Math.max(getNodeHeight(leftUpdated), getNodeHeight(rightUpdated));
    return {
      ...node,
      left: leftUpdated,
      right: rightUpdated,
      height
    };
  };

  const getVal = () => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setError("Please enter a valid number for 'Value'.");
      return null;
    }
    return num;
  };

  const handleGenerateRandom = () => {
    const size = parseInt(randomSize);
    if (isNaN(size) || size < 1 || size > 25) {
      setError("Please enter a valid size (1-25) for the random tree.");
      return;
    }
    setError(null);
    
    // Pure fast generation algorithm for instant layout (without animation)
    function pureGetHeight(node) { return node ? node.height : 0; }
    function pureGetBf(node) { return node ? pureGetHeight(node.left) - pureGetHeight(node.right) : 0; }
    function pureRightRotate(y) {
        let x = y.left; let T2 = x.right;
        x.right = y; y.left = T2;
        y.height = Math.max(pureGetHeight(y.left), pureGetHeight(y.right)) + 1;
        x.height = Math.max(pureGetHeight(x.left), pureGetHeight(x.right)) + 1;
        return x;
    }
    function pureLeftRotate(x) {
        let y = x.right; let T2 = y.left;
        y.left = x; x.right = T2;
        x.height = Math.max(pureGetHeight(x.left), pureGetHeight(x.right)) + 1;
        y.height = Math.max(pureGetHeight(y.left), pureGetHeight(y.right)) + 1;
        return y;
    }
    function pureInsert(node, val) {
        if (!node) return { value: val, id: Math.random().toString(36).substring(2,9), left: null, right: null, height: 1, state: 'default' };
        if (val < node.value) node.left = pureInsert(node.left, val);
        else if (val > node.value) node.right = pureInsert(node.right, val);
        else return node; // Handle duplicates
        
        node.height = 1 + Math.max(pureGetHeight(node.left), pureGetHeight(node.right));
        let bf = pureGetBf(node);
        if (bf > 1 && val < node.left.value) return pureRightRotate(node);
        if (bf < -1 && val > node.right.value) return pureLeftRotate(node);
        if (bf > 1 && val > node.left.value) { node.left = pureLeftRotate(node.left); return pureRightRotate(node); }
        if (bf < -1 && val < node.right.value) { node.right = pureRightRotate(node.right); return pureLeftRotate(node); }
        return node;
    }

    let newTree = null;
    const generatedVals = new Set();
    while (generatedVals.size < size) {
        const val = Math.floor(Math.random() * 99) + 1;
        if (!generatedVals.has(val)) {
            generatedVals.add(val);
            newTree = pureInsert(newTree, val);
        }
    }

    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);
    
    setTree(newTree);
    setStats({ leftRotations: 0, rightRotations: 0, totalRotations: 0 }); // Reset visual operation stats on new generation
    setStatus(`Generated a random balanced AVL tree with ${size} nodes.`);
    setExecutionLog([`[System] Generated random tree of size ${size}. Operation stats reset.`]);
    setCallStackEdges([]);
    setBacktrackEdge(null);
    setRotationDiagnostic(null);
    setIsHudVisible(true);
    setHighlightLineNum(-1);
    setValue("");
  };

  const handleInsert = () => {
    const val = getVal();
    if (val === null) return;
    setError(null);
    setIsHudVisible(true);

    const gen = new FrameGenerator(tree, executionLog, stats, "insert", language);
    gen.status = `[Insert] Requesting balanced insertion of key: ${val}`;
    gen.addLog(gen.status);
    gen.pushFrame();

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const newNode = { value: val, id: uniqueId, left: null, right: null, height: 1, state: 'found' };

    const insertAVLRecursive = (currNode, parentId = null) => {
      if (!currNode) {
        gen.setHighlight("check_null");
        gen.status = `Base Case reached! Inserting new node ${val} here.`;
        gen.pushFrame();
        if (parentId) {
          gen.popStack(parentId, uniqueId);
        }
        return newNode;
      }

      if (parentId) {
        gen.pushStack(parentId, currNode.id);
        gen.status = `Recursive descent: entering node ${currNode.value}.`;
        gen.pushFrame();
      }

      gen.setHighlight("check_null");
      gen.status = `Comparing insert value ${val} with node ${currNode.value}...`;
      gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'visiting');
      gen.pushFrame();

      if (val === currNode.value) {
        gen.status = `Value ${val} already exists. AVL requires unique keys.`;
        gen.addLog(`[Duplicate] Key ${val} already in tree.`);
        gen.pushFrame();
        if (parentId) {
          gen.popStack(parentId, currNode.id);
        }
        return currNode;
      }

      gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'default');

      let updatedNode = { ...currNode };

      if (val < currNode.value) {
        gen.setHighlight("recurse_left");
        updatedNode.left = insertAVLRecursive(currNode.left, currNode.id);
      } else {
        gen.setHighlight("recurse_right");
        updatedNode.right = insertAVLRecursive(currNode.right, currNode.id);
      }

      if (parentId) {
        gen.popStack(parentId, currNode.id);
        gen.status = `Stack Unwinding: Recalculating height of node ${currNode.value}.`;
        gen.pushFrame();
      }

      gen.setHighlight("height");
      updatedNode.height = 1 + Math.max(gen.getNodeHeight(updatedNode.left), gen.getNodeHeight(updatedNode.right));
      
      gen.setHighlight("check_balance");
      const balance = gen.getNodeHeight(updatedNode.left) - gen.getNodeHeight(updatedNode.right);
      gen.status = `Node ${currNode.value} balance factor: ${balance}.`;
      gen.pushFrame();

      if (balance > 1 && val < updatedNode.left.value) {
        gen.setHighlight("LL");
        gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'pre-op');
        updatedNode = gen.performRightRotation(updatedNode);
      }
      else if (balance < -1 && val > updatedNode.right.value) {
        gen.setHighlight("RR");
        gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'pre-op');
        updatedNode = gen.performLeftRotation(updatedNode);
      }
      else if (balance > 1 && val > updatedNode.left.value) {
        gen.setHighlight("LR");
        gen.status = `Double imbalance (LR) detected! Step 1: Left Rotating child ${updatedNode.left.value} first...`;
        updatedNode.left = gen.performLeftRotation(updatedNode.left);
        gen.status = `Step 2: Now performing Right Rotation on root pivot node ${currNode.value}...`;
        updatedNode = gen.performRightRotation(updatedNode);
      }
      else if (balance < -1 && val < updatedNode.right.value) {
        gen.setHighlight("RL");
        gen.status = `Double imbalance (RL) detected! Step 1: Right Rotating child ${updatedNode.right.value} first...`;
        updatedNode.right = gen.performRightRotation(updatedNode.right);
        gen.status = `Step 2: Now performing Left Rotation on root pivot node ${currNode.value}...`;
        updatedNode = gen.performLeftRotation(updatedNode);
      }

      gen.clearBacktrack();
      return updatedNode;
    };

    const finalTree = insertAVLRecursive(gen.tree);
    gen.tree = finalTree;
    gen.addLog(`[Success] Key ${val} inserted and AVL balanced.`);
    
    gen.tree = gen.resetAllStates(gen.tree);
    gen.status = "Ready.";
    gen.highlightLineNum = -1;
    gen.callStackEdges = [];
    gen.backtrackEdge = null;
    gen.rotationDiagnostic = null;
    gen.pushFrame();

    runOperation("insert", gen.frames);
  };

  const handleDelete = () => {
    const val = getVal();
    if (val === null) return;
    setError(null);
    setIsHudVisible(true);

    const gen = new FrameGenerator(tree, executionLog, stats, "delete", language);
    gen.status = `[Delete] Requesting balanced deletion of key: ${val}`;
    gen.addLog(gen.status);
    gen.pushFrame();

    const findMin = (node) => {
      let current = node;
      while (current && current.left) {
        current = current.left;
      }
      return current;
    };

    const deleteAVLRecursive = (currNode, value, parentId = null) => {
      if (!currNode) {
        gen.status = `Key ${value} not found in the AVL tree.`;
        gen.pushFrame();
        return null;
      }

      if (parentId) {
        gen.pushStack(parentId, currNode.id);
        gen.status = `Recursive descent: entering node ${currNode.value}.`;
        gen.pushFrame();
      }

      gen.setHighlight("check_null");
      gen.status = `Searching for ${value}... checking node ${currNode.value}`;
      gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'visiting');
      gen.pushFrame();

      let updatedNode = { ...currNode };

      if (value < currNode.value) {
        gen.setHighlight("recurse_left");
        gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'default');
        updatedNode.left = deleteAVLRecursive(currNode.left, value, currNode.id);
      } else if (value > currNode.value) {
        gen.setHighlight("recurse_right");
        gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'default');
        updatedNode.right = deleteAVLRecursive(currNode.right, value, currNode.id);
      } else {
        gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'deleting');
        gen.status = `Found node ${value}. Preparing removal process.`;
        gen.pushFrame();

        if (!currNode.left && !currNode.right) {
          gen.setHighlight("leaf");
          gen.status = `Node ${value} is a leaf node. Freeing allocation.`;
          gen.pushFrame();
          if (parentId) gen.popStack(parentId, currNode.id);
          return null;
        }

        if (!currNode.left) {
          gen.setHighlight("one_child");
          gen.status = `Node ${value} has 1 right child. Rewiring subtree up.`;
          gen.pushFrame();
          if (parentId) gen.popStack(parentId, currNode.id);
          return currNode.right;
        }
        if (!currNode.right) {
          gen.setHighlight("one_child");
          gen.status = `Node ${value} has 1 left child. Rewiring subtree up.`;
          gen.pushFrame();
          if (parentId) gen.popStack(parentId, currNode.id);
          return currNode.left;
        }

        gen.setHighlight("find_min");
        gen.status = `Node ${value} has 2 children. Searching for in-order successor...`;
        const successor = findMin(currNode.right);

        gen.tree = gen.updateNodeByValue(gen.tree, successor.value, 'pre-op');
        gen.setHighlight("copy_val");
        gen.status = `In-order successor is ${successor.value}. Overriding value.`;
        gen.pushFrame();

        updatedNode.value = successor.value;
        gen.setHighlight("delete_min");
        updatedNode.right = deleteAVLRecursive(currNode.right, successor.value, currNode.id);
      }

      if (parentId) {
        gen.popStack(parentId, currNode.id);
        gen.status = `Stack Unwinding: Rebalancing node ${currNode.value}.`;
        gen.pushFrame();
      }

      gen.setHighlight("rebalance");
      updatedNode.height = 1 + Math.max(gen.getNodeHeight(updatedNode.left), gen.getNodeHeight(updatedNode.right));
      const balance = gen.getBalanceFactor(updatedNode);

      gen.status = `Rebalance Check: BF of ${updatedNode.value} is ${balance}.`;
      gen.pushFrame();

      if (balance > 1 && gen.getBalanceFactor(updatedNode.left) >= 0) {
        updatedNode = gen.performRightRotation(updatedNode);
      } else if (balance > 1 && gen.getBalanceFactor(updatedNode.left) < 0) {
        updatedNode.left = gen.performLeftRotation(updatedNode.left);
        updatedNode = gen.performRightRotation(updatedNode);
      } else if (balance < -1 && gen.getBalanceFactor(updatedNode.right) <= 0) {
        updatedNode = gen.performLeftRotation(updatedNode);
      } else if (balance < -1 && gen.getBalanceFactor(updatedNode.right) > 0) {
        updatedNode.right = gen.performRightRotation(updatedNode.right);
        updatedNode = gen.performLeftRotation(updatedNode);
      }

      gen.clearBacktrack();
      return updatedNode;
    };

    const finalTree = deleteAVLRecursive(gen.tree, val);
    gen.tree = finalTree;
    gen.addLog(`[Success] Key ${val} deleted & AVL balanced.`);
    
    gen.tree = gen.resetAllStates(gen.tree);
    gen.status = "Ready.";
    gen.highlightLineNum = -1;
    gen.callStackEdges = [];
    gen.backtrackEdge = null;
    gen.rotationDiagnostic = null;
    gen.pushFrame();

    runOperation("delete", gen.frames);
  };

  const handleSearch = () => {
    const val = getVal();
    if (val === null) return;
    setError(null);
    setIsHudVisible(true);

    const gen = new FrameGenerator(tree, executionLog, stats, "search", language);
    gen.status = `--- Initiating AVL Search for key: ${val} ---`;
    gen.addLog(gen.status);
    gen.pushFrame();

    const searchRecursive = (currNode, parentId = null) => {
      if (parentId) {
        gen.pushStack(parentId, currNode.id);
        gen.status = `Recursive descent call: searching node ${currNode.value}.`;
        gen.pushFrame();
      }

      gen.setHighlight("check_target");
      gen.status = `Checking if node ${currNode.value} matches target ${val}...`;
      gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'visiting');
      gen.pushFrame();

      if (currNode.value === val) {
        gen.status = `Target ${val} found!`;
        gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'found');
        gen.addLog(`[Success] Target ${val} found successfully.`);
        gen.pushFrame();
        
        if (parentId) {
          gen.popStack(parentId, currNode.id);
          gen.clearBacktrack();
          gen.pushFrame();
        }
        return currNode;
      }

      gen.tree = gen.updateNodeByValue(gen.tree, currNode.value, 'default');

      let foundResult = null;
      if (val < currNode.value) {
        gen.setHighlight("recurse_left");
        if (currNode.left) {
          foundResult = searchRecursive(currNode.left, currNode.id);
        } else {
          gen.status = `No left child. Node ${currNode.value} is greater than ${val}, target not found.`;
          gen.pushFrame();
        }
      } else {
        gen.setHighlight("recurse_right");
        if (currNode.right) {
          foundResult = searchRecursive(currNode.right, currNode.id);
        } else {
          gen.status = `No right child. Node ${currNode.value} is smaller than ${val}, target not found.`;
          gen.pushFrame();
        }
      }

      if (parentId) {
        gen.popStack(parentId, currNode.id);
        gen.status = `Returning up stack from node ${currNode.value}.`;
        gen.clearBacktrack();
        gen.pushFrame();
      }

      return foundResult;
    };

    const result = searchRecursive(gen.tree);
    if (!result) {
      gen.status = `Value ${val} not found in the AVL tree.`;
      gen.addLog(`[Failed] Key ${val} not present.`);
    }
    
    gen.tree = gen.resetAllStates(gen.tree);
    gen.status = "Ready.";
    gen.highlightLineNum = -1;
    gen.callStackEdges = [];
    gen.backtrackEdge = null;
    gen.rotationDiagnostic = null;
    gen.pushFrame();

    runOperation("search", gen.frames);
  };

  const handleReset = () => {
    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);
    
    setTree(null);
    setValue("");
    setStats({ leftRotations: 0, rightRotations: 0, totalRotations: 0 });
    setError(null);
    setStatus("Tree is empty. Insert a node to begin self-balancing visualization.");
    setHighlightLineNum(-1);
    setExecutionLog(["[System] AVL visualizer reset to empty."]);
    setCallStackEdges([]); 
    setBacktrackEdge(null); 
    setRotationDiagnostic(null);
    setIsHudVisible(true);
  };

  const codeLines = codeSnippets[activeConcept][language].trim().split('\n');
  const statusColor = status.includes("Imbalance") || status.includes("found") || status.includes("Success")
    ? "status-found"
    : status.includes("not found")
    ? "status-not-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  // Regenerate heights dynamically on layout render
  const mappedTree = updateHeightsAndBFs(tree);
  const { nodesList, edgesList } = getLayoutElements(mappedTree);

  return (
    <div className="visualizer-container">
      <InjectedStyles />

      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <GitFork size={30} />
          AVL Tree
        </h1>

        <div className="input-group">
          <label htmlFor="value">Value</label>
          <input
            id="value"
            type="text"
            placeholder="e.g., 20"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="actions-single">
          <button onClick={handleInsert} disabled={isVisualizing} className="btn btn-green">Insert</button>
        </div>
        <div className="actions-grid">
          <button onClick={handleDelete} disabled={isVisualizing || !tree} className="btn btn-red">Delete</button>
          <button onClick={handleSearch} disabled={isVisualizing || !tree} className="btn btn-cyan">
            <Search size={16} /> Search
          </button>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1.5rem 0' }} />

        <div className="actions-grid">
          <button
            onClick={togglePlay}
            disabled={frames.length === 0}
            className={`btn ${isPlaying ? 'btn-pause' : 'btn-resume'}`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause" : "Resume"}
          </button>
          
          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Reset Tree
          </button>
        </div>

        <div className="actions-grid" style={{ gridTemplateColumns: '1fr 2.5fr' }}>
          <input
            id="randomSize"
            type="number"
            min="1"
            max="25"
            placeholder="Size"
            value={randomSize}
            onChange={(e) => setRandomSize(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
            style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}
            title="Random Tree Size"
          />
          <button
            onClick={handleGenerateRandom}
            disabled={isVisualizing}
            className="btn btn-cyan"
          >
            <Shuffle size={18} />
            Random
          </button>
        </div>

        {/* --- Language & Speed Configuration --- */}
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="language">Code Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="speed">Visualization Speed</label>
          <div className="speed-slider-group">
            <input
              id="speed"
              type="range"
              min="200"
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
        
        {/* --- Dynamic Stat Board --- */}
        <div className="stats-bar">
           <div className="stat-card">
              <span className="stat-title">Total Operations</span>
              <strong className="stat-value">{stats.totalRotations}</strong>
           </div>
           <div className="stat-card">
              <span className="stat-title">Left Rotations</span>
              <strong className="stat-value" style={{color: 'var(--purple-400)'}}>{stats.leftRotations}</strong>
           </div>
           <div className="stat-card">
              <span className="stat-title">Right Rotations</span>
              <strong className="stat-value" style={{color: 'var(--orange-400)'}}>{stats.rightRotations}</strong>
           </div>
           <div className="stat-card">
              <span className="stat-title">Tree Height</span>
              <strong className="stat-value" style={{color: 'var(--green-400)'}}>{tree ? tree.height : 0}</strong>
           </div>
        </div>

        {/* --- Visualization Section --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visualization</h2>

          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="visualization-boxes">
            {tree === null && (
              <span style={{ color: 'var(--text-gray-500)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                AVL Tree is empty.<br/>Insert a value or generate a random tree!
              </span>
            )}

            {tree !== null && (
              <>
                {/* HUD: Step-by-Step Rotation Analyzer Details overlay */}
                {rotationDiagnostic && isHudVisible && (
                  <div className="rotation-analyzer-hud">
                    <button className="hud-close-btn" onClick={() => setIsHudVisible(false)}>
                      <X size={14} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pink-500)', fontWeight: 'bold', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      <Info size={14} /> Rotation Analyzer Active
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                      Type: {rotationDiagnostic.type}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.2rem', color: 'var(--text-gray-300)', fontSize: '0.75rem' }}>
                      <span>Pivot Node:</span><span style={{ color: 'var(--pink-500)', fontWeight: 'bold' }}>{rotationDiagnostic.pivot}</span>
                      <span>Target Sub:</span><span style={{ color: 'var(--cyan-400)' }}>{rotationDiagnostic.target}</span>
                      <span>Orphan T2:</span><span style={{ color: 'var(--purple-400)' }}>{rotationDiagnostic.orphan}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-gray-700)', marginTop: '0.4rem', paddingTop: '0.4rem', fontSize: '0.725rem', color: 'var(--yellow-400)', fontStyle: 'italic' }}>
                      Phase: {rotationDiagnostic.phase}
                    </div>
                  </div>
                )}

                {/* SVG connection overlay with direct diagonal lines matching image_eed3d6.png */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  {edgesList.map((edge, idx) => {
                    const isDescentActive = callStackEdges.some(
                      s => (s.from === edge.from.id && s.to === edge.to.id)
                    );

                    const isBacktrackActive = backtrackEdge && (
                      (backtrackEdge.from === edge.from.id && backtrackEdge.to === edge.to.id) ||
                      (backtrackEdge.from === edge.to.id && backtrackEdge.to === edge.from.id)
                    );

                    return (
                      <g key={idx}>
                        <line
                          x1={`${edge.from.x}%`}
                          y1={`${edge.from.y}px`}
                          x2={`${edge.to.x}%`}
                          y2={`${edge.to.y}px`}
                          stroke="#8cc07e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          style={{ transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                        />

                        {isDescentActive && (
                          <line
                            x1={`${edge.from.x}%`}
                            y1={`${edge.from.y}px`}
                            x2={`${edge.to.x}%`}
                            y2={`${edge.to.y}px`}
                            className="traversal-descent-line"
                          />
                        )}

                        {isBacktrackActive && (
                          <line
                            x1={`${edge.from.x}%`}
                            y1={`${edge.from.y}px`}
                            x2={`${edge.to.x}%`}
                            y2={`${edge.to.y}px`}
                            className="traversal-ascent-line"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {nodesList.map((node) => {
                  const bf = getBalanceFactor(node);
                  const isImbalanced = bf >= 2 || bf <= -2;

                  return (
                    <div
                      key={node.id}
                      className={`tree-circle-node ${node.state || 'default'}`}
                      style={{
                        position: 'absolute',
                        left: `${node.x}%`,
                        top: `${node.y}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                      }}
                    >
                      {node.value}
                      
                      {/* Balance Factor badge */}
                      <span className={`bf-badge ${isImbalanced ? 'imbalanced' : ''}`} title={`Balance Factor: ${bf}`}>
                        {bf}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          
          {/* --- Playback Controls Bar --- */}
          <div className="playback-controls-bar">
            <button
              onClick={handlePrev}
              disabled={frames.length === 0 || currentFrameIdx === 0}
              className="btn btn-secondary"
            >
              <StepBack size={16} /> Prev
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={togglePlay}
                disabled={frames.length === 0}
                className={`btn ${isPlaying ? 'btn-pause' : 'btn-resume'}`}
                style={{ borderRadius: '50%', padding: '0.6rem', minWidth: 'auto' }}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <span className="step-indicator">
                Step {frames.length > 0 ? currentFrameIdx : 0}
              </span>
            </div>
            
            <button
              onClick={handleNext}
              disabled={frames.length === 0 || currentFrameIdx === frames.length - 1}
              className="btn btn-secondary"
            >
              Next <StepForward size={16} />
            </button>
          </div>

        </section>

        {/* --- Lower Content Area (Code & Log) --- */}
        <div className="lower-content-area">
          <section className="code-section">
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Code Tracker</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                {activeConcept}
              </span>
            </h2>
            <div className="code-block">
              <pre>
                <code>
                  {codeLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`code-line
                        ${highlightLineNum === (idx + 1) ? 'highlight' : ''}
                        ${(line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('def ') || line.trim().startsWith('struct ')) ? 'comment' : ''}
                      `}
                    >
                      {line || '\u00A0'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </section>

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