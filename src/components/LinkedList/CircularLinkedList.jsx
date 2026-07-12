import React, { useState, useRef, useEffect } from 'react';
import { List, Pause, Play, RefreshCw, Search, ArrowRight, X, Shuffle, StepForward, StepBack } from 'lucide-react';
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
      font-size: 1.6rem; 
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
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-height: 400px;
      width: 100%;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      overflow: auto;
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

    .node-pointers {
      display: flex;
      gap: 0.25rem;
      margin-top: 0.5rem;
      min-height: 24px;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
    }

    .pointer-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.35rem;
      border-radius: 0.25rem;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 0.1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .pointer-badge.prev { background-color: var(--purple-600); color: white; }
    .pointer-badge.curr { background-color: var(--cyan-600); color: white; }
    .pointer-badge.next { background-color: var(--orange-600); color: white; }

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

    .playback-controls-bar .btn {
      min-width: 90px;
    }

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
      .complexity-bar {
        grid-template-columns: repeat(4, 1fr);
      }
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
        max-height: 300px; 
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
      color: white; 
    }
  `}</style>
);


const codeSnippets = {
  python: {
    base: `
class Node:
  def __init__(self, value):
    self.value = value
    self.next = None

class CircularLinkedList:
  def __init__(self):
    self.head = None
`,
    addHead: `
  def add_head(self, value):
    new_node = Node(value)
    if not self.head:
      self.head = new_node
      new_node.next = self.head
      return
      
    # Traverse to tail to update its next pointer
    tail = self.head
    while tail.next != self.head:
      tail = tail.next
      
    new_node.next = self.head
    tail.next = new_node
    self.head = new_node
`,
    addTail: `
  def add_tail(self, value):
    new_node = Node(value)
    if not self.head:
      self.head = new_node
      new_node.next = self.head
      return
      
    # Traverse to tail
    tail = self.head
    while tail.next != self.head:
      tail = tail.next
      
    tail.next = new_node
    new_node.next = self.head
`,
    addAtIndex: `
  def add_at_index(self, index, value):
    if index == 0:
      self.add_head(value)
      return
      
    new_node = Node(value)
    current = self.head
    for _ in range(index - 1):
      if current.next == self.head:
        return # Out of bounds
      current = current.next
      
    new_node.next = current.next
    current.next = new_node
`,
    deleteHead: `
  def delete_head(self):
    if not self.head: return
    
    if self.head.next == self.head:
      self.head = None
      return
      
    tail = self.head
    while tail.next != self.head:
      tail = tail.next
      
    self.head = self.head.next
    tail.next = self.head
`,
    deleteTail: `
  def delete_tail(self):
    if not self.head: return
    
    if self.head.next == self.head:
      self.head = None
      return
      
    current = self.head
    while current.next.next != self.head:
      current = current.next
      
    current.next = self.head
`,
    deleteAtIndex: `
  def delete_at_index(self, index):
    if not self.head: return
    if index == 0:
      self.delete_head()
      return
      
    current = self.head
    for _ in range(index - 1):
      if current.next == self.head or current.next.next == self.head:
        return # Out of bounds
      current = current.next
      
    current.next = current.next.next
`,
    deleteByValue: `
  def delete_value(self, value):
    if not self.head: return
    
    if self.head.value == value:
      self.delete_head()
      return
      
    current = self.head
    while current.next != self.head and current.next.value != value:
      current = current.next
      
    if current.next != self.head:
      current.next = current.next.next
`,
    search: `
  def search(self, value):
    if not self.head: return False
    
    current = self.head
    while True:
      if current.value == value:
        return True
      current = current.next
      if current == self.head:
        break
    return False
`,
    reverse: `
  def reverse(self):
    if not self.head or self.head.next == self.head: return
    
    # Traverse to tail to set it as initial prev
    tail = self.head
    while tail.next != self.head:
      tail = tail.next
        
    prev = tail
    current = self.head
    
    while True:
      next_node = current.next
      current.next = prev
      prev = current
      current = next_node
      if current == self.head:
        break
        
    self.head = prev
`,
    swap: `
  def swap(self, index1, index2):
    if index1 == index2 or not self.head: return
    
    node1 = self.head
    for _ in range(index1):
      node1 = node1.next
      if node1 == self.head: return # Out of bounds
        
    node2 = self.head
    for _ in range(index2):
      node2 = node2.next
      if node2 == self.head: return # Out of bounds
        
    # Swap their values
    node1.value, node2.value = node2.value, node1.value
`
  },
  c: {
    base: `
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct Node {
  int value;
  struct Node* next;
};

struct Node* head = NULL;
`,
    addHead: `
void addHead(int value) {
  struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
  newNode->value = value;
  
  if (head == NULL) {
    head = newNode;
    newNode->next = head;
    return;
  }
  
  struct Node* tail = head;
  while (tail->next != head) {
    tail = tail->next;
  }
  
  newNode->next = head;
  tail->next = newNode;
  head = newNode;
}
`,
    addTail: `
