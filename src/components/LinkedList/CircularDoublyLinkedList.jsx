import React, { useState, useRef, useEffect } from 'react';
import { List, Pause, Play, RefreshCw, Search, ArrowRight, ArrowLeft, ArrowLeftRight, X, Shuffle, StepForward, StepBack } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; 

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
      line-height: 1.2;
    }

    .sidebar-title svg {
      margin-right: 0.75rem;
      flex-shrink: 0;
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

    .circular-container {
      flex: 1;
      width: 100%;
      min-height: 450px;
      overflow: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      position: relative;
    }

    .circular-canvas {
      position: relative;
    }

    .node-absolute-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      transition: left 0.4s ease-in-out, top 0.4s ease-in-out;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
    }

    .label-absolute-top {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--cyan-400);
      white-space: nowrap;
    }

    .label-absolute-bottom {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.875rem;
      color: var(--text-gray-400);
    }

    .pointers-absolute {
      position: absolute;
      bottom: -48px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.25rem;
      white-space: nowrap;
    }

    .legend-container {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--bg-dark-900);
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-gray-700);
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      z-index: 5;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-gray-300);
    }
    
    .legend-color {
      width: 12px;
      height: 3px;
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
    
    .pointer-arrow {
        color: var(--cyan-500);
        margin: 0 0.5rem;
        flex-shrink: 0;
    }
    
    .null-node {
        font-size: 1.1rem;
        font-weight: 700;
        padding: 0 1rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .text-purple { color: var(--purple-400); }
    .text-cyan { color: var(--cyan-400); }

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
      min-height: 24px; /* Prevents layout jump when pointers appear */
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
      min-height: 1.5em; /* Ensure empty lines have height */
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
      color: white; /* Highlight last item */
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
    self.prev = None

class CircularDoublyLinkedList:
  def __init__(self):
    self.head = None
`,
    addHead: `
  def add_head(self, value):
    new_node = Node(value)
    if not self.head:
      self.head = new_node
      self.head.next = self.head
      self.head.prev = self.head
    else:
      tail = self.head.prev
      new_node.next = self.head
      new_node.prev = tail
      self.head.prev = new_node
      tail.next = new_node
      self.head = new_node
`,
    addTail: `
  def add_tail(self, value):
    if not self.head:
      self.add_head(value)
      return
    new_node = Node(value)
    tail = self.head.prev
    new_node.next = self.head
    new_node.prev = tail
    tail.next = new_node
    self.head.prev = new_node
`,
    addAtIndex: `
  def add_at_index(self, index, value):
    if index == 0:
      self.add_head(value)
      return
    new_node = Node(value)
    current = self.head
    for _ in range(index - 1):
      current = current.next
      if current == self.head: return # Out of bounds
    new_node.next = current.next
    new_node.prev = current
    current.next.prev = new_node
    current.next = new_node
`,
    deleteHead: `
  def delete_head(self):
    if not self.head: return
    if self.head.next == self.head:
      self.head = None
    else:
      tail = self.head.prev
      self.head = self.head.next
      self.head.prev = tail
      tail.next = self.head
`,
    deleteTail: `
  def delete_tail(self):
    if not self.head: return
    if self.head.next == self.head:
      self.head = None
    else:
      tail = self.head.prev
      new_tail = tail.prev
      new_tail.next = self.head
      self.head.prev = new_tail
`,
    deleteAtIndex: `
  def delete_at_index(self, index):
    if not self.head: return
    if index == 0:
      self.delete_head()
      return
    current = self.head
    for _ in range(index):
      current = current.next
      if current == self.head: return # Out of bounds
    current.prev.next = current.next
    current.next.prev = current.prev
`,
    deleteByValue: `
  def delete_value(self, value):
    if not self.head: return
    if self.head.value == value:
      self.delete_head()
      return
    current = self.head.next
    while current != self.head and current.value != value:
      current = current.next
    if current != self.head:
      current.prev.next = current.next
      current.next.prev = current.prev
`,
    search: `
  def search(self, value):
    if not self.head: return False
    current = self.head
    while True:
      if current.value == value: return True
      current = current.next
      if current == self.head: break
    return False
`,
    reverse: `
  def reverse(self):
    if not self.head or self.head.next == self.head: return
    current = self.head
    while True:
      temp = current.prev
      current.prev = current.next
      current.next = temp
      current = current.prev # Move to next node (which is now prev)
      if current == self.head: break
    self.head = temp.prev
`,
    swap: `
  def swap(self, index1, index2):
    if index1 == index2 or not self.head: return
    
    node1 = self.head
    for _ in range(index1):
      node1 = node1.next
      if node1 == self.head: return
        
    node2 = self.head
    for _ in range(index2):
      node2 = node2.next
      if node2 == self.head: return
        
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
  struct Node* prev;
};

struct Node* head = NULL;
`,
    addHead: `
void addHead(int value) {
  struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
  newNode->value = value;
  
  if (head == NULL) {
    newNode->next = newNode;
    newNode->prev = newNode;
    head = newNode;
  } else {
    struct Node* tail = head->prev;
    newNode->next = head;
    newNode->prev = tail;
    head->prev = newNode;
    tail->next = newNode;
    head = newNode;
  }
}
`,
    addTail: `
void addTail(int value) {
  if (head == NULL) {
    addHead(value);
    return;
  }
  
  struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
  newNode->value = value;
  
  struct Node* tail = head->prev;
  newNode->next = head;
  newNode->prev = tail;
  tail->next = newNode;
  head->prev = newNode;
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
    current = current->next;
    if (current == head) { free(newNode); return; }
  }
  
  newNode->next = current->next;
  newNode->prev = current;
  current->next->prev = newNode;
  current->next = newNode;
}
`,
    deleteHead: `
