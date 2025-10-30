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
import DoublyLinkedList from "./components/LinkedList/DoublyLinkedList";
import Stack from "./components/Stack/Stack";
import Queue from "./components/Queue/Queue";
import BST from "./components/Trees/BST";
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
      </Routes>
    </AuthProvider>
  );
}

export default App;
