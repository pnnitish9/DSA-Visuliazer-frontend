import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search, ChevronRight, ChevronLeft, Award } from 'lucide-react';

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

    /* --- Metrics Row Above Viewport --- */
    .metrics-top-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    @media (min-width: 640px) {
      .metrics-top-row { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    }

    .metric-card-box {
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
      padding: 0.75rem 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .metric-card-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-gray-400);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .metric-card-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--cyan-400);
    }

    /* --- Printed Sequence Badge Row --- */
    .print-sequence-container {
      background-color: var(--bg-dark-850);
      border: 1px dashed var(--cyan-500);
      border-radius: 0.5rem;
      padding: 0.75rem;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .print-sequence-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-gray-300);
      text-transform: uppercase;
    }
    .print-sequence-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      align-items: center;
      min-height: 2rem;
    }
    .print-badge {
      background-color: var(--green-600);
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0.25rem 0.6rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      animation: popBadge 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popBadge {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .print-arrow {
      color: var(--cyan-400);
      font-weight: bold;
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

    /* --- Responsive Dynamic Viewport Window --- */
    .visualization-viewport {
      position: relative;
      background-color: rgba(5, 5, 10, 0.4);
      border-radius: 0.5rem;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      overflow: auto;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .visualization-svg-canvas {
      min-width: 600px;
      width: 100%;
      height: 400px; /* Base height, scaled programmatically if deep */
      transition: height 0.4s ease;
    }

    /* --- Circle Nodes --- */
    .tree-circle-node-svg {
      cursor: pointer;
    }
    .tree-circle-node-svg circle {
      transition: fill 0.3s, stroke 0.3s, r 0.3s;
      stroke-width: 2.5;
    }
    .tree-circle-node-svg text {
      font-size: 14px;
      font-weight: bold;
      fill: #385723;
      user-select: none;
      pointer-events: none;
      transition: fill 0.3s;
    }

    /* Circle colors from image_eed3d6.png */
    .node-default { fill: #e2f0d9; stroke: #8cc07e; }
    .node-visiting { fill: #fef08a; stroke: #ca8a04; }
    .node-visiting text { fill: #854d0e !important; }
    .node-pre-op { fill: #fed7aa; stroke: #ea580c; }
    .node-pre-op text { fill: #7c2d12 !important; }
    .node-found { fill: #4ade80; stroke: #16a34a; }
    .node-found text { fill: #ffffff !important; }
    .node-deleting { fill: #fca5a5; stroke: #dc2626; }
    .node-deleting text { fill: #7f1d1d !important; }

    /* Highlights for property metrics */
    .node-highlight-path { fill: #a855f7; stroke: #9333ea; }
    .node-highlight-path text { fill: #ffffff !important; }
    .node-highlight-boundary { fill: #ec4899; stroke: #db2777; }
    .node-highlight-boundary text { fill: #ffffff !important; }

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

    /* --- Verbatim Complexity Bar Grid (image_0c0bc2.png) --- */
    .complexity-grid-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    @media (min-width: 640px) {
      .complexity-grid-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .complexity-grid-row { grid-template-columns: repeat(4, 1fr); }
    }

    .complexity-card {
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .complexity-card-header {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-gray-400);
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .complexity-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-gray-200);
      margin-bottom: 0.5rem;
    }
    .complexity-card-math {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--cyan-400);
      font-family: 'Fira Code', monospace;
    }

    /* --- Code Tracker / Execution Log Grid --- */
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
      background-color: rgba(6, 182, 212, 0.25);
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
  bst: {
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
      c: `
struct node* insert(struct node* node, int key) {
    if (node == NULL) return newNode(key);
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
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
      java: `
Node search(Node root, int key) {
    if (root == null || root.key == key)
        return root;
    if (root.key > key)
        return search(root.left, key);
    return search(root.right, key);
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
      c: `
struct node* search(struct node* root, int key) {
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
      `.trim()
    }
  },
  bt: {
    insert: {
      python: `
def insert_bt(root, key):
    new_node = Node(key)
    if root is None:
        return new_node
    queue = [root]
    while queue:
        temp = queue.pop(0)
        if temp.left is None:
            temp.left = new_node
            break
        else:
            queue.append(temp.left)
        if temp.right is None:
            temp.right = new_node
            break
        else:
            queue.append(temp.right)
    return root
      `.trim(),
      java: `
void insertBT(Node root, int key) {
    Node newNode = new Node(key);
    Queue<Node> q = new LinkedList<>();
    q.add(root);
    while(!q.isEmpty()) {
        Node temp = q.poll();
        if (temp.left == null) { temp.left = newNode; break; }
        else q.add(temp.left);
        if (temp.right == null) { temp.right = newNode; break; }
        else q.add(temp.right);
    }
}
      `.trim(),
      cpp: `
void insert_bt(Node* root, int key) {
    Node* newNode = new Node(key);
    queue<Node*> q;
    q.push(root);
    while(!q.empty()) {
        Node* temp = q.front(); q.pop();
        if (!temp->left) { temp->left = newNode; break; }
        else q.push(temp->left);
        if (!temp->right) { temp->right = newNode; break; }
        else q.push(temp->right);
    }
}
      `.trim(),
      c: `
void insert_bt(struct node* root, int key) {
    struct node* newNode = createNode(key);
    struct node* q[100]; int f=0, r=0;
    q[r++] = root;
    while(f < r) {
        struct node* temp = q[f++];
        if (!temp->left) { temp->left = newNode; break; }
        else q[r++] = temp->left;
        if (!temp->right) { temp->right = newNode; break; }
        else q[r++] = temp->right;
    }
}
      `.trim()
    },
    search: {
      python: `
def search_bt(root, key):
    if root is None or root.val == key:
        return root
    left_res = search_bt(root.left, key)
    if left_res:
        return left_res
    return search_bt(root.right, key)
      `.trim(),
      java: `
Node searchBT(Node root, int key) {
    if (root == null || root.key == key)
        return root;
    Node left = searchBT(root.left, key);
    if (left != null) return left;
    return searchBT(root.right, key);
}
      `.trim(),
      cpp: `
Node* search_bt(Node* root, int key) {
    if (root == NULL || root->data == key)
        return root;
    Node* left = search_bt(root->left, key);
    if (left != NULL) return left;
    return search_bt(root->right, key);
}
      `.trim(),
      c: `
struct node* search_bt(struct node* root, int key) {
    if (root == NULL || root->key == key)
        return root;
    struct node* left = search_bt(root->left, key);
    if (left != NULL) return left;
    return search_bt(root->right, key);
}
      `.trim()
    },
    delete: {
      python: `
def delete_bt(root, key):
    target = find_node(root, key)
    deepest = find_deepest(root)
    if target and deepest:
        target.val = deepest.val
        delete_deepest_node(root, deepest)
    return root
      `.trim(),
      java: `
void deleteBT(Node root, int key) {
    Node target = findNode(root, key);
    Node deepest = getDeepest(root);
    if (target != null && deepest != null) {
        target.key = deepest.key;
        deleteDeepestNode(root, deepest);
    }
}
      `.trim(),
      cpp: `
void delete_bt(Node* root, int key) {
    Node* target = findNode(root, key);
    Node* deepest = getDeepest(root);
    if (target && deepest) {
        target->data = deepest->data;
        deleteDeepest(root, deepest);
    }
}
      `.trim(),
      c: `
void delete_bt(struct node* root, int key) {
    struct node* target = find(root, key);
    struct node* deepest = getDeepest(root);
    if (target && deepest) {
        target->key = deepest->key;
        freeDeepest(root, deepest);
    }
}
      `.trim()
    }
  },
  inorder: {
    python: `
def inorder(root):
    if root:
        inorder(root.left)
        print(root.val) # Visit
        inorder(root.right)
    `.trim(),
    java: `
void inorder(Node root) {
    if (root != null) {
        inorder(root.left);
        System.out.print(root.key + " "); // Visit
        inorder(root.right);
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
    c: `
void inorder(struct node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->key); // Visit
        inorder(root->right);
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
    java: `
void preorder(Node root) {
    if (root != null) {
        System.out.print(root.key + " "); // Visit
        preorder(root.left);
        preorder(root.right);
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
    c: `
void preorder(struct node* root) {
    if (root != NULL) {
        printf("%d ", root->key); // Visit
        preorder(root->left);
        preorder(root->right);
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
    java: `
void postorder(Node root) {
    if (root != null) {
        postorder(root.left);
        postorder(root.right);
        System.out.print(root.key + " "); // Visit
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
    c: `
void postorder(struct node* root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->key); // Visit
    }
}
    `.trim()
  },
  height: {
    python: `
def get_height(root):
    if root is None:
        return -1
    left_h = get_height(root.left)
    right_h = get_height(root.right)
    return max(left_h, right_h) + 1
    `.trim(),
    java: `
int getHeight(Node root) {
    if (root == null) return -1;
    int leftH = getHeight(root.left);
    int rightH = getHeight(root.right);
    return Math.max(leftH, rightH) + 1;
}
    `.trim(),
    cpp: `
int getHeight(Node* root) {
    if (root == NULL) return -1;
    int leftH = getHeight(root->left);
    int rightH = getHeight(root->right);
    return max(leftH, rightH) + 1;
}
    `.trim(),
    c: `
int getHeight(struct node* root) {
    if (root == NULL) return -1;
    int leftH = getHeight(root->left);
    int rightH = getHeight(root->right);
    return (leftH > rightH ? leftH : rightH) + 1;
}
    `.trim()
  },
  diameter: {
    python: `
def get_diameter(root):
    max_d = 0
    def height(node):
        nonlocal max_d
        if not node: return -1
        lh = height(node.left)
        rh = height(node.right)
        max_d = max(max_d, lh + rh + 2)
        return max(lh, rh) + 1
    height(root)
    return max_d
    `.trim(),
    java: `
class Result { int val = 0; }
int getDiameter(Node root) {
    Result res = new Result();
    height(root, res);
    return res.val;
}
int height(Node node, Result res) {
    if (node == null) return -1;
    int lh = height(node.left, res);
    int rh = height(node.right, res);
    res.val = Math.max(res.val, lh + rh + 2);
    return Math.max(lh, rh) + 1;
}
    `.trim(),
    cpp: `
int height(Node* node, int& max_d) {
    if (!node) return -1;
    int lh = height(node->left, max_d);
    int rh = height(node->right, max_d);
    max_d = max(max_d, lh + rh + 2);
    return max(lh, rh) + 1;
}
int getDiameter(Node* root) {
    int max_d = 0;
    height(root, max_d);
    return max_d;
}
    `.trim(),
    c: `
int height(struct node* node, int* max_d) {
    if (!node) return -1;
    int lh = height(node->left, max_d);
    int rh = height(node->right, max_d);
    int current_d = lh + rh + 2;
    if (current_d > *max_d) *max_d = current_d;
    return (lh > rh ? lh : rh) + 1;
}
int getDiameter(struct node* root) {
    int max_d = 0;
    height(root, &max_d);
    return max_d;
}
    `.trim()
  }
};

const LINE_MAPS = {
  bst: {
    insert: {
      python: { check_null: 2, recurse_left: 5, recurse_right: 7 },
      java: { check_null: 2, recurse_left: 7, recurse_right: 9 },
      cpp: { check_null: 2, recurse_left: 4, recurse_right: 6 },
      c: { check_null: 2, recurse_left: 4, recurse_right: 6 }
    },
    search: {
      python: { check_target: 2, recurse_left: 4, recurse_right: 5 },
      java: { check_target: 2, recurse_left: 5, recurse_right: 7 },
      cpp: { check_target: 2, recurse_left: 6, recurse_right: 4 },
      c: { check_target: 2, recurse_left: 6, recurse_right: 4 }
    },
    delete: {
      python: { check_null: 2, recurse_left: 5, recurse_right: 7, leaf: 10, one_child: 10, find_min: 13, copy_val: 14, delete_min: 15 },
      java: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 8, one_child: 8, find_min: 10, copy_val: 11, delete_min: 12 },
      cpp: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 10, one_child: 10, find_min: 15, copy_val: 16, delete_min: 17 },
      c: { check_null: 2, recurse_left: 4, recurse_right: 6, leaf: 10, one_child: 10, find_min: 15, copy_val: 16, delete_min: 17 }
    }
  },
  bt: {
    insert: {
      python: { check_null: 3, loop_cond: 7, recurse_left: 9, recurse_right: 14 },
      java: { check_null: 4, loop_cond: 5, recurse_left: 7, recurse_right: 9 },
      cpp: { check_null: 4, loop_cond: 5, recurse_left: 7, recurse_right: 9 },
      c: { check_null: 5, loop_cond: 6, recurse_left: 8, recurse_right: 10 }
    },
    search: {
      python: { check_target: 2, recurse_left: 4, recurse_right: 6 },
      java: { check_target: 2, recurse_left: 4, recurse_right: 6 },
      cpp: { check_target: 2, recurse_left: 4, recurse_right: 6 },
      c: { check_target: 2, recurse_left: 4, recurse_right: 6 }
    },
    delete: {
      python: { check_null: 2, recurse_left: 4, recurse_right: 5 },
      java: { check_null: 2, recurse_left: 4, recurse_right: 5 },
      cpp: { check_null: 2, recurse_left: 4, recurse_right: 5 },
      c: { check_null: 2, recurse_left: 4, recurse_right: 5 }
    }
  },
  inorder: {
    python: { cond: 2, left: 3, visit: 4, right: 5 },
    java: { cond: 2, left: 3, visit: 4, right: 5 },
    cpp: { cond: 2, left: 3, visit: 4, right: 5 },
    c: { cond: 2, left: 3, visit: 4, right: 5 }
  },
  preorder: {
    python: { cond: 2, visit: 3, left: 4, right: 5 },
    java: { cond: 2, visit: 3, left: 4, right: 5 },
    cpp: { cond: 2, visit: 3, left: 4, right: 5 },
    c: { cond: 2, visit: 3, left: 4, right: 5 }
  },
  postorder: {
    python: { cond: 2, left: 3, right: 4, visit: 5 },
    java: { cond: 2, left: 3, right: 4, visit: 5 },
    cpp: { cond: 2, left: 3, right: 4, visit: 5 },
    c: { cond: 2, left: 3, right: 4, visit: 5 }
  },
  height: {
    python: { cond: 2, left: 4, right: 5, visit: 6 },
    java: { cond: 2, left: 3, right: 4, visit: 5 },
    cpp: { cond: 2, left: 3, right: 4, visit: 5 },
    c: { cond: 2, left: 3, right: 4, visit: 5 }
  },
  diameter: {
    python: { cond: 5, left: 7, right: 8, visit: 9 },
    java: { cond: 10, left: 11, right: 12, visit: 13 },
    cpp: { cond: 2, left: 3, right: 4, visit: 5 },
    c: { cond: 2, left: 3, right: 4, visit: 5 }
  }
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
      assignCoords(node.left, x - dx, y + 80, dx * 0.45);
    }
    if (node.right) {
      edgesList.push({ from: node, to: node.right });
      assignCoords(node.right, x + dx, y + 80, dx * 0.45);
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

export default function App() {
  const [tree, setTree] = useState(null);
  const [value, setValue] = useState("");
  
  const [isBST, setIsBST] = useState(false);
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(600);
  const [status, setStatus] = useState("Tree is empty. Insert a node to begin.");
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [error, setError] = useState(null);
  
  // Timeline Playback Engine Variables
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeConcept, setActiveConcept] = useState("insert");

  const isVisualizing = steps.length > 0;
  const timerRef = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [steps, currentStepIdx]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev + 1 < steps.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const getVal = () => {
    const num = parseInt(value);
    if (isNaN(num)) {
      return null;
    }
    return num;
  };

  const buildSimulationTimeline = (initialTree, conceptName, executionWorker) => {
    const timeline = [];
    let currentTreeState = resetAllStates(initialTree);
    const log = [];

    const pushStep = ({ treeState, highlight, statusText, edges = [], backtrack = null, visits = 0, maxStack = 0, printed = [], result = null }) => {
      timeline.push({
        tree: JSON.parse(JSON.stringify(treeState)),
        highlight,
        statusText,
        edges,
        backtrack,
        visits,
        maxStack,
        printed: [...printed],
        logs: [...log],
        result
      });
    };

    const addLog = (msg) => {
      log.push(msg);
    };

    executionWorker({ currentTreeState, pushStep, addLog });

    if (timeline.length === 0) return;

    setSteps(timeline);
    setCurrentStepIdx(0);
    
    // Automatically perform and start playback if Height or Diameter requested
    const autoRun = ["height", "diameter"].includes(conceptName);
    setIsPlaying(autoRun);
    
    setActiveConcept(conceptName);
    setStatus(timeline[0]?.statusText || "Loaded.");
  };

  const handleInsert = () => {
    const val = getVal();
    if (val === null) {
      setError("Please enter a valid node key first.");
      return;
    }
    setError(null);
    setValue(""); // Empty field automatically

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const newNode = { value: val, id: uniqueId, left: null, right: null, state: 'found' };

    if (!tree) {
      buildSimulationTimeline(null, "insert", ({ pushStep, addLog }) => {
        addLog(`[Insert] Root is empty. Creating new root node: ${val}`);
        pushStep({
          treeState: newNode,
          highlight: "check_null",
          statusText: `Tree was empty. Created Root node with value ${val}.`,
          visits: 1,
          maxStack: 1
        });
      });
      setTree(newNode);
      return;
    }

    buildSimulationTimeline(tree, "insert", ({ currentTreeState, pushStep, addLog }) => {
      addLog(`[Insert] Preparing to add node ${val}...`);
      let visitsCount = 0;
      let activeStack = 0;

      if (isBST) {
        let current = currentTreeState;
        let parent = null;
        let duplicateFound = false;

        while (current) {
          visitsCount++;
          activeStack++;
          const currentVal = current.value;
          current.state = 'visiting';
          addLog(`[BST Visit] Comparing node ${currentVal} with target ${val}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "check_null",
            statusText: `Visiting node ${currentVal}...`,
            visits: visitsCount,
            maxStack: activeStack
          });

          if (currentVal === val) {
            current.state = 'found';
            duplicateFound = true;
            addLog(`[BST Duplicate] Node ${val} already exists. Aborting.`);
            pushStep({
              treeState: currentTreeState,
              highlight: "check_null",
              statusText: `Node ${val} already exists in BST!`,
              visits: visitsCount,
              maxStack: activeStack
            });
            break;
          }

          parent = current;
          current.state = 'default';

          if (val < currentVal) {
            current = current.left;
            pushStep({
              treeState: currentTreeState,
              highlight: "recurse_left",
              statusText: `Traversing to the left child since ${val} < ${currentVal}`,
              visits: visitsCount,
              maxStack: activeStack
            });
          } else {
            current = current.right;
            pushStep({
              treeState: currentTreeState,
              highlight: "recurse_right",
              statusText: `Traversing to the right child since ${val} > ${currentVal}`,
              visits: visitsCount,
              maxStack: activeStack
            });
          }
        }

        if (!duplicateFound) {
          addLog(`[BST Insert] Attaching new child ${val} under parent ${parent.value}`);
          const attachNode = (node) => {
            if (!node) return null;
            if (node.id === parent.id) {
              const clone = { ...node, state: 'pre-op' };
              if (val < parent.value) clone.left = newNode;
              else clone.right = newNode;
              return clone;
            }
            return {
              ...node,
              left: attachNode(node.left),
              right: attachNode(node.right)
            };
          };

          const finalTree = attachNode(currentTreeState);
          pushStep({
            treeState: finalTree,
            highlight: "check_null",
            statusText: `Successfully attached child ${val} under parent ${parent.value}`,
            visits: visitsCount,
            maxStack: activeStack
          });
          
          setTimeout(() => setTree(resetAllStates(finalTree)), 50);
        }
      } else {
        let queue = [currentTreeState];
        let parentTarget = null;
        let side = 'left';

        while (queue.length > 0) {
          visitsCount++;
          let curr = queue.shift();
          curr.state = 'visiting';
          pushStep({
            treeState: currentTreeState,
            highlight: "loop_cond",
            statusText: `BFT Complete binary lookup: checking slots for node ${curr.value}`,
            visits: visitsCount,
            maxStack: Math.max(1, queue.length)
          });

          if (!curr.left) {
            parentTarget = curr;
            side = 'left';
            break;
          } else {
            queue.push(curr.left);
          }

          if (!curr.right) {
            parentTarget = curr;
            side = 'right';
            break;
          } else {
            queue.push(curr.right);
          }
          curr.state = 'default';
        }

        const attachNodeBT = (node) => {
          if (!node) return null;
          if (node.id === parentTarget.id) {
            const clone = { ...node, state: 'pre-op' };
            if (side === 'left') clone.left = newNode;
            else clone.right = newNode;
            return clone;
          }
          return {
            ...node,
            left: attachNodeBT(node.left),
            right: attachNodeBT(node.right)
          };
        };

        const finalTree = attachNodeBT(currentTreeState);
        addLog(`[BT Level-Order] Connected ${val} to ${side} child of ${parentTarget.value}`);
        pushStep({
          treeState: finalTree,
          highlight: "recurse_left",
          statusText: `Attached ${val} to ${side} child slot of ${parentTarget.value}`,
          visits: visitsCount,
          maxStack: visitsCount
        });

        setTimeout(() => setTree(resetAllStates(finalTree)), 50);
      }
    });
  };

  const handleSearch = () => {
    const val = getVal();
    if (val === null || !tree) return;
    setValue(""); // Empty field automatically
    setError(null);

    buildSimulationTimeline(tree, "search", ({ currentTreeState, pushStep, addLog }) => {
      addLog(`[Search] Initiating search for target node: ${val}...`);
      let visitsCount = 0;
      let activeStack = 0;
      const callStackEdges = [];

      if (isBST) {
        const searchBST = (node, parentId = null) => {
          if (!node) return null;
          visitsCount++;
          activeStack++;
          node.state = 'visiting';

          if (parentId) callStackEdges.push({ from: parentId, to: node.id });
          addLog(`[Search Step] Visiting node ${node.value}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "check_target",
            statusText: `Comparing node ${node.value} with target ${val}`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack
          });

          if (node.value === val) {
            node.state = 'found';
            addLog(`[Search Success] Target ${val} found!`);
            pushStep({
              treeState: currentTreeState,
              highlight: "check_target",
              statusText: `Target ${val} found successfully at node!`,
              edges: [...callStackEdges],
              visits: visitsCount,
              maxStack: activeStack
            });
            return node;
          }

          node.state = 'default';
          let res = null;
          if (val < node.value) {
            pushStep({
              treeState: currentTreeState,
              highlight: "recurse_left",
              statusText: `Target ${val} < ${node.value}, descending left`,
              edges: [...callStackEdges],
              visits: visitsCount,
              maxStack: activeStack
            });
            res = searchBST(node.left, node.id);
          } else {
            pushStep({
              treeState: currentTreeState,
              highlight: "recurse_right",
              statusText: `Target ${val} > ${node.value}, descending right`,
              edges: [...callStackEdges],
              visits: visitsCount,
              maxStack: activeStack
            });
            res = searchBST(node.right, node.id);
          }

          if (parentId) {
            const edgeIndex = callStackEdges.findIndex(e => e.from === parentId && e.to === node.id);
            if (edgeIndex !== -1) callStackEdges.splice(edgeIndex, 1);
          }
          activeStack--;
          return res;
        };
        searchBST(currentTreeState);
      } else {
        const searchBT = (node, parentId = null) => {
          if (!node) return false;
          visitsCount++;
          activeStack++;
          node.state = 'visiting';

          if (parentId) callStackEdges.push({ from: parentId, to: node.id });
          addLog(`[DFS Search] Visiting node ${node.value}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "check_target",
            statusText: `DFS comparing node ${node.value} with target ${val}`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack
          });

          if (node.value === val) {
            node.state = 'found';
            addLog(`[Search Success] Target found at node ${val}`);
            pushStep({
              treeState: currentTreeState,
              highlight: "check_target",
              statusText: `Found target ${val}!`,
              edges: [...callStackEdges],
              visits: visitsCount,
              maxStack: activeStack
            });
            return true;
          }

          node.state = 'default';
          pushStep({
            treeState: currentTreeState,
            highlight: "recurse_left",
            statusText: `Target not at ${node.value}, searching left subtree`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack
          });

          let leftRes = searchBT(node.left, node.id);
          if (leftRes) return true;

          pushStep({
            treeState: currentTreeState,
            highlight: "recurse_right",
            statusText: `Target not in left subtree of ${node.value}, searching right subtree`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack
          });

          let rightRes = searchBT(node.right, node.id);
          if (rightRes) return true;

          if (parentId) {
            const edgeIndex = callStackEdges.findIndex(e => e.from === parentId && e.to === node.id);
            if (edgeIndex !== -1) callStackEdges.splice(edgeIndex, 1);
          }
          activeStack--;
          return false;
        };
        searchBT(currentTreeState);
      }
    });
  };

  const handleDelete = () => {
    const val = getVal();
    if (val === null || !tree) return;
    setValue(""); // Empty field automatically
    setError(null);

    buildSimulationTimeline(tree, "delete", ({ currentTreeState, pushStep, addLog }) => {
      addLog(`[Delete] Requesting deletion of node: ${val}...`);
      let visitsCount = 0;
      let activeStack = 0;

      if (isBST) {
        const findMin = (node) => {
          let curr = node;
          while (curr && curr.left) {
            curr = curr.left;
          }
          return curr;
        };

        const deleteNodeBST = (node, targetValue) => {
          if (!node) return null;
          visitsCount++;
          activeStack++;
          node.state = 'visiting';
          addLog(`[BST Delete] Traversing at node ${node.value}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "check_null",
            statusText: `Checking node ${node.value} for deletion...`,
            visits: visitsCount,
            maxStack: activeStack
          });

          if (targetValue < node.value) {
            node.state = 'default';
            pushStep({
              treeState: currentTreeState,
              highlight: "recurse_left",
              statusText: `Descending left since target ${targetValue} < ${node.value}`,
              visits: visitsCount,
              maxStack: activeStack
            });
            node.left = deleteNodeBST(node.left, targetValue);
          } else if (targetValue > node.value) {
            node.state = 'default';
            pushStep({
              treeState: currentTreeState,
              highlight: "recurse_right",
              statusText: `Descending right since target ${targetValue} > ${node.value}`,
              visits: visitsCount,
              maxStack: activeStack
            });
            node.right = deleteNodeBST(node.right, targetValue);
          } else {
            node.state = 'deleting';
            addLog(`[BST Match] Found target node ${node.value} to delete.`);
            pushStep({
              treeState: currentTreeState,
              highlight: "leaf",
              statusText: `Found target node ${node.value}! Evaluating children...`,
              visits: visitsCount,
              maxStack: activeStack
            });

            if (!node.left && !node.right) {
              addLog(`[Delete Case 1] Leaf node removed.`);
              pushStep({
                treeState: currentTreeState,
                highlight: "leaf",
                statusText: `Node is a leaf. Pruning node completely.`,
                visits: visitsCount,
                maxStack: activeStack
              });
              activeStack--;
              return null;
            }
            if (!node.left) {
              addLog(`[Delete Case 2] Single child (Right) promoted.`);
              pushStep({
                treeState: currentTreeState,
                highlight: "one_child",
                statusText: `Node has only right child. Promoting right child.`,
                visits: visitsCount,
                maxStack: activeStack
              });
              activeStack--;
              return node.right;
            }
            if (!node.right) {
              addLog(`[Delete Case 2] Single child (Left) promoted.`);
              pushStep({
                treeState: currentTreeState,
                highlight: "one_child",
                statusText: `Node has only left child. Promoting left child.`,
                visits: visitsCount,
                maxStack: activeStack
              });
              activeStack--;
              return node.left;
            }

            addLog(`[Delete Case 3] Two children. Finding in-order successor...`);
            const successor = findMin(node.right);
            node.state = 'deleting';
            pushStep({
              treeState: currentTreeState,
              highlight: "find_min",
              statusText: `Finding in-order successor (minimum value of right subtree)...`,
              visits: visitsCount,
              maxStack: activeStack
            });

            node.value = successor.value;
            node.state = 'pre-op';
            addLog(`[BST Successor] Replacing target value with successor value ${successor.value}`);
            pushStep({
              treeState: currentTreeState,
              highlight: "copy_val",
              statusText: `Replaced node value with successor: ${successor.value}`,
              visits: visitsCount,
              maxStack: activeStack
            });

            pushStep({
              treeState: currentTreeState,
              highlight: "delete_min",
              statusText: `Deleting original successor node ${successor.value} from right subtree...`,
              visits: visitsCount,
              maxStack: activeStack
            });
            node.right = deleteNodeBST(node.right, successor.value);
          }

          activeStack--;
          return node;
        };

        const finalTree = deleteNodeBST(currentTreeState, val);
        setTimeout(() => setTree(resetAllStates(finalTree)), 50);
      } else {
        let deepestNode = null;
        let targetNode = null;

        let queue = [{ node: currentTreeState, parent: null }];
        while (queue.length > 0) {
          visitsCount++;
          let currentItem = queue.shift();
          deepestNode = currentItem.node;

          if (currentItem.node.value === val) {
            targetNode = currentItem.node;
          }

          if (currentItem.node.left) {
            queue.push({ node: currentItem.node.left, parent: currentItem.node });
          }
          if (currentItem.node.right) {
            queue.push({ node: currentItem.node.right, parent: currentItem.node });
          }
        }

        if (!targetNode) {
          addLog(`[BT Delete] Node ${val} not found.`);
          pushStep({
            treeState: currentTreeState,
            highlight: "check_null",
            statusText: `Target node ${val} not found in BT!`,
            visits: visitsCount,
            maxStack: visitsCount
          });
          return;
        }

        targetNode.state = 'deleting';
        deepestNode.state = 'pre-op';
        addLog(`[BT Delete] Swapping target ${val} with deepest rightmost node ${deepestNode.value}`);
        pushStep({
          treeState: currentTreeState,
          highlight: "recurse_left",
          statusText: `Found target ${val}. Swapping with deepest node ${deepestNode.value}.`,
          visits: visitsCount,
          maxStack: visitsCount
        });

        const pruneDeepest = (node) => {
          if (!node) return null;
          if (node.id === deepestNode.id) return null;
          if (node.id === targetNode.id) {
            node.value = deepestNode.value;
            node.state = 'default';
          }
          node.left = pruneDeepest(node.left);
          node.right = pruneDeepest(node.right);
          return node;
        };

        if (currentTreeState.id === deepestNode.id) {
          pushStep({
            treeState: null,
            highlight: "check_null",
            statusText: `Cleared last remaining node. Tree is now empty.`,
            visits: visitsCount,
            maxStack: 1
          });
          setTimeout(() => setTree(null), 50);
        } else {
          const finalTree = pruneDeepest(currentTreeState);
          pushStep({
            treeState: finalTree,
            highlight: "recurse_right",
            statusText: `Swapped value and pruned deepest node ${deepestNode.value}`,
            visits: visitsCount,
            maxStack: visitsCount
          });
          setTimeout(() => setTree(resetAllStates(finalTree)), 50);
        }
      }
    });
  };

  const handleTraversal = (mode) => {
    if (!tree) return;
    setError(null);

    buildSimulationTimeline(tree, mode, ({ currentTreeState, pushStep, addLog }) => {
      addLog(`--- Starting ${mode.toUpperCase()} Traversal ---`);
      let visitsCount = 0;
      let activeStack = 0;
      const callStackEdges = [];
      const printedValues = [];

      const traverse = (node, parentId = null) => {
        if (!node) return;
        visitsCount++;
        activeStack++;
        node.state = 'visiting';

        if (parentId) callStackEdges.push({ from: parentId, to: node.id });
        addLog(`[Call Frame] Traversing node ${node.value}`);
        
        if (mode === 'preorder') {
          node.state = 'found';
          printedValues.push(node.value);
          addLog(`[Visit] Printing node ${node.value}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "visit",
            statusText: `PRE-ORDER Visit: printing root node ${node.value}`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack,
            printed: [...printedValues]
          });
        } else {
          pushStep({
            treeState: currentTreeState,
            highlight: "cond",
            statusText: `Recursive frame for node ${node.value}`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack,
            printed: [...printedValues]
          });
        }

        pushStep({
          treeState: currentTreeState,
          highlight: "left",
          statusText: `Navigating to left subtree of node ${node.value}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack,
          printed: [...printedValues]
        });
        traverse(node.left, node.id);

        if (mode === 'inorder') {
          node.state = 'found';
          printedValues.push(node.value);
          addLog(`[Visit] Printing node ${node.value}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "visit",
            statusText: `IN-ORDER Visit: printing node ${node.value}`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack,
            printed: [...printedValues]
          });
        }

        pushStep({
          treeState: currentTreeState,
          highlight: "right",
          statusText: `Navigating to right subtree of node ${node.value}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack,
          printed: [...printedValues]
        });
        traverse(node.right, node.id);

        if (mode === 'postorder') {
          node.state = 'found';
          printedValues.push(node.value);
          addLog(`[Visit] Printing node ${node.value}`);
          pushStep({
            treeState: currentTreeState,
            highlight: "visit",
            statusText: `POST-ORDER Visit: printing node ${node.value}`,
            edges: [...callStackEdges],
            visits: visitsCount,
            maxStack: activeStack,
            printed: [...printedValues]
          });
        }

        if (parentId) {
          const edgeIndex = callStackEdges.findIndex(e => e.from === parentId && e.to === node.id);
          if (edgeIndex !== -1) callStackEdges.splice(edgeIndex, 1);
        }
        activeStack--;
      };

      traverse(currentTreeState);
      addLog(`[Completed] ${mode.toUpperCase()} Traversal Complete.`);
    });
  };

  const handleHeight = () => {
    if (!tree) return;
    const targetVal = getVal();
    setValue(""); // Clear automatically
    setError(null);

    buildSimulationTimeline(tree, "height", ({ currentTreeState, pushStep, addLog }) => {
      let startNodeState = currentTreeState;
      let startValText = "absolute Root";

      if (targetVal !== null) {
        // Find the target node in the cloned tree
        const findNode = (n) => {
          if (!n) return null;
          if (n.value === targetVal) return n;
          return findNode(n.left) || findNode(n.right);
        };
        const foundNode = findNode(currentTreeState);
        if (!foundNode) {
          addLog(`[Height Error] Target node ${targetVal} not found in the tree.`);
          pushStep({
            treeState: currentTreeState,
            highlight: "cond",
            statusText: `Starting node ${targetVal} not found in the tree.`,
          });
          return;
        }
        startNodeState = foundNode;
        startValText = `Node [${targetVal}]`;
      }

      addLog(`[Height] Computing the Maximum Height starting from ${startValText} recursively...`);
      let visitsCount = 0;
      let activeStack = 0;
      const callStackEdges = [];

      const getHeightVal = (node, parentId = null) => {
        if (!node) {
          return -1;
        }
        visitsCount++;
        activeStack++;
        node.state = 'visiting';

        if (parentId) callStackEdges.push({ from: parentId, to: node.id });
        pushStep({
          treeState: currentTreeState,
          highlight: "cond",
          statusText: `Checking Height recursive frame for node ${node.value}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack
        });

        pushStep({
          treeState: currentTreeState,
          highlight: "left",
          statusText: `Entering Left subtree of node ${node.value} for height computation`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack
        });
        const leftH = getHeightVal(node.left, node.id);

        pushStep({
          treeState: currentTreeState,
          highlight: "right",
          statusText: `Entering Right subtree of node ${node.value} for height computation`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack
        });
        const rightH = getHeightVal(node.right, node.id);

        node.state = 'found';
        const finalHeight = Math.max(leftH, rightH) + 1;
        addLog(`[Subtree Height] Node ${node.value}: Max(${leftH}, ${rightH}) + 1 = ${finalHeight}`);
        
        const isAbsoluteSubtreeRoot = node.id === startNodeState.id;
        pushStep({
          treeState: currentTreeState,
          highlight: "visit",
          statusText: `Height at node ${node.value} is max(${leftH}, ${rightH}) + 1 = ${finalHeight}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack,
          result: isAbsoluteSubtreeRoot ? `Height from ${startValText} : ${finalHeight}` : null
        });

        if (parentId) {
          const idx = callStackEdges.findIndex(e => e.from === parentId && e.to === node.id);
          if (idx !== -1) callStackEdges.splice(idx, 1);
        }
        activeStack--;
        return finalHeight;
      };

      getHeightVal(startNodeState);
    });
  };

  const handleDiameter = () => {
    if (!tree) return;
    const targetVal = getVal();
    setValue(""); // Clear automatically
    setError(null);

    buildSimulationTimeline(tree, "diameter", ({ currentTreeState, pushStep, addLog }) => {
      let startNodeState = currentTreeState;
      let startValText = "absolute Root";

      if (targetVal !== null) {
        const findNode = (n) => {
          if (!n) return null;
          if (n.value === targetVal) return n;
          return findNode(n.left) || findNode(n.right);
        };
        const foundNode = findNode(currentTreeState);
        if (!foundNode) {
          addLog(`[Diameter Error] Target node ${targetVal} not found in the tree.`);
          pushStep({
            treeState: currentTreeState,
            highlight: "cond",
            statusText: `Starting node ${targetVal} not found in the tree.`,
          });
          return;
        }
        startNodeState = foundNode;
        startValText = `Node [${targetVal}]`;
      }

      addLog(`[Diameter] Tracking longest path recursive diameter starting from ${startValText}...`);
      let visitsCount = 0;
      let activeStack = 0;
      let globalMaxDiameter = 0;
      const callStackEdges = [];

      const computeDiameterHeight = (node, parentId = null) => {
        if (!node) return -1;
        visitsCount++;
        activeStack++;
        node.state = 'visiting';

        if (parentId) callStackEdges.push({ from: parentId, to: node.id });
        pushStep({
          treeState: currentTreeState,
          highlight: "cond",
          statusText: `Diameter frame height compute: node ${node.value}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack
        });

        pushStep({
          treeState: currentTreeState,
          highlight: "left",
          statusText: `Diameter: calculating height on left of node ${node.value}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack
        });
        const lh = computeDiameterHeight(node.left, node.id);

        pushStep({
          treeState: currentTreeState,
          highlight: "right",
          statusText: `Diameter: calculating height on right of node ${node.value}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack
        });
        const rh = computeDiameterHeight(node.right, node.id);

        node.state = 'found';
        const diameterAtNode = lh + rh + 2;
        if (diameterAtNode > globalMaxDiameter) {
          globalMaxDiameter = diameterAtNode;
        }

        addLog(`[Diameter Step] Node ${node.value}: Path through this node is ${diameterAtNode} edges. Current global max: ${globalMaxDiameter}`);
        
        const isAbsoluteSubtreeRoot = node.id === startNodeState.id;
        pushStep({
          treeState: currentTreeState,
          highlight: "visit",
          statusText: `Sub-diameter at ${node.value} = ${lh} (left) + ${rh} (right) + 2 = ${diameterAtNode}. Global max: ${globalMaxDiameter}`,
          edges: [...callStackEdges],
          visits: visitsCount,
          maxStack: activeStack,
          result: isAbsoluteSubtreeRoot ? `Diameter from ${startValText} : ${globalMaxDiameter}` : null
        });

        if (parentId) {
          const idx = callStackEdges.findIndex(e => e.from === parentId && e.to === node.id);
          if (idx !== -1) callStackEdges.splice(idx, 1);
        }
        activeStack--;
        return Math.max(lh, rh) + 1;
      };

      computeDiameterHeight(startNodeState);
      addLog(`[Completed] Absolute Diameter starting from ${startValText}: ${globalMaxDiameter} edges.`);
    });
  };

  const handleRandomTree = () => {
    setError(null);
    const size = Math.floor(Math.random() * 4) + 6;
    const values = [];
    while (values.length < size) {
      const val = Math.floor(Math.random() * 85) + 10;
      if (!values.includes(val)) values.push(val);
    }

    if (isBST) {
      values.sort((a, b) => a - b);
      const sortedInsert = (arr, start, end) => {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const node = {
          value: arr[mid],
          id: Math.random().toString(36).substring(2, 9),
          left: null,
          right: null,
          state: 'default'
        };
        node.left = sortedInsert(arr, start, mid - 1);
        node.right = sortedInsert(arr, mid + 1, end);
        return node;
      };
      const rootNode = sortedInsert(values, 0, values.length - 1);
      setTree(rootNode);
    } else {
      const buildCBT = (arr, i) => {
        if (i >= arr.length) return null;
        return {
          value: arr[i],
          id: Math.random().toString(36).substring(2, 9),
          left: buildCBT(arr, 2 * i + 1),
          right: buildCBT(arr, 2 * i + 2),
          state: 'default'
        };
      };
      const rootNode = buildCBT(values, 0);
      setTree(rootNode);
    }

    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setHighlightLineNum(-1);
    setStatus("Generated random complete structure. Use traversals or properties!");
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setHighlightLineNum(-1);
    setTree(null);
    setValue("");
    setError(null);
    setStatus("Tree structure reset. Insert a node to begin.");
  };

  const activeSnippetSet = (activeConcept === "inorder" || activeConcept === "preorder" || activeConcept === "postorder" || activeConcept === "height" || activeConcept === "diameter")
    ? codeSnippets[activeConcept][language]
    : codeSnippets[isBST ? "bst" : "bt"][activeConcept][language];

  const codeLines = activeSnippetSet.trim().split('\n');

  const currentStep = steps[currentStepIdx] || null;
  const currentTree = currentStep ? currentStep.tree : tree;
  const currentHighlight = currentStep ? currentStep.highlight : null;
  const currentLogs = currentStep ? currentStep.logs : [];
  const currentPrinted = currentStep ? currentStep.printed : [];
  const currentVisits = currentStep ? currentStep.visits : 0;
  const currentMaxStack = currentStep ? currentStep.maxStack : 0;
  const currentEdges = currentStep ? currentStep.edges : [];
  const currentResult = currentStep ? currentStep.result : null;

  const { nodesList, edgesList } = getLayoutElements(currentTree);

  useEffect(() => {
    if (currentHighlight) {
      const modeKey = (activeConcept === "inorder" || activeConcept === "preorder" || activeConcept === "postorder" || activeConcept === "height" || activeConcept === "diameter")
        ? activeConcept
        : (isBST ? "bst" : "bt");

      const trackerObj = (activeConcept === "inorder" || activeConcept === "preorder" || activeConcept === "postorder" || activeConcept === "height" || activeConcept === "diameter")
        ? LINE_MAPS[modeKey]?.[language]
        : LINE_MAPS[modeKey]?.[activeConcept]?.[language];

      if (trackerObj && trackerObj[currentHighlight] !== undefined) {
        setHighlightLineNum(trackerObj[currentHighlight]);
      }
    } else {
      setHighlightLineNum(-1);
    }
  }, [currentHighlight, activeConcept, language, isBST]);

  const maxNodeY = nodesList.reduce((max, n) => (n.y > max ? n.y : max), 150);
  const canvasHeight = Math.max(380, maxNodeY + 60);

  const statusColor = status.includes("found") || status.includes("Successfully") || status.includes("Success") || status.includes("inserted") || status.includes("Attached") || status.includes("Attached child")
    ? "status-found"
    : status.includes("not found") || status.includes("already exists") || status.includes("Failed") || status.includes("empty")
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
          Binary Tree
        </h1>

        {/* --- Tree Mode Selector --- */}
        <div className="input-group">
          <label>Tree Type Policy</label>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
            <button
              onClick={() => { setIsBST(false); handleReset(); }}
              disabled={isVisualizing}
              className={`btn ${!isBST ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              title="General complete unsorted binary tree rules"
            >
              General BT
            </button>
            <button
              onClick={() => { setIsBST(true); handleReset(); }}
              disabled={isVisualizing}
              className={`btn ${isBST ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              title="Strictly sorted binary search tree sorted rules"
            >
              BST Rules
            </button>
          </div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-gray-400)', display: 'block', marginTop: '0.35rem', lineHeight: '1.3' }}>
            {isBST 
              ? "BST Mode: Values are sorted on placement. Ideal for logarithmic search logic." 
              : "General BT Mode: Elements placed level-by-level (Complete Tree). Searching requires recursive traversal of both subtrees."}
          </span>
        </div>

        {/* --- Value Input Field --- */}
        <div className="input-group">
          <label htmlFor="value">Node Value</label>
          <input
            id="value"
            type="text"
            placeholder="e.g., 23"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPlaying}
            className="input-field"
          />
        </div>

        {/* --- Primary Controls Actions --- */}
        <div className="actions-single">
          <button onClick={handleInsert} disabled={isPlaying} className="btn btn-green">Insert Node</button>
        </div>
        <div className="actions-grid">
          <button onClick={handleDelete} disabled={isPlaying || !tree} className="btn btn-red">Delete Node</button>
          <button onClick={handleSearch} disabled={isPlaying || !tree} className="btn btn-cyan">
            <Search size={16} /> Search Key
          </button>
        </div>

        {/* --- Traversals Section --- */}
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>Tree Traversals</label>
          <div className="actions-grid-three">
            <button 
              onClick={() => handleTraversal('preorder')} 
              disabled={isPlaying || !tree} 
              className={`btn ${activeConcept === 'preorder' && isVisualizing ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ fontSize: '0.725rem', padding: '0.5rem 0.2rem' }}
              title="Pre-order (Root, Left, Right)"
            >
              Pre-Order
            </button>
            <button 
              onClick={() => handleTraversal('inorder')} 
              disabled={isPlaying || !tree} 
              className={`btn ${activeConcept === 'inorder' && isVisualizing ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ fontSize: '0.725rem', padding: '0.5rem 0.2rem' }}
              title="In-order (Left, Root, Right)"
            >
              In-Order
            </button>
            <button 
              onClick={() => handleTraversal('postorder')} 
              disabled={isPlaying || !tree} 
              className={`btn ${activeConcept === 'postorder' && isVisualizing ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ fontSize: '0.725rem', padding: '0.5rem 0.2rem' }}
              title="Post-order (Left, Right, Root)"
            >
              Post-Order
            </button>
          </div>
        </div>

        {/* --- Advanced Analytics Section --- */}
        <div className="input-group" style={{ marginTop: '0.85rem' }}>
          <label>Advanced Tree Properties</label>
          <div className="actions-grid">
            <button 
              onClick={handleHeight} 
              disabled={isPlaying || !tree} 
              className={`btn ${activeConcept === 'height' && isVisualizing ? 'btn-cyan' : 'btn-secondary'}`}
              title="Longest path starting from target node (or Root) to its leaf node"
            >
              Height
            </button>
            <button 
              onClick={handleDiameter} 
              disabled={isPlaying || !tree} 
              className={`btn ${activeConcept === 'diameter' && isVisualizing ? 'btn-cyan' : 'btn-secondary'}`}
              title="Longest path between any two nodes inside the subtree"
            >
              Diameter
            </button>
          </div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-gray-400)', display: 'block', marginTop: '0.35rem', lineHeight: '1.3' }}>
            Enter a node value in "Node Value" to calculate from, or leave empty to compute from absolute Root.
          </span>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        {/* --- Generator Controls --- */}
        <button
          onClick={handleRandomTree}
          disabled={isPlaying}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          Generate Random Tree
        </button>

        {/* --- Programming Language Choice --- */}
        <div className="input-group">
          <label htmlFor="language">Code Language Set</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isPlaying}
            className="input-field"
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        </div>

        {/* --- Speed Control Slider --- */}
        <div className="input-group">
          <label htmlFor="speed">Step Interval Speed</label>
          <div className="speed-slider-group">
            <input
              id="speed"
              type="range"
              min="150"
              max="2000"
              step="50"
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
        
        {/* --- Metrics Row Above Viewport --- */}
        <section className="metrics-top-row">
          <div className="metric-card-box">
            <span className="metric-card-label">Visits / Comparisons</span>
            <span className="metric-card-value">{currentVisits}</span>
          </div>
          <div className="metric-card-box">
            <span className="metric-card-label">Max Active Stack Frame</span>
            <span className="metric-card-value">{currentMaxStack}</span>
          </div>
          {/* Dynamic pop-in card showing computation results for Height and Diameter */}
          {currentResult && (
            <div className="metric-card-box border border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse">
              <span className="metric-card-label text-cyan-400 font-bold">Computed Result</span>
              <span className="metric-card-value text-green-400">{currentResult}</span>
            </div>
          )}
        </section>

        {/* --- Printed Sequence Badge Row --- */}
        {currentPrinted.length > 0 && (
          <section className="print-sequence-container">
            <span className="print-sequence-title">Printed Sequence Path</span>
            <div className="print-sequence-badges">
              {currentPrinted.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="print-badge">
                    <Award size={14} />
                    {val}
                  </div>
                  {idx < currentPrinted.length - 1 && (
                    <span className="print-arrow">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

        {/* --- Main Visual Viewport Canvas --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visual Layout Viewport</h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="visualization-viewport">
            {currentTree === null && (
              <span style={{ color: 'var(--text-gray-500)', margin: 'auto', padding: '3rem 0' }}>
                Structure canvas is empty. Insert a node key on the left to initialize.
              </span>
            )}

            {currentTree !== null && (
              <svg 
                className="visualization-svg-canvas"
                style={{ height: `${canvasHeight}px` }}
              >
                {/* --- Static / Active Recursive Connection Overlay Paths --- */}
                {edgesList.map((edge, idx) => {
                  const isDescentActive = currentEdges.some(
                    e => e.from === edge.from.id && e.to === edge.to.id
                  );

                  return (
                    <g key={idx}>
                      <line
                        x1={`${edge.from.x}%`}
                        y1={edge.from.y}
                        x2={`${edge.to.x}%`}
                        y2={edge.to.y}
                        stroke="#8cc07e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{ transition: 'all 0.3s' }}
                      />

                      {isDescentActive && (
                        <line
                          x1={`${edge.from.x}%`}
                          y1={edge.from.y}
                          x2={`${edge.to.x}%`}
                          y2={edge.to.y}
                          className="traversal-descent-line"
                        />
                      )}
                    </g>
                  );
                })}

                {/* --- Highly Styled Circle Nodes --- */}
                {nodesList.map((node) => (
                  <g 
                    key={node.id} 
                    className="tree-circle-node-svg"
                    transform={`translate(0, ${node.y})`}
                    style={{ transition: 'transform 0.3s ease' }}
                  >
                    <circle
                      cx={`${node.x}%`}
                      cy={0}
                      r={18}
                      className={`node-${node.state || 'default'}`}
                    />
                    <text
                      x={`${node.x}%`}
                      y={5}
                      textAnchor="middle"
                    >
                      {node.value}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          {/* --- Interactive Time Machine Scrubbing Bar Panel --- */}
          {isVisualizing && (
            <div className="mt-4 p-4 bg-slate-800 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
                  disabled={currentStepIdx === 0}
                  className="btn btn-secondary !w-10 !h-10 !p-0"
                  title="Previous Step"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`btn ${isPlaying ? 'btn-pause' : 'btn-resume'} !w-24`}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
                  disabled={currentStepIdx === steps.length - 1}
                  className="btn btn-secondary !w-10 !h-10 !p-0"
                  title="Next Step"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIdx(0);
                    setSteps([]);
                    setHighlightLineNum(-1);
                    setStatus("Cleared playback step state.");
                  }}
                  className="btn btn-secondary !w-10 !h-10 !p-0"
                  title="Reset Steps"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Range Slider Scrubber */}
              <div className="flex-1 w-full flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max={steps.length - 1}
                  value={currentStepIdx}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStepIdx(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-sm font-semibold text-slate-300 whitespace-nowrap">
                  Frame {currentStepIdx + 1} / {steps.length}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* --- Dynamic Verbatim Complexity Cards Row (image_0c0bc2.png) --- */}
        <section className="complexity-grid-row">
          <div className="complexity-card">
            <span className="complexity-card-header">{isBST ? "BINARY SEARCH TREE" : "BINARY TREE"}</span>
            <span className="complexity-card-title">Best Case Time</span>
            <span className="complexity-card-math">{isBST ? "O(log n)" : "O(n)"}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-card-header">{isBST ? "BINARY SEARCH TREE" : "BINARY TREE"}</span>
            <span className="complexity-card-title">Average Case Time</span>
            <span className="complexity-card-math">{isBST ? "O(log n)" : "O(n)"}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-card-header">{isBST ? "BINARY SEARCH TREE" : "BINARY TREE"}</span>
            <span className="complexity-card-title">Worst Case Time</span>
            <span className="complexity-card-math">O(n)</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-card-header">AUXILIARY SPACE</span>
            <span className="complexity-card-title">Memory Allocation</span>
            <span className="complexity-card-math">O(h)</span>
          </div>
        </section>

        {/* --- Lower Content Area (Code & Log) --- */}
        <div className="lower-content-area">
          <section className="code-section">
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Code Tracker</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                {activeConcept} ({isBST ? "BST" : "General BT"})
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

          <section className="log-section">
            <h2 className="section-title">Execution Log</h2>
            <div className="log-block" ref={logContainerRef}>
              <ul className="log-list">
                {currentLogs.length === 0 && (
                  <li className="log-item text-slate-500">Log trace remains empty until operations begin...</li>
                )}
                {currentLogs.map((log, idx) => (
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