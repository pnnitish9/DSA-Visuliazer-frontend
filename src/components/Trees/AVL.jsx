import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search, Info, HelpCircle } from 'lucide-react';

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
      transition: left 0.8s cubic-bezier(0.25, 1, 0.5, 1), 
                  top 0.8s cubic-bezier(0.25, 1, 0.5, 1), 
                  background-color 0.4s, border-color 0.4s, transform 0.4s, box-shadow 0.4s;
      user-select: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    /* Green circular style from image_eed3d6.png */
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

    /* Rotation diagnostic node visual styles */
    .tree-circle-node.pivot {
      background-color: #fce7f3; /* pink-100 */
      border: 2.5px solid #db2777; /* pink-600 */
      color: #831843; /* pink-900 */
      transform: translate(-50%, -50%) scale(1.15);
      box-shadow: 0 0 20px rgba(219, 39, 119, 0.75);
    }
    .tree-circle-node.detached {
      background-color: #f3e8ff; /* purple-100 */
      border: 2.5px dashed #a855f7; /* purple-500 */
      color: #581c87; /* purple-900 */
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AVLTreeVisualizer() {
  const [tree, setTree] = useState(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(1000);
  const [status, setStatus] = useState("Tree is empty. Insert a node to begin self-balancing visualization.");
  const [executionLog, setExecutionLog] = useState(["[System] AVL visualizer active. All nodes auto-balance upon insert/delete."]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [activeConcept, setActiveConcept] = useState("insert"); 

  const [callStackEdges, setCallStackEdges] = useState([]); 
  const [backtrackEdge, setBacktrackEdge] = useState(null); 

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  // Rotation step feedback hud state
  const [rotationDiagnostic, setRotationDiagnostic] = useState(null);

  const pausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

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

  const getNodeHeight = (node) => {
    if (!node) return 0;
    return node.height || 1;
  };

  const getBalanceFactor = (node) => {
    if (!node) return 0;
    return getNodeHeight(node.left) - getNodeHeight(node.right);
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

  const resetAllStates = (node) => {
    if (!node) return null;
    return {
      ...node,
      state: 'default',
      left: resetAllStates(node.left),
      right: resetAllStates(node.right)
    };
  };

  const updateNodeByValue = (node, targetValue, newState) => {
    if (!node) return null;
    let newNode = { ...node };
    if (node.value === targetValue) {
      newNode.state = newState;
    }
    newNode.left = updateNodeByValue(node.left, targetValue, newState);
    newNode.right = updateNodeByValue(node.right, targetValue, newState);
    return newNode;
  };

  const replaceSubtree = (node, targetId, replacement) => {
    if (!node) return null;
    if (node.id === targetId) return replacement;
    return {
      ...node,
      left: replaceSubtree(node.left, targetId, replacement),
      right: replaceSubtree(node.right, targetId, replacement)
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
        setHighlightLineNum(-1);
        setCallStackEdges([]); 
        setBacktrackEdge(null); 
        setRotationDiagnostic(null);
      }
    }, speed * 1.5);
  };

  const highlightLine = (concept, key) => {
    if (LINE_MAPS[concept] && LINE_MAPS[concept][language]) {
      setHighlightLineNum(LINE_MAPS[concept][language][key] ?? -1);
    } else {
      setHighlightLineNum(-1);
    }
  };

  const performRightRotation = async (y) => {
    let x = y.left;
    let T2 = x ? x.right : null;

    // Phase 1: Highlight Imbalance & Pivot configuration
    setStatus(`Imbalance detected! Highlighting pivot node ${y.value} (pink) and child ${x?.value || ''}.`);
    setExecutionLog(prev => [...prev, `[Rotation Setup] Pivot: ${y.value}, Left Child: ${x?.value || ''}`]);
    
    setRotationDiagnostic({
      type: 'Right Rotation (Single R)',
      pivot: y.value,
      target: x?.value,
      orphan: T2 ? T2.value : 'None',
      phase: 'Identifying Pivot and Subtrees'
    });

    // Update global tree to display the highlighted pivot and child
    const highlightPivotNode = {
      ...y,
      state: 'pivot',
      left: x ? {
        ...x,
        state: 'visiting',
        right: T2 ? { ...T2, state: 'detached' } : null
      } : null
    };
    setTree(prev => replaceSubtree(prev, y.id, highlightPivotNode));
    await sleep(speed * 1.5);

    // Phase 2: Perform structural re-routing in animation
    setStatus(`Swapping pointers: Node ${x?.value || ''} swings up to Root. ${y.value} slides down.`);
    if (rotationDiagnostic) {
      setRotationDiagnostic(prev => prev ? { ...prev, phase: 'Reassigning Pointers & swinging child up' } : null);
    }

    let intermediateX = {
      ...x,
      state: 'pre-op',
      right: {
        ...y,
        state: 'visiting',
        left: T2 ? { ...T2, state: 'default' } : null
      }
    };

    setTree(prev => replaceSubtree(prev, y.id, intermediateX));
    await sleep(speed * 1.5);

    // Phase 3: Settle positions and recalculate weights
    setStatus(`Pointer alignment complete! Height recalculation settling.`);
    setExecutionLog(prev => [...prev, `[Rotation Success] Completed Right Rotation under parent node ${x?.value || ''}`]);

    intermediateX.right.height = 1 + Math.max(getNodeHeight(intermediateX.right.left), getNodeHeight(intermediateX.right.right));
    intermediateX.height = 1 + Math.max(getNodeHeight(intermediateX.left), getNodeHeight(intermediateX.right));

    setRotationDiagnostic(null);
    return intermediateX;
  };

  const performLeftRotation = async (x) => {
    let y = x.right;
    let T2 = y ? y.left : null;

    // Phase 1: Highlight Imbalance & Pivot configuration
    setStatus(`Imbalance detected! Highlighting pivot node ${x.value} (pink) and child ${y?.value || ''}.`);
    setExecutionLog(prev => [...prev, `[Rotation Setup] Pivot: ${x.value}, Right Child: ${y?.value || ''}`]);

    setRotationDiagnostic({
      type: 'Left Rotation (Single L)',
      pivot: x.value,
      target: y?.value,
      orphan: T2 ? T2.value : 'None',
      phase: 'Identifying Pivot and Subtrees'
    });

    const highlightPivotNode = {
      ...x,
      state: 'pivot',
      right: y ? {
        ...y,
        state: 'visiting',
        left: T2 ? { ...T2, state: 'detached' } : null
      } : null
    };
    setTree(prev => replaceSubtree(prev, x.id, highlightPivotNode));
    await sleep(speed * 1.5);

    // Phase 2: Perform structural re-routing in animation
    setStatus(`Swapping pointers: Node ${y?.value || ''} swings up to Root. ${x.value} slides down.`);
    if (rotationDiagnostic) {
      setRotationDiagnostic(prev => prev ? { ...prev, phase: 'Reassigning Pointers & swinging child up' } : null);
    }

    let intermediateY = {
      ...y,
      state: 'pre-op',
      left: {
        ...x,
        state: 'visiting',
        right: T2 ? { ...T2, state: 'default' } : null
      }
    };

    setTree(prev => replaceSubtree(prev, x.id, intermediateY));
    await sleep(speed * 1.5);

    // Phase 3: Settle positions and recalculate weights
    setStatus(`Pointer alignment complete! Height recalculation settling.`);
    setExecutionLog(prev => [...prev, `[Rotation Success] Completed Left Rotation under parent node ${y?.value || ''}`]);

    intermediateY.left.height = 1 + Math.max(getNodeHeight(intermediateY.left.left), getNodeHeight(intermediateY.left.right));
    intermediateY.height = 1 + Math.max(getNodeHeight(intermediateY.left), getNodeHeight(intermediateY.right));

    setRotationDiagnostic(null);
    return intermediateY;
  };

  const handleInsert = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setActiveConcept("insert");
    setCallStackEdges([]);
    setBacktrackEdge(null);
    setRotationDiagnostic(null);
    setExecutionLog(prev => [...prev, `[Insert] Requesting balanced insertion of key: ${val}`]);

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const newNode = { value: val, id: uniqueId, left: null, right: null, height: 1, state: 'found' };

    const pushStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => [...prev, { from: fromId, to: toId }]);
    };

    const popStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => prev.filter(e => !(e.from === fromId && e.to === toId)));
      setBacktrackEdge({ from: toId, to: fromId });
    };

    const insertAVLRecursive = async (currNode, parentId = null) => {
      if (isCancelledRef.current) return null;
      await checkPause();

      // Check Base Case
      if (!currNode) {
        highlightLine("insert", "check_null");
        setStatus(`Base Case reached! Inserting new node ${val} here.`);
        await sleep(speed);
        if (parentId) {
          popStackSegment(parentId, uniqueId);
        }
        return newNode;
      }

      if (parentId) {
        pushStackSegment(parentId, currNode.id);
        setStatus(`Recursive descent: entering node ${currNode.value}.`);
        await sleep(speed);
      }

      highlightLine("insert", "check_null");
      setStatus(`Comparing insert value ${val} with node ${currNode.value}...`);
      setTree(prev => updateNodeByValue(prev, currNode.value, 'visiting'));
      await sleep(speed);

      if (val === currNode.value) {
        setStatus(`Value ${val} already exists. AVL requires unique keys.`);
        setExecutionLog(prev => [...prev, `[Duplicate] Key ${val} already in tree.`]);
        if (parentId) {
          popStackSegment(parentId, currNode.id);
        }
        return currNode;
      }

      setTree(prev => updateNodeByValue(prev, currNode.value, 'default'));

      let updatedNode = { ...currNode };

      if (val < currNode.value) {
        highlightLine("insert", "recurse_left");
        updatedNode.left = await insertAVLRecursive(currNode.left, currNode.id);
      } else {
        highlightLine("insert", "recurse_right");
        updatedNode.right = await insertAVLRecursive(currNode.right, currNode.id);
      }

      await checkPause();
      if (isCancelledRef.current) return updatedNode;

      // Unwinding the stack - Recalculate heights & balance factors
      if (parentId) {
        popStackSegment(parentId, currNode.id);
        setStatus(`Stack Unwinding: Recalculating height of node ${currNode.value}.`);
        await sleep(speed);
      }

      highlightLine("insert", "height");
      updatedNode.height = 1 + Math.max(getNodeHeight(updatedNode.left), getNodeHeight(updatedNode.right));
      
      highlightLine("insert", "check_balance");
      const balance = getNodeHeight(updatedNode.left) - getNodeHeight(updatedNode.right);
      setStatus(`Node ${currNode.value} balance factor: ${balance}.`);
      await sleep(speed);

      // LL Case
      if (balance > 1 && val < updatedNode.left.value) {
        highlightLine("insert", "LL");
        setTree(prev => updateNodeByValue(prev, currNode.value, 'pre-op'));
        updatedNode = await performRightRotation(updatedNode);
      }
      // RR Case
      else if (balance < -1 && val > updatedNode.right.value) {
        highlightLine("insert", "RR");
        setTree(prev => updateNodeByValue(prev, currNode.value, 'pre-op'));
        updatedNode = await performLeftRotation(updatedNode);
      }
      // LR Case
      else if (balance > 1 && val > updatedNode.left.value) {
        highlightLine("insert", "LR");
        setStatus(`Double imbalance (LR) detected! Step 1: Left Rotating child ${updatedNode.left.value} first...`);
        updatedNode.left = await performLeftRotation(updatedNode.left);
        setStatus(`Step 2: Now performing Right Rotation on root pivot node ${currNode.value}...`);
        updatedNode = await performRightRotation(updatedNode);
      }
      // RL Case
      else if (balance < -1 && val < updatedNode.right.value) {
        highlightLine("insert", "RL");
        setStatus(`Double imbalance (RL) detected! Step 1: Right Rotating child ${updatedNode.right.value} first...`);
        updatedNode.right = await performRightRotation(updatedNode.right);
        setStatus(`Step 2: Now performing Left Rotation on root pivot node ${currNode.value}...`);
        updatedNode = await performLeftRotation(updatedNode);
      }

      setBacktrackEdge(null);
      return updatedNode;
    };

    const finalTree = await insertAVLRecursive(tree);
    if (!isCancelledRef.current) {
      setTree(finalTree);
      setExecutionLog(prev => [...prev, `[Success] Key ${val} inserted and AVL balance property verified.`]);
    }
    cleanup();
  };

  const handleDelete = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setActiveConcept("delete");
    setCallStackEdges([]);
    setBacktrackEdge(null);
    setRotationDiagnostic(null);
    setExecutionLog(prev => [...prev, `[Delete] Requesting balanced deletion of key: ${val}`]);

    const findMin = (node) => {
      let current = node;
      while (current && current.left) {
        current = current.left;
      }
      return current;
    };

    const pushStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => [...prev, { from: fromId, to: toId }]);
    };

    const popStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => prev.filter(e => !(e.from === fromId && e.to === toId)));
      setBacktrackEdge({ from: toId, to: fromId });
    };

    const deleteAVLRecursive = async (currNode, value, parentId = null) => {
      if (!currNode) {
        setStatus(`Key ${value} not found in the AVL tree.`);
        return null;
      }

      if (parentId) {
        pushStackSegment(parentId, currNode.id);
        setStatus(`Recursive descent: entering node ${currNode.value}.`);
        await sleep(speed);
      }

      highlightLine("delete", "check_null");
      setStatus(`Searching for ${value}... checking node ${currNode.value}`);
      setTree(prev => updateNodeByValue(prev, currNode.value, 'visiting'));
      await sleep(speed);

      let updatedNode = { ...currNode };

      if (value < currNode.value) {
        highlightLine("delete", "recurse_left");
        setTree(prev => updateNodeByValue(prev, currNode.value, 'default'));
        updatedNode.left = await deleteAVLRecursive(currNode.left, value, currNode.id);
      } else if (value > currNode.value) {
        highlightLine("delete", "recurse_right");
        setTree(prev => updateNodeByValue(prev, currNode.value, 'default'));
        updatedNode.right = await deleteAVLRecursive(currNode.right, value, currNode.id);
      } else {
        // Node Found
        setTree(prev => updateNodeByValue(prev, currNode.value, 'deleting'));
        setStatus(`Found node ${value}. Preparing removal process.`);
        await sleep(speed);

        if (!currNode.left && !currNode.right) {
          highlightLine("delete", "leaf");
          setStatus(`Node ${value} is a leaf node. Freeing allocation.`);
          await sleep(speed);
          if (parentId) popStackSegment(parentId, currNode.id);
          return null;
        }

        if (!currNode.left) {
          highlightLine("delete", "one_child");
          setStatus(`Node ${value} has 1 right child. Rewiring subtree up.`);
          await sleep(speed);
          if (parentId) popStackSegment(parentId, currNode.id);
          return currNode.right;
        }
        if (!currNode.right) {
          highlightLine("delete", "one_child");
          setStatus(`Node ${value} has 1 left child. Rewiring subtree up.`);
          await sleep(speed);
          if (parentId) popStackSegment(parentId, currNode.id);
          return currNode.left;
        }

        highlightLine("delete", "find_min");
        setStatus(`Node ${value} has 2 children. Searching for in-order successor...`);
        const successor = findMin(currNode.right);

        setTree(prev => updateNodeByValue(prev, successor.value, 'pre-op'));
        highlightLine("delete", "copy_val");
        setStatus(`In-order successor is ${successor.value}. Overriding value.`);
        await sleep(speed);

        updatedNode.value = successor.value;
        highlightLine("delete", "delete_min");
        updatedNode.right = await deleteAVLRecursive(currNode.right, successor.value, currNode.id);
      }

      if (isCancelledRef.current) return updatedNode;

      // Balance Stack back-propagation
      if (parentId) {
        popStackSegment(parentId, currNode.id);
        setStatus(`Stack Unwinding: Rebalancing node ${currNode.value}.`);
        await sleep(speed);
      }

      highlightLine("delete", "rebalance");
      updatedNode.height = 1 + Math.max(getNodeHeight(updatedNode.left), getNodeHeight(updatedNode.right));
      const balance = getBalanceFactor(updatedNode);

      setStatus(`Rebalance Check: BF of ${updatedNode.value} is ${balance}.`);
      await sleep(speed);

      // LL balance cases
      if (balance > 1 && getBalanceFactor(updatedNode.left) >= 0) {
        updatedNode = await performRightRotation(updatedNode);
      }
      if (balance > 1 && getBalanceFactor(updatedNode.left) < 0) {
        updatedNode.left = await performLeftRotation(updatedNode.left);
        updatedNode = await performRightRotation(updatedNode);
      }
      // RR balance cases
      if (balance < -1 && getBalanceFactor(updatedNode.right) <= 0) {
        updatedNode = await performLeftRotation(updatedNode);
      }
      if (balance < -1 && getBalanceFactor(updatedNode.right) > 0) {
        updatedNode.right = await performRightRotation(updatedNode.right);
        updatedNode = await performLeftRotation(updatedNode);
      }

      setBacktrackEdge(null);
      return updatedNode;
    };

    const finalTree = await deleteAVLRecursive(tree, val);
    if (!isCancelledRef.current) {
      setTree(finalTree);
      setExecutionLog(prev => [...prev, `[Success] Key ${val} deleted & AVL balanced.`]);
    }
    cleanup();
  };

  const handleSearch = async () => {
    const val = getVal();
    if (val === null) return;

    setError(null);
    setIsVisualizing(true);
    setActiveConcept("search");
    setCallStackEdges([]);
    setBacktrackEdge(null);
    setRotationDiagnostic(null);
    setExecutionLog(prev => [...prev, `--- Initiating AVL Search for key: ${val} ---`]);

    const pushStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => [...prev, { from: fromId, to: toId }]);
    };

    const popStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => prev.filter(e => !(e.from === fromId && e.to === toId)));
      setBacktrackEdge({ from: toId, to: fromId });
    };

    const searchRecursive = async (currNode, parentId = null) => {
      if (isCancelledRef.current) return null;
      await checkPause();

      if (parentId) {
        pushStackSegment(parentId, currNode.id);
        setStatus(`Recursive descent call: searching node ${currNode.value}.`);
        await sleep(speed);
      }

      highlightLine("search", "check_target");
      setStatus(`Checking if node ${currNode.value} matches target ${val}...`);
      setTree(prev => updateNodeByValue(prev, currNode.value, 'visiting'));
      await sleep(speed);

      if (currNode.value === val) {
        setStatus(`Target ${val} found!`);
        setTree(prev => updateNodeByValue(prev, currNode.value, 'found'));
        setExecutionLog(prev => [...prev, `[Success] Target ${val} found successfully.`]);
        await sleep(speed * 1.5);
        
        if (parentId) {
          popStackSegment(parentId, currNode.id);
          await sleep(speed);
          setBacktrackEdge(null);
        }
        return currNode;
      }

      setTree(prev => updateNodeByValue(prev, currNode.value, 'default'));

      let foundResult = null;
      if (val < currNode.value) {
        highlightLine("search", "recurse_left");
        if (currNode.left) {
          foundResult = await searchRecursive(currNode.left, currNode.id);
        } else {
          setStatus(`No left child. Node ${currNode.value} is greater than ${val}, target not found.`);
          await sleep(speed);
        }
      } else {
        highlightLine("search", "recurse_right");
        if (currNode.right) {
          foundResult = await searchRecursive(currNode.right, currNode.id);
        } else {
          setStatus(`No right child. Node ${currNode.value} is smaller than ${val}, target not found.`);
          await sleep(speed);
        }
      }

      if (parentId && !isCancelledRef.current) {
        popStackSegment(parentId, currNode.id);
        setStatus(`Returning up stack from node ${currNode.value}.`);
        await sleep(speed);
        setBacktrackEdge(null);
      }

      return foundResult;
    };

    const result = await searchRecursive(tree);
    if (!result && !isCancelledRef.current) {
      setStatus(`Value ${val} not found in the AVL tree.`);
      setExecutionLog(prev => [...prev, `[Failed] Key ${val} not present.`]);
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
    setStatus("Tree is empty. Insert a node to begin self-balancing visualization.");
    setHighlightLineNum(-1);
    setExecutionLog(["[System] AVL visualizer reset to empty."]);
    setCallStackEdges([]); 
    setBacktrackEdge(null); 
    setRotationDiagnostic(null);
    
    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    pausedRef.current = nextPaused;
    if (nextPaused) {
      setExecutionLog(prev => [...prev, "Paused AVL balancing visual."]);
    } else {
      setExecutionLog(prev => [...prev, "Resuming search frames..."]);
    }
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
              <span style={{ color: 'var(--text-gray-500)', margin: 'auto' }}>
                AVL Tree is empty. Insert a value on the left to start balancing!
              </span>
            )}

            {tree !== null && (
              <>
                {/* HUD: Step-by-Step Rotation Analyzer Details overlay */}
                {rotationDiagnostic && (
                  <div className="rotation-analyzer-hud">
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
                          style={{ transition: 'all 0.8s ease-in-out' }}
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