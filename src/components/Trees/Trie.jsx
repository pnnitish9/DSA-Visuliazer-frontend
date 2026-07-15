import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, Trash2, SkipBack, SkipForward, RotateCcw, Code, Info, Network, Search, Minus } from 'lucide-react';

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
      --green-400: #4ade80;
      --green-500: #22c55e;
      --yellow-400: #facc15;
      --yellow-500: #eab308;
      --red-400: #f87171;
      --red-500: #ef4444;
      --purple-400: #c084fc;
      --purple-500: #a855f7;
      --blue-400: #60a5fa;
      --blue-500: #3b82f6;
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
    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }
    .btn-cyan { background-color: var(--cyan-600); color: white; }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-green { background-color: var(--green-600); color: white; }
    .btn-green:hover:not(:disabled) { background-color: var(--green-500); }
    .btn-red { background-color: var(--red-600); color: white; }
    .btn-red:hover:not(:disabled) { background-color: var(--red-500); }
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
    
    /* Canvas */
    .top-layout { display: flex; flex-direction: column; gap: 1rem; flex: 2; min-height: 350px; }
    .canvas-wrapper { flex: 2; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; overflow: auto; min-height: 300px; }
    
    /* Node and Edge Styling */
    .graph-node {
      position: absolute; min-width: 2.5rem; height: 2.5rem; padding: 0 0.4rem; border: 2px solid var(--border-gray-500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: monospace; font-size: 0.9rem; transform: translate(-50%, -50%); transition: left 0.5s ease, top 0.5s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, color 0.3s ease; z-index: 10; user-select: none; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    
    /* Semantic Node Colors (Based on reference image) */
    .node-root { background: #f8d7da; color: #721c24; border-color: #f5c6cb; font-size: 0.8rem; width: auto; min-width: 5.5rem; padding: 0 1rem; border-radius: 1.5rem; }
    .node-internal { background: #d4edda; color: #155724; border-color: #c3e6cb; }
    .node-terminal { background: #cce5ff; color: #004085; border-color: #b8daff; }
    
    .node-default { background: var(--bg-dark-700); color: var(--text-gray-200); }

    /* Override Animations */
    .graph-node.highlight { background: var(--cyan-400) !important; border-color: white !important; color: #000 !important; box-shadow: 0 0 15px rgba(34,211,238,0.8) !important; transform: translate(-50%, -50%) scale(1.15) !important; z-index: 12 !important;}
    .graph-node.swapping { background: var(--yellow-400) !important; color: #000 !important; border-color: white !important; box-shadow: 0 0 15px rgba(234,179,8,0.8) !important; transform: translate(-50%, -50%) scale(1.15) !important; z-index: 11 !important;}
    .graph-node.end-highlight { background: var(--green-400) !important; border-color: white !important; color: #000 !important; box-shadow: 0 0 15px rgba(34,197,94,0.8) !important; transform: translate(-50%, -50%) scale(1.2) !important; z-index: 13 !important;}
    .graph-node.target { background: var(--red-500) !important; border-color: white !important; color: white !important; box-shadow: 0 0 15px rgba(239,68,68,0.8) !important; transform: translate(-50%, -50%) scale(1.15) !important; z-index: 13 !important;}
    
    .edge-line { stroke: #216b21; stroke-width: 2.5; transition: all 0.5s ease; fill: none; }
    .edge-label-text { fill: #155724; font-size: 0.95rem; font-weight: bold; font-family: monospace; }

    /* Bottom Row: Code & Logs (Added Missing Styles) */
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 250px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--cyan-400); }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; background: var(--bg-dark-900); }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(34, 211, 238, 0.25); border-left: 3px solid var(--cyan-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; background: var(--bg-dark-900); }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-300); }
    .log-item.active { background: var(--bg-dark-700); color: var(--cyan-400); border-radius: 0.25rem; border-left: 2px solid var(--cyan-400); }
  `}</style>
);

const ALGO_CODES = {
  standard: {
    python: [
      "def insert(root, word):",
      "    curr = root",
      "    for char in word:",
      "        if char not in curr.children:",
      "            curr.children[char] = TrieNode(char)",
      "        curr = curr.children[char]",
      "    curr.is_end = True",
      "",
      "def search(root, word):",
      "    curr = root",
      "    for char in word:",
      "        if char not in curr.children:",
      "            return False",
      "        curr = curr.children[char]",
      "    return curr.is_end",
      "",
      "def delete(node, word, d=0):",
      "    if d == len(word):",
      "        if node.is_end: node.is_end = False",
      "        return len(node.children) == 0",
      "    char = word[d]",
      "    if char not in node.children: return False",
      "    if delete(node.children[char], word, d + 1):",
      "        del node.children[char]",
      "        return len(node.children) == 0 and not node.is_end",
      "    return False"
    ],
    cpp: [
      "void insert(TrieNode* root, string word) {",
      "    TrieNode* curr = root;",
      "    for (char c : word) {",
      "        if (curr->children.find(c) == curr->children.end()) {",
      "            curr->children[c] = new TrieNode(c);",
      "        }",
      "        curr = curr->children[c];",
      "    }",
      "    curr->is_end = true;",
      "}",
      "",
      "bool search(TrieNode* root, string word) {",
      "    TrieNode* curr = root;",
      "    for (char c : word) {",
      "        if (curr->children.find(c) == curr->children.end()) return false;",
      "        curr = curr->children[c];",
      "    }",
      "    return curr->is_end;",
      "}",
      "",
      "bool deleteWord(TrieNode* node, string word, int d = 0) {",
      "    if (d == word.length()) {",
      "        if (node->is_end) node->is_end = false;",
      "        return node->children.empty();",
      "    }",
      "    char c = word[d];",
      "    if (node->children.find(c) == node->children.end()) return false;",
      "    if (deleteWord(node->children[c], word, d + 1)) {",
      "        node->children.erase(c);",
      "        return node->children.empty() && !node->is_end;",
      "    }",
      "    return false;",
      "}"
    ],
    java: [
      "public void insert(TrieNode root, String word) {",
      "    TrieNode curr = root;",
      "    for (char c : word.toCharArray()) {",
      "        if (!curr.children.containsKey(c)) {",
      "            curr.children.put(c, new TrieNode(c));",
      "        }",
      "        curr = curr.children.get(c);",
      "    }",
      "    curr.isEnd = true;",
      "}",
      "",
      "public boolean search(TrieNode root, String word) {",
      "    TrieNode curr = root;",
      "    for (char c : word.toCharArray()) {",
      "        if (!curr.children.containsKey(c)) return false;",
      "        curr = curr.children.get(c);",
      "    }",
      "    return curr.isEnd;",
      "}",
      "",
      "public boolean delete(TrieNode node, String word, int d) {",
      "    if (d == word.length()) {",
      "        if (node.isEnd) node.isEnd = false;",
      "        return node.children.isEmpty();",
      "    }",
      "    char c = word.charAt(d);",
      "    if (!node.children.containsKey(c)) return false;",
      "    if (delete(node.children.get(c), word, d + 1)) {",
      "        node.children.remove(c);",
      "        return node.children.isEmpty() && !node.isEnd;",
      "    }",
      "    return false;",
      "}"
    ]
  },
  compressed: {
    python: [
      "def insert_compressed(node, word):",
      "    if not word: ",
      "        node.is_end = True",
      "        return",
      "    char = word[0]",
      "    if char not in node.children:",
      "        node.children[char] = TrieNode(word)",
      "        return",
      "    child = node.children[char]",
      "    i = 0 # Find common prefix length",
      "    while i < len(child.val) and i < len(word) and child.val[i] == word[i]: i += 1",
      "    if i == len(child.val):",
      "        insert_compressed(child, word[i:])",
      "    else:",
      "        # Split the existing edge",
      "        split_node = TrieNode(child.val[i:])",
      "        split_node.children = child.children",
      "        split_node.is_end = child.is_end",
      "        child.val = child.val[:i]",
      "        child.children = { split_node.val[0]: split_node }",
      "        child.is_end = (i == len(word))",
      "        if i < len(word):",
      "            child.children[word[i]] = TrieNode(word[i:])"
    ],
    cpp: [
      "void insert_compressed(TrieNode* node, string word) {",
      "    if (word.empty()) { node->is_end = true; return; }",
      "    char c = word[0];",
      "    if (!node->children.count(c)) { node->children[c] = new TrieNode(word); return; }",
      "    TrieNode* child = node->children[c];",
      "    int i = 0;",
      "    while (i < child->val.length() && i < word.length() && child->val[i] == word[i]) i++;",
      "    if (i == child->val.length()) {",
      "        insert_compressed(child, word.substr(i));",
      "    } else {",
      "        TrieNode* split_node = new TrieNode(child->val.substr(i));",
      "        split_node->children = child->children; split_node->is_end = child->is_end;",
      "        child->val = child->val.substr(0, i);",
      "        child->children.clear(); child->children[split_node->val[0]] = split_node;",
      "        child->is_end = (i == word.length());",
      "        if (i < word.length()) child->children[word[i]] = new TrieNode(word.substr(i));",
      "    }",
      "}"
    ],
    java: [
      "public void insertCompressed(TrieNode node, String word) {",
      "    if (word.isEmpty()) { node.isEnd = true; return; }",
      "    char c = word.charAt(0);",
      "    if (!node.children.containsKey(c)) { node.children.put(c, new TrieNode(word)); return; }",
      "    TrieNode child = node.children.get(c);",
      "    int i = 0;",
      "    while (i < child.val.length() && i < word.length() && child.val.charAt(i) == word.charAt(i)) i++;",
      "    if (i == child.val.length()) {",
      "        insertCompressed(child, word.substring(i));",
      "    } else {",
      "        TrieNode splitNode = new TrieNode(child.val.substring(i));",
      "        splitNode.children = child.children; splitNode.isEnd = child.isEnd;",
      "        child.val = child.val.substring(0, i);",
      "        child.children = new HashMap<>(); child.children.put(splitNode.val.charAt(0), splitNode);",
      "        child.isEnd = (i == word.length());",
      "        if (i < word.length()) child.children.put(word.charAt(i), new TrieNode(word.substring(i)));",
      "    }",
      "}"
    ]
  },
  suffix: {
    python: [
      "def insert_suffix_trie(root, word):",
      "    word = word + '$'",
      "    for i in range(len(word)):",
      "        curr = root",
      "        suffix = word[i:]",
      "        for char in suffix:",
      "            if char not in curr.children:",
      "                curr.children[char] = TrieNode(char)",
      "            curr = curr.children[char]",
      "        curr.is_end = True"
    ],
    cpp: [
      "void insert_suffix_trie(TrieNode* root, string word) {",
      "    word += '$';",
      "    for (int i = 0; i < word.length(); i++) {",
      "        TrieNode* curr = root;",
      "        string suffix = word.substr(i);",
      "        for (char c : suffix) {",
      "            if (curr->children.find(c) == curr->children.end()) {",
      "                curr->children[c] = new TrieNode(c);",
      "            }",
      "            curr = curr->children[c];",
      "        }",
      "        curr->is_end = true;",
      "    }",
      "}"
    ],
    java: [
      "public void insertSuffixTrie(TrieNode root, String word) {",
      "    word += \"$\";",
      "    for (int i = 0; i < word.length(); i++) {",
      "        TrieNode curr = root;",
      "        String suffix = word.substring(i);",
      "        for (char c : suffix.toCharArray()) {",
      "            if (!curr.children.containsKey(c)) {",
      "                curr.children.put(c, new TrieNode(c));",
      "            }",
      "            curr = curr.children.get(c);",
      "        }",
      "        curr.isEnd = true;",
      "    }",
      "}"
    ]
  }
};

const LINE_MAPS = {
  standard: {
    python: { init: 2, traverse: 4, create: 5, mark: 7, s_init: 10, s_fail: 13, s_traverse: 14, s_found: 15, d_init: 17, d_unmark: 19, d_not_found: 22, d_traverse: 23, d_remove: 24, d_keep: 26 },
    cpp: { init: 2, traverse: 4, create: 5, mark: 9, s_init: 13, s_fail: 15, s_traverse: 16, s_found: 18, d_init: 20, d_unmark: 22, d_not_found: 26, d_traverse: 27, d_remove: 28, d_keep: 31 },
    java: { init: 2, traverse: 4, create: 5, mark: 9, s_init: 13, s_fail: 15, s_traverse: 16, s_found: 18, d_init: 20, d_unmark: 22, d_not_found: 26, d_traverse: 27, d_remove: 28, d_keep: 31 }
  },
  compressed: {
    python: { check_empty: 2, mark_empty: 3, check_edge: 6, create_edge: 7, find_prefix: 10, recurse: 12, split: 15, remap: 19, new_leaf: 22 },
    cpp: { check_empty: 2, mark_empty: 2, check_edge: 4, create_edge: 4, find_prefix: 7, recurse: 9, split: 11, remap: 14, new_leaf: 16 },
    java: { check_empty: 2, mark_empty: 2, check_edge: 4, create_edge: 4, find_prefix: 7, recurse: 9, split: 11, remap: 14, new_leaf: 16 }
  },
  suffix: {
    python: { append: 2, loop: 3, init: 4, traverse: 7, create: 8, mark: 10 },
    cpp: { append: 2, loop: 3, init: 4, traverse: 7, create: 8, mark: 12 },
    java: { append: 2, loop: 3, init: 4, traverse: 7, create: 8, mark: 12 }
  }
};

const generateLayout = (root) => {
  const outNodes = [];
  const outEdges = [];
  let leafCount = 0;
  const gridX = {};
  
  const firstPass = (node, depth) => {
    let childKeys = Object.keys(node.children || {});
    let layoutChildren = childKeys.map(k => node.children[k]);

    if (layoutChildren.length === 0) {
      gridX[node.id] = leafCount++;
      return { maxD: depth };
    }
    
    let maxD = depth;
    for (let child of layoutChildren) {
      const res = firstPass(child, depth + 1);
      maxD = Math.max(maxD, res.maxD);
    }
    
    const firstChildId = layoutChildren[0].id;
    const lastChildId = layoutChildren[layoutChildren.length - 1].id;
    gridX[node.id] = (gridX[firstChildId] + gridX[lastChildId]) / 2;
    
    return { maxD };
  };

  const treeStats = firstPass(root, 0);
  const maxDepth = treeStats.maxD || 0;
  const totalW = Math.max(1, leafCount - 1);
  const containerWidth = Math.max(100, leafCount * 15); // Expand width dynamically for large trees

  const secondPass = (node, depth, prefix) => {
    const xPercent = leafCount <= 1 ? 50 : 10 + (gridX[node.id] / totalW) * 80;
    const yPx = 50 + depth * 75; // Increased vertical spacing
    const currentWord = depth === 0 ? "" : prefix + node.val;
    
    let colorClass = 'node-internal';
    if (depth === 0) colorClass = 'node-root';
    else if (node.isEnd) colorClass = 'node-terminal';

    outNodes.push({ 
      id: node.id, 
      val: depth === 0 ? 'Root node' : node.val, 
      isEnd: node.isEnd,
      currentWord: currentWord,
      x: xPercent, 
      y: yPx,
      colorClass: colorClass
    });
    
    let childKeys = Object.keys(node.children || {});
    let layoutChildren = childKeys.map(k => node.children[k]);

    for (let child of layoutChildren) {
      outEdges.push({ from: node.id, to: child.id, label: child.val });
      secondPass(child, depth + 1, currentWord);
    }
  };
  
  secondPass(root, 0, "");
  return { nodes: outNodes, edges: outEdges, maxDepth };
};

const generateStandardFrames = (oldRoot, word, nextIdRef, isSearch = false, isSuffix = false) => {
  const frames = [];
  const root = JSON.parse(JSON.stringify(oldRoot)); 
  let nodeStates = {};
  
  const addFrame = (msg, lineKey, overrides = {}) => {
    const layout = generateLayout(root);
    frames.push({ ...layout, nodeStates: {...nodeStates}, logMsg: msg, lineKey, ...overrides });
  };

  let curr = root;
  if (!isSearch) {
    if(!isSuffix) addFrame(`Inserting word: "${word}"`, 'init', { [curr.id]: 'highlight' });
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        curr.children[char] = { id: nextIdRef.current++, val: char, isEnd: false, children: {} };
        nodeStates = { [curr.id]: 'highlight', [curr.children[char].id]: 'highlight' };
        addFrame(`Created new node for '${char}'.`, 'create');
      } else {
        nodeStates = { [curr.id]: 'highlight', [curr.children[char].id]: 'highlight' };
        addFrame(`Node '${char}' already exists. Traversing.`, 'traverse');
      }
      curr = curr.children[char];
    }
    curr.isEnd = true;
    nodeStates = { [curr.id]: 'end-highlight' };
    addFrame(`End of word reached. Marked '${curr.val}' as end node.`, 'mark');
  } else {
    addFrame(`Searching for word: "${word}"`, 's_init', { [curr.id]: 'highlight' });
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        nodeStates = { [curr.id]: 'target' };
        addFrame(`Character '${char}' not found among children. Word does not exist in Trie.`, 's_fail');
        return frames;
      }
      curr = curr.children[char];
      nodeStates = { [curr.id]: 'highlight' };
      addFrame(`Found '${char}'. Moving down.`, 's_traverse');
    }
    if (curr.isEnd) {
      nodeStates = { [curr.id]: 'end-highlight' };
      addFrame(`Reached end of string, and node is marked as end. Found!`, 's_found');
    } else {
      nodeStates = { [curr.id]: 'target' };
      addFrame(`Reached end of string, but node is NOT marked as end. Not Found!`, 's_fail');
    }
  }
  return { frames, finalRoot: root };
};

const generateSuffixFrames = (oldRoot, word, nextIdRef) => {
  const frames = [];
  let currentRoot = JSON.parse(JSON.stringify(oldRoot));
  let nodeStates = {};
  
  const addFrame = (msg, lineKey, rootState, overrides = {}) => {
    const layout = generateLayout(rootState);
    frames.push({ ...layout, nodeStates: {...nodeStates}, logMsg: msg, lineKey, ...overrides });
  };

  const wordTerm = word + '$';
  addFrame(`Appended terminal symbol '$' -> "${wordTerm}"`, 'append', currentRoot);
  
  for (let i = 0; i < wordTerm.length; i++) {
    const suffix = wordTerm.substring(i);
    addFrame(`--- Inserting suffix: "${suffix}" ---`, 'loop', currentRoot);
    
    let curr = currentRoot;
    nodeStates = { [curr.id]: 'highlight' };
    addFrame(`Starting at root.`, 'init', currentRoot);
    
    for (let j = 0; j < suffix.length; j++) {
      const char = suffix[j];
      if (!curr.children[char]) {
        curr.children[char] = { id: nextIdRef.current++, val: char, isEnd: false, children: {} };
        nodeStates = { [curr.id]: 'highlight', [curr.children[char].id]: 'highlight' };
        addFrame(`Created node for '${char}'.`, 'create', currentRoot);
      } else {
        nodeStates = { [curr.id]: 'highlight', [curr.children[char].id]: 'highlight' };
        addFrame(`Traversed existing node '${char}'.`, 'traverse', currentRoot);
      }
      curr = curr.children[char];
    }
    curr.isEnd = true;
    nodeStates = { [curr.id]: 'end-highlight' };
    addFrame(`Finished suffix "${suffix}". Marked end.`, 'mark', currentRoot);
  }
  return { frames, finalRoot: currentRoot };
};

const generateCompressedFrames = (oldRoot, inputWord, nextIdRef) => {
  const frames = [];
  const root = JSON.parse(JSON.stringify(oldRoot));
  let nodeStates = {};
  
  const addFrame = (msg, lineKey, overrides = {}) => {
    const layout = generateLayout(root);
    frames.push({ ...layout, nodeStates: {...nodeStates}, logMsg: msg, lineKey, ...overrides });
  };

  const insertHelper = (node, word, fullWord) => {
    if (word.length === 0) {
      node.isEnd = true;
      nodeStates = { [node.id]: 'end-highlight', [`end-${node.id}`]: 'end-highlight' };
      addFrame(`Word fully consumed. Marking "${node.val || 'Null'}" as end.`, 'mark_empty');
      return;
    }
    
    let firstChar = word[0];
    addFrame(`Checking for edge starting with '${firstChar}'...`, 'check_edge', { [node.id]: 'highlight' });

    if (!node.children[firstChar]) {
      const newId = nextIdRef.current++;
      node.children[firstChar] = { id: newId, val: word, isEnd: true, children: {} };
      nodeStates = { [node.id]: 'highlight', [newId]: 'highlight' };
      addFrame(`No edge found. Created new leaf node "${word}".`, 'create_edge');
      return;
    }

    let child = node.children[firstChar];
    nodeStates = { [node.id]: 'highlight', [child.id]: 'highlight' };
    addFrame(`Found edge "${child.val}". Finding common prefix with remaining word "${word}".`, 'find_prefix');

    let i = 0;
    while (i < child.val.length && i < word.length && child.val[i] === word[i]) i++;

    if (i === child.val.length) {
      nodeStates = { [child.id]: 'highlight' };
      addFrame(`Full edge "${child.val}" matched. Traversing down with remaining "${word.substring(i)}".`, 'recurse');
      insertHelper(child, word.substring(i), fullWord);
    } else {
      nodeStates = { [child.id]: 'swapping' };
      addFrame(`Mismatch at index ${i}. Splitting edge "${child.val}" into "${child.val.substring(0, i)}" and "${child.val.substring(i)}".`, 'split');
      
      let splitNode = { 
        id: nextIdRef.current++, 
        val: child.val.substring(i), 
        isEnd: child.isEnd, 
        children: child.children 
      };
      
      child.val = child.val.substring(0, i);
      child.isEnd = false; 
      child.children = { [splitNode.val[0]]: splitNode };
      
      nodeStates = { [child.id]: 'highlight', [splitNode.id]: 'highlight' };
      addFrame(`Split complete. Remapped previous children to new branch.`, 'remap');

      if (i === word.length) {
        child.isEnd = true;
        nodeStates = { [child.id]: 'end-highlight' };
        addFrame(`Remaining word exactly matches the split prefix. Marked "${child.val}" as end.`, 'mark_empty');
      } else {
        let remainingWord = word.substring(i);
        let newLeaf = { id: nextIdRef.current++, val: remainingWord, isEnd: true, children: {} };
        child.children[remainingWord[0]] = newLeaf;
        nodeStates = { [child.id]: 'highlight', [newLeaf.id]: 'highlight' };
        addFrame(`Added remaining part "${remainingWord}" as new leaf branch.`, 'new_leaf');
      }
    }
  };

  addFrame(`Starting Compressed Trie insertion for "${inputWord}"`, 'check_empty', { [root.id]: 'highlight' });
  insertHelper(root, inputWord, inputWord);
  
  return { frames, finalRoot: root };
};

const generateStandardDeleteFrames = (oldRoot, word) => {
  const frames = [];
  const root = JSON.parse(JSON.stringify(oldRoot));
  let nodeStates = {};

  const addFrame = (msg, lineKey, overrides = {}) => {
    const layout = generateLayout(root);
    frames.push({ ...layout, nodeStates: {...nodeStates}, logMsg: msg, lineKey, ...overrides });
  };

  const deleteHelper = (node, word, depth) => {
    if (depth === word.length) {
      if (!node.isEnd) {
         addFrame(`Word "${word}" not found (not an end node).`, 'd_not_found');
         return false;
      }
      node.isEnd = false;
      nodeStates = { [node.id]: 'swapping' };
      addFrame(`Unmarked "${node.val || 'Root'}" as end of word.`, 'd_unmark');
      return Object.keys(node.children).length === 0;
    }

    const char = word[depth];
    if (!node.children[char]) {
       addFrame(`Character '${char}' not found. Word does not exist.`, 'd_not_found');
       return false;
    }

    nodeStates = { [node.id]: 'highlight', [node.children[char].id]: 'highlight' };
    addFrame(`Traversing down to '${char}'.`, 'd_traverse');

    const shouldDeleteChild = deleteHelper(node.children[char], word, depth + 1);

    if (shouldDeleteChild) {
       nodeStates = { [node.id]: 'highlight' };
       delete node.children[char];
       addFrame(`Child '${char}' is no longer needed. Removing it.`, 'd_remove');
       return Object.keys(node.children).length === 0 && !node.isEnd;
    }
    
    nodeStates = { [node.id]: 'highlight' };
    addFrame(`Child node '${char}' is part of another word or is an end node. Keeping it.`, 'd_keep');
    return false;
  };

  addFrame(`Starting deletion of "${word}"...`, 'd_init', { [root.id]: 'highlight' });
  deleteHelper(root, word, 0);

  return { frames, finalRoot: root };
};

export default function TrieVisualizer() {
  const nextId = useRef(1);
  const [trieType, setTrieType] = useState("standard");
  const [language, setLanguage] = useState("python");
  const [inputVal, setInputVal] = useState("");
  
  const [rootNode, setRootNode] = useState({ id: 0, val: "Root node", isEnd: false, children: {} });
  
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIdx(p => p + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  const handleTypeChange = (e) => {
    setTrieType(e.target.value);
    handleClear();
  };

  const executeInsertAndGetState = (word) => {
    if (trieType === 'standard') {
      return generateStandardFrames(rootNode, word, nextId, false, false);
    } else if (trieType === 'suffix') {
      const freshRoot = { id: 0, val: "Root node", isEnd: false, children: {} };
      nextId.current = 1;
      return generateSuffixFrames(freshRoot, word, nextId);
    } else if (trieType === 'compressed') {
      return generateCompressedFrames(rootNode, word, nextId);
    }
    return { frames: [], finalRoot: rootNode };
  };

  const handleInsertSafe = () => {
    if (frames.length > 0 && frameIdx < frames.length - 1) return;
    const word = inputVal.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return;
    
    const res = executeInsertAndGetState(word);
    if (res && res.frames && res.frames.length > 0) {
      setRootNode(res.finalRoot);
      setFrames(res.frames);
      setFrameIdx(0);
      setIsPlaying(true);
      setInputVal("");
    }
  };

  const handleSearch = () => {
    if (frames.length > 0 && frameIdx < frames.length - 1) return;
    const word = inputVal.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return;
    
    let newFrames = [];
    if (trieType === 'standard' || trieType === 'suffix') {
      const res = generateStandardFrames(rootNode, word, nextId, true, false);
      newFrames = res.frames;
    } else {
      // Compressed Search isn't fully implemented in frames here for brevity, 
      // falling back to standard visual check message.
      const addFrame = (msg, lineKey) => { newFrames.push({ ...generateLayout(rootNode), nodeStates: {}, logMsg: msg, lineKey }); };
      addFrame(`Search in Compressed Trie requires substring matching (O(L))...`, null);
    }
    
    if (newFrames.length > 0) {
      setFrames(newFrames);
      setFrameIdx(0);
      setIsPlaying(true);
      setInputVal("");
    }
  };

  const handleDelete = () => {
    if (frames.length > 0 && frameIdx < frames.length - 1) return;
    const word = inputVal.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return;
    
    let newFrames = [];
    let finalState = rootNode;
    
    if (trieType === 'standard') {
      const res = generateStandardDeleteFrames(rootNode, word);
      newFrames = res.frames;
      finalState = res.finalRoot;
    } else {
      const addFrame = (msg) => { newFrames.push({ ...generateLayout(rootNode), nodeStates: {}, logMsg: msg, lineKey: null }); };
      addFrame(`Delete animation is only supported for Standard Trie.`);
    }
    
    if (newFrames.length > 0) {
      setRootNode(finalState);
      setFrames(newFrames);
      setFrameIdx(0);
      setIsPlaying(true);
      setInputVal("");
    }
  };

  const handleClear = () => {
    if (frames.length > 0 && frameIdx < frames.length - 1) return;
    setRootNode({ id: 0, val: "Root node", isEnd: false, children: {} });
    setFrames([]);
    setFrameIdx(-1);
    setIsPlaying(false);
    nextId.current = 1;
  };

  const isLocked = isPlaying || (frames.length > 0 && frameIdx < frames.length - 1);
  
  // Render Defaults
  let defaultLayout = { nodes: [], edges: [] };
  if (frames.length === 0) defaultLayout = generateLayout(rootNode);
  
  const currFrame = frames[frameIdx] || { ...defaultLayout, nodeStates: {}, logMsg: 'Ready. Insert words to build Trie.', lineKey: null };
  const highlightLine = currFrame.lineKey ? LINE_MAPS[trieType][language][currFrame.lineKey] : -1;
  const canvasHeight = Math.max(350, (currFrame.maxDepth || 0) * 75 + 120);
  
  // Calculate width required to prevent overlap on large trees
  const treeLeafCount = currFrame.nodes.filter(n => !currFrame.edges.some(e => e.from === n.id)).length;
  const canvasWidthPercent = Math.max(100, treeLeafCount * 15);

  const currentWordsList = currFrame.nodes.filter(n => n.isEnd && n.id !== 0).map(n => n.currentWord);
  const uniqueWords = [...new Set(currentWordsList)];

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* Sidebar */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><Network size={24} /> Trie Visualizer</h1>
        
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
          <label>Trie Variant</label>
          <select value={trieType} onChange={handleTypeChange} className="input-field" disabled={isLocked}>
            <option value="standard">Standard Trie (Prefix Trie)</option>
            <option value="compressed">Compressed Trie (Radix/Patricia)</option>
            <option value="suffix">Suffix Trie (Single Word)</option>
          </select>
        </div>

        <div className="complexity-box">
          <div className="comp-item"><span className="comp-label">Time (Insert/Search)</span> <span className="comp-val">O(L)</span></div>
          <div className="comp-item"><span className="comp-label">Space</span> <span className="comp-val">{trieType==='compressed'?'O(N)':'O(N * L)'}</span></div>
          <span style={{fontSize:'0.6rem', color:'var(--text-gray-500)', marginTop:'0.2rem'}}>L = Length of word, N = Number of words</span>
        </div>

        <hr style={{ borderColor: 'var(--border-gray-700)', margin: '1rem 0' }} />

        {/* Action Panel */}
        <div className="action-panel" style={{background: 'var(--bg-dark-950)'}}>
          <div className="panel-header">Trie Operations</div>
          
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <input type="text" placeholder="Word (a-z, max 8)" maxLength="8" value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsertSafe()} className="input-field" disabled={isLocked} />
          </div>
          
          <div className="row-flex" style={{marginBottom: '0.75rem'}}>
            <button onClick={handleInsertSafe} className="btn btn-green" disabled={isLocked || !inputVal}><Plus size={16}/> Insert</button>
            <button onClick={handleSearch} className="btn btn-cyan" disabled={isLocked || !inputVal || trieType==='compressed'}><Search size={16}/> Search</button>
            <button onClick={handleDelete} className="btn btn-red" disabled={isLocked || !inputVal || trieType==='compressed' || trieType==='suffix'}><Minus size={16}/> Delete</button>
          </div>

          <div className="row-flex">
            <button onClick={handleClear} className="btn btn-red" disabled={isLocked}><Trash2 size={14}/> Clear Tree</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
        </div>

        <div className="top-layout">
          {/* Canvas */}
          <div className="canvas-wrapper">
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', zIndex:5, fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold'}}>
              TRIE GRAPH {trieType==='compressed'&&'(SUBSTRINGS ON NODES)'}
            </div>
            
            {/* Word List Panel */}
            {uniqueWords.length > 0 && (
              <div style={{ position: 'absolute', top: '2.5rem', left: '0.5rem', zIndex: 10, background: 'var(--bg-dark-950)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-gray-700)', minWidth: '100px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: 'var(--text-gray-400)', textTransform: 'uppercase' }}>Inserted Words</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.85rem', color: 'var(--green-400)', fontWeight: 'bold' }}>
                    {uniqueWords.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
            )}

            <div style={{ position: 'relative', minWidth: `${canvasWidthPercent}%`, height: `${canvasHeight}px` }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1, minWidth: '100%'}}>
                <defs>
                   <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
                     <path d="M 0 2 L 8 5 L 0 8 z" fill="#216b21"/>
                   </marker>
                </defs>
                {}
                {currFrame.edges.map((e, idx) => {
                  const fn = currFrame.nodes.find(n => n.id === e.from);
                  const tn = currFrame.nodes.find(n => n.id === e.to);
                  if (!fn || !tn) return null;
                  const midX = (fn.x + tn.x) / 2;
                  const midY = (fn.y + tn.y) / 2;
                  return (
                    <g key={`edge-${idx}`}>
                      <line x1={`${fn.x}%`} y1={fn.y} x2={`${tn.x}%`} y2={tn.y} className="edge-line" markerEnd="url(#arrow)" />
                      <text x={`${midX}%`} y={midY} dx="10" dy="-5" className="edge-label-text">{e.label}</text>
                    </g>
                  );
                })}
              </svg>

              {}
              {currFrame.nodes.map(node => (
                <div key={node.id} className={`graph-node ${node.colorClass} ${currFrame.nodeStates[node.id] || ''}`} style={{left: `${node.x}%`, top: `${node.y}px`}}>
                  {node.val}
                  {node.isEnd && (
                    <span style={{ position: 'absolute', top: '100%', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-gray-400)', fontWeight: 'normal', pointerEvents: 'none' }}>
                      {node.currentWord}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {currFrame.nodes.length === 1 && (
               <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-gray-600)', fontStyle: 'italic', fontSize: '0.9rem'}}>Trie is empty. Insert words to begin.</div>
            )}
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
                {}
                {ALGO_CODES[trieType][language].map((line, idx) => {
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
                  return (
                    <div key={idx} className={`code-line ${highlightLine === (idx + 1) ? 'highlight' : ''}`} style={isComment ? {color: 'var(--text-gray-500)', fontStyle: 'italic'} : {}}>
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </code></pre>
          </div>
          
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><Info size={14}/> Execution Log</div>
             <ul className="log-content">
               {}
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