void addTail(int value) {
  struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
  newNode->value = value;
  
  if (head == NULL) {
    head = newNode;
    newNode->next = head;
    return;
  }
  
  struct Node* tail = head;
  while (tail->next != head) {
    tail = tail->next;
  }
  
  tail->next = newNode;
  newNode->next = head;
}
`,
    addAtIndex: `
void addAtIndex(int index, int value) {
  if (index == 0) {
    addHead(value);
    return;
  }
  
  struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
  newNode->value = value;
  
  struct Node* current = head;
  for (int i = 0; i < index - 1; i++) {
    if (current->next == head) return;
    current = current->next;
  }
  
  newNode->next = current->next;
  current->next = newNode;
}
`,
    deleteHead: `
void deleteHead() {
  if (head == NULL) return;
  
  if (head->next == head) {
    free(head);
    head = NULL;
    return;
  }
  
  struct Node* tail = head;
  while (tail->next != head) {
    tail = tail->next;
  }
  
  struct Node* temp = head;
  head = head->next;
  tail->next = head;
  free(temp);
}
`,
    deleteTail: `
void deleteTail() {
  if (head == NULL) return;
  
  if (head->next == head) {
    free(head);
    head = NULL;
    return;
  }
  
  struct Node* current = head;
  while (current->next->next != head) {
    current = current->next;
  }
  
  struct Node* temp = current->next;
  current->next = head;
  free(temp);
}
`,
    deleteAtIndex: `
void deleteAtIndex(int index) {
  if (head == NULL) return;
  if (index == 0) {
    deleteHead();
    return;
  }
  
  struct Node* current = head;
  for (int i = 0; i < index - 1; i++) {
    if (current->next == head || current->next->next == head) return;
    current = current->next;
  }
  
  struct Node* temp = current->next;
  current->next = current->next->next;
  free(temp);
}
`,
    deleteByValue: `
void deleteValue(int value) {
  if (head == NULL) return;
  
  if (head->value == value) {
    deleteHead();
    return;
  }
  
  struct Node* current = head;
  while (current->next != head && current->next->value != value) {
    current = current->next;
  }
  
  if (current->next != head) {
    struct Node* temp = current->next;
    current->next = current->next->next;
    free(temp);
  }
}
`,
    search: `
bool search(int value) {
  if (head == NULL) return false;
  
  struct Node* current = head;
  do {
    if (current->value == value) {
      return true;
    }
    current = current->next;
  } while (current != head);
  
  return false;
}
`,
    reverse: `
void reverse() {
  if (head == NULL || head->next == head) return;
  
  struct Node* tail = head;
  while (tail->next != head) {
    tail = tail->next;
  }
  
  struct Node* prev = tail;
  struct Node* current = head;
  struct Node* next = NULL;
  
  do {
    next = current->next;
    current->next = prev;
    prev = current;
    current = next;
  } while (current != head);
  
  head = prev;
}
`,
    swap: `
void swap(int index1, int index2) {
  if (index1 == index2 || head == NULL) return;
  
  struct Node* node1 = head;
  for (int i = 0; i < index1; i++) {
    node1 = node1->next;
    if (node1 == head) return;
  }
  
  struct Node* node2 = head;
  for (int i = 0; i < index2; i++) {
    node2 = node2->next;
    if (node2 == head) return;
  }
  
  int temp = node1->value;
  node1->value = node2->value;
  node2->value = temp;
}
`
  },
  cpp: {
    base: `
#include <iostream>

class Node {
public:
  int value;
  Node* next;
  Node(int val) : value(val), next(nullptr) {}
};

