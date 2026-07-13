import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

import DSAVisualizer from "./components/DSAVisualizer";
import Navbar from "./components/Navbar";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import LinearSearch from "./components/Search/LinearSearch";
import BinarySearchVisualizer from "./components/Search/BinarySearchVisualizer";
import BubbleSort from "./components/Sorting/BubbleSort";
import InsertionSort from "./components/Sorting/InsertionSort";
import MergeSort from "./components/Sorting/MergeSort";
import QuickSort from "./components/Sorting/QuickSort";
import SinglyLinkedList from "./components/LinkedList/SinglyLinkedList";
import CircularSinglyLinkedList from "./components/LinkedList/CircularLinkedList";
import DoublyLinkedList from "./components/LinkedList/DoublyLinkedList";
import CircularDoublyLinkedListVisualizer from "./components/LinkedList/CircularDoublyLinkedList";
import Stack from "./components/Stack/Stack";
import Queue from "./components/Queue/Queue";
import BST from "./components/Trees/BST";
import AVLTreeVisualizer from "./components/Trees/AVL";
import BFSDFS from "./components/BFS-DFS/bfsdfs";
import HeapVisualizer from "./components/Search/heap";
import HashTableVisualizer from "./components/HashTable/hashing";
import TrieVisualizer from "./components/Trees/Trie";
import UserAccount from "./components/UserAccount";
function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/" element={<DSAVisualizer />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* protected: wrap routes you want only authenticated users to access */}
        <Route
          path="/useraccount"
          element={
            <RequireAuth>
              <UserAccount />
            </RequireAuth>
          }
        />
        <Route
          path="/binarysearch"
          element={
            <RequireAuth>
              <BinarySearchVisualizer />
            </RequireAuth>
          }
        />
        <Route
          path="/linearserach"
          element={
            <RequireAuth>
              <LinearSearch />
            </RequireAuth>
          }
        />
        <Route
          path="/bubblesort"
          element={
            <RequireAuth>
              <BubbleSort />
            </RequireAuth>
          }
        />
        <Route
          path="/insertionsort"
          element={
            <RequireAuth>
              <InsertionSort />
            </RequireAuth>
          }
        />
        <Route
          path="/mergesort"
          element={
            <RequireAuth>
              <MergeSort />
            </RequireAuth>
          }
        />
        <Route
          path="/quicksort"
          element={
            <RequireAuth>
              <QuickSort />
            </RequireAuth>
          }
        />
        <Route
          path="/singlylinkedlist"
          element={
            <RequireAuth>
              <SinglyLinkedList />
            </RequireAuth>
          }
        />
        <Route
          path="/circularsinglylinkedlist"
          element={
            <RequireAuth>
              <CircularSinglyLinkedList/>
            </RequireAuth>
          }
        />
        <Route
          path="/circulardoublylinkedlist"
          element={
            <RequireAuth>
              <CircularDoublyLinkedListVisualizer />
            </RequireAuth>
          }
        />
        <Route
          path="/doublylinkedlist"
          element={
            <RequireAuth>
              <DoublyLinkedList />
            </RequireAuth>
          }
        />
        <Route
          path="/stack"
          element={
            <RequireAuth>
              <Stack />
            </RequireAuth>
          }
        />
        <Route
          path="/queue"
          element={
            <RequireAuth>
              <Queue />
            </RequireAuth>
          }
        />
        <Route
          path="/bst"
          element={
            <RequireAuth>
              <BST />
            </RequireAuth>
          }
        />
        <Route
          path="/avl"
          element={
            <RequireAuth>
              <AVLTreeVisualizer />
            </RequireAuth>
          }
        />
        <Route
          path="/bfsdfs"
          element={
            <RequireAuth>
              <BFSDFS/>
            </RequireAuth>
          }
        />
        <Route
          path="/heap"
          element={
            <RequireAuth>
              <HeapVisualizer/>
            </RequireAuth>
          }
        />
        <Route
          path="/hashing"
          element={
            <RequireAuth>
              <HashTableVisualizer/>
            </RequireAuth>
          }
        />
        <Route
          path="/trie"
          element={
            <RequireAuth>
              <TrieVisualizer/>
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
