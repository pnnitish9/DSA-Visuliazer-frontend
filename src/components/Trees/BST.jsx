import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search } from 'lucide-react';

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
    .actions-grid-three {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.4rem;
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
      min-height: 380px;
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
      transition: background-color 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s;
      user-select: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    /* Verbatim green style from image_eed3d6.png */
    .tree-circle-node.default {
      background-color: #e2f0d9;
      border: 2.5px solid #8cc07e;
      color: #385723;
    }

    .tree-circle-node.visiting {
      background-color: #fef08a; /* yellow-200 */
      border: 2.5px solid #ca8a04; /* yellow-600 */
      color: #854d0e; /* yellow-900 */
      transform: translate(-50%, -50%) scale(1.12);
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.6);
    }
    .tree-circle-node.pre-op {
      background-color: #fed7aa; /* orange-200 */
      border: 2.5px solid #ea580c; /* orange-600 */
      color: #7c2d12; /* orange-900 */
      transform: translate(-50%, -50%) scale(1.12);
      box-shadow: 0 0 15px rgba(249, 115, 22, 0.6);
    }
    .tree-circle-node.found {
      background-color: #4ade80; /* green-400 */
      border: 2.5px solid #16a34a; /* green-600 */
      color: #ffffff;
      transform: translate(-50%, -50%) scale(1.18);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
    .tree-circle-node.deleting {
      background-color: #fca5a5; /* red-300 */
      border: 2.5px solid #dc2626; /* red-600 */
      color: #7f1d1d; /* red-900 */
      transform: translate(-50%, -50%) scale(0.85);
      opacity: 0.7;
    }

    @keyframes flow-descent {
      to {
        stroke-dashoffset: -20;
      }
    }
    @keyframes flow-ascent {
      to {
        stroke-dashoffset: 20;
      }
    }
    
    .traversal-descent-line {
      stroke: #22c55e; /* vibrant green */
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-descent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.8));
      opacity: 0.95;
    }
    
    .traversal-ascent-line {
      stroke: #ef4444; /* vibrant red */
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-ascent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
      opacity: 0.95;
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
def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    elif key > root.val:
        root.right = insert(root.right, key)
    return root
    `.trim(),
    c: `
struct node* insert(struct node* node, int key) {
    if (node == NULL) return newNode(key);
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
    return node;
}
    `.trim(),
    cpp: `
Node* insert(Node* root, int data) {
    if (root == NULL) return new Node(data);
    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    return root;
}
    `.trim(),
    java: `
Node insert(Node root, int key) {
    if (root == null) {
        root = new Node(key);
        return root;
    }
    if (key < root.key)
        root.left = insert(root.left, key);
    else if (key > root.key)
        root.right = insert(root.right, key);
    return root;
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
    c: `
struct node* search(struct node* root, int key) {
    if (root == NULL || root->key == key)
        return root;
    if (root->key < key)
        return search(root->right, key);
    return search(root->left, key);
}
    `.trim(),
    cpp: `
Node* search(Node* root, int data) {
    if (root == NULL || root->data == data)
        return root;
    if (root->data < data)
        return search(root->right, data);
    return search(root->left, data);
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
    `.trim()
  },
  delete: {
    python: `
def delete(root, key):
    if root is None:
        return root
    if key < root.val:
        root.left = delete(root.left, key)
    elif key > root.val:
        root.right = delete(root.right, key)
    else:
        if root.left is None:
            return root.right
        elif root.right is None:
            return root.left
        temp = findMin(root.right)
        root.val = temp.val
        root.right = delete(root.right, temp.val)
    return root
    `.trim(),
    c: `
struct node* deleteNode(struct node* root, int key) {
    if (root == NULL) return root;
    if (key < root->key)
        root->left = deleteNode(root->left, key);
    else if (key > root->key)
        root->right = deleteNode(root->right, key);
    else {
        if (root->left == NULL) {
            struct node* temp = root->right;
            free(root); return temp;
        } else if (root->right == NULL) {
            struct node* temp = root->left;
            free(root); return temp;
        }
        struct node* temp = findMin(root->right);
        root->key = temp->key;
        root->right = deleteNode(root->right, temp->key);
    }
    return root;
}
    `.trim(),
    cpp: `
Node* deleteNode(Node* root, int data) {
    if (root == NULL) return root;
    if (data < root->data)
        root->left = deleteNode(root->left, data);
    else if (data > root->data)
        root->right = deleteNode(root->right, data);
    else {
        if (root->left == NULL) {
            Node* temp = root->right;
            delete root; return temp;
        } else if (root->right == NULL) {
            Node* temp = root->left;
            delete root; return temp;
        }
        Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}
    `.trim(),
    java: `
Node delete(Node root, int key) {
    if (root == null) return root;
    if (key < root.key)
        root.left = delete(root.left, key);
    else if (key > root.key)
        root.right = delete(root.right, key);
    else {
        if (root.left == null) return root.right;
        else if (root.right == null) return root.left;
        Node temp = findMin(root.right);
        root.key = temp.key;
        root.right = delete(root.right, temp.key);
    }
    return root;
}
    `.trim()
  },
  inorder: {
    python: `
def inorder(root):
    if root:
        inorder(root.left)
        print(root.val) # Visit
        inorder(root.right)
    `.trim(),
    c: `
void inorder(struct node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->key); // Visit
        inorder(root->right);
    }
}
    `.trim(),
    cpp: `
void inorder(Node* root) {
    if (root != NULL) {
        inorder(root->left);
        cout << root->data << " "; // Visit
        inorder(root->right);
    }
}
    `.trim(),
    java: `
void inorder(Node root) {
    if (root != null) {
        inorder(root.left);
        System.out.print(root.key + " "); // Visit
        inorder(root.right);
    }
}
    `.trim()
  },
  preorder: {
    python: `
def preorder(root):
    if root:
        print(root.val) # Visit
        preorder(root.left)
        preorder(root.right)
    `.trim(),
    c: `
void preorder(struct node* root) {
    if (root != NULL) {
        printf("%d ", root->key); // Visit
        preorder(root->left);
        preorder(root->right);
    }
}
    `.trim(),
    cpp: `
void preorder(Node* root) {
    if (root != NULL) {
        cout << root->data << " "; // Visit
        preorder(root->left);
        preorder(root->right);
    }
}
    `.trim(),
    java: `
void preorder(Node root) {
    if (root != null) {
        System.out.print(root.key + " "); // Visit
        preorder(root.left);
        preorder(root.right);
    }
}
    `.trim()
  },
  postorder: {
    python: `
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val) # Visit
    `.trim(),
    c: `
void postorder(struct node* root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->key); // Visit
    }
}
    `.trim(),
    cpp: `
void postorder(Node* root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        cout << root->data << " "; // Visit
    }
}
    `.trim(),
    java: `
void postorder(Node root) {
    if (root != null) {
        postorder(root.left);
        postorder(root.right);
        System.out.print(root.key + " "); // Visit
    }
}
    `.trim()
  }
};