void deleteHead() {
  if (head == NULL) return;
  if (head->next == head) {
    free(head);
    head = NULL;
  } else {
    struct Node* tail = head->prev;
    struct Node* temp = head;
    head = head->next;
    head->prev = tail;
    tail->next = head;
    free(temp);
  }
}
`,
    deleteTail: `
void deleteTail() {
  if (head == NULL) return;
  if (head->next == head) {
    free(head);
    head = NULL;
  } else {
    struct Node* tail = head->prev;
    struct Node* newTail = tail->prev;
    newTail->next = head;
    head->prev = newTail;
    free(tail);
  }
}
`,
    deleteAtIndex: `
void deleteAtIndex(int index) {
  if (head == NULL) return;
  if (index == 0) { deleteHead(); return; }
  
  struct Node* current = head;
  for (int i = 0; i < index; i++) {
    current = current->next;
    if (current == head) return; 
  }
  
  current->prev->next = current->next;
  current->next->prev = current->prev;
  free(current);
}
`,
    deleteByValue: `
void deleteValue(int value) {
  if (head == NULL) return;
  if (head->value == value) {
    deleteHead();
    return;
  }
  
  struct Node* current = head->next;
  while (current != head && current->value != value) {
    current = current->next;
  }
  
  if (current != head) {
    current->prev->next = current->next;
    current->next->prev = current->prev;
    free(current);
  }
}
`,
    search: `
bool search(int value) {
  if (head == NULL) return false;
  struct Node* current = head;
  do {
    if (current->value == value) return true;
    current = current->next;
  } while (current != head);
  return false;
}
`,
    reverse: `
void reverse() {
  if (head == NULL || head->next == head) return;
  struct Node* current = head;
  struct Node* temp = NULL;
  
  do {
    temp = current->prev;
    current->prev = current->next;
    current->next = temp;
    current = current->prev;
  } while (current != head);
  
  head = temp->prev;
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
  Node* prev;
  Node(int val) : value(val), next(nullptr), prev(nullptr) {}
};

