// DSAVisualizer.jsx
import React from "react";
import { Link } from "react-router-dom"; 

export default function DSAVisualizer() {
  const topics = [
    { name: "Linear Search", href: "./linearserach" },
    { name: "Binary Search", href: "./binarysearch" },
    { name: "Bubble Sort", href: "/bubblesort" },
    { name: "Insertion Sort", href: "/insertionsort" },
    { name: "Quick Sort", href: "/quicksort" },
    { name: "Merge Sort", href: "/mergesort" },
    { name: "Singly LinkedList", href: "singlylinkedlist" },
    { name: "Doubly LinkedList", href: "doublylinkedlist" },
    { name: "Stack", href: "stack" },
    { name: "Queue", href: "queue" },
    { name: "Binary Search Tree", href: "bst" },
    { name: "DFS & BFS", href: "#" },
  ];

  return (
    <div className="wrapper">

      <main className="topics-container">
        {topics.map((t) => (
          <Link key={t.name} to={t.href} className="topic-card">
            {t.name}
          </Link>
        ))}
      </main>

      
    </div>
  );
}
