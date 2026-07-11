import React, { useState, useRef, useEffect } from 'react';
import { GitFork, Pause, Play, RefreshCw, Search, ChevronLeft, ChevronRight, Shuffle, Trash2 } from 'lucide-react';

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
    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }

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

    /* Responsive SVG Scrollable Area */
    .visualization-boxes {
      position: relative;
      flex: 1;
      background-color: rgba(5, 5, 10, 0.4);
      border-radius: 0.5rem;
      min-height: 380px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
      overflow: auto; /* Enable dynamic panning/scrolling when tree is deep */
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem;
    }

    .tree-svg-container {
      width: 100%;
      min-width: 600px; /* Minimum horizontal boundary before horizontal scroll triggers */
      transition: height 0.3s ease;
    }

    /* --- GORGEOUS CIRCLE NODES MIRRORING image_eed3d6.png --- */
    .tree-circle-group {
      cursor: pointer;
    }
    
    .tree-circle-bg {
      stroke-width: 2.5;
      transition: fill 0.3s, stroke 0.3s, filter 0.3s;
    }
    
    /* Verbatim green style from image_eed3d6.png */
    .tree-circle-bg.default {
      fill: #e2f0d9;
      stroke: #8cc07e;
    }

    .tree-circle-bg.visiting {
      fill: #fef08a; /* yellow-200 */
      stroke: #ca8a04; /* yellow-600 */
      filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.7));
    }
    
    .tree-circle-bg.pre-op {
      fill: #fed7aa; /* orange-200 */
      stroke: #ea580c; /* orange-600 */
      filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.7));
    }
    
    .tree-circle-bg.found {
      fill: #4ade80; /* green-400 */
      stroke: #16a34a; /* green-600 */
      filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.8));
    }
    
    .tree-circle-bg.deleting {
      fill: #fca5a5; /* red-300 */
      stroke: #dc2626; /* red-600 */
      opacity: 0.8;
    }

    .tree-circle-text {
      font-size: 14px;
      font-weight: 700;
      text-anchor: middle;
      dominant-baseline: central;
      user-select: none;
    }
    .tree-circle-text.default { fill: #385723; }
    .tree-circle-text.visiting { fill: #854d0e; }
    .tree-circle-text.pre-op { fill: #7c2d12; }
    .tree-circle-text.found { fill: #ffffff; }
    .tree-circle-text.deleting { fill: #7f1d1d; }

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
    }
    
    .traversal-ascent-line {
      stroke: #ef4444;
      stroke-width: 4;
      stroke-dasharray: 6, 4;
      stroke-linecap: round;
      animation: flow-ascent 0.5s linear infinite;
      filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
    }

    /* Interactive Playback Panel */
    .playback-controls-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: var(--bg-dark-800);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.375rem;
    }

    .btn-icon {
      background-color: var(--bg-dark-700);
      color: white;
      border: 1px solid var(--border-gray-600);
      padding: 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-icon:hover:not(:disabled) {
      background-color: var(--bg-dark-600);
      border-color: var(--cyan-400);
    }
    .btn-icon:disabled { opacity: 0.45; cursor: not-allowed; }

    .playback-tracker {
      font-size: 0.85rem;
      color: var(--text-gray-300);
      min-width: 6.5rem;
      text-align: center;
      font-family: monospace;
    }

    .scrub-timeline-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.75rem;
    }
    .scrub-timeline {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: var(--bg-dark-950);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    }
    .scrub-timeline::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: var(--cyan-400);
      border-radius: 50%;
    }

    /* Diagnostics Dashboard */
    .diagnostics-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .diagnostic-card {
      background-color: var(--bg-dark-950);
      border: 1px solid var(--border-gray-700);
      border-radius: 0.375rem;
      padding: 0.6rem;
      text-align: center;
    }
    .diagnostic-label {
      font-size: 0.7rem;
      color: var(--text-gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .diagnostic-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--cyan-400);
      font-family: monospace;
    }

    /* Exact Complexity Grid verbatim image_0c0bc2.png */
    .image-complexity-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    @media (min-width: 640px) {
      .image-complexity-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .image-complexity-grid { grid-template-columns: repeat(4, 1fr); }
    }
    .image-complexity-card {
      background-color: #111827;
      border: 1px solid #1f2937;
      border-radius: 0.5rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 110px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .image-card-header {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #9ca3af;
      text-transform: uppercase;
    }
    .image-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
    }
    .image-card-complexity {
      font-family: monospace;
      font-size: 0.9rem;
      font-weight: 600;
      color: #38bdf8;
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
    }
  },
  bt: {
    insert: {
      python: `
def insert_bt(root, key):
    # Inserts in Level-Order (Complete Tree)
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
      c: `
void insert_bt(struct node* root, int key) {
    // level-order lookup for empty left/right child
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
      `.trim()
    },
    search: {
      python: `
def search_bt(root, key):
    # Unsorted: must search recursively (DFS)
    if root is None or root.val == key:
        return root
    left_res = search_bt(root.left, key)
    if left_res:
        return left_res
    return search_bt(root.right, key)
      `.trim(),
      c: `
struct node* search_bt(struct node* root, int key) {
    if (root == NULL || root->key == key)
        return root;
    struct node* left = search_bt(root->left, key);
    if (left != NULL) return left;
    return search_bt(root->right, key);
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
      java: `
Node searchBT(Node root, int key) {
    if (root == null || root.key == key)
        return root;
    Node left = searchBT(root.left, key);
    if (left != null) return left;
    return searchBT(root.right, key);
}
      `.trim()
    },
    delete: {
      python: `
def delete_bt(root, key):
    # Replace target with deepest, rightmost node
    target = find_node(root, key)
    deepest = find_deepest(root)
    if target and deepest:
        target.val = deepest.val
        delete_deepest_node(root, deepest)
    return root
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
      java: `
void deleteBT(Node root, int key) {
    Node target = findNode(root, key);
    Node deepest = getDeepest(root);
    if (target != null && deepest != null) {
        target.key = deepest.key;
        deleteDeepestNode(root, deepest);
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
  bst: {
    insert: {
      python: { check_null: 2, recurse_left: 4, recurse_right: 6 },
      c: { check_null: 2, recurse_left: 4, recurse_right: 6 },
      cpp: { check_null: 2, recurse_left: 4, recurse_right: 6 },
      java: { check_null: 2, recurse_left: 6, recurse_right: 8 }
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
    }
  },
  bt: {
    insert: {
      python: { check_null: 4, loop_cond: 8, recurse_left: 10, recurse_right: 15 },
      c: { check_null: 5, loop_cond: 6, recurse_left: 8, recurse_right: 10 },
      cpp: { check_null: 4, loop_cond: 5, recurse_left: 7, recurse_right: 9 },
      java: { check_null: 4, loop_cond: 5, recurse_left: 7, recurse_right: 9 }
    },
    search: {
      python: { check_target: 4, recurse_left: 6, recurse_right: 9 },
      c: { check_target: 2, recurse_left: 4, recurse_right: 6 },
      cpp: { check_target: 2, recurse_left: 4, recurse_right: 6 },
      java: { check_target: 2, recurse_left: 4, recurse_right: 6 }
    },
    delete: {
      python: { check_null: 3, recurse_left: 5, recurse_right: 5 },
      c: { check_null: 3, recurse_left: 5, recurse_right: 5 },
      cpp: { check_null: 3, recurse_left: 5, recurse_right: 5 },
      java: { check_null: 3, recurse_left: 5, recurse_right: 5 }
    }
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

const cloneTree = (node) => {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    state: node.state,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};

const assignTreeCoords = (node, x, y, dx, nodesAccumulator, edgesAccumulator) => {
  if (!node) return;
  node.x = x;
  node.y = y;
  nodesAccumulator.push(node);

  if (node.left) {
    edgesAccumulator.push({ from: node, to: node.left });
    assignTreeCoords(node.left, x - dx, y + 80, dx * 0.46, nodesAccumulator, edgesAccumulator);
  }
  if (node.right) {
    edgesAccumulator.push({ from: node, to: node.right });
    assignTreeCoords(node.right, x + dx, y + 80, dx * 0.46, nodesAccumulator, edgesAccumulator);
  }
};

const getTreeDepth = (node) => {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
};

export default function BST() {
  const [tree, setTree] = useState(null);
  const [value, setValue] = useState("");
  
  const [isBST, setIsBST] = useState(true); // Default mode set to BST Rules
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(600);
  const [status, setStatus] = useState("Tree is empty. Insert a node or generate a random set.");
  const [randomSize, setRandomSize] = useState(6);
  const [error, setError] = useState(null);

  // High-Fidelity Time-Machine Playback Engine State Variables
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeConcept, setActiveConcept] = useState("insert");

  const timerRef = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prevIdx) => {
          if (prevIdx >= steps.length - 1) {
            setIsPlaying(false);
            return prevIdx;
          }
          return prevIdx + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isPlaying, steps, speed]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStepIdx, steps]);

  useEffect(() => {
    handleRandomGenerator(6); // Balanced initial structure
  }, [isBST]);

  const getLayoutElements = (root) => {
    const nodesList = [];
    const edgesList = [];
    assignTreeCoords(root, 400, 50, 180, nodesList, edgesList);
    const depth = getTreeDepth(root);
    return { nodesList, edgesList, depth };
  };

  const getCleanVal = () => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setError("Please enter a valid, non-empty integer value.");
      return null;
    }
    return num;
  };

  const runTreePrecomputation = (initialTree, algorithmType, parameters = {}) => {
    const localSteps = [];
    const localLogs = ["Compiling traversal step sequence...", "Initial state loaded."];
    let tempTree = cloneTree(initialTree);

    let visitsCounter = 0;
    let maxStackDepth = 0;
    let pathTrace = []; // Accumulates traversed sequence nodes live!

    const pushStep = (currentTreeState, statusText, stepLineKey, activeEdges = [], backtrack = null) => {
      localSteps.push({
        tree: cloneTree(currentTreeState),
        status: statusText,
        logs: [...localLogs],
        lineKey: stepLineKey,
        callStackEdges: [...activeEdges],
        backtrackEdge: backtrack ? { ...backtrack } : null,
        visits: visitsCounter,
        stackDepth: maxStackDepth,
        printedPath: [...pathTrace] // Snapshots printed nodes up to this step!
      });
    };

    const updateStateByValue = (node, targetValue, stateName) => {
      if (!node) return null;
      let nodeRef = { ...node };
      if (node.value === targetValue) {
        nodeRef.state = stateName;
      }
      nodeRef.left = updateStateByValue(node.left, targetValue, stateName);
      nodeRef.right = updateStateByValue(node.right, targetValue, stateName);
      return nodeRef;
    };

    const resetStates = (node) => {
      if (!node) return null;
      return {
        ...node,
        state: 'default',
        left: resetStates(node.left),
        right: resetStates(node.right)
      };
    };

    const targetVal = parameters.value;

    if (algorithmType === "insert") {
      const uniqueId = Math.random().toString(36).substring(2, 9);
      const newNode = { value: targetVal, id: uniqueId, left: null, right: null, state: 'found' };

      if (!tempTree) {
        tempTree = newNode;
        localLogs.push(`Node value ${targetVal} initialized as structural tree root.`);
        pushStep(tempTree, `Inserting ${targetVal} as Root...`, "check_null");
      } 
      else if (isBST) {
        let current = tempTree;
        let parent = null;
        let isDuplicate = false;

        while (current) {
          visitsCounter++;
          const currentValue = current.value;
          tempTree = updateStateByValue(tempTree, currentValue, 'visiting');
          localLogs.push(`Inspecting node ${currentValue} inside BST range.`);
          pushStep(tempTree, `Checking Node value ${currentValue}...`, "check_null");

          if (currentValue === targetVal) {
            isDuplicate = true;
            tempTree = updateStateByValue(tempTree, currentValue, 'found');
            localLogs.push(`Duplicate BST value ${targetVal} detected. Halting.`);
            pushStep(tempTree, `Duplicate BST Value detected! Aborted.`, "check_null");
            break;
          }

          parent = current;
          tempTree = updateStateByValue(tempTree, currentValue, 'default');

          if (targetVal < currentValue) {
            current = current.left;
            pushStep(tempTree, `Descending recursively to Left Subtree...`, "recurse_left");
          } else {
            current = current.right;
            pushStep(tempTree, `Descending recursively to Right Subtree...`, "recurse_right");
          }
        }

        if (!isDuplicate) {
          tempTree = updateStateByValue(tempTree, parent.value, 'pre-op');
          localLogs.push(`Connected element ${targetVal} under parent ${parent.value}.`);
          pushStep(tempTree, `Connecting child ${targetVal}...`, "check_null");

          const insertBSTNode = (node) => {
            if (!node) return null;
            if (node.id === parent.id) {
              const withChild = { ...node, state: 'default' };
              if (targetVal < parent.value) withChild.left = newNode;
              else withChild.right = newNode;
              return withChild;
            }
            return {
              ...node,
              left: insertBSTNode(node.left),
              right: insertBSTNode(node.right)
            };
          };

          tempTree = insertBSTNode(tempTree);
          tempTree = resetStates(tempTree);
          pushStep(tempTree, `Successfully placed ${targetVal}.`, "check_null");
        }
      } 
      else {
        // General Complete Binary Tree Insertion (Level-Order BFS)
        let parentTarget = null;
        let attachSide = 'left';
        let queue = [tempTree];

        localLogs.push("Searching for level-order vacancy inside complete tree...");
        pushStep(tempTree, "Starting Complete BT level-order traversal...", "loop_cond");

        while (queue.length > 0) {
          visitsCounter++;
          let current = queue.shift();
          tempTree = updateStateByValue(tempTree, current.value, 'visiting');
          pushStep(tempTree, `Inspecting node vacancies on node ${current.value}...`, "loop_cond");

          if (!current.left) {
            parentTarget = current;
            attachSide = 'left';
            break;
          } else {
            queue.push(current.left);
          }

          if (!current.right) {
            parentTarget = current;
            attachSide = 'right';
            break;
          } else {
            queue.push(current.right);
          }

          tempTree = updateStateByValue(tempTree, current.value, 'default');
        }

        tempTree = updateStateByValue(tempTree, parentTarget.value, 'pre-op');
        pushStep(tempTree, `Vacancy identified at ${parentTarget.value}'s ${attachSide}.`, "loop_cond");

        const insertBTNode = (node) => {
          if (!node) return null;
          if (node.id === parentTarget.id) {
            const updatedParent = { ...node, state: 'default' };
            if (attachSide === 'left') updatedParent.left = newNode;
            else updatedParent.right = newNode;
            return updatedParent;
          }
          return {
            ...node,
            left: insertBTNode(node.left),
            right: insertBTNode(node.right)
          };
        };

        tempTree = insertBTNode(tempTree);
        tempTree = resetStates(tempTree);
        localLogs.push(`Connected element ${targetVal} level-by-level.`);
        pushStep(tempTree, `Placement completed successfully!`, "loop_cond");
      }
    } 
    else if (algorithmType === "search") {
      let callStackList = [];

      const searchBSTRecursive = (node, parentId = null) => {
        if (!node) return;
        visitsCounter++;
        maxStackDepth = Math.max(maxStackDepth, callStackList.length + 1);

        if (parentId) {
          callStackList.push({ from: parentId, to: node.id });
        }

        tempTree = updateStateByValue(tempTree, node.value, 'visiting');
        localLogs.push(`Stack frame: searching Node ${node.value} for value ${targetVal}.`);
        pushStep(tempTree, `Inspecting node ${node.value}...`, "check_target", callStackList);

        if (node.value === targetVal) {
          tempTree = updateStateByValue(tempTree, node.value, 'found');
          localLogs.push(`Successfully found match: ${node.value}.`);
          pushStep(tempTree, `Target element ${targetVal} found!`, "check_target", callStackList);
          
          if (parentId) {
            callStackList.pop();
          }
          return true;
        }

        tempTree = updateStateByValue(tempTree, node.value, 'default');

        let found = false;
        if (targetVal < node.value) {
          if (node.left) {
            found = searchBSTRecursive(node.left, node.id);
          } else {
            localLogs.push(`No left branch present under node ${node.value}.`);
            pushStep(tempTree, `Value ${targetVal} is smaller, but left branch is null.`, "recurse_left", callStackList);
          }
        } else {
          if (node.right) {
            found = searchBSTRecursive(node.right, node.id);
          } else {
            localLogs.push(`No right branch present under node ${node.value}.`);
            pushStep(tempTree, `Value ${targetVal} is larger, but right branch is null.`, "recurse_right", callStackList);
          }
        }

        if (parentId) {
          const popped = callStackList.pop();
          pushStep(tempTree, `Backtracking from frame node ${node.value}...`, "check_target", callStackList, popped);
        }
        return found;
      };

      const searchBTRecursive = (node, parentId = null) => {
        if (!node) return false;
        visitsCounter++;
        maxStackDepth = Math.max(maxStackDepth, callStackList.length + 1);

        if (parentId) {
          callStackList.push({ from: parentId, to: node.id });
        }

        tempTree = updateStateByValue(tempTree, node.value, 'visiting');
        localLogs.push(`Recursion search step on node ${node.value}.`);
        pushStep(tempTree, `Inspecting node ${node.value}...`, "check_target", callStackList);

        if (node.value === targetVal) {
          tempTree = updateStateByValue(tempTree, node.value, 'found');
          localLogs.push(`Target ${targetVal} found!`);
          pushStep(tempTree, `Target element ${targetVal} found!`, "check_target", callStackList);
          
          if (parentId) {
            callStackList.pop();
          }
          return true;
        }

        tempTree = updateStateByValue(tempTree, node.value, 'default');

        // Look left
        let foundLeft = false;
        if (node.left) {
          localLogs.push(`Traversing Left Subtree for key ${targetVal}.`);
          pushStep(tempTree, `Searching left branch...`, "recurse_left", callStackList);
          foundLeft = searchBTRecursive(node.left, node.id);
        }

        if (foundLeft) {
          if (parentId) {
            const popped = callStackList.pop();
            pushStep(tempTree, `Propagating search success frame up...`, "check_target", callStackList, popped);
          }
          return true;
        }

        // Look right
        let foundRight = false;
        if (node.right) {
          localLogs.push(`Traversing Right Subtree for key ${targetVal}.`);
          pushStep(tempTree, `Searching right branch...`, "recurse_right", callStackList);
          foundRight = searchBTRecursive(node.right, node.id);
        }

        if (parentId) {
          const popped = callStackList.pop();
          pushStep(tempTree, `Backtracking up search stack...`, "check_target", callStackList, popped);
        }

        return foundRight;
      };

      const result = isBST ? searchBSTRecursive(tempTree) : searchBTRecursive(tempTree);
      if (!result) {
        tempTree = resetStates(tempTree);
        localLogs.push(`Target key ${targetVal} not found in structure.`);
        pushStep(tempTree, "Value is not present in the tree.", "check_target");
      }
    } 
    else if (algorithmType === "delete") {
      if (isBST) {
        const findMinNode = (node) => {
          let curr = node;
          while (curr && curr.left) curr = curr.left;
          return curr;
        };

        const deleteRecursiveBST = (node, delValue) => {
          if (!node) {
            localLogs.push(`Target value ${delValue} not present.`);
            return null;
          }
          visitsCounter++;

          tempTree = updateStateByValue(tempTree, node.value, 'visiting');
          localLogs.push(`Searching deletion site: comparing key on node ${node.value}.`);
          pushStep(tempTree, `Searching BST deletion target: checking ${node.value}...`, "check_null");

          if (delValue < node.value) {
            tempTree = updateStateByValue(tempTree, node.value, 'default');
            node.left = deleteRecursiveBST(node.left, delValue);
            return { ...node };
          } 
          else if (delValue > node.value) {
            tempTree = updateStateByValue(tempTree, node.value, 'default');
            node.right = deleteRecursiveBST(node.right, delValue);
            return { ...node };
          } 
          else {
            tempTree = updateStateByValue(tempTree, node.value, 'deleting');
            localLogs.push(`Target node found. Standard BST deletion triggered.`);
            pushStep(tempTree, `Identified delete target ${node.value}.`, "leaf");

            // Leaf node case
            if (!node.left && !node.right) {
              localLogs.push("Leaf node pruned.");
              pushStep(tempTree, "Target is a leaf. Removing and pruning node.", "leaf");
              return null;
            }

            // Single child cases
            if (!node.left) {
              localLogs.push(`Promoted right child ${node.right.value}.`);
              pushStep(tempTree, "Only has right child. Promoting right branch...", "one_child");
              return node.right;
            }
            if (!node.right) {
              localLogs.push(`Promoted left child ${node.left.value}.`);
              pushStep(tempTree, "Only has left child. Promoting left branch...", "one_child");
              return node.left;
            }

            // Two children case
            localLogs.push("Target contains 2 children. Fetching in-order successor...");
            pushStep(tempTree, "Two children present. Searching in-order successor...", "find_min");

            const successor = findMinNode(node.right);
            tempTree = updateStateByValue(tempTree, successor.value, 'pre-op');
            pushStep(tempTree, `Found successor: ${successor.value}. Overwriting...`, "copy_val");

            const replacedVal = successor.value;
            node.value = replacedVal;
            tempTree = updateStateByValue(tempTree, successor.value, 'default');
            tempTree = updateStateByValue(tempTree, node.value, 'default');

            pushStep(tempTree, `Successor cloned. Pruning duplicate successor node...`, "delete_min");
            node.right = deleteRecursiveBST(node.right, replacedVal);
            return { ...node };
          }
        };

        const resultTree = deleteRecursiveBST(tempTree, targetVal);
        tempTree = resetStates(resultTree);
        pushStep(tempTree, `Finished BST deletion process.`, "check_null");
      } 
      else {
        // Complete Binary Tree Replacement Deletion
        let targetNode = null;
        let deepestNode = null;

        // Check if target is in the tree
        const findTargetNode = (node) => {
          if (!node) return null;
          if (node.value === targetVal) return node;
          let leftFind = findTargetNode(node.left);
          if (leftFind) return leftFind;
          return findTargetNode(node.right);
        };

        targetNode = findTargetNode(tempTree);

        if (!targetNode) {
          localLogs.push(`Element ${targetVal} not present.`);
          pushStep(tempTree, "Key is not present in BT.", "check_null");
        } 
        else {
          tempTree = updateStateByValue(tempTree, targetNode.value, 'deleting');
          localLogs.push(`Located deletion site on BT node ${targetVal}. Finding deepest leaf...`);
          pushStep(tempTree, `Found target: ${targetVal}. Inspecting deepest rightmost node...`, "check_null");

          // BFS for deepest rightmost node
          let bfsQueue = [{ node: tempTree, parent: null }];
          while (bfsQueue.length > 0) {
            visitsCounter++;
            let currentItem = bfsQueue.shift();
            deepestNode = currentItem.node;

            if (currentItem.node.left) {
              bfsQueue.push({ node: currentItem.node.left, parent: currentItem.node });
            }
            if (currentItem.node.right) {
              bfsQueue.push({ node: currentItem.node.right, parent: currentItem.node });
            }
          }

          tempTree = updateStateByValue(tempTree, deepestNode.value, 'pre-op');
          localLogs.push(`Successor key selected from deepest leaf: ${deepestNode.value}.`);
          pushStep(tempTree, `Leaf candidate identified: ${deepestNode.value}. Swapping...`, "check_null");

          const swapPruneBT = (node) => {
            if (!node) return null;
            let copy = { ...node };
            if (node.id === targetNode.id) {
              copy.value = deepestNode.value;
              copy.state = 'default';
            }
            if (copy.id === deepestNode.id) {
              return null;
            }
            copy.left = swapPruneBT(copy.left);
            copy.right = swapPruneBT(copy.right);
            return copy;
          };

          if (tempTree.id === deepestNode.id) {
            tempTree = null;
          } else {
            tempTree = swapPruneBT(tempTree);
          }
          tempTree = resetStates(tempTree);
          localLogs.push(`Pruned deepest leaf ${deepestNode.value} and overridden delete site.`);
          pushStep(tempTree, `Pruned deepest rightmost leaf and re-arranged tree structure.`, "check_null");
        }
      }
    } 
    else if (["inorder", "preorder", "postorder"].includes(algorithmType)) {
      let callStackList = [];

      const traverseTree = (node, parentId = null) => {
        if (!node) return;
        visitsCounter++;
        maxStackDepth = Math.max(maxStackDepth, callStackList.length + 1);

        if (parentId) {
          callStackList.push({ from: parentId, to: node.id });
        }

        if (algorithmType === "preorder") {
          tempTree = updateStateByValue(tempTree, node.value, 'found');
          pathTrace.push(node.value);
          localLogs.push(`Visited node ${node.value}. Preorder path: [${pathTrace.join(' -> ')}]`);
          pushStep(tempTree, `Root Visit: Node ${node.value}`, "visit", callStackList);

          if (node.left) {
            pushStep(tempTree, "Entering Left Subtree...", "left", callStackList);
            traverseTree(node.left, node.id);
          }
          if (node.right) {
            pushStep(tempTree, "Entering Right Subtree...", "right", callStackList);
            traverseTree(node.right, node.id);
          }
        } 
        else if (algorithmType === "inorder") {
          if (node.left) {
            pushStep(tempTree, "Entering Left Subtree...", "left", callStackList);
            traverseTree(node.left, node.id);
          }

          tempTree = updateStateByValue(tempTree, node.value, 'found');
          pathTrace.push(node.value);
          localLogs.push(`Visited node ${node.value}. Inorder path: [${pathTrace.join(' -> ')}]`);
          pushStep(tempTree, `Visit Middle: Node ${node.value}`, "visit", callStackList);

          if (node.right) {
            pushStep(tempTree, "Entering Right Subtree...", "right", callStackList);
            traverseTree(node.right, node.id);
          }
        } 
        else if (algorithmType === "postorder") {
          if (node.left) {
            pushStep(tempTree, "Entering Left Subtree...", "left", callStackList);
            traverseTree(node.left, node.id);
          }
          if (node.right) {
            pushStep(tempTree, "Entering Right Subtree...", "right", callStackList);
            traverseTree(node.right, node.id);
          }

          tempTree = updateStateByValue(tempTree, node.value, 'found');
          pathTrace.push(node.value);
          localLogs.push(`Visited node ${node.value}. Postorder path: [${pathTrace.join(' -> ')}]`);
          pushStep(tempTree, `Visit Post: Node ${node.value}`, "visit", callStackList);
        }

        if (parentId) {
          const popped = callStackList.pop();
          pushStep(tempTree, `Unwinding recursive traversal frame...`, "cond", callStackList, popped);
        }
      };

      traverseTree(tempTree);
      tempTree = resetStates(tempTree);
      pushStep(tempTree, `Completed Traversal path: [ ${pathTrace.join(' -> ')} ]`, "cond");
    }

    return localSteps;
  };

  const startPlayingSteps = (precomputedSteps, initialConcept = "insert", autoPlay = false) => {
    setActiveConcept(initialConcept);
    setSteps(precomputedSteps);
    setCurrentStepIdx(0);
    setIsPlaying(autoPlay); // Defaults to false, so user can choose to Play or use manual Next/Prev!
  };

  const handleInsert = () => {
    const val = getCleanVal();
    if (val === null) return;
    setError(null);
    setIsPlaying(false);
    setValue(""); // Clear the input field immediately after reading value (Ref: image_78fe5b.png)

    const generatedTimeline = runTreePrecomputation(tree, "insert", { value: val });
    // Inserting doesn't autoplay, allowing the user to examine the tree, scrub or press Play/Next/Prev
    startPlayingSteps(generatedTimeline, "insert", false);
    setTree(generatedTimeline[generatedTimeline.length - 1].tree);
  };

  const handleSearch = () => {
    const val = getCleanVal();
    if (val === null) return;
    setError(null);
    setIsPlaying(false);

    if (!tree) {
      setError("Cannot search inside an empty tree structure.");
      return;
    }
    setValue(""); // Clear the input field for seamless sequential searches

    const generatedTimeline = runTreePrecomputation(tree, "search", { value: val });
    // Loads paused so user can manually step through comparisons
    startPlayingSteps(generatedTimeline, "search", false);
  };

  const handleDelete = () => {
    const val = getCleanVal();
    if (val === null) return;
    setError(null);
    setIsPlaying(false);

    if (!tree) {
      setError("Cannot delete from an empty tree structure.");
      return;
    }
    setValue(""); // Clear the input field upon deletion start

    const generatedTimeline = runTreePrecomputation(tree, "delete", { value: val });
    // Loads paused
    startPlayingSteps(generatedTimeline, "delete", false);
    setTree(generatedTimeline[generatedTimeline.length - 1].tree);
  };

  const handleTraversal = (mode) => {
    setError(null);
    setIsPlaying(false);

    if (!tree) {
      setError("Empty trees cannot be traversed.");
      return;
    }

    const generatedTimeline = runTreePrecomputation(tree, mode);
    // CRITICAL: Loads completely paused! First step loads, user can play auto or manual click next/prev.
    startPlayingSteps(generatedTimeline, mode, false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTree(null);
    setValue("");
    setError(null);
    setSteps([]);
    setCurrentStepIdx(0);
    setStatus("Tree is empty. Insert a node to begin.");
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRandomGenerator = (size = 6) => {
    setIsPlaying(false);
    setError(null);
    setSteps([]);
    setCurrentStepIdx(0);

    const generatedUniqueArray = [];
    while (generatedUniqueArray.length < size) {
      const candidate = Math.floor(Math.random() * 85) + 10;
      if (!generatedUniqueArray.includes(candidate)) {
        generatedUniqueArray.push(candidate);
      }
    }

    if (isBST) {
      // Create beautifully balanced BST
      generatedUniqueArray.sort((a, b) => a - b);
      
      const constructBSTRecursive = (arr, start, end) => {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const uuid = Math.random().toString(36).substring(2, 9);
        return {
          value: arr[mid],
          id: uuid,
          state: 'default',
          left: constructBSTRecursive(arr, start, mid - 1),
          right: constructBSTRecursive(arr, mid + 1, end)
        };
      };

      const finalBST = constructBSTRecursive(generatedUniqueArray, 0, generatedUniqueArray.length - 1);
      setTree(finalBST);
      setStatus("Balanced BST generated. Click Traversal, Search, or Insert to begin.");
    } 
    else {
      // Complete General Binary Tree Construction
      const constructBTComplete = (arr) => {
        if (!arr.length) return null;
        const nodes = arr.map((val) => ({
          value: val,
          id: Math.random().toString(36).substring(2, 9),
          state: 'default',
          left: null,
          right: null
        }));

        for (let i = 0; i < nodes.length; i++) {
          const leftIdx = 2 * i + 1;
          const rightIdx = 2 * i + 2;
          if (leftIdx < nodes.length) nodes[i].left = nodes[leftIdx];
          if (rightIdx < nodes.length) nodes[i].right = nodes[rightIdx];
        }
        return nodes[0];
      };

      const finalBT = constructBTComplete(generatedUniqueArray);
      setTree(finalBT);
      setStatus("Complete BT generated level-by-level. Recursive DFS Search required.");
    }
  };

  // Safe layout state calculations
  const activeStep = steps[currentStepIdx] || {
    tree: tree,
    status: status,
    logs: ["Ready. Select or generate a tree structure to simulate."],
    lineKey: -1,
    callStackEdges: [],
    backtrackEdge: null,
    visits: 0,
    stackDepth: 0,
    printedPath: []
  };

  const activeSnippetSet = (activeConcept === "inorder" || activeConcept === "preorder" || activeConcept === "postorder")
    ? codeSnippets[activeConcept][language]
    : codeSnippets[isBST ? "bst" : "bt"][activeConcept][language];

  const codeLines = activeSnippetSet.trim().split('\n');
  const highlightedLine = LINE_MAPS[activeConcept === "inorder" || activeConcept === "preorder" || activeConcept === "postorder" ? activeConcept : (isBST ? "bst" : "bt")]?.[activeConcept]?.[language]?.[activeStep.lineKey] ?? -1;

  const statusColor = activeStep.status.includes("found") || activeStep.status.includes("Success") || activeStep.status.includes("Cloned")
    ? "status-found"
    : activeStep.status.includes("not present") || activeStep.status.includes("Duplicate") || activeStep.status.includes("Aborted")
    ? "status-not-found"
    : isPlaying
    ? "status-found"
    : "status-default";

  const { nodesList, edgesList, depth } = getLayoutElements(activeStep.tree);

  // SVG dynamic responsiveness height settings
  const baseSpacingHeight = 80;
  const svgComputedHeight = Math.max(340, (depth * baseSpacingHeight) + 80);

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <GitFork size={30} />
          Binary Tree
        </h1>

        {/* --- Tree Mode Rules Selection --- */}
        <div className="input-group">
          <label>Tree Mode Rules</label>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
            <button
              onClick={() => { setIsBST(false); handleReset(); }}
              className={`btn ${!isBST ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              title="General Unsorted Binary Tree level-order"
            >
              General BT
            </button>
            <button
              onClick={() => { setIsBST(true); handleReset(); }}
              className={`btn ${isBST ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              title="Sorted Binary Search Tree rules"
            >
              BST Rules
            </button>
          </div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-gray-400)', display: 'block', marginTop: '0.35rem', lineHeight: '1.3' }}>
            {isBST 
              ? "BST Mode: Values sorted on placement. Optimized logarithmic searching." 
              : "General BT Mode: Level-by-level complete placement. Requires full recursive DFS search."}
          </span>
        </div>

        <div className="input-group">
          <label htmlFor="value">Node Value</label>
          <input
            id="value"
            type="text"
            placeholder="e.g., 25"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input-field"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* --- Actions --- */}
        <div className="actions-single">
          <button onClick={handleInsert} className="btn btn-green">Insert Node</button>
        </div>
        <div className="actions-grid">
          <button onClick={handleDelete} className="btn btn-red">Delete Node</button>
          <button onClick={handleSearch} className="btn btn-cyan">
            <Search size={16} /> Search key
          </button>
        </div>
        
        {/* --- Traversals Panel --- */}
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
          <label>Recursive Traversals</label>
          <div className="actions-grid-three">
            <button 
              onClick={() => handleTraversal('preorder')} 
              className={`btn ${activeConcept === 'preorder' ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.25rem' }}
              title="Root -> Left -> Right"
            >
              Pre-Order
            </button>
            <button 
              onClick={() => handleTraversal('inorder')} 
              className={`btn ${activeConcept === 'inorder' ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.25rem' }}
              title="Left -> Root -> Right"
            >
              In-Order
            </button>
            <button 
              onClick={() => handleTraversal('postorder')} 
              className={`btn ${activeConcept === 'postorder' ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.25rem' }}
              title="Left -> Right -> Root"
            >
              Post-Order
            </button>
          </div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-gray-400)', display: 'block', marginTop: '0.35rem', lineHeight: '1.3' }}>
            Clicking a traversal loads the step layout paused. Press Play to animate, or step manually using Next / Prev.
          </span>
        </div>
        
        <hr style={{borderColor: 'var(--border-gray-700)', margin: '1.25rem 0'}} />

        {/* --- Preset and Random Generators --- */}
        <div className="input-group">
          <label>Random Generation</label>
          <div className="speed-slider-group">
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={randomSize}
              onChange={(e) => setRandomSize(Number(e.target.value))}
              className="speed-slider"
            />
            <span className="speed-value">{randomSize} items</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.6rem' }}>
            <button 
              onClick={() => handleRandomGenerator(randomSize)} 
              className="btn btn-purple"
            >
              <Shuffle size={14} /> Generate Random Tree
            </button>
          </div>
        </div>

        {/* --- Visualization Settings --- */}
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="language">Code Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="speed">Autoplay Speed</label>
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
        
        {/* --- Visualization Arena --- */}
        <section className="visualization-section">
          <h2 className="section-title">Visual Canvas</h2>
          
          <div className="status-bar">
            <span className={`status-text ${statusColor}`}>
              {activeStep.status}
            </span>
          </div>

          {/* Dynamic Live Diagnostics (Visits & Stack depth) rendered ABOVE visualization layout */}
          <div className="diagnostics-bar" style={{ marginBottom: '1rem' }}>
            <div className="diagnostic-card">
              <div className="diagnostic-label">Visits / Comparisons</div>
              <div className="diagnostic-value">{activeStep.visits}</div>
            </div>
            <div className="diagnostic-card">
              <div className="diagnostic-label">Max Active Stack Frame</div>
              <div className="diagnostic-value">{activeStep.stackDepth}</div>
            </div>
          </div>

          {/* Sequential Traversal Path / Visited Badge Outputs (Appends node values one-by-one) */}
          {activeStep.printedPath && activeStep.printedPath.length > 0 && (
            <div className="traversal-path-display-bar animate-fade-in" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              backgroundColor: 'var(--bg-dark-950)',
              border: '1px solid var(--border-gray-700)',
              borderRadius: '0.375rem',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Printed Sequence:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {activeStep.printedPath.map((val, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span style={{ color: 'var(--cyan-400)', fontWeight: 'bold', fontSize: '0.9rem' }}>&rarr;</span>}
                    <span style={{
                      backgroundColor: '#e2f0d9',
                      color: '#385723',
                      border: '1px solid #8cc07e',
                      borderRadius: '0.25rem',
                      padding: '0.15rem 0.5rem',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                      animation: 'popIn 0.25s ease-out'
                    }}>
                      {val}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          {/* Responsive SVG Scrollable Area */}
          <div className="visualization-boxes">
            {activeStep.tree === null && (
              <span style={{color: 'var(--text-gray-500)', margin: 'auto', textAlign: 'center'}}>
                Tree structure is empty.<br />Insert node values on the left to build your custom tree step-by-step.
              </span>
            )}
            
            {activeStep.tree !== null && (
              <svg 
                className="tree-svg-container" 
                viewBox={`0 0 800 ${svgComputedHeight}`}
                height={`${svgComputedHeight}px`}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 1. Connection Overlay Lines */}
                <g className="tree-connectors">
                  {edgesList.map((edge, idx) => {
                    const isDescentActive = activeStep.callStackEdges.some(
                      s => (s.from === edge.from.id && s.to === edge.to.id)
                    );

                    const isBacktrackActive = activeStep.backtrackEdge && (
                      (activeStep.backtrackEdge.from === edge.from.id && activeStep.backtrackEdge.to === edge.to.id) ||
                      (activeStep.backtrackEdge.from === edge.to.id && activeStep.backtrackEdge.to === edge.from.id)
                    );

                    return (
                      <g key={`edge-${idx}`}>
                        <line
                          x1={edge.from.x}
                          y1={edge.from.y}
                          x2={edge.to.x}
                          y2={edge.to.y}
                          stroke="#8cc07e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          style={{ transition: 'all 0.3s' }}
                        />

                        {isDescentActive && (
                          <line
                            x1={edge.from.x}
                            y1={edge.from.y}
                            x2={edge.to.x}
                            y2={edge.to.y}
                            className="traversal-descent-line"
                          />
                        )}

                        {isBacktrackActive && (
                          <line
                            x1={edge.from.x}
                            y1={edge.from.y}
                            x2={edge.to.x}
                            y2={edge.to.y}
                            className="traversal-ascent-line"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 2. Nodes Render Group */}
                <g className="tree-nodes">
                  {nodesList.map((node) => {
                    let nodeClass = 'default';
                    if (node.state) nodeClass = node.state;

                    return (
                      <g 
                        key={node.id} 
                        className="tree-circle-group"
                        style={{ transform: `translate(${node.x}px, ${node.y}px)`, transition: 'transform 0.3s' }}
                      >
                        <circle
                          r="25"
                          className={`tree-circle-bg ${nodeClass}`}
                        />
                        <text
                          className={`tree-circle-text ${nodeClass}`}
                        >
                          {node.value}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            )}
          </div>

          {/* Stepping Playback Control panel */}
          <div className="playback-controls-bar">
            <button 
              className="btn-icon" 
              onClick={() => { setIsPlaying(false); if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1); }} 
              disabled={currentStepIdx === 0}
              title="Step Backward"
            >
              <ChevronLeft size={18} />
              <span className="text-xs font-semibold ml-1">Prev</span>
            </button>

            <button
              className="btn-icon"
              onClick={togglePause}
              title={isPlaying ? "Pause Automation" : "Resume Automation"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button 
              className="btn-icon" 
              onClick={() => { setIsPlaying(false); if (currentStepIdx < steps.length - 1) setCurrentStepIdx(currentStepIdx + 1); }} 
              disabled={steps.length === 0 || currentStepIdx >= steps.length - 1}
              title="Step Forward"
            >
              <span className="text-xs font-semibold mr-1">Next</span>
              <ChevronRight size={18} />
            </button>

            <button 
              className="btn-icon" 
              onClick={handleReset} 
              title="Prune Tree"
            >
              <RefreshCw size={16} />
            </button>

            <span className="playback-tracker">
              Frame {steps.length > 0 ? currentStepIdx + 1 : 0} / {steps.length}
            </span>
          </div>

          {steps.length > 1 && (
            <div className="scrub-timeline-group">
              <input 
                type="range"
                min="0"
                max={steps.length - 1}
                value={currentStepIdx}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIdx(Number(e.target.value));
                }}
                className="scrub-timeline"
                title="Drag to Scrub Steps"
              />
            </div>
          )}
        </section>

        {/* --- Verbatim Complexity Grid verbatim image_0c0bc2.png --- */}
        <section className="image-complexity-grid">
          <div className="image-complexity-card">
            <span className="image-card-header">{isBST ? "Binary Search Tree" : "General Binary Tree"}</span>
            <span className="image-card-title">Best Case</span>
            <span className="image-card-complexity">{isBST ? "O(log n)" : "O(n)"}</span>
          </div>

          <div className="image-complexity-card">
            <span className="image-card-header">{isBST ? "Binary Search Tree" : "General Binary Tree"}</span>
            <span className="image-card-title">Average Case</span>
            <span className="image-card-complexity">{isBST ? "O(log n)" : "O(n)"}</span>
          </div>

          <div className="image-complexity-card">
            <span className="image-card-header">{isBST ? "Binary Search Tree" : "General Binary Tree"}</span>
            <span className="image-card-title">Worst Case</span>
            <span className="image-card-complexity">O(n)</span>
          </div>

          <div className="image-complexity-card">
            <span className="image-card-header">Auxiliary Space</span>
            <span className="image-card-title">Memory</span>
            <span className="image-card-complexity">O(h)</span>
          </div>
        </section>

        {/* --- Side-by-Side Code Tracker and Execution Log --- */}
        <div className="lower-content-area">
          <section className="code-section">
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Code Tracker</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-400)', textTransform: 'uppercase' }}>
                {activeConcept} ({isBST ? "BST" : "BT"})
              </span>
            </h2>
            <div className="code-block">
              <pre>
                <code>
                  {codeLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={`code-line
                        ${highlightedLine === (idx + 1) ? 'highlight' : ''}
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
            <h2 className="section-title">Execution Log Streams</h2>
            <div className="log-block" ref={logContainerRef}>
              <ul className="log-list">
                {activeStep.logs.map((log, idx) => (
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