class CircularLinkedList {
public:
  Node* head;
  CircularLinkedList() : head(nullptr) {}
`,
    addHead: `
  void addHead(int value) {
    Node* newNode = new Node(value);
    if (!head) {
      head = newNode;
      newNode->next = head;
      return;
    }
    
    Node* tail = head;
    while (tail->next != head) {
      tail = tail->next;
    }
    
    newNode->next = head;
    tail->next = newNode;
    head = newNode;
  }
`,
    addTail: `
  void addTail(int value) {
    Node* newNode = new Node(value);
    if (!head) {
      head = newNode;
      newNode->next = head;
      return;
    }
    
    Node* tail = head;
    while (tail->next != head) {
      tail = tail->next;
    }
    
    tail->next = newNode;
    newNode->next = head;
  }
`,
    addAtIndex: `
  void addAtIndex(int index, int value) {
    if (index == 0) {
      addHead(value);
      return;
    }
    
    Node* newNode = new Node(value);
    Node* current = head;
    for (int i = 0; i < index - 1; ++i) {
      if (current->next == head) return;
      current = current->next;
    }
    
    newNode->next = current->next;
    current->next = newNode;
  }
`,
    deleteHead: `
  void deleteHead() {
    if (!head) return;
    if (head->next == head) {
      delete head;
      head = nullptr;
      return;
    }
    
    Node* tail = head;
    while (tail->next != head) {
      tail = tail->next;
    }
    
    Node* temp = head;
    head = head->next;
    tail->next = head;
    delete temp;
  }
`,
    deleteTail: `
  void deleteTail() {
    if (!head) return;
    if (head->next == head) {
      delete head;
      head = nullptr;
      return;
    }
    
    Node* current = head;
    while (current->next->next != head) {
      current = current->next;
    }
    
    Node* temp = current->next;
    current->next = head;
    delete temp;
  }
`,
    deleteAtIndex: `
  void deleteAtIndex(int index) {
    if (!head) return;
    if (index == 0) {
      deleteHead();
      return;
    }
    
    Node* current = head;
    for (int i = 0; i < index - 1; ++i) {
      if (current->next == head || current->next->next == head) return;
      current = current->next;
    }
    
    Node* temp = current->next;
    current->next = current->next->next;
    delete temp;
  }
`,
    deleteByValue: `
  void deleteValue(int value) {
    if (!head) return;
    if (head->value == value) {
      deleteHead();
      return;
    }
    
    Node* current = head;
    while (current->next != head && current->next->value != value) {
      current = current->next;
    }
    
    if (current->next != head) {
      Node* temp = current->next;
      current->next = current->next->next;
      delete temp;
    }
  }
`,
    search: `
  bool search(int value) {
    if (!head) return false;
    
    Node* current = head;
    do {
      if (current->value == value) {
        return true;
      }
      current = current->next;
    } while (current != head);
    
    return false;
  }
`,
    reverse: `
  void reverse() {
    if (!head || head->next == head) return;
    
    Node* tail = head;
    while (tail->next != head) {
      tail = tail->next;
    }
    
    Node* prev = tail;
    Node* current = head;
    Node* next = nullptr;
    
    do {
      next = current->next;
      current->next = prev;
      prev = current;
      current = next;
    } while (current != head);
    
    head = prev;
  }
`,
    swap: `
  void swap(int index1, int index2) {
    if (index1 == index2 || !head) return;
    
    Node* node1 = head;
    for (int i = 0; i < index1; i++) {
      node1 = node1->next;
      if (node1 == head) return;
    }
    
    Node* node2 = head;
    for (int i = 0; i < index2; i++) {
      node2 = node2->next;
      if (node2 == head) return;
    }
    
    std::swap(node1->value, node2->value);
  }
};
`
  },
  java: {
    base: `
class Node {
  int value;
  Node next;

  Node(int value) {
    this.value = value;
    this.next = null;
  }
}

