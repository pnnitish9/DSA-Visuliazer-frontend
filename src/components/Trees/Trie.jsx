import React, { useState, useRef, useEffect } from 'react';
import { List, Pause, Play, RefreshCw, Search, ArrowRight, X, Shuffle, StepForward, StepBack, Type } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; 

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

    /* --- Main Layout --- */
    .visualizer-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    @media (min-width: 1024px) {
      .visualizer-container { flex-direction: row; }
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
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 2rem 0;
      color: var(--cyan-400);
      display: flex;
      align-items: center;
    }
    .sidebar-title svg { margin-right: 0.75rem; }

    /* --- Form Elements --- */
    .input-group { margin-bottom: 1rem; }
    .input-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
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

    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }

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
      .main-content { padding: 2.5rem; }
    }
    .section-title {
      font-size: 1.5rem;
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
    .status-text { font-size: 1.125rem; font-weight: 500; transition: color 0.3s; }
    .status-default { color: var(--cyan-400); }
    .status-found { color: var(--green-400); }
    .status-not-found { color: var(--red-400); }
    .status-paused { color: var(--yellow-400); }

    /* --- Trie Specific Visualization --- */
    .trie-container {
      flex: 1;
      width: 100%;
      min-height: 500px;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      position: relative;
      padding: 2rem;
      display: flex;
      justify-content: center;
    }

    .trie-canvas {
      position: relative;
      /* Dimensions are set dynamically by inline styles based on tree width */
    }

    .trie-node-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      transition: left 0.4s ease-in-out, top 0.4s ease-in-out;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
    }

    .trie-node {
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      border-radius: 50%; /* Circle for Trie */
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      border: 2px solid transparent;
      position: relative;
      text-transform: uppercase;
    }

    .trie-node.is-null {
      font-size: 1.1rem;
      text-transform: none;
    }

    .trie-node.default {
      background-color: var(--bg-dark-600);
      color: white;
      border-color: var(--border-gray-500);
    }

    .trie-node.visiting {
      background-color: var(--yellow-500);
      color: black;
      transform: scale(1.15);
      border-color: var(--yellow-400);
    }
    
    .trie-node.pre-op {
      background-color: var(--orange-500);
      color: white;
      transform: scale(1.15);
      border-color: var(--orange-600);
    }

    .trie-node.found {
      background-color: var(--green-500);
      color: white;
      transform: scale(1.15);
      border-color: var(--green-400);
      box-shadow: 0 0 15px var(--green-500);
    }

    .trie-node.deleting {
      background-color: var(--red-600);
      color: white;
      transform: scale(0.8);
      opacity: 0.5;
      border-color: var(--red-400);
    }

    .node-label {
      position: absolute;
      top: -24px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--cyan-400);
      white-space: nowrap;
    }
    
    .legend-container {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--bg-dark-900);
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 5;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-gray-300);
    }
    
    .legend-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
    }

    /* --- Playback Controls Bar --- */
    .playback-controls-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 1rem 1.5rem;
      background-color: var(--bg-dark-800);
      border-radius: 0.5rem;
      margin-top: 1rem;
      border: 1px solid var(--border-gray-700);
    }
    .playback-controls-bar .btn { min-width: 90px; }
    .step-indicator {
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-gray-200);
      min-width: 80px;
      text-align: center;
    }

    /* --- Complexity Analysis --- */
    .complexity-bar {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 2rem;
    }
    @media (min-width: 768px) {
      .complexity-bar { grid-template-columns: repeat(4, 1fr); }
    }
    .complexity-card {
      background-color: var(--bg-dark-950);
      border: 1px solid var(--border-gray-700);
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    }
    .complexity-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-gray-400);
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .complexity-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--cyan-400);
      font-family: 'Fira Code', 'Courier New', monospace;
    }

    /* --- Lower Content Area --- */
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

    /* --- Code Area --- */
    .code-section {
      display: flex;
      flex-direction: column;
      flex: 1; 
      min-height: 300px;
      width: 100%;
      max-width: 100%;
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
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .code-line {
      display: block;
      padding: 0 0.5rem;
      transition: background-color 0.2s;
      min-height: 1.5em;
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
      .log-block { max-height: 300px; }
    }
    .log-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.85rem;
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

const codeSnippets = {
  python: {
    base: `
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
`,
    insert: `
    def insert(self, word: str) -> None:
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True
`,
    search: `
    def search(self, word: str) -> bool:
        current = self.root
        for char in word:
            if char not in current.children:
                return False
            current = current.children[char]
        return current.is_end_of_word
`,
    startsWith: `
    def startsWith(self, prefix: str) -> bool:
        current = self.root
        for char in prefix:
            if char not in current.children:
                return False
            current = current.children[char]
        return True
`,
    delete: `
    def delete(self, word: str) -> bool:
        def dfs(node, word, depth):
            if depth == len(word):
                if not node.is_end_of_word:
                    return False
                node.is_end_of_word = False
                return len(node.children) == 0
            
            char = word[depth]
            if char not in node.children:
                return False
                
            should_delete_child = dfs(node.children[char], word, depth + 1)
            
            if should_delete_child:
                del node.children[char]
                return len(node.children) == 0 and not node.is_end_of_word
            
            return False
            
        dfs(self.root, word, 0)
`
  },
  
  c: {
    base: `
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

#define ALPHABET_SIZE 26

struct TrieNode {
    struct TrieNode *children[ALPHABET_SIZE];
    bool isEndOfWord;
};

struct TrieNode *getNode(void) {
    struct TrieNode *pNode = NULL;
    pNode = (struct TrieNode *)malloc(sizeof(struct TrieNode));
    if (pNode) {
        pNode->isEndOfWord = false;
        for (int i = 0; i < ALPHABET_SIZE; i++)
            pNode->children[i] = NULL;
    }
    return pNode;
}

struct TrieNode *root;
`,
    insert: `
void insert(const char *word) {
    int length = strlen(word);
    int index;
    struct TrieNode *current = root;

    for (int level = 0; level < length; level++) {
        index = word[level] - 'a';
        if (!current->children[index]) {
            current->children[index] = getNode();
        }
        current = current->children[index];
    }
    current->isEndOfWord = true;
}
`,
    search: `
bool search(const char *word) {
    int length = strlen(word);
    int index;
    struct TrieNode *current = root;

    for (int level = 0; level < length; level++) {
        index = word[level] - 'a';
        if (!current->children[index]) {
            return false;
        }
        current = current->children[index];
    }
    return (current != NULL && current->isEndOfWord);
}
`,
    startsWith: `
bool startsWith(const char *prefix) {
    int length = strlen(prefix);
    int index;
    struct TrieNode *current = root;

    for (int level = 0; level < length; level++) {
        index = prefix[level] - 'a';
        if (!current->children[index]) {
            return false;
        }
        current = current->children[index];
    }
    return true;
}
`,
    delete: `
bool isNodeEmpty(struct TrieNode *node) {
    for (int i = 0; i < ALPHABET_SIZE; i++)
        if (node->children[i]) return false;
    return true;
}

struct TrieNode* deleteHelper(struct TrieNode *node, const char *word, int depth) {
    if (!node) return NULL;

    if (depth == strlen(word)) {
        if (node->isEndOfWord) node->isEndOfWord = false;
        if (isNodeEmpty(node)) {
            free(node);
            node = NULL;
        }
        return node;
    }
    
    int index = word[depth] - 'a';
    node->children[index] = deleteHelper(node->children[index], word, depth + 1);

    if (isNodeEmpty(node) && node->isEndOfWord == false) {
        free(node);
        node = NULL;
    }
    return node;
}

void deleteWord(const char *word) {
    deleteHelper(root, word, 0);
}
`
  },
  
  cpp: {
    base: `
#include <iostream>
#include <unordered_map>
#include <string>

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    
    TrieNode() {
        isEndOfWord = false;
    }
};

class Trie {
public:
    TrieNode* root;
    Trie() {
        root = new TrieNode();
    }
`,
    insert: `
    void insert(std::string word) {
        TrieNode* current = root;
        for (char c : word) {
            if (current->children.find(c) == current->children.end()) {
                current->children[c] = new TrieNode();
            }
            current = current->children[c];
        }
        current->isEndOfWord = true;
    }
`,
    search: `
    bool search(std::string word) {
        TrieNode* current = root;
        for (char c : word) {
            if (current->children.find(c) == current->children.end()) {
                return false;
            }
            current = current->children[c];
        }
        return current->isEndOfWord;
    }
`,
    startsWith: `
    bool startsWith(std::string prefix) {
        TrieNode* current = root;
        for (char c : prefix) {
            if (current->children.find(c) == current->children.end()) {
                return false;
            }
            current = current->children[c];
        }
        return true;
    }
`,
    delete: `
private:
    bool deleteHelper(TrieNode* node, std::string word, int depth) {
        if (depth == word.size()) {
            if (!node->isEndOfWord) return false;
            node->isEndOfWord = false;
            return node->children.empty();
        }
        
        char c = word[depth];
        if (node->children.find(c) == node->children.end()) return false;
        
        bool shouldDeleteChild = deleteHelper(node->children[c], word, depth + 1);
        
        if (shouldDeleteChild) {
            delete node->children[c];
            node->children.erase(c);
            return node->children.empty() && !node->isEndOfWord;
        }
        return false;
    }

public:
    void deleteWord(std::string word) {
        deleteHelper(root, word, 0);
    }
};
`
  },
  
  java: {
    base: `
import java.util.HashMap;
import java.util.Map;

class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEndOfWord;

    public TrieNode() {
        children = new HashMap<>();
        isEndOfWord = false;
    }
}

class Trie {
    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }
`,
    insert: `
    public void insert(String word) {
        TrieNode current = root;
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }
        current.isEndOfWord = true;
    }
`,
    search: `
    public boolean search(String word) {
        TrieNode current = root;
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);
            TrieNode node = current.children.get(ch);
            if (node == null) {
                return false;
            }
            current = node;
        }
        return current.isEndOfWord;
    }
`,
    startsWith: `
    public boolean startsWith(String prefix) {
        TrieNode current = root;
        for (int i = 0; i < prefix.length(); i++) {
            char ch = prefix.charAt(i);
            TrieNode node = current.children.get(ch);
            if (node == null) {
                return false;
            }
            current = node;
        }
        return true;
    }
`,
    delete: `
    private boolean deleteHelper(TrieNode current, String word, int index) {
        if (index == word.length()) {
            if (!current.isEndOfWord) return false;
            current.isEndOfWord = false;
            return current.children.isEmpty();
        }
        
        char ch = word.charAt(index);
        TrieNode node = current.children.get(ch);
        if (node == null) return false;
        
        boolean shouldDeleteCurrentNode = deleteHelper(node, word, index + 1);
        
        if (shouldDeleteCurrentNode) {
            current.children.remove(ch);
            return current.children.isEmpty() && !current.isEndOfWord;
        }
        return false;
    }

    public void delete(String word) {
        deleteHelper(root, word, 0);
    }
}
`
  }
};

const complexities = {
  base: { best: "-", avg: "-", worst: "-", space: "-" },
  insert: { best: "O(L)", avg: "O(L)", worst: "O(L)", space: "O(L)" },
  search: { best: "O(1)", avg: "O(L)", worst: "O(L)", space: "O(1)" },
  startsWith: { best: "O(1)", avg: "O(L)", worst: "O(L)", space: "O(1)" },
  delete: { best: "O(L)", avg: "O(L)", worst: "O(L)", space: "O(L) recursive" }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Deep clone for the nested Trie object to snapshot states
const deepCloneTrie = (node) => {
    const clone = { ...node, children: {} };
    for (const char in node.children) {
        clone.children[char] = deepCloneTrie(node.children[char]);
    }
    return clone;
};

// Tree Layout Algorithm (Leaf-count based to avoid overlap)
const countLeaves = (node) => {
    const keys = Object.keys(node.children);
    let leafCount = 0;
    if (node.isEndOfWord) leafCount += 1; // '$' node acts as a leaf
    for (const k of keys) {
        leafCount += countLeaves(node.children[k]);
    }
    return Math.max(1, leafCount);
};

const SPACING_X = 85; // Increased horizontal spacing
const SPACING_Y = 100; // Increased vertical spacing

const getTextColor = (bgColor) => {
    if (!bgColor) return 'white';
    // Use dark text for light node colors
    const lightColors = ['#facc15', '#d1d5db', '#84cc16'];
    return lightColors.includes(bgColor) ? '#111827' : 'white';
};

const buildRenderData = (node, startX, y, color = null, resultNodes = [], resultEdges = []) => {
    const leaves = countLeaves(node);
    const width = leaves * SPACING_X;
    const myX = startX + width / 2;
    
    let nodeColor = color;
    if (node.id === 'root') nodeColor = '#d1d5db'; // Gray for root
    
    resultNodes.push({
        ...node,
        x: myX,
        y: y,
        bgColor: nodeColor
    });

    let currentX = startX;
    const NODE_RADIUS = 28; // 3.5rem / 2
    
    // Helper to calculate exact boundary connection points
    const addEdge = (childId, childX, childY) => {
        const dx = childX - myX;
        const dy = childY - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const ratio = dist === 0 ? 0 : NODE_RADIUS / dist;
        
        resultEdges.push({
            id: `e-${node.id}-${childId}`,
            x1: myX + dx * ratio,
            y1: y + dy * ratio,
            x2: childX - dx * ratio,
            y2: childY - dy * ratio
        });
    };

    // Render '$' child first if this node marks the end of a word
    if (node.isEndOfWord) {
        const childWidth = 1 * SPACING_X;
        const childX = currentX + childWidth / 2;
        const childY = y + SPACING_Y;
        
        addEdge('dollar', childX, childY);
        
        resultNodes.push({
            id: `${node.id}-dollar`,
            char: '$',
            x: childX,
            y: childY,
            bgColor: '#84cc16', // Green for '$'
            state: node.state === 'deleting' ? 'deleting' : 'default'
        });
        
        currentX += childWidth;
    }

    const keys = Object.keys(node.children).sort();
    const palette = ['#3b82f6', '#ef4444', '#facc15', '#a855f7', '#ec4899', '#f97316', '#14b8a6'];
    
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const child = node.children[key];
        const childLeaves = countLeaves(child);
        const childWidth = childLeaves * SPACING_X;
        const childX = currentX + childWidth / 2;
        const childY = y + SPACING_Y;
        
        let childColor = color;
        if (node.id === 'root') {
            childColor = palette[i % palette.length]; // Assign branch color at root children
        }
        
        addEdge(child.id, childX, childY);
        buildRenderData(child, currentX, childY, childColor, resultNodes, resultEdges);
        
        currentX += childWidth;
    }
    
    return { nodes: resultNodes, edges: resultEdges, totalWidth: width };
};


export default function TrieVisualizer() {
  const getInitialTrie = () => ({
      id: 'root',
      char: 'Null',
      isEndOfWord: false,
      children: {},
      state: 'default'
  });

  const [trieRoot, setTrieRoot] = useState(getInitialTrie());
  const [word, setWord] = useState("");
  
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Create a Trie by inserting words.");
  const [executionLog, setExecutionLog] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [currentOperation, setCurrentOperation] = useState('base');
  
  const [frames, setFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isVisualizing = frames.length > 0 && currentFrameIdx < frames.length - 1;
  const [error, setError] = useState(null);

  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);
  
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

  useEffect(() => {
    if (frames.length > 0 && currentFrameIdx >= 0 && currentFrameIdx < frames.length) {
        const frame = frames[currentFrameIdx];
        setTrieRoot(frame.trie);
        setStatus(frame.status);
        setExecutionLog(frame.log);
    }
  }, [currentFrameIdx, frames]);

  const resetAllStates = (root) => {
      root.state = 'default';
      for(let k in root.children) {
          resetAllStates(root.children[k]);
      }
  };

  const getCleanWord = () => {
      const w = word.trim().toLowerCase();
      if (!w) { setError("Please enter a valid word (letters only)."); return null; }
      if (!/^[a-z]+$/.test(w)) { setError("Only alphabetical characters (a-z) are supported."); return null; }
      return w;
  };

  const runOperation = (opName, frameGen) => {
      setError(null);
      setCurrentOperation(opName);
      const newFrames = frameGen();
      if (!newFrames || newFrames.length === 0) return;
      
      setFrames(newFrames);
      setCurrentFrameIdx(0);
      setIsPlaying(true);
      setWord("");
  };

  const handleInsert = () => {
      const w = getCleanWord();
      if (!w) return;
      
      runOperation('insert', () => {
          const f = [];
          let currTrie = deepCloneTrie(trieRoot);
          resetAllStates(currTrie);
          let currLog = [...executionLog, `Inserting word: "${w}"`];
          
          currTrie.state = 'visiting';
          f.push({ trie: deepCloneTrie(currTrie), status: `Start at root...`, log: currLog });
          
          let currentNode = currTrie;
          
          for (let i = 0; i < w.length; i++) {
              const char = w[i];
              currentNode.state = 'default';
              
              if (!currentNode.children[char]) {
                  currLog = [...currLog, `Char '${char}' not found. Creating new node.`];
                  f.push({ trie: deepCloneTrie(currTrie), status: `Char '${char}' not found. Creating new node.`, log: currLog });
                  
                  currentNode.children[char] = {
                      id: uuidv4(),
                      char: char,
                      isEndOfWord: false,
                      children: {},
                      state: 'pre-op'
                  };
              } else {
                  currLog = [...currLog, `Char '${char}' found. Traversing down.`];
                  currentNode.children[char].state = 'visiting';
                  f.push({ trie: deepCloneTrie(currTrie), status: `Char '${char}' found. Moving to child.`, log: currLog });
              }
              
              currentNode = currentNode.children[char];
              currentNode.state = 'visiting';
              f.push({ trie: deepCloneTrie(currTrie), status: `At node '${char}'...`, log: currLog });
          }
          
          currentNode.isEndOfWord = true;
          currentNode.state = 'found';
          currLog = [...currLog, `Reached end of word. Marked '${w[w.length-1]}' as End Of Word.`];
          f.push({ trie: deepCloneTrie(currTrie), status: `Inserted "${w}" successfully!`, log: currLog });
          
          resetAllStates(currTrie);
          f.push({ trie: deepCloneTrie(currTrie), status: `Inserted "${w}" successfully!`, log: currLog });
          return f;
      });
  };

  const handleSearch = (isPrefixSearch = false) => {
      const w = getCleanWord();
      if (!w) return;
      
      const opName = isPrefixSearch ? 'startsWith' : 'search';
      
      runOperation(opName, () => {
          const f = [];
          let currTrie = deepCloneTrie(trieRoot);
          resetAllStates(currTrie);
          let currLog = [...executionLog, `${isPrefixSearch ? 'Prefix search' : 'Searching'} for: "${w}"`];
          
          currTrie.state = 'visiting';
          f.push({ trie: deepCloneTrie(currTrie), status: `Start at root...`, log: currLog });
          
          let currentNode = currTrie;
          let found = true;
          
          for (let i = 0; i < w.length; i++) {
              const char = w[i];
              currentNode.state = 'default';
              
              if (!currentNode.children[char]) {
                  currLog = [...currLog, `Char '${char}' NOT found.`];
                  f.push({ trie: deepCloneTrie(currTrie), status: `Char '${char}' NOT found. Stopping search.`, log: currLog });
                  found = false;
                  break;
              }
              
              currentNode = currentNode.children[char];
              currentNode.state = 'visiting';
              currLog = [...currLog, `Found char '${char}'. Traversing down.`];
              f.push({ trie: deepCloneTrie(currTrie), status: `Found char '${char}'. Moving to child.`, log: currLog });
          }
          
          if (found) {
              if (isPrefixSearch) {
                  currentNode.state = 'found';
                  currLog = [...currLog, `Prefix "${w}" exists in Trie!`];
                  f.push({ trie: deepCloneTrie(currTrie), status: `Prefix "${w}" exists!`, log: currLog });
              } else {
                  if (currentNode.isEndOfWord) {
                      currentNode.state = 'found';
                      currLog = [...currLog, `Word "${w}" exists in Trie (End of Word is true)!`];
                      f.push({ trie: deepCloneTrie(currTrie), status: `Word "${w}" found!`, log: currLog });
                  } else {
                      currentNode.state = 'pre-op';
                      currLog = [...currLog, `Node '${w[w.length-1]}' found, but it is NOT marked as End of Word.`];
                      f.push({ trie: deepCloneTrie(currTrie), status: `Word "${w}" NOT found (only exists as prefix).`, log: currLog });
                  }
              }
          } else {
              currLog = [...currLog, `"${w}" NOT found in Trie.`];
              f.push({ trie: deepCloneTrie(currTrie), status: `"${w}" NOT found.`, log: currLog });
          }
          
          resetAllStates(currTrie);
          f.push({ trie: deepCloneTrie(currTrie), status: f[f.length-1].status, log: currLog });
          return f;
      });
  };

  const handleDelete = () => {
      const w = getCleanWord();
      if (!w) return;
      
      runOperation('delete', () => {
          const f = [];
          let currTrie = deepCloneTrie(trieRoot);
          resetAllStates(currTrie);
          let currLog = [...executionLog, `Deleting word: "${w}"`];
          
          const path = []; // Stack to trace back for deletion
          let currentNode = currTrie;
          path.push({ char: '*', node: currentNode, parent: null });
          
          currTrie.state = 'visiting';
          f.push({ trie: deepCloneTrie(currTrie), status: `Traversing to find "${w}"...`, log: currLog });
          
          let exists = true;
          for (let i = 0; i < w.length; i++) {
              const char = w[i];
              currentNode.state = 'default';
              
              if (!currentNode.children[char]) {
                  exists = false;
                  break;
              }
              
              let nextNode = currentNode.children[char];
              path.push({ char, node: nextNode, parent: currentNode });
              currentNode = nextNode;
              
              currentNode.state = 'visiting';
              f.push({ trie: deepCloneTrie(currTrie), status: `Traversing down '${char}'...`, log: currLog });
          }
          
          if (!exists || !currentNode.isEndOfWord) {
              currLog = [...currLog, `Word "${w}" not found. Cannot delete.`];
              f.push({ trie: deepCloneTrie(currTrie), status: `Word "${w}" not found. Cannot delete.`, log: currLog });
              resetAllStates(currTrie);
              f.push({ trie: deepCloneTrie(currTrie), status: `Word "${w}" not found.`, log: currLog });
              return f;
          }
          
          // Step 1: Unmark End Of Word
          currentNode.isEndOfWord = false;
          currentNode.state = 'deleting';
          currLog = [...currLog, `Found word "${w}". Unmarking End of Word.`];
          f.push({ trie: deepCloneTrie(currTrie), status: `Unmarking End of Word.`, log: currLog });
          
          // Step 2: Delete bottom-up if no children
          for (let i = path.length - 1; i > 0; i--) {
              let currentPathNode = path[i].node;
              let parentNode = path[i].parent;
              let char = path[i].char;
              
              if (Object.keys(currentPathNode.children).length === 0 && !currentPathNode.isEndOfWord) {
                  currentPathNode.state = 'deleting';
                  currLog = [...currLog, `Node '${char}' has no children and is not End of Word. Deleting...`];
                  f.push({ trie: deepCloneTrie(currTrie), status: `Cleaning up empty node '${char}'.`, log: currLog });
                  
                  delete parentNode.children[char];
              } else {
                  currLog = [...currLog, `Node '${char}' is needed by other words. Stopping deletion.`];
                  f.push({ trie: deepCloneTrie(currTrie), status: `Node '${char}' is shared. Done cleaning.`, log: currLog });
                  break; 
              }
          }
          
          currLog = [...currLog, `Deleted "${w}" successfully.`];
          resetAllStates(currTrie);
          f.push({ trie: deepCloneTrie(currTrie), status: `Deleted "${w}" successfully.`, log: currLog });
          
          return f;
      });
  };

  const handleReset = () => {
    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);
    
    setTrieRoot(getInitialTrie());
    setWord("");
    setError(null);
    setStatus("Create a Trie by inserting words.");
    setHighlightLineNum(-1);
    setCurrentOperation('base');
    setExecutionLog([]);
  };
  
  const handleGenerateRandom = () => {
    const randomWords = ["cat", "car", "cart", "dog", "dove", "ant", "and"];
    // Select 3 to 5 random words
    const numWords = Math.floor(Math.random() * 3) + 3;
    const selected = [];
    for(let i=0; i<numWords; i++) {
        selected.push(randomWords[Math.floor(Math.random() * randomWords.length)]);
    }
    const uniqueSelected = [...new Set(selected)];
    
    // Quick build logic without animation
    let newRoot = getInitialTrie();
    for (const w of uniqueSelected) {
        let current = newRoot;
        for (const char of w) {
            if (!current.children[char]) {
                current.children[char] = { id: uuidv4(), char, isEndOfWord: false, children: {}, state: 'default' };
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
    }
    
    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);
    setTrieRoot(newRoot);
    setWord("");
    setError(null);
    setStatus(`Generated random Trie with words: ${uniqueSelected.join(", ")}`);
    setCurrentOperation('base');
    setExecutionLog([`Generated random words: ${uniqueSelected.join(", ")}`]);
  };

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
  
  const currentCode = codeSnippets[language][currentOperation] || codeSnippets[language].base;
  const codeLines = currentCode.trim().split('\n');
  const currentComplexity = complexities[currentOperation] || complexities.base;
  
  const statusColor = status.includes("successfully") || status.includes("exists") || status.includes("found!")
    ? "status-found"
    : status.includes("NOT found") || status.includes("not found") || status.includes("Cannot delete")
    ? "status-not-found"
    : (!isPlaying && frames.length > 0 && currentFrameIdx < frames.length - 1)
    ? "status-paused"
    : "status-default";

  const PADDING = 50;
  const { nodes: renderNodes, edges: renderEdges, totalWidth } = buildRenderData(trieRoot, PADDING, 40);
  const canvasWidth = totalWidth + (PADDING * 2);
  const maxDepthY = renderNodes.reduce((max, n) => Math.max(max, n.y), 0);
  const canvasHeight = Math.max(400, maxDepthY + 100);

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <Type size={30} />
          Trie Visualizer
        </h1>

        <div className="input-grid">
            <div className="input-group">
              <label htmlFor="word">Word / Prefix (a-z lowercase)</label>
              <input
                id="word"
                type="text"
                placeholder="e.g., apple"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                disabled={isVisualizing}
                className="input-field"
              />
            </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <div className="actions-grid">
            <button onClick={handleInsert} disabled={isVisualizing || !word} className="btn btn-green">Insert Word</button>
            <button onClick={handleDelete} disabled={isVisualizing || !word} className="btn btn-red">Delete Word</button>
        </div>
        <div className="actions-grid">
            <button onClick={() => handleSearch(false)} disabled={isVisualizing || !word} className="btn btn-cyan">Search Word</button>
            <button onClick={() => handleSearch(true)} disabled={isVisualizing || !word} className="btn btn-cyan" style={{fontSize: '0.8rem'}}>Search Prefix</button>
        </div>
        
        <hr style={{borderColor: 'var(--border-gray-700)', margin: '1.5rem 0'}} />

        <div className="actions-grid">
          <button onClick={handleReset} className="btn btn-secondary">
            <RefreshCw size={18} /> Reset Trie
          </button>
          <button onClick={handleGenerateRandom} disabled={isVisualizing} className="btn btn-purple">
            <Shuffle size={18} /> Random Trie
          </button>
        </div>

        <div className="input-group">
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
            <span className={`status-text ${statusColor}`}>{status}</span>
          </div>
          
          <div className="trie-container">
            {Object.keys(trieRoot.children).length === 0 && <span style={{color: 'var(--text-gray-500)', position: 'absolute', top: '50%'}}>Trie is empty.</span>}
            
            {Object.keys(trieRoot.children).length > 0 && (
              <React.Fragment>
                <div className="legend-container">
                    <div className="legend-item">
                        <div className="legend-circle" style={{backgroundColor: '#84cc16', color: '#111827'}}>$</div> 
                        End Of Word
                    </div>
                    <div className="legend-item"><div className="legend-circle" style={{backgroundColor: 'var(--yellow-500)'}}></div> Traversing Node</div>
                    <div className="legend-item"><div className="legend-circle" style={{backgroundColor: 'var(--green-500)'}}></div> Found Node</div>
                </div>

                {}
                <div className="trie-canvas" style={{ width: canvasWidth, height: canvasHeight, margin: '0 auto' }}>
                  {/* Edges Layer */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                    <defs>
                      <marker id="arrow" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="7" markerHeight="7" orient="auto">
                        <path d="M0,-5 L10,0 L0,5" fill="#9ca3af" />
                      </marker>
                    </defs>
                    {renderEdges.map(edge => (
                      <line 
                        key={edge.id}
                        x1={edge.x1} y1={edge.y1}
                        x2={edge.x2} y2={edge.y2}
                        stroke="#9ca3af"
                        strokeWidth="2.5"
                        markerEnd="url(#arrow)"
                      />
                    ))}
                  </svg>
                  
                  {/* Nodes Layer */}
                  {renderNodes.map(node => (
                    <div 
                      key={node.id} 
                      className="trie-node-wrapper"
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    >
                      <div 
                        className={`trie-node ${node.state} ${node.char === 'Null' ? 'is-null' : ''}`}
                        style={node.state === 'default' && node.bgColor ? { 
                          backgroundColor: node.bgColor, 
                          color: getTextColor(node.bgColor),
                          borderColor: '#111827'
                        } : {}}
                      >
                        {node.char}
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
          
          <div className="playback-controls-bar">
            <button onClick={handlePrev} disabled={frames.length === 0 || currentFrameIdx === 0} className="btn btn-secondary">
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
            <button onClick={handleNext} disabled={frames.length === 0 || currentFrameIdx === frames.length - 1} className="btn btn-secondary">
              Next <StepForward size={16} />
            </button>
          </div>
        </section>

        {/* --- Complexity Analysis --- */}
        <section className="complexity-bar">
          <div className="complexity-card">
            <span className="complexity-title">Best Case Time</span>
            <span className="complexity-value">{currentComplexity.best}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-title">Avg Time</span>
            <span className="complexity-value">{currentComplexity.avg}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-title">Worst Time</span>
            <span className="complexity-value">{currentComplexity.worst}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-title">Space</span>
            <span className="complexity-value">{currentComplexity.space}</span>
          </div>
        </section>

        {/* --- Lower Content Area (Code & Log) --- */}
        <div className="lower-content-area">
          <section className="code-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h2 className="section-title" style={{margin: 0}}>Code</h2>
                <span style={{fontSize: '0.85rem', color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                  {currentOperation === 'base' ? 'Structure Definition' : currentOperation.replace(/([A-Z])/g, ' $1').trim()}
                </span>
            </div>
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

          <section className="log-section">
            <h2 className="section-title">Execution Log</h2>
            <div className="log-block" ref={logContainerRef}>
              <ul className="log-list">
                {executionLog.map((log, idx) => (
                  <li key={idx} className="log-item">{log}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}