// ConceptVisualizer.jsx
import React from "react";
import { href, Link } from "react-router-dom"; 

export default function ConceptVisualizer() {
  const topics = [
    { name: "Two Pointer", href: "/twopointer" },
    { name: "Sliding Window", href: "#" },
    { name: "Prefix & Suffix", href: "#" },
    { name: "Greedy Algorithm", href: "#" },
    { name: "Recursion", href: "#" },
    { name: "Backtracking", href: "#" },
    { name: "Divide and Conquer", href: "#" },
    { name: "Dynamic Programming", href: "#" },
    { name: "Bit Manipulation", href: "#" },
    { name: "Monotonic Stack", href: "#" },
    { name: "Monotonic Queue", href: "#" },
    { name: "Matrix Algorithms", href: "#" },
    { name: "Mathematical Algorithms", href: "#" },
    { name: "Number Theory", href: "#" },
    { name: "Game Theory", href: "#" },
    { name: "Interval Problems", href: "#" },
    { name: "Kadane's Algorithm", href: "#" },
    { name: "Floyd Cycle Detection", href: "#" },
    { name: "Fast & Slow Pointer", href: "#" },
    { name: "Frequency Counting", href: "#" },
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