const LINE_MAPS = {
  insert: {
    python: { check_null: 2, recurse_left: 5, recurse_right: 7 },
    c: { check_null: 2, recurse_left: 4, recurse_right: 6 },
    cpp: { check_null: 2, recurse_left: 4, recurse_right: 6 },
    java: { check_null: 2, recurse_left: 7, recurse_right: 9 }
  },
  search: {
    python: { check_target: 2, recurse_left: 4, recurse_right: 5 },
    c: { check_target: 2, recurse_left: 6, recurse_right: 4 },
    cpp: { check_target: 2, recurse_left: 6, recurse_right: 4 },
    java: { check_target: 2, recurse_left: 5, recurse_right: 7 }
  },
  delete: {
    python: { check_null: 2, recurse_left: 5, recurse_right: 7, leaf: 10, one_child: 10, find_min: 13, copy_val: 14, delete_min: 15 },
    c: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 10, one_child: 10, find_min: 15, copy_val: 16, delete_min: 17 },
    cpp: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 10, one_child: 10, find_min: 15, copy_val: 16, delete_min: 17 },
    java: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 8, one_child: 8, find_min: 10, copy_val: 11, delete_min: 12 }
  },
  inorder: {
    python: { cond: 2, left: 3, visit: 4, right: 5 },
    c: { cond: 2, left: 3, visit: 4, right: 5 },
    cpp: { cond: 2, left: 3, visit: 4, right: 5 },
    java: { cond: 2, left: 3, visit: 4, right: 5 }
  },
  preorder: {
    python: { cond: 2, visit: 3, left: 4, right: 5 },
    c: { cond: 2, visit: 3, left: 4, right: 5 },
    cpp: { cond: 2, visit: 3, left: 4, right: 5 },
    java: { cond: 2, visit: 3, left: 4, right: 5 }
  },
  postorder: {
    python: { cond: 2, left: 3, right: 4, visit: 5 },
    c: { cond: 2, left: 3, right: 4, visit: 5 },
    cpp: { cond: 2, left: 3, right: 4, visit: 5 },
    java: { cond: 2, left: 3, right: 4, visit: 5 }
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function BST() {
  const [tree, setTree] = useState(null);
  const [value, setValue] = useState("");
  
  const [language, setLanguage] = useState("c");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Tree is empty. Insert a node to begin.");
  const [executionLog, setExecutionLog] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [activeConcept, setActiveConcept] = useState("insert"); 
  
  const [callStackEdges, setCallStackEdges] = useState([]); // Array of active green descent segments [{fromId, toId}]
  const [backtrackEdge, setBacktrackEdge] = useState(null); // Active red backtrack segment {fromId, toId}
  
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

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
        assignCoords(node.left, x - dx, y + 75, dx * 0.48);
      }
      if (node.right) {
        edgesList.push({ from: node, to: node.right });
        assignCoords(node.right, x + dx, y + 75, dx * 0.48);
      }
    };

    assignCoords(root, 50, 45, 24);
    return { nodesList, edgesList };
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
        setHighlightLineNum(-1);
        setCallStackEdges([]); // Clear active recursive descent segments
        setBacktrackEdge(null); // Clear active red backtracks
      }
    }, speed * 2);
  };

  const highlightLine = (concept, key) => {
    if (LINE_MAPS[concept] && LINE_MAPS[concept][language]) {
      setHighlightLineNum(LINE_MAPS[concept][language][key] ?? -1);
    } else {
      setHighlightLineNum(-1);
    }
  };

  const handleInsert = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setActiveConcept("insert");
    setExecutionLog(prev => [...prev, `[Insert] Requesting insert of: ${val}`]);
    
    const newNode = { value: val, id: crypto.randomUUID(), left: null, right: null, state: 'found' };
    
    if (tree === null) {
      highlightLine("insert", "check_null");
      setStatus(`Inserting ${val} as root.`);
      await sleep(speed);
      setTree(newNode);
      setExecutionLog(prev => [...prev, `[Success] ${val} inserted as root node.`]);
      cleanup();
      return;
    }

    let current = tree;
    let parent = null;
    let found = false;

    while (current) {
      if (isCancelledRef.current) return cleanup();
      await checkPause();
      
      const currentValue = current.value;
      highlightLine("insert", "check_null");
      setStatus(`Checking node ${currentValue}...`);
      setTree(prev => updateNodeByValue(prev, currentValue, 'visiting'));
      await sleep(speed);

      if (currentValue === val) {
        setStatus(`Value ${val} already exists in the BST.`);
        setTree(prev => updateNodeByValue(prev, currentValue, 'found'));
        setExecutionLog(prev => [...prev, `[Duplicate] ${val} already exists. Aborted insert.`]);
        found = true;
        break;
      }
      
      parent = current;
      setTree(prev => updateNodeByValue(prev, currentValue, 'default'));
      
      if (val < currentValue) {
        highlightLine("insert", "recurse_left");
        current = current.left;
      } else {
        highlightLine("insert", "recurse_right");
        current = current.right;
      }
    }
    
    if (found) return cleanup();
    if (isCancelledRef.current) return cleanup();

    setStatus(`Inserting ${val} as child of node ${parent.value}.`);
    setTree(prev => updateNodeByValue(prev, parent.value, 'pre-op'));
    await sleep(speed);

    const insertNode = (node) => {
      if (!node) return null;
      if (node.id === parent.id) {
        let newNodeWithChild = { ...node, state: 'default' };
        if (val < parent.value) {
          newNodeWithChild.left = newNode;
        } else {
          newNodeWithChild.right = newNode;
        }
        return newNodeWithChild;
      }
      let newNodeCopy = { ...node };
      if (val < node.value) {
        newNodeCopy.left = insertNode(node.left);
      } else {
        newNodeCopy.right = insertNode(node.right);
      }
      return newNodeCopy;
    };
    
    setTree(prev => insertNode(prev));
    setExecutionLog(prev => [...prev, `[Success] Connected child ${val} under parent ${parent.value}.`]);
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
    setExecutionLog(prev => [...prev, `--- Initiating Recursive Search for Target: ${val} ---`]);

    const pushStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => [...prev, { from: fromId, to: toId }]);
    };

    const popStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => prev.filter(e => !(e.from === fromId && e.to === toId)));
      setBacktrackEdge({ from: toId, to: fromId }); // Flows upwards (child to parent) in red
    };

    const searchRecursive = async (node, parentId = null) => {
      if (isCancelledRef.current) return null;
      await checkPause();

      // Visualize descent (winding the call stack) - glowing green dotted trace
      if (parentId) {
        pushStackSegment(parentId, node.id);
        setStatus(`Recursive descent call: searching node ${node.value} for target ${val}.`);
        await sleep(speed);
      }

      highlightLine("search", "check_target");
      setStatus(`Checking if current node ${node.value} matches target ${val}...`);
      setTree(prev => updateNodeByValue(prev, node.value, 'visiting'));
      await sleep(speed);

      if (node.value === val) {
        setStatus(`Target ${val} found!`);
        setTree(prev => updateNodeByValue(prev, node.value, 'found'));
        setExecutionLog(prev => [...prev, `[Success] Target ${val} found successfully.`]);
        await sleep(speed * 1.5);
        
        if (parentId) {
          popStackSegment(parentId, node.id);
          setStatus(`Returning true up the stack. (Call Stack Unwinding)`);
          await sleep(speed);
          setBacktrackEdge(null);
        }
        return node;
      }

      setTree(prev => updateNodeByValue(prev, node.value, 'default'));

      let foundResult = null;
      if (val < node.value) {
        highlightLine("search", "recurse_left");
        if (node.left) {
          foundResult = await searchRecursive(node.left, node.id);
        } else {
          setStatus(`No left child. Node ${node.value} is greater than ${val}, target not found.`);
          await sleep(speed);
        }
      } else {
        highlightLine("search", "recurse_right");
        if (node.right) {
          foundResult = await searchRecursive(node.right, node.id);
        } else {
          setStatus(`No right child. Node ${node.value} is smaller than ${val}, target not found.`);
          await sleep(speed);
        }
      }

      // Visualize ascent (unwinding stack frame on return statement) - flowing back up in red
      if (parentId && !isCancelledRef.current) {
        popStackSegment(parentId, node.id);
        setStatus(`Returning from recursive search frame of node ${node.value}. (Call Stack Unwinding)`);
        await sleep(speed);
        setBacktrackEdge(null);
      }

      return foundResult;
    };

    const searchResult = await searchRecursive(tree);
    if (!searchResult && !isCancelledRef.current) {
      setStatus(`Recursive search complete. Target value ${val} is not present in the tree.`);
      setExecutionLog(prev => [...prev, `[Search Failed] Target ${val} not found.`]);
    }
    cleanup();
  };

  const handleDelete = async () => {
    const val = getVal();
    if (val === null) return;
    
    setError(null);
    setIsVisualizing(true);
    setActiveConcept("delete");
    setExecutionLog(prev => [...prev, `[Delete] Requesting deletion of: ${val}`]);
    
    const findMin = (node) => {
      let current = node;
      while (current && current.left) {
        current = current.left;
      }
      return current;
    };

    const deleteRecursive = async (node, value) => {
      if (isCancelledRef.current) return node;
      if (!node) {
        setStatus(`Value ${value} not found.`);
        return null;
      }
      
      await checkPause();
      highlightLine("delete", "check_null");
      setStatus(`Searching for ${value}... checking node ${node.value}`);
      setTree(prev => updateNodeByValue(prev, node.value, 'visiting'));
      await sleep(speed);

      if (value < node.value) {
        highlightLine("delete", "recurse_left");
        setTree(prev => updateNodeByValue(prev, node.value, 'default'));
        const newLeft = await deleteRecursive(node.left, value);
        return { ...node, left: newLeft };
      } else if (value > node.value) {
        highlightLine("delete", "recurse_right");
        setTree(prev => updateNodeByValue(prev, node.value, 'default'));
        const newRight = await deleteRecursive(node.right, value);
        return { ...node, right: newRight };
      } else {
        setStatus(`Found node ${value}. Preparing delete process.`);
        setTree(prev => updateNodeByValue(prev, node.value, 'deleting'));
        await sleep(speed);

        if (!node.left && !node.right) {
          highlightLine("delete", "leaf");
          setStatus(`Node ${value} is a leaf node. Freeing space.`);
          await sleep(speed);
          setExecutionLog(prev => [...prev, `[Delete] Removed leaf node ${value}.`]);
          return null;
        }
        
        if (!node.left) {
          highlightLine("delete", "one_child");
          setStatus(`Node ${value} has 1 right child. Rewiring child node up.`);
          await sleep(speed);
          setExecutionLog(prev => [...prev, `[Delete] Removed node ${value}, promoted right child.`]);
          return node.right;
        }
        if (!node.right) {
          highlightLine("delete", "one_child");
          setStatus(`Node ${value} has 1 left child. Rewiring child node up.`);
          await sleep(speed);
          setExecutionLog(prev => [...prev, `[Delete] Removed node ${value}, promoted left child.`]);
          return node.left;
        }

        highlightLine("delete", "find_min");
        setStatus(`Node ${value} has 2 children. Searching for in-order successor...`);
        const successor = findMin(node.right);
        
        setTree(prev => updateNodeByValue(prev, successor.value, 'pre-op'));
        highlightLine("delete", "copy_val");
        setStatus(`In-order successor is ${successor.value}. Overriding current value.`);
        await sleep(speed);

        const newNode = { ...node, value: successor.value, state: 'default' };
        highlightLine("delete", "delete_min");
        setStatus(`Recursively deleting original successor node ${successor.value}...`);
        newNode.right = await deleteRecursive(node.right, successor.value);
        
        setExecutionLog(prev => [...prev, `[Delete] Replaced node ${value} with successor ${successor.value}.`]);
        return newNode;
      }
    };

    const newTree = await deleteRecursive(tree, val);
    if (!isCancelledRef.current) {
      setTree(newTree);
    }
    cleanup();
  };

  const handleTraversal = async (mode) => {
    if (!tree) {
      setError("Cannot traverse an empty tree.");
      return;
    }
    setError(null);
    setIsVisualizing(true);
    setActiveConcept(mode);
    setCallStackEdges([]); // Clear active call stack traces
    setBacktrackEdge(null); // Clear backtrack markers
    setExecutionLog(prev => [...prev, `--- Starting ${mode.toUpperCase()} Traversal ---`]);
    
    let visitedPath = [];

    // Helper functions to visual descent and backtrack on actual tree branches
    const pushStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => [...prev, { from: fromId, to: toId }]);
    };

    const popStackSegment = (fromId, toId) => {
      setCallStackEdges(prev => prev.filter(e => !(e.from === fromId && e.to === toId)));
      setBacktrackEdge({ from: toId, to: fromId }); // Flows upwards (child to parent) in red
    };

    const traverse = async (node, parentId = null) => {
      if (!node || isCancelledRef.current) return;
      await checkPause();

      // Visualize Descent (Winding Call Stack) - flowing down along structural branch
      if (parentId) {
        pushStackSegment(parentId, node.id);
        setStatus(`Recursive descent call to node ${node.value}. (Call Stack Expanded)`);
        await sleep(speed);
      }

      if (mode === 'preorder') {
        highlightLine("preorder", "visit");
        visitedPath.push(node.value);
        setStatus(`Visiting node ${node.value}. Path: [ ${visitedPath.join(' -> ')} ]`);
        setExecutionLog(prev => [...prev, `[Visit] Node: ${node.value}`]);
        setTree(prev => updateNodeByValue(prev, node.value, 'found'));
        await sleep(speed);

        highlightLine("preorder", "left");
        await traverse(node.left, node.id);

        highlightLine("preorder", "right");
        await traverse(node.right, node.id);
      } 
      else if (mode === 'inorder') {
        highlightLine("inorder", "left");
        await traverse(node.left, node.id);

        await checkPause();
        highlightLine("inorder", "visit");
        visitedPath.push(node.value);
        setStatus(`Visiting node ${node.value}. Path: [ ${visitedPath.join(' -> ')} ]`);
        setExecutionLog(prev => [...prev, `[Visit] Node: ${node.value}`]);
        setTree(prev => updateNodeByValue(prev, node.value, 'found'));
        await sleep(speed);

        highlightLine("inorder", "right");
        await traverse(node.right, node.id);
      } 
      else if (mode === 'postorder') {
        highlightLine("postorder", "left");
        await traverse(node.left, node.id);

        highlightLine("postorder", "right");
        await traverse(node.right, node.id);

        await checkPause();
        highlightLine("postorder", "visit");
        visitedPath.push(node.value);
        setStatus(`Visiting node ${node.value}. Path: [ ${visitedPath.join(' -> ')} ]`);
        setExecutionLog(prev => [...prev, `[Visit] Node: ${node.value}`]);
        setTree(prev => updateNodeByValue(prev, node.value, 'found'));
        await sleep(speed);
      }

      // Visualize Ascent/Backtrack (Unwinding Stack Frame) - flowing back up
      if (parentId && !isCancelledRef.current) {
        popStackSegment(parentId, node.id);
        setStatus(`Returning from recursive call of node ${node.value}. (Stack Frame Unwound)`);
        await sleep(speed);
        setBacktrackEdge(null);
      }
    };

    await traverse(tree);
    if (!isCancelledRef.current) {
      setStatus(`Traversal completed: [ ${visitedPath.join(' -> ')} ]`);
      setExecutionLog(prev => [...prev, `[Completed] Traversal Path: ${visitedPath.join(', ')}`]);
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
    setStatus("Tree is empty. Insert a node to begin.");
    setHighlightLineNum(-1);
    setExecutionLog([]);
    setCallStackEdges([]); // Reset segment stacks
    setBacktrackEdge(null); // Reset backtracks
    
    setTimeout(() => {
      isCancelledRef.current = false;
    }, 100);
  };
  
  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    pausedRef.current = newPausedState;
    if (newPausedState) {
      setExecutionLog(prev => [...prev, "[Pause] Visualizer paused."]);
    } else {
      setExecutionLog(prev => [...prev, "[Resume] Visualizer continuing..."]);
    }
  };

  const codeLines = codeSnippets[activeConcept][language].trim().split('\n');
  
  const statusColor = status.includes("Found") || status.includes("completed")
    ? "status-found"
    : status.includes("not found")
    ? "status-not-found"
    : status.includes("Paused")
    ? "status-paused"
    : "status-default";

  const { nodesList, edgesList } = getLayoutElements(tree);

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <GitFork size={30} />
          BST
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
          <button onClick={handleSearch} disabled={isVisualizing || !tree} className="btn btn-cyan">
            <Search size={16} /> Search Target
          </button>
        </div>
        
        {/* --- Traversal Actions --- */}
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
          <label>Traversals</label>
          <div className="actions-grid-three">
            <button 
              onClick={() => handleTraversal('preorder')} 
              disabled={isVisualizing || !tree} 
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.25rem' }}
              title="Pre-order traversal (Root, Left, Right)"
            >
              Pre-Order
            </button>
            <button 
              onClick={() => handleTraversal('inorder')} 
              disabled={isVisualizing || !tree} 
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.25rem' }}
              title="In-order traversal (Left, Root, Right)"
            >
              In-Order
            </button>
            <button 
              onClick={() => handleTraversal('postorder')} 
              disabled={isVisualizing || !tree} 
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.25rem' }}
              title="Post-order traversal (Left, Right, Root)"
            >
              Post-Order
            </button>
          </div>
        </div>
        
        <hr style={{borderColor: 'var(--border-gray-700)', margin: '1.25rem 0'}} />

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
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
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
          
          {/* SVG Overlay representing the direct parent-child branches */}
          <div className="visualization-boxes">
            {tree === null && (
              <span style={{color: 'var(--text-gray-500)', margin: 'auto'}}>
                Tree is empty. Insert nodes to build the structure.
              </span>
            )}
            
            {tree !== null && (
              <>
                {/* SVG connection overlay with direct diagonal lines matching image_eed3d6.png */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  style={{ zIndex: 0 }}
                >
                  {edgesList.map((edge, idx) => {
                    // Check if this branch is currently part of the active call stack (green descent)
                    const isDescentActive = callStackEdges.some(
                      s => (s.from === edge.from.id && s.to === edge.to.id)
                    );

                    // Check if this branch is currently backtracking (red ascent)
                    const isBacktrackActive = backtrackEdge && (
                      (backtrackEdge.from === edge.from.id && backtrackEdge.to === edge.to.id) ||
                      (backtrackEdge.from === edge.to.id && backtrackEdge.to === edge.from.id)
                    );

                    return (
                      <g key={idx}>
                        {/* Static connection branch verbatim to image_eed3d6.png */}
                        <line
                          x1={`${edge.from.x}%`}
                          y1={`${edge.from.y}px`}
                          x2={`${edge.to.x}%`}
                          y2={`${edge.to.y}px`}
                          stroke="#8cc07e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          style={{ transition: 'all 0.3s' }}
                        />

                        {/* GREEN descent dotted line: moving downward when executing a call */}
                        {isDescentActive && (
                          <line
                            x1={`${edge.from.x}%`}
                            y1={`${edge.from.y}px`}
                            x2={`${edge.to.x}%`}
                            y2={`${edge.to.y}px`}
                            className="traversal-descent-line"
                          />
                        )}

                        {/* RED ascent backtrack dotted line: moving upward on return statement */}
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

                {/* Absolutey positioned circular nodes */}
                {nodesList.map((node) => (
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
                  </div>
                ))}
              </>
            )}
          </div>
          
        </section>

        {/* --- Lower Content Area (Code & Log) --- */}
        <div className="lower-content-area">
          {/* --- Code Area --- */}
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
                        ${(line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('def ')) ? 'comment' : ''}
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