class CircularLinkedList {
  Node head;
`,
    addHead: `
  public void addHead(int value) {
    Node newNode = new Node(value);
    if (head == null) {
      head = newNode;
      newNode.next = head;
      return;
    }
    
    Node tail = head;
    while (tail.next != head) {
      tail = tail.next;
    }
    
    newNode.next = head;
    tail.next = newNode;
    head = newNode;
  }
`,
    addTail: `
  public void addTail(int value) {
    Node newNode = new Node(value);
    if (head == null) {
      head = newNode;
      newNode.next = head;
      return;
    }
    
    Node tail = head;
    while (tail.next != head) {
      tail = tail.next;
    }
    
    tail.next = newNode;
    newNode.next = head;
  }
`,
    addAtIndex: `
  public void addAtIndex(int index, int value) {
    if (index == 0) {
      addHead(value);
      return;
    }
    
    Node newNode = new Node(value);
    Node current = head;
    for (int i = 0; i < index - 1; i++) {
      if (current.next == head) return;
      current = current.next;
    }
    
    newNode.next = current.next;
    current.next = newNode;
  }
`,
    deleteHead: `
  public void deleteHead() {
    if (head == null) return;
    if (head.next == head) {
      head = null;
      return;
    }
    
    Node tail = head;
    while (tail.next != head) {
      tail = tail.next;
    }
    
    head = head.next;
    tail.next = head;
  }
`,
    deleteTail: `
  public void deleteTail() {
    if (head == null) return;
    if (head.next == head) {
      head = null;
      return;
    }
    
    Node current = head;
    while (current.next.next != head) {
      current = current.next;
    }
    
    current.next = head;
  }
`,
    deleteAtIndex: `
  public void deleteAtIndex(int index) {
    if (head == null) return;
    if (index == 0) {
      deleteHead();
      return;
    }
    
    Node current = head;
    for (int i = 0; i < index - 1; i++) {
      if (current.next == head || current.next.next == head) return;
      current = current.next;
    }
    
    current.next = current.next.next;
  }
`,
    deleteByValue: `
  public void deleteValue(int value) {
    if (head == null) return;
    if (head.value == value) {
      deleteHead();
      return;
    }
    
    Node current = head;
    while (current.next != head && current.next.value != value) {
      current = current.next;
    }
    
    if (current.next != head) {
      current.next = current.next.next;
    }
  }
`,
    search: `
  public boolean search(int value) {
    if (head == null) return false;
    
    Node current = head;
    do {
      if (current.value == value) {
        return true;
      }
      current = current.next;
    } while (current != head);
    
    return false;
  }
`,
    reverse: `
  public void reverse() {
    if (head == null || head.next == head) return;
    
    Node tail = head;
    while (tail.next != head) {
      tail = tail.next;
    }
    
    Node prev = tail;
    Node current = head;
    Node next = null;
    
    do {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    } while (current != head);
    
    head = prev;
  }
`,
    swap: `
  public void swap(int index1, int index2) {
    if (index1 == index2 || head == null) return;
    
    Node node1 = head;
    for (int i = 0; i < index1; i++) {
      node1 = node1.next;
      if (node1 == head) return;
    }
    
    Node node2 = head;
    for (int i = 0; i < index2; i++) {
      node2 = node2.next;
      if (node2 == head) return;
    }
    
    int temp = node1.value;
    node1.value = node2.value;
    node2.value = temp;
  }
}
`
  }
};

const complexities = {
  base: { best: "-", avg: "-", worst: "-", space: "-" },
  addHead: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" }, // O(n) because we traverse to tail
  addTail: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" }, // O(n) traversal
  addAtIndex: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  deleteHead: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" }, // O(n) to update tail
  deleteTail: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  deleteAtIndex: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  deleteByValue: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  search: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  reverse: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  swap: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Main Component ---
export default function CircularSinglyLinkedList() {
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  const [index2, setIndex2] = useState("");
  const [randomSize, setRandomSize] = useState("5");
  
  const [language, setLanguage] = useState("c");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Create a new list or add a node.");
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

  useEffect(() => {
    if (frames.length > 0 && currentFrameIdx >= 0 && currentFrameIdx < frames.length) {
        const frame = frames[currentFrameIdx];
        setList(frame.list);
        setStatus(frame.status);
        setExecutionLog(frame.log);
    }
  }, [currentFrameIdx, frames]);
  
  const cloneList = (lst) => lst.map(n => ({...n, pointers: n.pointers ? [...n.pointers] : []}));
  
  const getVal = () => {
      const num = parseInt(value);
      if (isNaN(num)) { setError("Please enter a valid number for 'Value'."); return null; }
      return num;
  };
  
  const getIdx = () => {
      const num = parseInt(index);
      if (isNaN(num) || num < 0) { setError("Please enter a valid, non-negative number for 'Index'."); return null; }
      return num;
  };

  const runOperation = (opName, frameGen) => {
      setError(null);
      setCurrentOperation(opName);
      const newFrames = frameGen();
      if (!newFrames || newFrames.length === 0) return;
      
      setFrames(newFrames);
      setCurrentFrameIdx(0);
      setIsPlaying(true);
      setValue("");
      setIndex("");
  };

  // --- Operation: Add Head ---
  const handleAddHead = () => {
    const val = getVal();
    if (val === null) return;
    runOperation('addHead', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Adding ${val} to HEAD`];
        
        if (currList.length > 0) {
            f.push({ list: cloneList(currList), status: `Traversing to TAIL to update its pointer...`, log: currLog });
            for(let i=0; i<currList.length; i++) {
                currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
                f.push({ list: cloneList(currList), status: `Traversing... checking index ${i}`, log: currLog });
            }
            currList = currList.map((n, idx) => ({...n, state: idx === currList.length - 1 ? 'pre-op' : 'default'}));
            f.push({ list: cloneList(currList), status: `Found TAIL at index ${currList.length - 1}`, log: currLog });
        }
        
        const newNode = { value: val, id: uuidv4(), state: 'found' };
        currList = [newNode, ...currList.map(n => ({...n, state: 'default'}))];
        f.push({ list: cloneList(currList), status: `Added ${val} to HEAD. Tail updated.`, log: currLog });
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Added ${val} to HEAD. Tail updated.`, log: currLog });
        return f;
    });
  };
  
  // --- Operation: Add Tail ---
  const handleAddTail = () => {
    const val = getVal();
    if (val === null) return;
    
    runOperation('addTail', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Adding ${val} to TAIL`];
        
        f.push({ list: cloneList(currList), status: `Traversing to TAIL...`, log: currLog });
        for(let i=0; i<currList.length; i++) {
            currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Traversing to TAIL... checking index ${i}`, log: currLog });
        }
        
        const newNode = { value: val, id: uuidv4(), state: 'found' };
        currList = [...currList.map(n => ({...n, state: 'default'})), newNode];
        f.push({ list: cloneList(currList), status: `Adding ${val} to TAIL... and pointing to HEAD`, log: currLog });
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Added ${val} to TAIL.`, log: currLog });
        return f;
    });
  };
  
  // --- Operation: Add At Index ---
  const handleAddAtIndex = () => {
    const val = getVal();
    const idx = getIdx();
    if (val === null || idx === null) return;
    if (idx > list.length) { setError(`Index ${idx} is out of bounds for insertion.`); return; }
    if (idx === 0) { handleAddHead(); return; }
    if (idx === list.length) { handleAddTail(); return; }
    
    runOperation('addAtIndex', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Inserting ${val} at index ${idx}`];
        
        for(let i=0; i<idx; i++) {
            currList = currList.map((n, i2) => ({...n, state: i2 === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Traversing to index ${idx-1}... checking index ${i}`, log: currLog });
        }
        
        currList = currList.map((n, i) => ({...n, state: i === idx - 1 ? 'pre-op' : 'default'}));
        f.push({ list: cloneList(currList), status: `Found insertion point after index ${idx-1}.`, log: currLog });
        
        const newNode = { value: val, id: uuidv4(), state: 'found' };
        currList.splice(idx, 0, newNode);
        f.push({ list: cloneList(currList), status: `Inserted ${val} at index ${idx}.`, log: currLog });
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Inserted ${val} at index ${idx}.`, log: currLog });
        return f;
    });
  };

  // --- Operation: Delete Head ---
  const handleDeleteHead = () => {
    if (list.length === 0) { setError("List is already empty."); return; }
    runOperation('deleteHead', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Deleting HEAD (Value: ${currList[0].value})`];
        
        if (currList.length > 1) {
            f.push({ list: cloneList(currList), status: `Traversing to TAIL to update its pointer...`, log: currLog });
            for(let i=0; i<currList.length; i++) {
                currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
                f.push({ list: cloneList(currList), status: `Traversing... checking index ${i}`, log: currLog });
            }
            currList = currList.map((n, idx) => ({
                ...n, 
                state: idx === currList.length - 1 ? 'pre-op' : (idx === 0 ? 'deleting' : 'default')
            }));
            f.push({ list: cloneList(currList), status: `Found TAIL. Deleting HEAD...`, log: currLog });
        } else {
            currList[0].state = 'deleting';
            f.push({ list: cloneList(currList), status: `Deleting HEAD...`, log: currLog });
        }
        
        currList = currList.slice(1).map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Deleted HEAD node. Tail updated.`, log: currLog });
        return f;
    });
  };
  
  // --- Operation: Delete Tail ---
  const handleDeleteTail = () => {
    if (list.length === 0) { setError("List is already empty."); return; }
    if (list.length === 1) { handleDeleteHead(); return; }
    
    runOperation('deleteTail', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Deleting TAIL (Value: ${currList[currList.length - 1].value})`];
        
        for(let i=0; i<currList.length - 1; i++) {
            currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Traversing to TAIL... checking index ${i}`, log: currLog });
        }
        
        currList = currList.map((n, i) => ({
            ...n,
            state: i === currList.length - 2 ? 'pre-op' : (i === currList.length - 1 ? 'deleting' : 'default')
        }));
        f.push({ list: cloneList(currList), status: `Deleting TAIL and mapping new TAIL to HEAD...`, log: currLog });
        
        currList = currList.slice(0, -1).map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Deleted TAIL node.`, log: currLog });
        return f;
    });
  };
  
  // --- Operation: Delete At Index ---
  const handleDeleteAtIndex = () => {
    const idx = getIdx();
    if (idx === null) return;
    if (idx >= list.length) { setError(`Index ${idx} is out of bounds.`); return; }
    if (idx === 0) { handleDeleteHead(); return; }
    if (idx === list.length - 1) { handleDeleteTail(); return; }
    
    runOperation('deleteAtIndex', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Deleting node at index ${idx}`];
        
        for(let i=0; i<=idx; i++) {
            currList = currList.map((n, i2) => ({...n, state: i2 === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Traversing to index ${idx}... checking index ${i}`, log: currLog });
        }
        
        currList = currList.map((n, i) => ({
            ...n,
            state: i === idx - 1 ? 'pre-op' : (i === idx ? 'deleting' : 'default')
        }));
        f.push({ list: cloneList(currList), status: `Deleting node at index ${idx}...`, log: currLog });
        
        currList = currList.filter((_, i) => i !== idx).map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Deleted node at index ${idx}.`, log: currLog });
        return f;
    });
  };
  
  // --- Operation: Delete By Value ---
  const handleDeleteByValue = () => {
    const val = getVal();
    if (val === null) return;
    if (list.length === 0) { setError("List is already empty."); return; }
    
    runOperation('deleteByValue', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Deleting first occurrence of value ${val}`];
        
        let foundIndex = -1;
        for(let i=0; i<currList.length; i++) {
            currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Searching for ${val}... checking index ${i}`, log: currLog });
            if (currList[i].value === val) {
                foundIndex = i;
                break;
            }
        }
        
        if (foundIndex === -1) {
            currLog = [...currLog, `Value ${val} not found.`];
            currList = currList.map(n => ({...n, state: 'default'}));
            f.push({ list: cloneList(currList), status: `Value ${val} not found in list.`, log: currLog });
            return f;
        }
        
        if (foundIndex === 0) {
             // For head deletion we need tail traversal
             f.push({ list: cloneList(currList), status: `Found at HEAD. Traversing to TAIL to update...`, log: currLog });
             for(let i=1; i<currList.length; i++) {
                currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : (idx === 0 ? 'deleting' : 'default')}));
                f.push({ list: cloneList(currList), status: `Traversing... checking index ${i}`, log: currLog });
             }
            currList = currList.slice(1);
        } else {
            currList = currList.map((n, i) => ({
                ...n,
                state: i === foundIndex - 1 ? 'pre-op' : (i === foundIndex ? 'deleting' : 'default')
            }));
            f.push({ list: cloneList(currList), status: `Deleting node at index ${foundIndex}...`, log: currLog });
            currList = currList.filter((_, i) => i !== foundIndex);
        }
        
        currList = currList.map(n => ({...n, state: 'default'}));
        currLog = [...currLog, `Deleted node with value ${val}.`];
        f.push({ list: cloneList(currList), status: `Deleted node at index ${foundIndex}.`, log: currLog });
        return f;
    });
  };
  
  // --- Operation: Search ---
  const handleSearch = () => {
    const val = getVal();
    if (val === null) return;
    if (list.length === 0) { setError("List is already empty."); return; }
    
    runOperation('search', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Searching for value ${val}`];
        
        let found = false;
        for(let i=0; i<currList.length; i++) {
            currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Searching... checking index ${i} (Value: ${currList[i].value})`, log: currLog });
            
            if (currList[i].value === val) {
                currList[i].state = 'found';
                currLog = [...currLog, `Found ${val} at index ${i}!`];
                f.push({ list: cloneList(currList), status: `Found ${val} at index ${i}!`, log: currLog });
                found = true;
                break;
            }
        }
        
        if (!found) {
            currLog = [...currLog, `Value ${val} not found.`];
            currList = currList.map(n => ({...n, state: 'default'}));
            f.push({ list: cloneList(currList), status: `Value ${val} not found. Hit HEAD again.`, log: currLog });
        }
        return f;
    });
  };

  // --- Operation: Reverse ---
  const handleReverse = () => {
    if (list.length < 2) { setError("Need at least 2 nodes to reverse."); return; }
    
    runOperation('reverse', () => {
        const f = [];
        let currList = cloneList(list).map(n => ({ ...n, pointers: [], state: 'default' }));
        let currLog = [...executionLog, `Starting list reversal`, `Traversing to TAIL to set initial prev = tail`];
        
        // Traverse to TAIL
        for(let i=0; i<currList.length; i++) {
            currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Finding TAIL for initial prev... checking index ${i}`, log: currLog });
        }

        const applyPointers = (lst, p, c, n) => {
            return lst.map((node, idx) => {
                const ptrs = [];
                if (idx === p) ptrs.push('prev');
                if (idx === c) ptrs.push('curr');
                if (idx === n) ptrs.push('next');
                return { ...node, pointers: ptrs };
            });
        };

        let N = currList.length;
        
        currLog = [...currLog, `prev = TAIL, curr = HEAD`];
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: "Initialize: prev = TAIL, curr = HEAD", log: currLog });

        for (let i = 0; i < N; i++) {
            let prevIdx = i === 0 ? N - 1 : 0;
            let currIdx = i;
            let nextIdx = i + 1 < N ? i + 1 : -1;

            currList = applyPointers(currList, prevIdx, currIdx, -1);
            currList = currList.map((n, idx) => ({ ...n, state: idx === currIdx ? 'visiting' : 'default' }));
            currLog = [...currLog, `curr = ${currList[currIdx].value}`];
            f.push({ list: cloneList(currList), status: `curr = current node`, log: currLog });

            currList = applyPointers(currList, prevIdx, currIdx, nextIdx);
            currLog = [...currLog, `next = ${nextIdx !== -1 ? currList[nextIdx].value : 'HEAD'}`];
            f.push({ list: cloneList(currList), status: `next = curr.next`, log: currLog });

            if (i > 0) {
                let nodeToMove = currList.splice(currIdx, 1)[0];
                nodeToMove.state = 'found';
                currList.unshift(nodeToMove);

                currList = applyPointers(currList, 1, 0, nextIdx);
                currLog = [...currLog, `curr.next = prev`];
                f.push({ list: cloneList(currList), status: `curr.next = prev (Reverse link)`, log: currLog });
            } else {
                currList[0].state = 'found';
                currLog = [...currLog, `curr.next = prev (TAIL)`];
                f.push({ list: cloneList(currList), status: `curr.next = prev (TAIL)`, log: currLog });
            }

            currList = applyPointers(currList, 0, 0, nextIdx); 
            currLog = [...currLog, `prev = curr`];
            f.push({ list: cloneList(currList), status: `prev = curr`, log: currLog });
        }
        
        currList = currList.map(n => ({...n, pointers: [], state: 'default'}));
        currLog = [...currLog, `Circular list reversal complete.`];
        f.push({ list: cloneList(currList), status: `List reversal complete! New HEAD set.`, log: currLog });
        return f;
    });
  };

  // --- Operation: Swap ---
  const handleSwap = () => {
    let idx1 = parseInt(index);
    let idx2 = parseInt(index2);
        
    if (isNaN(idx1) || isNaN(idx2) || idx1 < 0 || idx2 < 0) {
        setError("Please enter valid, non-negative numbers for 'Index 1' and 'Index 2'.");
        return;
    }
    if (idx1 >= list.length || idx2 >= list.length) {
        setError("One or both indexes are out of bounds.");
        return;
    }
    if (idx1 === idx2) {
        setError("Indexes must be different for a swap.");
        return;
    }

    let minIdx = Math.min(idx1, idx2);
    let maxIdx = Math.max(idx1, idx2);

    runOperation('swap', () => {
        const f = [];
        let currList = cloneList(list);
        let currLog = [...executionLog, `Swapping nodes at index ${minIdx} and ${maxIdx}`];
            
        for(let i=0; i<=minIdx; i++) {
            currList = currList.map((n, idx) => ({...n, state: idx === i ? 'visiting' : 'default'}));
            f.push({ list: cloneList(currList), status: `Finding first node... checking index ${i}`, log: currLog });
        }
        currList[minIdx].state = 'pre-op';
        f.push({ list: cloneList(currList), status: `Found first node at index ${minIdx}.`, log: currLog });

        for(let i=minIdx+1; i<=maxIdx; i++) {
            currList = currList.map((n, idx) => ({
                ...n, 
                state: idx === minIdx ? 'pre-op' : (idx === i ? 'visiting' : 'default')
            }));
            f.push({ list: cloneList(currList), status: `Finding second node... checking index ${i}`, log: currLog });
        }
        currList[maxIdx].state = 'pre-op';
        f.push({ list: cloneList(currList), status: `Found second node at index ${maxIdx}.`, log: currLog });

        let temp = currList[minIdx];
        currList[minIdx] = currList[maxIdx];
        currList[maxIdx] = temp;
            
        currList[minIdx].state = 'found';
        currList[maxIdx].state = 'found';
            
        currLog = [...currLog, `Swapped nodes successfully.`];
        f.push({ list: cloneList(currList), status: `Swapped nodes successfully!`, log: currLog });
            
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Swapped nodes successfully!`, log: currLog });
            
        return f;
    });
  };

  const handleReset = () => {
    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);
    setList([]);
    setValue("");
    setIndex("");
    setIndex2("");
    setError(null);
    setStatus("Create a new list or add a node.");
    setHighlightLineNum(-1);
    setCurrentOperation('base');
    setExecutionLog([]);
  };
  
  const handleGenerateRandom = () => {
    const size = parseInt(randomSize);
    if (isNaN(size) || size <= 0 || size > 50) {
      setError("Please enter a valid size (1-50) for the random list.");
      return;
    }

    const newList = [];
    for (let i = 0; i < size; i++) {
      newList.push({
        value: Math.floor(Math.random() * 99) + 1,
        id: uuidv4(),
        state: 'default'
      });
    }
    
    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);
    
    setList(newList);
    setValue("");
    setIndex("");
    setError(null);
    setStatus(`Generated a random circular list of ${size} nodes.`);
    setHighlightLineNum(-1);
    setCurrentOperation('base');
    setExecutionLog([`Generated random circular list of ${size} nodes.`]);
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
  
  const statusColor = status.includes("Found")
    ? "status-found"
    : status.includes("not found")
    ? "status-not-found"
    : (!isPlaying && frames.length > 0 && currentFrameIdx < frames.length - 1)
    ? "status-paused"
    : "status-default";

  // --- SVG Circular Layout Generator ---
  const renderVisualization = () => {
    if (list.length === 0) {
      return <span style={{color: 'var(--text-gray-500)'}}>List is empty.</span>;
    }

    const N = list.length;
    // Calculate a dynamic radius based on the number of nodes so they don't overlap
    const baseR = 140; 
    const R = Math.max(baseR, (N * 80) / (2 * Math.PI));
    const SVG_SIZE = 2 * R + 250; // Ensure enough padding for labels
    const cx = SVG_SIZE / 2;
    const cy = SVG_SIZE / 2;
    
    const nodeRadius = 45; // Approximate visual radius of a node box to calculate gaps

    return (
      <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cyan-500)" />
          </marker>
        </defs>

        {/* --- Path/Arrow Layer --- */}
        {list.map((_, i) => {
          // Special Case: Single node looping back to itself
          if (N === 1) {
            const startX = cx + 25;
            const startY = cy - R - 15;
            const endX = cx - 25;
            const endY = cy - R - 15;
            return (
              <path 
                key={`path-${i}`}
                d={`M ${startX} ${startY} A 30 30 0 1 0 ${endX} ${endY}`}
                fill="none"
                stroke="var(--cyan-500)"
                strokeWidth="3"
                markerEnd="url(#arrow)"
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          }

          // Normal Case: Arcs between nodes
          const angle1 = -Math.PI / 2 + i * (2 * Math.PI / N);
          const angle2 = -Math.PI / 2 + (i + 1) * (2 * Math.PI / N);
          
          // Angular gap so arrows start/end exactly at the edges of the boxes, not inside them
          const delta = Math.min(nodeRadius / R, (2 * Math.PI / N) * 0.4);
          
          const startAngle = angle1 + delta;
          const endAngle = angle2 - delta;
          
          const x1 = cx + R * Math.cos(startAngle);
          const y1 = cy + R * Math.sin(startAngle);
          const x2 = cx + R * Math.cos(endAngle);
          const y2 = cy + R * Math.sin(endAngle);
          
          return (
            <path 
              key={`path-${i}`}
              d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke="var(--cyan-500)"
              strokeWidth="3"
              markerEnd="url(#arrow)"
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}

        {/* --- Node Elements Layer --- */}
        {list.map((node, idx) => {
          const angle = -Math.PI / 2 + idx * (2 * Math.PI / N);
          const x = cx + R * Math.cos(angle);
          const y = cy + R * Math.sin(angle);
          
          // Size of the HTML container wrapping the node
          const fWidth = 160;
          const fHeight = 180;
          const fx = x - fWidth / 2;
          const fy = y - fHeight / 2;

          return (
            <foreignObject key={node.id} x={fx} y={fy} width={fWidth} height={fHeight} style={{ overflow: 'visible' }}>
              <div xmlns="http://www.w3.org/1999/xhtml" className="node-container" style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                <div className="node-wrapper">
                  {idx === 0 && <span className="head-label">HEAD</span>}
                  <div className={`box ${node.state}`}>
                    {node.value}
                  </div>
                  <span className="box-index">[{idx}]</span>
                  
                  <div className="node-pointers">
                    {node.pointers && node.pointers.map(p => (
                      <span key={p} className={`pointer-badge ${p}`}>
                        &uarr; {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <List size={28} />
          Circular List
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
              <label htmlFor="index">Index 1</label>
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
        
        <div className="input-group" style={{marginBottom: '1.25rem'}}>
          <label htmlFor="index2">Index 2 (Swap Only)</label>
          <input
            id="index2"
            type="text"
            placeholder="e.g., 4"
            value={index2}
            onChange={(e) => setIndex2(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}

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
        
        <div className="actions-grid">
             <button onClick={handleSwap} disabled={isVisualizing || list.length < 2} className="btn btn-cyan">Swap Nodes</button>
             <button onClick={handleReverse} disabled={isVisualizing || list.length < 2} className="btn btn-cyan">Reverse List</button>
        </div>
        
        <hr style={{borderColor: 'var(--border-gray-700)', margin: '1.5rem 0'}} />

        <div className="actions-grid">
          <button onClick={handleReset} className="btn btn-secondary">
            <RefreshCw size={18} /> Reset List
          </button>
        </div>

        <div className="actions-grid" style={{ gridTemplateColumns: '1fr 2.5fr' }}>
          <input
            id="randomSize"
            type="number"
            min="1"
            max="50"
            placeholder="Size"
            value={randomSize}
            onChange={(e) => setRandomSize(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
            style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}
            title="Random List Size"
          />
          <button onClick={handleGenerateRandom} disabled={isVisualizing} className="btn btn-cyan">
            <Shuffle size={18} /> Random
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
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="speed">Animation Speed</label>
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
            {renderVisualization()}
          </div>
          
          {/* --- Playback Controls Bar --- */}
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
            <span className="complexity-title">Average Time</span>
            <span className="complexity-value">{currentComplexity.avg}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-title">Worst Case Time</span>
            <span className="complexity-value">{currentComplexity.worst}</span>
          </div>
          <div className="complexity-card">
            <span className="complexity-title">Space Complexity</span>
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