class CircularDoublyLinkedList {
public:
  Node* head;
  CircularDoublyLinkedList() : head(nullptr) {}
`,
    addHead: `
  void addHead(int value) {
    Node* newNode = new Node(value);
    if (!head) {
      newNode->next = newNode;
      newNode->prev = newNode;
      head = newNode;
    } else {
      Node* tail = head->prev;
      newNode->next = head;
      newNode->prev = tail;
      head->prev = newNode;
      tail->next = newNode;
      head = newNode;
    }
  }
`,
    addTail: `
  void addTail(int value) {
    if (!head) {
      addHead(value);
      return;
    }
    Node* newNode = new Node(value);
    Node* tail = head->prev;
    newNode->next = head;
    newNode->prev = tail;
    tail->next = newNode;
    head->prev = newNode;
  }
`,
    addAtIndex: `
  void addAtIndex(int index, int value) {
    if (index == 0) {
      addHead(value);
      return;
    }
    Node* current = head;
    for (int i = 0; i < index - 1; ++i) {
      current = current->next;
      if (current == head) return;
    }
    Node* newNode = new Node(value);
    newNode->next = current->next;
    newNode->prev = current;
    current->next->prev = newNode;
    current->next = newNode;
  }
`,
    deleteHead: `
  void deleteHead() {
    if (!head) return;
    if (head->next == head) {
      delete head;
      head = nullptr;
    } else {
      Node* tail = head->prev;
      Node* temp = head;
      head = head->next;
      head->prev = tail;
      tail->next = head;
      delete temp;
    }
  }
`,
    deleteTail: `
  void deleteTail() {
    if (!head) return;
    if (head->next == head) {
      delete head;
      head = nullptr;
    } else {
      Node* tail = head->prev;
      Node* newTail = tail->prev;
      newTail->next = head;
      head->prev = newTail;
      delete tail;
    }
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
    for (int i = 0; i < index; ++i) {
      current = current->next;
      if (current == head) return;
    }
    current->prev->next = current->next;
    current->next->prev = current->prev;
    delete current;
  }
`,
    deleteByValue: `
  void deleteValue(int value) {
    if (!head) return;
    if (head->value == value) {
      deleteHead();
      return;
    }
    Node* current = head->next;
    while (current != head && current->value != value) {
      current = current->next;
    }
    if (current != head) {
      current->prev->next = current->next;
      current->next->prev = current->prev;
      delete current;
    }
  }
`,
    search: `
  bool search(int value) {
    if (!head) return false;
    Node* current = head;
    do {
      if (current->value == value) return true;
      current = current->next;
    } while (current != head);
    return false;
  }
`,
    reverse: `
  void reverse() {
    if (!head || head->next == head) return;
    Node* current = head;
    Node* temp = nullptr;
    
    do {
      temp = current->prev;
      current->prev = current->next;
      current->next = temp;
      current = current->prev;
    } while (current != head);
    
    head = temp->prev;
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
  Node prev;

  Node(int value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class CircularDoublyLinkedList {
  Node head;
`,
    addHead: `
  public void addHead(int value) {
    Node newNode = new Node(value);
    if (head == null) {
      newNode.next = newNode;
      newNode.prev = newNode;
      head = newNode;
    } else {
      Node tail = head.prev;
      newNode.next = head;
      newNode.prev = tail;
      head.prev = newNode;
      tail.next = newNode;
      head = newNode;
    }
  }
`,
    addTail: `
  public void addTail(int value) {
    if (head == null) {
      addHead(value);
      return;
    }
    Node newNode = new Node(value);
    Node tail = head.prev;
    newNode.next = head;
    newNode.prev = tail;
    tail.next = newNode;
    head.prev = newNode;
  }
`,
    addAtIndex: `
  public void addAtIndex(int index, int value) {
    if (index == 0) {
      addHead(value);
      return;
    }
    Node current = head;
    for (int i = 0; i < index - 1; i++) {
      current = current.next;
      if (current == head) return;
    }
    Node newNode = new Node(value);
    newNode.next = current.next;
    newNode.prev = current;
    current.next.prev = newNode;
    current.next = newNode;
  }
`,
    deleteHead: `
  public void deleteHead() {
    if (head == null) return;
    if (head.next == head) {
      head = null;
    } else {
      Node tail = head.prev;
      head = head.next;
      head.prev = tail;
      tail.next = head;
    }
  }
`,
    deleteTail: `
  public void deleteTail() {
    if (head == null) return;
    if (head.next == head) {
      head = null;
    } else {
      Node tail = head.prev;
      Node newTail = tail.prev;
      newTail.next = head;
      head.prev = newTail;
    }
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
    for (int i = 0; i < index; i++) {
      current = current.next;
      if (current == head) return;
    }
    current.prev.next = current.next;
    current.next.prev = current.prev;
  }
`,
    deleteByValue: `
  public void deleteValue(int value) {
    if (head == null) return;
    if (head.value == value) {
      deleteHead();
      return;
    }
    Node current = head.next;
    while (current != head && current.value != value) {
      current = current.next;
    }
    if (current != head) {
      current.prev.next = current.next;
      current.next.prev = current.prev;
    }
  }
`,
    search: `
  public boolean search(int value) {
    if (head == null) return false;
    Node current = head;
    do {
      if (current.value == value) return true;
      current = current.next;
    } while (current != head);
    return false;
  }
`,
    reverse: `
  public void reverse() {
    if (head == null || head.next == head) return;
    Node current = head;
    Node temp = null;
    
    do {
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev;
    } while (current != head);
    
    head = temp.prev;
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
  addHead: { best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" },
  addTail: { best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" }, // CDLL magic: O(1) tail access
  addAtIndex: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  deleteHead: { best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" },
  deleteTail: { best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" }, // CDLL magic
  deleteAtIndex: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  deleteByValue: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  search: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  reverse: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
  swap: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" }
};

/**
 * A utility function to create a delay.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Main Component ---
export default function CircularDoublyLinkedListVisualizer() {
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  const [index2, setIndex2] = useState("");
  const [randomSize, setRandomSize] = useState("5");
  
  const [language, setLanguage] = useState("python");
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Create a new circular doubly linked list.");
  const [executionLog, setExecutionLog] = useState([]);
  const [highlightLineNum, setHighlightLineNum] = useState(-1);
  const [currentOperation, setCurrentOperation] = useState('base');
  
  // Frame-based Animation State
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
  
  // Playback Engine
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
  
  const cloneList = (lst) => lst.map(n => ({...n}));
  
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
        
        f.push({ list: cloneList(currList), status: `Adding ${val} to HEAD...`, log: currLog });
        
        const newNode = { value: val, id: uuidv4(), state: 'found' };
        currList = [newNode, ...currList];
        f.push({ list: cloneList(currList), status: `Added ${val} to HEAD. Updating circular links.`, log: currLog });
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Added ${val} to HEAD successfully.`, log: currLog });
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
        
        if (currList.length === 0) {
            f.push({ list: cloneList(currList), status: `List empty. Adding to HEAD instead.`, log: currLog });
            currList.push({ value: val, id: uuidv4(), state: 'found' });
        } else {
            // O(1) Access to tail in CDLL!
            currList[currList.length - 1].state = 'visiting';
            f.push({ list: cloneList(currList), status: `O(1) Access to TAIL (head.prev)...`, log: currLog });
            
            currList[currList.length - 1].state = 'default';
            const newNode = { value: val, id: uuidv4(), state: 'found' };
            currList = [...currList, newNode];
            f.push({ list: cloneList(currList), status: `Adding ${val} to TAIL. Linking Prev/Next circularly...`, log: currLog });
        }
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Added ${val} to TAIL successfully.`, log: currLog });
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
        f.push({ list: cloneList(currList), status: `Inserted ${val} at index ${idx}. Linking Prev/Next.`, log: currLog });
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Inserted ${val} at index ${idx} successfully.`, log: currLog });
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
        
        currList[0].state = 'deleting';
        f.push({ list: cloneList(currList), status: `Deleting HEAD... Updating circular links.`, log: currLog });
        
        currList = currList.slice(1);
        f.push({ list: cloneList(currList), status: `Deleted HEAD node.`, log: currLog });
        
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Deleted HEAD node successfully.`, log: currLog });
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
        
        // O(1) Access for CDLL!
        currList[currList.length - 1].state = 'deleting';
        f.push({ list: cloneList(currList), status: `O(1) Access to TAIL (head.prev)... Deleting.`, log: currLog });
        
        currList = currList.slice(0, -1);
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Deleted TAIL node successfully.`, log: currLog });
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
            state: (i === idx - 1 || i === idx + 1) ? 'pre-op' : (i === idx ? 'deleting' : 'default')
        }));
        f.push({ list: cloneList(currList), status: `Deleting node at index ${idx}... Connecting Prev to Next circularly.`, log: currLog });
        
        currList = currList.filter((_, i) => i !== idx);
        currList = currList.map(n => ({...n, state: 'default'}));
        f.push({ list: cloneList(currList), status: `Deleted node at index ${idx} successfully.`, log: currLog });
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
            currList[0].state = 'deleting';
            f.push({ list: cloneList(currList), status: `Deleting node...`, log: currLog });
            currList = currList.slice(1);
        } else {
            currList = currList.map((n, i) => ({
                ...n,
                state: (i === foundIndex - 1 || i === foundIndex + 1) ? 'pre-op' : (i === foundIndex ? 'deleting' : 'default')
            }));
            f.push({ list: cloneList(currList), status: `Deleting node at index ${foundIndex}... Connecting Prev to Next.`, log: currLog });
            currList = currList.filter((_, i) => i !== foundIndex);
        }
        
        currList = currList.map(n => ({...n, state: 'default'}));
        currLog = [...currLog, `Deleted node with value ${val}.`];
        f.push({ list: cloneList(currList), status: `Deleted node at index ${foundIndex} successfully.`, log: currLog });
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
            f.push({ list: cloneList(currList), status: `Value ${val} not found in the list.`, log: currLog });
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
        let currLog = [...executionLog, `Starting Circular List reversal`];
        f.push({ list: cloneList(currList), status: "Initialize pointers for traversal", log: currLog });

        const applyPointers = (lst, t, c) => {
            return lst.map((node, idx) => {
                const ptrs = [];
                if (idx === t) ptrs.push('temp');
                if (idx === c) ptrs.push('curr');
                return { ...node, pointers: ptrs };
            });
        };

        let N = currList.length;

        for (let i = 0; i < N; i++) {
            let currIdx = i;
            let tempIdx = i === 0 ? N - 1 : 0; // In circular, prev of head is tail initially
            
            // Step 1: Assign curr
            currList = applyPointers(currList, tempIdx, currIdx);
            currList = currList.map((n, idx) => ({ ...n, state: idx === currIdx ? 'visiting' : 'default' }));
            currLog = [...currLog, `curr = ${currList[currIdx].value}`];
            f.push({ list: cloneList(currList), status: `curr = current node`, log: currLog });

            // Step 2: Swap Prev and Next
            if (i > 0) {
                let nodeToMove = currList.splice(currIdx, 1)[0];
                nodeToMove.state = 'found';
                currList.unshift(nodeToMove);
                
                currList = applyPointers(currList, 1, 0); 
                currLog = [...currLog, `Swapped prev and next for node ${nodeToMove.value}`];
                f.push({ list: cloneList(currList), status: `Swapped curr.prev and curr.next`, log: currLog });
            } else {
                currList[0].state = 'found';
                currLog = [...currLog, `Swapped prev and next for node ${currList[0].value}`];
                f.push({ list: cloneList(currList), status: `Swapped curr.prev and curr.next`, log: currLog });
            }
        }
        
        currList = currList.map(n => ({...n, pointers: [], state: 'default'}));
        currLog = [...currLog, `Circular List reversal complete.`];
        f.push({ list: cloneList(currList), status: `Circular List reversal complete.`, log: currLog });
        return f;
    });
  };

  // --- Operation: Swap ---
  const handleSwap = () => {
    let idx1 = parseInt(index);
    let idx2 = parseInt(index2);
        
    if (isNaN(idx1) || isNaN(idx2) || idx1 < 0 || idx2 < 0) {
        setError("Please enter valid, non-negative numbers for both 'Index 1' and 'Index 2'.");
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

        // Swap operation values
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
    setStatus("Create a new circular doubly linked list.");
    setHighlightLineNum(-1);
    setCurrentOperation('base');
    setExecutionLog([]);
  };
  
  const handleGenerateRandom = () => {
    const size = parseInt(randomSize);
    // Updated upper limit to 25 as requested
    if (isNaN(size) || size <= 0 || size > 25) {
      setError("Please enter a valid size (1-25) for the random list.");
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
    setStatus(`Generated a random list of ${size} nodes.`);
    setHighlightLineNum(-1);
    setCurrentOperation('base');
    setExecutionLog([`Generated random list of ${size} nodes.`]);
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

  // --- Circular Layout Calculations ---
  const N = list.length;
  // Dynamic radius prevents overlapping when there are many nodes (max 25)
  const R = Math.max(130, (N * 85) / (2 * Math.PI));
  const Size = R * 2 + 180; // Add padding around the circle
  const CX = Size / 2;
  const CY = Size / 2;
  
  const svgPaths = [];
  if (N > 0) {
    for (let i = 0; i < N; i++) {
      const next_i = (i + 1) % N;
      const theta_A = -Math.PI / 2 + i * (2 * Math.PI / N);
      // If N=1, force the end angle to wrap around for a full circular self-loop
      const theta_B = N === 1 ? theta_A + 2 * Math.PI : -Math.PI / 2 + next_i * (2 * Math.PI / N);

      // --- NEXT POINTER (Cyan, Outer Curve) ---
      const R_next = R + 22;
      const delta_next = 38 / R_next; // Angle offset to start outside the 64px box
      const th1_next = theta_A + delta_next;
      const th2_next = theta_B - delta_next;
      
      const x1_n = CX + R_next * Math.cos(th1_next);
      const y1_n = CY + R_next * Math.sin(th1_next);
      const x2_n = CX + R_next * Math.cos(th2_next);
      const y2_n = CY + R_next * Math.sin(th2_next);
      
      const large_arc_next = N === 1 ? 1 : 0;
      
      svgPaths.push(
          <path 
              key={`next-${i}`}
              d={`M ${x1_n} ${y1_n} A ${R_next} ${R_next} 0 ${large_arc_next} 1 ${x2_n} ${y2_n}`}
              stroke="var(--cyan-500)"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrow-next)"
          />
      );

      // --- PREV POINTER (Purple, Inner Curve) ---
      const R_prev = R - 22;
      const delta_prev = 38 / R_prev;
      // Logical prev goes from B back to A, so we draw from B to A counter-clockwise
      const th1_prev = (N === 1 ? theta_A + 2 * Math.PI : theta_B) - delta_prev;
      const th2_prev = theta_A + delta_prev;
      
      const x1_p = CX + R_prev * Math.cos(th1_prev);
      const y1_p = CY + R_prev * Math.sin(th1_prev);
      const x2_p = CX + R_prev * Math.cos(th2_prev);
      const y2_p = CY + R_prev * Math.sin(th2_prev);
      
      const large_arc_prev = N === 1 ? 1 : 0;

      svgPaths.push(
          <path 
              key={`prev-${i}`}
              d={`M ${x1_p} ${y1_p} A ${R_prev} ${R_prev} 0 ${large_arc_prev} 0 ${x2_p} ${y2_p}`}
              stroke="var(--purple-500)"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrow-prev)"
          />
      );
    }
  }

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {/* --- Controls Sidebar --- */}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title">
          <List size={30} />
          Circular Doubly Linked List
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
          <label htmlFor="index2">Index 2 (For Swap Operation)</label>
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
            max="25"
            placeholder="Size"
            value={randomSize}
            onChange={(e) => setRandomSize(e.target.value)}
            disabled={isVisualizing}
            className="input-field"
            style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}
            title="Random List Size (Max 25)"
          />
          <button onClick={handleGenerateRandom} disabled={isVisualizing} className="btn btn-cyan">
            <Shuffle size={18} /> Generate Random
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
            <option value="c">C</option>
            <option value="cpp">C++</option>
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
          
          {}
          <div className="circular-container">
            {list.length === 0 && <span style={{color: 'var(--text-gray-500)'}}>List is empty.</span>}
            
            {list.length > 0 && (
              <React.Fragment>
                <div className="legend-container">
                  <div className="legend-item"><div className="legend-color" style={{backgroundColor: 'var(--cyan-500)'}}></div> Next Pointer</div>
                  <div className="legend-item"><div className="legend-color" style={{backgroundColor: 'var(--purple-500)'}}></div> Prev Pointer</div>
                </div>
                
                <div className="circular-canvas" style={{ width: Size, height: Size }}>
                  {/* Background SVG Canvas for curved bidirectional arrows */}
                  <svg width={Size} height={Size} viewBox={`0 0 ${Size} ${Size}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                    <defs>
                      <marker id="arrow-next" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L9,3 z" fill="var(--cyan-500)" />
                      </marker>
                      <marker id="arrow-prev" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L9,3 z" fill="var(--purple-500)" />
                      </marker>
                    </defs>
                    {svgPaths}
                  </svg>
                  
                  {/* HTML nodes mapped perfectly onto SVG path curves using Trig */}
                  {list.map((node, i) => {
                    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / N;
                    const x = CX + R * Math.cos(theta);
                    const y = CY + R * Math.sin(theta);
                    
                    return (
                      <div 
                        key={node.id} 
                        className="node-absolute-wrapper"
                        style={{ left: `${x}px`, top: `${y}px` }}
                      >
                        {i === 0 && <span className="label-absolute-top">HEAD</span>}
                        {i === list.length - 1 && <span className="label-absolute-top" style={{color: 'var(--purple-400)', top: (i === 0) ? '-44px' : '-24px'}}>TAIL</span>}
                        
                        <div className={`box ${node.state}`}>
                          {node.value}
                        </div>
                        
                        <span className="label-absolute-bottom">[{i}]</span>
                        
                        {node.pointers && node.pointers.length > 0 && (
                          <div className="pointers-absolute">
                            {node.pointers.map(p => (
                              <span key={p} className={`pointer-badge ${p}`}>
                                &uarr; {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
          {/* --- Code Area --- */}
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